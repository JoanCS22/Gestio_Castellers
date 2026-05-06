import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { FaPlusSquare, FaSearch, FaUserEdit, FaArrowLeft, FaRegCheckSquare } from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx"

import './Colla_Membres.css';

import TopMenu from "../components/TopMenu";
import Button from "../components/Button";
import Input from "../components/Input";

function MembresColla() {

    const navigate = useNavigate();

    //assistencia, colla, esdeveniments, llistats, membres, notificacions, permisos, plantilles, proves
    const permissions = getPermissions();
    const hasWritePermission = (key) => permissions[key] === "W";

    const [error, setError] = useState("");
    const [message, setTempMessage] = useState(null);

    const [members, setMembers] = useState([]);

    const [groups, setGroups] = useState([]);
    const [positions, setPositions] = useState([]);

    const [selectedGroups, setSelectedGroups] = useState([]);
    const [selectedPositions, setSelectedPositions] = useState([]);

    const [openGroups, setOpenGroups] = useState(false);
    const [openPositions, setOpenPositions] = useState(false);

    const [showModalAddMember, setShowModalAddMember] = useState(false);
    const [modalTags, setModalTags] = useState({
        nom: "",
        cognoms: "",
        correu: ""
    });
    const [searchResults, setSearchResults] = useState([]);

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

    const showTempMessage = (message, type = "success") => {
        setTempMessage({ message, type });

        setTimeout(() => {
            setTempMessage(null);
        }, 2000);
    };

    const getCollaMembers = async () => {

        const token = localStorage.getItem("token");
        const idColla = localStorage.getItem("id_colla");

        const response = await fetch(`http://localhost:5000/members/getMembers?id=${idColla}`, {
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
            setMembers(data);
            console.log("{DEBUG} Get colla's members OK")
        } else {
            console.log("{DEBUG} Get colla's members KO")
            setError(data.message);
        }
    }

    const searchUsers = async () => {

        const token = localStorage.getItem("token");
        const idColla = localStorage.getItem("id_colla");

        const response = await fetch(`http://localhost:5000/members/searchUsers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                nom: modalTags.nom || "",
                cognoms: modalTags.cognoms || "",
                email: modalTags.correu || ""
            })
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.clear();
            navigate("/login");
            return;
        }

        const data = await response.json();

        if (response.ok) {
            setSearchResults(data);
            console.log("{DEBUG} Get users by filters OK")
        } else {
            console.log("{DEBUG} Get users by filters KO")
            setError(data.message);
        }
    }

    const addUserToColla = async (idUser) => {

        const token = localStorage.getItem("token");
        const idColla = localStorage.getItem("id_colla");

        const response = await fetch(`http://localhost:5000/members/addMember?id=${idColla}&userid=${idUser}`, {
            method: "POST",
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
            setError("");
            showTempMessage("Usuari afegit correctament a la colla.");
            setTimeout(() => {
                navigate(`/tecnica_profile?userId=${idUser}&collaId=${idColla}`);
            }, 2000);
            console.log("{DEBUG} Add user to colla OK")
        } else {
            console.log("{DEBUG} Add user to colla KO")
            setError(data.message);
        }
    }

    useEffect(() => {
        getCollaMembers();
    }, []);

    return (
        <div>
            <TopMenu
                title='Membres colla'
            />
            {message && (
                <div className={`message ${message.type}`}>
                    {message.message}
                </div>
            )}
            <div className="button-add-membres">
                <>
                    {hasWritePermission("membres") && (
                        <Button
                            text='Afegir membre'
                            icon={<FaPlusSquare />}
                            action={() => {
                                setShowModalAddMember(true);
                            }}
                        />
                    )}
                </>
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
                        {members.map((member) => (
                            <tr key={member.id_usuari}>
                                <td>
                                    <div className="member-name-cell">
                                        <span>{`${member.nom} ${member.cognoms}`}</span>
                                        <>
                                            {hasWritePermission("membres") && (
                                                <FaUserEdit
                                                    className="icon-user-membre"
                                                    onClick={() => {
                                                        navigate(`/tecnica_profile?userId=${member.id_usuari}&collaId=${member.id_colla}`)
                                                    }}
                                                />
                                            )}
                                        </>
                                    </div>
                                </td>
                                <td>{member.mote}</td>
                                <td>{member.posicions?.join(", ") || "-"}</td>
                                <td>{member.rol}</td>
                                <td>
                                    {new Date(member.data_acces).toLocaleDateString("es-ES")}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showModalAddMember && (
                <div className="modal-overlay-search">
                    <div className="modal-search">
                        <h2>
                            Afegir membre
                        </h2>
                        <div className="inputs-grid-search">
                            <div className="search-results-name">
                                <Input
                                    name="name"
                                    type="text"
                                    placeholder="Nom"
                                    value={modalTags.nom}
                                    onChange={(e) =>
                                        setModalTags({ ...modalTags, nom: e.target.value })
                                    }
                                    inputTitle="Nom"
                                />
                            </div>
                            <div className="search-results-surname">
                                <Input
                                    name="cognoms"
                                    type="text"
                                    placeholder="Cognoms"
                                    value={modalTags.cognoms}
                                    onChange={(e) =>
                                        setModalTags({ ...modalTags, cognoms: e.target.value })
                                    }
                                    inputTitle="Cognoms"
                                />
                            </div>
                            <div className="search-results-email">
                                <Input
                                    name="email"
                                    type="text"
                                    placeholder="Correu electrònic"
                                    value={modalTags.correu}
                                    onChange={(e) =>
                                        setModalTags({ ...modalTags, correu: e.target.value })
                                    }
                                    inputTitle="Correu electrònic"
                                />
                            </div>
                        </div>
                        <div className="modal-buttons-search">
                            <Button
                                text="Tornar"
                                icon={<FaArrowLeft />}
                                action={() => {
                                    setShowModalAddMember(false);
                                    setModalTags({ nom: "", cognoms: "", correu: "" });
                                }} />

                            <Button
                                text="Buscar"
                                icon={<FaSearch />}
                                action={searchUsers}
                            />
                        </div>
                        <div className="table-search-users">
                            <table>
                                <colgroup>
                                    <col style={{ width: "35%" }} />
                                    <col style={{ width: "20%" }} />
                                    <col style={{ width: "35%" }} />
                                    <col style={{ width: "10%" }} />
                                </colgroup>

                                <thead>
                                    <tr>
                                        <th>Nom</th>
                                        <th>Cognoms</th>
                                        <th>Correu</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                {searchResults.length > 0 && (
                                    <>
                                        <tbody>
                                            {searchResults.map((user) => (
                                                <>
                                                    <tr key={user.id}>
                                                        <td>{user.nom}</td>
                                                        <td>{user.cognoms}</td>
                                                        <td>{user.email}</td>
                                                        <td>
                                                            {members.some(m => m.id_usuari === user.id) ? (
                                                                <>
                                                                    <FaRegCheckSquare />
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <button onClick={() => {
                                                                        setShowModalAddMember(false);
                                                                        setSearchResults([]);
                                                                        setModalTags({ nom: "", cognoms: "", correu: "" });
                                                                        addUserToColla(user.id);
                                                                    }}>
                                                                        <FaPlusSquare />
                                                                    </button>
                                                                </>
                                                            )}
                                                        </td>
                                                    </tr >
                                                </>
                                            ))}
                                        </tbody>
                                    </>
                                )}
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div >
    )
}

export default MembresColla;