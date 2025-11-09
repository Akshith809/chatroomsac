import React, { useState } from "react";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";
import RoomUsers from "./components/RoomUsers";

export default function App() {
  const [username, setUsername] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<number | null>(null);
  const [users, setUsers] = useState<any[]>([]);

  // Ask for username once
  if (!username) {
    const name = prompt("Enter your username:");
    if (name && name.trim() !== "") setUsername(name.trim());
    return (
      <div className="flex items-center justify-center h-screen bg-[#e5ddd5] text-emerald-900">
        <h1 className="text-xl font-semibold">
          Please enter your username to continue 💬
        </h1>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#e5ddd5] text-emerald-900">
      {/* Left Sidebar */}
      <ChatList currentRoom={roomId} onSelectRoom={setRoomId} />

      {/* Middle Chat Window */}
      {roomId ? (
        <ChatWindow
          roomId={roomId}
          username={username}
          onUsersChange={setUsers}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-emerald-800 text-xl font-semibold">
          Select a Chatroom to start chatting 💬
        </div>
      )}

      {/* Right Sidebar */}
      <RoomUsers users={users} username={username} />
    </div>
  );
}
