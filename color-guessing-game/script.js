// variables
let colors = [];
let squares = [];
let correct, wrongCount, done;
let difficulty = 0;

// constants
const winResponses = ['Good job!', 'Nice job!', 'Awesome!', 'Winner!'];
const loseResponses = ['Nice try', 'Try again', 'Better luck next time', 'Too bad'];

// DOM references
const squareDivs = document.querySelectorAll('.square');
const squareBorders = document.querySelectorAll('.square-border');
const rgbDisplay = document.querySelector('span');
const resetButton = document.querySelector('#reset');
const easyButton = document.querySelector('#easy');
const hardButton = document.querySelector('#hard');
const title = document.querySelector('#title');
const secondRow = document.querySelector('.row:nth-of-type(2)');
const results = document.querySelector('h5');

initialize();

// Add listeners to squares
for (const [index, square] of squareDivs.entries()) {
	square.addEventListener('click', () => {
		if (!done) {
			if (index === correct) {
				// squareBorders[index].classList.add('correct');
				squareBorders[index].classList.add('lower');
				const randResponse = Math.floor(winResponses.length * Math.random());
				results.innerHTML = winResponses[randResponse];
				endGame();
			} else {
				squareBorders[index].classList.add('lower');
				squareBorders[index].classList.add('disappear');
				wrongCount++;
				if (wrongCount >= colors.length - 1) {
					const randResponse = Math.floor(loseResponses.length * Math.random());
					results.innerHTML = loseResponses[randResponse];
					endGame();
				};
			}
		}
	});

	squareBorders[index].addEventListener('mouseenter', () => {
		if (!done) squareBorders[index].classList.add('hovered');
	})

	squareBorders[index].addEventListener('mouseleave', () => {
		if (!done) squareBorders[index].classList.remove('hovered');
	})
}

// Add listeners to difficulty buttons
easyButton.addEventListener('click', () => {
	if (difficulty === 1) {
		difficulty = 0;
		easyButton.classList.add('active');
		hardButton.classList.remove('active');
		reset();
	}
});
hardButton.addEventListener('click', () => {
	if (difficulty === 0) {
		difficulty = 1;
		hardButton.classList.add('active');
		easyButton.classList.remove('active');
		reset();
	}
})

// Add listener to reset button
resetButton.addEventListener('click', reset);

// Initialize game
function initialize() {
	difficulty === 1 ? getRandomColors(6) : getRandomColors(3);
	correct = Math.floor(colors.length * Math.random());
	wrongCount = 0;
	done = false;

	if (difficulty === 0) {
		easyButton.classList.add('active');
		secondRow.classList.remove('reappear');
		secondRow.classList.add('disappear');
	} else {
		hardButton.classList.add('active');
		secondRow.classList.remove('disappear');
		secondRow.classList.add('reappear');
	}

	squares = [];
	for(const [index, color] of colors.entries()) {
		squares[index] = new squareObj(color)
	}

	// Initialize squares with colors
	for (let index=0; index < colors.length; index++) {
		squareDivs[index].style.backgroundColor = squares[index].color;
		squareBorders[index].style.background = squares[index].borderColor;
	}

	rgbDisplay.innerHTML = `(<span class='red'>${colors[correct].r}</span>,
													<span class='green'>${colors[correct].g}</span>,
													<span class='blue'>${colors[correct].b}</span>)`;

	title.style.backgroundColor = '#232323';
}

// Get a random rgb color
function randomColor() {
	const r = Math.round(255 * Math.random());
	const g = Math.round(255 * Math.random());
	const b = Math.round(255 * Math.random());
	return {r, g, b};
}

// Get a random color for each square
function getRandomColors(num) {
	colors = [];
	for (let i=0; i < num; i++) {
		colors[i] = randomColor();
	}
}

// Fade color property
function fade(element, property, start, end, duration) {
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

// Quadratic timing function
function quad(progress) {
	return Math.pow(progress, 2);
}

// End game
function endGame() {
	endGameSquares();
	fade(title, 'background-color', {r: 35, g: 35, b: 35}, colors[correct], 500);
	const red = document.querySelector('.red');
	const green = document.querySelector('.green');
	const blue = document.querySelector('.blue');
	red.classList.add('stroke');
	green.classList.add('stroke');
	blue.classList.add('stroke');
	done = true;
}

// Change all squares to correct color
function endGameSquares() {
	const delay = 80;
	let counter = 0;
	for (let index=0; index < colors.length; index++) {
		squareBorders[index].classList.remove('hovered', 'lower');
		if (index !== correct) {
			counter++;
			if (squareBorders[index].classList.contains('disappear')) {
				squareBorders[index].classList.remove('disappear');
				squareBorders[index].classList.add('reappear');
			}

			setTimeout(() => {
				const duration = 250;
				fade(squareDivs[index], 'background-color', colors[index], colors[correct], duration);
				fade(squareBorders[index], 'background-color', squares[index].borderColorRaw, squares[correct].borderColorRaw, duration);
			}, delay * counter);
		}
	}
}

function reset() {
	initialize();
	for (square of squareBorders) {
		square.classList.remove('lower', 'hovered', 'reappear', 'disappear');
	}
	results.innerHTML = '';
}