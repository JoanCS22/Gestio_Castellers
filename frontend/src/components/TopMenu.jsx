import React, { useState } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaUserCircle, FaArrowLeft } from "react-icons/fa";

import "./TopMenu.css";


function TopMenu({ title = "text", tornar = false }) {
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
        <h1>{title}</h1>
      </div>

      <div className="right-content">
        {tornar ? (
          <div className="user-wrapper" onClick={() => navigate(-1)}>
            <FaArrowLeft />
            <span>TORNAR</span>
          </div>
        ) : (
          <div className="user-wrapper" onClick={() => setOpen(!open)}>
            <FaUserCircle />
            <span>USUARI</span>

            {open && (
              <div className="dropdown">
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setOpen(false);
                    navigate("/normal_profile");
                  }}
                >
                  Perfil
                </div>

                <hr className="dropdown-divider" />

                <div className="dropdown-item logout" onClick={logoutApp}>
                  Tancar sessió
                </div>
              </div>
            )}
          </div>
        )}
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