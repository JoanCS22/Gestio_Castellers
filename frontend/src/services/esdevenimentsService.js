import { apiRequest } from "./api";

export const getEsdevenimentInfo = async (idEsdeveniment) => {

    return await apiRequest(
        `/esdeveniments/getEsdevenimentInfo?id=${idEsdeveniment}`,
        {
            method: "GET",
        }
    );
};

export const getCollesFutureEsdeveniments = async () => {
    const idColla = localStorage.getItem("id_colla");
    if (!idColla) {
        return;
    }
    return await apiRequest(
        `/esdeveniments/getFutureEsdeveniments?id=${idColla}`,
        {
            method: "GET",
        }
    );
};

export const createEsdeveniment = async (form, tipus, visible, acompanyat, bus, code) => {
    const idColla = localStorage.getItem("id_colla");
    return await apiRequest(
        `/esdeveniments/createEsdeveniment?id=${idColla}`,
        {
            method: "POST",
            body: JSON.stringify({
                nom: form.nom,
                tipus: tipus === "Altres" ? tipusAltres : tipus,
                data_esdeveniment: form.data,
                hora: form.hora,
                duracio: form.durada,
                adreca: form.adreca,
                link_adreca: form.link_adreca,
                visible: visible,
                acompanyat: acompanyat,
                bus: bus,
                data_inici_inscripcions: form.data_inscripcions,
                info_addicional: form.info_extra,
                codi_confirmacio: code
            }), 
        }
    );
};

export const modifyEsdeveniment = async (idEsdeveniment, form, tipus, visible, acompanyat, bus, code) => {
    const idColla = localStorage.getItem("id_colla");
    return await apiRequest(
        `/esdeveniments/modifyEsdeveniment?id=${idEsdeveniment}`,
        {
            method: "POST",
            body: JSON.stringify({
                nom: form.nom,
                tipus: tipus === "Altres" ? tipusAltres : tipus,
                data_esdeveniment: form.data,
                hora: form.hora,
                duracio: form.durada,
                adreca: form.adreca,
                link_adreca: form.link_adreca,
                visible: visible,
                acompanyat: acompanyat,
                bus: bus,
                data_inici_inscripcions: form.data_inscripcions,
                info_addicional: form.info_extra
            }), 
        }
    );
};