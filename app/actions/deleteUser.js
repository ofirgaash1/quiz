import { revalidatePath } from "next/cache";
import { PrismaClient } from '@prisma/client';

const prisma = global.prismaGlobal ?? new PrismaClient();

export async function deleteUser(formData) {
    const taskId = formData.get("user.id");

    await prisma.user.delete({
        where: {
            id: taskId
        }
    });

    revalidatePath("/users");
}