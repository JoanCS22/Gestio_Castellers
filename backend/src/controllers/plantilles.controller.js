const pool = require('../db');

const getPlantillesByColla = async (req, res) => {
    const client = await pool.connect();

    try {
        const id_colla = req.query.id;

        await client.query("BEGIN");

        const result = await client.query(
            `SELECT *
             FROM plantilles 
             WHERE id_colla = $1`,
            [id_colla]
        );

        await client.query("COMMIT");

        res.status(200).json(result.rows);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        res.status(500).json({ message: "Error al rebre dades {getPlantillesByColla}" });

    } finally {
        client.release();
    }
};

const getEstructuresByColla = async (req, res) => {
    const client = await pool.connect();

    try {
        const id_colla = req.query.id;

        await client.query("BEGIN");

        const result = await client.query(
            `SELECT DISTINCT estructura
             FROM plantilles 
             WHERE id_colla = $1`,
            [id_colla]
        );

        await client.query("COMMIT");

        res.status(200).json(result.rows);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        res.status(500).json({ message: "Error al rebre dades {getEstructuresByColla}" });

    } finally {
        client.release();
    }
};

const createPlantilla = async (req, res) => {
    const client = await pool.connect();

    try {
        const { nom, descripcio, estructura } = req.body;

        const collaActiva = req.query.id;

        await client.query("BEGIN");

        const result = await client.query(
            `INSERT INTO plantilles (id_colla, nom, descripcio, estructura)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [collaActiva, nom, descripcio, estructura]
        );

        await client.query("COMMIT");

        res.status(200).json(result.rows[0]);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        res.status(500).json({ message: "Error al crear plantilla" });

    } finally {
        client.release();
    }
};

const modifyInfoPlantilla = async (req, res) => {

};

const getPositionsByPlantilla = async (req, res) => {
    const client = await pool.connect();

    try {
        const id_plantilla = req.query.id;

        await client.query("BEGIN");

        const result = await client.query(
            `SELECT *
             FROM posicions_plantilla 
             WHERE id_plantilla = $1`,
            [id_plantilla]
        );

        await client.query("COMMIT");

        res.status(200).json(result.rows);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        res.status(500).json({ message: "Error al rebre dades {getPositionsByPlantilla}" });

    } finally {
        client.release();
    }
};

const addPositionToPlantilla = async (req, res) => {
    const client = await pool.connect();

    try {
        const { nom, color, coord_x, coord_y, rotacio, seccio } = req.body;

        const idPlantilla = req.query.id;

        await client.query("BEGIN");

        const result = await client.query(
            `INSERT INTO posicions_plantilla (id_plantilla, nom, color, coord_x, coord_y, rotacio, seccio)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [idPlantilla, nom, color, coord_x, coord_y, rotacio, seccio]
        );

        await client.query("COMMIT");

        res.status(200).json(result.rows[0]);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        res.status(500).json({ message: "Error al crear plantilla" });

    } finally {
        client.release();
    }
};

const deletePositionsFromPlantilla = async (req, res) => {
    const client = await pool.connect();

    try {
        const idPosicioPlantilla = req.query.id;

        await client.query("BEGIN");

        const result = await client.query(
            `DELETE FROM posicions_plantilla 
             WHERE id = $1
             RETURNING *`,
            [idPosicioPlantilla]
        );

        await client.query("COMMIT");

        res.status(200).json(result.rows[0]);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        res.status(500).json({ message: "Error al crear plantilla" });

    } finally {
        client.release();
    }
};

const modifyPositionsFromPlantilla = async (req, res) => {
    const client = await pool.connect();

    try {
        const { nom, color, coord_x, coord_y, rotacio, seccio } = req.body;

        const idPlantilla = req.query.id;

        await client.query("BEGIN");

        const result = await client.query(
            `UPDATE posicions_plantilla 
             SET color = $2, coord_x = $3, coord_y = $4, rotacio = $5
             WHERE id_plantilla = $1
             RETURNING *`,
            [idPlantilla, color, coord_x, coord_y, rotacio]
        );

        await client.query("COMMIT");

        res.status(200).json(result.rows[0]);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        res.status(500).json({ message: "Error al crear plantilla" });

    } finally {
        client.release();
    }
};

module.exports = {
    getPlantillesByColla, getEstructuresByColla,
    createPlantilla, modifyInfoPlantilla,
    getPositionsByPlantilla, addPositionToPlantilla, deletePositionsFromPlantilla, modifyPositionsFromPlantilla
};