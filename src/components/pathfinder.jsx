import React, { useState, useEffect } from 'react';
import Cell from './cell';
import './pathfinder.css';

function Pathfinder({ gridSize }) {
  const [grid, setGrid] = useState([]);
  const [start, setStart] = useState({});
  const [goal, setGoal] = useState({});
  
  useEffect(() => {
    console.log('Use effect called');
    
    const newGrid = Array(gridSize).fill(0).map(row => new Array(gridSize).fill({}));

    // Fill the new grid with row and col co-ordinates
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
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

  function onHandleCellClick(cell) {
    const row = parseInt(cell.getAttribute('row'));
    const col = parseInt(cell.getAttribute('col'));

    const newGrid = [...grid];
    newGrid[row][col].status = 'goal';

    setGrid(newGrid);
    setGoal({ row, col });
  }

  return ( 
    <div className="grid">
      <p>Our grid is set to size of {grid.length}</p>
      <p>The goal is at row {goal.row} column {goal.col}</p>
      {grid !== [] &&
        grid.map(row => {
          return <div key={row[0].row} className="row">
            {row.map(({ row, col }) => <Cell key={"" + row + col} status={getCellStatus(row, col)} row={row} col={col} onHandleClick={onHandleCellClick} />)}
          </div>
        })
      }
    </div>
  );
}
 
export default Pathfinder;