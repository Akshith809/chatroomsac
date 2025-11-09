import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

interface User {
  id: string;
  username: string;
  roomId?: number;
}

const users = new Map<string, User>();

// ✅ Load saved messages for a specific room
app.get("/api/rooms/:roomId/messages", async (req, res) => {
  const roomId = parseInt(req.params.roomId);
  try {
    const messages = await prisma.message.findMany({
      where: { roomId },
      include: { author: true },
      orderBy: { createdAt: "asc" },
    });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// ✅ Socket connections for real-time chat
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("join_room", async ({ username, roomId }) => {
    const oldUser = users.get(socket.id);
    if (oldUser?.roomId) socket.leave(oldUser.roomId.toString());

    users.set(socket.id, { id: socket.id, username, roomId });
    socket.join(roomId.toString());

    const roomUsers = Array.from(users.values()).filter(
      (u) => u.roomId === roomId
    );
    io.to(roomId.toString()).emit("room_users", roomUsers);
  });

  socket.on("send_message", async ({ roomId, username, content }) => {
    try {
      const message = await prisma.message.create({
        data: {
          content,
          room: { connect: { id: roomId } },
          author: {
            connectOrCreate: {
              where: { username },
              create: { username },
            },
          },
        },
        include: { author: true },
      });

      io.to(roomId.toString()).emit("receive_message", message);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("disconnect", () => {
    const user = users.get(socket.id);
    if (user?.roomId) {
      users.delete(socket.id);
      const roomUsers = Array.from(users.values()).filter(
        (u) => u.roomId === user.roomId
      );
      io.to(user.roomId.toString()).emit("room_users", roomUsers);
    }
    console.log("🔴 Disconnected:", socket.id);
  });
});

const PORT = 4000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
