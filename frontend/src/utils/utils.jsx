export const getPermissions = () => {
    try {
        const raw = localStorage.getItem("permissions");
        if (!raw || raw === "undefined" || raw === "null") return {};
        return JSON.parse(raw);
    } catch (err) {
        console.error("Error parsing permissions from localStorage:", err);
        return {};
    }
};