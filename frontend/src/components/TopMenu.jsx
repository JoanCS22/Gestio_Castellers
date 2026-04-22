import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaUserCircle, FaArrowLeft, FaPlusSquare, FaChevronDown } from "react-icons/fa";

import LeftMenu from "./LeftMenu";

import "./TopMenu.css";

function TopMenu({ title = "text", tornar = false, canvi_colla = false }) {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false)
  const [open_colla, setOpenColla] = useState(false);
  const [message, setTempMessage] = useState(null);

  const [colles, setColles] = useState([]);

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

  const getCollesUser = async () => {

    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:5000/colla/getCollesUser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (response.ok) {
      setColles(data);
      console.log("{DEBUG} Get user's data OK")
    } else {
      console.log("{DEBUG} Get user's data KO")
      setError(data.message);
    }
  }

  useEffect(() => {
    getCollesUser();
  }, []);

  return (
    <div className='topmenu-container'>
      <div className='left-content'>
        <LeftMenu />
      </div>

      <div className='center-content'>
        {canvi_colla ? (
          <div className='colla-selector' onClick={() => setOpenColla(!open_colla)}>
            <span>Selecciona colla</span>
            <FaChevronDown />
            {open_colla && (
              <div className="dropdown-colla">
                <div
                  className="dropdown-colla-item"
                  onClick={() => {
                    setOpenColla(false);
                    navigate("/create_colla");
                  }}
                >
                  Afegir colla <FaPlusSquare />
                </div>

                <hr className="dropdown-divider-colla" />

                <div className="dropdown-item-colla altre">
                  Colla Existent
                </div>
              </div>
            )}
          </div>
        ) : (
          <h1>{title}</h1>
        )}
      </div >


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

      {
        message && (
          <div className={`message ${message.type}`}>
            {message.message}
          </div>
        )
      }
    </div >
  )
}

export default TopMenu;