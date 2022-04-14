import React from 'react';
import './cell.css';
import TargetSVG from '../assets/target.svg';
import RocketSVG from '../assets/rocket.svg';

const Cell = ({ status, row, col, onHandleClick }) => {

  function handleClick() {
    onHandleClick(row, col);
  }

  return ( 
    <div className={'cell ' + status} row={row} col={col} onClick={handleClick} >
      {status === 'goal' && <img className='cell-content' src={TargetSVG} alt='Goal' />}
      {status === 'start' && <img className='cell-content' src={RocketSVG} alt='Goal' />}
    </div>
  );
}
 
export default Cell;