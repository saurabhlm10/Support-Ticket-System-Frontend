import { axiosInstance } from "@/axios";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { notFound } from "next/navigation";
import { pusherClient } from "@/lib/pusher";
import ChatInput from "./ChatInput";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fetchRedis } from "../../helpers/fetchRedis";
import { AxiosError } from "axios";

const Chat = ({ issueId }) => {
  const session = useSession();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const scrollDownRef = useRef(null);
  const fileRef = useRef(null);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!input) return;

    if (!issueId) return toast.error("Issue ID missing");
    if (!session) return toast.error("Session missing");

    try {
      const timestamp = Date.now();

      const message = {
        text: input,
        senderId: session.data?.user.user._id,
        senderName: session.data?.user.user.name,
        issueId,
        timestamp,
      };

      await axiosInstance.post(`/chat/sendMessage`, message);
      await fetchRedis(
        "zadd",
        `chat:${issueId}:messages`,
        timestamp,
        JSON.stringify(message)
      );

      setInput("");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error("Message Not Sent");
      }

      toast.error("Something Went Wrong");
      console.log(error);
    }
  };

  const sendFile = (e) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = async () => {
      console.log(reader.result)
      console.log(e.target.files[0].name)
      const formData = new FormData();

      formData.append('file', e.target.files[0])
      formData.append('filename', e.target.files[0].name)
      formData.append('issueId', issueId)
      formData.append('senderId', session.data?.user.user._id)
      formData.append('senderName', session.data?.user.user.name)

      try {

        await axiosInstance.post('/chat/sendFile', formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })

        fileRef.current.value = null;

      } catch (error) {
        console.log(error)
        toast.error('Something Went Wrong')
      }
    };

  }

  const getParticipants = async () => {
    try {
      const response = await axiosInstance.get(`/chat/getChat/${issueId}`);
    } catch (error) {
      toast.error("Cannot Get Participants");
      console.log(error);
    }
  };

  const getMessages = async () => {
    try {
      const results = await fetchRedis(
        "zrange",
        `chat:${issueId}:messages`,
        0,
        -1
      );

      if (results) {
        const dbMessages = results.map((message) => JSON.parse(message));

        setMessages(dbMessages);
      }
    } catch (error) {
      toast.error('Error Fetching Messages')
      console.log(error);
    }
  };

  useEffect(() => {
    getMessages();

    const handleNewMessage = (message) => {
      setMessages((prev) => {
        const oldArray = [...prev];
        oldArray.push(message);
        console.log(message);
        return [...oldArray];
      });
    };

    pusherClient.subscribe(issueId);
    pusherClient.bind("incoming-message", handleNewMessage);

    return () => {
      pusherClient.unsubscribe(issueId);
      pusherClient.unbind("incoming-message", handleNewMessage);
      setMessages([]);
      setInput("");
    };
  }, [issueId]);

  useEffect(() => {
    const divUnderMessages = scrollDownRef.current;
    if (divUnderMessages) {
      divUnderMessages.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  const formatTimestamp = (timestamp) => {
    return format(timestamp, "HH:mm");
  };

  return (
    <div className="w-full">
      <div className="h-[calc(100vh-90px)] w-full overflow-y-scroll	">
        {messages.length > 0 ? (
          <div>
            {messages.map((message, id) => {
              const isCurrentUser =
                message.senderId === session.data?.user.user._id;

              const hasNextMessageFromSameUser =
                messages[id + 1]?.senderId === messages[id].senderId;
              return (
                <div
                  className={cn("chat-message flex flex-col mt-[2px]", {
                    "order-1 items-end": isCurrentUser,
                    "order-2 items-start": !isCurrentUser,
                  })}
                  key={id}
                >
                  <div
                    className={cn("flex items-end", {
                      "justify-end": isCurrentUser,
                    })}
                  >
                    <div
                      className={cn(
                        "flex flex-col space-y-2 text-base max-w-xs mx-2",
                        {
                          "order-1 items-end": isCurrentUser,
                          "order-2 items-start": !isCurrentUser,
                        }
                      )}
                    >
                      <span
                        className={cn("px-4 py-2 rounded-lg inline-block", {
                          "bg-indigo-600 text-white": isCurrentUser,
                          "bg-gray-200 text-gray-900": !isCurrentUser,
                          "rounded-br-none":
                            !hasNextMessageFromSameUser && isCurrentUser,
                          "rounded-bl-none":
                            !hasNextMessageFromSameUser && !isCurrentUser,
                        })}
                      >
                        {message.text}{" "}
                        <span className="ml-2 text-xs text-gray-400">
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div
                    className={cn("relative h-6", {
                      "order-2": isCurrentUser,
                      "order-1": !isCurrentUser,
                      hidden: hasNextMessageFromSameUser,
                    })}
                  >
                    {message.senderName}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div>No Messages To Show</div>
        )}
        <div ref={scrollDownRef} />
      </div>
      <form action="" className="w-full flex" onSubmit={sendMessage}>
        {/* <div className="flex"> */}

        <input
          value={input}
          type="text"
          className="h-8 flex-1 border-2"
          onChange={(e) => setInput(e.target.value)}
        />
        <label className="cursor-pointer w-1/12 md:w-8 flex items-center justify-center bg-blue-300 " >
          <input
            type="file"
            className="hidden "
            onChange={sendFile}
            ref={fileRef}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="black"
            className=" h-7 p-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
            />
          </svg>
        </label>
        {/* </div> */}

        <button
          type="submit"
          className="h-8 px-5 bg-black text-white border-2 border-black"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
