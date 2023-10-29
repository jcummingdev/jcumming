import { useState, useEffect } from "react"
import { clickHandler, dataArray, generateDataObjects, loop } from "./Classes/character"

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

    const layer4 = document.getElementById('layer4') as HTMLCanvasElement
    const layer3 = document.getElementById('layer3') as HTMLCanvasElement
    const layer2 = document.getElementById('layer2') as HTMLCanvasElement
    const layer1 = document.getElementById('layer1') as HTMLCanvasElement
    const backgroundLayer = document.getElementById('backgroundLayer') as HTMLCanvasElement

    layer4.width = window.innerWidth
    layer4.height = window.innerHeight
    layer4.style.background = 'transparent';

    layer3.width = window.innerWidth
    layer3.height = window.innerHeight
    layer3.style.background = 'transparent';

    layer2.width = window.innerWidth
    layer2.height = window.innerHeight
    layer2.style.background = 'transparent';

    layer1.width = window.innerWidth
    layer1.height = window.innerHeight
    layer1.style.background = 'transparent';

    layer4.width = window.innerWidth
    layer4.height = window.innerHeight
    layer4.style.background = 'transparent';

    backgroundLayer.width = window.innerWidth
    backgroundLayer.height = window.innerHeight
    backgroundLayer.style.background = '#ff8';

    generateDataObjects();

    let clickCount = 0;

    window.requestAnimationFrame(loop)

    document.getElementById('home')!.addEventListener('click', (e) => {

      clickCount ++;
      if (clickCount % 5 == 0){
        clickCount++
      }
      let cursorX = e.pageX
      let cursorY = e.pageY

      if (dataArray[0].context && dataArray[1].context && dataArray[2].context && dataArray[3].context && dataArray[4].context){
        clickHandler(clickCount, cursorX, cursorY);
      }
    })

    setTimeout(() => {
      setIsLoading(false)
    }, 300);
  }, [])

  return (
    <div className='introPanel' id='home'>
      <canvas id="backgroundLayer"/>
      <canvas id="layer1"/>
      <canvas id="layer2"/>
      <canvas id="layer3"/>
      <canvas id="layer4"/>
      <div className="container">
        <div className="introContent" style={isLoading? {opacity: '0', scale: '.7'} : style}>
          <h1 className="introHead" >My name is <span>Jay Cumming </span>and I write software</h1>
        </div>
      </div>
    </div>
  )
}