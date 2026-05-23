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