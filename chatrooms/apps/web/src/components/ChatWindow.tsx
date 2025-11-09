import React, { useState, useEffect } from "react";
import { useSocket } from "../hooks/useSocket";
import { Send } from "lucide-react";
import dayjs from "dayjs";

interface Message {
  id: string;
  content: string;
  author: { username: string };
  createdAt: string;
  roomId: number;
}

export default function ChatWindow({
  roomId,
  username,
  onUsersChange,
}: {
  roomId: number;
  username: string;
  onUsersChange: (users: any[]) => void;
}) {
  const socket = useSocket("http://localhost:4000");
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");

  // 🟩 Load saved messages from backend
  useEffect(() => {
    fetch(`http://localhost:4000/api/rooms/${roomId}/messages`)
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("Failed to load messages:", err));
  }, [roomId]);

  // 🟩 Handle socket events (join, receive message, users)
  useEffect(() => {
    if (!socket.current) return;

    socket.current.emit("join_room", { username, roomId });

    socket.current.on("receive_message", (data) =>
      setMessages((prev) => [...prev, data])
    );

    socket.current.on("room_users", (users) => {
      onUsersChange(users);
    });

    return () => {
      socket.current?.off("receive_message");
      socket.current?.off("room_users");
    };
  }, [roomId]);

  // 🟩 Send message to server
  const sendMessage = () => {
    if (!message.trim()) return;
    socket.current?.emit("send_message", { roomId, username, content: message });
    setMessage("");
  };

  // 🟩 Group messages by date (Today, Yesterday, etc.)
  const renderMessages = () => {
    if (messages.length === 0)
      return (
        <p className="text-center text-gray-600 mt-20">
          No messages yet. Start chatting...
        </p>
      );

    return messages.reduce((acc: any, msg: any, index: number) => {
      const date = dayjs(msg.createdAt).format("YYYY-MM-DD");
      const prev =
        index > 0 ? dayjs(messages[index - 1].createdAt).format("YYYY-MM-DD") : null;
      const showDateHeader = date !== prev;

      if (showDateHeader) {
        const isToday = dayjs().isSame(date, "day");
        const isYesterday = dayjs().subtract(1, "day").isSame(date, "day");

        acc.push(
          <div key={`date-${date}`} className="text-center text-xs text-gray-500 my-3">
            {isToday ? "Today" : isYesterday ? "Yesterday" : dayjs(date).format("MMM D, YYYY")}
          </div>
        );
      }

      acc.push(
        <div
          key={msg.id}
          className={`mb-3 flex ${
            msg.author.username === username ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[70%] rounded-2xl p-3 shadow bubble ${
              msg.author.username === username
                ? "bg-[#dcf8c6] text-gray-900 rounded-br-none"
                : "bg-white text-gray-900 rounded-bl-none border border-emerald-100"
            }`}
          >
            <p className="text-sm">{msg.content}</p>
            <div className="text-xs opacity-70 mt-1 flex justify-between">
              <span>
                {msg.author.username === username ? "You" : msg.author.username}
              </span>
              <span>{dayjs(msg.createdAt).format("HH:mm")}</span>
            </div>
          </div>
        </div>
      );

      return acc;
    }, []);
  };

  return (
    <div className="flex flex-col flex-1 bg-[#ece5dd]">
      {/* 🟩 Header */}
      <div className="p-4 border-b bg-[#075e54] text-white flex justify-between items-center">
        <h2 className="text-lg font-semibold">Room {roomId}</h2>
        <span className="text-sm">Logged in as {username}</span>
      </div>

      {/* 🟩 Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">{renderMessages()}</div>

      {/* 🟩 Message Input */}
      <div className="p-3 border-t border-emerald-200 flex gap-2 bg-[#f0f0f0]">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border border-emerald-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-[#25d366] hover:bg-[#1ebe57] text-white p-2 rounded-full transition"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
