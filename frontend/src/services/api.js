const API_URL = "http://localhost:5000";

export async function apiRequest(endpoint, options = {}) {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            ...options.headers,
        },
        ...options,
    });

    if (response.status === 401 || response.status === 403) {
        localStorage.clear();
        window.location.href = "/login";
        return;
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Error");
    }

    return data;
}