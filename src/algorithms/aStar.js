// A* algorithm
export default function aStar(grid, start, goal) {
  let openList = [];
  let visitedCells = [];
  const path = [];

  let g = 0;
  let h = heuristic(start.row, start.col, goal.row, goal.col);

  openList.push([start.row, start.col, g, h, g + h]);
  grid[start.row][start.col].visited = true;
  visitedCells.push({ row: start.row, col: start.col });

  while (openList.length > 0) {
    const currentCell = openList.pop();
    const row = currentCell[0];
    const col = currentCell[1];

    path.push({ row, col });

    // check if we are at the goal node
    if (row === goal.row && col === goal.col) {
      return [visitedCells, path];
    }
    [openList, grid, visitedCells] = expandNeighbours(
      grid,
      currentCell,
      openList,
      goal,
      visitedCells
    );
    openList.sort((a, b) => b[4] - a[4]);
  }
  // goal not reached
  return {};
}

function expandNeighbours(grid, currentCell, openList, goal, visitedCells) {
  const row = currentCell[0];
  const col = currentCell[1];
  const g = currentCell[2];

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

  // loop through cell's potential neighbours, up, down, left, right
  for (let i = 0; i < directionalDeltas.length; i++) {
    const row2 = row + directionalDeltas[i][0];
    const col2 = col + directionalDeltas[i][1];

    // check the new cell coordinates are on the grid and not blocked
    if (checkValidCell(grid, row2, col2)) {
      const g2 = g + 1;
      const h2 = heuristic(row2, col2, goal.row, goal.col);
      openList.push([row2, col2, g2, h2, g2 + h2]);
      grid[row2][col2].visited = true;
      visitedCells.push({ row: row2, col: col2, h: h2, g: g2 });
    }
  }

  return [openList, grid, visitedCells];
}

function checkValidCell(grid, row, col) {
  const rowOnBoard = row >= 0 && row < grid.length;
  const colOnBoard = col >= 0 && col < grid[0].length;
  if (rowOnBoard && colOnBoard)
    return grid[row][col].status !== 'block' && !grid[row][col].visited;

  return false;
}

// calculates distance between two cells - given cell to goal cell
function heuristic(row1, col1, row2, col2) {
  const rowPowerTwo = Math.pow(Math.abs(row2 - row1), 2);
  const colPowerTwo = Math.pow(Math.abs(col2 - col1), 2);
  return Math.sqrt(rowPowerTwo + colPowerTwo);

  // Manhattan distance
  //return Math.abs(row2 - row1) + Math.abs(col2 - col1);
}

// END A*
