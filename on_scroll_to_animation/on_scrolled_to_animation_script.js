// Query for elements needed
const buttons = document.querySelectorAll(".btn");
const darkness = document.querySelector("#darkness");
const navbar = document.querySelector(".navbar");
const paragraphs = navbar.querySelectorAll("p");

// Constants
const body = document.body;
const multiOptions = [1, 2, 3];
const smallMedia = window.matchMedia("(max-width: 767px)");

// Variables
let multi = 2;
let animDuration = 150;
let black = false;
let textInterval = null;
let backgroundInterval = null;

// Initialize button classes
setButtonClasses();

// Initialize slider
const slider1 = new Slider('#slider1', {
	formatter: (value) => {
		return value;
	},
	step: 10,
	min: 150,
	max: 1500,
	value: animDuration
});

const slider2 = new Slider('#slider2', {
	formatter: (value) => {
		return value;
	},
	step: 10,
	min: 150,
	max: 1500,
	value: animDuration
});

// On slide listener
slider1.on("slideStop", (value) => {
	animDuration = value;
	slider2.setValue(value);
});

slider2.on("slideStop", (value) => {
	animDuration = value;
	slider1.setValue(value);
});

// Body scroll listener
function scrollListener() {
	checkDarkness();
}

window.addEventListener("scroll", () => { scrollListener() });

//Check if "darkness" is past activation point and set animation if needed
function checkDarkness() {
	const topPixels = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
	const change = topPixels > darkness.offsetTop - window.innerHeight * (1 / multiOptions[multi-1]);

	if (change === black) {
		return;
	} else {
		black = !black;
	}

	// Toggle color theme of navbar
	navbar.classList.toggle("navbar-inverse");
	navbar.classList.toggle("navbar-default");

	// Toggle text color of navbar
	for (p of paragraphs) {
		p.classList.toggle("lightText");
	}

	let bodyStyle = window.getComputedStyle(body, null);

	// Calculate current color of body background
	let colorArr = bodyStyle.backgroundColor;
	colorArr = colorArr.substring(4, colorArr.length - 1).replace(/ /g, '').split(',');
	const currentColor = { r: colorArr[0], g: colorArr[1], b: colorArr[2] };

	// Set new color to animate background to
	const newColorArr = change ? [10, 10, 10] : [255, 255, 255];
	const newColor = { r: newColorArr[0], g: newColorArr[1], b: newColorArr[2] }

	// Calculate current color of body text
	let textColorArr = bodyStyle.color;
	textColorArr = textColorArr.substring(4, textColorArr.length - 1).replace(/ /g, '').split(',');
	const currenteTextColor = { r: textColorArr[0], g: textColorArr[1], b: textColorArr[2] };

	// Set new color to animate text to
	const newTextColorArr = change ? [255, 255, 255] : [51, 51, 51];
	const newTextColor = { r: newTextColorArr[0], g: newTextColorArr[1], b: newTextColorArr[2] };

	// Animate background color change
	window.cancelAnimationFrame(backgroundInterval);
	fade(body, "background-color", currentColor, newColor, animDuration, backgroundInterval);

	// Animate text color change
	window.cancelAnimationFrame(textInterval);
	fade(body, "color", currenteTextColor, newTextColor, animDuration, textInterval);
}

// Linear interpolator
function lerp(color1, color2, ratio) {
	return (1 - ratio) * color1 + ratio * color2;
}

// Fade animation
function fade(element, property, start, end, duration, interval) {
	const smoothing = 10;
	const steps = duration / smoothing;
	const stepsRatio = 1.0 / steps;
	let ratio = 0.0;

	function fading() {
		let r = Math.round(lerp(start.r, end.r, ratio));
		let g = Math.round(lerp(start.g, end.g, ratio));
		let b = Math.round(lerp(start.b, end.b, ratio));
		let colorname = `rgb(${r}, ${g}, ${b})`;

		element.style.setProperty(property, colorname);
		ratio += stepsRatio;

		if (ratio < 1.0) {
			myInterval = window.requestAnimationFrame(fading);
		}
	}

	window.requestAnimationFrame(fading);
}

// Set button classes to active or not
function setButtonClasses() {
	for (const [index, btn] of buttons.entries()) {
		if (multi-1 === index%3 || btn.classList.contains("active")) {
			btn.classList.toggle("active");
		}
	}
}

// onclick method for buttons
function activationPointBtnClick(num) {
	multi = num;
	setButtonClasses();
	checkDarkness();
}

window.onresize = checkDarkness;
checkDarkness();