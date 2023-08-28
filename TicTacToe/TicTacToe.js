const div = document.getElementById("game")
const reset = document.querySelector(".btn2")

let values = ["X","O"]
let value
let filled
let variants = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
let t

for (let i=0;i<9;i++){
    let button = document.createElement("button")
    button.innerText = "X"
    button.className = "btn"
    button.style.color = "rgba(0,0,0,0)"
    button.addEventListener("click",()=>{
        if (button.style.color==="rgba(0, 0, 0, 0)"){
            value = [values[values.length-2]]
            button.textContent=value
            values.push(value)
            button.style.color = "rgba(0,0,0,1)"
            win()
        }
    })
    div.appendChild(button)
}


let buttons = Array.from(document.querySelectorAll(".btn"))

function win(){

    filled = buttons.filter(element=>element.style.color==="rgb(0, 0, 0)")
        .map(element=>buttons.indexOf(element))

    for (let element of variants){
        if(filled.includes(element[0])
          &&filled.includes(element[1])
          &&filled.includes(element[2])
          &&["XXX","OOO"]
              .includes(buttons[element[0]].textContent+
                        buttons[element[1]].textContent+
                        buttons[element[2]].textContent)
          )
      {
          values = ["X","O"]
          t = setTimeout(()=>{window.alert(buttons[element[0]].textContent+" WON!"); resetGame()},200)
          break
      }
    }
    if (values.length>10){t = setTimeout(()=>{window.alert("TIE!"); resetGame()},200)}
}

function resetGame(){
    buttons
        .forEach(element=>
        {element.style.color = "rgba(0,0,0,0)"
        values = ["X","O"]})
}

reset.addEventListener("click",resetGame)