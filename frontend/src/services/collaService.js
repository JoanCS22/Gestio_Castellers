import { apiRequest } from "./api";

export const getCollesPositions = async () => {

    const idColla = localStorage.getItem("id_colla");

    return await apiRequest(
        `/colla/getCollaPositions?id=${idColla}`,
        {
            method: "GET",
        }
    );
};