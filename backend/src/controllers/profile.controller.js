const pool = require('../db');

const toIntOrNull = (value) => {
    if (value === "" || value === null || value === undefined) return null;

    const num = parseInt(value);
    return Number.isInteger(num) ? num : null;
};

const toDateOrNull = (value) => {
    if (!value || value === "") return null;
    return value;
};

const getUserData = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT * FROM usuaris WHERE id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuari no trobat' });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {

        console.error(error);
        res.status(500).json({ message: 'Error al rebre les dades' });
    }
};

const modifyUserData = async (req, res) => {
    try {
        const userId = req.user.id;

        const { nom, cognoms, mote, telefon, altura_espatlles, envergadura, pes,
            altura_total, data_lesio, comentari, lesionat, genere, canalla } = req.body;

        const alturaEsp = toIntOrNull(altura_espatlles);
        const enverg = toIntOrNull(envergadura);
        const pesInt = toIntOrNull(pes);
        const alturaTot = toIntOrNull(altura_total);

        const dataLesio = toDateOrNull(data_lesio);

        const isValidNumber = (n) => Number.isInteger(n) && n > 0;

        if (
            (alturaEsp !== null && !isValidNumber(alturaEsp)) ||
            (enverg !== null && !isValidNumber(enverg)) ||
            (pesInt !== null && !isValidNumber(pesInt)) ||
            (alturaTot !== null && !isValidNumber(alturaTot))
        ) {
            return res.status(400).json({
                message: "Els camps numèrics han de ser enters positius"
            });
        }

        const result = await pool.query(
            `UPDATE usuaris 
            SET nom = $2, cognoms = $3, mote = $4, telefon = $5, altura_espatlles = $6, envergadura = $7, pes = $8, 
            altura_total = $9, data_lesio = $10, comentari = $11, lesionat = $12, genere = $13, canalla = $14 
            WHERE id = $1
            RETURNING *`,
            [userId, nom, cognoms, mote, telefon || null, alturaEsp, enverg, pesInt,
                alturaTot, dataLesio, comentari || null, lesionat, genere, canalla]
        );

        res.status(200).json(result.rows[0]);

    } catch (error) {

        console.error(error);
        res.status(500).json({ message: 'Error al modificar les dades' });
    }
};

module.exports = { getUserData, modifyUserData };