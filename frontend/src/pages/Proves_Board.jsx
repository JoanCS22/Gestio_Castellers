import { getCollaMembers } from "../services/membersService";
import { getCollesPositions } from "../services/collaService.js";
import {
    getProvaById, getProvesByEsdeveniment, getAssignacions, getNumProves,
    createProva, modifyProva, deleteProva,
    updateFavorite, updateFeta, publishProva,
    intercanviarPosicions, asignarPosicioProva, canviarAssignacio, moureAssignacio,
    treureMembrePosicio, buidarPlantilla, treureAbsents
} from "../services/provesService.js";
import { getPlantillaById, getCollesPlantilles, getPlantillesPositions } from "../services/plantillesService.js";
import { getAssistenciaByEsdeveniment } from "../services/assistenciaService.js";
import { handleApiError } from "../utils/handleApiError.js";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Draggable from "react-draggable";

import {
    FaCheck, FaCheckDouble, FaVideoSlash, FaVideo, FaTrashAlt, FaTimesCircle, FaCheckCircle,
    FaStar, FaHashtag, FaEye, FaEyeSlash, FaPencilAlt, FaPlusSquare, FaSearch,
    FaTimes, FaQuestionCircle, FaUserTimes, FaUserAltSlash, FaUsersSlash,
    FaAngleRight, FaAngleLeft, FaAmbulance, FaGithubAlt, FaArrowLeft, FaClock
} from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx"
import socket from "../utils/socket";

import "./Proves_Board.css"

import TopMenu from "../components/TopMenu.jsx";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import ShowBoard from "../components/showBoard.jsx";

import { useSyncExternalStore } from "react";
import { useEvent } from "../context/EventContext.jsx"

import { useColla } from "../context/CollaContext.jsx";

