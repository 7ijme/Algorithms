const allowDiagonals = true;
export default class GridPostition {
	cameFrom = null;
	gScore = 0;
	hScore = 0;
	fScore = 0;

	constructor(x, y, element, wall = false) {
		this.x = x;
		this.y = y;
		this.element = element;
		this.wall = wall;
	}

	// Get the neighbors of the GridPostition
	getNeighbors(grid) {
		const directions = [
			grid[this.x - 1]?.[this.y],
			grid[this.x + 1]?.[this.y],
			grid[this.x]?.[this.y + 1],
			grid[this.x]?.[this.y - 1],
		];

		if (allowDiagonals)
			directions.push(
				grid[this.x - 1]?.[this.y - 1],
				grid[this.x + 1]?.[this.y - 1],
				grid[this.x - 1]?.[this.y + 1],
				grid[this.x + 1]?.[this.y + 1]
			);
		return directions.filter((a) => a != null && !a.wall);
	}

	// Get the estimated distance between 2 grid positions
	getHeuristics(end, start = this) {
		if (allowDiagonals) {
			return Math.hypot(end.x - start.x, end.y - start.y);
		} else {
			return Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
		}
	}
}
