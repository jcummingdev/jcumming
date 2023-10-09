import { PrismaClient } from "@prisma/client";

export default async function handler(req:any, res:any) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Unauthorized' })
        return
    }

    // upload the post content to the database
    createPost(req.body.data)
}

// create new row in database with the values passed from axios on the new post page
export async function createPost(req:any) {
    const prisma = new PrismaClient

    const post = await prisma.posts.create({
        data: req
    })

    await prisma.$disconnect()
}