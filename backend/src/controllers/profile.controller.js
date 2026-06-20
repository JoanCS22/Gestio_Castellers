const pool = require('../db');
const bcrypt = require('bcrypt');

const toIntOrNull = (value) => {
    if (value === "" || value === null || value === undefined) return null;

    const num = parseInt(value);
    return Number.isInteger(num) ? num : null;
};

const toDateOrNull = (value) => {
    if (!value || value === "") return null;
    return value;
};

const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>_-]/.test(password);

    return minLength && hasLetter && hasNumber && hasSpecial;
};

const getUserData = async (req, res) => {
    const client = await pool.connect();
    try {
        const requestedUserId = req.query.userId;
        const loggedUserId = req.user.id;   
        const userId = !requestedUserId || requestedUserId === "null" ? loggedUserId : requestedUserId;
        const collaId = req.query.collaId || null;

        const result = await client.query(
            `SELECT u.*, mc.mote
             FROM usuaris u
             LEFT JOIN membres_colla mc 
                ON mc.id_usuari = u.id 
                AND mc.id_colla = $2
             WHERE u.id = $1`,
            [userId, collaId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuari no trobat' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al rebre les dades' });
    } finally {
        client.release();
    }
};

const modifyUserData = async (req, res) => {
    const client = await pool.connect();
    try {
        const requestedUserId = req.query.userId;
        const loggedUserId = req.user.id;
        const userId = requestedUserId || loggedUserId;

        const collaId = req.query.collaId || null;

        const { nom, cognoms, telefon, altura_espatlles, envergadura, pes,
            altura_total, data_lesio, comentari, lesionat, genere, canalla, mote } = req.body;

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

        await client.query("BEGIN");

        const result = await client.query(
            `UPDATE usuaris 
            SET nom = $2, cognoms = $3, telefon = $4, altura_espatlles = $5, envergadura = $6, pes = $7, 
            altura_total = $8, data_lesio = $9, comentari = $10, lesionat = $11, genere = $12, canalla = $13 
            WHERE id = $1
            RETURNING *`,
            [userId, nom, cognoms, telefon || null, alturaEsp, enverg, pesInt,
                alturaTot, dataLesio, comentari || null, lesionat, genere, canalla]
        );

        if (collaId && mote !== undefined) {
            await client.query(
                `UPDATE membres_colla SET mote=$3
                 WHERE id_usuari=$1 AND id_colla=$2`,
                [userId, collaId, mote]
            );
        }

        await client.query("COMMIT");
        res.status(200).json(result.rows[0]);

    } catch (error) {

        console.error(error);
        res.status(500).json({ message: 'Error al modificar les dades' });
    } finally {
        client.release();
    }
};

const changePassword = async (req, res) => {
    const client = await pool.connect();
    try {
        const { id_usuari, contrasenya } = req.body;

        if (!validatePassword(contrasenya)) {
            return res.status(400).json({
                message: "Contrasenya no segura (mínim 8 caràcters, una lletra, un número i un símbol)"
            });
        }

        const hashedPassword = await bcrypt.hash(contrasenya, 10);

        await client.query("BEGIN");

        const result = await client.query(
            `UPDATE usuaris SET contrasenya = $2 WHERE id = $1 RETURNING *`,
            [id_usuari, hashedPassword]
        );

        await client.query("COMMIT");
        res.status(200).json(result.rows[0]);
    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        res.status(500).json({ message: 'Error al modificar la contrasenya' });
    } finally {
        client.release();
    }
};

module.exports = { getUserData, modifyUserData, changePassword };