"use server"
import { revalidatePath } from "next/cache";
import { PrismaClient } from '@prisma/client';

 export default async function deleteUser(formData) {
    const userId = formData.get("user.id");
    prisma =  new PrismaClient();
    await prisma.user.delete({
        where: {
            id: userId
        }
    });

    revalidatePath("/users");
}