import { apiRequest } from "./api";

export const getData = async (userId, collaId) => {
    const params = new URLSearchParams();
    if (userId) params.set("userId", userId);
    if (collaId) params.set("collaId", collaId);

    return await apiRequest(
        `/profile/getUserData?${params.toString()}`,
        { method: "GET" }
    );
};

export const updateData = async (userId, form, lesionat, genere, canalla, collaId) => {

    const params = new URLSearchParams();
    if (userId) params.set("userId", userId);
    if (collaId) params.set("collaId", collaId);

    return await apiRequest(
        `/profile/modifyUserData?${params.toString()}`,
        {
            method: "POST",
            body: JSON.stringify({
                nom: form.nom,
                cognoms: form.cognoms,
                telefon: form.telefon,
                altura_espatlles: form.alcadaEspatlles || null,
                envergadura: form.envergadura || null,
                pes: form.pes || null,
                altura_total: form.alcada || null,
                data_lesio: form.dataLesio || null,
                comentari: form.infoExtra,
                lesionat: lesionat,
                genere: genere,
                canalla: canalla,
                mote: form.mote,
            }),
        }
    );
};

export const modifyPassword = async (id_usuari, password) => {
    return await apiRequest(
        `/changePassword`,
        {
            method: "POST",
            body: JSON.stringify({
                id_usuari: id_usuari,
                contrasenya: password,
            }),
        }
    );
};