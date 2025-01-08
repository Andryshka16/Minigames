// Handle form submission
$('#feedback-form').on('submit', (event) => {
	const rating = $('#rating').val()
	if (rating < 1 || rating > 5) {
		alert('Please enter a rating between 1 and 5.')
		event.preventDefault()
	}
})

// Smooth scrolling behavior
const enableSmoothScrolling = () => {
	document.querySelectorAll('.smooth-scroll').forEach((anchor) => {
		anchor.addEventListener('click', (e) => {
			e.preventDefault()
			const targetId = anchor.getAttribute('href').substring(1)
			const targetElement = document.getElementById(targetId)

			if (targetElement) {
				targetElement.scrollIntoView({
					behavior: 'smooth',
					block: 'center'
				})
			}
		})
	})
}

enableSmoothScrolling()

// Leaderboard rendering
const renderLeaderboard = () => {
	const topPlayers = [
		{ rank: 1, name: 'Jane Doe', score: 120 },
		{ rank: 2, name: 'John Smith', score: 110 },
		{ rank: 3, name: 'Sam Wilson', score: 100 }
	]

	const leaderboardBody = document.getElementById('leaderboard-body')

	topPlayers.forEach((player) => {
		const row = document.createElement('tr')

		// Create and append cells
		;['rank', 'name', 'score'].forEach((key) => {
			const cell = document.createElement('td')
			cell.textContent = player[key]
			row.appendChild(cell)
		})

		leaderboardBody.appendChild(row)
	})
}

renderLeaderboard()

// Tic-Tac-Toe Game
const gameConfig = {
	players: ['X', 'O'],
	winCombinations: [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	]
}

let currentPlayerIndex = 0
const buttons = []

const initializeGameBoard = () => {
	const gameContainer = document.getElementById('game')

	for (let i = 0; i < 9; i++) {
		const button = document.createElement('button')
		button.className = 'btn'
		button.addEventListener('click', () => handleMove(button, i))
		gameContainer.appendChild(button)
		buttons.push(button)
	}
}

const handleMove = (button) => {
	if (!button.innerText) {
		const currentPlayer = gameConfig.players[currentPlayerIndex]
		button.innerText = currentPlayer

		if (checkWin(currentPlayer)) {
			setTimeout(() => {
				alert(`${currentPlayer} WON!`)
				resetGame()
			}, 200)
			return
		}

		if (isTie()) {
			setTimeout(() => {
				alert('TIE!')
				resetGame()
			}, 200)
			return
		}

		currentPlayerIndex = 1 - currentPlayerIndex // Switch player
	}
}

const checkWin = (player) =>
	gameConfig.winCombinations.some((combination) =>
		combination.every((index) => buttons[index].innerText === player)
	)

const isTie = () => buttons.every((button) => button.innerText)

const resetGame = () => {
	buttons.forEach((button) => (button.innerText = ''))
	currentPlayerIndex = 0
}

initializeGameBoard()
