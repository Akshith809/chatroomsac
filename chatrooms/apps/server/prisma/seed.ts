import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const rooms = Array.from({ length: 10 }, (_, i) => `Chatroom ${i + 1}`);

  for (const name of rooms) {
    await prisma.room.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("✅ 10 Chatrooms created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
