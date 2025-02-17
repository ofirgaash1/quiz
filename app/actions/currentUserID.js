'use server'

import { prisma } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

export const currentUserID = async () => {
    try {
        const clerkUser = await currentUser()

        let neonUser = null
        neonUser = await prisma.user.findUnique({
            where: {
                id: clerkUser?.id
            }
        })
        
        if (!neonUser) {
            console.log("@@@@@@ not neonUser");
            
            let username = clerkUser?.username
            if (!username) {
                username = clerkUser?.firstName + " " + clerkUser?.lastName
            }
            username = clerkUser?.firstName + " " + clerkUser?.lastName
            const newUser = {
                username,
                email: clerkUser?.emailAddresses[0].emailAddress,
                id: clerkUser?.id
            }
            neonUser = await prisma.user.create({
                data: newUser
            })
        }

        return (neonUser.id)
        
    } catch (e) {
        console.log(e)
        return 0
    }
}