import { apiRequest } from "./api";

export const getNotifications = async (idColla) => {
    return await apiRequest(
        `/notificacions/getUserNotifications?id=${idColla}`,
        {
            method: "GET",
        }
    );
};

export const sendNotification = async (idColla, modalTags, selectedGroups) => {
    return await apiRequest(
        `/notificacions/createNotification?id=${idColla}`,
        {
            method: "POST",
            body: JSON.stringify({
                titol: modalTags.titol, 
                missatge: modalTags.missatge, 
                data_programacio: modalTags.data_programacio, 
                ids_grups: selectedGroups,
            }),
        }
    );
};