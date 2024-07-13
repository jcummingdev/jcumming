import prisma from '@/lib/prisma'
import type { InferGetStaticPropsType, GetStaticPaths, } from 'next'
import Img from 'next/image'

type Params ={
    params: {
        postId: string
    }
}

export async function returnData() {

    const postsRaw = await prisma.posts.findMany({
        select: {
            slug: true,
            title: true,
            id: true,
        }
    }) 

    const posts = JSON.parse(JSON.stringify(postsRaw))

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
        { params: { postId: post.slug } }
    )) satisfies GetStaticPaths

    return {paths, fallback: 'blocking'}
}

export async function getStaticProps({ params }:Params) {

    const slug = params.postId

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

    if (!postData) {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        )
    }

    return(
        <div className='singlePost'>
            <div className='postHeader'>
                <Img src={postData.image} fill={true} alt='blog image' style={{objectFit: 'cover', zIndex: -1}} />
                <div className="gradientOverlay">
                    <div className='container'>
                        <div className='postMeta'>
                            <p>Posted {new Date(postData.postDate).toDateString().split('T')[0]} in </p>
                            <p><strong>{postData.category.name}</strong></p>
                        </div>
                        <h1>{postData.title}</h1>
                    </div>

                </div>
            </div>
            <div className='container postContent' style={{padding: '20px 0px'}}>
                <div dangerouslySetInnerHTML={{__html: postData.content}} />
            </div>
            
        </div>

    )
}
