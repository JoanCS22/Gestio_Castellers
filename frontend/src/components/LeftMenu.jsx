import React, { useState } from 'react'
import { FaBars, FaOutdent, FaCaretDown, FaCaretUp } from "react-icons/fa";
import './LeftMenu.css';

const LeftMenu = () => {
  const [openLeft, setOpenLeft] = useState(false);
  const [openMenuAgenda, setOpenAgenda] = useState(false);
  const [openMenuColla, setOpenColla] = useState(false);

  return (
    <div className={`left-menu ${openLeft ? "open" : "closed"}`}>

      <div className={`left-menu-button ${openLeft ? "open" : "closed"}`} onClick={() => setOpenLeft(!openLeft)}>
        {openLeft ? (
          <FaOutdent />
        ) : (
          <FaBars />
        )}
      </div>

      {openLeft && (
        <div className="menu-content">

          <div className='menu-section' onClick={() => setOpenAgenda(!openMenuAgenda)}>
            Agenda {openMenuAgenda ? <FaCaretUp /> : <FaCaretDown />}
          </div>

          {openMenuAgenda && (
            <div className='submenu'>
              <div onClick={() => { }}>Esdeveniments</div>
              <div onClick={() => { }}>Proves</div>
              <div onClick={() => { }}>Assistència</div>
            </div>
          )}

          <div className='menu-item' onClick={() => { }}>Plantilles</div>
          <div className='menu-item' onClick={() => { }}>Notificacions</div>

          <div className='menu-section' onClick={() => setOpenColla(!openMenuColla)}>
            La colla {openMenuColla ? <FaCaretUp /> : <FaCaretDown />}
          </div>

          {openMenuColla && (
            <div className='submenu'>
              <div onClick={() => { }}>Informació colla</div>
              <div onClick={() => { }}>Membres</div>
              <div onClick={() => { }}>Etiquetes</div>
            </div>
          )}

          <div className='menu-item' onClick={() => { }}>Llistats</div>

        </div>
      )}
    </div>
  );
};

export default LeftMenu;