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
  const [visited, setVisited] = useState([]);
  const [path, setPath] = useState([]);
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

    setGrid(newGrid);
    setStart(null);
    setGoal(null);
    setPath([]);
    setVisited([]);
    setAlgorithm(null);
    setRunning(false);
    setHasRun(false);
  }

  function clearPath() {
    const newGrid = [...grid];
    setVisited([]);
    setPath([]);
    visited.forEach(({ row, col }) => { newGrid[row][col].visited = false });
    path.forEach(({ row, col }) => { newGrid[row][col].path = false });
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

  async function animateCells(cells, stateToSet, quick=false) {
    // update the document directly to avoid performace issues
    // with re-rendering DOM multiple times
    const newGrid = [...grid];
    for (let i = 0; i < cells.length; i++) {
      const cell = document.getElementById(`r-${cells[i].row}-c-${cells[i].col}`);
      cell.className = `${cell.className} ${stateToSet}`
      await new Promise(resolve => { setTimeout(() => resolve(), 20) });
    
      newGrid[cells[i].row][cells[i].col][stateToSet] = true;
    }
    // now update the DOM grid
    setGrid(newGrid);
  }

  async function renderPath(visitedCells, pathCells) {
    await animateCells(visitedCells, 'visited');
    await animateCells(pathCells, 'path');
    setHasRun(true);
    setRunning(false);
  }

  function quickRender(visited, path) {
    animateCells(visited, 'visited', true);
    animateCells(path, 'path', true);
  }

  function execute() {
    if (!start || !goal || !algorithm) return;
    setRunning(true);
    
    const [visitedCells, pathCells] = algorithms[algorithm.id](grid, start, goal);
    console.log(visitedCells);
    console.log(pathCells);
    setVisited(visitedCells);
    setPath(pathCells);

    renderPath(visitedCells, pathCells);
  }

  function handleChangeAlgorithm(algorithm) {
    setAlgorithm(algorithm);
    // if we have already run, run again with changed algirithm
    if (hasRun) {
      clearPath();
      execute();
    }
  }

  return ( 
    <div className='pathfinder-container'>
      <div className='input'>
        <button className={'btn btn-primary' + (running ? ' disabled' : '')} onClick={() => setAction('start')}>Set Start</button>
        <button className={'btn btn-primary' + (running ? ' disabled' : '')} onClick={() => setAction('goal')}>Set Goal</button>
        <button className={'btn btn-primary' + (running ? ' disabled' : '')} onClick={() => setAction('block')}>Set Block</button>
        <Dropdown className={running ? ' disabled' : ''} label={algorithm ? algorithm.label : 'Algorithm'} handleClick={handleChangeAlgorithm}/>
        <button className={'btn btn-danger' + (running ? ' disabled' : '')} onClick={resetGrid}>Reset</button>
        <button className={'btn btn-success' + (start && goal && algorithm && !running ? '' : ' disabled')} onClick={execute}>Execute</button>
      </div>
      <div className='grid-container'>
        {grid !== [] &&
          grid.map(row => {
            return <div key={row[0].row} className="row">
              {row.map(({ status, visited, path, row, col }) => <Cell key={`${row} ${col}`} id={`r-${row}-c-${col}`} status={status} visited={visited} path={path} row={row} col={col} onHandleClick={onHandleCellClick} onMouseOver={onHandleMouseOver} />)}
            </div>
          })
        }
      </div>
    </div>
  );
}
 
export default Pathfinder;