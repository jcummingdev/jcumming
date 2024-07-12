import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next/types";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Unauthorized' })
        return
    }

    // upload the post content to the database
    
    try {
        createPortfolio(req.body.data)
    } catch (err) {
        res.status(500).send({message: 'the post failed'})
    } finally {
        res.status(200).send({message: 'success'})
    }
}

type PortfolioData = {
    name: string
    text: string
    link: string
    image: string
    tech: string
    type: string
}

// create new row in database with the values passed from axios on the new post page
export async function createPortfolio(PortfolioData:PortfolioData) {
    await prisma.portfolio.create({
        data: {
            name: PortfolioData.name,
            text: PortfolioData.text,
            link: PortfolioData.link,
            image: PortfolioData.image,
            tech: PortfolioData.tech,
            type: PortfolioData.type,
        }
    })
}