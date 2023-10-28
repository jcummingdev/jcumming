class Character {
    posX: number;
    posY: number;
    speed: number;
    time: number;
    gravitySatisfied: boolean;

    constructor( posX:number, posY:number) {
        this.posX = posX;
        this.posY = posY;
        this.speed = 0;
        this.time = 0;
        this.gravitySatisfied = false;
    }

    draw(context: CanvasRenderingContext2D){
        context.beginPath();
        context.fillStyle = 'black'
        context.fillRect(this.posX-30, this.posY-30, 60, 60);
        context.stroke();
    }

    update(context: CanvasRenderingContext2D) {

        // gravity
        if ((this.posY < window.innerHeight - 100) && !this.gravitySatisfied ){

            this.time += 1/60; 
            context.clearRect(this.posX-30, this.posY-31, 90, 91)

            this.posX += 0
            this.posY += 9.81 * Math.pow(this.time, 2)

            this.draw(context)

        } else {
            this.time = 0;
            this.speed = 0;
            this.gravitySatisfied = true
        }
    }

}

var characterArray = []

export function drawCharacter(context:CanvasRenderingContext2D, posX: number, posY: number){

    // draw the character, initialize fall, initialize character

    const character = new Character(posX, posY)
    character.draw(context)
    
    characterArray.push(character)

    const updateCharacter = function (){
        character.update(context)
    }
    requestAnimationFrame(updateCharacter)
}

export function clickHandler(clickCount:number,posX: number, posY: number, bg:CanvasRenderingContext2D, l1:CanvasRenderingContext2D, l2:CanvasRenderingContext2D, l3:CanvasRenderingContext2D, l4:CanvasRenderingContext2D){
    // do things when the click event happens
    drawCharacter(l4, posX, posY)
}

export function loop(characterArray:Character[]) {
    // do animation loop

    for (var i in characterArray) {
        console.log('update character')
    }
}