// variables
let colors = [];
let squares = [];
let correct, wrongCount, done, lose;
let score = 0;
let difficulty = 0;
let boardRows = 1;

// constants
const winResponses = ['Good job!', 'Nice job!', 'Awesome!', 'Winner!'];
const loseResponses = ['Nice try', 'Try again', 'Better luck next time', 'Too bad'];

// DOM references
let squareDivs = document.querySelectorAll('.square');
let squareBorders = document.querySelectorAll('.square-border');
const board = document.querySelector('#board');
const resultDisplay = document.querySelector('h5');
const resetButton = document.querySelector('#reset');
const difficultyButtons = document.querySelector('#difficulty-container').querySelectorAll('h4');
const rgbDisplay = document.querySelector('span');
const title = document.querySelector('#title');
const scoreDisplay = document.querySelector('#score');

// Start game
startup();
initialize();

// ------- GAME LOGIC SECTION ------- //
function startup() {
	// Add listeners to buttons
	for (const [index, button] of difficultyButtons.entries()) {
		button.addEventListener('click', () => {
			if (difficulty !== difficultyButtons.length - index -1) {
				difficulty = difficultyButtons.length - index - 1;
				setActiveDifficulty();
				reset();
			}
		});
	}

	scoreDisplay.innerHTML = '0';

	setActiveDifficulty();

	resetButton.addEventListener('click', () => {
		score = 0;
		scoreDisplay.innerHTML = '0';
		reset();
	});
}

function initialize() {
	const numColors = (difficulty + 1) * 3;
	colors = getRandomColors(numColors);
	correct = Math.floor(colors.length * Math.random());
	wrongCount = 0;
	done = false;
	lose = false;

	setupBoard();

	// Make square objects with the random colors
	squares = [];
	for (const [index, color] of colors.entries()) {
		squares[index] = new squareObj(color);
	}

	// Display colors of squares
	const duration = 750;
	for (const [index, square] of squareDivs.entries()) {
		const squareColor = getBackgroundColor(square);
		const squareBorderColor = getBackgroundColor(squareBorders[index]);
		fadeColor(square, 'background-color', squareColor, colors[index], duration);
		fadeColor(squareBorders[index], 'background-color', squareBorderColor, squares[index].borderColorRaw, duration);
	}

	rgbDisplay.innerHTML = `(<span class='red'>${colors[correct].r}</span>,
													<span class='green'>${colors[correct].g}</span>,
													<span class='blue'>${colors[correct].b}</span>)`;
    const titleColor = getBackgroundColor(title);
	fadeColor(title, 'background-color', titleColor, {r: 35, g: 35, b: 35}, 650);
}

function getBackgroundColor(element) {
	let bgColor = window.getComputedStyle(element).backgroundColor;
	bgColor = bgColor.substring(4, bgColor.length - 1).replace(/ /g, '').split(',');
	bgColor = {r: bgColor[0], g: bgColor[1], b: bgColor[2]}
	return bgColor;
}

// Set up the board
function setupBoard() {
	if (boardRows !== difficulty) {
		board.innerHTML = "";
		boardRows = difficulty;
		for (let i = 0; i <= difficulty; i++) {
			const rowDiv = document.createElement('div');
			rowDiv.className = 'row';
			for (let i=0; i < 3; i++) {
				const squareBorder = document.createElement('div');
				squareBorder.className = 'square-border';
				const squareInner = document.createElement('div');
				squareInner.className = 'square';
				squareBorder.appendChild(squareInner);
				rowDiv.appendChild(squareBorder);
			}
			board.appendChild(rowDiv);
		}

		squareDivs = document.querySelectorAll('.square');
		squareBorders = document.querySelectorAll('.square-border');
		addBoardListeners();
	}
}

// Add listeners to squares in the board
function addBoardListeners() {
	for (const [index, square] of squareBorders.entries()) {
		square.addEventListener('click', () => {
			if (!done && !square.classList.contains('disappear')) {
				if (index === correct) {
					correctGuess(square);
				} else {
					wrongGuess(square);
				}
			}
		});

		square.addEventListener('mouseenter', () => {
			if (!done) square.classList.add('hovered');
		});

		square.addEventListener('mouseleave', () => {
			if (!done) square.classList.remove('hovered');
		})
	}
}

