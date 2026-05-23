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