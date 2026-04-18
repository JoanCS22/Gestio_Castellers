import React from 'react'
import "./TopMenu.css";

function TopMenu() {
  return (
    <div className='topmenu-container'>
      <div className='left-content'>
        <button className="menu-button">☰</button>
      </div>

      <div className='center-content'>
        <h1>Les meves dades</h1>
      </div>

      <div className='right-content'>
        <div className="user-box">
          👤 <span>USUARI</span> ▼
        </div>
      </div>
    </div>
  )
}

export default TopMenu;