function correctGuess(square) {
	square.classList.add('lower');
	const randResponse = Math.floor(winResponses.length * Math.random());
	resultDisplay.innerHTML = winResponses[randResponse];
	score++;
	setTimeout(reset, 1500);
	endGame();
}

function wrongGuess(square) {
	square.classList.add('lower', 'disappear');
	wrongCount++;
	// TODO: Adjust loss conditions
	if (wrongCount >= Math.sqrt(colors.length)) {
		const randResponse = Math.floor(loseResponses.length * Math.random());
		resultDisplay.innerHTML = loseResponses[randResponse];
		score = 0;
		lose = true;
		endGame();
	}
}

// Set current difficulty button to active
function setActiveDifficulty() {
	for (const [index, button] of difficultyButtons.entries()) {
		if (difficulty === difficultyButtons.length - index - 1) button.classList.add('active');
		else button.classList.remove('active');
	}
	score = 0;
	scoreDisplay.innerHTML = '0';
}

// Get random rgb color
function randomColor() {
	const r = Math.round(255 * Math.random());
	const g = Math.round(255 * Math.random());
	const b = Math.round(255 * Math.random());
	return {r, g, b};
}

// Get array of random colors
function getRandomColors(num) {
	colArr = [];
	for (let i=0; i < num; i++) colArr[i] = randomColor();
	return colArr;
}

// End game
function endGame() {
	setEndGameColors();
	const red = document.querySelector('.red');
	const green = document.querySelector('.green');
	const blue = document.querySelector('.blue');
	red.classList.add('stroke');
	green.classList.add('stroke');
	blue.classList.add('stroke');
	if (!lose) {
		scoreDisplay.innerHTML = `${score}`;
	}
	done = true;
}

// Change title background and all squares to correct color
function setEndGameColors() {
	const delay = 80;
	let counter = 0;

	const titleColor = getBackgroundColor(title);
	fadeColor(title, 'background-color', titleColor, colors[correct], 500);
	for (let index=0; index < colors.length; index++) {
		squareBorders[index].classList.remove('hovered', 'lower');
		if (index !== correct) {
			counter++;
			if (squareBorders[index].classList.contains('disappear')) {
				squareBorders[index].classList.remove('disappear');
				squareBorders[index].classList.add('reappear');
			}

			const duration = 350;
			setTimeout(() => {
				fadeColor(squareDivs[index], 'background-color', colors[index], colors[correct], duration);
				fadeColor(squareBorders[index], 'background-color', squares[index].borderColorRaw, squares[correct].borderColorRaw, duration);
			}, delay * counter);
		}
	}
}

// Reset game
function reset() {
	if (lose) scoreDisplay.innerHTML = '0';
	initialize();
	for (square of squareBorders) {
		square.classList.remove('lower', 'hovered', 'reappear', 'disappear');
	}
	resultDisplay.innerHTML = '';
}

// ------- END GAME LOGIC SECTION ------- //

// ------- ANIMATION SECTION ------- //

// General animate function with animation frame requests
function animate({duration, draw, timing}) {
	let start = performance.now();

	return requestAnimationFrame(function animate(time) {
		let timeFraction = (time - start) / duration;
		if (timeFraction > 1) timeFraction = 1;

		let progress = timing(timeFraction);
		
		draw(progress);

		if (timeFraction < 1) {
			requestAnimationFrame(animate);
		}
	});
}

// Fade color property
function fadeColor(element, property, start, end, duration) {
	animate({
		duration,
		timing: makeEaseInOut(quad),
		draw: (progress) => {
			let r = Math.round(lerp(start.r, end.r, progress));
			let g = Math.round(lerp(start.g, end.g, progress));
			let b = Math.round(lerp(start.b, end.b, progress));
			let colorname = `rgb(${r}, ${g}, ${b})`;

			element.style.setProperty(property, colorname);
		}
	})
}

// Linear interpolator
function lerp(a, b, ratio) {
	return (1 - ratio) * a + ratio * b;
}

// Quadratic timing function
function quad(progress) {
	return Math.pow(progress, 2);
}

// Turn timing function into ease in and out
function makeEaseInOut(timing, timeFraction) {
	return function(timeFraction) {
		if (timeFraction < .5) {
			return timing(2 * timeFraction) / 2;
		} else {
			return (2 - timing(2 * (1 - timeFraction))) / 2;
		}
	}
}

// ------- END ANIMATION SECTION ------- //