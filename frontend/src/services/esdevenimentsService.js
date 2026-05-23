import { apiRequest } from "./api";

export const getEsdevenimentInfo = async (idEsdeveniment) => {

    return await apiRequest(
        `/esdeveniments/getEsdevenimentInfo?id=${idEsdeveniment}`,
        {
            method: "GET",
        }
    );
};