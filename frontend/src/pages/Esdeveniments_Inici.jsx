import { getCollesFutureEsdeveniments, getCollesPastEsdeveniments } from "../services/esdevenimentsService.js";
import { handleApiError } from "../utils/handleApiError.js";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaPlusSquare, FaSearch, FaRegEye, FaClipboardList,
    FaPencilAlt, FaUserEdit, FaRunning, FaDumbbell, FaEllipsisH
} from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx";
import { useColla } from "../context/CollaContext.jsx";

import TopMenu from "../components/TopMenu";

import "./Esdeveniments_Inici.css";

const TIPUS_ICONS = {
    assaig: <FaDumbbell />,
    actuacio: <FaRunning />,
    altres: <FaEllipsisH />,
};

const BADGE_CLASS = {
    assaig: "event-type-badge--assaig",
    actuacio: "event-type-badge--actuacio",
    altres: "event-type-badge--altres",
};

const BADGE_LABEL = {
    assaig: "Assaig",
    actuacio: "Actuació",
    altres: "Altres",
};

function EsdevenimentsList() {
    const navigate = useNavigate();
    const { currentColla } = useColla();

    const permissions = getPermissions();
    const hasWritePermission = (key) => permissions[key] === "W";
    const hasAccess = (key) => permissions[key] !== "X";

    const [selectedTab, setSelectedTab] = useState("futurs");
    const [activeFilter, setActiveFilter] = useState("tots");
    const [search, setSearch] = useState("");

    const [futurs, setFuturs] = useState([]);
    const [passats, setPassats] = useState([]);

    const isFuturs = selectedTab === "futurs";
    const currentEsdeveniments = isFuturs ? futurs : passats;

    const loadFutureEsdeveniments = async () => {
        try {
            const data = await getCollesFutureEsdeveniments(currentColla.id);
            setFuturs(data);
        } catch (err) { handleApiError(err, navigate, () => { }); }
    };

    const loadPastEsdeveniments = async () => {
        try {
            const data = await getCollesPastEsdeveniments(currentColla.id);
            setPassats(data);
        } catch (err) { handleApiError(err, navigate, () => { }); }
    };

    useEffect(() => {
        loadFutureEsdeveniments();
        loadPastEsdeveniments();
    }, [currentColla]);

    // Filtratge local
    const filtered = currentEsdeveniments.filter(e => {
        if (!(e.visible || hasWritePermission("esdeveniments"))) return false;

        const tipusOk = activeFilter === "tots" || e.tipus?.toLowerCase() === activeFilter;

        const searchLower = search.toLowerCase();
        const searchOk = !search ||
            e.nom?.toLowerCase().includes(searchLower) ||
            e.tipus?.toLowerCase().includes(searchLower) ||
            e.lloc?.toLowerCase().includes(searchLower);

        return tipusOk && searchOk;
    });

    const getTipusKey = (tipus) => {
        const t = (tipus || "").toLowerCase();
        if (t.includes("assaig")) return "assaig";
        if (t.includes("actuaci")) return "actuacio";
        return "altres";
    };

    return (
        <div>
            <TopMenu title="Agenda" />

            <div className="esdeveniments-page">

                <div className="esdeveniments-tabs">
                    <button
                        className={`esdeveniments-tab ${!isFuturs ? "esdeveniments-tab--active" : ""}`}
                        onClick={() => setSelectedTab("passats")}
                    >
                        Esdeveniments passats
                    </button>
                    <button
                        className={`esdeveniments-tab ${isFuturs ? "esdeveniments-tab--active" : ""}`}
                        onClick={() => setSelectedTab("futurs")}
                    >
                        Esdeveniments futurs
                    </button>
                </div>

                <div className="esdeveniments-toolbar">
                    <div className="esdeveniments-filters">
                        {["tots", "assaig", "actuacio", "altres"].map(f => (
                            <button
                                key={f}
                                className={`filter-pill ${activeFilter === f ? "filter-pill--active" : ""}`}
                                onClick={() => setActiveFilter(f)}
                            >
                                {f === "tots" ? "Tots"
                                    : f === "assaig" ? "Assajos"
                                        : f === "actuacio" ? "Actuacions"
                                            : "Altres"}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
                        <div className="esdeveniments-search">
                            <FaSearch />
                            <input
                                type="search"
                                placeholder="Cercar..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>

                        {isFuturs && hasWritePermission("esdeveniments") && (
                            <button
                                className="esdeveniments-add-btn"
                                onClick={() => navigate("/create_esdeveniment")}
                            >
                                <FaPlusSquare />
                                Afegir esdeveniment
                            </button>
                        )}
                    </div>
                </div>

                <div className="esdeveniments-table-wrap">
                    <table className="esdeveniments-table">
                        <thead>
                            <tr>
                                <th>Esdeveniment</th>
                                <th>Tipus</th>
                                <th>Data i hora</th>
                                <th>Accions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="esdeveniments-empty">
                                        No s'han trobat esdeveniments
                                    </td>
                                </tr>
                            ) : (
                                filtered.map(e => {
                                    const tipusKey = getTipusKey(e.tipus);
                                    const isDiada = tipusKey === "actuacio";

                                    return (
                                        <tr key={e.id}>
                                            <td>
                                                <div className="event-name-cell">
                                                    <div className={`event-icon ${isDiada ? "event-icon--diada" : ""}`}>
                                                        {TIPUS_ICONS[tipusKey]}
                                                    </div>
                                                    <div>
                                                        <div className="event-name-title">{e.nom}</div>
                                                        {e.lloc && (
                                                            <div className="event-name-sub">{e.lloc}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <span className={`event-type-badge ${BADGE_CLASS[tipusKey]}`}>
                                                    {e.tipus || BADGE_LABEL[tipusKey]}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="event-date-main">
                                                    {new Date(e.data_esdeveniment).toLocaleDateString("ca-ES")}
                                                </div>
                                                {e.hora && (
                                                    <div className="event-date-sub">{e.hora}</div>
                                                )}
                                            </td>

                                            <td>
                                                <div className="event-actions">
                                                    <button
                                                        className="event-action-btn"
                                                        title="Consultar"
                                                        onClick={() => navigate(`/consult_esdeveniment?idEsdeveniment=${e.id}`)}
                                                    >
                                                        <FaRegEye />
                                                    </button>

                                                    {hasAccess("proves") && (
                                                        <button
                                                            className="event-action-btn"
                                                            title="Proves"
                                                            onClick={() => navigate(`/proves?idEsdeveniment=${e.id}&nomEsdeveniment=${encodeURIComponent(e.nom)}`)}
                                                        >
                                                            <FaClipboardList />
                                                        </button>
                                                    )}

                                                    {isFuturs && (
                                                        <>
                                                            {hasWritePermission("colla") && (
                                                                <button
                                                                    className="event-action-btn"
                                                                    title="Modificar"
                                                                    onClick={() => navigate(`/modify_esdeveniment?idEsdeveniment=${e.id}`)}
                                                                >
                                                                    <FaPencilAlt />
                                                                </button>
                                                            )}
                                                            <button
                                                                className="event-action-btn"
                                                                title="Assistència"
                                                                onClick={() => {
                                                                    if (hasWritePermission("assistencia")) {
                                                                        navigate(`/assistencia?idEsdeveniment=${e.id}&nomEsdeveniment=${encodeURIComponent(e.nom)}`);
                                                                    } else if (hasAccess("assistencia")) {
                                                                        navigate(`/assistencia_usuari?idEsdeveniment=${e.id}`);
                                                                    }
                                                                }}
                                                            >
                                                                <FaUserEdit />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}

export default EsdevenimentsList;