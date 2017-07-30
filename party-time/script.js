const body = document.body;

for (let i=0; i < 50; i++) {
	const div = document.createElement('div');
	div.className = 'square';
	body.appendChild(div);
}

const squares = document.querySelectorAll('.square');
const speeds = [100, 250, 500, 1000];

let colors = [];
let animationDone = true;
let currentSpeed = 2;

for (square of squares) {
	square.addEventListener('click', () => {
		currentSpeed++;
		if (currentSpeed > speeds.length-1) {
			currentSpeed = 0;
		}
	});
}

setInterval(animateColors, 50);
animateColors();

function getRandomColor() {
	const r = Math.round(255 * Math.random());
	const g = Math.round(255 * Math.random());
	const b = Math.round(255 * Math.random());

	return {r, g, b};
}

function getSquareColors() {
	colors = [];
	for (square of squares) {
		colors.push(getRandomColor());
	}
}

function animateColors() {
	if (animationDone) {
		getSquareColors();
		for (const [index, square] of squares.entries()) {
			let currentColor = window.getComputedStyle(square).backgroundColor;
			currentColor = currentColor.substring(4, currentColor.length-1)
																.replace(/ /g, '').split(',');
	    currentColor = {r: currentColor[0], g: currentColor[1], b: currentColor[2]};
			fadeColor(square, 'background-color', currentColor, colors[index], speeds[currentSpeed]);
		}

		animationDone = false;
	}
}

// ------- ANIMATION SECTION ---- //

// General animate function with animation frame requests
function animate({duration, draw, timing}) {
	let start = performance.now();

	requestAnimationFrame(function animate(time) {
		let timeFraction = (time - start) / duration;
		if (timeFraction > 1) timeFraction = 1;

		let progress = timing(timeFraction);
		
		draw(progress);

		if (timeFraction < 1) {
			requestAnimationFrame(animate);
		} else {
			animationDone = true;
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

// ------- END ANIMATION SECTION ---- //