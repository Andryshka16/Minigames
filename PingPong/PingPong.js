let p1 = 140,
	p2 = 140

let ballX = 130,
	ballY = 160

let speed = 10

const movePlayers = 1

let w,
	s,
	up,
	down,
	movingW,
	movingS,
	movingUp,
	movingDown,
	ballMoving,
	ballInterval,
	direction,
	text,
	bounced
let directions = ['leftUp', 'leftDown', 'rightUp', 'rightDown']

const ball = document.querySelector('#ball')
const player1 = document.querySelector('#player1')
const player2 = document.querySelector('#player2')
const play = document.querySelector('#play')
const reset = document.querySelector('#reset')
const score = document.querySelector('#score')

function move(event) {
	switch (event.key) {
		case 'w':
			if (!movingW) {
				w = setInterval(() => {
					p1 > 42 ? (p1 -= movePlayers) : clearInterval(w)
					player1.style.top = `${p1}px`
				}, 5)
			}
			movingW = true
			break

		case 's':
			if (!movingS) {
				s = setInterval(() => {
					p1 < 250 ? (p1 += movePlayers) : clearInterval(s)
					player1.style.top = `${p1}px`
				}, 5)
			}
			movingS = true
			break

		case 'ArrowUp':
			if (!movingUp) {
				up = setInterval(() => {
					p2 > 42 ? (p2 -= movePlayers) : clearInterval(up)
					player2.style.top = `${p2}px`
				}, 5)
			}
			movingUp = true
			break

		case 'ArrowDown':
			if (!movingDown) {
				down = setInterval(() => {
					p2 < 250 ? (p2 += movePlayers) : clearInterval(down)
					player2.style.top = `${p2}px`
				}, 5)
			}
			movingDown = true
			break
	}
}

function leave(event) {
	switch (event.key) {
		case 'w':
			clearInterval(w)
			movingW = false
			break
		case 's':
			clearInterval(s)
			movingS = false
			break
		case 'ArrowDown':
			clearInterval(down)
			movingDown = false
			break
		case 'ArrowUp':
			clearInterval(up)
			movingUp = false
			break
		case ' ':
			if (!ballMoving) {
				direction = directions[Math.floor(Math.random() * 4)]
				ballMoving = true
				ballInterval = setInterval(moveBall, 10)
			}
	}
}

function moveBall() {
	ball.style.transition = `0ms`
	if (bounced) {
		bounced = 0
		speed *= 0.9
		console.log(speed)
		clearInterval(ballInterval)
		ballInterval = setInterval(moveBall, speed)
	}
	if (ballY < 43) {
		direction === 'rightUp' ? (direction = 'rightDown') : (direction = 'leftDown')
	}
	if (ballY > 295) {
		direction === 'rightDown' ? (direction = 'rightUp') : (direction = 'leftUp')
	}
	if (ballX === 10 && ballY + 10 > p1 && ballY < p1 + 60) {
		bounced = true
		direction === 'leftDown' ? (direction = 'rightDown') : (direction = 'rightUp')
	}
	if (ballX === 245 && ballY + 10 > p2 && ballY < p2 + 60) {
		bounced = true
		direction === 'rightDown' ? (direction = 'leftDown') : (direction = 'leftUp')
	}
	if (ballX < 1) {
		resetGame()
		setWinner('Red')
		return
	}

	if (ballX > 255) {
		resetGame()
		setWinner('Blue')
		return
	}

	switch (direction) {
		case 'leftUp':
			ballX -= 1
			ballY -= 1
			break
		case 'leftDown':
			ballX -= 1
			ballY += 1
			break
		case 'rightUp':
			ballX += 1
			ballY -= 1
			break
		case 'rightDown':
			ballX += 1
			ballY += 1
			break
	}
	ball.style.top = `${ballY}px`
	ball.style.marginLeft = `${ballX}px`
}

function resetGame() {
	clearInterval(ballInterval)
	bounced = false
	speed = 10
	p1 = 140
	p2 = 140
	player1.style.top = `${p1}px`
	player2.style.top = `${p2}px`
	ballMoving = false
	ballX = 130
	ballY = 160
	ball.style.top = `${ballY}px`
	ball.style.marginLeft = `${ballX}px`
}

function setWinner(winner) {
	text = score.textContent.split(':')
	switch (winner) {
		case 'Blue':
			score.textContent = `${Number(text[0]) + 1}:${text[1]}`
			break
		case 'Red':
			score.textContent = `${text[0]}:${Number(text[1]) + 1}`
			break
	}
}

window.addEventListener('keydown', move)
window.addEventListener('keyup', leave)
play.addEventListener('click', () => {
	if (!ballMoving) {
		direction = directions[Math.floor(Math.random() * 4)]
		ballMoving = true
		ballInterval = setInterval(moveBall, 10)
	}
})
reset.addEventListener('click', () => {
	resetGame()
	score.textContent = '0:0'
})
