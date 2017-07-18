const projects = document.querySelector("#projects").querySelectorAll(".project-item");

for (const [index, project] of projects.entries()) {
	const divs = project.children;
	
	if (index%2 == 1) {
		for (let i=0; i < divs.length; i++) {
			const divClass = divs[i].classList[0];
			const colType = divClass.substring(0, 7);
			const colNum = divClass.substring(7, divClass.length);
			const pushing = i < divs.length/2;
			const newClass = `${colType}${pushing ? "push-" : "pull-"}${12 - colNum}`;

			divs[i].classList.add(newClass);
		}
	}
}