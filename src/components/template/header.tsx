import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"

export default function Header () {

  const { data: session, status } = useSession()
  
  const scrollStyle = {
    boxShadow: '0px 0px 15px 5px rgba(0,0,0,0.15)',
  }

  const staticStyle = {
    boxShadow: '0px 0px 15px 5px rgba(0,0,0,0.0)',
  }

  const [navStyle, setNavStyle] = useState(staticStyle)

  useEffect(() => {
    function handleScroll(){
      if (window.scrollY > 0)  {
        setNavStyle(scrollStyle)
      } else {
        setNavStyle(staticStyle)
      }
    }

    handleScroll();

    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    }
  }, [scrollStyle, staticStyle])
  
  if (status == 'loading') {
    return <></>
  }

  return (
    <header style={navStyle}>
      <div className="container">
        <div className="headerContainer">
          <div className="logoBox">
            <Link href={`/`}>
              <h1><span className='siteName'>Jay Cumming</span><span className='mobileHidden tagline'>Full Stack Developer</span></h1>
            </Link>
          </div>
          <div className="mobileHidden navContainer">
            <nav className="nav">
              <ul>
                <li><Link href='#'>Portfolio</Link></li>
                <li><Link href='#'>Blog</Link></li>
                <li><Link href='#'>contact</Link></li>
                <li><Link href='#'>contact</Link></li>
                {
                  status === 'authenticated'? <li><Link href='/post'>New Post</Link></li> : <></>
                }
              </ul>
            </nav>
          </div>
          <button className='menuTrigger desktopHidden'>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  )
}