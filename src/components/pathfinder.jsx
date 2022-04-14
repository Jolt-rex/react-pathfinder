import React, { useState, useEffect } from 'react';
import Cell from './cell';
import './pathfinder.css';

function Pathfinder({ width, height }) {
  const [grid, setGrid] = useState([]);
  const [start, setStart] = useState({});
  const [goal, setGoal] = useState({});
  const [action, setAction] = useState('');
  
  useEffect(() => {
    console.log('Use effect called');
    
    const newGrid = Array(height).fill(0).map(row => new Array(width).fill({}));

    // Fill the new grid with row and col co-ordinates
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        newGrid[row][col] = { status: 'empty', row, col };
      }
    }

    setGrid(newGrid);
  }, []);
  
  function getCellStatus(row, col) {
    if ((start.row === row) && (start.col === col)) return 'start';
    if ((goal.row === row) && (goal.col === col)) return 'goal';
    return 'empty';
  }

  function onHandleCellClick(row, col) {
    console.log(row, col);

    const newGrid = [...grid];
    newGrid[row][col].status = action;
    
    setGrid(newGrid);

    if (action === 'goal') setGoal({ row, col });
    if (action === 'start') setStart({ row, col });
  }

  return ( 
    <div className='pathfinder-container'>
      <p>Our grid is set to size of {grid.length}</p>
      <p>The goal is at row {goal.row} column {goal.col}</p>
      <p>Current action is {action}</p>
      <div className="grid">
        <button className='btn btn-warning' onClick={() => setAction('start')}>Set Start</button>
        <button className='btn btn-warning' onClick={() => setAction('goal')}>Set Goal</button>
            {grid !== [] &&
              grid.map(row => {
                return <div key={row[0].row} className="row">
                  {row.map(({ row, col }) => <Cell key={"" + row + col} status={getCellStatus(row, col)} row={row} col={col} onHandleClick={onHandleCellClick} />)}
                </div>
              })
            }
      </div>
    </div>
  );
}
 
export default Pathfinder;