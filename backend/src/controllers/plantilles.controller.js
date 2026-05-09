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
    const client = await pool.connect();

    try {
        const { descripcio, estructura, favorita } = req.body;

        const idPlantilla = req.query.id;
        const action = req.query.action;

        await client.query("BEGIN");

        let result;

        if (action === "favorite") {
            result = await client.query(
                `UPDATE plantilles 
                 SET favorita = $2
                 WHERE id = $1
                 RETURNING *`,
                [idPlantilla, favorita]
            );
        } else {
            result = await client.query(
                `UPDATE plantilles 
                 SET descripcio = $2, estructura = $3
                 WHERE id = $1
                 RETURNING *`,
                [idPlantilla, descripcio, estructura]
            );
        }

        await client.query("COMMIT");

        res.status(200).json(result.rows[0]);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        res.status(500).json({ message: "Error al modificar plantilla" });

    } finally {
        client.release();
    }
};

const deletePlantilla = async (req, res) => {
    const client = await pool.connect();

    try {
        const idPlantilla = req.query.id;

        await client.query("BEGIN");

        const result = await client.query(
            `DELETE FROM plantilles 
             WHERE id = $1
             RETURNING *`,
            [idPlantilla]
        );

        await client.query("COMMIT");

        res.status(200).json(result.rows[0]);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        res.status(500).json({ message: "Error a l'eliminar plantilla" });

    } finally {
        client.release();
    }
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

        const createdPosition = result.rows[0];

        if (nom === "Baix") {
            const oppositeSection = seccio === "pinya" ? "tronc" : "pinya";

            const relatedResult = await client.query(
                `INSERT INTO posicions_plantilla
                 (id_plantilla, nom, color, coord_x, coord_y, rotacio, seccio, posicio_relacio)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                 RETURNING *`,
                [idPlantilla, nom, color, coord_x, coord_y, rotacio, oppositeSection, createdPosition.id]
            );

            const relatedPosition = relatedResult.rows[0];

            await client.query(
                `UPDATE posicions_plantilla
                 SET posicio_relacio = $2
                 WHERE id = $1`,
                [createdPosition.id, relatedPosition.id]
            );

            createdPosition.posicio_relacio = relatedPosition.id;
        }

        await client.query("COMMIT");

        res.status(200).json(createdPosition);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        res.status(500).json({ message: "Error al crear posicions de plantilla" });

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

        if (result.rowCount === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ message: "No existeix la posició" });
        }

        await client.query("COMMIT");

        res.status(200).json(result.rows[0]);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        res.status(500).json({ message: "Error a l'eliminar posició plantilla" });

    } finally {
        client.release();
    }
};

const modifyPositionsFromPlantilla = async (req, res) => {
    const client = await pool.connect();

    try {
        const { color, coord_x, coord_y, rotacio } = req.body;

        const idPosicio = req.query.id;

        await client.query("BEGIN");

        const result = await client.query(
            `UPDATE posicions_plantilla 
             SET color = $2, coord_x = $3, coord_y = $4, rotacio = $5
             WHERE id = $1
             RETURNING *`,
            [idPosicio, color, coord_x, coord_y, rotacio]
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
    createPlantilla, modifyInfoPlantilla, deletePlantilla,
    getPositionsByPlantilla, addPositionToPlantilla, deletePositionsFromPlantilla, modifyPositionsFromPlantilla
};