// Get references to elements needed
const projectsDiv = document.querySelector("#projects");
const projects = projectsDiv.querySelectorAll(".project-item");
const topNav = document.querySelector(".top-nav");

// Initialize variables
let topFixed = false;
let topNavPixels = topNav.offsetTop;

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

// Handle functionality of top navigation buttons fixing to top
function checkTopNav() {
	const topPixels = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
	if (topFixed) {
		if (topPixels + 1 < topNavPixels) {
			topNav.classList.toggle("fixed-top");
			projectsDiv.classList.toggle("top-nav-padding");
			topFixed = false;
		}
	} else {
		let topNavPixels = topNav.offsetTop;
		if (topPixels + 1 >= topNavPixels) {
			topNav.classList.toggle("fixed-top");
			projectsDiv.classList.toggle("top-nav-padding");
			topFixed = true;
		}
	}
}

// Add scroll listener
function scrollListener() {
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