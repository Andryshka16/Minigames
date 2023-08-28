let checkCRD = []

let coverMoves = []
let kingEscape = []

function canCastle(king) {
	let rooks = [a + 3, a - 4]

	for (let rook of rooks) {
		let suitable = true

		switch (true) {
			case a !== 4:
				suitable = false
				break
			case gameField[b][rook] !== king[0] + 'R':
				suitable = false
				break
			case castlingMoved.includes(gameFieldElements[b][a]):
				suitable = false
				break
			case castlingMoved.includes(gameFieldElements[b][rook]):
				suitable = false
				break
			case checkForChecks([a, b]):
				suitable = false
				break
		}

		for (let i = Math.min(rook, a) + 1; i < Math.max(rook, a); i++) {
			if (gameField[b][i] !== '0') {
				suitable = false
				break
			} else if (i !== 1 && checkForChecks([i, b])) {
				suitable = false
				break
			}
		}

		if (suitable) {
			nextMoves.push([rook, b])
		}
	}
}

function checkForChecks([a, b], color = turns[turn]) {
	let check = 0

	function checkCell([x, y], piece, i) {
		if (gameField[y][x] !== '0' && gameField[y][x] !== turns[color] + 'K') {
			if (gameField[y][x] === color + 'K' && Math.abs(i) === 1) {
				checkCRD = [x, y]
				check += 1
			} else if (gameField[y][x] === color + 'Q' || gameField[y][x] === color + piece) {
				checkCRD = [x, y]
				check += 1
			} else if (piece === 'B' && gameField[y][x] === color + 'P' && (color === 'w' ? 1 : -1) === i) {
				checkCRD = [x, y]
				check += 1
			}

			return true
		}
	}

	// Rook check

	for (let i = 1; a + i < 8; i++) {
		if (checkCell([a + i, b], 'R', i)) {
			break
		}
	}
	for (let i = 1; a - i >= 0; i++) {
		if (checkCell([a - i, b], 'R', i)) {
			break
		}
	}
	for (let i = 1; b + i < 8; i++) {
		if (checkCell([a, b + i], 'R', i)) {
			break
		}
	}
	for (let i = 1; b - i >= 0; i++) {
		if (checkCell([a, b - i], 'R', i)) {
			break
		}
	}

	// Bishop check

	for (let i = 1; a + i < 8 && b + i < 8; i++) {
		if (checkCell([a + i, b + i], 'B', i)) {
			break
		}
	}
	for (let i = 1; a - i >= 0 && b - i >= 0; i++) {
		if (checkCell([a - i, b - i], 'B', -i)) {
			break
		}
	}
	for (let i = 1; b + i < 8 && a - i >= 0; i++) {
		if (checkCell([a - i, b + i], 'B', i)) {
			break
		}
	}
	for (let i = 1; b - i >= 0 && a + i < 8; i++) {
		if (checkCell([a + i, b - i], 'B', -i)) {
			break
		}
	}

	let pawns =
		color === 'w'
			? [
					[a - 1, b + 1],
					[a + 1, b + 1]
			  ]
			: [
					[a - 1, b - 1],
					[a + 1, b - 1]
			  ]
	for (let i of pawns) {
	}

	let knights = [
		[a - 2, b - 1],
		[a - 1, b + 2],
		[a - 2, b + 1],
		[a + 1, b + 2],
		[a + 2, b - 1],
		[a - 1, b - 2],
		[a + 2, b + 1],
		[a + 1, b - 2]
	]

	knights = knights.filter(
		(i) => i[0] >= 0 && i[0] < 8 && i[1] >= 0 && i[1] < 8 && gameField[i[1]][i[0]][0] !== turn
	)

	knights.forEach((knight) => {
		;[x, y] = knight
		if (gameField[y][x][1] === 'N') {
			checkCRD = knight
			check += 1
		}
	})

	return check
}

function kingCoordinates(king) {
	let kng
	gameField.forEach((row, y) => {
		row.forEach((column, x) => {
			if (column === king) {
				kng = [x, y]
			}
		})
	})
	return kng
}

function checkMate([a1, b1], [a2, b2]) {
	kingEscape = []
	let mate = true

	kingEscape.push(...getNextMove(turn + 'K', [a1, b1], true))

	if (checkForChecks([a1, b1]) > 1) {
		if (kingEscape.toString()) {
			mate = false
			coverMoves.push('No moves for pieces except the king')
		}
		return mate
	}

	let xK = a1 === a2 ? 0 : 1
	let yK = b1 === b2 ? 0 : 1

	for (
		let i = 1;
		i * xK + Math.min(a1, a2) < Math.max(a1, a2) || i * yK + Math.min(b1, b2) < Math.max(b1, b2);
		i++
	) {
		coverMoves.push([a1 + (a1 < a2 ? i : -i) * xK, b1 - (b1 > b2 ? i : -i) * yK])
	}

	coverMoves.push([a2, b2])

	gameField.forEach((row, i) => {
		row.forEach((piece, j) => {
			if (piece[0] === turn) {
				if (getNextMove(piece, [j, i], true).toString()) {
					mate = false
				}
			}
		})
	})

	return mate
}

function checkForDraw(turn) {
	let draw = true

	gameField.forEach((row, i) => {
		row.forEach((piece, j) => {
			if (piece[0] === turn) {
				if (getNextMove(piece, [j, i], true).toString()) {
					draw = false
				}
			}
		})
	})

	return draw
}

function checkSituation() {
	coverMoves = []

	if (checkForChecks(kingCoordinates(turn + 'K'))) {
		console.log('CHECK!', checkCRD)
		if (checkMate(kingCoordinates(turn + 'K'), checkCRD)) {
			console.log('MATE, GAME OVER!')
		}
	}

	if (checkForDraw(turn) && !checkForChecks(kingCoordinates(turn + 'K'))) {
		console.log('DRAW, GAME OVER!')
	}
}
