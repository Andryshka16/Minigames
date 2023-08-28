const playerScore = document.querySelector("#p")
const computerScore = document.querySelector("#c")
const result = document.querySelector("#w")
const restart = document.querySelector("#restart")
const items = document.querySelectorAll(".item")

let player = 0
let computer = 0

function updateScore(){
    playerScore.textContent = `Player: ${player}`
    computerScore.textContent = `Computer: ${computer}`
}

function win(winner){
    if (winner==="Player"){
        player+=1
        playerScore.textContent = `PLayer: ${player}`
    }
    else if (winner==="Computer"){
        computer+=1
        computerScore.textContent = `Computer: ${computer}`
    }
    result.textContent = `Last game winner: ${winner}`
    updateScore()
}

function play(playerChoice){
    let pcChoice = ["Rock","Paper","Scissors"][Math.floor(Math.random()*3)]
    if (pcChoice==="Rock" && playerChoice==="Paper" ||
        pcChoice==="Paper" && playerChoice==="Scissors" ||
        pcChoice==="Scissors" && playerChoice==="Rock"){
        win("Player")
    }
    else if (pcChoice===playerChoice){
        win("Tie!")
    }
    else {win("Computer")}
    console.log(playerChoice,pcChoice)
}

function restartgame(){
    player = 0
    computer = 0
    playerScore.textContent = `Player: 0`
    computerScore.textContent = `Computer: 0`
    result.textContent = "The game hasn't started"
}

items.forEach((element)=>element.addEventListener("click",()=>play(element.textContent)))
restart.addEventListener("click",restartgame)