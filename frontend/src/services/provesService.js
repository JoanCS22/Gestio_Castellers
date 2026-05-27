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

export const saveOrder = async (proves) => {
    return await apiRequest(
        `/proves/updateOrder`,
        {
            method: "POST",
            body: JSON.stringify({
                proves: proves.map(p => ({
                    id: p.id,
                    ordre: p.ordre
                }))
            })
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

export const intercanviarPosicions = async (id_assignacio_1, id_assignacio_2) => {
    return await apiRequest(
        `/proves/intercanviarPosicions`,
        {
            method: "POST",
            body: JSON.stringify({
                id_assignacio_1: id_assignacio_1,
                id_assignacio_2: id_assignacio_2,
            }),
        }
    );
};

export const canviarAssignacio = async (id_assignacio, id_usuari = undefined, id_posicio = undefined) => {

    const body = { id_assignacio };

    if (id_usuari !== undefined) body.id_usuari = id_usuari;

    if (id_posicio !== undefined) body.id_posicio = id_posicio;

    return await apiRequest(
        `/proves/canviarAssignacio`,
        {
            method: "POST",
            body: JSON.stringify(body),
        }
    );
};

export const asignarPosicioProva = async (idProva, selectedPositionId, selectedMemberId) => {
    return await apiRequest(
        `/proves/asignarPosicioProva`,
        {
            method: "POST",
            body: JSON.stringify({
                id_prova: idProva,
                id_posicio: selectedPositionId,
                id_usuari: selectedMemberId,
            }),
        }
    );
};

export const moureAssignacio = async (idAssignacioDesti, idNovaPosicio) => {
    return await apiRequest(
        `/proves/canviPosicionsBuidaPlena`,
        {
            method: "POST",
            body: JSON.stringify({
                id_assignacio: idAssignacioDesti,
                id_posicio: idNovaPosicio,
            }),
        }
    );
};

export const treureMembrePosicio = async (idAssignacio) => {
    return await apiRequest(
        `/proves/desasignarPosicioProva?id=${idAssignacio}`,
        {
            method: "DELETE",
        }
    );
};

export const buidarPlantilla = async (idProva) => {
    return await apiRequest(
        `/proves/buidarPlantillaProva?id=${idProva}`,
        {
            method: "DELETE",
        }
    );
};

export const treureAbsents = async (id_esdeveniment) => {
    return await apiRequest(
        `/proves/eliminarAbsentsProva?id=${id_esdeveniment}`,
        {
            method: "DELETE",
        }
    );
};

export const getNumProves = async (id_esdeveniment) => {
    return await apiRequest(
        `/proves/getNumProvesPerMembre?id=${id_esdeveniment}`,
        {
            method: "GET",
        }
    );
};