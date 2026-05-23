import { apiRequest } from "./api";

export const getProvaById = async (idProva) => {
    return await apiRequest(
        `/proves/getProvaById?id=${idProva}`,
        {
            method: "GET",
        }
    );
};

export const getProvesByEsdeveniment = async (idEsdeveniment) => {
    return await apiRequest(
        `/proves/getProvesByEsdeveniment?id=${idEsdeveniment}`,
        {
            method: "GET",
        }
    );
};

export const getAssignacions = async (idProva) => {
    return await apiRequest(
        `/proves/getAssignacionsProva?id=${idProva}`,
        {
            method: "GET",
        }
    );
};

export const updateFavorite = async (idPlantilla, favoriteValue) => {
    return await apiRequest(
        `/proves/updateFavorite`,
        {
            method: "POST",
            body: JSON.stringify({
                favorita: favoriteValue,
                id: idPlantilla,
            }),
        }
    );
};

export const updateFeta = async (idPlantilla, fetaValue) => {
    return await apiRequest(
        `/proves/updateFeta`,
        {
            method: "POST",
            body: JSON.stringify({
                feta: fetaValue,
                id: idPlantilla,
            }),
        }
    );
};

export const publishProva = async (idPlantilla, publicValue) => {
    return await apiRequest(
        `/proves/publishProva`,
        {
            method: "POST",
            body: JSON.stringify({
                public: publicValue,
                id: idPlantilla,
            }),
        }
    );
};

export const createProva = async (idEsdeveniment, tags, idPlantilla) => {
    return await apiRequest(
        `/proves/createProva?id=${idEsdeveniment}`,
        {
            method: "POST",
            body: JSON.stringify({
                nom: tags.nom,
                comentari: tags.comentari,
                public: tags.public,
                xarxa: tags.xarxa,
                estructura: tags.estructura,
                id_plantilla: idPlantilla
            }),
        }
    );
}; 

export const modifyProva = async (idProva, tags, idPlantilla) => {
    return await apiRequest(
        `/proves/modifyInfoProva?id=${idProva}`,
        {
            method: "POST",
            body: JSON.stringify({
                nom: tags.nom,
                comentari: tags.comentari,
                public: tags.public,
                xarxa: tags.xarxa,
                estructura: tags.estructura,
                id_plantilla: idPlantilla
            }),
        }
    );
}; 

export const deleteProva = async (idProva) => {
    return await apiRequest(
        `/proves/deleteProva?id=${idProva}`,
        {
            method: "DELETE",
        }
    );
};