import { PrismaClient } from '@prisma/client'
import type { InferGetStaticPropsType, GetStaticPaths, } from 'next'

type Params ={
    params: {
        postId: string
        catId: string
    }
}

export async function returnData() {

    const prisma = new PrismaClient

    const postsRaw = await prisma.posts.findMany({
        select: {
            category: {
                select: {
                    slug: true,
                    id: true
                }
            }, 
            slug: true,
            title: true,
            id: true,
        }
    }) 

    const posts = JSON.parse(JSON.stringify(postsRaw))

    await prisma.$disconnect()

    return {
        postData: posts
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    
    type category = {
        id: string
        slug: string
    }

    type post = {
        id: string
        slug: string
        title: string
        category: category
    }

    const data = await returnData()

    const paths = data.postData.map((post:post) => (
        { params: { postId: post.slug, catId: post.category.slug } }
    )) satisfies GetStaticPaths

    return {paths, fallback: 'blocking'}
}

export async function getStaticProps({ params }:Params) {

    const slug = params.postId

    const prisma = new PrismaClient

    const postRaw = await prisma.posts.findMany({
        where: {
            slug: {
                equals: slug
            }
        },
        select: {
            id: true,
            postDate: true,
            title: true,
            content: true,
            image: true,
            category: {
                select: {
                    id: true,
                    name: true,
                    slug: true
                }
            },
            slug: true
        }
    })

    if (postRaw[0]) {
        const postData = JSON.parse(JSON.stringify(postRaw[0]))
        
        return {
            props: {
                postData,
                key: postData.id
            },
            revalidate: 10,
        }        
    }

    return {
        props: {
            postData: null
        }
    }



}

export default function postPage ({ postData }:InferGetStaticPropsType<typeof getStaticProps>) {

    return(
        <div className='container' style={{marginTop: '150px'}}>
            <h1>{postData.title}</h1>
        </div>
    )
}
