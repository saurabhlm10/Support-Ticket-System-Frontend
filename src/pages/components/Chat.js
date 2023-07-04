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
import axios, { AxiosError } from "axios";
import Link from "next/link";
import fileDownload from "js-file-download";

const Chat = ({ issueId }) => {
  const session = useSession();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const [showFileModal, setShowFileModal] = useState(false);

  const scrollDownRef = useRef(null);
  const fileRef = useRef(null);
  const sendButtonRef = useRef(null);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (showFileModal) return sendFile();
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
      // await fetchRedis(
      //   "zadd",
      //   `chat:${issueId}:messages`,
      //   timestamp,
      //   JSON.stringify(message)
      // );

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
    reader.readAsDataURL(fileRef.current.files[0]);
    reader.onload = async () => {
      const formData = new FormData();

      formData.append("file", fileRef.current.files[0]);
      formData.append("filename", fileRef.current.files[0].name);
      formData.append("issueId", issueId);
      formData.append("senderId", session.data?.user.user._id);
      formData.append("senderName", session.data?.user.user.name);
      formData.append("timestamp", Date.now());

      try {
        await axiosInstance.post("/chat/sendFile", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        fileRef.current.value = null;
      } catch (error) {
        console.log(error);
        toast.error("Something Went Wrong");
      } finally {
        setShowFileModal(false);
      }
    };
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

        setMessages(dbMessages);
      }
    } catch (error) {
      toast.error("Error Fetching Messages");
      console.log(error);
    }
  };

  useEffect(() => {
    getMessages();

    const handleNewMessage = (message) => {
      setMessages((prev) => {
        const oldArray = [...prev];
        oldArray.push(message);
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
      setShowFileModal(false)
      
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

  // const handleDownload = (url, filename) => {
  //   console.log(url);
  //   axios
  //     .get(url, {
  //       responseType: "blob",
  //     })
  //     .then((res) => {
  //       fileDownload(res.data, filename);
  //     });
  // };

  return (
    <div className="w-full">
      <div className="h-[calc(100vh-90px)] w-full overflow-y-scroll	border-2 border-black">
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
                        {"filename" in message ? (
                          <div className="flex flex-row items-center gap-3">
                            <Link
                              href={message.path.join("/")}
                              download
                              target="_blank"
                              className="py-1 text-2xl flex flex-row items-center gap-2"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                                />
                              </svg>

                              {message.filename}
                            </Link>
                            {/* <button
                              className="border-2 rounded-full p-1"
                              onClick={() => {
                                handleDownload(
                                  message.path.join("/"),
                                  message.filename
                                );
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-6 h-6"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                                />
                              </svg>
                            </button> */}
                          </div>
                        ) : (
                          message.text
                        )}{" "}
                        <span className="ml-2 text-xs text-gray-400jscnsjcnc">
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
        {showFileModal && (
          <FileModal fileRef={fileRef} setShowFileModal={setShowFileModal} />
        )}
        <div ref={scrollDownRef} />
      </div>
      <form action="" className="w-full flex" onSubmit={sendMessage}>
        {/* <div className="flex"> */}
        <input
          value={input}
          type="text"
          className="h-8 flex-1 border-2"
          disabled={showFileModal}
          onChange={(e) => setInput(e.target.value)}
        />
        <label className="cursor-pointer w-1/12 md:w-8 flex items-center justify-center bg-blue-300 ">
          <input
            type="file"
            className="hidden "
            onChange={() => {
              setShowFileModal(true);
              sendButtonRef.current.focus();
            }}
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
          className="h-8 px-5 bg-black text-white border-2 border-black outline-double"
          ref={sendButtonRef}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;

const FileModal = ({ fileRef, setShowFileModal }) => {
  return (
    <div className="fixed bottom-0 border-2 border-yellow-300 bg-blue-700 text-white w-1/2 rounded-t-lg p-2">
      <div className="flex flex-row items-center gap-4 text-2xl pb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
          />
        </svg>
        <div>{fileRef.current.files[0].name}</div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6 ml-auto cursor-pointer"
          onClick={() => {
            fileRef.current.value = null;
            setShowFileModal(false);
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <div className="text-xs">* We Recommend Using Videos and Images</div>
    </div>
  );
};
