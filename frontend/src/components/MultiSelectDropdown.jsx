import { useState, useRef, useEffect } from "react";
import './MultiSelectDropdown.css';

function MultiSelectDropdown({ options, selected, setSelected, placeholder }) {
    const [open, setOpen] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleValue = (value) => {
        if (selected.includes(value)) {
            setSelected(selected.filter(v => v !== value));
        } else {
            setSelected([...selected, value]);
        }
    };

    return (
        <div className="multi-dropdown" ref={ref}>
            <div
                className="multi-dropdown-header"
                onClick={() => setOpen(!open)}
            >
                {selected.length > 0
                    ? `${selected.length} seleccionats`
                    : placeholder}
            </div>

            {open && (
                <div className="multi-dropdown-list">
                    {options.map(opt => (
                        <label key={opt.id} className="multi-dropdown-item">
                            <input
                                type="checkbox"
                                checked={selected.includes(opt.id)}
                                onChange={() => toggleValue(String(opt.id))}
                            />
                            {opt.nom}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MultiSelectDropdown;