import React from "react";

export default function RoomUsers({ users }: { users: any[] }) {
  return (
    <div className="w-60 bg-[#075e54] text-white flex flex-col">
      <div className="p-4 border-b border-[#0c786a] font-semibold text-lg">
        Members ({users.length})
      </div>
      <div className="flex-1 overflow-y-auto">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-3 px-4 py-2 hover:bg-[#0c786a] transition"
          >
            <div className="w-8 h-8 rounded-full bg-[#25d366] flex items-center justify-center text-[#075e54] font-semibold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <span>{user.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
