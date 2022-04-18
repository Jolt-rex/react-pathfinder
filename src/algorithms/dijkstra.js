const INFINITY = 1000000;

export default function dijkstra(grid, start, goal) {
  let priorityQue = [];
  let visitedCells = [];

  // make all cells a distance of relatively infinity
  for (let rowIndex = 0; rowIndex < grid.length; rowIndex++)
    for (let colIndex = 0; colIndex < grid[0].length; colIndex++)
      grid[rowIndex][colIndex].distance = INFINITY;

  // start node a distance of 0 and push it to the que
  grid[start.row][start.col].distance = 0;
  let current = grid[start.row][start.col];
  priorityQue.push(current);

  while (priorityQue.length > 0) {
    current = priorityQue.pop();
    console.log(current.row, current.col);

    const unvisitedNeighbours = getUnvisitedNeighbours(grid, current);

    [grid, priorityQue, visitedCells] = expandNeighbours(
      grid,
      priorityQue,
      current,
      unvisitedNeighbours,
      visitedCells
    );

    grid[current.row][current.col].visited = true;
    sortPriorityQue(priorityQue);

    // we have found the goal
    if (grid[goal.row][goal.col].visited) {
      const path = findPath(grid, goal);
      return [visitedCells, path];
    }
  }
  // if we get here, the goal could not be located
  // return with the cells we visited and empty path
  return [visitedCells, []];
}

function findPath(grid, goal) {
  const path = [];
  let current = goal;
  while (true) {
    path.push(current);
    if (current.status === 'start') break;
    current = grid[current.row][current.col].previous;
  }

  return path;
}

function sortPriorityQue(priorityQue) {
  priorityQue.sort((a, b) => b.distance - a.distance);
}

function expandNeighbours(
  grid,
  priorityQue,
  current,
  unvisitedNeighbours,
  visitedCells
) {
  for (const neighbour of unvisitedNeighbours) {
    if (current.distance + 1 < neighbour.distance) {
      grid[neighbour.row][neighbour.col].distance = current.distance + 1;
      grid[neighbour.row][neighbour.col].previous = current;
      priorityQue.push(grid[neighbour.row][neighbour.col]);
    }
    visitedCells.push(neighbour);
  }
  return [grid, priorityQue, visitedCells];
}

// returns all cells that are neighbours of current cell
// that are on the board and that have not been visited or blocked
// does not modify grid
function getUnvisitedNeighbours(grid, current) {
  // helper array to obtain co-ordinates of neighbouring cells
  const directionalDeltas = [
    [-1, 0],
    [0, -1],
    [1, 0],
    [0, 1],
  ];

  const unvisitedNeighbours = [];
  // loop through cell's potential neighbours, up, down, left, right, and optionally diagonals
  for (let i = 0; i < directionalDeltas.length; i++) {
    const neighbourRow = current.row + directionalDeltas[i][0];
    const neighbourCol = current.col + directionalDeltas[i][1];
    if (checkValidCell(grid, neighbourRow, neighbourCol)) {
      const newNeighbour = { ...grid[neighbourRow][neighbourCol] };
      unvisitedNeighbours.push(newNeighbour);
    }
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
