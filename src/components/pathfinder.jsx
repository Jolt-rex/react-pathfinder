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
  const [hasRun, setHasRun] = useState(false);

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

  function animateCells(cells, stateToSet) {
    for (let i = 0; i < cells.length; i++) {
      const newGrid = [...grid];
      newGrid[cells[i].row][cells[i].col][stateToSet] = true;
      setGrid(newGrid);
    }
  }

  function renderPath(visitedCells, path) {
    animateCells(visitedCells, 'visited');
    animateCells(path, 'path');
  }

  function execute() {
    if (start && goal && algorithm) {
      const [visitedCells, path] = algorithms[algorithm.id](grid, start, goal);
      renderPath(visitedCells, path);
    }
  }

  return ( 
    <div className='pathfinder-container'>
      <div className='input'>
        <button className={'btn btn-primary' + (running ? ' disabled' : '')} onClick={() => setAction('start')}>Set Start</button>
        <button className={'btn btn-primary' + (running ? ' disabled' : '')} onClick={() => setAction('goal')}>Set Goal</button>
        <button className={'btn btn-primary' + (running ? ' disabled' : '')} onClick={() => setAction('block')}>Set Block</button>
        <Dropdown className={running ? ' disabled' : ''} label={algorithm ? algorithm.label : 'Algorithm'} handleClick={(algo) => setAlgorithm(algo)}/>
        <button className='btn btn-danger' onClick={resetGrid}>Reset</button>
        <button className={'btn btn-success' + (start && goal && algorithm && !running ? '' : ' disabled')} onClick={execute}>Execute</button>
      </div>
      <div className='grid-container'>
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