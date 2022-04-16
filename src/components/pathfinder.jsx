import React, { useState, useEffect } from 'react';
import Cell from './cell';
import Dropdown from './dropdown';
import aStar from '../algorithms/aStar';
import dijkstra from '../algorithms/dijkstra';
import './pathfinder.css';

function Pathfinder({ width, height }) {
  const [grid, setGrid] = useState([]);
  const [start, setStart] = useState(null);
  const [goal, setGoal] = useState(null);
  const [algorithm, setAlgorithm] = useState(null);
  const [action, setAction] = useState('');
  const [running, setRunning] = useState(false);

  const algorithms = { dijkstra, aStar };
  
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

  function renderPath(visitedCells, path) {
    for (let i = 0; i < visitedCells.length; i++) {
      const newGrid = [...grid];
      newGrid[visitedCells[i].row][visitedCells[i].col].visited = true;
      setGrid(newGrid)
    }

    for (let j = 0; j < path.length; j++) {
      const newGrid = [...grid];
      newGrid[path[j].row][path[j].col].path = true;
      setGrid(newGrid);
    }
  }

  function execute() {
    console.log('Executing', algorithm);

    if (start && goal && algorithm) {
      const [visitedCells, path] = algorithms[algorithm.id](grid, start, goal);
      
      if (path.length === 0)
        console.log('Could not find node');

      renderPath(visitedCells, path);
    }
  }

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