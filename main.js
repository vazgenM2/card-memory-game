let openedCard = []
let cardsData;
let points = 0
let tries = 0
let finalPoint = 0
let timerInterval;

function randomSort(a, b) {
	return 0.5 - Math.random();
}

document.querySelector('.start-btn').addEventListener('click', async () => {
	let boardSize = document.querySelector('#size').value
	let timer = document.querySelector('#timer').value
	let cardsType = document.querySelector('#type').value
	let cardStyle = {
		size: 0,
		fontSize: 0,
	}
	let time = [0, 0]

	finalPoint = (boardSize * boardSize) / 2

	await fetch('./data.json')
		.then(res => res.json())
		.then(res => cardsData = res)

	cardsData = [...cardsData[cardsType][boardSize], ...cardsData[cardsType][boardSize]]
	cardsData.sort(randomSort)

	document.querySelector('.home').style.display = 'none'
	document.querySelector('.game').style.display = 'flex'

	// =========================== Set cards' styles
	if (boardSize == '4') {
		cardStyle.size = 147
		cardStyle.fontSize = 70
	}
	else if (boardSize == '6') {
		cardStyle.size = 98
		cardStyle.fontSize = 45
	}
	else if (boardSize == '8') {
		cardStyle.size = 73
		cardStyle.fontSize = 30
	}

	if (cardsType == 'color-text') {
		cardStyle.fontSize = '30'
	}

	// =============== Timer
	if (timer !== 'none') {
		time[0] = +timer
		setTime(time[0], time[1])

		timerInterval = setInterval(() => {
			if (time[1] > 0) {
				time[1]--
			} else if (time[0] > 0) {
				time[0]--
				time[1] = 59
			} else {
				clearInterval(timerInterval)
				gameEnd(0)
			}
			setTime(time[0], time[1])
		}, 1000)
	} else {
		document.querySelector('.timer').innerHTML = '-'
	}

	for (let i = 0; i < boardSize * boardSize; i++) {
		let card = document.createElement('div')
		let front = document.createElement('div')
		front.classList.add('front')
		let back = document.createElement('div')
		back.classList.add('back')
		back.style.fontSize = cardStyle.fontSize + 'px'

		if (cardsType === 'color') {
			back.innerHTML = ''
			back.style.background = cardsData[i]
		} else {
			back.innerHTML = cardsData[i]
		}

		card.setAttribute('value', cardsData[i])
		card.setAttribute('click', '1')
		card.appendChild(front)
		card.appendChild(back)
		card.classList.add("card")
		card.style.width = cardStyle.size + 'px'
		card.style.height = cardStyle.size + 'px'
		document.querySelector('.board').appendChild(card)

		card.addEventListener('click', () => {
			if (openedCard.length < 2 && card.getAttribute('click')) {
				card.setAttribute('click', '')
				card.style.transform = 'rotate3d(0,1,0,180deg)'
				openedCard.push(card)
				if (openedCard.length == 1) {
					return
				}
				else if (openedCard.length == 2) {
					setTimeout(() => {
						tries++
						document.querySelector('.tries').innerHTML = tries
						if (openedCard[0].getAttribute('value') == openedCard[1].getAttribute('value')) {
							openedCard[0].setAttribute('click', '')
							points++
							document.querySelector('.points').innerHTML = points
							if (points == finalPoint) gameEnd(1)
						}
						else {
							openedCard[0].setAttribute('click', '1')
							openedCard[1].setAttribute('click', '1')
							openedCard[0].style.transform = 'rotate3d(0,0,0,0deg)'
							openedCard[1].style.transform = 'rotate3d(0,0,0,0deg)'
						}
						openedCard.length = 0
					}, 1000)
				}
			}
		})
	}
})

document.querySelector('.back').addEventListener('click', backToStart)

function gameEnd(arg) {
	if (arg) {
		document.querySelector('.win').style.display = 'block'
		document.querySelector('.lose').style.display = 'none'
	} else {
		document.querySelector('.lose').style.display = 'block'
		document.querySelector('.win').style.display = 'none'
	}
	document.querySelector('.message').style.display = 'block'
	setTimeout(() => { document.querySelector('.message').style.transform = 'translateX(-50%) translateY(-50%) scale(1)' }, 200)
	setTimeout(backToStart, 1500)
}

function backToStart() {
	points = 0
	tries = 0
	document.querySelector('.points').innerHTML = '0'
	document.querySelector('.tries').innerHTML = '0'
	clearInterval(timerInterval)

	document.querySelector('.home').style.display = 'flex'
	document.querySelector('.game').style.display = 'none'
	document.querySelector('.board').innerHTML = ''
	document.querySelector('.message').style.display = 'none'
}

function setTime(min, sec) {
	if (String(min).length == 1) min = '0' + min
	if (String(sec).length == 1) sec = '0' + sec
	document.querySelector('.timer').innerHTML = min + ':' + sec
}