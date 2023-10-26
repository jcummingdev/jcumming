import {useEffect} from 'react'
import Img from 'next/image'

type ComponentProps = {
  scrollPos: number
}

export default function Portfolio(props:ComponentProps) {

  // useEffect(() => {
  //   var viewportOffset = document.getElementById('portfolio')!.getBoundingClientRect()
  //   var top = viewportOffset.top + window.innerHeight
  //   var bottom = viewportOffset.bottom

    
  //   window.addEventListener('scroll', () => {
  //     if ((top < props.scrollPos) && (bottom > 200)) {
  //       document.documentElement.classList.add('darkMode')
  //     } else {
  //       document.documentElement.classList.remove('darkMode')
  //     }      
  //   })


  // }, [props.scrollPos])
  
  
  return(
    <div className='portfolioPanel panel' id='portfolio'>
      <div className="container">
        <h1 className="introHead">This is my <span>Portfolio</span></h1>
      </div>
    </div>
  )
}