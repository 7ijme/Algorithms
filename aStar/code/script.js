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

const END = grid[END_POS_X][END_POS_Y];
const START = grid[WIDTH / 2 - 1][0];

// Change color of start and end
START.element.classList.add("start");
END.element.classList.add("end");

openList.push(START);

const intervalId = setInterval(() => {
	if (openList.length == 0) {
		clearInterval(intervalId);
		for (let x = 0; x < WIDTH; x++) {
			for (let y = 0; y < HEIGHT; y++) {
				grid[x][y].element.classList.remove("path");
			}
		}
		return;
	}

	let lowest;

	for (const gridPosition of openList) {
		if (!lowest) lowest = gridPosition;
		if (lowest.fScore > gridPosition.fScore) {
			lowest = gridPosition;
		}
	}

	const currentGridPosition = lowest;
	// const currentGridPosition = openList.sort((a, b) => b.fScore - a.fScore)[0];

	if (currentGridPosition == END) {
		clearInterval(intervalId);
		createPath();
		return;
	}

	for (let x = 0; x < WIDTH; x++) {
		for (let y = 0; y < HEIGHT; y++) {
			grid[x][y].element.classList.remove("path");
		}
	}
	createPath(currentGridPosition);

	openList.splice(openList.indexOf(currentGridPosition), 1);
	closedList.push(currentGridPosition);

	for (const neighbor of currentGridPosition.getNeighbors(grid)) {
		if (!closedList.includes(neighbor)) {
			const tempG = currentGridPosition.gScore + currentGridPosition.getHeuristics(neighbor);

			if (!openList.includes(neighbor)) {
				openList.push(neighbor);
			} else if (tempG >= neighbor.g) {
				continue;
			}

			neighbor.gScore = tempG;
			neighbor.hScore = neighbor.getHeuristics(END);
			neighbor.fScore = neighbor.gScore + neighbor.hScore;
			neighbor.cameFrom = currentGridPosition;
		}
	}

	for (const gridPosition of openList) {
		gridPosition.element.classList.add("open");
	}

	for (const gridPosition of closedList) {
		gridPosition.element.classList.remove("open");
		gridPosition.element.classList.add("closed");
	}
}, INTERVAL);

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
