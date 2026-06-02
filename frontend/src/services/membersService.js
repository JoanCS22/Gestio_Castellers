import { apiRequest } from "./api";

export const getCollaMembers = async (idColla) => {
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

export const addUserToColla = async (idColla, idUser) => {
    return await apiRequest(
        `/members/addMember?id=${idColla}&userid=${idUser}`,
        {
            method: "POST",
        }
    );
};

export const getDataMember = async (idColla, userId) => {
    return await apiRequest(
        `/members/getDataMember?userid=${userId}&collaid=${idColla}`,
        {
            method: "GET",
        }
    );
};

export const modifyMember = async (idColla, userId, selectedRole, selectedPositions, selectedGroups) => {
    return await apiRequest(
        `/members/modifyMember?collaid=${idColla}&userid=${userId}`,
        {
            method: "POST",
            body: JSON.stringify({
                id_rol: selectedRole,
                ids_posicions: selectedPositions,
                ids_grups: selectedGroups,
            }),
        }
    );
};

export const deleteMember = async (idColla, userId) => {
    return await apiRequest(
        `/members/deleteMember?id=${idColla}&userid=${userId}`,
        {
            method: "DELETE",
        }
    );
};

export const getMemberPermissions = async (idColla) => {
    return await apiRequest(
        `/members/getMemberPermissions?id=${idColla}`,
        {
            method: "GET",
        }
    );
};