import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import { FaGithub, FaLinkedin } from 'react-icons/fa6'
import { FiLogIn, FiLogOut } from 'react-icons/fi'

export default function Header () {

  const { data: session, status } = useSession()
  const [navStyle, setNavStyle] = useState('staticStyle')

  useEffect(() => {
    function handleScroll(){
      if (window.scrollY > 0)  {
        setNavStyle('scrollStyle')
      } else {
        setNavStyle('staticStyle')
      }
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll);
    }
  }, [])
  
  function menuToggle(){
    document.getElementById('header')!.classList.toggle('menuOpen') 
  }
  
  return (    
    <header className={navStyle} id='header'>
      <div className="container">
        <div className="headerContainer">
          <div className="logoBox">
            <Link href={`/#home`}>
              <h1><span className='siteName'>Jay Cumming</span><span className='mobileHidden tagline'>Software Developer</span></h1>
            </Link>
          </div>
          <div className="mobileHidden navContainer">
            <nav className="nav">
              <ul>
                <li><Link href='/#home'>Home</Link></li>
                <li><Link href='/#portfolio'>Portfolio</Link></li>
                <li><Link href='/#blog'>Blog</Link></li>
                <li><Link href='/#contact'>Contact</Link></li>
                {
                  status === 'authenticated'? 
                  <>
                    <li><Link href='/post'>New Post</Link></li>
                    <li><button onClick={() => signOut()}><FiLogOut /></button></li>                  
                  </>
                  : 
                  <li><button onClick={() => signIn('google')}><FiLogIn /></button></li>                  
                }
                <div className='socialMediaIcons'>
                  <a href="https://github.com/sadxxface" target='_blank'><FaGithub /></a>
                  <a href="https://www.linkedin.com/in/jrcumming/" target='_blank'><FaLinkedin /></a>
                </div>
              </ul>
            </nav>
          </div>
          <button className='menuTrigger desktopHidden' onClick={menuToggle}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
      
      <div className='sideMenu' onClick={menuToggle}>
      <div className='sideMenuPanel' onClick={(e) => {e.stopPropagation}}>
        <nav>
          <ul>
            <li><Link href='/#home' onClick={menuToggle}>Home</Link></li>
                <li><Link href='/#portfolio' onClick={menuToggle}>Portfolio</Link></li>
                <li><Link href='/#blog' onClick={menuToggle}>Blog</Link></li>
                <li><Link href='/#contact' onClick={menuToggle}>Contact</Link></li>
                {
                  status === 'authenticated'? 
                  <>
                    <li><Link href='/post' onClick={menuToggle}>New Post</Link></li>
                    <li><button onClick={() => signOut()}>Sign out</button></li>
                  </>
                  : 
                  <li><button onClick={() => signIn('google')}>Sign In</button></li>
                }
            </ul>
        </nav>

        <div>
           <div className='sideCopyright'>
           <div className='socialMediaIcons'>
            <a href="https://github.com/sadxxface" target='_blank'><FaGithub /></a>
            <a href="https://www.linkedin.com/in/jrcumming/" target='_blank'><FaLinkedin /></a>
          </div>
             <p>Copyright 2023</p>
           </div>
        </div>
      </div>
      </div>
    </header>    
  )
}