import LoginWidget from "@/components/template/login-btn";
import Blog from '@/components/home/blog'
import Portfolio from '@/components/home/portfolio'
import Contact from '@/components/home/contact'
import IntroPanel from '@/components/home/panel1'
import {useState, useEffect} from 'react'


export default function Home (props:any) {

  useEffect(() => {
    let viewportHeight = window.innerHeight

    window.addEventListener('mousewheel', function(event){
      event.preventDefault()
    })

    window.addEventListener('scrollend', () => {
      let panel = Math.round(window.scrollY / viewportHeight)
      let scrollTarget = panel * viewportHeight

      window.scrollTo({
        top:  scrollTarget,
        left: 0,
        behavior: 'smooth',
      })

      if (panel == 1) {
        document.documentElement.classList.add('darkMode')
      } else {
        document.documentElement.classList.remove('darkMode')
      }
      
      setTimeout(() => {
        window.scrollTo({
          top:  scrollTarget,
          left: 0,
          behavior: 'instant',
        }) 
      }, 200);
    })

  }, [])
  
  
  return (
    <div>
      <IntroPanel />
      <Portfolio />
      <Blog />
      <Contact />
    </div>
  )
}