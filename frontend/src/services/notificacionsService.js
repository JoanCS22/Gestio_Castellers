import { apiRequest } from "./api";

export const getNotifications = async () => {
    const idColla = localStorage.getItem("id_colla");
    return await apiRequest(
        `/members/getUserNotifications?id=${idColla}`,
        {
            method: "GET",
        }
    );
};

export const sendNotification = async (modalTags, selectedGroups) => {
    const idColla = localStorage.getItem("id_colla");
    return await apiRequest(
        `/members/modifyMember?id=${idColla}`,
        {
            method: "POST",
            body: JSON.stringify({
                titol: modalTags.titol, 
                missatge: modalTags.missatge, 
                modalTags: modalTags.data_programacio, 
                ids_grups: selectedGroups,
            }),
        }
    );
};