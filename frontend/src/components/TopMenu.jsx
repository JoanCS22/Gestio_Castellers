import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaUserCircle, FaArrowLeft, FaPlusSquare, FaChevronDown, FaChevronUp } from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx"

import LeftMenu from "./LeftMenu";

import "./TopMenu.css";

function TopMenu({ title = "text", tornar = false, canvi_colla = false, onReady }) {
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

      console.log("{DEBUG} Get user's colles OK")
    } else {
      console.log("{DEBUG} Get user's colles KO")
    }
  }

  const getMemberPermissions = async () => {

    const token = localStorage.getItem("token");
    const idColla = localStorage.getItem("id_colla");
    const iduser = localStorage.getItem("user");

    const response = await fetch(`http://localhost:5000/members/getMemberPermissions?id=${idColla}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (response.status === 401 || response.status === 403) {
      localStorage.clear();
      navigate("/login");
      return;
    }

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("permissions", JSON.stringify(data.permisos));
      console.log("{DEBUG} Get user's roles OK")
    } else {
      console.log("{DEBUG} Get user's roles KO")
    }
  }

  useEffect(() => {
    const init = async () => {
      await getCollesUser();

      const idColla = localStorage.getItem("id_colla");

      if (idColla) {
        await getMemberPermissions();
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
                      await getMemberPermissions();
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