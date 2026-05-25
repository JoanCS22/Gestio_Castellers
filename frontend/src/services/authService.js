import { apiRequest } from "./api";

export const register = async (email, password) => {
    return await apiRequest(
        `/register`,
        {
            method: "POST",
            body: JSON.stringify({
                email,
                contrasenya: password,
            }),
        }
    );
};

export const login = async (email, password) => {
    return await apiRequest(
        `/login`,
        {
            method: "POST",
            body: JSON.stringify({
                email,
                contrasenya: password,
            }),
        }
    );
};