import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { FaPlusSquare, FaSearch } from "react-icons/fa";

import './Colla_Membres.css';

import TopMenu from "../components/TopMenu";
import Button from "../components/Button";

function MembresColla() {

    const [message, setTempMessage] = useState(null);
    const [error, setError] = useState("");

    const [members, setMembers] = useState([]);

    const [groups, setGroups] = useState([]);
    const [positions, setPositions] = useState([]);

    const [selectedGroups, setSelectedGroups] = useState([]);
    const [selectedPositions, setSelectedPositions] = useState([]);

    const [openGroups, setOpenGroups] = useState(false);
    const [openPositions, setOpenPositions] = useState(false);

    const handleGroupChange = (value) => {
        setSelectedGroups(prev =>
            prev.includes(value)
                ? prev.filter(v => v !== value)
                : [...prev, value]
        );
    };

    const handlePositionChange = (value) => {
        setSelectedPositions(prev =>
            prev.includes(value)
                ? prev.filter(v => v !== value)
                : [...prev, value]
        );
    };

    const handlePositionsChange = (e) => {
        const values = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedPositions(values);
    };

    return (
        <div>
            <TopMenu
                title='Membres colla'
            />
            <div className="button-add-membres">
                <Button
                    text='Afegir membre'
                    icon={<FaPlusSquare />}
                    action={() => { }}
                />
            </div>
            <div className="filtres-members">
                <div className="search-tab-members">
                    <span>Cercar:</span>
                    <FaSearch />
                    <input type='search' placeholder='Cercar...'></input>
                </div>
                <div className="dropdown-grups-members">
                    <span>Grups:</span>
                    <button onClick={() => setOpenGroups(!openGroups)}>
                        Seleccionats ({selectedGroups.length}) ▾
                    </button>
                    {openGroups && (
                        <div className="dropdown-content-grups-members">
                            {groups.map(group => (
                                <label key={group}>
                                    <input
                                        type="checkbox"
                                        checked={selectedGroups.includes(group)}
                                        onChange={() => handleGroupChange(group)}
                                    />
                                    {group}
                                </label>
                            ))}
                        </div>
                    )}
                </div>
                <div className="dropdown-positions-members">
                    <span>Posicions:</span>
                    <button onClick={() => setOpenPositions(!openPositions)}>
                        Seleccionades ({selectedPositions.length}) ▾
                    </button>
                    {openPositions && (
                        <div className="dropdown-content-positions-members">
                            {positions.map(pos => (
                                <label key={pos}>
                                    <input
                                        type="checkbox"
                                        checked={selectedPositions.includes(pos)}
                                        onChange={() => handlePositionChange(pos)}
                                    />
                                    {pos}
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="table-members">
                <table>
                    <colgroup>
                        <col style={{ width: "25%" }} />
                        <col style={{ width: "15%" }} />
                        <col style={{ width: "30%" }} />
                        <col style={{ width: "10%" }} />
                        <col style={{ width: "20%" }} />
                    </colgroup>

                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Sobrenom</th>
                            <th>Posicions</th>
                            <th>Rol</th>
                            <th>Darrera actualització</th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default MembresColla;