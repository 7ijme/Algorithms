const allowDiagonals = true;

export default class GridPostition {
	cameFrom = null;
	visited = false;

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
}
