function createChessPiece(name, x, y, passing) {
	if (gameFieldElements[y][x] !== '0') {
		gameFieldElements[y][x].remove()
	}

	element = document.createElement('img')
	element.src = `figures/${name}.png`
	element.style.transform = `scale(0.7)`
	element.className = 'figure'
	element.style.cursor = 'pointer'
	element.draggable = false

	switch (name[1]) {
		case 'P':
			element.style.transform = 'scale(0.6)'
			element.style.marginTop = '-4px'
			break
		case 'Q':
			element.style.transform = 'scale(0.85)'
			element.style.marginTop = '3px'
			break
		case 'K':
			element.style.transform = 'scale(0.8)'
			break
		case 'B':
			element.style.transform = 'scale(0.8)'
	}

	element.style.top = `${y * 60}px`
	element.style.marginLeft = `${x * 60 - 60 * 8}px`

	gameFieldElements[y][x] = element
	gameField[y][x] = name

	addBinds(element, passing)

	game.appendChild(element)
}

function addBinds(element, passing) {
	element.addEventListener('mouseover', () => {
		let scale = Number(element.style.transform.slice(6, element.style.transform.indexOf(')')))
		element.style.transform = `scale(${scale * 1.3})`
	})

	element.addEventListener('mouseout', () => {
		let scale = Number(element.style.transform.slice(6, element.style.transform.indexOf(')')))
		element.style.transform = `scale(${scale / 1.3})`
	})

	if (passing === 'passing') {
		element.addEventListener('click', () => {
			let [x, y] = [
				Number(element.style.marginLeft.slice(0, -2)) / 60 + 8,
				Number(element.style.top.slice(0, -2)) / 60
			]

			document.querySelectorAll('.figure').forEach((i) => (i.style.pointerEvents = 'auto'))

			pending.forEach((e, i) => {
				if (i === 0) {
					createChessPiece(gameField[y][x], e[1], e[2])
				} else if (e[0] !== '0') {
					createChessPiece(...e)
				} else {
					gameFieldElements[e[2]][e[1]].remove()
					gameField[e[2]][e[1]] = '0'
				}
			})
			choice.style.visibility = 'hidden'
			checkSituation()
		})
		return
	}

	element.addEventListener('click', () => {
		let [x, y] = [
			Number(element.style.marginLeft.slice(0, -2)) / 60 + 8,
			Number(element.style.top.slice(0, -2)) / 60
		]

		if (
			gameField[y][x][0] === turn &&
			!nextMoves.map((element) => element.toString()).includes([x, y].toString())
		) {
			getNextMove(gameField[y][x], [x, y])
		} else {
			movePiece(x, y)
		}
	})
}
