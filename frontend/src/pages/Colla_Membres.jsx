import { getCollaMembers, searchUsers, addUserToColla } from "../services/membersService.js";
import { handleApiError } from "../utils/handleApiError.js";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { FaPlusSquare, FaSearch, FaUserEdit, FaArrowLeft, FaRegCheckSquare } from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx"

import { useColla } from "../context/CollaContext.jsx";

import './Colla_Membres.css';

import TopMenu from "../components/TopMenu";
import Button from "../components/Button";
import Input from "../components/Input";

function MembresColla() {

    const navigate = useNavigate();

    const { currentColla, loadingColles } = useColla();

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

    const loadCollaMembers = async () => {
        try {
            const data = await getCollaMembers(currentColla?.id);
            setMembers(data);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const searchUsersCall = async () => {
        try {
            const data = await searchUsers(modalTags);
            setSearchResults(data);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const addUserToCollaCall = async (idUser) => {
        const idColla = localStorage.getItem("id_colla");
        try {
            const data = await addUserToColla(currentColla.id, idUser);
            setError("");
            showTempMessage("Usuari afegit correctament a la colla.");
            setTimeout(() => {
                navigate(`/tecnica_profile?userId=${idUser}&collaId=${idColla}`);
            }, 2000);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    useEffect(() => {
        loadCollaMembers();
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
                                    setSearchResults([]);
                                    setModalTags({ nom: "", cognoms: "", correu: "" });
                                }} />

                            <Button
                                text="Buscar"
                                icon={<FaSearch />}
                                action={searchUsersCall}
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
                                                                    addUserToCollaCall(user.id);
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