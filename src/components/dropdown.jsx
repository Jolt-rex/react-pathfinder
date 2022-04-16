import React, { useState } from 'react';

const Dropdown = ({ label, handleClick }) => {
  const [visible, setVisible] = useState(false);

  function toggle() { setVisible(!visible); }

  function handleOnClick(e) {
    e.preventDefault();
    handleClick({ id: e.target.id, label: e.target.getAttribute('label') });
    toggle();
  }

  return ( 
    <div className="btn-group dropdown">
      <button className="btn btn-primary dropdown-toggle" onClick={toggle} type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
        {label}
      </button>
      <div className={'dropdown-menu' + (visible ? ' show' : '')} aria-labelledby="dropdownMenuLink">
        <a className='dropdown-item' id='aStar' label='A Star' href='#' onClick={handleOnClick}>A Star</a>
        <a className='dropdown-item' id='dijkstra' label='Dijkstra' href='#' onClick={handleOnClick}>Dijkstra</a>
      </div>
    </div>
   );
}
 
export default Dropdown;
