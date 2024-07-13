import type { NextApiRequest, NextApiResponse } from "next/types";
import prisma from "@/lib/prisma";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Unauthorized' })
        return
    }

    // upload the post content to the database
    
    try {
        createPost(req.body.data)
    } catch (err) {
        res.status(500).send({message: 'the post failed'})
    } finally {
        res.status(200).send({message: 'success'})
    }
}

type postData = {
    title: string
    content: string
    slug: string
    image: string
    catSlug: string
}

// create new row in database with the values passed from axios on the new post page
export async function createPost(postData:postData) {

    const cat = postData.catSlug

    const category = await prisma.postCategories.findMany({
        where: {
            slug: cat
        }
    })

    const post = await prisma.posts.create({
        data: {
            title: postData.title,
            content: postData.content,
            image: postData.image,
            slug: postData.slug,
            catId: category[0].id
        }
    })
}