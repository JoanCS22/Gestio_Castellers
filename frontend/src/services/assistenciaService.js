import { apiRequest } from "./api";

export const getEsdevenimentInfo = async (idEsdeveniment) => {

    return await apiRequest(
        `/esdeveniments/getEsdevenimentInfo?id=${idEsdeveniment}`,
        {
            method: "GET",
        }
    );
};

export const getAssistenciaByEsdeveniment = async (idEsdeveniment) => {

    return await apiRequest(
        `/assistencia/getAssistenciaList?id=${idEsdeveniment}`,
        {
            method: "GET",
        }
    );
};

export const getAssistenciaActual = async (idEsdeveniment) => {

    return await apiRequest(
        `/assistencia/getAssistenciaByMember?id=${idEsdeveniment}`,
        {
            method: "GET",
        }
    );
};

export const modifyAssistenciaPrevia = async (idEsdeveniment, currentAssistance, assistenciaSeleccionada,
    busAssistencia, arribaTard, marxaAviat) => {

    return await apiRequest(
        `/assistencia/modifyAssistenciaPrevia?id=${currentAssistance.id}`,
        {
            method: "POST",
            body: JSON.stringify({
                confirmacio_previa: assistenciaSeleccionada,
                bus: busAssistencia,
                num_acompanyants: currentAssistance.num_acompanyants,
                arriba_tard: arribaTard,
                marxa_aviat: marxaAviat,
                comentari: currentAssistance.comentari,
                temps_tard: currentAssistance.temps_tard,
                temps_aviat: currentAssistance.temps_aviat
            }),
        }
    );
};

export const modifyAssistenciaPreviaTecnica = async (idAssistencia, confirmacio_previa) => {
    return await apiRequest(
        `/assistencia/modifyAssistenciaPreviaTecnica?id=${idAssistencia}`,
        {
            method: "POST",
            body: JSON.stringify({
                confirmacio_previa: confirmacio_previa
            }),
        }
    );
};

export const confirmAssistenciaTecnica = async (idAssistencia, confirmacio_arribada) => {
    return await apiRequest(
        `/assistencia/confirmAssistencia?id=${idAssistencia}`,
        {
            method: "POST",
            body: JSON.stringify({
                confirmacio_arribada: confirmacio_arribada
            }),
        }
    );
};

export const verifyCode = async (idAssistencia, confirmacio_arribada) => {
    return await apiRequest(
        `/assistencia/confirmAssistencia?id=${idAssistencia}`,
        {
            method: "POST",
            body: JSON.stringify({
                confirmacio_arribada: confirmacio_arribada
            }),
        }
    );
};