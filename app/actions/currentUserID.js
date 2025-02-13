'use server'

import { prisma } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

export const currentUserID = async () => {
    try {
        const clerkUser = await currentUser()

        let mongoUser = null
        mongoUser = await prisma.user.findUnique({
            where: {
                id: clerkUser?.id
            }
        })

        if (!mongoUser) {
            let username = clerkUser?.username
            if (!username) {
                username = clerkUser?.firstName + " " + clerkUser?.lastName
            }

            const newUser = {
                username,
                email: clerkUser?.emailAddresses[0].emailAddress,
                id: clerkUser?.id
            }
            mongoUser = await prisma.user.create({
                data: newUser
            })
        }

        const quizResults = await prisma.userKnownWord.count({
            where: {
                userId: mongoUser.id
            }
        })

        return (mongoUser.id)
        
    } catch (e) {
        console.log(e)
        return 0
    }
}