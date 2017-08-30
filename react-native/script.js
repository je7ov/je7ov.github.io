const sections = document.querySelectorAll(".section");
const topNav = document.querySelector(".top-nav");
const topNavPadding = document.querySelector("#top-nav-padding");

let topFixed = false;
topNavPixels = topNav.offsetTop;

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

function toggleSectionContent(clickedIndex) {
  for (const [index, section] of sections.entries()) {
    const content = section.querySelector(".section-content");
    if (index === clickedIndex) {
      content.classList.toggle("show");
    } else {
      content.classList.remove("show");
    }
  }
}

for (const [index, section] of sections.entries()) {
  section.querySelector(".section-text").addEventListener("click", () => {
    toggleSectionContent(index)
  });
}

function scrollListener() {
  handleTopNav();
}
window.addEventListener("scroll", scrollListener);