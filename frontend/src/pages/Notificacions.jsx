import {
    getNotifications, sendNotification
} from "../services/notificacionsService.js";
import { getCollesGroups } from "../services/collaService.js";
import { handleApiError } from "../utils/handleApiError.js";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaSearch, FaRegEye, FaTimesCircle, FaPaperPlane, FaBullhorn
} from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx";
import { useColla } from "../context/CollaContext.jsx";

import './Notificacions.css';
import TopMenu from "../components/TopMenu.jsx";
import MultiSelectDropdown from "../components/MultiSelectDropdown.jsx";

function Notificacions() {
    const navigate = useNavigate();
    const { currentColla } = useColla();

    const permissions        = getPermissions();
    const hasWritePermission = (key) => permissions[key] === "W";

    const [message, setTempMessage] = useState(null);
    const [error, setError]         = useState("");
    const [notificacions, setNotificacions] = useState([]);
    const [grups, setGrups]         = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [search, setSearch]       = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isCreate, setCreate]     = useState(true);
    const [nomEmisor, setNomEmisor] = useState("");

    const getToday = () => new Date().toISOString().split("T")[0];

    const [modalTags, setModalTags] = useState({
        titol: "", missatge: "", data_programacio: getToday()
    });

    const showTempMessage = (msg, type = "success") => {
        setTempMessage({ message: msg, type });
        setTimeout(() => setTempMessage(null), 2000);
    };

    const loadNotifications = async () => {
        try { setNotificacions(await getNotifications(currentColla.id)); }
        catch (err) { handleApiError(err, navigate, setError); }
    };

    const loadCollesGrups = async () => {
        try { setGrups(await getCollesGroups(currentColla.id)); }
        catch (err) { handleApiError(err, navigate, setError); }
    };

    const createNotification = async () => {
        if (!modalTags.titol || !modalTags.missatge || !modalTags.data_programacio) {
            setError("No es pot deixar cap camp buit"); return;
        }
        if (modalTags.data_programacio < getToday()) {
            setError("La data d'enviament no pot ser anterior a avui"); return;
        }
        try {
            await sendNotification(currentColla.id, modalTags, selectedGroups);
            setError("");
            setShowModal(false);
            setModalTags({ titol: "", missatge: "", data_programacio: getToday() });
            await loadNotifications();
            showTempMessage("Notificació enviada correctament.");
        } catch (err) { handleApiError(err, navigate, setError); }
    };

    const closeModal = () => {
        setShowModal(false);
        setError("");
        setModalTags({ titol: "", missatge: "", data_programacio: getToday() });
        setSelectedGroups([]);
    };

    useEffect(() => {
        loadNotifications();
        loadCollesGrups();
    }, []);

    const filtered = notificacions.filter(n =>
        !search ||
        n.titol?.toLowerCase().includes(search.toLowerCase()) ||
        n.nom_emisor?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <TopMenu title="Notificacions" />

            {message && <div className={`message ${message.type}`}>{message.message}</div>}

            <div className="notificacions-page">

                <div className="notificacions-header">
                    <div className="notificacions-search">
                        <FaSearch />
                        <input
                            type="search"
                            placeholder="Cerca notificacions..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    {hasWritePermission("notificacions") && (
                        <button
                            className="btn-send-notificacio"
                            onClick={() => { setCreate(true); setShowModal(true); }}
                        >
                            <FaPaperPlane /> Enviar notificació
                        </button>
                    )}
                </div>

                <div className="notificacions-card">
                    <div className="notificacions-card-header">
                        <span className="notificacions-card-title">Llistat de comunicats</span>
                    </div>

                    <div>
                        {filtered.length === 0 ? (
                            <div style={{ padding: "var(--space-xl)", textAlign: "center", color: "var(--on-surface-variant)" }}>
                                No hi ha notificacions
                            </div>
                        ) : filtered.map(notificacio => (
                            <div key={notificacio.id} className="notificacio-item">
                                <div className="notificacio-icon">
                                    <FaBullhorn />
                                </div>
                                <div className="notificacio-content">
                                    <div className="notificacio-text">
                                        <div className="notificacio-titol">{notificacio.titol}</div>
                                        <div className="notificacio-preview">{notificacio.missatge}</div>
                                    </div>
                                    <div className="notificacio-emisor">
                                        {notificacio.nom_emisor}
                                    </div>
                                    <div className="notificacio-meta">
                                        <span className="notificacio-data">
                                            {new Date(notificacio.data_programacio).toLocaleDateString("ca-ES")}
                                        </span>
                                        <button
                                            className="btn-view-notificacio"
                                            title="Consultar"
                                            onClick={() => {
                                                setCreate(false);
                                                setModalTags({
                                                    titol: notificacio.titol,
                                                    missatge: notificacio.missatge,
                                                    data_programacio: notificacio.data_programacio,
                                                });
                                                setNomEmisor(notificacio.nom_emisor);
                                                setShowModal(true);
                                            }}
                                        >
                                            <FaRegEye />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="notificacions-card-footer">
                        <p>Mostrant {filtered.length} de {notificacions.length} notificacions</p>
                    </div>
                </div>

                {error && !showModal && <div className="error-message">{error}</div>}
            </div>

            {showModal && (
                <div className="modal-overlay-notificacions">
                    <div className="modal-notificacions">

                        {!isCreate && (
                            <div className="modal-notificacions-header">
                                <div className="modal-notificacions-header-left">
                                    <div className="modal-notificacions-icon">
                                        <FaBullhorn />
                                    </div>
                                    <div>
                                        <h2>{modalTags.titol}</h2>
                                    </div>
                                </div>
                                <button className="btn-close-modal" onClick={closeModal}>
                                    <FaTimesCircle />
                                </button>
                            </div>
                        )}

                        {isCreate ? (
                            <>
                                <div className="modal-notificacions-body">
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <h2 style={{ margin: 0, fontSize: "var(--text-headline-md)", fontWeight: 700, color: "var(--on-surface)" }}>
                                            Enviar nova notificació
                                        </h2>
                                        <button className="btn-close-modal" onClick={closeModal}>
                                            <FaTimesCircle />
                                        </button>
                                    </div>

                                    <p className="modal-hint">
                                        Si no es marca cap grup, s'envia a tots els membres de la colla.
                                    </p>

                                    <div className="modal-field-notificacions">
                                        <label>Títol de la notificació</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: Convocatòria d'assaig extraordinari"
                                            value={modalTags.titol}
                                            onChange={e => setModalTags({ ...modalTags, titol: e.target.value })}
                                        />
                                    </div>

                                    <div className="modal-row-notificacions">
                                        <div className="modal-field-notificacions">
                                            <label>Data d'enviament</label>
                                            <input
                                                type="date"
                                                value={modalTags.data_programacio}
                                                min={getToday()}
                                                onChange={e => setModalTags({ ...modalTags, data_programacio: e.target.value })}
                                            />
                                        </div>
                                        <div className="modal-field-notificacions">
                                            <label>Grups</label>
                                            <MultiSelectDropdown
                                                options={grups}
                                                selected={selectedGroups}
                                                setSelected={setSelectedGroups}
                                                placeholder="Tots els membres"
                                            />
                                        </div>
                                    </div>

                                    <div className="modal-field-notificacions">
                                        <label>Cos del missatge</label>
                                        <textarea
                                            placeholder="Escriu aquí el contingut detallat del missatge..."
                                            value={modalTags.missatge}
                                            onChange={e => setModalTags({ ...modalTags, missatge: e.target.value })}
                                        />
                                    </div>

                                    {error && <div className="error-message">{error}</div>}
                                </div>

                                <div className="modal-notificacions-footer">
                                    <button className="btn-modal-cancel" onClick={closeModal}>Cancel·lar</button>
                                    <button className="btn-modal-send" onClick={createNotification}>
                                        <FaPaperPlane style={{ marginRight: "8px" }} /> Enviar ara
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="modal-notificacions-body">
                                    <div className="notificacio-view-header">
                                        <span className="notificacio-view-emisor">{nomEmisor}</span>
                                        <span className="notificacio-view-data">
                                            {new Date(modalTags.data_programacio).toLocaleDateString("ca-ES")}
                                        </span>
                                    </div>
                                    <div className="notificacio-view-missatge">{modalTags.missatge}</div>
                                </div>

                                <div className="modal-notificacions-footer">
                                    <button className="btn-modal-cancel" onClick={closeModal}>Tancar</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Notificacions;