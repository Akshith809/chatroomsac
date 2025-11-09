import React from "react";
import { MessageSquare } from "lucide-react";

const rooms = [
  { id: 1, name: "Chatroom 1" },
  { id: 2, name: "Chatroom 2" },
  { id: 3, name: "Chatroom 3" },
  { id: 4, name: "Chatroom 4" },
  { id: 5, name: "Chatroom 5" },
];

export default function ChatList({
  currentRoom,
  onSelectRoom,
}: {
  currentRoom: number | null;
  onSelectRoom: (id: number) => void;
}) {
  return (
    <div className="w-64 border-r border-emerald-200 bg-[#075e54] flex flex-col text-white">
      <div className="p-4 border-b border-emerald-600 flex items-center gap-2">
        <MessageSquare className="text-emerald-100" size={22} />
        <h2 className="text-lg font-semibold">Chat Rooms</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => {
              if (confirm(`Do you want to enter ${room.name}?`)) {
                onSelectRoom(room.id);
              }
            }}
            className={`w-full text-left px-4 py-3 border-b border-emerald-700 hover:bg-emerald-700 transition ${
              currentRoom === room.id ? "bg-emerald-600" : ""
            }`}
          >
            {room.name}
          </button>
        ))}
      </div>
    </div>
  );
}
