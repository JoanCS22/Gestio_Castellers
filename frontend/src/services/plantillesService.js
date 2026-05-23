import { apiRequest } from "./api";

export const getPlantillaById = async (idPlantilla) => {
    return await apiRequest(
        `/plantilles/getPlantillaById?id=${idPlantilla}`,
        {
            method: "GET",
        }
    );
};

export const getCollesPlantilles = async (idPlantilla) => {
    const idColla = localStorage.getItem("id_colla");
    return await apiRequest(
        `/plantilles/getPlantillesByColla?id=${idColla}`,
        {
            method: "GET",
        }
    );
};

export const getPlantillesPositions = async (idPlantilla) => {
    return await apiRequest(
        `/plantilles/getPositionsByPlantilla?id=${idPlantilla}`,
        {
            method: "GET",
        }
    );
};