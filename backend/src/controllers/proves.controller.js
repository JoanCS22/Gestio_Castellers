const pool = require('../db');

const getProvesByEsdeveniment = async (req, res) => {
    const client = await pool.connect();

    try {
        const id_esdeveniment = req.query.id;

        await client.query("BEGIN");

        const result = await client.query(
            `SELECT *
             FROM proves 
             WHERE id_esdeveniment = $1
             ORDER BY favorita DESC`,
            [id_esdeveniment]
        );

        await client.query("COMMIT");

        res.status(200).json(result.rows);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        res.status(500).json({ message: "Error al rebre dades {getProvesByEsdeveniment}" });

    } finally {
        client.release();
    }
}

const getProvaById = async (req, res) => {
    const client = await pool.connect();

    try {
        const id_prova = req.query.id;

        await client.query("BEGIN");

        const result = await client.query(
            `SELECT *
             FROM proves 
             WHERE id = $1`,
            [id_prova]
        );

        await client.query("COMMIT");

        res.status(200).json(result.rows);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        res.status(500).json({ message: "Error al rebre dades {getProvaById}" });

    } finally {
        client.release();
    }
}

const createProva = async (req, res) => {
    const client = await pool.connect();

    try {
        const { nom, comentari, public, xarxa, estructura, id_plantilla } = req.body;

        const id_esdeveniment = req.query.id;

        await client.query("BEGIN");

        const ordre = await client.query(
            `SELECT ordre
             FROM proves 
             WHERE id_esdeveniment = $1`,
            [id_esdeveniment]
        );

        const ordreFinal = ordre.rows[0]?.ordre || 1;

        const result = await client.query(
            `INSERT INTO proves (id_esdeveniment, nom, comentari, public, xarxa, estructura, id_plantilla, ordre)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [id_esdeveniment, nom, comentari, public, xarxa, estructura, id_plantilla, ordreFinal]
        );

        await client.query("COMMIT");

        res.status(200).json(result.rows[0]);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        res.status(500).json({ message: "Error al crear prova" });

    } finally {
        client.release();
    }
}

const modifyInfoProva = async (req, res) => {
    const client = await pool.connect();

    try {
        const { nom, comentari, public, xarxa, estructura, id_plantilla, ordre, indicacions, favorita } = req.body;

        const idProva = req.query.id;
        const action = req.query.action;

        await client.query("BEGIN");

        let result;

        if (action === "favorite") {
            result = await client.query(
                `UPDATE proves 
                 SET favorita = $2
                 WHERE id = $1
                 RETURNING *`,
                [idProva, favorita]
            );
        } else if (action === "ordre") {
            result = await client.query(
                `UPDATE proves 
                 SET ordre = $2
                 WHERE id = $1
                 RETURNING *`,
                [idProva, ordre]
            );
        } else {
            result = await client.query(
                `UPDATE proves 
                 SET nom, comentari, public, xarxa, estructura, id_plantilla, indicacions, data_actualització = NOW()
                 WHERE id = $1
                 RETURNING *`,
                [idProva, nom, comentari, public, xarxa, estructura, id_plantilla, indicacions]
            );
        }

        await client.query("COMMIT");

        res.status(200).json(result.rows[0]);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        res.status(500).json({ message: "Error al modificar prova" });

    } finally {
        client.release();
    }
}

const deleteProva = async (req, res) => {
    const client = await pool.connect();

    try {
        const idProva = req.query.id;

        await client.query("BEGIN");

        const result = await client.query(
            `DELETE FROM proves 
             WHERE id = $1
             RETURNING *`,
            [idProva]
        );

        await client.query("COMMIT");

        res.status(200).json(result.rows[0]);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        res.status(500).json({ message: "Error a l'eliminar prova" });

    } finally {
        client.release();
    }
}

module.exports = {
    getProvesByEsdeveniment, getProvaById,
    createProva, modifyInfoProva, deleteProva
};