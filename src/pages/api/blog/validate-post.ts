import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse){
    if (req.method !== 'POST'){
        res.status(405).send({message: 'Unauthorized'})
        return
    }
    
    const response = await validate(req.body.data)

    res.status(200).send({message: response.message, canPost: response.validated})

}

type postData = {
    title: string
    content: string
    slug: string
    image: string
    catSlug: string
}

export async function validate(postData: postData){

    var response = {
        validated: true,
        message: '',
    }

    // check if all fields are entered

    if (postData.title.length < 1) {
        // title is missing content
        response = {
            validated: false,
            message: 'Title is missing content'
        }

        return response 

    } else if (postData.slug.length < 1) {
        // slug is missing content
        response = {
            validated: false,
            message: 'Slug is missing content'
        }

        return response
    }

    // all required fields have content, proceed to database validation

    const prisma = new PrismaClient

    const postsRaw = await prisma.posts.findMany({
        select: {
            title: true,
            slug: true,
        }
    })

    const posts = JSON.parse(JSON.stringify(postsRaw))

    for (var post in posts) {
        if (postData.title == posts[post].title) {
            // title matches do something
            response = {
                validated: false,
                message: 'Title already exists in database'
            }

            return response 

        } else if (postData.slug == posts[post].slug) {
            // slug matches do something
            response = {
                validated: false,
                message: 'Slug already exists in database'
            }

            return response
        }
    }

    return response

}