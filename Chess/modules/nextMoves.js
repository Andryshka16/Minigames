let nextMoves = []
let pending = []
let a, b

function getNextMove(piece, coordinates, check = false) {
	[a, b] = coordinates
	recentPieceCrd = coordinates
	nextMoves = []

	switch (true) {
		case piece[1] === 'K':
			nextMoves = [
				[a - 1, b - 1],
				[a - 1, b],
				[a - 1, b + 1],
				[a, b + 1],
				[a + 1, b - 1],
				[a, b - 1],
				[a + 1, b + 1],
				[a + 1, b]
			]
			break

		case piece[1] === 'N':
			nextMoves = [
				[a + 2, b - 1],
				[a + 2, b + 1],
				[a - 2, b + 1],
				[a - 2, b - 1],
				[a + 1, b + 2],
				[a - 1, b + 2],
				[a + 1, b - 2],
				[a - 1, b - 2]
			]
			break

		case piece[1] === 'Q':
			getBishopMoves()
			getRookMoves()
			break

		case piece[1] === 'B':
			getBishopMoves()
			break

		case piece[1] === 'R':
			getRookMoves()
			break

		case piece[1] === 'P':
			getPawnMoves(piece)
			break
	}

	filterNextMoves(piece)

	if (check) {
		return nextMoves
	}

	drawDots()
}

function getRookMoves() {
	for (let i = 1; a + i < 8; i++) {
		nextMoves.push([a + i, b])
		if (gameField[b][a + i] !== '0') {
			break
		}
	}
	for (let i = 1; a - i >= 0; i++) {
		nextMoves.push([a - i, b])
		if (gameField[b][a - i] !== '0') {
			break
		}
	}
	for (let i = 1; b + i < 8; i++) {
		nextMoves.push([a, b + i])
		if (gameField[b + i][a] !== '0') {
			break
		}
	}
	for (let i = 1; b - i >= 0; i++) {
		nextMoves.push([a, b - i])
		if (gameField[b - i][a] !== '0') {
			break
		}
	}
}

function getBishopMoves() {
	for (let i = 1; a + i < 8 && b + i < 8; i++) {
		nextMoves.push([a + i, b + i])
		if (gameField[b + i][a + i] !== '0') {
			break
		}
	}
	for (let i = 1; a - i >= 0 && b - i >= 0; i++) {
		nextMoves.push([a - i, b - i])
		if (gameField[b - i][a - i] !== '0') {
			break
		}
	}
	for (let i = 1; b + i < 8 && a - i >= 0; i++) {
		nextMoves.push([a - i, b + i])
		if (gameField[b + i][a - i] !== '0') {
			break
		}
	}
	for (let i = 1; b - i >= 0 && a + i < 8; i++) {
		nextMoves.push([a + i, b - i])
		if (gameField[b - i][a + i] !== '0') {
			break
		}
	}
}

function getPawnMoves(pawn) {
	k = pawn === 'wP' ? -1 : 1

	if (b === 1 && pawn === 'bP' && gameField[b + k][a] === '0') {
		nextMoves = [
			[a, b + k],
			[a, b + 2 * k]
		]
	} else if (b === 6 && pawn === 'wP' && gameField[b + k][a] === '0') {
		nextMoves = [
			[a, b + k],
			[a, b + 2 * k]
		]
	} else {
		nextMoves = [[a, b + k]]
	}

	nextMoves = nextMoves.filter((element) => gameField[element[1]][element[0]] === '0')
	;(a > 0 && gameField[b + k][a - 1] !== '0') || gameFieldElements[b][a - 1] === enPassing
		? nextMoves.push([a - 1, b + k])
		: 0
	;(a < 7 && gameField[b + k][a + 1] !== '0') || gameFieldElements[b][a + 1] === enPassing
		? nextMoves.push([a + 1, b + k])
		: 0
}

