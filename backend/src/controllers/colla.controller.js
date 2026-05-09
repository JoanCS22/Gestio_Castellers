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

        res.status(200).json(result.rows);

    } catch (error) {

        console.error(error);
        res.status(500).json({ message: `Error al buscar colles de l'usuari` });
    }
};

const getDataColla = async (req, res) => {
    try {
        const collaActiva = req.query.id;

        const result = await pool.query(
            `SELECT * FROM colles WHERE id = $1`,
            [collaActiva]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Colla no trobada' });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {

        console.error(error);
        res.status(500).json({ message: 'Error al rebre les dades {getDataColla}' });
    }
};

const modifyColla = async (req, res) => {
    const client = await pool.connect();

    try {
        const collaActiva = req.query.id;

        const { nom, abreviacio, telefon, correus_contacte, data_creacio, adreca, poblacio } = req.body;

        const dataCreacio = toDateOrNull(data_creacio);

        await client.query("BEGIN");

        const result = await client.query(
            `UPDATE colles 
            SET nom = $2, abreviacio = $3, telefon = $4, correus_contacte = $5, data_creacio = $6, adreca = $7, poblacio = $8
            WHERE id = $1
            RETURNING *`,
            [collaActiva, nom, abreviacio, telefon, correus_contacte, dataCreacio, adreca, poblacio]
        );

        await client.query("COMMIT");

        res.status(200).json(result.rows[0]);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        res.status(500).json({ message: 'Error al modificar la colla' });

    } finally {
        client.release();
    }
};

const getCollaPositions = async (req, res) => {
    try {
        const collaActiva = req.query.id;

        const result = await pool.query(
            `SELECT * 
             FROM posicions 
             WHERE id_colla = $1
             ORDER BY nom`,
            [collaActiva]
        );

        if (result.rows == 0) {
            console.log('{INFO} No positions exist for this colla')
        }

        res.status(200).json(result.rows);

    } catch (error) {

        console.error(error);
        res.status(500).json({ message: 'Error al rebre les dades {getCollaPositions}' });
    }
};

const createCollaPosition = async (req, res) => {
    const client = await pool.connect();

    try {
        const { nom, descripcio, color } = req.body;

        const collaActiva = req.query.id;

        await client.query("BEGIN");

        const exists = await client.query(
            'SELECT id FROM posicions WHERE id_colla = $1 AND nom = $2',
            [collaActiva, nom]
        );

        if (exists.rows.length > 0) {
            await client.query("ROLLBACK");
            return res.status(400).json({ message: 'El nom de la posició ja existeix.' });
        }

        const resultPosicio = await client.query(
            `INSERT INTO posicions (nom, descripcio, id_colla, color)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [nom, descripcio, collaActiva, color]
        );

        await client.query("COMMIT");

        res.status(200).json(resultPosicio.rows[0]);

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

const updateCollaPositions = async (req, res) => {
    const client = await pool.connect();

    try {
        const id_posicio = req.query.id;

        const { descripcio, color } = req.body;

        await client.query("BEGIN");

        const result = await client.query(
            `UPDATE posicions 
            SET descripcio = $2, color = $3
            WHERE id = $1
            RETURNING *`,
            [id_posicio, descripcio, color]
        );

        await client.query("COMMIT");

        res.status(200).json(result.rows[0]);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        res.status(500).json({ message: 'Error al modificar la posició' });

    } finally {
        client.release();
    }
};

const deleteCollaPositions = async (req, res) => {
    const client = await pool.connect();

    try {
        const id_posicio = req.query.id;

        await client.query("BEGIN");

        const result = await client.query(
            `DELETE FROM posicions 
            WHERE id = $1
            RETURNING *`,
            [id_posicio]
        );

        await client.query("COMMIT");

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Posició no trobada" });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        res.status(500).json({ message: `Error a l'eliminar la posició` });

    } finally {
        client.release();
    }
};

const getCollaRoles = async (req, res) => {
    try {
        const collaActiva = req.query.id;

        const result = await pool.query(
            `SELECT * FROM rols WHERE (id_colla = $1 OR nom in ('Administrador', 'Membre'))`,
            [collaActiva]
        );

        if (result.rows == 0) {
            console.log('{INFO} No roles exist for this colla')
        }

        res.status(200).json(result.rows);

    } catch (error) {

        console.error(error);
        res.status(500).json({ message: 'Error al rebre les dades {getCollaRoles}' });
    }
};

const createCollaRoles = async (req, res) => {
    const client = await pool.connect();

    try {
        const { nom, descripcio, permisos } = req.body;

        const collaActiva = req.query.id;

        await client.query("BEGIN");

        const exists = await client.query(
            'SELECT id FROM rols WHERE id_colla = $1 AND nom = $2',
            [collaActiva, nom]
        );

        if (exists.rows.length > 0) {
            await client.query("ROLLBACK");
            return res.status(400).json({ message: 'El nom del rol ja existeix.' });
        }

        const resultRol = await client.query(
            `INSERT INTO rols (nom, descripcio, permisos, id_colla)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [nom, descripcio, permisos, collaActiva]
        );

        await client.query("COMMIT");

        res.status(200).json(resultRol.rows[0]);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        if (error.code === '23505') {
            return res.status(400).json({ message: 'El nom ja existeix' });
        }

        res.status(500).json({ message: 'Error al crear el rol' });

    } finally {
        client.release();
    }
};

const updateCollaRoles = async (req, res) => {
    const client = await pool.connect();

    try {
        const id_rol = req.query.id;

        const { descripcio, permisos } = req.body;

        await client.query("BEGIN");

        const result = await client.query(
            `UPDATE rols 
            SET descripcio = $2, permisos = $3
            WHERE id = $1
            RETURNING *`,
            [id_rol, descripcio, permisos]
        );

        await client.query("COMMIT");

        res.status(200).json(result.rows[0]);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        res.status(500).json({ message: 'Error al modificar el rol' });

    } finally {
        client.release();
    }
};

const deleteCollaRole = async (req, res) => {
    const client = await pool.connect();

    try {
        const id_rol = req.query.id;

        await client.query("BEGIN");

        const result = await client.query(
            `DELETE FROM rols 
            WHERE id = $1
            RETURNING *`,
            [id_rol]
        );

        await client.query("COMMIT");

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Rol no trobat" });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        res.status(500).json({ message: `Error a l'eliminar el rol` });

    } finally {
        client.release();
    }
};

module.exports = {
    createColla, getCollesUser, getDataColla, modifyColla,
    getCollaPositions, updateCollaPositions, deleteCollaPositions, createCollaPosition,
    getCollaRoles, createCollaRoles, updateCollaRoles, deleteCollaRole
};