import {
    getNotifications, sendNotification
} from "../services/notificacionsService.js";
import {
    getCollesGroups
} from "../services/collaService.js";
import { handleApiError } from "../utils/handleApiError.js";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { FaSearch, FaRegEye, FaTimesCircle, FaPaperPlane } from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx"

import { useColla } from "../context/CollaContext.jsx";

import './Notificacions.css';

import TopMenu from "../components/TopMenu.jsx";
import Button from "../components/Button.jsx";
import MultiSelectDropdown from "../components/MultiSelectDropdown.jsx";

function Notificacions() {

    const location = useLocation();
    const navigate = useNavigate();

    const { currentColla, loadingColles } = useColla();

    //notificacions
    const permissions = getPermissions();
    const hasWritePermission = (key) => permissions[key] === "W";

    const [message, setTempMessage] = useState(null);
    const [error, setError] = useState("");

    const [notificacions, setNotificacions] = useState([]);
    const [grups, setGrups] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);

    const [showModal, setShowModal] = useState(false);

    const getToday = () => {
        return new Date().toISOString().split("T")[0];
    };

    const [modalTags, setModalTags] = useState({
        titol: "",
        missatge: "",
        data_programacio: getToday(),
    });

    const [nomEmisor, setNomEmisor] = useState(true);

    const [isCreate, setCreate] = useState(true);

    const showTempMessage = (message, type = "success") => {
        setTempMessage({ message, type });

        setTimeout(() => {
            setTempMessage(null);
        }, 2000);
    };

    const loadNotifications = async () => {
        try {
            const data = await getNotifications(currentColla.id);
            setNotificacions(data);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const loadCollesGrups = async () => {
        try {
            const data = await getCollesGroups(currentColla.id);
            setGrups(data);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const createNotification = async () => {
        if (!modalTags.titol || !modalTags.missatge || !modalTags.data_programacio) {
            setError(`No es pot deixar cap camp buit`);
            return;
        }
        if (modalTags.data_programacio < getToday()) {
            setError("La data d'enviament no pot ser anterior a avui");
            return;
        }

        try {
            const data = await sendNotification(currentColla.id, modalTags, selectedGroups);
            setError("");
            setShowModal(false);
            setModalTags({ titol: "", missatge: "", data_programacio: getToday() });
            loadNotifications();
            showTempMessage("Notificació enviada correctament.");
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    useEffect(() => {
        loadNotifications();
        loadCollesGrups();
    }, []);

    return (
        <div>
            <TopMenu
                title={'Notificacions'}
            />
            {
                message && (
                    <div className={`message ${message.type}`}>
                        {message.message}
                    </div>
                )
            }
            <div className="button-section-notifications">
                {hasWritePermission("notificacions") && (
                    <>
                        <Button
                            text={'Enviar notificació'}
                            icon={<FaPaperPlane />}
                            action={() => {
                                setCreate(true);
                                setShowModal(true);
                            }}
                        />
                    </>
                )}
            </div>
            <div className="search-bar-notifications">
                <span>Cercar:</span>
                <FaSearch />
                <input type='search' placeholder='Cercar...'></input>
            </div>
            <div className="table-notificacions">
                <table>
                    <colgroup>
                        <col style={{ width: "20%" }} />
                        <col style={{ width: "50%" }} />
                        <col style={{ width: "20%" }} />
                        <col style={{ width: "10%" }} />
                    </colgroup>

                    <thead>
                        <tr>
                            <th>Emisor</th>
                            <th>Títol</th>
                            <th>Data d'enviament</th>
                            <th>Consultar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notificacions.map((notificacio) => (
                            <tr key={notificacio.id}>
                                <td>{notificacio.nom_emisor}</td>
                                <td>{notificacio.titol}</td>
                                <td>{new Date(notificacio.data_programacio).toLocaleDateString("es-ES")}</td>
                                <td>
                                    <button onClick={() => {
                                        setCreate(false);
                                        setModalTags({
                                            titol: notificacio.titol,
                                            missatge: notificacio.missatge,
                                            data_programacio: notificacio.data_programacio,
                                        });
                                        setNomEmisor(notificacio.nom_emisor)
                                        setShowModal(true);
                                    }}>
                                        <FaRegEye />
                                    </button>
                                </td>
                            </tr >
                        ))}
                    </tbody>
                </table>
            </div>
            {error && !showModal && (
                <div className="error-message">
                    {error}
                </div>
            )}
            {showModal && (
                <>
                    <div className="modal-overlay-notificacions">
                        <div className="modal-notificacions">
                            {isCreate ? (
                                <>
                                    <h2>
                                        Enviar notificació
                                    </h2>
                                    <h4>
                                        Si no es marca cap grup, per defecte s'envia a tots els membres de la colla
                                    </h4>
                                    <div>Títol</div>
                                    <div className="input-group-notificacions">
                                        <input
                                            name="titol"
                                            type="text"
                                            placeholder="..."
                                            value={modalTags.titol}
                                            onChange={(e) =>
                                                setModalTags({ ...modalTags, titol: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="modal-row-notificacions">
                                        <div className="modal-field-notificacions">
                                            <div>Data d'enviament</div>
                                            <input
                                                name="data_programacio"
                                                type="date"
                                                value={modalTags.data_programacio}
                                                min={getToday()}
                                                onChange={(e) =>
                                                    setModalTags({ ...modalTags, data_programacio: e.target.value })
                                                }
                                            />
                                        </div>

                                        <div className="modal-field-notificacions">
                                            <div>Grups</div>
                                            <MultiSelectDropdown
                                                options={grups}
                                                selected={selectedGroups}
                                                setSelected={setSelectedGroups}
                                                placeholder="Selecciona grups"
                                            />
                                        </div>
                                    </div>
                                    <div>Cos del missatge</div>
                                    <div className="input-group-notificacions">
                                        <textarea
                                            placeholder="..."
                                            value={modalTags.missatge}
                                            onChange={(e) =>
                                                setModalTags({ ...modalTags, missatge: e.target.value })
                                            }
                                        />
                                    </div>
                                    {error && showModal && (
                                        <div className="error-message">
                                            {error}
                                        </div>
                                    )}
                                    <div className="modal-buttons-notificacions">

                                        <Button
                                            text={"Enviar"}
                                            icon={<FaPaperPlane />}
                                            action={() => { createNotification() }} />

                                        <Button
                                            text={"Cancelar"}
                                            icon={<FaTimesCircle />}
                                            action={() => {
                                                setShowModal(false);
                                                setError("");
                                                setModalTags({ titol: "", missatge: "", data_programacio: getToday() });
                                            }}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="notificacio-view">

                                        <div className="notificacio-meta">
                                            <span className="emisor">{nomEmisor}</span>
                                            <span className="date">{new Date(modalTags.data_programacio).toLocaleDateString("es-ES")}</span>
                                        </div>

                                        <h2 className="titol">{modalTags.titol}</h2>

                                        <div className="missatge">
                                            {modalTags.missatge}
                                        </div>

                                        <div className="modal-buttons-notificacions">

                                            <Button
                                                text={"Tancar"}
                                                icon={<FaTimesCircle />}
                                                action={() => {
                                                    setShowModal(false);
                                                    setError("");
                                                    setModalTags({ titol: "", missatge: "", data_programacio: getToday() });
                                                }}
                                            />
                                        </div>

                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Notificacions;