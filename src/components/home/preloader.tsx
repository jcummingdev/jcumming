import { useState, useEffect } from "react"
import { useAppContext } from "../template/appContext"

interface ComponentProps {
    stateFunction: (params:boolean) => void
}

export default function PreLoader(props:ComponentProps) {

    const [appReady, setAppReady] = useState<boolean>(false)

    const globalState = useAppContext()

    useEffect(() => {
        var i = 0;
        var txt = 'npx next start'
        var speed = 100
        var currentString:string = ''
        function typeWriter() {
            if (i < txt.length) {
                currentString += txt.charAt(i);
                document.getElementById("typeEffect")!.innerHTML = currentString;
                i++;
                setTimeout(typeWriter, speed);
            }
        }
        setTimeout(() => {
            typeWriter()
        }, 1000);
        setTimeout(() => {
            setAppReady(true)
        }, 3000);
    }, [])

    function launchApp() {
        setTimeout(() => {
            props.stateFunction(false)
            globalState?.setAppLaunched(true)
        }, 10);
    }
    
    return (
        <div className="preLoader">
            <div className="container">
                <div className="preLoaderElements">
                    <div className="typeBox">
                        <div className="typeElement">
                            <span id="typeEffect"></span>
                            <span className="textCursor"></span>
                        </div>
                        <button style={appReady? {opacity: '1'} : {}} onClick={launchApp}>Enter</button>
                    </div>
                </div>
            </div>
        </div>
    )
}