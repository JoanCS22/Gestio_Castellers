import {
    getNotifications, sendNotification
} from "../services/notificacionsService.js";
import { handleApiError } from "../utils/handleApiError.js";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { FaSearch, FaRegEye, FaTimesCircle } from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx"

import './Notificacions.css';

import TopMenu from "../components/TopMenu.jsx";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";

function Notificacions() {

    const location = useLocation();
    const navigate = useNavigate();

    //notificacions
    const permissions = getPermissions();
    const hasWritePermission = (key) => permissions[key] === "W";

    const [message, setTempMessage] = useState(null);
    const [error, setError] = useState("");

    const [notificacions, setNotificacions] = useState([]);
    const [grups, setGrups] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);

    const [showModal, setShowModal] = useState(false);

    const [modalTags, setModalTags] = useState({
        titol: "",
        missatge: "",
        data_programacio: new Date().toISOString(),
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
            const data = await getNotifications();
            setNotificacions(data);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const createNotification = async () => {
        if (selectedGroups.length === 0) {
            setError(`Has d'escollir algun destinatari`);
            return;
        }
        if (!modalTags.titol || !modalTags.missatge) {
            setError(`No es pot deixar cap camp buit`);
            return;
        }
        try {
            const data = await sendNotification(modalTags, selectedGroups);
            setError("");
            setShowModal(false);
            setModalTags({ titol: "", missatge: "", data_programacio: new Date().toISOString() });
            loadNotifications();
            showTempMessage("Notificació enviada correctament.");
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    useEffect(() => {
        loadNotifications();
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
                            icon={<FaRegEye />}
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
                            <th>Data enviament</th>
                            <th>Consultar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notificacions.map((notificacio) => (
                            <>
                                <tr key={notificacio.id}>
                                    <td>{notificacio.nom_emisor}</td>
                                    <td>{notificacio.titol}</td>
                                    <td>{notificacio.data_programacio}</td>
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
                            </>
                        ))}
                    </tbody>
                </table>
            </div>
            {
                showModal && (
                    <div className="modal-overlay-position">
                        <div className="modal-position">
                            <h2>
                                {isCreate ? "Enviar notificació" : ""}
                            </h2>
                            <div className="input-group">
                                <Input
                                    name="titol"
                                    type="text"
                                    placeholder="Titol"
                                    value={modalTags.titol}
                                    onChange={(e) =>
                                        setModalTags({ ...modalTags, titol: e.target.value })
                                    }
                                    inputTitle="Títol"
                                    readOnly={!isCreate}
                                />
                            </div>
                            <div>Descripció</div>
                            <div className="input-group">
                                <textarea
                                    placeholder="Descripció"
                                    value={modalTags.missatge}
                                    onChange={(e) =>
                                        setModalTags({ ...modalTags, missatge: e.target.value })
                                    }
                                />
                            </div>
                            {error && (
                                <div className="error-message">
                                    {error}
                                </div>
                            )}
                            <div className="modal-buttons-position">

                                {isCreate && (
                                    <Button
                                        text={"Enviar notificació"}
                                        icon={<FaRegEye />}
                                        action={() => { createNotification() }} />
                                )}

                                <Button
                                    text={isCreate ? "Cancelar" : "Tancar"}
                                    icon={<FaTimesCircle />}
                                    action={() => {
                                        setShowModal(false);
                                        setError("");
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Notificacions;