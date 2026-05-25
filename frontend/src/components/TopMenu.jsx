import {
  getCollesUser,
} from "../services/collaService.js";
import {
  getMemberPermissions,
} from "../services/membersService.js";

import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaUserCircle, FaArrowLeft, FaPlusSquare, FaChevronDown, FaChevronUp } from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx"

import LeftMenu from "./LeftMenu";

import "./TopMenu.css";

function TopMenu({ title = "text", tornar = false, tornar_action,
  canvi_colla = false, onReady, leftIcons, rightIcons }) {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false)
  const [open_colla, setOpenColla] = useState(false);
  const [message, setTempMessage] = useState(null);

  const [colles, setColles] = useState([]);
  const [title_colla, setTitle] = useState('Crear nova colla');

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

  const getCollesUserCall = async () => {
    try {
      const data = await getCollesUser();
      setColles(data);

      if (data.length > 0) {
        const storedId = localStorage.getItem("id_colla");
        let selectedColla;
        if (storedId) {
          selectedColla = data.find(c => c.id == storedId);
        }
        if (!selectedColla) {
          selectedColla = data[0];
          localStorage.setItem("id_colla", selectedColla.id);
        }
        setTitle(selectedColla.nom);
      }
    } catch (err) {
      handleApiError(err, navigate, setError);
    }
  }

  const getMemberPermissionsCall = async () => {
    try {
      const data = await getMemberPermissions();
      localStorage.setItem("permissions", JSON.stringify(data.permisos));
    } catch (err) {
      handleApiError(err, navigate, setError);
    }
  }

  useEffect(() => {
    const init = async () => {
      await getCollesUserCall();

      const idColla = localStorage.getItem("id_colla");

      if (idColla) {
        await getMemberPermissionsCall();
      }

      if (onReady) onReady();
    };

    init();
  }, []);

  return (
    <div className='topmenu-container'>

      <div className='left-content'>
        <LeftMenu />
      </div>

      {(leftIcons !== null) && (
        <>
          <div className="left-title-content">
            {leftIcons}
          </div>
        </>
      )}

      <div className='center-content'>
        {canvi_colla ? (
          <div className='colla-selector' onClick={() => setOpenColla(!open_colla)}>
            <div className='selector-title'>
              <span>{title_colla}</span>
              {open_colla ? (<FaChevronUp />) : (<FaChevronDown />)}
            </div>
            {open_colla && (
              <div className="dropdown-colla">
                {colles.map((colla) => (
                  <React.Fragment key={colla.id}>
                    <div className="dropdown-item-colla" onClick={async () => {
                      localStorage.setItem("id_colla", colla.id);
                      setTitle(colla.nom)
                      setOpenColla(false);
                      await getMemberPermissionsCall();
                      if (onReady) onReady();
                    }}>
                      {colla.nom}
                    </div>
                    <hr className="dropdown-divider-colla" />
                  </React.Fragment>
                ))}
                {colles.length < 5 && (
                  <div
                    className="dropdown-colla-item"
                    onClick={() => {
                      setOpenColla(false);
                      navigate("/create_colla");
                    }}
                  >
                    Afegir colla <FaPlusSquare />
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <h1>{title}</h1>
        )}
      </div >

      {(rightIcons !== null) && (
        <>
          <div className="right-title-content">
            {rightIcons}
          </div>
        </>
      )}


      <div className="right-content">
        {tornar ? (
          <div className="user-wrapper" onClick={tornar_action ? tornar_action : () => { navigate(-1) }}>
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