import { axiosInstance } from "@/axios";
import { pusherClient } from "@/lib/pusher";
import React, { useEffect, useState } from "react";

interface MessageBody {
  text: string;
  senderId: string;
  senderName: string;
  issueId: string;
  timestamp: string;
}

const Messages = () => {
  const [messages, setMessages] = useState<MessageBody[]>([]);

  useEffect(() => {
    const handleMessage = (message: MessageBody) => {
      console.log(message);
      setMessages((prev) => [...prev, message]);
    };

    pusherClient.subscribe("chat");
    pusherClient.bind("incoming-message", handleMessage);
  }, []);

  return (
    <div>
      {messages.map((message, id) => (
        <div key={id}>{message.text}</div>
      ))}
    </div>
  );
};

const chat = () => {
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = async () => {
    if (!newMessage) return;
    await axiosInstance.post(`/chat/sendMessage`, {
      text: newMessage,
    });
    setNewMessage("");
  };
  return (
    <main>
      <Messages />
      <input
        type="text"
        value={newMessage}
        className="border-2 border-black"
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
      />
      <button onClick={sendMessage} className="border-2 border-black">
        Send
      </button>
    </main>
  );
};

export default chat;
