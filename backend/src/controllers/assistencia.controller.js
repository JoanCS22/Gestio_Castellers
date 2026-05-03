const pool = require('../db');

const getAssistenciaList = async (req, res) => {
    const client = await pool.connect();

    try {
        const id_esdeveniment = req.query.id;

        await client.query("BEGIN");

        const result = await client.query(
            `SELECT a.*, r.acompanyat as boolCompanyia, r.bus as boolBus
             FROM assistencia a, esdeveniments e
             WHERE a.id = $1
             AND a.id_esdeveniment = e.id
             ORDER BY nom ASC`,
            [id_esdeveniment]
        );

        await client.query("COMMIT");

        res.status(200).json(result.rows);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        res.status(500).json({ message: "Error al rebre dades {assistenciaList}" });

    } finally {
        client.release();
    }
}

const getAssistenciaByMember = async (req, res) => {
    const client = await pool.connect();

    try {
        const id_assistencia = req.query.id;

        await client.query("BEGIN");

        const result = await client.query(
            `SELECT *
             FROM assistencia a 
             WHERE id_assistencia = $1
             ORDER BY nom ASC`,
            [id_assistencia]
        );

        await client.query("COMMIT");

        res.status(200).json(result.rows);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        res.status(500).json({ message: "Error al rebre dades {assistenciaList}" });

    } finally {
        client.release();
    }
}

const modifyAssistenciaPrevia = async (req, res) => {
    const client = await pool.connect();

    try {
        const { confirmacio_previa, bus, num_acompanyants, arriba_tard, marxa_aviat, comentari } = req.body;

        const id_assistencia = req.query.id;

        await client.query("BEGIN");

        const result = await client.query(
            `UPDATE assistencia
             SET confirmacio_previa = $2, bus = $3, num_acompanyants = $4, arriba_tard = $5, marxa_aviat = $6, 
             comentari = $7, data_actualitzacio = NOW()
             WHERE id = $1`,
            [id_assistencia, confirmacio_previa, bus, num_acompanyants, arriba_tard, marxa_aviat, comentari]
        );

        await client.query("COMMIT");

        res.status(200).json(result.rows);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        res.status(500).json({ message: "Error al rebre dades {modifyAssistenciaPrevia}" });

    } finally {
        client.release();
    }
}

const modifyAssistenciaPreviaTecnica = async (req, res) => {
    const client = await pool.connect();

    try {
        const { confirmacio_previa } = req.body;

        const id_assistencia = req.query.id;

        await client.query("BEGIN");

        const result = await client.query(
            `UPDATE assistencia
             SET confirmacio_previa = $2, data_actualitzacio = NOW()
             WHERE id = $1`,
            [id_assistencia, confirmacio_previa]
        );

        await client.query("COMMIT");

        res.status(200).json(result.rows);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        res.status(500).json({ message: "Error al rebre dades {modifyAssistenciaTecnica}" });

    } finally {
        client.release();
    }
}

const confirmAssistencia = async (req, res) => {
    const client = await pool.connect();

    try {
        const { confirmacio_arribada } = req.body;

        const id_assistencia = req.query.id;

        await client.query("BEGIN");

        const result = await client.query(
            `UPDATE assistencia
             SET confirmacio_arribada = $2, data_actualitzacio = NOW()
             WHERE id = $1`,
            [id_assistencia, confirmacio_arribada]
        );

        await client.query("COMMIT");

        res.status(200).json(result.rows);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        res.status(500).json({ message: "Error al rebre dades {confirmAssistencia}" });

    } finally {
        client.release();
    }
}

module.exports = {
    getAssistenciaList, getAssistenciaByMember,
    modifyAssistenciaPrevia, modifyAssistenciaPreviaTecnica,
    confirmAssistencia
};