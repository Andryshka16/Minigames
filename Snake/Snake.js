let game = document.querySelector("#game")
game.current.style.marginTop = "10px"
let moving = false

let direction = "right"
let element
let diff
let interval1
let interval2
let randX
let randY

let snake = document.querySelector("#first")
let snakeParts = []

let marginX = (window.innerWidth-game.clientWidth)/2
let marginY = Number(game.style.marginTop.substring(0,2))+2

let x = marginX
let y = marginY

let coordinates = []

snakeAppend(2)

snake.style.left = `${x}px`
snake.style.top = `${y}px`

function meal(){
    if (document.querySelector("#meal")){
        document.querySelector("#meal").remove()
    }
    randX = Math.random()*(game.clientWidth-15)+marginX
    randY = Math.random()*(game.clientWidth-15)+marginY
    element = document.createElement("div")
    element.id = "meal"
    element.className = "snake"
    element.style.left = `${randX}px`
    element.style.top = `${randY}px`
    element.style.borderRadius = "50%"
    element.style.backgroundColor = "green"
    game.appendChild(element)
}

function snakeAppend(n) {
    for (let i=0;i<n-1;i++){
        element = document.createElement("div")
        element.className = "snake"
        element.style.top = `${marginY}px`
        element.style.left = `${marginX}px`
        snakeParts.push(element)
        coordinates.push([marginX, marginY])
        game.appendChild(element)
    }
    snakeParts.push(snake)
    coordinates.push([x,y])}

function move(){

    if ((randX+15>=x && x>=randX || randX+15>=x && x+15>=randX)&&
        (randY+15>=y && y>=randY || randY+15>=y && y+15>=randY)){
        addUnit()
    }
    if (x>marginX+game.clientWidth-13||x<marginX ||y<marginY||y>marginY+game.clientWidth-13){
        resetGame()
        return
    }
    for (let index = 0; index<snakeParts.length-1;index++){
        element = snakeParts[index]

        diff =(x-coordinates[index][0])/(index*15+15)
        coordinates[index][0]+=diff
        element.style.left = `${coordinates[index][0]}px`

        diff = (y-coordinates[index][1])/(index*15+15)
        coordinates[index][1]+=diff
        element.style.top = `${coordinates[index][1]}px`

    }
    coordinates[coordinates.length-1] = [x,y]
    if (direction==="left"){
        x-=1
        snake.style.left = `${x}px`
    }
    else if (direction==="right"){
        x+=1
        snake.style.left = `${x}px`
    }
    else if (direction==="down"){
        y+=1
        snake.style.top = `${y}px`
    }
    else if (direction==="up"){
        y-=1
        snake.style.top = `${y}px`
    }

}


function resetGame(){
    let alarm = document.createElement("h1")
    alarm.textContent = "GAME OVER!"
    alarm.style.transform = "scale(0)"
    document.body.appendChild(alarm)
    setTimeout(()=>alarm.style.transform = "scale(1.3)",200)
    setTimeout(()=>alarm.style.transform = "scale(0)",1000)
    setTimeout(()=>alarm.remove(),5000)
    moving=false
    direction = "right"
    coordinates = []
    snakeParts = []
    let array = Array.from(document.querySelectorAll(".snake"))
    for (let i = 1; i<array.length;i++){
        game.removeChild(array[i])
    }
    clearInterval(interval1)
    clearInterval(interval2)
    snakeAppend(2)
    x = marginX
    y = marginY
    snake.style.top = `${y}px`
    snake.style.left = `${x}px`
}

function addUnit(){
    element = document.createElement("div")
    element.className = "snake"
    element.style.left = `${x}px`
    element.style.top = `${y}px`
    snakeParts.unshift(element)
    coordinates.unshift([x, y])
    game.appendChild(element)
    document.querySelector("#meal").remove()
    randX = null
    randY = null
}

window.addEventListener("keydown",event=>{
    switch (event.key) {
        case "ArrowLeft":
            direction = "left"
            break
        case "ArrowDown":
             direction = "down"
            break
        case "ArrowUp":
            direction = "up"
            break
        case "ArrowRight":
            direction = "right"
            break
        case " ":
            moving = !moving
            if (moving){
                interval1 = setInterval(move,10)
                interval2 = setInterval(meal,5000)
            }
            else {
                clearInterval(interval1)
                clearInterval(interval2)
            }
            break

    }
})

reset.addEventListener("click", resetGame)
