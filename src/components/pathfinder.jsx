import React, { useState, useEffect } from 'react';
import Cell from './cell';
import './pathfinder.css';

function Pathfinder({ width, height }) {
  const [grid, setGrid] = useState([]);
  const [start, setStart] = useState(null);
  const [goal, setGoal] = useState(null);
  const [action, setAction] = useState('');
  
  useEffect(() => {
    console.log('Use effect called');
    
    resetGrid();
  }, []);

  function resetGrid() {
    const newGrid = Array(height).fill(0).map(row => new Array(width).fill({}));

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        newGrid[row][col] = { status: 'empty', row, col };
      }
    }

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

  return ( 
    <div className='pathfinder-container'>
      <p>Our grid is set to size of {grid.length}</p>
      {goal && <p>The goal is at row {goal.row} column {goal.col}</p>}
      <p>Current action is {action}</p>
      <div className="grid">
        <button className='btn btn-primary' onClick={() => setAction('start')}>Set Start</button>
        <button className='btn btn-primary' onClick={() => setAction('goal')}>Set Goal</button>
        <button className='btn btn-primary' onClick={() => setAction('block')}>Set Block</button>
        <button className='btn btn-warning' onClick={() => resetGrid()}>Reset</button>
            {grid !== [] &&
              grid.map(row => {
                return <div key={row[0].row} className="row">
                  {row.map(({ status, row, col }) => <Cell key={"" + row + col} status={status} row={row} col={col} onHandleClick={onHandleCellClick} onMouseOver={onHandleMouseOver} />)}
                </div>
              })
            }
      </div>
    </div>
  );
}
 
export default Pathfinder;