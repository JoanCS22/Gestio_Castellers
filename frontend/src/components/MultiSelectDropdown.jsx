import { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import './MultiSelectDropdown.css';

function MultiSelectDropdown({ options, selected, setSelected, placeholder = "Selecciona..." }) {
    const [open, setOpen] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleValue = (id) => {
        const strId = String(id);
        setSelected(selected.includes(strId)
            ? selected.filter(v => v !== strId)
            : [...selected, strId]
        );
    };

    const selectedCount = selected.length;

    return (
        <div className="multi-dropdown" ref={ref}>

            <div
                className={`multi-dropdown-header ${open ? "multi-dropdown-header--open" : ""}`}
                onClick={() => setOpen(prev => !prev)}
            >
                {selectedCount > 0 && (
                    <span className="multi-dropdown-badge">{selectedCount}</span>
                )}
                <span className={`multi-dropdown-header-text ${selectedCount === 0 ? "multi-dropdown-header-text--placeholder" : ""}`}>
                    {selectedCount > 0 ? `${selectedCount} seleccionats` : placeholder}
                </span>
                <FaChevronDown className={`multi-dropdown-chevron ${open ? "multi-dropdown-chevron--open" : ""}`} />
            </div>

            {open && (
                <div className="multi-dropdown-list">
                    {options.length === 0 ? (
                        <div className="multi-dropdown-empty">Cap opció disponible</div>
                    ) : (
                        options.map(opt => {
                            const isSelected = selected.includes(String(opt.id));
                            return (
                                <label
                                    key={opt.id}
                                    className={`multi-dropdown-item ${isSelected ? "multi-dropdown-item--selected" : ""}`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => toggleValue(opt.id)}
                                    />
                                    {opt.nom}
                                </label>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}

export default MultiSelectDropdown;