import { axiosInstance } from "@/axios";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { notFound } from "next/navigation";
import { pusherClient } from "@/lib/pusher";
import ChatInput from "./ChatInput";
import { useSession } from "next-auth/react";

const Chat = ({ issueId }) => {
  const session = useSession();

  console.log(issueId);

  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([]);

  const sendMessage = async (event) => {
    event.preventDefault();

    try {
      const message = {
        text: input,
        sender: session.data?.user.user._id,
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

  useEffect(() => {
    getParticipants();

    const handleNewMessage = (message) => {
      setMessages((prev) => {
        const oldArray = [...prev];
        oldArray.push(message);
        console.log(message.text);
        console.log(prev);
        // prev.push(message.text);
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

  return (
    <div className="w-full">
      <div className="h-[calc(100vh-90px)] w-full">
        {messages.length > 0 ? (
          <div>
            {messages.map((message, id) => (
              <div>{message.text}</div>
            ))}
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
