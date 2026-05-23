import { createColla, getDataColla, updateDataColla } from "../services/collaService.js";
import { handleApiError } from "../utils/handleApiError.js";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { FaSave, FaTimesCircle, FaPencilAlt, FaPlusSquare } from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx"

import Input from "../components/Input";
import TopMenu from "../components/TopMenu";
import Button from "../components/Button";

import "./Colla_Info.css";

function CollaInfo() {
    const navigate = useNavigate();

    const location = useLocation();

    //assistencia, colla, esdeveniments, llistats, membres, notificacions, permisos, plantilles, proves
    const permissions = getPermissions();
    const hasWritePermission = (key) => permissions[key] === "W";

    const [form, setForm] = useState({
        nom: "",
        nom_curt: "",
        telefon: "",
        contactes: "",
        data_fundacio: "",
        adreca: "",
        poblacio: "",
    });

    const [error, setError] = useState("");
    const [message, setTempMessage] = useState(null);
    const [foto, setFoto] = useState("/prueba.jpg");

    const isCreate = location.pathname === "/create_colla";
    const isModify = location.pathname === "/modify_info_colla";
    const isReadOnly = location.pathname === "/get_data_colla";

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const showTempMessage = (message, type = "success") => {
        setTempMessage({ message, type });

        setTimeout(() => {
            setTempMessage(null);
        }, 2000);
    };

    const createCollaCall = async (e) => {
        e.preventDefault();
        if (form.nom == "") {
            setError(`El camp nom no pot estar buit`);
            return;
        }

        try {
            const data = await createColla(form);
            setError("");
            localStorage.setItem("id_colla", data.id);
            showTempMessage("Colla creada correctament.");
            navigate("/get_data_colla")
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const loadDataColla = async () => {
        try {
            const data = await getDataColla();
            setForm({
                nom: data.nom,
                nom_curt: data.abreviacio || "",
                telefon: data.telefon,
                contactes: data.correus_contacte || "",
                data_fundacio: data.data_creacio
                    ? data.data_creacio.split("T")[0]
                    : null,
                adreca: data.adreca || "",
                poblacio: data.poblacio || ""
            });
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const updateDataCollaCall = async (e) => {
        e.preventDefault();
        if (form.nom == "") {
            setError(`El camp nom no pot estar buit`);
            return;
        }
        try {
            const data = await updateDataColla(form);
            setError("");
            showTempMessage("Colla modificada correctament.");
            navigate("/get_data_colla")
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    useEffect(() => {
        if (isReadOnly) {
            loadDataColla();
        }
    }, [isReadOnly]);

    return (
        <div>
            <TopMenu
                title={isCreate ? "Crear colla" : `Informació de ${form.nom}`} tornar={!isReadOnly}
            />

            {message && (
                <div className={`message ${message.type}`}>
                    {message.message}
                </div>
            )}

            <div className="grid-container-colla">

                <div className="grid-one-colla">
                    <img src={foto} alt="logo" />
                    {!isCreate && (
                        <Button
                            text="Modificar logo"
                            icon={<FaPencilAlt />}
                            action={() => {
                                alert("Funcionalitat encara no implementada.");
                            }}
                        />
                    )}
                </div>

                <div className="grid-two-colla">
                    <Input
                        name="nom"
                        type="text"
                        placeholder="Nom"
                        value={form.nom}
                        onChange={handleChange}
                        inputTitle="Nom"
                        readOnly={isReadOnly}
                    />
                </div>

                <div className="grid-three-colla">
                    <Input
                        name="nom_curt"
                        type="text"
                        placeholder="Nom Curt"
                        value={form.nom_curt}
                        onChange={handleChange}
                        inputTitle="Nom Curt"
                        readOnly={isReadOnly}
                    />
                </div>

                <div className="grid-four-colla">
                    <Input
                        name="telefon"
                        type="text"
                        placeholder="Telèfon"
                        value={form.telefon}
                        onChange={handleChange}
                        inputTitle="Telèfon"
                        readOnly={isReadOnly}
                    />
                </div>

                <div className="grid-five-colla">
                    <Input
                        name="contactes"
                        type="textarea"
                        placeholder="Contactes"
                        value={form.contactes}
                        onChange={handleChange}
                        inputTitle="Contactes"
                        readOnly={isReadOnly}
                    />
                </div>

                <div className="grid-six-colla">
                    <Input
                        name="data_fundacio"
                        type="date"
                        placeholder="Fundació"
                        value={form.data_fundacio}
                        onChange={handleChange}
                        inputTitle="Fundació"
                        readOnly={isReadOnly}
                    />
                </div>

                <div className="grid-seven-colla">
                    <Input
                        name="adreca"
                        type="text"
                        placeholder="Adreça"
                        value={form.adreca}
                        onChange={handleChange}
                        inputTitle="Adreça"
                        readOnly={isReadOnly}
                    />
                </div>

                <div className="grid-eight-colla">
                    <Input
                        name="poblacio"
                        type="text"
                        placeholder="Població"
                        value={form.poblacio}
                        onChange={handleChange}
                        inputTitle="Població"
                        readOnly={isReadOnly}
                    />
                </div>
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
                <div className="flex-buttons-colla">
                    {isCreate && (
                        <>
                            <Button
                                text="Crear colla"
                                icon={<FaPlusSquare />}
                                action={createCollaCall}
                            />

                            <Button
                                text="Cancelar"
                                icon={<FaTimesCircle />}
                                action={() => navigate(-1)}
                            />
                        </>
                    )}

                    {isReadOnly && (
                        <>
                            {hasWritePermission("colla") && (
                                <>
                                    <Button
                                        text="Modificar dades colla"
                                        icon={<FaPencilAlt />}
                                        action={() => navigate("/modify_info_colla")}
                                    />
                                </>
                            )}
                        </>
                    )}

                    {isModify && (
                        <>
                            <Button
                                text="Guardar canvis"
                                icon={<FaSave />}
                                action={updateDataCollaCall}
                            />

                            <Button
                                text="Cancelar"
                                icon={<FaTimesCircle />}
                                action={() => {
                                    loadDataColla();
                                    navigate("/get_data_colla");
                                }}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CollaInfo;