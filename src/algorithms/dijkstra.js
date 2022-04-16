export default function dijkstra(grid, start, goal) {
  const path = [];
  let visitedCells = [];

  // make all cells a distance of relatively infinity
  for (let rowIndex = 0; rowIndex < grid.length; rowIndex++)
    for (let colIndex = 0; colIndex < grid[0].length; colIndex++)
      grid[rowIndex][colIndex].distance = 1000000;

  // start node a distance of 0
  grid[start.row][start.col].distance = 0;

  let current = start;

  while (true) {
    [grid, current, visitedCells] = expandNeighbours(grid, current);

    // if we have found the goal
    if (grid[goal.row][goal.col].visited) {
      return [visitedCells, path];
    }

    // if current is null, we have not found another cell with distance less than infinity
    if (current === null) return [[], []];
  }
}

function expandNeighbours(grid, current, visitedCells) {
  const row = current[0];
  const col = current[1];
  const currentDistance = grid[row][col].distance;
  let shortestDistanceToNeighbour = 1000000;
  let closestNeighbour = null;

  // helper array to obtain co-ordinates of neighbouring cells
  const crossDeltas = [
    [-1, 0],
    [0, -1],
    [1, 0],
    [0, 1],
  ];
  const diagonalDeltas = [
    [-1, -1],
    [-1, 1],
    [1, 1],
    [1, -1],
  ];

  const directionalDeltas = [...crossDeltas, ...diagonalDeltas];

  // loop through cell's potential neighbours, up, down, left, right, and optionally diagonals
  for (let i = 0; i < directionalDeltas.length; i++) {
    const row2 = row + directionalDeltas[i][0];
    const col2 = col + directionalDeltas[i][1];

    // check the new cell coordinates are on the grid and not blocked
    if (checkValidCell(grid, row2, col2)) {
      // find distance between current cell, and our neighbour
      const distanceCurrentToNeighbour = distance(row2, col2, row, col);
      if (
        currentDistance + distanceCurrentToNeighbour <
        grid[row2][col2].distance
      )
        grid[row2][col2].distance =
          currentDistance + distanceCurrentToNeighbour;

      if (distanceCurrentToNeighbour < shortestDistanceToNeighbour) {
        shortestDistanceToNeighbour = distanceCurrentToNeighbour;
        closestNeighbour = { row: row2, col: col2 };
      }
    }
  }
  grid[row][col].visited = true;
  current = closestNeighbour;

  return [grid, current, visitedCells];
}

function checkValidCell(grid, row, col) {
  const rowOnBoard = row >= 0 && row < grid.length;
  const colOnBoard = col >= 0 && col < grid[0].length;
  if (rowOnBoard && colOnBoard)
    return grid[row][col].status !== 'block' && !grid[row][col].visited;

  return false;
}

// calculates distance between two cells - given cell to goal cell
function distance(row1, col1, row2, col2) {
  const rowPowerTwo = Math.pow(Math.abs(row2 - row1), 2);
  const colPowerTwo = Math.pow(Math.abs(col2 - col1), 2);
  return Math.sqrt(rowPowerTwo + colPowerTwo);

  // Manhattan distance
  //return Math.abs(row2 - row1) + Math.abs(col2 - col1);
}
