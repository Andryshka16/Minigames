let turn = 'w'
const turns = { w: 'b', b: 'w' }

const color1 = 'rgb(255,195,151)'
const color2 = 'rgb(39,39,39)'

const game = document.querySelector('#gameContainer')
const whitePass = document.querySelector('#whitePass')
const blackPass = document.querySelector('#blackPass')

let recentPieceCrd, enPassing, choice
let castlingMoved = []

for (let i = 0; i < 64; i++) {
	let cell = document.createElement('div')
	cell.className = 'cell'
	cell.style.backgroundColor = Math.floor(i / 8) % 2 ? (i % 2 ? color1 : color2) : i % 2 ? color2 : color1
	cell.addEventListener('click', () => movePiece(i % 8, (i - (i % 8)) / 8))
	game.appendChild(cell)
}

let gameField = [
	['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
	['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
	['0', '0', '0', '0', '0', '0', '0', '0'],
	['0', '0', '0', '0', '0', '0', '0', '0'],
	['0', '0', '0', '0', '0', '0', '0', '0'],
	['0', '0', '0', '0', '0', '0', '0', '0'],
	['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
	['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR']
]

// let gameField = [
//     [ '0', 'bR', '0', '0', '0', '0', '0', '0' ],
//     [ 'wP', '0', '0', '0', '0', 'bK', 'wP', 'wP' ],
//     [ '0', '0', '0', '0', '0', '0', '0', '0' ],
//     [ '0', '0', '0', 'bB', '0', '0', '0', '0' ],
//     [ '0', '0', '0', '0', '0', 'wN', '0', '0' ],
//     [ 'wK', 'wQ', '0', 'bB', '0', '0', '0', '0' ],
//     [ 'bP', '0', 'wP', 'bP', '0', '0', '0', 'bP' ],
//     [ '0', "0", '0', '0', '0', '0', '0', '0' ]
// ]

let gameFieldElements = [...Array(8)].map(() => Array(8).fill('0'))

for (let y = 0; y < 8; y++) {
	for (let x = 0; x < 8; x++) {
		if (gameField[y][x] !== '0') {
			createChessPiece(gameField[y][x], x, y)
		}
	}
}

const clearDots = () => {
	document.querySelectorAll('.dot').forEach((element) => element.remove())
}

function drawDots() {
	clearDots()
	for (let i = 0; i < nextMoves.length; i++) {
		let dot = document.createElement('div')
		dot.className = 'dot'
		dot.style.top = `${nextMoves[i][1] * 60}px`
		dot.style.marginLeft = `${nextMoves[i][0] * 60}px`
		game.appendChild(dot)
	}
}

function movePiece(x2, y2) {
	clearDots()

	if (nextMoves.map((i) => i.toString()).includes([x2, y2].toString())) {
		let [x1, y1] = recentPieceCrd

		turn = turns[turn]

		enPassing = gameField[y1][x1][1] === 'P' && Math.abs(y2 - y1) === 2 ? gameFieldElements[y1][x1] : 0

		if (
			gameField[y1][x1][1] === 'K' ||
			(gameField[y1][x1][1] === 'R' && !castlingMoved.includes(gameFieldElements[y1][x1]))
		) {
			castlingMoved.push(gameFieldElements[y1][x1])
		}

		if (gameField[y1][x1][1] === 'K' && Math.abs(x2 - x1) > 1) {
			let k = x2 > x1 ? 1 : -1
			gameFieldElements[y1][x1 + k] = gameFieldElements[y2][x2]
			gameFieldElements[y1][x1 + 2 * k] = gameFieldElements[y1][x1]
			gameFieldElements[y1][x1 + k].style.marginLeft = `${(x1 + k) * 60 - 60 * 8}px`
			gameFieldElements[y1][x1 + 2 * k].style.marginLeft = `${(x1 + 2 * k) * 60 - 60 * 8}px`
			gameFieldElements[y1][x1] = '0'
			gameFieldElements[y2][x2] = '0'
			gameField[y1][x1 + k] = gameField[y2][x2]
			gameField[y1][x1 + 2 * k] = gameField[y1][x1]
			gameField[y1][x1] = '0'
			gameField[y2][x2] = '0'
			nextMoves = []
			return
		}

		if (gameField[y2][x2] !== '0') {
			gameFieldElements[y2][x2].remove()
		}

		if (gameField[y2][x2] === '0' && x2 !== x1 && gameField[y1][x1][1] === 'P') {
			gameFieldElements[gameField[y2][x2] === 'bP' ? y2 - 1 : y2 + 1][x2].remove()
			gameField[gameField[y2][x2] === 'bP' ? y2 - 1 : y2 + 1][x2] = '0'
		}

		gameField[y2][x2] = gameField[y1][x1]
		gameField[y1][x1] = '0'

		gameFieldElements[y2][x2] = gameFieldElements[y1][x1]
		gameFieldElements[y1][x1] = '0'

		gameFieldElements[y2][x2].style.top = `${y2 * 60}px`
		gameFieldElements[y2][x2].style.marginLeft = `${x2 * 60 - 60 * 8}px`

		if ((y2 === 0 || y2 === 7) && gameField[y2][x2][1] === 'P') {
			pawnPass(x2, y2)
		}

		checkSituation()
	}
	nextMoves = []
}
