
import { prisma } from "@/lib/prisma"

export default async function usersOnDB() {
  const users = await prisma.User.findMany({
    select: {
      id: true,
      email: true,
      username: true
    },
  });

  return users
}

