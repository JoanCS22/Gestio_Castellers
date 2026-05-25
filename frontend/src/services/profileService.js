import { apiRequest } from "./api";

export const getData = async (userId) => {
    const url = userId
        ? `/profile/getUserData?userId=${userId}`
        : `/profile/getUserData`;
    return await apiRequest(
        url,
        {
            method: "GET",
        }
    );
};

export const updateData = async (userId, form, lesionat, genere, canalla, query) => {
    return await apiRequest(
        query,
        {
            method: "POST",
            body: JSON.stringify({
                nom: form.nom,
                cognoms: form.cognoms,
                mote: form.mote,
                telefon: form.telefon,
                altura_espatlles: form.alcadaEspatlles || null,
                envergadura: form.envergadura || null,
                pes: form.pes || null,
                altura_total: form.alcada || null,
                data_lesio: form.dataLesio || null,
                comentari: form.infoExtra,
                lesionat: lesionat,
                genere: genere,
                canalla: canalla
            }),
        }
    );
};