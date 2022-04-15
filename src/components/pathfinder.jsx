import React, { useState, useEffect } from 'react';
import Cell from './cell';
import Dropdown from './dropdown';
import './pathfinder.css';

function Pathfinder({ width, height }) {
  const [grid, setGrid] = useState([]);
  const [start, setStart] = useState(null);
  const [goal, setGoal] = useState(null);
  const [algorithm, setAlgorithm] = useState(null);
  const [action, setAction] = useState('');
  const [running, setRunning] = useState(false);

  let renderDelay = 1000;
  
  useEffect(() => {
    console.log('Use effect called');
    
    resetGrid();
  }, []);

  function resetGrid() {
    const newGrid = Array(height).fill(0).map(row => new Array(width).fill({}));

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        newGrid[row][col] = { status: 'empty', visited: false, path: false, row, col };
      }
    }

    setStart(null);
    setGoal(null);
    setAlgorithm(null);
    setGrid(newGrid);
  }


  // TODO make this cleaner - extract duplicate code to re-useable function
  function onHandleCellClick(row, col) {
    const newGrid = [...grid];
    newGrid[row][col].status = action;
    
    if (action === 'goal') {
      // if goal already declared, and is at same location, exit early
      if (goal && goal.row === row && goal.col === col) return;

      // if goal declared, erase previous goal position
      if (goal) newGrid[goal.row][goal.col].status = 'empty';
      
      setGoal({ row, col });
    }

    if (action === 'start') {
      // if start already declared, and is at same location, exit early
      if (start && start.row === row && start.col === col) return;

      // if start declared, erase previous start position
      if (start) newGrid[start.row][start.col].status = 'empty';
      
      setStart({ row, col });
    }
    
    setGrid(newGrid);
  }

  function onHandleMouseOver(row, col) {
    if (action !== 'block') return;

    const newGrid = [...grid];
    newGrid[row][col].status = action;
    setGrid(newGrid);
  }

  function execute() {
    console.log('Executing');
    if (algorithm.id === 'aStar') aStar();
  }

  // A* algorithm
  function aStar() {
    let openList = [];
    const path = [];
    let g = 0;
    let h = heuristic(start.row, start.col);

    openList = addToOpen(start.row, start.col, g, h, openList);
    while (openList.length > 0) {
      const currentCell = openList.pop();
      const row = currentCell[0];
      const col = currentCell[1];
      
      path.push({ row, col });
      
      // check if we are at the goal node
      if (row === goal.row && col === goal.col) {
        showPath(path);
        return;
      }
      openList = expandNeighbours(currentCell, openList);
      openList.sort((a, b) => b[4] - a[4]);    
    }
    console.log('Goal not reached');
  }

  function showPath(path) {
    const newGrid = [...grid];
    for (let i = 0; i < path.length; i++)
      newGrid[path[i].row][path[i].col].path = true;
    
    setGrid(newGrid);
  }

  function expandNeighbours(currentCell, openList) {
    const row = currentCell[0];
    const col = currentCell[1];
    const g = currentCell[2];
    
    // helper array to obtain co-ordinates of neighbouring cells
    const crossDeltas = [[-1, 0], [0, -1], [1, 0], [0, 1]];
    const diagonalDeltas = [[-1, -1], [-1, 1], [1, 1], [1, -1]];

    const directionalDeltas = [...crossDeltas, ...diagonalDeltas];
    
    // loop through cell's potential neighbours, up, down, left, right
    for (let i = 0; i < directionalDeltas.length; i++) {
      const row2 = row + directionalDeltas[i][0];
      const col2 = col + directionalDeltas[i][1];

      // check the new cell coordinates are on the grid and not blocked
      if (checkValidCell(row2, col2)) {
        const g2 = g + 1;
        const h2 = heuristic(row2, col2);
        openList = addToOpen(row2, col2, g2, h2, openList)
      }
    }

    return openList;
  }

  function checkValidCell(row, col) {
    const rowOnBoard = (row >= 0 && row < grid.length);
    const colOnBoard = (col >= 0 && col < grid[0].length);
    if (rowOnBoard && colOnBoard)
      return grid[row][col].status !== 'block' && !grid[row][col].visited;
  
    return false;
  }

  // calculates distance between two cells - given cell to goal cell
  function heuristic(row, col) {
    const rowPowerTwo = Math.pow(Math.abs(goal.row - row), 2);
    const colPowerTwo = Math.pow(Math.abs(goal.col - col), 2);
    return Math.sqrt(rowPowerTwo + colPowerTwo);

    // Manhattan distance
    //return Math.abs(goal.row - row) + Math.abs(goal.col - col);
  }

  function addToOpen(row, col, g, h, openList) {
    openList.push([row, col, g, h, g + h]);
    const newGrid = [...grid];
    newGrid[row][col].visited = true;
    setGrid(newGrid);
    return openList;
  }

  // END A* 


  return ( 
    <div className='pathfinder-container'>
      <div className="grid">
        <button className={'btn btn-primary' + (running ? ' disabled' : '')} onClick={() => setAction('start')}>Set Start</button>
        <button className={'btn btn-primary' + (running ? ' disabled' : '')} onClick={() => setAction('goal')}>Set Goal</button>
        <button className={'btn btn-primary' + (running ? ' disabled' : '')} onClick={() => setAction('block')}>Set Block</button>
        <Dropdown className={running ? ' disabled' : ''} label={algorithm ? algorithm.label : 'Algorithm'} handleClick={(algo) => setAlgorithm(algo)}/>
        <button className='btn btn-warning' onClick={resetGrid}>Reset</button>
        <button className={'btn btn-success' + (start && goal && algorithm && !running ? '' : ' disabled')} onClick={execute}>Execute</button>
            {grid !== [] &&
              grid.map(row => {
                return <div key={row[0].row} className="row">
                  {row.map(({ status, visited, path, row, col }) => <Cell key={"" + row + col} status={status} visited={visited} path={path} row={row} col={col} onHandleClick={onHandleCellClick} onMouseOver={onHandleMouseOver} />)}
                </div>
              })
            }
      </div>
    </div>
  );
}
 
export default Pathfinder;