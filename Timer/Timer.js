const time = document.querySelector("#time")
const start = document.querySelector("#start")
const pause = document.querySelector("#pause")
const reset = document.querySelector("#reset")

let elapsed = 0
let minutes
let secs
let ms
let interval
let allow = false
let all
let pressed = false

let paused = true


function setTimer(){

    if (paused){
        time.style.color = "black"
        let startTime = Date.now()-elapsed
        if (paused){interval = setInterval(updateTime,10)}
        paused = false
        function updateTime(){
            elapsed = Date.now()-startTime
            minutes =  Math.floor((elapsed/1000/60)%60).toString()
            secs =  Math.floor((elapsed/1000)%60).toString()
            ms = Math.floor((elapsed)%1000).toString()
            minutes = minutes.length<2?"0"+minutes:minutes
            secs = secs.length<2?"0"+secs:secs
            ms = ms.length<3?"0"+ms:ms
            ms = ms.substring(0,2)
            time.textContent = `${minutes}:${secs}:${ms}`
        }
    }
}

function resetTimer(){
    clearInterval(interval)
    allow = false
    paused = true
    pressed = false
    elapsed = 0
    time.textContent = "00:00:00"
    time.style.color = "black"
}

function pauseTimer(){

    if (paused && time.textContent==="00:00:00"){time.style.color = "black"}
    else if (!paused){
        allow = false
        paused = true
        time.style.color = "yellow"
        setTimeout(()=>{time.style.color = "black"},300)
        clearInterval(interval)}
    clearInterval(all)
}

start.addEventListener("click", setTimer)
reset.addEventListener("click", resetTimer)
pause.addEventListener("click", pauseTimer)

window.addEventListener("keydown",event=>{
    if (!paused && !pressed){pauseTimer(); pressed=true}
    else if (event.key===" " && !pressed && paused){
        elapsed = 0
        time.textContent = "00:00:00"
        time.style.color = "red"
        const count = ()=>{
            allow = true
            pressed = true
            time.style.color = "green"
        }
        all = setTimeout(count, 500)
    }
    else if (event.key===" " && paused && !pressed){setTimer(); pressed=true}
})

window.addEventListener("keyup",event=>{
    pressed = false
    if (event.key===" " && allow && paused){setTimer()}
    else if (event.key===" " && !allow && paused){pauseTimer()}
})