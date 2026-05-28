import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaOutdent, FaCaretDown, FaCaretUp } from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx"
import './LeftMenu.css';

import { useEvent } from "../utils/EventContext.jsx"

const LeftMenu = () => {

  const navigate = useNavigate();

  const location = useLocation();

  const [openLeft, setOpenLeft] = useState(false);
  const [openMenuAgenda, setOpenAgenda] = useState(false);
  const [openMenuColla, setOpenColla] = useState(false);

  const storedId = localStorage.getItem("id_colla");

  //assistencia, colla, esdeveniments, llistats, membres, notificacions, permisos, plantilles, proves
  const permissions = getPermissions();
  const hasAccess = (key) => permissions[key] !== "X";
  const hasWritePermission = (key) => permissions[key] === "W";

  const { currentEvent } = useEvent();

  useEffect(() => {
    setOpenLeft(false);
    setOpenAgenda(false);
    setOpenColla(false);
  }, [location.pathname]);

  return (
    <div className={`left-menu ${openLeft ? "open" : "closed"}`}>

      <div title={openLeft ? "Amagar menú" : "Desplegar menú"} className={`left-menu-button ${openLeft ? "open" : "closed"}`}
        onClick={() => setOpenLeft(!openLeft)}>
        {openLeft ? (
          <FaOutdent />
        ) : (
          <FaBars />
        )}
      </div>

      {openLeft && (
        <div className="menu-content">

          <div className='menu-foto'>
            <img src="LogoPlaca.png" title='Menú principal' alt="Logo" onClick={() => {
              setOpenLeft(false);
              setOpenAgenda(false);
              setOpenColla(false);
              navigate("/dashboard");
            }} />
            <span className='menu-title'>LA PLAÇA</span>
          </div>

          {(storedId != null) ? (
            <>
              <div className='menu-section' onClick={() => setOpenAgenda(!openMenuAgenda)}>
                Agenda {openMenuAgenda ? <FaCaretUp /> : <FaCaretDown />}
              </div>

              {openMenuAgenda && (
                <div className='submenu'>
                  {hasAccess("esdeveniments") && (
                    <div onClick={() => {
                      navigate("/esdeveniments");
                    }}>Esdeveniments</div>
                  )}
                  {hasAccess("proves") && (
                    <div onClick={() => {
                      navigate(`/proves?idEsdeveniment=${currentEvent.id}&nomEsdeveniment=${encodeURIComponent(currentEvent.nom)}`);
                    }}>Proves</div>
                  )}
                  {hasAccess("assistencia") && (
                    <div onClick={() => {
                      if (currentEvent && hasWritePermission("esdeveniments")) {
                        navigate(`/assistencia?idEsdeveniment=${currentEvent.id}&nomEsdeveniment=${encodeURIComponent(currentEvent.nom)}`);
                      } else if (currentEvent) {
                        navigate(`/assistencia_usuari?idEsdeveniment=${currentEvent.id}`)
                      }
                    }}>Assistència</div>
                  )}
                </div>
              )}

              {hasAccess("plantilles") && (
                <div className='menu-item' onClick={() => {
                  navigate("/plantilles");
                }}>Plantilles</div>
              )}

              {hasAccess("notificacions") && (
                <div className='menu-item' onClick={() => {
                  navigate(`/notificacions_board`);
                }}>Notificacions</div>
              )}

              <div className='menu-section' onClick={() => setOpenColla(!openMenuColla)}>
                La colla {openMenuColla ? <FaCaretUp /> : <FaCaretDown />}
              </div>

              {openMenuColla && (
                <div className='submenu'>

                  {hasAccess("colla") && (
                    <div onClick={() => {
                      navigate("/get_data_colla");
                    }}>Informació colla</div>
                  )}

                  {hasAccess("membres") && (
                    <div onClick={() => {
                      navigate("/members");
                    }}>Membres</div>
                  )}

                  {hasAccess("colla") && (
                    <div onClick={() => {
                      navigate("/etiquetes");
                    }}>Etiquetes</div>
                  )}

                </div>
              )}

              {hasAccess("llistats") && (
                <div className='menu-item' onClick={() => {

                }}>Llistats</div>
              )}
            </>
          ) : (
            <>
              <div className='menu-item' onClick={() => {
                setOpenLeft(false);
                navigate("/create_colla");
              }}> Crear colla </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default LeftMenu;