const sections = document.querySelectorAll(".section");

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