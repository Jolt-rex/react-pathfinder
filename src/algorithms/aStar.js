// A* algorithm
// works similar to dijkstra algorithm, except we also keep track
// of the h value, which is the distance to goal
// the priority que is sorted by the h + g values (f)
// h is distance to goal, g is distance from start
// Dijkstra is sorted by the g value only
// A* needs to know the distance / cost from a cell to
// the goal cell, where Dijkstra does not

// returns [visitedCells, path] as array
// visitedCells is a array of all cells visited in order
// path is an array of cells from goal -> start
export default function aStar(grid, start, goal) {
  // visited cells is passed back to caller, only for rendering
  // which cells have been visited, does not contribute to algorithm
  let visitedCells = [];

  let priorityQue = [];
  const g = 0;
  const h = heuristic(start.row, start.col, goal.row, goal.col);
  priorityQue.push([start.row, start.col, g, h, g + h]);
  visitedCells.push({ row: start.row, col: start.col });

  // main loop for each visited cell
  while (priorityQue.length > 0) {
    // take the top off the priority que, which is the lowest f value
    const current = priorityQue.pop();
    const [row, col] = current;

    [priorityQue, grid, visitedCells] = expandNeighbours(
      grid,
      current,
      priorityQue,
      goal,
      visitedCells
    );

    // check if we are at the goal node
    if (row === goal.row && col === goal.col) {
      const path = findPath(grid, goal);
      return [visitedCells, path];
    }
    // sort by f value
    priorityQue.sort((a, b) => b[4] - a[4]);
  }
  // goal not reached
  return [visitedCells, []];
}

// finds the path once goal is reached, by traversing
// from goal backwards to start
function findPath(grid, goal) {
  const path = [];
  let current = grid[goal.row][goal.col];
  while (true) {
    path.push(current);
    if (current.status === 'start') break;
    current = grid[current.previous[0]][current.previous[1]];
  }
  return path;
}

// check if co-ordinates are in the priorityQue array
function inPriorityQue(priorityQue, row, col) {
  for (const cellInQue of priorityQue)
    if (cellInQue[0] === row && cellInQue[1] === col) return true;

  return false;
}

// helper array to obtain delta co-ordinates of neighbouring cells
function getCrossDeltas() {
  return [
    [-1, 0],
    [0, -1],
    [1, 0],
    [0, 1],
  ];
}

// expands neighbours in four directions, checks they are valid,
// updates g, h and f values, and adds to priorityQue if not already in que
// returns modified [priorityQue, grid, visitedCells] in array
function expandNeighbours(grid, current, priorityQue, goal, visitedCells) {
  const [row, col, g] = current;
  const directionalDeltas = getCrossDeltas();

  // loop through cell's potential neighbours, up, down, left, right
  for (let i = 0; i < directionalDeltas.length; i++) {
    const rowNeighbour = row + directionalDeltas[i][0];
    const colNeighbour = col + directionalDeltas[i][1];

    // check the new cell coordinates are on the grid and not blocked
    if (checkValidCell(grid, rowNeighbour, colNeighbour)) {
      const isInOpenList = inPriorityQue(
        priorityQue,
        rowNeighbour,
        colNeighbour
      );
      if (isInOpenList) {
        // if the cell already has a lower g score than passing through
        // the current node, then ignore this neighbour, otherwise we will
        // update the g and f values of this neighbour as passing through this
        // current node will be a better path
        if (grid[rowNeighbour][colNeighbour].g < g + 1) {
          continue;
        }
      }

      const gNeighbour = g + 1;
      grid[rowNeighbour][colNeighbour].previous = current;
      grid[rowNeighbour][colNeighbour].g = gNeighbour;

      if (!isInOpenList) {
        const hNeighbour = heuristic(
          rowNeighbour,
          colNeighbour,
          goal.row,
          goal.col
        );
        priorityQue.push([
          rowNeighbour,
          colNeighbour,
          gNeighbour,
          hNeighbour,
          gNeighbour + hNeighbour,
        ]);

        visitedCells.push({ row: rowNeighbour, col: colNeighbour });
      }
    }
  }
  grid[row][col].visited = true;

  return [priorityQue, grid, visitedCells];
}

// check if the cell is on the grid
// is not blocked and has not been visited
function checkValidCell(grid, row, col) {
  const rowOnBoard = row >= 0 && row < grid.length;
  const colOnBoard = col >= 0 && col < grid[0].length;
  if (rowOnBoard && colOnBoard)
    return grid[row][col].status !== 'block' && !grid[row][col].visited;

  return false;
}

// calculates distance between two cells - given cell -> goal cell
// can use Euclidian or Manhattan distance
function heuristic(row1, col1, row2, col2) {
  // Euclidian distance
  // const rowPowerTwo = Math.pow(Math.abs(row2 - row1), 2);
  // const colPowerTwo = Math.pow(Math.abs(col2 - col1), 2);
  // return Math.sqrt(rowPowerTwo + colPowerTwo);

  // Manhattan distance
  return Math.abs(row2 - row1) + Math.abs(col2 - col1);
}

// END A*
