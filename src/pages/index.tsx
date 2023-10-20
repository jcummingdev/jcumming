import LoginWidget from "@/components/template/login-btn";
import Blog from '@/components/home/blog'
import Portfolio from '@/components/home/portfolio'
import Contact from '@/components/home/contact'
import IntroPanel from '@/components/home/panel1'

import {useState} from 'react'

export default function home (props:any) {
  
  return (
    <div>
      <IntroPanel />
      <Portfolio />
      <Blog />
      <Contact />
    </div>
  )
}