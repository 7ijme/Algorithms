import GridPostition from "./gridPostition.js";

const INTERVAL = 100;
const WIDTH = getComputedStyle(document.documentElement).getPropertyValue("--rows");
const HEIGHT = getComputedStyle(document.documentElement).getPropertyValue("--columns");

const grid = new Array(WIDTH);
const gridElement = document.querySelector("#grid");

const closedList = [];
const openList = [];

const END_POS_X = WIDTH / 2 - 1;
const END_POS_Y = HEIGHT - 1;
const START_POS_X = WIDTH / 2 - 1;
const START_POS_Y = 0;

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

const intervalId = setInterval(() => {
	// There is no available path
	if (openList.length == 0) {
		clearInterval(intervalId);
		for (let x = 0; x < WIDTH; x++) {
			for (let y = 0; y < HEIGHT; y++) {
				grid[x][y].element.classList.remove("path");
			}
		}
		return;
	}

	// Get the grid position with the lowest f score
	let lowest;

	for (const gridPosition of openList) {
		if (!lowest) lowest = gridPosition;
		if (lowest.fScore > gridPosition.fScore) {
			lowest = gridPosition;
		}
	}

	const currentGridPosition = lowest;

	// Ladies and gentlemen, we got 'm
	if (currentGridPosition == END) {
		clearInterval(intervalId);
		createPath();
		return;
	}

	// Create the current path
	for (let x = 0; x < WIDTH; x++) {
		for (let y = 0; y < HEIGHT; y++) {
			grid[x][y].element.classList.remove("path");
		}
	}
	createPath(currentGridPosition);

	// Remove the current grid position from the loop
	openList.splice(openList.indexOf(currentGridPosition), 1);
	closedList.push(currentGridPosition);

	// Loop through all neighbors and add them to the loop (if not already) and change the scores
	for (const neighbor of currentGridPosition.getNeighbors(grid)) {
		if (!closedList.includes(neighbor)) {
			const tempG = currentGridPosition.gScore + currentGridPosition.getHeuristics(neighbor);

			if (!openList.includes(neighbor)) {
				openList.push(neighbor);
			} else if (tempG >= neighbor.g) {
				// This is not a better path
				continue;
			}

			// Changing the variables
			neighbor.gScore = tempG;
			neighbor.hScore = neighbor.getHeuristics(END);
			neighbor.fScore = neighbor.gScore + neighbor.hScore;
			neighbor.cameFrom = currentGridPosition;
		}
	}

	// Give the grid some styles
	for (const gridPosition of openList) {
		gridPosition.element.classList.add("open");
	}

	for (const gridPosition of closedList) {
		gridPosition.element.classList.remove("open");
		gridPosition.element.classList.add("closed");
	}
}, INTERVAL);

// Create the path
function createPath(param = END) {
	for (let x = 0; x < WIDTH; x++) {
		for (let y = 0; y < HEIGHT; y++) {
			grid[x][y].element.classList.remove("path");
		}
	}
	const path = [];
	let temp = param;
	while (temp.cameFrom != null) {
		path.push(temp);
		temp = temp.cameFrom;
	}
	path.push(temp);
	path.forEach((gridPosition) => gridPosition.element.classList.add("path"));
}
