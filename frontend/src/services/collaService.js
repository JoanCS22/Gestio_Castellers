import { apiRequest } from "./api";

export const createColla = async (form) => {
    return await apiRequest(
        `/colla/createColla`,
        {
            method: "POST",
            body: JSON.stringify({
                nom: form.nom,
                abreviacio: form.nom_curt || "",
                telefon: form.telefon,
                correus_contacte: form.contactes || "",
                data_creacio: form.data_fundacio || null,
                adreca: form.adreca || "",
                poblacio: form.poblacio || ""
            }),
        }
    );
};

export const getDataColla = async () => {
    const idColla = localStorage.getItem("id_colla");

    return await apiRequest(
        `/colla/getDataColla?id=${idColla}`,
        {
            method: "GET",
        }
    );
};

export const updateDataColla = async (form) => {
    const idColla = localStorage.getItem("id_colla");

    return await apiRequest(
        `/colla/modifyColla?id=${idColla}`,
        {
            method: "POST",
            body: JSON.stringify({
                nom: form.nom,
                abreviacio: form.nom_curt || "",
                telefon: form.telefon,
                correus_contacte: form.contactes || "",
                data_creacio: form.data_fundacio || null,
                adreca: form.adreca || "",
                poblacio: form.poblacio || ""
            }),
        }
    );
};

export const getCollesPositions = async () => {

    const idColla = localStorage.getItem("id_colla");

    return await apiRequest(
        `/colla/getCollaPositions?id=${idColla}`,
        {
            method: "GET",
        }
    );
};

export const createPosicio = async (newPositionTag) => {

    const idColla = localStorage.getItem("id_colla");

    return await apiRequest(
        `/colla/createCollaPosition?id=${idColla}`,
        {
            method: "POST",
            body: JSON.stringify({
                nom: newPositionTag.nom,
                descripcio: newPositionTag.descripcio || "",
                color: newPositionTag.color,
            }),
        }
    );
};

export const updatePosicio = async (idPosicio, newPositionTag) => {
    return await apiRequest(
        `/colla/updateCollaPositions?id=${idPosicio}`,
        {
            method: "POST",
            body: JSON.stringify({
                descripcio: newPositionTag.descripcio || "",
                color: newPositionTag.color,
            }),
        }
    );
};

export const deletePosicio = async (idPosicio) => {
    return await apiRequest(
        `/colla/deleteCollaPositions?id=${idPosicio}`,
        {
            method: "DELETE",
        }
    );
};

export const getCollesRoles = async () => {

    const idColla = localStorage.getItem("id_colla");

    return await apiRequest(
        `/colla/getCollaRoles?id=${idColla}`,
        {
            method: "GET",
        }
    );
};

export const createRoles = async (newRoleTag, permisos) => {

    const idColla = localStorage.getItem("id_colla");

    return await apiRequest(
        `/colla/createCollaRoles?id=${idColla}`,
        {
            method: "POST",
            body: JSON.stringify({
                nom: newRoleTag.nom,
                descripcio: newRoleTag.descripcio || "",
                permisos: permisos
            }),
        }
    );
};

export const updateRoles = async (idRol, newRoleTag, permisos) => {
    return await apiRequest(
        `/colla/updateCollaRoles?id=${idRol}`,
        {
            method: "POST",
            body: JSON.stringify({
                descripcio: newRoleTag.descripcio || "",
                permisos: permisos
            }),
        }
    );
};

export const deleteRoles = async (idRol) => {
    return await apiRequest(
        `/colla/deleteCollaRole?id=${idRol}`,
        {
            method: "DELETE",
        }
    );
};