function pawnPass(x2, y2) {
	document.querySelectorAll('.figure').forEach((i) => (i.style.pointerEvents = 'none'))

	pending = []
	gameFieldElements[y2][x2].remove()

	choice = y2 === 7 ? blackPass : whitePass

	choice.style.visibility = 'visible'
	choice.style.top = `${y2 * 60 - (y2 * 60) / 7}px`
	choice.style.marginLeft = `${x2 < 7 ? x2 * 60 - 5 : x2 * 60 - 60 - 5}px`

	pending = [
		[x2, y2],
		[x2, y2 === 7 ? y2 - 1 : y2 + 1],
		[x2 < 7 ? x2 + 1 : x2 - 1, y2],
		[x2 < 7 ? x2 + 1 : x2 - 1, y2 === 7 ? y2 - 1 : y2 + 1]
	]

	pending = pending.map((i) => [gameField[i[1]][i[0]], i[0], i[1]])

	createChessPiece(turns[turn] + 'Q', x2, y2, 'passing')
	createChessPiece(turns[turn] + 'N', x2 < 7 ? x2 + 1 : x2 - 1, y2, 'passing')
	createChessPiece(turns[turn] + 'B', x2, y2 === 7 ? y2 - 1 : y2 + 1, 'passing')
	createChessPiece(turns[turn] + 'R', x2 < 7 ? x2 + 1 : x2 - 1, y2 === 7 ? y2 - 1 : y2 + 1, 'passing')
}

function isPinned([x1, y1], [x2, y2]) {
	let pinK = true
	let pinF = false

	if ((x1 === x2 || y1 === y2 || Math.abs(x2 - x1) === Math.abs(y2 - y1)) && !(x1 === x2 && y1 === y2)) {
		let kX = x1 > x2 ? -1 : x1 < x2 ? 1 : 0
		let kY = y1 > y2 ? -1 : y1 < y2 ? 1 : 0

		for (let i = 1; i * kX + x1 !== x2 || i * kY + y1 !== y2; i++) {
			if (gameField[y1 + i * kY][x1 + i * kX] !== '0') {
				pinK = false
				break
			}
		}

		for (let i = 1; i * -kX + x1 < 8 && i * -kX + x1 >= 0 && i * -kY + y1 < 8 && i * -kY + y1 >= 0; i++) {
			if (
				[turns[turn] + 'Q', turns[turn] + 'R'].includes(gameField[y1 + i * -kY][x1 + i * -kX]) &&
				(kX === 0 || kY === 0)
			) {
				pinF = true
			} else if (
				[turns[turn] + 'Q', turns[turn] + 'B'].includes(gameField[y1 + i * -kY][x1 + i * -kX]) &&
				kX !== 0 &&
				kY !== 0
			) {
				pinF = true
			} else if (gameField[y1 + i * -kY][x1 + i * -kX] !== '0') {
				break
			}
		}
	}
	return pinF && pinK
}

function filterNextMoves(piece) {
	nextMoves = nextMoves.filter(
		(element) =>
			element[0] >= 0 &&
			element[0] < 8 &&
			element[1] >= 0 &&
			element[1] < 8 &&
			gameField[element[1]][element[0]][0] !== piece[0]
	)

	if (piece[1] === 'K') {
		nextMoves = nextMoves.filter((i) => !checkForChecks(i))
		canCastle(piece)
	}

	if (coverMoves.toString() !== '' && piece[1] !== 'K') {
		nextMoves = nextMoves.filter((i) => coverMoves.map((e) => e.toString()).includes(i.toString()))
	}

	let [x2, y2] = kingCoordinates(turn + 'K')

	if (isPinned([a, b], [x2, y2])) {
		console.log(gameField[b][a], 'is Pinned')

		nextMoves = nextMoves.filter(function (move) {
			if (a === x2) {
				return move[0] === x2
			} else if (b === y2) {
				return move[1] === y2
			} else {
				return x2 + y2 === move[0] + move[1]
			}
		})
	}
}
