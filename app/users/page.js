"use server";

import { fetchUsers } from "../actions/fetchUsers";
import { deleteUser } from "../actions/actions"; // Import the deleteUser function
import { PrismaClient } from '@prisma/client';

async function page() {
    const prisma = global.prismaGlobal ?? new PrismaClient();

    async function currentUserID() {
        return await fetchUsers();
    }
    const userID = currentUserID();

    const usersFromDB = async () => await prisma.user.findMany();
    const usersFromPrisma = await usersFromDB();

    return (
        <>
            {usersFromPrisma.map(user =>
                <div className="p-3" key={user.id}>
                    <p>
                        <span>User Name:</span> <span className="bg-amber-100"> {user.username} </span>
                    </p>
                    <p>
                        <span>Email Address:</span> <span className="bg-amber-100"> {user.email} </span>
                    </p>
                    <p>
                        <span>User ID:</span> <span className="bg-amber-100"> {user.id} </span>
                    </p>
                    <form action={deleteUser}>
                        <input type="hidden" name="user.id" value={user.id} />
                        <button type="submit" className="bg-red-400 rounded-xl p-2">Delete</button>
                    </form>
                </div>
            )}
        </>
    );
}

export default page;