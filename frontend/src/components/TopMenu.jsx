import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { FaBars, FaUserCircle } from "react-icons/fa";

import "./TopMenu.css";


function TopMenu() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false)
  const [message, setTempMessage] = useState(null);

  const logoutApp = () => {
    localStorage.clear();

    showTempMessage("Tancant sessió...");

    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  const showTempMessage = (message, type = "success") => {
    setTempMessage({ message, type });

    setTimeout(() => {
      setTempMessage(null);
    }, 2000);
  };


  return (
    <div className='topmenu-container'>
      <div className='left-content'>
        <FaBars />
      </div>

      <div className='center-content'>
        <h1>Les meves dades</h1>
      </div>

      <div className='right-content'>
        <div className="user-wrapper" onClick={() => setOpen(!open)}>
          <FaUserCircle />
          <span>USUARI</span>
          {open && (
            <div className="dropdown">
              <div className="dropdown-item">Perfil</div>
              <div className="dropdown-item" onClick={}>Configuració</div>
              <div className="dropdown-item logout" onClick={logoutApp}>
                Tancar sessió
              </div>
            </div>
          )}
        </div>
      </div>

      {message && (
        <div className={`message ${message.type}`}>
          {message.message}
        </div>
      )}
    </div>
  )
}

export default TopMenu;