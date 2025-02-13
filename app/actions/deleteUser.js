"use server"
import { revalidatePath } from "next/cache";
import { PrismaClient } from '@prisma/client';
import { prisma } from "@/lib/prisma"

 export default async function deleteUser(formData) {
    const userId = formData.get("user.id");

    await prisma.user.delete({
        where: {
            id: userId
        }
    });

    revalidatePath("/users");
}