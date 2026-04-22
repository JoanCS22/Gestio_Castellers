const pool = require('../db');

const toDateOrNull = (value) => {
    if (!value || value === "") return null;
    return value;
};

const createColla = async (req, res) => {
    const client = await pool.connect();

    try {
        const { nom, abreviacio, telefon, correus_contacte, data_creacio, adreca, poblacio } = req.body;

        const dataCreacio = toDateOrNull(data_creacio);
        const userId = req.user.id;

        await client.query("BEGIN");

        const exists = await client.query(
            'SELECT id FROM colles WHERE nom = $1',
            [nom]
        );

        if (exists.rows.length > 0) {
            await client.query("ROLLBACK");
            return res.status(400).json({ message: 'El nom de la colla ja existeix.' });
        }

        const resultColla = await client.query(
            `INSERT INTO colles (nom, abreviacio, telefon, correus_contacte, data_creacio, adreca, poblacio)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [nom, abreviacio, telefon, correus_contacte, dataCreacio, adreca, poblacio]
        );

        const idColla = resultColla.rows[0].id;

        await client.query(
            `INSERT INTO membres_colla (id_usuari, id_colla, id_rol, actiu, data_acces)
             VALUES ($1, $2, $3, $4, NOW())`,
            [userId, idColla, 1, true]
        );

        await client.query("COMMIT");

        res.status(200).json(resultColla.rows[0]);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        if (error.code === '23505') {
            return res.status(400).json({ message: 'El nom ja existeix' });
        }

        res.status(500).json({ message: 'Error al crear la colla' });

    } finally {
        client.release();
    }
};

const getCollesUser = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT c.id, c.nom FROM colles c, membres_colla m WHERE m.id_usuari = $1 AND m.id_colla = c.id`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: `No s'han trobat colles per l'usuari` });
        }

        res.status(200).json(result.rows);

    } catch (error) {

        console.error(error);
        res.status(500).json({ message: `Error al buscar colles de l'usuari` });
    }
};

module.exports = { createColla, getCollesUser };