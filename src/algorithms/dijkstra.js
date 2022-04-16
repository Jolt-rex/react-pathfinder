const INFINITY = 1000000;

export default function dijkstra(grid, start, goal) {
  const path = [];
  let visitedCells = [];

  // make all cells a distance of relatively infinity
  for (let rowIndex = 0; rowIndex < grid.length; rowIndex++)
    for (let colIndex = 0; colIndex < grid[0].length; colIndex++)
      grid[rowIndex][colIndex].distance = INFINITY;

  // start node a distance of 0
  grid[start.row][start.col].distance = 0;

  let current = start;

  while (true) {
    const unvisitedNeighbours = getUnvisitedNeighbours(grid, current);
    [grid, visitedCells] = expandNeighbours(
      grid,
      grid[current.row][current.col].distance,
      unvisitedNeighbours,
      visitedCells
    );
    sortUnvisitedNeighbours(unvisitedNeighbours);
    grid[current.row][current.col].visited = true;
    current = unvisitedNeighbours.pop();

    // if we have found the goal
    if (grid[goal.row][goal.col].visited) {
      return [visitedCells, path];
    }

    // if current is null, we have not found another cell with distance less than infinity
    if (current === null) return [[], []];
  }
}

function sortUnvisitedNeighbours(unvisitedNeighbours) {
  unvisitedNeighbours.sort((a, b) => a.distance - b.distance);
}

function expandNeighbours(
  grid,
  currentDistance,
  unvisitedNeighbours,
  visitedCells
) {
  for (const neighbour of unvisitedNeighbours) {
    if (currentDistance + 1 < neighbour.distance)
      grid[neighbour.row][neighbour.col].distance = currentDistance + 1;
    visitedCells.push(neighbour);
  }
  return [grid, visitedCells];
}

// returns all cells that are neighbours of current cell
// that are on the board and that have not been visited
function getUnvisitedNeighbours(grid, current) {
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

  const unvisitedNeighbours = [];

  // loop through cell's potential neighbours, up, down, left, right, and optionally diagonals
  for (let i = 0; i < directionalDeltas.length; i++) {
    console.log(current);
    const neighbourRow = current.row + directionalDeltas[i][0];
    const neighbourCol = current.col + directionalDeltas[i][1];
    if (checkValidCell(grid, neighbourRow, neighbourCol))
      unvisitedNeighbours.push({ row: neighbourRow, col: neighbourCol });
  }
  return unvisitedNeighbours;
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
