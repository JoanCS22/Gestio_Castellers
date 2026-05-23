import { apiRequest } from "./api";

export const getAssistenciaByEsdeveniment = async (idEsdeveniment) => {

    return await apiRequest(
        `/assistencia/getAssistenciaList?id=${idEsdeveniment}`,
        {
            method: "GET",
        }
    );
};