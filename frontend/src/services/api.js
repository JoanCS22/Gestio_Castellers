const API_URL = "http://localhost:5000";

export async function apiRequest(endpoint, options = {}) {

    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401 || response.status === 403) {
        localStorage.clear();
        if (window.location.pathname !== "/login") {
            window.location.href = "/login";
        }
        throw new Error("Unauthorized");
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Error");
    }

    return data;
}