import LoginWidget from "@/components/template/login-btn";
import Blog from '@/components/home/blog'
import Portfolio from '@/components/home/portfolio'
import Contact from '@/components/home/contact'
import IntroPanel from '@/components/home/panel1'
import {useState, useEffect, useContext} from 'react'
import { PrismaClient } from "@prisma/client";
import { InferGetStaticPropsType } from "next";
import PreLoader from "@/components/home/preloader";
import { useAppContext } from "@/components/template/appContext";

export default function Home ({ postData, portfolioItems }:InferGetStaticPropsType<typeof getStaticProps>) {

  const [scrollPos, setScrollPos] = useState<number>(0)
  const [preLoaderActive, setPreLoaderActive] = useState<boolean>(true)
  const [darkMode, setDarkMode] = useState<boolean>(false)

  const globalState = useAppContext()

  useEffect(() => {
    window.addEventListener('scroll', () => {
      setScrollPos(window.scrollY)
      scrollDarkMode()
    })
  }, [])

  function scrollDarkMode() {
    if (window.scrollY > 900 && window.scrollY < 3500) {
      setDarkMode(true)
    } else {
      setDarkMode(false)
    }
  }

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('darkMode')
    } else {
      document.documentElement.classList.remove('darkMode')
    }
  }), [darkMode]

  
  return (
    <>
      {
        preLoaderActive && !globalState?.appLaunched? <PreLoader stateFunction={setPreLoaderActive}/> : (
        <div>
          <IntroPanel scrollPos={scrollPos}/>
          <Portfolio portfolioItems={portfolioItems}/>
          <Blog postData={postData}/>
          <Contact />
        </div>        
        )
      }    
    </>
  )
}

export async function getStaticProps() {

  const prisma = new PrismaClient

  const postsRaw = await prisma.posts.findMany({
    select: {
      id: true,
      title: true,
      image: true,
      postDate: true,
      slug: true,
      category: {
        select: {
          name: true,
          slug: true
        }
      }
    },
    orderBy: {
      postDate: 'desc',
    },
    take: 5
  })

  const portfolioItemsRaw = await prisma.portfolio.findMany({
    take: 5,
    orderBy: {
      completed: 'desc'
    }
  })

  const portfolioItems = JSON.parse(JSON.stringify(portfolioItemsRaw))

  if (postsRaw.length != 0) {
    const postData = JSON.parse(JSON.stringify(postsRaw))

    return {
      props: {
        postData,
        portfolioItems,
        key: postData[0].id
      }
    }
  }

  return {
    props: {
      postData: null,
      portfolioItems,
    }
  }
}