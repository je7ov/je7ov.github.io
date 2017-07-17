const darkness = document.querySelector("#darkness");
const display = document.querySelector("#display");
const animDurationSlider = document.querySelector("#animDuration");
const rangeDisplay = document.querySelector("#rangeDisplay");
const body = document.body;
const msg = "<strong>Current Point:</strong>";
const selections = ["Instant", "Half", "Third"];

let backgroundInterval = null;
let textInterval= null;
let black = false;
let multi = 2;
let animDuration;
handleAnimDurationSlider();


setDisplay(selections[multi-1]);

function setDisplay(str) {
	display.innerHTML = `${msg} ${str}`;
}

function handleAnimDurationSlider() {
	animDuration = animDurationSlider.value;
	rangeDisplay.innerHTML = animDurationSlider.value;
}

function scrollListener() {
	checkDarkness();
}

function checkDarkness() {
	// Calculate if element is past certain point
	const change = body.scrollTop > darkness.offsetTop - window.innerHeight * (1 / multi);

	if (change === black) {
		return;
	} else {
		black = !black;
	}

	let bodyStyle = window.getComputedStyle(body, null);

	// Calculate current color of body background
	let colorArr = bodyStyle.backgroundColor;
	colorArr = colorArr.substring(4, colorArr.length - 1).replace(/ /g, '').split(',');
	const currentColor = { r: colorArr[0], g: colorArr[1], b: colorArr[2] };

	// Set new color to animate background to
	const newColorArr = change ? [0, 0, 0] : [255, 255, 255];
	const newColor = { r: newColorArr[0], g: newColorArr[1], b: newColorArr[2] }

	// Calculate current color of body text
	let textColorArr = bodyStyle.color;
	textColorArr = textColorArr.substring(4, textColorArr.length - 1).replace(/ /g, '').split(',');
	const currenteTextColor = { r: textColorArr[0], g: textColorArr[1], b: textColorArr[2] };

	// Set new color to animate text to
	const newTextColorArr = change ? [255, 255, 255] : [0, 0, 0];
	const newTextColor = { r: newTextColorArr[0], g: newTextColorArr[1], b: newTextColorArr[2] };

	// Animate background color change
	window.cancelAnimationFrame(backgroundInterval);
	fade(body, "background-color", currentColor, newColor, animDuration, backgroundInterval);

	// Animate text color change
	window.cancelAnimationFrame(textInterval);
	fade(body, "color", currenteTextColor, newTextColor, animDuration, textInterval);
}

function setMulti(num) {
	multi = num;
	checkDarkness();
	setDisplay(selections[num-1]);
}

function lerp(color1, color2, ratio) {
	return (1 - ratio) * color1 + ratio * color2;
}

function fade(element, property, start, end, duration, myInterval) {
	const interval = 10;
	const steps = duration / interval;
	const step_ratio = 1.0 / steps;
	let ratio = 0.0;

	function fading() {
		let r = Math.round(lerp(start.r, end.r, ratio));
		let g = Math.round(lerp(start.g, end.g, ratio));
		let b = Math.round(lerp(start.b, end.b, ratio));
		let colorname = `rgb(${r}, ${g}, ${b})`;
		console.log(colorname);

		element.style.setProperty(property, colorname);
		ratio += step_ratio;
		console.log(ratio);

		if (ratio < 1.0) {
			myInterval = window.requestAnimationFrame(fading);
		}
	}

	window.requestAnimationFrame(fading);
}