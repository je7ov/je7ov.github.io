// Get references to elements needed
const topNavPadding = document.querySelector("#top-nav-padding");
const projects = document.querySelector("#projects").querySelectorAll(".project-item");
const topNav = document.querySelector(".top-nav");
const topNavButtons = topNav.querySelectorAll("button");
const projectsAnchor = document.querySelector("#projects-anchor");
const aboutMeAnchor = document.querySelector("#about-me-anchor");
const contactsAnchor = document.querySelector("#contacts-anchor");

// Initialize variables
let topFixed = false;
let topNavPixels = topNav.offsetTop;
let scrollAnimationFrame = null;
let activeButton = -1;


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
function animate({duration, draw, timing, ref}) {
	let start = 1.0 * performance.now();

	ref = requestAnimationFrame(function animate(time) {
		let timeFraction = (time - start) / duration;
		if (timeFraction > 1) timeFraction = 1;
		else if (timeFraction < 0) timeFraction = 0;

		let progress = timing(timeFraction);
		
		draw(progress);

		if (timeFraction < 1) {
			ref = requestAnimationFrame(animate);
		}
	});
}

// Scrolls to HTML element with specified ID
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

	const pixelsToScroll = anchor.offsetTop - topPixels - anchorHeight + 60;
	const animDuration = Math.abs(pixelsToScroll) / 4.5;

	animate({
		duration: animDuration,
		timing: makeEaseInOut(quad),
		draw: (progress) => {
			window.scrollTo(0, (pixelsToScroll * progress) + topPixels);
		},
		ref: scrollAnimationFrame
	})
}

// Handle functionality of top navigation buttons fixing to top
function handleTopNav() {
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

function handleTopNavButtons() {
	const topPixels = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
	let noChange = false;

	// Check for first button
	const projectsAnchorStyle = window.getComputedStyle(projectsAnchor, null);
	let projectsAnchorHeight = projectsAnchorStyle.height;
	projectsAnchorHeight = Number(projectsAnchorHeight.substring(0, projectsAnchorHeight.indexOf("px")));
	const projectsAnchorScroll = projectsAnchor.offsetTop - projectsAnchorHeight + 60;

	if (projectsAnchorScroll <= topPixels) {
		if (activeButton === 0) noChange = true;
		else activeButton = 0;

		// Check for second button
		const aboutMeAnchorStyle = window.getComputedStyle(aboutMeAnchor, null);
		let aboutMeAnchorHeight = aboutMeAnchorStyle.height;
		aboutMeAnchorHeight = Number(aboutMeAnchorHeight.substring(0, aboutMeAnchorHeight.indexOf("px")));
		const aboutMeAnchorScroll = aboutMeAnchor.offsetTop - aboutMeAnchorHeight + 60;
		
		if (aboutMeAnchorScroll <= topPixels) {
			if (activeButton === 1) noChange = true;
			else {
				activeButton = 1;
				noChange = false;
			}

			// Check for third button
			// const contactsAnchorStyle = window.getComputedStyle(contactsAnchor, null);
			// let contactsAnchorHeight = contactsAnchorStyle.height;
			// contactsAnchorHeight = Number(contactsAnchorHeight.substring(0, contactsAnchorHeight.indexOf("px")));
			// const contactsAnchorScroll = contactsAnchor.offsetTop - contactsAnchorHeight + 60;
			const body = document.body
	    const html = document.documentElement;

			const height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );

			// if (contactsAnchorScroll <= topPixels) {
			if (topPixels + window.innerHeight >= height) {
				if (activeButton === 2) noChange = true;
				else {
					activeButton = 2;
					noChange = false;
				}
			}
		}
	} else {
		activeButton = -1;
	}

	if (!noChange) {
		for (const [index, button] of topNavButtons.entries()) {
			if (index === activeButton) {
				button.classList.add("active");
			} else {
				button.classList.remove("active");
			}
		}
	}
}

// Add scroll listener
function scrollListener() {
	handleTopNav();
	handleTopNavButtons();
}
window.addEventListener("scroll", scrollListener);