import { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowDown } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import { FaArrowDown } from "react-icons/fa6"

type ComponentProps = {
  scrollPos: number
}

export default function IntroPanel(props:ComponentProps) {

  const [isLoading, setIsLoading] = useState(true)

  type AnimationStyle = {
    opacity: string
    scale: string
    transform: string
  }

  const style:AnimationStyle = {
    opacity: (1 - (props.scrollPos/1000)).toString(),
    scale: (1 - (props.scrollPos/4000)).toString(),
    transform: `translate(0, -${100 * (props.scrollPos)/500}px)`
  }

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 300);
  }, [])

  return (
    <div className='introPanel' id='home'>
      <div className="container">
        <div className="introContent" style={isLoading? {opacity: '0', scale: '.7'} : style}>
          <h1 className="introHead" >My name is <span>Jay Cumming </span>and I write software</h1>
          <span>See My Work</span>
          <Link href={`#portfolio`} className="scrollDownButton">
            <FaArrowDown />
          </Link>
        </div>
      </div>
    </div>
  )
}