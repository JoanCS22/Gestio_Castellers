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

        const resultEsdeveniment = await client.query(
            `INSERT INTO plantilles (id_colla, nom, descripcio, estructura)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [collaActiva, nom, descripcio, estructura]
        );

        await client.query("COMMIT");

        res.status(200).json(resultEsdeveniment.rows[0]);

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

const addPositionToPlantilla = async (req, res) => {

};

module.exports = {
    getPlantillesByColla, getEstructuresByColla,
    createPlantilla, modifyInfoPlantilla,
    addPositionToPlantilla
};