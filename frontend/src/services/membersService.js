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

export const getDataMember = async (userId) => {
    const idColla = localStorage.getItem("id_colla");
    return await apiRequest(
        `/members/getDataMember?userid=${userId}&collaid=${idColla}`,
        {
            method: "GET",
        }
    );
};

export const modifyMember = async (userId, selectedRole, selectedPositions) => {
    const idColla = localStorage.getItem("id_colla");
    return await apiRequest(
        `/members/modifyMember?collaid=${idColla}&userid=${userId}`,
        {
            method: "POST",
            body: JSON.stringify({
                id_rol: selectedRole,
                ids_posicions: selectedPositions
            }),
        }
    );
};

export const deleteMember = async (userId) => {
    const idColla = localStorage.getItem("id_colla");
    return await apiRequest(
        `/members/deleteMember?id=${idColla}&userid=${userId}`,
        {
            method: "DELETE",
        }
    );
};

export const getMemberPermissions = async () => {
    const idColla = localStorage.getItem("id_colla");
    return await apiRequest(
        `/members/getMemberPermissions?id=${idColla}`,
        {
            method: "GET",
        }
    );
};