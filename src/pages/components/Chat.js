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

const Chat = ({ issueId }) => {
  const session = useSession();

  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([]);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!input) return;

    try {
      const message = {
        text: input,
        senderId: session.data?.user.user._id,
        senderName: session.data?.user.user.name,
        issueId,
      };
      await axiosInstance.post(`/chat/sendMessage`, message);

      setInput("");
    } catch (error) {
      toast.error("Something Went Wrong");
      console.log(error);
    }
  };

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

        setMessages(dbMessages)
      }

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getMessages()
    getParticipants();

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
              // <div>
              //   {/* {JSON.stringify(message)} */}
              //   <span>{message.senderName}: </span>
              //   <span>{message.text}</span>
              // </div>
              return (
                <div
                  className={cn("chat-message flex flex-col", {
                    // "order-1 items-end": isCurrentUser,
                    // "order-2 items-start": !isCurrentUser,
                    "order-1 items-end": isCurrentUser,
                    "order-2 items-start": !isCurrentUser,
                  })}
                  // key={`${message.id}-${message.timestamp}`}
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
      </div>
      <form action="" className="w-full" onSubmit={sendMessage}>
        <input
          value={input}
          type="text"
          className="h-8 w-5/6 border-2 border-black"
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="h-8 w-1/6 bg-black text-white border-2 border-black"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
