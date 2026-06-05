import { getCollaMembers, searchUsers, addUserToColla } from "../services/membersService.js";
import { handleApiError } from "../utils/handleApiError.js";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaPlusSquare, FaSearch, FaUserEdit, FaArrowLeft,
    FaRegCheckSquare, FaTimesCircle
} from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx";
import { useColla } from "../context/CollaContext.jsx";

import './Colla_Membres.css';
import TopMenu from "../components/TopMenu";

function MembresColla() {
    const navigate = useNavigate();
    const { currentColla } = useColla();

    const permissions        = getPermissions();
    const hasWritePermission = (key) => permissions[key] === "W";

    const [error, setError]           = useState("");
    const [message, setTempMessage]   = useState(null);
    const [members, setMembers]       = useState([]);
    const [search, setSearch]         = useState("");

    const [showModal, setShowModal]   = useState(false);
    const [modalTags, setModalTags]   = useState({ nom: "", cognoms: "", correu: "" });
    const [searchResults, setSearchResults] = useState([]);

    const showTempMessage = (msg, type = "success") => {
        setTempMessage({ message: msg, type });
        setTimeout(() => setTempMessage(null), 2000);
    };

    const loadCollaMembers = async () => {
        try { setMembers(await getCollaMembers(currentColla?.id)); }
        catch (err) { handleApiError(err, navigate, setError); }
    };

    const searchUsersCall = async () => {
        try { setSearchResults(await searchUsers(modalTags)); }
        catch (err) { handleApiError(err, navigate, setError); }
    };

    const addUserToCollaCall = async (idUser) => {
        const idColla = localStorage.getItem("id_colla");
        try {
            await addUserToColla(currentColla.id, idUser);
            setError("");
            showTempMessage("Usuari afegit correctament a la colla.");
            setShowModal(false);
            setSearchResults([]);
            setModalTags({ nom: "", cognoms: "", correu: "" });
            setTimeout(() => navigate(`/tecnica_profile?userId=${idUser}&collaId=${idColla}`), 2000);
        } catch (err) { handleApiError(err, navigate, setError); }
    };

    const closeModal = () => {
        setShowModal(false);
        setSearchResults([]);
        setModalTags({ nom: "", cognoms: "", correu: "" });
        setError("");
    };

    useEffect(() => { loadCollaMembers(); }, []);

    /* Inicials de l'avatar */
    const getInitials = (nom, cognoms) => {
        const n = nom?.[0] || "";
        const c = cognoms?.[0] || "";
        return (n + c).toUpperCase();
    };

    const filtered = members.filter(m =>
        !search ||
        `${m.nom} ${m.cognoms}`.toLowerCase().includes(search.toLowerCase()) ||
        m.mote?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <TopMenu title="Membres colla" />

            {message && <div className={`message ${message.type}`}>{message.message}</div>}

            <div className="membres-page">

                <div className="membres-top-row">

                    <div className="membres-search-block">
                        <div className="membres-search-wrap">
                            <FaSearch />
                            <input
                                type="search"
                                placeholder="Cerca un membre..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        {hasWritePermission("membres") && (
                            <div className="membres-search-actions">
                                <button className="btn-add-membre" onClick={() => setShowModal(true)}>
                                    <FaPlusSquare /> Afegir membre
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="membres-stats-card">
                        <div>
                            <p className="membres-stats-total-label">Total Castellers</p>
                            <p className="membres-stats-total-value">{members.length}</p>
                        </div>
                        <div className="membres-stats-breakdown">
                            <div className="membres-stats-row">
                                <span>
                                    <span className="membres-stats-dot" style={{ background: "#22c55e" }} />
                                    Actius
                                </span>
                                <span style={{ fontWeight: 700 }}>
                                    {members.filter(m => !m.lesionat).length}
                                </span>
                            </div>
                            <div className="membres-stats-row">
                                <span>
                                    <span className="membres-stats-dot" style={{ background: "#eab308" }} />
                                    Lesionats
                                </span>
                                <span style={{ fontWeight: 700 }}>
                                    {members.filter(m => m.lesionat).length}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="membres-filters-block">
                        <div className="membres-filters-left">
                            <div className="membres-select-wrap">
                                <select defaultValue="">
                                    <option value="">Totes les Posicions</option>
                                </select>
                            </div>
                            <div className="membres-select-wrap">
                                <select defaultValue="">
                                    <option value="">Tots els Rols</option>
                                </select>
                            </div>
                            <div className="membres-select-wrap">
                                <select defaultValue="">
                                    <option value="">Tots els Grups</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="membres-table-wrap">
                        <table className="membres-table">
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Sobrenom</th>
                                    <th>Posicions</th>
                                    <th>Rol</th>
                                    <th>Darrera actualització</th>
                                    <th>Accions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(member => (
                                    <tr key={member.id_usuari}>
                                        <td>
                                            <div className="member-name-cell">
                                                <div className="member-avatar">
                                                    {getInitials(member.nom, member.cognoms)}
                                                </div>
                                                <div>
                                                    <div className="member-name-title">
                                                        {member.nom} {member.cognoms}
                                                    </div>
                                                    {member.email && (
                                                        <div className="member-name-email">{member.email}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <span className="member-mote">
                                                {member.mote ? `"${member.mote}"` : "—"}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="member-positions">
                                                {member.posicions?.length > 0
                                                    ? member.posicions.map((p, i) => (
                                                        <span key={i} className="member-position-badge">{p}</span>
                                                    ))
                                                    : <span style={{ color: "var(--outline)", fontSize: "var(--text-label-sm)" }}>—</span>
                                                }
                                            </div>
                                        </td>

                                        <td>
                                            <span className="member-rol">{member.rol || "—"}</span>
                                        </td>

                                        <td>
                                            <span className="member-data">
                                                {new Date(member.data_acces).toLocaleDateString("ca-ES")}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="member-actions">
                                                {hasWritePermission("membres") && (
                                                    <button
                                                        className="btn-member-action"
                                                        title="Editar membre"
                                                        onClick={() => navigate(`/tecnica_profile?userId=${member.id_usuari}&collaId=${member.id_colla}`)}
                                                    >
                                                        <FaUserEdit />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: "center", padding: "var(--space-xl)", color: "var(--on-surface-variant)" }}>
                                            No s'han trobat membres
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <div className="membres-table-footer">
                            <p>Mostrant {filtered.length} de {members.length} membres</p>
                        </div>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}
            </div>

            {showModal && (
                <div className="modal-overlay-search">
                    <div className="modal-search">

                        <div className="modal-search-header">
                            <h2>Afegir membre</h2>
                            <button
                                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--secondary)", fontSize: "18px", display: "flex", alignItems: "center" }}
                                onClick={closeModal}
                            >
                                <FaTimesCircle />
                            </button>
                        </div>

                        <div className="modal-search-body">
                            <div className="inputs-grid-search">
                                {[
                                    { key: "nom",    label: "Nom",               placeholder: "Nom" },
                                    { key: "cognoms", label: "Cognoms",           placeholder: "Cognoms" },
                                    { key: "correu",  label: "Correu electrònic", placeholder: "email@exemple.cat" },
                                ].map(({ key, label, placeholder }) => (
                                    <div key={key} className="modal-search-field">
                                        <label>{label}</label>
                                        <input
                                            type="text"
                                            placeholder={placeholder}
                                            value={modalTags[key]}
                                            onChange={e => setModalTags({ ...modalTags, [key]: e.target.value })}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="modal-buttons-search">
                                <button
                                    style={{ display:"inline-flex", alignItems:"center", gap:"var(--space-sm)", padding:"var(--space-sm) var(--space-md)", background:"var(--primary)", color:"var(--on-primary)", border:"none", borderRadius:"var(--radius-md)", fontFamily:"var(--font-base)", fontSize:"var(--text-label-md)", fontWeight:700, cursor:"pointer", boxShadow:"var(--shadow-sm)" }}
                                    onClick={searchUsersCall}
                                >
                                    <FaSearch /> Buscar
                                </button>
                            </div>

                            {searchResults.length > 0 && (
                                <div className="table-search-users">
                                    <table className="search-table">
                                        <thead>
                                            <tr>
                                                <th>Nom</th>
                                                <th>Cognoms</th>
                                                <th>Correu</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {searchResults.map(user => (
                                                <tr key={user.id}>
                                                    <td>{user.nom}</td>
                                                    <td>{user.cognoms}</td>
                                                    <td>{user.email}</td>
                                                    <td>
                                                        {members.some(m => m.id_usuari === user.id) ? (
                                                            <FaRegCheckSquare className="icon-already-member" title="Ja és membre" />
                                                        ) : (
                                                            <button
                                                                className="btn-add-user"
                                                                title="Afegir a la colla"
                                                                onClick={() => addUserToCollaCall(user.id)}
                                                            >
                                                                <FaPlusSquare />
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <div className="modal-search-footer">
                            <button
                                style={{ display:"inline-flex", alignItems:"center", gap:"var(--space-sm)", padding:"var(--space-sm) var(--space-lg)", background:"transparent", color:"var(--secondary)", border:"none", borderRadius:"var(--radius-md)", fontFamily:"var(--font-base)", fontSize:"var(--text-label-md)", fontWeight:700, cursor:"pointer" }}
                                onClick={closeModal}
                            >
                                <FaArrowLeft /> Tornar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MembresColla;