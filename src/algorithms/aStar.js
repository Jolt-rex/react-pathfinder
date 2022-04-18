// A* algorithm
export default function aStar(grid, start, goal) {
  let openList = [];
  let visitedCells = [];
  let g = 0;
  let h = heuristic(start.row, start.col, goal.row, goal.col);

  openList.push([start.row, start.col, g, h, g + h]);
  visitedCells.push({ row: start.row, col: start.col });

  while (openList.length > 0) {
    const current = openList.pop();
    const [row, col] = current;

    [openList, grid, visitedCells] = expandNeighbours(
      grid,
      current,
      openList,
      goal,
      visitedCells
    );

    // check if we are at the goal node
    if (row === goal.row && col === goal.col) {
      const path = findPath(grid, goal);
      return [visitedCells, path];
    }

    openList.sort((a, b) => b[4] - a[4]);
  }
  // goal not reached
  return [visitedCells, []];
}

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

function inOpenList(openList, row, col) {
  for (const cellInOpenList of openList)
    if (cellInOpenList[0] === row && cellInOpenList[1] === col) return true;

  return false;
}

// helper array to obtain co-ordinates of neighbouring cells
function getCrossDeltas() {
  return [
    [-1, 0],
    [0, -1],
    [1, 0],
    [0, 1],
  ];
}

function expandNeighbours(grid, current, openList, goal, visitedCells) {
  const [row, col, g] = current;
  const directionalDeltas = getCrossDeltas();

  // loop through cell's potential neighbours, up, down, left, right
  for (let i = 0; i < directionalDeltas.length; i++) {
    const row2 = row + directionalDeltas[i][0];
    const col2 = col + directionalDeltas[i][1];

    // check the new cell coordinates are on the grid and not blocked
    if (checkValidCell(grid, row2, col2)) {
      // if the cell is already in the open list
      const isInOpenList = inOpenList(openList, row2, col2);
      if (isInOpenList) {
        // and if the cell has a lower g score than passing through
        // the current node, then ignore this neighbour
        if (grid[row2][col2].g < g + 1) {
          continue;
        }
      }

      const gNeighbour = g + 1;
      grid[row2][col2].previous = current;
      grid[row2][col2].g = gNeighbour;

      if (!isInOpenList) {
        const hNeighbour = heuristic(row2, col2, goal.row, goal.col);
        openList.push([
          row2,
          col2,
          gNeighbour,
          hNeighbour,
          gNeighbour + hNeighbour,
        ]);

        visitedCells.push({ row: row2, col: col2 });
      }
    }
  }
  grid[row][col].visited = true;

  return [openList, grid, visitedCells];
}

function checkValidCell(grid, row, col) {
  const rowOnBoard = row >= 0 && row < grid.length;
  const colOnBoard = col >= 0 && col < grid[0].length;
  if (rowOnBoard && colOnBoard)
    return grid[row][col].status !== 'block' && !grid[row][col].visited;

  return false;
}

// calculates distance between two cells - given cell -> goal cell
function heuristic(row1, col1, row2, col2) {
  // Euclidian distance
  // const rowPowerTwo = Math.pow(Math.abs(row2 - row1), 2);
  // const colPowerTwo = Math.pow(Math.abs(col2 - col1), 2);
  // return Math.sqrt(rowPowerTwo + colPowerTwo);

  // Manhattan distance
  return Math.abs(row2 - row1) + Math.abs(col2 - col1);
}

// END A*
