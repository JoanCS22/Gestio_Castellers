import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "./showBoard.css";

function ShowBoard({
    button,
    positions,
    assignacions,
    members,
}) {
    const params = new URLSearchParams(location.search);
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;

    console.log("USER LOCALSTORAGE:", user);
    console.log("USER ID:", userId);

    const seccionsOrden = ["pinya", "folre", "manilles", "puntals", "tronc"];

    const SECTION_GAP = 80;

    const SCALE = 0.75;

    const sectionLayout = useMemo(() => {

        let currentOffsetX = 0;

        return seccionsOrden
            .map((seccio) => {

                const sectionPositions = positions.filter(
                    p => p.seccio === seccio
                );

                if (!sectionPositions.length) {
                    return null;
                }

                const xs = sectionPositions.map(p => p.coord_x);
                const ys = sectionPositions.map(p => p.coord_y);

                const minX = Math.min(...xs);
                const maxX = Math.max(...xs);
                const minY = Math.min(...ys);

                const width = ((maxX - minX) * SCALE) + 70;

                const layout = {
                    seccio,
                    positions: sectionPositions,
                    minX,
                    minY,
                    width,
                    offsetX: currentOffsetX,
                };

                currentOffsetX += width + SECTION_GAP;

                return layout;
            })
            .filter(Boolean);

    }, [positions]);

    return (
        <>
            <div className="show-castell-board">
                <div className="showboard-floating-button">
                    {button}
                </div>

                <div className="show-castell-canvas">
                    {sectionLayout.map(section => (
                        <div key={section.seccio} className="castell-section">

                            <div className="castell-section-layer">
                                {section.positions.map(posicio => {

                                    const assignacio = assignacions.find(a => a.id_posicio === posicio.id);
                                    const membreActual = assignacio
                                        ? members.find(m => m.id_usuari === assignacio.id_usuari)
                                        : null;

                                    if (membreActual) {
                                        console.log();
                                        console.log(userId);
                                    }

                                    return (
                                        <div
                                            key={posicio.id}
                                            className={`bloc-posicio-prova ${userId === assignacio?.id_usuari ? "selected-bloc-member" : ""}`}
                                            style={{
                                                position: "absolute",
                                                left: `${(posicio.coord_x - section.minX) * SCALE + section.offsetX}px`,
                                                top: `${(posicio.coord_y - section.minY) * SCALE}px`,
                                                backgroundColor: posicio.color,
                                                transform: `rotate(${posicio.rotacio}deg)`,
                                            }}
                                        >
                                            {membreActual?.mote}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default ShowBoard;