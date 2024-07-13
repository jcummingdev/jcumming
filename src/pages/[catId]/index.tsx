import prisma from '@/lib/prisma'
import type { InferGetStaticPropsType, GetStaticProps, GetStaticPaths, } from 'next'
import { ParsedUrlQuery } from 'querystring'

  interface IParams extends ParsedUrlQuery {
    slug: string
}


export async function returnData() {

    const categoriesRaw = await prisma.postCategories.findMany() 

    const categories = JSON.parse(JSON.stringify(categoriesRaw))

    await prisma.$disconnect()

    return {
        catData: categories
    }
}

export const getStaticPaths: GetStaticPaths = async () => {

    type category = {
        id: string
        name: string
        slug: string
    }

    const data = await returnData()

    const paths = data.catData.map((cat:category) => (
        { params: { catId: cat.slug } }
    )) satisfies GetStaticPaths

    return {paths, fallback: 'blocking'}
}

export const getStaticProps: GetStaticProps = async (context) => {

    const {slug} = context.params as IParams

    const catRaw = await prisma.postCategories.findMany({
        where: {
            slug: {
                equals: slug
            }
        },
        include: {
            posts: {
                select: {
                    id: true,
                    image: true,
                    slug: true,
                    postDate: true,
                    title: true,
                }
            }
        }
    })

    if (catRaw.length > 0) {
        const pageData = JSON.parse(JSON.stringify(catRaw[0]))

        return { 
            props: { 
                pageData,
                key: pageData.id
            },
            revalidate: 10
        }
    }
    return {
        props: {
            pageData: null
        }
    }
  }

export default function CatPage({ pageData }:InferGetStaticPropsType<typeof getStaticProps>) {

    return (
        <div style={{marginTop: '150px'}} className='container'>
            <h1>Category Page</h1>
            {pageData.name}
        </div>
    )
}