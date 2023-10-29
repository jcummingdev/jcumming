class Character {
    posX: number;
    posY: number;
    speed: number;
    time: number;
    target: number;
    gravitySatisfied: boolean;

    constructor( posX:number, posY:number) {
        this.posX = posX;
        this.posY = posY;
        this.speed = 1;
        this.time = 0;
        this.gravitySatisfied = false;
        this.target = 100;
    }

    draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.fillStyle = 'black'
        context.fillRect(this.posX-30, this.posY-30, 60, 60);
        context.stroke();
    }

    doGravity(context: CanvasRenderingContext2D) {

        // gravity
        if ((this.posY < window.innerHeight - 100) && !this.gravitySatisfied ){

            this.time += 1/60; 
            this.posX += 0
            this.posY += 9.81 * Math.pow(this.time, 2)

            this.draw(context)

        } else {
            this.time = 0;
            this.draw(context)
            setTimeout(() => {
                this.gravitySatisfied = true
            }, 1000);
        }
    }

    setNewPosition() {

        this.posX += (this.target - this.posX) / Math.abs(this.target - this.posX) * this.speed

        if ( this.posX == 100 ) {
            this.target = 1900
        } else if( this.posX == 1900){
            this.target = 100;
        }

    }

}

interface Layer {
    context: CanvasRenderingContext2D
    actors: Character[]
    animating: boolean
}

// interface Data {
//     [layer: string]: Layer
// }

export var dataArray:Layer[] = []

export function generateDataObjects() {

    const layer4 = document.getElementById('layer4') as HTMLCanvasElement
    const layer3 = document.getElementById('layer3') as HTMLCanvasElement
    const layer2 = document.getElementById('layer2') as HTMLCanvasElement
    const layer1 = document.getElementById('layer1') as HTMLCanvasElement
    const backgroundLayer = document.getElementById('backgroundLayer') as HTMLCanvasElement

    dataArray = [
        { // background layer object
            context: backgroundLayer.getContext('2d') as CanvasRenderingContext2D,
            actors: [] as Character[],
            animating: false,
        },
        { // layer 1 object
            context: layer1.getContext('2d') as CanvasRenderingContext2D,
            actors: [] as Character[],
            animating: false,
        },
        { // layer 2 object
            context: layer2.getContext('2d') as CanvasRenderingContext2D,
            actors: [] as Character[],
            animating: false,
        },
        { // layer 3 object
            context: layer3.getContext('2d') as CanvasRenderingContext2D,
            actors: [] as Character[],
            animating: false,
        },
        { // layer 4 object
            context: layer4.getContext('2d') as CanvasRenderingContext2D,
            actors: [] as Character[],
            animating: false,
        },
    ]
}

export function drawCharacter(layer:number, posX: number, posY: number){

    const layerData = dataArray[layer]

    layerData.animating = true

    console.log(dataArray)
    // draw the character, initialize fall, initialize character
    const character = new Character(posX, posY)
    character.draw(dataArray[layer].context)

    switch (dataArray[layer].context.canvas.id) {
        case 'layer4':
            dataArray[4].actors.push(character)
            break;
        case 'layer3': 
            dataArray[3].actors.push(character)
            break;
        case 'layer2': 
            dataArray[2].actors.push(character)
            break;
        case 'layer1': 
            dataArray[1].actors.push(character)
            break;
        case 'backgroundLayer': 
            dataArray[0].actors.push(character)
            break;
    }
}

export function clickHandler(clickCount:number,posX: number, posY: number){
    // do things when the click event happens

    console.log(clickCount)

    drawCharacter(clickCount % 5, posX, posY)
}



export function loop() {

    if (dataArray[4].context && dataArray[4].actors.length > 0){ // check if any actors exist in Layer 4 (first spawn point)
        for (var key in dataArray) { // loop over layers
            if (dataArray[key].animating){ // check if the layer is currently animating

                dataArray[key].context?.clearRect(0, 0, window.innerWidth * 2, window.innerHeight * 2) // clear the layer if animation is active

                for (let actor in dataArray[key].actors){
                    if (!dataArray[key].actors[actor].gravitySatisfied) {
                       dataArray[key].actors[actor].doGravity(dataArray[key].context)
                    } else {
                        // set new position
                        dataArray[key].actors[actor].setNewPosition()
                        // draw at new position
                        dataArray[key].actors[actor].draw(dataArray[key].context)                        
                    }

                }
            }
        }


        
    }


    // start animation loop only if first character has been spawned into Layer 4 (top layer)


    requestAnimationFrame(loop)
}