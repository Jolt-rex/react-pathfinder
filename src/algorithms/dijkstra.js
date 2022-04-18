// Dijkstra algorithm
// Make all cells a distance value of infinity, except start which is 0
// Works by exploring cells in four directions, up down left right
// from current cell, and adding cells to a priorityQue
// the priorityQue is then sorted based on the distance value which
// is the distnace from the start cell
// the cell with the lowest distance value is popped of the top and becomes
// the current node, and the process is repeated until we find the goal
// the current node is marked as visited and not visited again
// the algorithm is not given the location of the goal, until we find it

// returns [visitedCells, path] as array
// visitedCells is a array of all cells visited in order
// path is an array of cells from goal -> start
export default function dijkstra(grid, start, goal) {
  // visited cells is passed back to caller, only for rendering
  // which cells have been visited, does not contribute to algorithm

  const INFINITY = 100000;
  // make all cells a distance of relatively infinity
  for (let rowIndex = 0; rowIndex < grid.length; rowIndex++)
    for (let colIndex = 0; colIndex < grid[0].length; colIndex++)
      grid[rowIndex][colIndex].distance = INFINITY;

  // start node at distance of 0 and push it to the que
  grid[start.row][start.col].distance = 0;
  let current = grid[start.row][start.col];
  let visitedCells = [];
  let priorityQue = [];
  priorityQue.push(current);
  visitedCells.push({ row: current.row, col: current.col });

  while (priorityQue.length > 0) {
    current = priorityQue.pop();

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
  // if we get here, the goal could not be reached
  // return with the cells we visited and empty path
  return [visitedCells, []];
}

// finds the path once goal is reached, by traversing
// from goal backwards to start
function findPath(grid, goal) {
  const path = [];
  let current = goal;
  while (true) {
    let { row, col } = current;
    path.push({ row, col });
    if (current.status === 'start') break;
    current = grid[row][col].previous;
  }
  return path;
}

// check if co-ordinates are in the priorityQue array
function inPriorityQue(priorityQue, row, col) {
  for (const cellInQue of priorityQue)
    if (cellInQue[0] === row && cellInQue[1] === col) return true;

  return false;
}

// sort que based on distance, the lowest distance at the top
function sortPriorityQue(priorityQue) {
  priorityQue.sort((a, b) => b.distance - a.distance);
}

// expand the valid neighbours
// update the distance value, the previous node
// and push to the que
// returns modified [grid, priorityQue, visitedCells]
function expandNeighbours(
  grid,
  priorityQue,
  current,
  unvisitedNeighbours,
  visitedCells
) {
  for (const neighbour of unvisitedNeighbours) {
    const { row, col, distance } = neighbour;
    if (current.distance + 1 < distance) {
      grid[row][col].distance = current.distance + 1;
      grid[row][col].previous = current;
      if (!inPriorityQue(priorityQue, row, col)) {
        priorityQue.push(grid[row][col]);
        visitedCells.push({ row, col });
      }
    }
  }
  return [grid, priorityQue, visitedCells];
}

// helper array to obtain delta co-ordinates of neighbouring cells
function getDirectionalDeltas() {
  return [
    [-1, 0],
    [0, -1],
    [1, 0],
    [0, 1],
  ];
}

// returns all cells that are neighbours of current cell
// that are on the board and that have not been visited or blocked
// does not modify grid
function getUnvisitedNeighbours(grid, current) {
  const directionalDeltas = getDirectionalDeltas();

  const unvisitedNeighbours = [];
  // loop through cell's potential neighbours, up, down, left, right
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

// check if the cell is on the grid
// is not blocked and has not been visited
// returns true or false
function checkValidCell(grid, row, col) {
  const rowOnBoard = row >= 0 && row < grid.length;
  const colOnBoard = col >= 0 && col < grid[0].length;
  if (rowOnBoard && colOnBoard)
    return grid[row][col].status !== 'block' && !grid[row][col].visited;

  return false;
}

// END DIJKSTRA
