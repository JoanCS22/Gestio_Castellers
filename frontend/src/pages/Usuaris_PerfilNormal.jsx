import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { FaSave, FaTimesCircle, FaPencilAlt } from "react-icons/fa";

import Input from "../components/Input";
import TopMenu from "../components/TopMenu";
import Button from "../components/Button";

function NormalProfile() {
    const navigate = useNavigate();

    return (
        <div>
            <TopMenu
                title="Les meves dades"
                tornar
            />
            <div>
                <form onSubmit={''}>
                    <Input
                        type="text"
                        placeholder="Foto de perfil"
                        value={""}
                        onChange={''}
                        inputTitle="ULR foto"
                    />
                    <Input
                        type="text"
                        placeholder="Nom"
                        value={""}
                        onChange={''}
                        inputTitle="Nom"
                    />
                    <Input
                        type="text"
                        placeholder="Cognoms"
                        value={""}
                        onChange={''}
                        inputTitle="Cognoms"
                    />
                    <Input
                        type="text"
                        placeholder="Mote"
                        value={""}
                        onChange={''}
                        inputTitle="Mote"
                    />
                    <Input
                        type="text"
                        placeholder="Telèfon"
                        value={""}
                        onChange={''}
                        inputTitle="Telèfon"
                    />
                    <Input
                        type="text"
                        placeholder="Correu electrònic"
                        value={""}
                        onChange={''}
                        inputTitle="Correu electrònic"
                    />
                    <Input
                        type="text"
                        placeholder="Gènere"
                        value={""}
                        onChange={''}
                        inputTitle="Gènere"
                    />
                    <Input
                        type="text"
                        placeholder="Alçada"
                        value={""}
                        onChange={''}
                        inputTitle="Alçada"
                    />
                    <Input
                        type="text"
                        placeholder="Alçada espatlles"
                        value={""}
                        onChange={''}
                        inputTitle="Alçada espatlles"
                    />
                    <Input
                        type="text"
                        placeholder="Envergadura"
                        value={""}
                        onChange={''}
                        inputTitle="Envergadura"
                    />
                    <Input
                        type="text"
                        placeholder="Pes"
                        value={""}
                        onChange={''}
                        inputTitle="Pes"
                    />
                    <Input
                        type="text"
                        placeholder="Lesionat"
                        value={""}
                        onChange={''}
                        inputTitle="Lesionat"
                    />
                    <Input
                        type="text"
                        placeholder="Data lesió"
                        value={""}
                        onChange={''}
                        inputTitle="Data lesió"
                    />
                    <Input
                        type="text"
                        placeholder="Informació extra"
                        value={""}
                        onChange={''}
                        inputTitle="Informació extra"
                    />
                    <Button
                        text="Guardar canvis"
                        icon=<FaSave />
                        action
                    />
                    <Button
                        text="Canviar contrasenya"
                        icon=<FaPencilAlt />
                        action
                    />
                    <Button
                        text="Cancelar"
                        icon=<FaTimesCircle />
                        action
                    />
                </form>
            </div>
        </div>
    );
}

export default NormalProfile; 