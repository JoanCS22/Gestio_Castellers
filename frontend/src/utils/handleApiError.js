// utils/handleApiError.js

export const handleApiError = (err, navigate, setError) => {

    if (err.message === "UNAUTHORIZED") {
        navigate("/login");
        return;
    }

    setError(err.message);
};