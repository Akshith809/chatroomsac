import React from "react";
import Avatar from "react-avatar";
import dayjs from "dayjs";

interface Props {
  username: string;
  content: string;
  self: boolean;
}

export default function MessageBubble({ username, content, self }: Props) {
  return (
    <div className={`flex items-end gap-2 mb-3 ${self ? "justify-end" : "justify-start"}`}>
      {!self && <Avatar name={username} size="35" round />}
      <div
        className={`max-w-[70%] p-3 rounded-2xl shadow-sm ${
          self
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-100 text-gray-900 rounded-bl-none"
        }`}
      >
        {!self && (
          <p className="text-sm font-semibold text-gray-700 mb-1">{username}</p>
        )}
        <p className="text-sm">{content}</p>
        <p className={`text-[10px] mt-1 ${self ? "text-gray-200" : "text-gray-500"}`}>
          {dayjs().format("HH:mm")}
        </p>
      </div>
      {self && <Avatar name={username} size="35" round />}
    </div>
  );
}
