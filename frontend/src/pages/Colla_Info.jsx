import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { FaSave, FaTimesCircle, FaPencilAlt, FaPlusSquare } from "react-icons/fa";

import Input from "../components/Input";
import TopMenu from "../components/TopMenu";
import Button from "../components/Button";

import "./Colla_Info.css";

function CollaInfo() {
    const navigate = useNavigate();

    const location = useLocation();

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

    const createColla = async (e) => {
        e.preventDefault();

        console.log("{DEBUG} Entra a funció CreateColla");

        const token = localStorage.getItem("token");

        if (form.nom == "") {
            setError(`El camp nom no pot estar buit`);
            return;
        }

        const response = await fetch("http://localhost:5000/colla/createColla", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                nom: form.nom,
                abreviacio: form.nom_curt || "",
                telefon: form.telefon,
                correus_contacte: form.contactes || "",
                data_creacio: form.data_fundacio || null,
                adreca: form.adreca || "",
                poblacio: form.poblacio || ""
            }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log("{DEBUG} Create colla OK");
            setError("");
            localStorage.setItem("id_colla", data.id);
            showTempMessage("Colla creada correctament.");
            navigate("/get_data_colla")
        } else {
            console.log("{DEBUG} Create colla KO");
            setError(data.message);
        }
    }

    const getDataColla = async () => {

        const token = localStorage.getItem("token");
        const idColla = localStorage.getItem("id_colla");

        const response = await fetch(`http://localhost:5000/colla/getDataColla?id=${idColla}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
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

            console.log("{DEBUG} Get colla's data OK")
        } else {
            console.log("{DEBUG} Get colla's data KO")
            setError(data.message);
        }
    }

    useEffect(() => {
        if (isReadOnly) {
            getDataColla();
        }
    }, [isReadOnly]);

    const updateDataColla = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        const idColla = localStorage.getItem("id_colla");

        if (form.nom == "") {
            setError(`El camp nom no pot estar buit`);
            return;
        }

        const response = await fetch(`http://localhost:5000/colla/modifyColla?id=${idColla}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                nom: form.nom,
                abreviacio: form.nom_curt || "",
                telefon: form.telefon,
                correus_contacte: form.contactes || "",
                data_creacio: form.data_fundacio || null,
                adreca: form.adreca || "",
                poblacio: form.poblacio || ""
            }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log("{DEBUG} Update colla OK");
            setError("");
            showTempMessage("Colla creada correctament.");
            navigate("/get_data_colla")
        } else {
            console.log("{DEBUG} Update colla KO");
            setError(data.message);
        }
    }

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
                                action={createColla}
                            />

                            <Button
                                text="Cancelar"
                                icon={<FaTimesCircle />}
                                action={() => navigate(-1)}
                            />
                        </>
                    )}

                    {isReadOnly && (
                        <Button
                            text="Modificar dades colla"
                            icon={<FaPencilAlt />}
                            action={() => navigate("/modify_info_colla")}
                        />
                    )}

                    {isModify && (
                        <>
                            <Button
                                text="Guardar canvis"
                                icon={<FaSave />}
                                action={updateDataColla}
                            />

                            <Button
                                text="Cancelar"
                                icon={<FaTimesCircle />}
                                action={() => {
                                    getDataColla();
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