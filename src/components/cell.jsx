import React from 'react';
import './cell.css';

const Cell = ({ status, row, col, onHandleClick }) => {

  function handleClick({ target }) {
    console.log(target);
    onHandleClick(target);
  }

  return ( 
    <div className={'cell ' + status} row={row} col={col} onClick={handleClick} >{row} {col} {status}</div>
  );
}
 
export default Cell;