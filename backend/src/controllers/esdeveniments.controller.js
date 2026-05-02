const pool = require('../db');

const toDateOrNull = (value) => {
    if (!value || value === "") return null;
    return value;
};

const createEsdeveniment = async (req, res) => {
    const client = await pool.connect();

    try {
        const { nom, tipus, data_esdeveniment, hora, duracio, adreca,
            link_adreca, visible, acompanyat, bus, data_inici_inscripcions,
            info_addicional, codi_confirmacio } = req.body;

        const collaActiva = req.query.id;

        await client.query("BEGIN");

        const resultEsdeveniment = await client.query(
            `INSERT INTO esdeveniments (id_colla, nom, tipus, data_esdeveniment, hora, duracio, 
             adreca, link_adreca, visible, acompanyat, bus, data_inici_inscripcions, 
             info_addicional, codi_confirmacio, data_creacio, data_actualitzacio)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW())
             RETURNING *`,
            [collaActiva, nom, tipus, data_esdeveniment, hora, duracio, adreca,
                link_adreca, visible, acompanyat, bus, data_inici_inscripcions,
                info_addicional, codi_confirmacio]
        );

        const idEsdeveniment = resultEsdeveniment.rows[0].id;

        await client.query(
            `INSERT INTO assistencia (id_esdeveniment, id_usuari, confirmacio_previa, confirmacio_arribada, comentari)
             SELECT $1, id_usuari, 'pendent', 'pendent', ''
             FROM membres_colla
             WHERE id_colla = $2`,
            [idEsdeveniment, collaActiva]
        );

        await client.query("COMMIT");

        res.status(200).json(resultEsdeveniment.rows[0]);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        res.status(500).json({ message: "Error al crear l'esdeveniment" });

    } finally {
        client.release();
    }
};

const getEsdevenimentInfo = async (req, res) => {
    const client = await pool.connect();

    try {
        const id_esdeveniment = req.query.id;

        await client.query("BEGIN");

        const result = await client.query(
            `SELECT * 
             FROM esdeveniments 
             WHERE id = $1`,
            [id_esdeveniment]
        );

        await client.query("COMMIT");

        res.status(200).json(result.rows[0]);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        res.status(500).json({ message: "Error al rebre dades {esdevenimentsInfo}" });

    } finally {
        client.release();
    }
};

const modifyEsdeveniment = async (req, res) => {
    const client = await pool.connect();

    try {
        const { nom, tipus, data_esdeveniment, hora, duracio, adreca,
            link_adreca, visible, acompanyat, bus, data_inici_inscripcions,
            info_addicional } = req.body;

        const id_esdeveniment = req.query.id;

        await client.query("BEGIN");

        const result = await client.query(
            `UPDATE esdeveniments
             SET nom = $2, tipus = $3, data_esdeveniment = $4, hora = $5, duracio = $6, 
             adreca = $7, link_adreca = $8, visible = $9, acompanyat = $10, bus = $11, data_inici_inscripcions = $12, 
             info_addicional = $13, data_actualitzacio = NOW()
             WHERE id = $1
             RETURNING *`,
            [id_esdeveniment, nom, tipus, data_esdeveniment, hora, duracio, adreca,
                link_adreca, visible, acompanyat, bus, data_inici_inscripcions, info_addicional]
        );

        await client.query("COMMIT");

        res.status(200).json(result.rows[0]);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        res.status(500).json({ message: "Error al modificar l'esdeveniment" });

    } finally {
        client.release();
    }
};

const getFutureEsdeveniments = async (req, res) => {
    const client = await pool.connect();

    try {
        const id_colla = req.query.id;

        await client.query("BEGIN");

        const result = await client.query(
            `SELECT id, nom, tipus, data_esdeveniment, hora, visible
             FROM esdeveniments 
             WHERE id_colla = $1 
             AND (data_esdeveniment + hora) > NOW()
             ORDER BY (data_esdeveniment + hora) ASC`,
            [id_colla]
        );

        await client.query("COMMIT");

        res.status(200).json(result.rows);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        res.status(500).json({ message: "Error al rebre dades {esdevenimentsInfo}" });

    } finally {
        client.release();
    }
};

const getPastEsdeveniments = async (req, res) => {
    const client = await pool.connect();

    try {
        const id_colla = req.query.id;

        await client.query("BEGIN");

        const result = await client.query(
            `SELECT id, nom, tipus, data_esdeveniment, hora, visible
             FROM esdeveniments 
             WHERE id_colla = $1 
             AND (data_esdeveniment + hora) < NOW()
             ORDER BY (data_esdeveniment + hora) DESC`,
            [id_colla]
        );

        await client.query("COMMIT");

        res.status(200).json(result.rows);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        res.status(500).json({ message: "Error al rebre dades {esdevenimentsInfo}" });

    } finally {
        client.release();
    }
};

module.exports = {
    createEsdeveniment, getEsdevenimentInfo, modifyEsdeveniment,
    getFutureEsdeveniments, getPastEsdeveniments
};