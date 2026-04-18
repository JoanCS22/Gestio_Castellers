import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Input from "../components/Input";
import TopMenu from "../components/TopMenu";

function NormalProfile() {
    const navigate = useNavigate();
    
    return (
        <div>
            <TopMenu
                title = "Les meves dades"
                tornar
            />

            <div>
                PERFIL USUARI
            </div>
        </div>
    );
}

export default NormalProfile; 