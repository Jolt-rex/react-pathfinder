import React from 'react';
import './cell.css';
import TargetSVG from '../assets/target.svg';
import RocketSVG from '../assets/rocket.svg';

const Cell = ({ status, row, col, onHandleClick, onMouseOver }) => {

  function handleClick(e) {
    e.preventDefault();
    onHandleClick(row, col);
  }

  function handleMouseOver(e) {
    e.preventDefault();
    // if the button 1 of the mouse is pressed while moving over the cell, call the function
    if(e.buttons === 1 && status === 'empty')
      onMouseOver(row, col);
  }

  return ( 
    <div className={'cell ' + status} row={row} col={col} onMouseDown={handleClick} onMouseEnter={handleMouseOver} >
      {status === 'goal' && <img className='cell-content' src={TargetSVG} alt='Goal' />}
      {status === 'start' && <img className='cell-content' src={RocketSVG} alt='Goal' />}
    </div>
  );
}
 
export default Cell;