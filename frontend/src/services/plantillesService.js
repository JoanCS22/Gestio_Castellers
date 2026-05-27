import { apiRequest } from "./api";

export const getPlantillaById = async (idPlantilla) => {
    return await apiRequest(
        `/plantilles/getPlantillaById?id=${idPlantilla}`,
        {
            method: "GET",
        }
    );
};

export const getCollesPlantilles = async () => {
    const idColla = localStorage.getItem("id_colla");
    return await apiRequest(
        `/plantilles/getPlantillesByColla?id=${idColla}`,
        {
            method: "GET",
        }
    );
};

export const getCollesStructures = async () => {
    const idColla = localStorage.getItem("id_colla");
    return await apiRequest(
        `/plantilles/getEstructuresByColla?id=${idColla}`,
        {
            method: "GET",
        }
    );
};

export const createPlantilla = async (modalTags, tronc, pinya, folre, manilles, puntals) => {
    const idColla = localStorage.getItem("id_colla");
    return await apiRequest(
        `/plantilles/createPlantilla?id=${idColla}`,
        {
            method: "POST",
            body: JSON.stringify({
                nom: modalTags.nom,
                descripcio: modalTags.descripcio,
                estructura: modalTags.estructura,
                tronc: tronc || false,
                pinya: pinya || false,
                folre: folre || false,
                manilles: manilles || false,
                puntals: puntals || false,
            }),
        }
    );
};

export const modifyPlantilla = async (idPlantilla, action, favoriteValue, modalTags) => {
    const idColla = localStorage.getItem("id_colla");
    return await apiRequest(
        `/plantilles/modifyInfoPlantilla?id=${idPlantilla}&action=${action}`,
        {
            method: "POST",
            body: JSON.stringify({
                nom: modalTags.nom,
                descripcio: modalTags.descripcio,
                estructura: modalTags.estructura,
                favorita: favoriteValue
            }),
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

export const addPositionToPlantilla = async (idPlantilla, selectedPositionData, currentAddedPosition, selectedTag) => {
    return await apiRequest(
        `/plantilles/addPositionToPlantilla?id=${idPlantilla}`,
        {
            method: "POST",
            body: JSON.stringify({
                nom: selectedPositionData?.nom,
                color: currentAddedPosition.color,
                coord_x: currentAddedPosition.coord_x,
                coord_y: currentAddedPosition.coord_y,
                rotacio: currentAddedPosition.rotacio,
                seccio: selectedTag,
            }),
        }
    );
};

export const modifyPositionFromPlantilla = async (idPosicio, currentAddedPosition, coordX, coordY) => {
    return await apiRequest(
        `/plantilles/modifyPositionsFromPlantilla?id=${idPosicio}`,
        {
            method: "POST",
            body: JSON.stringify({
                color: currentAddedPosition.color || "#FFFFFFF",
                coord_x: coordX || 200,
                coord_y: coordY || 700,
                rotacio: currentAddedPosition.rotacio || 0,
            }),
        }
    );
};

export const deletePosicioPlantilla = async (idPosicio) => {
    return await apiRequest(
        `/plantilles/deletePositionsFromPlantilla?id=${idPosicio}`,
        {
            method: "DELETE",
        }
    );
};

export const deletePlantilla = async (idPlantilla) => {
    return await apiRequest(
        `/plantilles/deletePlantilla?id=${idPlantilla}`,
        {
            method: "DELETE",
        }
    );
};

export const modifyUpperRelation = async (id_posicio, id_posicio_up) => {
    return await apiRequest(
        `/plantilles/modifyUpperRelation`,
        {
            method: "POST",
            body: JSON.stringify({
                id_posicio: id_posicio,
                id_posicio_up: id_posicio_up,
            }),
        }
    );
};