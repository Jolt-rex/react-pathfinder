// A* algorithm
export default function aStar(grid, start, goal) {
  let openList = [];
  let visitedCells = [];

  let g = 0;
  let h = heuristic(start.row, start.col, goal.row, goal.col);

  openList.push([start.row, start.col, g, h, g + h]);
  grid[start.row][start.col].visited = true;
  visitedCells.push({ row: start.row, col: start.col });

  while (openList.length > 0) {
    const current = openList.pop();
    const [row, col] = current;

    // check if we are at the goal node
    if (row === goal.row && col === goal.col) {
      const path = findPath(grid, goal);
      return [visitedCells, path];
    }

    [openList, grid, visitedCells] = expandNeighbours(
      grid,
      current,
      openList,
      goal,
      visitedCells
    );
    openList.sort((a, b) => b[4] - a[4]);

    console.log(openList);
  }
  // goal not reached
  return [visitedCells, []];
}

function findPath(grid, goal) {
  const path = [];
  let current = grid[goal.row][goal.col];
  while (true) {
    console.log(current);
    path.push(current);
    if (current.status === 'start') break;
    current = grid[current.previous[0]][current.previous[1]];
  }
  return path;
}

function inOpenList(openList, cell) {
  for (const cellInOpenList in openList)
    if (cellInOpenList[0] === cell.row && cellInOpenList[1] === cell.col)
      return true;

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

// optional to allow diagonal travel
function getDiagonalDeltas() {
  return [
    [-1, -1],
    [-1, 1],
    [1, 1],
    [1, -1],
  ];
}

function expandNeighbours(grid, current, openList, goal, visitedCells) {
  const [row, col, g] = current;
  const directionalDeltas = [...getCrossDeltas(), ...getDiagonalDeltas()];

  // loop through cell's potential neighbours, up, down, left, right
  // and diagonals if selected
  for (let i = 0; i < directionalDeltas.length; i++) {
    const row2 = row + directionalDeltas[i][0];
    const col2 = col + directionalDeltas[i][1];

    // check the new cell coordinates are on the grid and not blocked
    if (checkValidCell(grid, row2, col2)) {
      const distanceToCurrent =
        directionalDeltas[i][0] !== 0 && directionalDeltas[i][1] !== 0
          ? 1.4
          : 1;

      // if the cell is already in the open list
      if (inOpenList(openList, { row2, col2 })) {
        console.log('In open list');
        // and if the cell has a lower g score than passing through
        // the current node, then ignore this neighbour
        if (grid[row2][col2].g < g + distanceToCurrent) {
          console.log(grid[row2][col2], g + distanceToCurrent);
          continue;
        }
      }

      const gNeighbour = g + distanceToCurrent;
      const hNeighbour = heuristic(row2, col2, goal.row, goal.col);
      grid[row2][col2].previous = current;
      grid[row2][col2].g = gNeighbour;

      openList.push([
        row2,
        col2,
        gNeighbour,
        hNeighbour,
        gNeighbour + hNeighbour,
      ]);

      grid[row2][col2].visited = true;
      visitedCells.push({ row: row2, col: col2 });
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

// calculates distance between two cells - given cell -> goal cell
function heuristic(row1, col1, row2, col2) {
  const rowPowerTwo = Math.pow(Math.abs(row2 - row1), 2);
  const colPowerTwo = Math.pow(Math.abs(col2 - col1), 2);
  return Math.sqrt(rowPowerTwo + colPowerTwo);

  // Manhattan distance
  //return Math.abs(row2 - row1) + Math.abs(col2 - col1);
}

// END A*
