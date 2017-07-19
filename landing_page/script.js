// Get references to elements needed
const topNavPadding = document.querySelector("#top-nav-padding");
const projects = document.querySelector("#projects").querySelectorAll(".project-item");
const topNav = document.querySelector(".top-nav");

// Initialize variables
let topFixed = false;
let topNavPixels = topNav.offsetTop;
let scrollAnimationFrame = null;

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

// General animate function with animation frame requests
function animate({duration, draw, timing}) {
	let start = 1.0 * performance.now();

	return requestAnimationFrame(function animate(time) {
		let timeFraction = (time - start) / duration;
		if (timeFraction > 1) timeFraction = 1;
		else if (timeFraction < 0) timeFraction = 0;

		let progress = timing(timeFraction);
		
		draw(progress);

		if (timeFraction < 1) {
			requestAnimationFrame(animate);
		}
	});
}

function scrollToID(id) {
	let wasFixed = topFixed;
	const topPixels = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
	if (id.substring(0, 1) !== "#") {
		id = `#${id}`;
	}
	const anchor = document.querySelector(id);
	const anchorStyle = window.getComputedStyle(anchor, null);
	let anchorHeight = anchorStyle.height;
	anchorHeight = Number(anchorHeight.substring(0, anchorHeight.indexOf("px")));

	if (anchor.offsetTop - anchorHeight === topPixels) {
		return;
	}

	let pixelsToScroll = anchor.offsetTop - topPixels - anchorHeight;
	const animDuration = Math.abs(pixelsToScroll) / 5;

	scrollAnimationFrame = animate({
		duration: animDuration,
		timing: makeEaseInOut(quad),
		draw: (progress) => {

			window.scrollTo(0, (pixelsToScroll * progress) + topPixels);
		}
	})
}

// Handle functionality of top navigation buttons fixing to top
function checkTopNav() {
	const topPixels = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
	if (topFixed) {
		if (topPixels < topNavPixels) {
			topNav.classList.toggle("fixed-top");
			topNavPadding.classList.toggle("top-nav-padding");
			topNavPadding.classList.toggle("hidden");
			topFixed = false;
		}
	} else {
		let topNavPixels = topNav.offsetTop;
		if (topPixels >= topNavPixels) {
			topNav.classList.toggle("fixed-top");
			topNavPadding.classList.toggle("top-nav-padding");
			topNavPadding.classList.toggle("hidden");
			topFixed = true;
		}
	}
}

// Add scroll listener
function scrollListener() {
	window.cancelAnimationFrame(scrollAnimationFrame);
	checkTopNav();
}
window.addEventListener("scroll", scrollListener);

// Flip every other project item listed
for (const [index, project] of projects.entries()) {
	const divs = project.children;
	let colCount = 0;
	if (index%2 == 1) {
		for (let i=0; i < divs.length; i++) {
			const divClass = divs[i].classList[0];
			const colType = divClass.substring(0, 7);
			const colNum = divClass.substring(7, divClass.length);
			const pushing = i === 0;
			const newClass = `${colType}${pushing ? "push-" : "pull-"}${12 - colNum}`;

			divs[i].classList.add(newClass);
		}
	}
}
