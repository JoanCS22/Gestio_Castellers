import { createContext, useContext, useEffect, useState, useRef } from "react";
import { getCollesUser } from "../services/collaService.js";

const CollaContext = createContext();

export const CollaProvider = ({ children }) => {
    const [colles, setColles] = useState([]);
    const [currentColla, setCurrentColla] = useState(null);
    const [loadingColles, setLoadingColles] = useState(true);

    const hasFetched = useRef(false);

    const loadColles = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setColles([]);
            setCurrentColla(null);
            setLoadingColles(false);
            return;
        }

        try {
            setLoadingColles(true);
            const data = await getCollesUser();

            if (!Array.isArray(data) || data.length === 0) {
                setColles([]);
                setCurrentColla(null);
                return;
            }

            setColles(data);

            const storedId = localStorage.getItem("id_colla");
            const selected = data.find(c => String(c.id) === String(storedId)) || data[0];

            setCurrentColla(selected);
            localStorage.setItem("id_colla", selected.id);

        } catch (err) {
            console.error("Error loading colles:", err);
            setColles(prev => prev.length > 0 ? prev : []);
        } finally {
            setLoadingColles(false);
        }
    };

    const changeColla = (colla) => {
        setCurrentColla(colla);
        localStorage.setItem("id_colla", colla.id);
    };

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        loadColles();
    }, []);

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === "token") {
                hasFetched.current = false;
                loadColles();
            }
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <CollaContext.Provider
            value={{
                colles,
                currentColla,
                setCurrentColla,
                changeColla,
                reloadColles: loadColles,
                loadingColles,
            }}
        >
            {children}
        </CollaContext.Provider>
    );
};

export const useColla = () => useContext(CollaContext);