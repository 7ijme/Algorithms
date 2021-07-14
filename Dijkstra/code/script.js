import GridPostition from "./gridPostition.js";

// Defining variables
const INTERVAL = 100;
const WIDTH = getComputedStyle(document.documentElement).getPropertyValue("--rows");
const HEIGHT = getComputedStyle(document.documentElement).getPropertyValue("--columns");

const grid = new Array(WIDTH);
const gridElement = document.querySelector("#grid");

let closedList = [];
let openList = [];

const END_POS_X = WIDTH / 2 - 1;
const END_POS_Y = HEIGHT - 1;
const START_POS_X = WIDTH / 2 - 1;
const START_POS_Y = 0;

let intervalID;

function Dijkstra() {
	// Create 2D Array and elements
	for (let x = 0; x < WIDTH; x++) {
		grid[x] = new Array(HEIGHT);
		for (let y = 0; y < HEIGHT; y++) {
			const newElement = document.createElement("div");
			gridElement.appendChild(newElement);
			grid[x][y] = new GridPostition(x, y, newElement, Math.random() < 0.3);
			if (grid[x][y].wall) {
				if ((x == START_POS_X && y == START_POS_Y) || (x == END_POS_X && y == END_POS_Y)) {
					grid[x][y].wall = false;
				} else {
					grid[x][y].element.classList.add("wall");
				}
			}
		}
	}

	// Change color of start and end
	const END = grid[END_POS_X][END_POS_Y];
	const START = grid[WIDTH / 2 - 1][0];

	START.element.classList.add("start");
	END.element.classList.add("end");

	// Start the loop
	openList.push(START);

	intervalID = setInterval(() => {
		// Sadly there is no solution
		if (openList.length == 0) {
			clearInterval(intervalID);
			return;
		}

		// Loop through the openList backwards, as we remove and add elements
		for (let i = openList.length - 1; i >= 0; i--) {
			const gridPosition = openList[i];

			closedList.push(gridPosition);
			openList.splice(openList.indexOf(gridPosition), 1);

			// Ladies and gentlemen, we got 'm
			if (gridPosition == END) {
				clearInterval(intervalID);
				createPath(END);
				return;
			}

			// Loop through all the neighbors and add them to the openlist
			for (const neighbor of gridPosition.getNeighbors(grid)) {
				if (!openList.includes(neighbor) && !closedList.includes(neighbor)) {
					neighbor.cameFrom = gridPosition;
					openList.push(neighbor);
				}
			}
		}

		// Give colors
		openList.forEach((gridPosition) => {
			gridPosition.element.classList.add("open");
		});

		closedList.forEach((gridPosition) => {
			gridPosition.element.classList.add("closed");
		});
	}, INTERVAL);
}

// Create the blue path (if found)
function createPath(param) {
	const path = [];
	let temp = param;
	while (temp.cameFrom != null) {
		path.push(temp);
		temp = temp.cameFrom;
	}
	path.push(temp);
	path.forEach((gridPosition) => gridPosition.element.classList.add("path"));
}

// Restart button
btn.addEventListener("click", () => {
	clearInterval(intervalID);
	openList = [];
	closedList = [];
	while (gridElement.children.length > 0) {
		gridElement.children.item(0).remove();
	}
	Dijkstra();
});

Dijkstra();