function ProvesBoard() {
    const navigate = useNavigate();

    const location = useLocation();

    const { currentColla, loadingColles } = useColla();

    const { currentEvent } = useEvent();

    const boardRef = useRef(null);

    const isShown = location.pathname === '/proves_board_show';

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);

    const handleMouseDown = (e) => {
        const board = boardRef.current;

        setIsDragging(true);

        setStartX(e.pageX - board.offsetLeft);
        setStartY(e.pageY - board.offsetTop);

        setScrollLeft(board.scrollLeft);
        setScrollTop(board.scrollTop);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        e.preventDefault();

        const board = boardRef.current;

        const x = e.pageX - board.offsetLeft;
        const y = e.pageY - board.offsetTop;

        const walkX = x - startX;
        const walkY = y - startY;

        board.scrollLeft = scrollLeft - walkX;
        board.scrollTop = scrollTop - walkY;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const params = new URLSearchParams(location.search);
    const idProva = params.get("id");
    const idEsdeveniment = params.get("idEsdeveniment");
    const nomEsdeveniment = params.get("nomEsdeveniment");

    //assistencia, colla, esdeveniments, llistats, membres, notificacions, permisos, plantilles, proves
    const permissions = getPermissions();
    const hasWritePermission = (key) => permissions[key] === "W";

    const [message, setTempMessage] = useState(null);
    const [error, setError] = useState("");

    const [provaInfo, setProvaInfo] = useState(null);

    const [modalTags, setModalTags] = useState({
        nom: "",
        comentari: "",
        estructura: "",
        xarxa: false,
        public: false
    });

    const [selectedPlantilla, setSelectedPlantilla] = useState("");

    const [plantilles, setPlantilles] = useState([]);

    const [proves, setProves] = useState([]);

    const [assistencia, setAssistencia] = useState([]);

    const [infoPlantilla, setInfoPlantilla] = useState([]);
    const [selectedTag, setSelectedTag] = useState("pinya");

    const [members, setMembers] = useState([]);
    const [membersByPosition, setMembersByPosition] = useState([]);
    const [selectedMemberId, setSelectedMemberId] = useState(null);

    const [positions, setPositions] = useState([]);
    const [selectedPositions, setSelectedPositions] = useState([0]);

    const [posicionsPlantilla, setPosicionsPlantilla] = useState([]);
    const [selectedPositionId, setSelectedPositionId] = useState(null);

    const [assignacions, setAssignacions] = useState([]);
    const [numAssignacions, setNumAssignacions] = useState([]);
    const [selectedAssignacioId, setSelectedAssignacioId] = useState(null);

    const [memberSearch, setMemberSearch] = useState("");

    const [firstCheck, setFirstCheck] = useState({
        si: true,
        no: true,
        no_sap: true,
    });

    const [secondCheck, setSecondCheck] = useState({
        si: true,
        no: true,
        no_sap: true,
    });

    const [mesures, setMesures] = useState({
        1: "Alçada",
        2: "Alçada Espatlles",
        3: "Envergadura"
    });
    const [selectedMesura, setSelectedMesura] = useState(1);

    const getAssistenciaIcon = (memberId) => {

        const registre = assistencia.find(
            (a) => a.id_usuari === memberId
        );

        if (!registre) {
            return <FaQuestionCircle className="icon-pendent" />;
        }

        switch (registre.confirmacio_arribada) {
            case "si":
                return <FaCheckDouble className="icon-feta" />;

            case "no":
                return <FaTimesCircle className="icon-no-feta" />;

            case "no_sap":
                return <FaQuestionCircle className="icon-unknown" />;
        }

        switch (registre.confirmacio_previa) {
            case "si":
                return <FaCheckCircle className="icon-feta" />;

            case "no":
                return <FaTimesCircle className="icon-no-feta" />;

            case "no_sap":
                return <FaQuestionCircle className="icon-unknown" />;

            case "pendent":
            default:
                return <FaQuestionCircle className="icon-pendent" />;
        }
    };

    const assistenciaMap = useMemo(() => {
        const map = {};
        assistencia.forEach(a => {
            map[a.id_usuari] = a;
        });
        return map;
    }, [assistencia]);

    const [showCastell, setShowCastell] = useState(isShown);
    const [editMode, setEditMode] = useState(false);
    const [showModalProva, setShowModalProva] = useState(false);

    const [showRightProves, setShowRightProves] = useState(false);

    const BOARD_SIZE = 1500;

    const minX = Math.min(...posicionsPlantilla.map(p => p.coord_x));
    const maxX = Math.max(...posicionsPlantilla.map(p => p.coord_x));

    const minY = Math.min(...posicionsPlantilla.map(p => p.coord_y));
    const maxY = Math.max(...posicionsPlantilla.map(p => p.coord_y));

    const plantillaWidth = maxX - minX;
    const plantillaHeight = maxY - minY;

    const offsetX = BOARD_SIZE / 2 - (minX + plantillaWidth / 2);
    const offsetY = BOARD_SIZE / 2 - (minY + plantillaHeight / 2);

    const topPanelRef = useRef(null);
    const [topPanelBottom, setTopPanelBottom] = useState(220);

    useEffect(() => {
        if (!topPanelRef.current) return;
        const update = () => {
            const rect = topPanelRef.current?.getBoundingClientRect();
            if (rect) setTopPanelBottom(rect.bottom);
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [posicionsPlantilla, infoPlantilla]);

    const membreDelMarcPerfil = useMemo(() => {
        if (selectedMemberId) {
            return members.find(m => m.id_usuari === selectedMemberId) || null;
        }
        if (selectedPositionId) {
            const assignacio = assignacions.find(a => a.id_posicio === selectedPositionId);
            if (!assignacio?.id_usuari) return null;
            return members.find(m => m.id_usuari === assignacio.id_usuari) || null;
        }
        return null;
    }, [selectedMemberId, selectedPositionId, members, assignacions]);

    const showTempMessage = (message, type = "success") => {
        setTempMessage({ message, type });

        setTimeout(() => {
            setTempMessage(null);
        }, 2000);
    };

    const resetModal = () => {
        setShowModalProva(false);
        setSelectedPlantilla("");

        setModalTags({
            nom: "",
            descripcio: "",
            estructura: "",
            xarxa: false,
            public: false,
        });

        setError("");
    };

    const modifySelectedPositions = (id) => {

        if (id === 0) {
            if (selectedPositions.includes(0)) {
                setSelectedPositions([]);
            } else {
                setSelectedPositions([0]);
            }

            return;
        }

        let updated = selectedPositions.filter(p => p !== 0);

        if (updated.includes(id)) {
            updated = updated.filter(p => p !== id);
        } else {
            updated.push(id);
        }

        if (updated.length === 0) {
            updated = [0];
        }

        setSelectedPositions(updated);
    };

    const filteredMembers = useMemo(() => {
        const hasSearch = memberSearch.trim().length > 0;

        return membersByPosition.filter((member) => {

            if (hasSearch) {
                const search = memberSearch.toLowerCase();
                return (
                    member.mote?.toLowerCase().includes(search) ||
                    `${member.nom} ${member.cognoms}`.toLowerCase().includes(search)
                );
            }

            const registre = assistenciaMap[member.id_usuari];

            if (!registre) {
                return firstCheck.no_sap || firstCheck.no;
            }

            switch (registre.confirmacio_arribada) {
                case "si":
                    return secondCheck.si;
                case "no":
                    return secondCheck.no;
                case "no_sap":
                    return secondCheck.no_sap;
            }

            switch (registre.confirmacio_previa) {
                case "si":
                    return firstCheck.si;
                case "no":
                    return firstCheck.no;
                case "no_sap":
                    return firstCheck.no_sap;
                default:
                    return firstCheck.no_sap;
            }
        });
    }, [membersByPosition, assistenciaMap, memberSearch, firstCheck, secondCheck]);

    const sortedFilteredMembers = useMemo(() => {
        const unassigned = [];
        const assigned = [];

        filteredMembers.forEach(member => {
            const isAssigned = assignacions.some(
                a => a.id_usuari === member.id_usuari
            );

            if (isAssigned) {
                assigned.push(member);
            } else {
                unassigned.push(member);
            }
        });

        return [...unassigned, ...assigned];
    }, [filteredMembers, assignacions]);

    const getUsuariByPosicio = (posicio) => {
        const assignacio = assignacions.find(a => a.id_posicio === posicio.id);
        if (assignacio) return assignacio.id_usuari;

        if (posicio.posicio_relacio) {
            const assignacioRel = assignacions.find(a => a.id_posicio === posicio.posicio_relacio);
            return assignacioRel?.id_usuari || null;
        }
        return null;
    };

    const isPinyaRelacionada = (posicio) => {
        if (posicio.seccio !== "pinya") return false;
        return !!posicio.posicio_relacio;
    };

    const calcularAlturaAcumulada = (idPosicioInicial) => {

        let alturaTotal = 0;
        let posicioActual = posicionsPlantilla.find(
            p => p.id === idPosicioInicial
        );

        const visited = new Set();

        while (posicioActual) {
            if (visited.has(posicioActual.id)) {
                console.warn("Loop detectat en relacions");
                break;
            }

            visited.add(posicioActual.id);

            const assignacio = assignacions.find(
                a => a.id_posicio === posicioActual.id
            );

            if (assignacio?.id_usuari) {

                const membre = members.find(
                    m => m.id_usuari === assignacio.id_usuari
                );

                alturaTotal += Number(membre?.altura_total || 0);
            }

            posicioActual = posicionsPlantilla.find(
                p => p.id === posicioActual.id_posicio_up
            );
        }

        return alturaTotal;
    };

    const changeState = (valorActual) => {
        if (valorActual === "per fer") return "feta";
        if (valorActual === "feta") return "cancelada";
        if (valorActual === "cancelada") return "per fer";
        return "per fer";
    };

    const loadCollaMembers = async () => {
        try {
            const data = await getCollaMembers(currentColla.id);
            setMembers(data);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    };

    const loadProva = async () => {
        try {
            setSelectedTag("pinya");
            const data = await getProvaById(idProva);
            setProvaInfo(data);
            return data;
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    };

    const loadPlantilla = async (idPlantilla) => {

        try {
            const data = await getPlantillaById(idPlantilla);
            setInfoPlantilla({ ...data });
            setSelectedTag(data.pinya ? "pinya" : "tronc")
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const loadCollesPlantilles = async () => {
        try {
            const data = await getCollesPlantilles(currentColla.id);
            setPlantilles(data);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const loadAssistenciaByEsdeveniment = async (idEsdeveniment) => {
        try {
            const data = await getAssistenciaByEsdeveniment(idEsdeveniment);
            setAssistencia([...data]);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const loadProvesByEsdeveniment = async (idEsdeveniment) => {
        try {
            const data = await getProvesByEsdeveniment(idEsdeveniment);
            setProves(data);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const loadCollesPositions = async () => {
        try {
            const data = await getCollesPositions(currentColla.id);
            setPositions(data);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const loadPlantillesPositions = async (idPlantilla) => {
        try {
            const data = await getPlantillesPositions(idPlantilla);
            setPosicionsPlantilla(data);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const loadAssignacions = async () => {
        try {
            const data = await getAssignacions(idProva);
            setAssignacions(data);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const changeFavorite = async (idPlantilla, favoriteValue) => {
        try {
            const data = await updateFavorite(idPlantilla, favoriteValue);
            await loadProva();
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const changeFeta = async (idPlantilla, fetaValue) => {
        try {
            const newValue = changeState(fetaValue);
            const data = await updateFeta(idPlantilla, newValue);
            await loadProva();
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const changePublic = async (idPlantilla, publciValue) => {
        try {
            const data = await publishProva(idPlantilla, publciValue);
            await loadProva();
            publciValue ? showTempMessage("Prova publicada.") : showTempMessage("Prova despublicada.");
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const createOrModifyProva = async (action) => {

        const compulsoryInputs = {
            nom: "Nom",
            estructura: "Estructura"
        };
        for (const key in compulsoryInputs) {
            if (!modalTags[key] || modalTags[key].toString().trim() === "") {
                setError(`El camp ${compulsoryInputs[key]} és obligatori`);
                return;
            }
        }
        if (!selectedPlantilla) {
            setError("El camp Plantilla és obligatori");
            return;
        }

        const endPoint = action === "create" ? createProva(provaInfo.id_esdeveniment, modalTags, selectedPlantilla)
            : modifyProva(provaInfo.id, modalTags, selectedPlantilla);

        try {
            const data = await endPoint;
            await loadProva();
            editMode ? showTempMessage("Prova modificada correctament.") : showTempMessage("Prova creada correctament.");

            const prova = await loadProva();
            await loadProvesByEsdeveniment(prova.id_esdeveniment);
            resetModal();
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const deleteProvaCall = async (id_prova, nom_prova) => {
        if (!window.confirm(`Vols eliminar la prova ${nom_prova.toUpperCase()}?`)) return;
        try {
            const data = await deleteProva(id_prova);
            setError("");
            showTempMessage("Prova eliminada correctament.");
            navigate(`/proves?idEsdeveniment=${idEsdeveniment}&nomEsdeveniment=${encodeURIComponent(nomEsdeveniment)}`);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const asignarPosicio = async () => {

        if (!selectedPositionId || !selectedMemberId) { return; }

        try {
            let data;

            const assignacioPosicio = assignacions.find(a => a.id_posicio === selectedPositionId);
            const assignacioMembre = assignacions.find(a => a.id_usuari === selectedMemberId);

            const idAssignacioPosicio = assignacioPosicio?.id_assignacio;
            const idAssignacioMembre = assignacioMembre?.id_assignacio;

            if (assignacioPosicio && assignacioMembre) {
                data = await intercanviarPosicions(idAssignacioPosicio, idAssignacioMembre);
            } else if (assignacioPosicio) {
                data = await canviarAssignacio(idAssignacioPosicio, selectedMemberId);
            } else if (assignacioMembre) {
                data = await canviarAssignacio(idAssignacioMembre, undefined, selectedPositionId);
            } else {
                data = await asignarPosicioProva(idProva, selectedPositionId, selectedMemberId);
            }

            await loadAssignacions();
            await obtenirNumProvesMembre(provaInfo.id_esdeveniment);
            setSelectedPositionId(null);
            setSelectedMemberId(null);
            setSelectedAssignacioId(null);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const moureAssignacioCall = async (idAssignacioDesti, idNovaPosicio) => {

        try {
            const data = await moureAssignacio(idAssignacioDesti, idNovaPosicio);
            await loadAssignacions();
            await obtenirNumProvesMembre(provaInfo.id_esdeveniment);
            setSelectedPositionId(null);
            setSelectedMemberId(null);
            setSelectedAssignacioId(null);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const intercanviarPosicionsCall = async (assignacio1, assignacio2) => {
        try {
            const data = await intercanviarPosicions(assignacio1, assignacio2);
            await loadAssignacions();
            await obtenirNumProvesMembre(provaInfo.id_esdeveniment);

            setSelectedPositionId(null);
            setSelectedMemberId(null);
            setSelectedAssignacioId(null);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    };

    const treureMembrePosicioCall = async () => {
        try {
            const data = await treureMembrePosicio(selectedAssignacioId);
            await loadAssignacions();
            await obtenirNumProvesMembre(provaInfo.id_esdeveniment);

            setSelectedPositionId(null);
            setSelectedMemberId(null);
            setSelectedAssignacioId(null);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const buidarPlantillaCall = async () => {
        if (!window.confirm("Segur que vols buidar la plantilla d'aquesta prova?")) return;

        try {
            const data = await buidarPlantilla(idProva);
            await loadAssignacions();
            await obtenirNumProvesMembre(provaInfo.id_esdeveniment);

            setSelectedPositionId(null);
            setSelectedMemberId(null);
            setSelectedAssignacioId(null);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const treureAbsentsCall = async () => {
        if (!window.confirm("Segur que vols buidar la plantilla d'aquesta prova?")) return;

        try {
            const id_esdeveniment = provaInfo?.id_esdeveniment;

            if (!provaInfo?.id_esdeveniment) {
                return;
            }

            const data = await treureAbsents(id_esdeveniment, provaInfo.id);
            await loadAssignacions();
            await obtenirNumProvesMembre(id_esdeveniment);

            setSelectedPositionId(null);
            setSelectedMemberId(null);
            setSelectedAssignacioId(null);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const obtenirNumProvesMembre = async (id_esdeveniment) => {
        try {
            const data = await getNumProves(id_esdeveniment);
            setNumAssignacions(data);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    useEffect(() => {
        if (selectedMemberId && selectedPositionId) {
            asignarPosicio();
        }
    }, [selectedMemberId, selectedPositionId]);

    useEffect(() => {
        loadCollaMembers();
        loadCollesPositions();
        loadCollesPlantilles();
    }, []);

    useEffect(() => {

        const loadData = async () => {

            setInfoPlantilla({});
            setAssistencia([]);
            setSelectedTag("pinya");
            setProvaInfo(null);

            if (idProva) {
                await loadProva();
                await loadAssignacions();
            }
        };

        loadData();

    }, [idProva]);

    useEffect(() => {
        if (!provaInfo?.id_esdeveniment) return;

        loadProvesByEsdeveniment(provaInfo.id_esdeveniment);
        loadAssistenciaByEsdeveniment(provaInfo.id_esdeveniment);
        obtenirNumProvesMembre(provaInfo.id_esdeveniment);

    }, [provaInfo?.id_esdeveniment]);

    useEffect(() => {
        if (!provaInfo?.id_plantilla) return;

        loadPlantilla(provaInfo.id_plantilla);
        loadPlantillesPositions(provaInfo.id_plantilla);

    }, [provaInfo?.id_plantilla]);

    useEffect(() => {
        if (memberSearch.trim().length > 0) {
            setMembersByPosition(members);
            return;
        }

        if (selectedPositions.length === 0 || selectedPositions.includes(0)) {
            setMembersByPosition(members);
            return;
        }

        const filtered = members.filter(member =>
            member.posicions?.some(posicio =>
                selectedPositions.includes(posicio)
            )
        );

        setMembersByPosition(filtered);

    }, [selectedPositions, members, memberSearch]);

    useEffect(() => {
        if (!boardRef.current || posicionsPlantilla.length === 0) return;

        const board = boardRef.current;

        const centerX = offsetX + plantillaWidth / 2;
        const centerY = offsetY + plantillaHeight / 2;

        board.scrollLeft = centerX - board.clientWidth / 2;
        board.scrollTop = centerY - board.clientHeight / 2;

    }, [posicionsPlantilla]);

    useEffect(() => {
        const handleAssignacionsUpdated = async (data) => {

            if (Number(data.id_prova) !== Number(idProva)) {
                return;
            }
            await loadAssignacions();
            await obtenirNumProvesMembre(provaInfo?.id_esdeveniment);
        };

        socket.on("assignacionsUpdated", handleAssignacionsUpdated);
        return () => {
            socket.off("assignacionsUpdated", handleAssignacionsUpdated);
        };
    }, [idProva, provaInfo]);

    return (
        <div>
            {!showCastell ? (
                <>
                    <TopMenu
                        title={provaInfo ? `${provaInfo.nom} - ${provaInfo.estructura}` : "Carregant prova..."}
                        tornar
                        tornar_action={
                            currentEvent
                                ? () => {
                                    navigate(
                                        `/proves?idEsdeveniment=${idEsdeveniment}&nomEsdeveniment=${encodeURIComponent(nomEsdeveniment)}`
                                    );
                                    setSelectedMemberId(null);
                                    setSelectedPositionId(null);
                                    setSelectedAssignacioId(null);
                                }
                                : undefined
                        }
                        leftIcons={
                            <>
                                {provaInfo?.xarxa && (
                                    <div className="icon-btn" title="Prova amb xarxa">
                                        <FaHashtag />
                                    </div>
                                )}
                                <div className="icon-btn" title={provaInfo?.feta == "feta" ? "Prova realitzada" :
                                    provaInfo?.feta == "per fer" ? "Prova pendent" : "Prova cancel·lada"}
                                    onClick={() => {
                                        changeFeta(provaInfo.id, provaInfo?.feta);
                                    }}>
                                    {provaInfo?.feta == "feta" ? (
                                        <FaCheckCircle className="icon-feta" />
                                    ) : (
                                        <>
                                            {provaInfo?.feta == "per fer" ? (
                                                <FaClock className="icon-pendent" />
                                            ) : (

                                                <FaTimesCircle className="icon-no-feta" />
                                            )}
                                        </>
                                    )}
                                </div>
                                <div className="icon-btn" title={provaInfo?.favorita ? "Treure de favorits" : "Afegir a favorits"} onClick={() => {
                                    changeFavorite(provaInfo.id, !provaInfo.favorita);
                                }}>
                                    <FaStar className={`icon-favorit ${provaInfo?.favorita ? "favorit-actiu" : ""} `} />
                                </div>
                            </>
                        }

                        rightIcons={
                            <>
                                <div className="icon-btn" title={"Projectar castell"}
                                    onClick={() => { setShowCastell(true) }}>
                                    <FaVideo />
                                </div>
                                <div className="icon-btn" title={provaInfo?.public ? "Prova pública" : "Prova no pública"} onClick={() => {
                                    changePublic(provaInfo.id, !provaInfo.public);
                                }}>
                                    {provaInfo?.public ? (
                                        <FaEye />
                                    ) : (
                                        <FaEyeSlash />
                                    )}
                                </div>
                                <div className="icon-btn" title="Editar informació prova" onClick={() => {
                                    setModalTags({
                                        nom: provaInfo.nom,
                                        descripcio: provaInfo.comentari,
                                        estructura: provaInfo.estructura,
                                        xarxa: provaInfo.xarxa,
                                        public: provaInfo.public,
                                    });
                                    setSelectedPlantilla(provaInfo.id_plantilla);
                                    setEditMode(true);
                                    setShowModalProva(true);
                                }}>
                                    <FaPencilAlt />
                                </div>
                            </>
                        }
                    />
                    {
                        message && (
                            <div className={`message ${message.type} `}>
                                {message.message}
                            </div>
                        )
                    }
                    <div className="left-part-prova-board">
                        <div className="left-part-prova-board-filters">
                            <div className="left-part-prova-board-filters-search">
                                <div className="search-tab-plantilles">
                                    <span>Cercar:</span>
                                    <FaSearch />
                                    <input
                                        type='search'
                                        placeholder='Cercar...'
                                        value={memberSearch}
                                        onChange={(e) => setMemberSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="left-part-prova-board-filters-checkboxrow-icons">
                                <div></div>
                                <FaCheckCircle className="icon-feta" />
                                <FaTimesCircle className="icon-no-feta" />
                                <FaQuestionCircle className="icon-unknown" />
                            </div>
                            <div className="left-part-prova-board-filters-checkboxrow-1">
                                <FaCheck />
                                <div left-part-prova-board-filters-checkboxrow-element>
                                    <input
                                        type="checkbox"
                                        checked={firstCheck.si}
                                        onChange={(e) => setFirstCheck({ ...firstCheck, si: e.target.checked })}
                                    />
                                </div>
                                <div left-part-prova-board-filters-checkboxrow-element>
                                    <input
                                        type="checkbox"
                                        checked={firstCheck.no}
                                        onChange={(e) => setFirstCheck({ ...firstCheck, no: e.target.checked })}
                                    />
                                </div>
                                <div left-part-prova-board-filters-checkboxrow-element>
                                    <input
                                        type="checkbox"
                                        checked={firstCheck.no_sap}
                                        onChange={(e) => setFirstCheck({ ...firstCheck, no_sap: e.target.checked })}
                                    />
                                </div>
                            </div>
                            <div className="left-part-prova-board-filters-checkboxrow-2">
                                <FaCheckDouble />
                                <div left-part-prova-board-filters-checkboxrow-element>
                                    <input
                                        type="checkbox"
                                        checked={secondCheck.si}
                                        onChange={(e) => setSecondCheck({ ...secondCheck, si: e.target.checked })}
                                    />
                                </div>
                                <div left-part-prova-board-filters-checkboxrow-element>
                                    <input
                                        type="checkbox"
                                        checked={secondCheck.no}
                                        onChange={(e) => setSecondCheck({ ...secondCheck, no: e.target.checked })}
                                    />
                                </div>
                                <div left-part-prova-board-filters-checkboxrow-element>
                                    <input
                                        type="checkbox"
                                        checked={secondCheck.no_sap}
                                        onChange={(e) => setSecondCheck({ ...secondCheck, no_sap: e.target.checked })}
                                    />
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="left-part-prova-board-members">
                            {sortedFilteredMembers.map((member) => {

                                const assignacio = assignacions.find(a => a.id_usuari === member.id_usuari);
                                const registre = numAssignacions.find(n => n.id_usuari === member.id_usuari) || 0;
                                const assis = assistencia.find((a) => a.id_usuari === member.id_usuari);
                                const num_proves = registre.num_proves || 0;

                                return (
                                    <div key={member.id_usuari} title={`Persona assignada a ${num_proves} ${num_proves == 1 ? 'prova' : 'proves'}`}
                                        className={`container-member-prova-board ${selectedMemberId === member.id_usuari ? "selected-bloc-membre-prova" : ""}
                                                    ${assignacio ? "assigned-bloc-membre-prova" : ""}`}
                                        onClick={() => {
                                            if (selectedMemberId === member.id_usuari) {
                                                setSelectedMemberId(null);
                                            } else {
                                                setSelectedMemberId(member.id_usuari);
                                            }
                                        }}
                                    >
                                        <span className="member-name">
                                            {member.mote}
                                        </span>

                                        <div className="member-status">
                                            {(assis?.arriba_tard || assis?.marxa_aviat) && (<FaClock />)}
                                            {member.canalla && (<FaGithubAlt />)}
                                            {member.lesionat && (<FaAmbulance />)}
                                            {getAssistenciaIcon(member.id_usuari)}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="top-part-prova-board" ref={topPanelRef}>
                        <div className="top-part-prova-board-row">
                            <div className="top-part-prova-board-actions">
                                <div className="top-part-prova-board-icons-mesura">
                                    <label className="field-label-prova-mesura">Mesura</label>

                                    <div className="select-wrapper-prova-mesura">
                                        <select
                                            value={selectedMesura}
                                            onChange={(e) => setSelectedMesura(Number(e.target.value))}
                                            className="custom-select-prova-mesura"
                                        >

                                            {Object.entries(mesures).map(([key, value]) => (
                                                <option key={key} value={key}>
                                                    {value}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="top-part-prova-board-icons">
                                    <FaUserTimes title="Eliminar persones absents" onClick={() => {
                                        treureAbsentsCall();
                                    }} />
                                    <FaUserAltSlash title="Buidar casella seleccionada" onClick={() => {
                                        treureMembrePosicioCall();
                                    }} />
                                    <FaUsersSlash title="Buidar plantilla" onClick={() => {
                                        buidarPlantillaCall();
                                    }} />
                                </div>
                            </div>
                            <div className="top-part-prova-board-posicions">
                                <label
                                    key={0}
                                    className={`container-position-prova-board ${selectedPositions.includes(0) ? "position-selected" : ""} `}
                                    title="Filtrar per totes les posicions"
                                >
                                    <span className="position-name-board">
                                        Totes
                                    </span>

                                    <input
                                        type="checkbox"
                                        checked={selectedPositions.includes(0)}
                                        onChange={() => modifySelectedPositions(0)}
                                        hidden
                                    />
                                </label>
                                {positions.map((position) => (
                                    <label
                                        key={position.id}
                                        className={`container-position-prova-board ${selectedPositions.includes(position.nom) ? "position-selected" : ""} `}
                                        title={`Filtrar per ${position.nom} `}
                                    >
                                        <span className="position-name-board">
                                            {position.nom}
                                        </span>

                                        <input
                                            type="checkbox"
                                            checked={selectedPositions.includes(position.nom)}
                                            onChange={() => modifySelectedPositions(position.nom)}
                                            hidden
                                        />
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="create-prova-sections">
                            {infoPlantilla.pinya && (
                                <>
                                    <div className={`select-section-prova ${selectedTag === "pinya" ? "active" : ""} `} onClick={() => {
                                        setSelectedTag("pinya");
                                        setSelectedPositionId(null);
                                    }}>Pinya</div>
                                </>
                            )}
                            {infoPlantilla.folre && (
                                <>
                                    <div className={`select-section-prova ${selectedTag === "folre" ? "active" : ""} `} onClick={() => {
                                        setSelectedTag("folre");
                                        setSelectedPositionId(null);
                                    }}>Folre</div>
                                </>
                            )}
                            {infoPlantilla.manilles && (
                                <>
                                    <div className={`select-section-prova ${selectedTag === "manilles" ? "active" : ""} `} onClick={() => {
                                        setSelectedTag("manilles");
                                        setSelectedPositionId(null);
                                    }}>Manilles</div>
                                </>
                            )}
                            {infoPlantilla.puntals && (
                                <>
                                    <div className={`select-section-prova ${selectedTag === "puntals" ? "active" : ""} `} onClick={() => {
                                        setSelectedTag("puntals");
                                        setSelectedPositionId(null);
                                    }}>Puntals</div>
                                </>
                            )}
                            {infoPlantilla.tronc && (
                                <>
                                    <div className={`select-section-prova ${selectedTag === "tronc" ? "active" : ""} `} onClick={() => {
                                        setSelectedTag("tronc");
                                        setSelectedPositionId(null);
                                    }}>Tronc</div>
                                </>
                            )}
                        </div>
                    </div>
                    {membreDelMarcPerfil && (() => {
                        const assis = assistenciaMap[membreDelMarcPerfil.id_usuari];
                        const tardOAviat = assis?.arriba_tard || assis?.marxa_aviat;
                        const tardTitle = assis?.arriba_tard ? `Arriba ${assis.temps_tard}' tard` : "";
                        const aviatTitle = assis?.marxa_aviat ? `Marxa ${assis.temps_aviat}' abans` : "";

                        return (
                            <div className="marc-perfil-prova" style={{ top: `${topPanelBottom}px` }}>
                                <div className="foto-marc-prova">
                                    <img src={membreDelMarcPerfil.foto || "/prueba.jpg"} alt="Foto de perfil" />
                                </div>
                                <div className="text-marc-prova-mote">
                                    {membreDelMarcPerfil.mote || "Sense mote."}
                                </div>
                                {tardOAviat && (
                                    <div className="text-marc-prova-clock">
                                        {assis?.arriba_tard && (
                                            <div className="text-marc-prova-clock-row">
                                                <FaClock className="icon-pendent" /> {tardTitle}
                                            </div>
                                        )}
                                        {assis?.marxa_aviat && (
                                            <div className="text-marc-prova-clock-row">
                                                <FaClock className="icon-pendent" /> {aviatTitle}
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="text-marc-prova-comentari">
                                    {membreDelMarcPerfil.comentari || "Comentari prova"}
                                </div>
                            </div>
                        );
                    })()}
                    <div className={`right-part-menu-desplegable ${showRightProves ? "open" : "closed"} `}
                        style={{ top: `${topPanelBottom + 12}px` }}>

                        <div
                            className="right-part-menu-toggle"
                            onClick={() => setShowRightProves(!showRightProves)}
                        >
                            {showRightProves ? <FaAngleRight /> : <FaAngleLeft />}
                        </div>

                        {showRightProves && (
                            <div className="right-part-menu-content">

                                <div className="right-part-menu-top">
                                    <Button
                                        text={"Crear nova prova"}
                                        icon={<FaPlusSquare />}
                                        action={() => {
                                            setShowModalProva(true);
                                        }}
                                    />
                                </div>

                                <div className="right-part-menu-list">
                                    {proves.map((prova) => (
                                        <div
                                            key={prova.id}
                                            className="container-right-prova-menu"
                                            onClick={() => {
                                                navigate(`/proves_board_edit?id=${prova.id}&idEsdeveniment=${idEsdeveniment}&nomEsdeveniment=${encodeURIComponent(nomEsdeveniment)}`);
                                                setSelectedPositionId(null);
                                                setSelectedMemberId(null);
                                                setSelectedAssignacioId(null);
                                                setShowRightProves(!showRightProves)
                                            }}
                                        >
                                            <span className="container-right-prova-menu-name">
                                                {prova.nom}
                                            </span>

                                            <FaTrashAlt
                                                className="delete-prova-icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteProvaCall(prova.id, prova.nom);
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div ref={boardRef}
                        className="whole-board-prova"
                        style={{ top: `${topPanelBottom}px` }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                    >
                        <div className="board-canvas-prova">
                            {posicionsPlantilla.filter(posicio => posicio.seccio === selectedTag).map((posicio) => {

                                const assignacio =
                                    assignacions.find(a => a.id_posicio === posicio.id) ||
                                    (posicio.posicio_relacio
                                        ? assignacions.find(a => a.id_posicio === posicio.posicio_relacio)
                                        : null);
                                const idUsuari = assignacio?.id_usuari || null;
                                const membreActual = members.find(m => m.id_usuari === idUsuari);
                                const isMirrorPosition = (posicio) =>
                                    posicio.seccio === "pinya" && posicio.posicio_relacio;

                                return (
                                    <>
                                        <div className="posicio-wrapper-bloc">
                                            <div
                                                key={posicio.id}
                                                className={`bloc-posicio-prova-edit
                                                ${selectedPositionId === posicio.id ? "selected-bloc-prova" : ""}
                                                ${selectedMemberId === assignacio?.id_usuari ? "selected-bloc-member" : ""}
                                                ${isPinyaRelacionada(posicio) ? "disabled-pinya" : ""}
                                            `}
                                                onClick={() => {
                                                    if (isPinyaRelacionada(posicio)) {
                                                        alert("Aquesta posició de pinya està vinculada al tronc. Modifica només la posició de tronc.");
                                                        return;
                                                    }
                                                    const posicioAnterior = selectedPositionId;
                                                    const posicioNova = posicio.id;

                                                    if (!posicioAnterior) {
                                                        setSelectedPositionId(posicioNova);
                                                        setSelectedAssignacioId(assignacio?.id_assignacio || null);
                                                        return;
                                                    }

                                                    if (posicioAnterior === posicioNova) {
                                                        setSelectedPositionId(null);
                                                        setSelectedAssignacioId(null);
                                                        return;
                                                    }

                                                    const assignacioAnterior = assignacions.find(a => a.id_posicio === posicioAnterior);
                                                    const assignacioNova = assignacions.find(a => a.id_posicio === posicioNova);

                                                    if (assignacioAnterior && assignacioNova) {
                                                        intercanviarPosicionsCall(assignacioAnterior.id_assignacio, assignacioNova.id_assignacio);
                                                    } else if (assignacioAnterior || assignacioNova) {
                                                        if (assignacioAnterior) {
                                                            moureAssignacioCall(assignacioAnterior.id_assignacio, posicioNova);
                                                        } else if (assignacioNova) {
                                                            moureAssignacioCall(assignacioNova.id_assignacio, posicioAnterior);
                                                        }
                                                    }

                                                    setSelectedPositionId(posicioNova);
                                                }}
                                                style={{
                                                    position: "absolute",
                                                    left: `${posicio.coord_x + offsetX}px`,
                                                    top: `${posicio.coord_y + offsetY}px`,
                                                    backgroundColor: posicio.color,
                                                    transform: `rotate(${posicio.rotacio}deg)`,
                                                }}
                                            >
                                                <span className="posicio-mote-prova">
                                                    {membreActual?.mote || ""}
                                                </span>

                                                <span className="posicio-mesura-prova">
                                                    <span className="posicio-icon-prova">
                                                        {idUsuari && getAssistenciaIcon(idUsuari)}
                                                    </span>
                                                    {selectedMesura === 1 ? (membreActual?.altura_total || "")
                                                        : selectedMesura === 2 ? (membreActual?.altura_espatlles || "")
                                                            : (membreActual?.envergadura || "")
                                                    }
                                                    {assignacio && ("cm")}
                                                </span>
                                            </div>
                                            {(posicio.nom == "Baix" && posicio.seccio === "tronc") && (
                                                <div
                                                    className="posicio-baix-acumulacio-alçades"
                                                    style={{
                                                        position: "absolute",
                                                        left: `${posicio.coord_x + offsetX + 35}px`,
                                                        top: `${posicio.coord_y + offsetY + 32}px`,
                                                    }}
                                                >
                                                    {calcularAlturaAcumulada(posicio.id)} cm
                                                </div>
                                            )}
                                        </div>
                                    </>
                                );
                            })}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <ShowBoard
                        button={
                            <Button
                                text={"Tornar"}
                                icon={<FaArrowLeft />}
                                action={() => { isShown ? navigate(-1) : setShowCastell(false); }}
                            />
                        }
                        positions={posicionsPlantilla}
                        assignacions={assignacions}
                        members={members}
                    />
                </>
            )}

            {showModalProva && (
                <div className="modal-overlay-proves">
                    <div className="modal-proves">
                        <h2>
                            {editMode ? "Modificar informació prova" : "Crear nova prova"}
                        </h2>
                        <div className="input-group-proves">
                            <Input
                                name="name"
                                type="text"
                                placeholder="Nom"
                                value={modalTags.nom}
                                onChange={(e) =>
                                    setModalTags({ ...modalTags, nom: e.target.value })
                                }
                                inputTitle="Nom"
                            />
                            <Input
                                name="estructura"
                                type="text"
                                placeholder="Estructura"
                                value={modalTags.estructura}
                                onChange={(e) =>
                                    setModalTags({ ...modalTags, estructura: e.target.value })
                                }
                                inputTitle="Estructura"
                            />
                        </div>
                        <div>Comentari</div>
                        <div className="input-group-proves">
                            <textarea
                                placeholder="Comentari"
                                value={modalTags.comentari}
                                onChange={(e) =>
                                    setModalTags({ ...modalTags, comentari: e.target.value })
                                }
                            />
                        </div>
                        <div className="modal-checkboxes-proves">

                            <div className="input-item-proves">
                                <label className="field-prova-plantilla">Plantilla</label>
                                <div className="select-wrapper-plantilla">
                                    <select
                                        value={selectedPlantilla}
                                        onChange={(e) => setSelectedPlantilla(e.target.value)}
                                        className="custom-select-prova-plantilla"
                                    >
                                        <option value="">Selecciona plantilla</option>

                                        {plantilles.map(r => (
                                            <option key={r.id} value={String(r.id)}>
                                                {r.nom}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="checkbox-item-proves">
                                <span>Xarxa</span>
                                <input
                                    type="checkbox"
                                    checked={modalTags.xarxa}
                                    onChange={(e) => setModalTags({ ...modalTags, xarxa: e.target.checked })}
                                />
                            </div>

                            <div className="checkbox-item-proves">
                                <span>Públic?</span>
                                <input
                                    type="checkbox"
                                    checked={modalTags.public}
                                    onChange={(e) => setModalTags({ ...modalTags, public: e.target.checked })}
                                />
                            </div>
                        </div>
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}
                        <div className="modal-buttons-proves">

                            {editMode ? (
                                <Button
                                    text={"Editar prova"}
                                    icon={<FaPencilAlt />}
                                    action={() => { createOrModifyProva("modify") }}
                                />
                            ) : (
                                <Button
                                    text={"Crear prova"}
                                    icon={<FaPlusSquare />}
                                    action={() => { createOrModifyProva("create") }}
                                />
                            )}

                            <Button
                                text="Cancelar"
                                icon={<FaTimesCircle />}
                                action={() => { resetModal(); }}
                            />
                        </div>
                    </div>
                </div>
            )
            }

        </div >
    )
}

export default ProvesBoard;