import { axiosInstance } from "@/axios";
import {
  FC,
  FormEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import { pusherClient } from "@/lib/pusher";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { AxiosError } from "axios";
import Link from "next/link";
import LoadingIcon from "public/icons/loading.svg";
import Image from "next/image";
import { fetchRedis } from "@/helpers/fetchRedis";

interface ChatProps {
  issueId: string;
}

const Chat: FC<ChatProps> = ({ issueId }) => {
  const session = useSession();

  const [name, setName] = useState<string>("");

  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<MessageBody[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [showFileModal, setShowFileModal] = useState(false);

  const scrollDownRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const sendButtonRef = useRef<HTMLButtonElement>(null);

  const getNameOfUser = async (email: string) => {
    try {
      const response = await axiosInstance.get(`/agent/getAgent/${email}`);

      console.log(response.data.agent.name);

      setName(response.data.agent.name);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        return toast.error(error.response?.data.message);
      }
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (showFileModal) return sendFile();
    if (!input) return;

    if (!issueId) return toast.error("Issue ID missing");
    if (!session) return toast.error("Session missing");

    try {
      const timestamp = Date.now();

      const message = {
        text: input,
        senderEmail: session.data?.user?.email,
        senderName: name,
        issueId,
        timestamp,
      };

      await axiosInstance.post(`/chat/sendMessage`, message);
      setInput("");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error("Message Not Sent");
      }

      toast.error("Something Went Wrong");
      console.log(error);
    }
  };

  const sendFile = () => {
    setIsLoading(true);
    const reader = new FileReader();
    if (
      fileRef.current &&
      fileRef.current.files &&
      fileRef.current.files.length > 0
    ) {
      reader.readAsDataURL(fileRef.current.files[0]);
    }
    reader.onload = async () => {
      const formData = new FormData();

      const timestamp: string = String(Date.now());

      if (
        fileRef.current &&
        fileRef.current.files &&
        fileRef.current.files.length > 0
      ) {
        formData.append("file", fileRef.current.files[0]);
        formData.append("filename", fileRef.current.files[0].name);
        formData.append("issueId", issueId);
        formData.append("senderEmail", session.data?.user?.email!);
        formData.append("senderName", name);
        formData.append("timestamp", timestamp);
      }
      try {
        await axiosInstance.post("/chat/sendFile", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (
          fileRef.current &&
          fileRef.current.files &&
          fileRef.current.files.length > 0
        ) {
          fileRef.current.value = "";
        }
      } catch (error) {
        console.log(error);
        toast.error("Something Went Wrong");
      } finally {
        setIsLoading(false);
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
        "0",
        "-1"
      );

      if (results) {
        const dbMessages = results.map((message: string) =>
          JSON.parse(message)
        );

        setMessages(dbMessages);
      }
    } catch (error) {
      toast.error("Error Fetching Messages");
      console.log(error);
    }
  };

  useEffect(() => {
    if (session.data?.user?.email) {
      getNameOfUser(session.data?.user?.email);
    }
  }, [session.data]);

  useEffect(() => {
    getMessages();

    const handleNewMessage = (message: MessageBody) => {
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
      setShowFileModal(false);
    };
  }, [issueId]);

  useEffect(() => {
    const divUnderMessages = scrollDownRef.current;
    if (divUnderMessages) {
      divUnderMessages.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  const formatTimestamp = (timestamp: number) => {
    return format(timestamp, "HH:mm");
  };

  return (
    <div className="w-full">
      <div className="h-[calc(100vh-90px)] w-full overflow-y-scroll	border-2">
        {messages.length > 0 ? (
          <div>
            {messages.map((message, id) => {
              const isCurrentUser =
                message.senderEmail === session.data?.user?.email;

              const hasNextMessageFromSameUser =
                messages[id + 1]?.senderEmail === messages[id].senderEmail;
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
                              href={(message.path as string[]).join("/")}
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

                              {message.filename as string}
                            </Link>
                          </div>
                        ) : (
                          message.text
                        )}{" "}
                        <span className="ml-2 text-xs text-gray-400jscnsjcnc">
                          {formatTimestamp(Number(message.timestamp))}
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
              if (sendButtonRef.current) {
                sendButtonRef.current.focus();
              }
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
          {isLoading ? (
            <div className="grid place-content-center ">
              <Image
                alt="Loading"
                className="animate-spin text-white fill-white"
                src={LoadingIcon}
                width={24}
                height={24}
              />
            </div>
          ) : (
            "Send"
          )}
        </button>
      </form>
    </div>
  );
};

export default Chat;

interface FileModalProps {
  fileRef: MutableRefObject<HTMLInputElement | null>;
  setShowFileModal: any;
}

const FileModal: FC<FileModalProps> = ({ fileRef, setShowFileModal }) => {
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
        <div>
          {fileRef &&
            fileRef.current &&
            fileRef.current.files &&
            fileRef.current.files[0].name}
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6 ml-auto cursor-pointer"
          onClick={() => {
            if (fileRef && fileRef.current && fileRef.current.files) {
              fileRef.current.value = "";
            }
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
