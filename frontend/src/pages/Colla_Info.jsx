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
    const isReadOnly = location.pathname === "/see_info_colla";

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

    // const getDataColla = async () => {

    //     const token = localStorage.getItem("token");

    //     const response = await fetch("http://localhost:5000/profile/getUserData", {
    //         method: "GET",
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Authorization": `Bearer ${token}`
    //         }
    //     });

    //     const data = await response.json();

    //     if (response.ok) {

    //         setForm({
    //             nom: data.nom || "",
    //             cognoms: data.cognoms || "",
    //             mote: data.mote || "",
    //             telefon: data.telefon || "",
    //             email: data.email || "",
    //             alcadaEspatlles: data.altura_espatlles || "",
    //             envergadura: data.envergadura || "",
    //             pes: data.pes || "",
    //             alcada: data.altura_total || "",
    //             dataLesio: data.data_lesio || "",
    //             infoExtra: data.comentari || ""
    //         });

    //         setLesionat(data.lesionat || false);
    //         setGenere(data.genere || "Altre");
    //         setCanalla(data.canalla || false);

    //         console.log("{DEBUG} Get user's data OK")
    //     } else {
    //         console.log("{DEBUG} Get user's data KO")
    //         setError(data.message);
    //     }
    // }

    // const updateData = async (e) => {
    //     e.preventDefault();

    //     const token = localStorage.getItem("token");

    //     const errors = comprovaNums();

    //     if (errors.length > 0) {
    //         setError(`Els següents camps han de ser numèrics i positius: ${errors.join(", ")}`);
    //         return;
    //     }

    //     const response = await fetch("http://localhost:5000/profile/modifyUserData", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Authorization": `Bearer ${token}`
    //         },
    //         body: JSON.stringify({
    //             nom: form.nom,
    //             cognoms: form.cognoms,
    //             mote: form.mote,
    //             telefon: form.telefon,
    //             altura_espatlles: form.alcadaEspatlles || null,
    //             envergadura: form.envergadura || null,
    //             pes: form.pes || null,
    //             altura_total: form.alcada || null,
    //             data_lesio: form.dataLesio || null,
    //             comentari: form.infoExtra,
    //             lesionat: lesionat,
    //             genere: genere,
    //             canalla: canalla
    //         }),
    //     });

    //     const data = await response.json();

    //     if (response.ok) {
    //         console.log("{DEBUG} Modify user's data OK");
    //         setError("");
    //         showTempMessage("Informació actualitzada correctament.");
    //     } else {
    //         console.log("{DEBUG} Modify user's data KO");
    //         setError(data.message);
    //     }
    // }

    // useEffect(() => {
    //     if(isReadOnly) {
    //         getDataColla();
    //     }
    // }, []);

    const createColla = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (form.nom == "") {
            setError(`El camp nom no pot estar buit: ${errors.join(", ")}`);
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
                poblacio: form.poblacio || "",
                url_logo: foto
            }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log("{DEBUG} Create colla OK");
            setError("");
            showTempMessage("Colla creada correctament.");
            navigate("/see_info_colla")
        } else {
            console.log("{DEBUG} Create colla KO");
            setError(data.message);
        }
    }

    console.log("{DEBUG} Entra a CollaInfo");
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

            <div className="grid-container">

                <div className="grid-one">
                    <img src={foto} alt="logo" />
                    <Button
                        text="Modificar logo"
                        icon={<FaPencilAlt />}
                        action={() => {
                            alert("Funcionalitat encara no implementada.");
                        }}
                    />
                </div>

                <div className="grid-two">
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

                <div className="grid-three">
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

                <div className="grid-four">
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

                <div className="grid-five">
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

                <div className="grid-six">
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

                <div className="grid-seven">
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

                <div className="grid-eight">
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
                <div className="flex-buttons">
                    {isCreate && (
                        <>
                            <Button
                                text="Crear colla"
                                icon={<FaPlusSquare />}
                                action={() => {alert("Funcionalitat encara no aplicada")}}
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
                                action={() => {alert("Funcionalitat encara no aplicada")}}
                            />

                            <Button
                                text="Cancelar"
                                icon={<FaTimesCircle />}
                                action={() => navigate("/see_info_colla")}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CollaInfo;