import { apiRequest } from "./api";

export const getCollaMembers = async () => {

    const idColla = localStorage.getItem("id_colla");

    return await apiRequest(
        `/members/getMembers?id=${idColla}`,
        {
            method: "GET",
        }
    );
};

export const searchUsers = async (modalTags) => {

    return await apiRequest(
        `/members/searchUsers`,
        {
            method: "POST",
            body: JSON.stringify({
                nom: modalTags.nom || "",
                cognoms: modalTags.cognoms || "",
                email: modalTags.correu || ""
            }),
        }
    );
};

export const addUserToColla = async (idUser) => {

    const idColla = localStorage.getItem("id_colla");

    return await apiRequest(
        `/members/addMember?id=${idColla}&userid=${idUser}`,
        {
            method: "POST",
        }
    );
};