import { createContext, useContext, useEffect, useState } from "react";
import { getCollesUser } from "../services/collaService.js";

const CollaContext = createContext();

export const CollaProvider = ({ children }) => {
  const [colles, setColles] = useState([]);
  const [currentColla, setCurrentColla] = useState(null);

  const token = localStorage.getItem("token");

  const [loadingColles, setLoadingColles] = useState(!!token);

  const loadColles = async () => {
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

      let selected =
        data.find(c => String(c.id) === String(storedId)) || data[0];

      setCurrentColla(selected);

      localStorage.setItem("id_colla", selected.id);

    } catch (err) {
      console.error("Error loading colles:", err);
      setColles([]);
      setCurrentColla(null);
    } finally {
      setLoadingColles(false);
    }
  };

  const changeColla = (colla) => {
    setCurrentColla(colla);
    localStorage.setItem("id_colla", colla.id);
  };

  useEffect(() => {
    if (!token) {
      setColles([]);
      setCurrentColla(null);
      setLoadingColles(false);
      return;
    }

    loadColles();
  }, [token]);

  return (
    <CollaContext.Provider
      value={{
        colles,
        currentColla,
        setCurrentColla,
        changeColla,
        reloadColles: loadColles,
        loadingColles
      }}
    >
      {children}
    </CollaContext.Provider>
  );
};

export const useColla = () => useContext(CollaContext);