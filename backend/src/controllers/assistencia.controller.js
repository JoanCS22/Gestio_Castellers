const pool = require('../db');

const getAssistenciaList = async (req, res) => {
    const client = await pool.connect();

    try {
        const id_esdeveniment = req.query.id;

        await client.query("BEGIN");

        const result = await client.query(
            `SELECT a.*, e.acompanyat as boolCompanyia, e.bus as boolBus, m.mote
             FROM assistencia a
             JOIN esdeveniments e ON a.id_esdeveniment = e.id
             JOIN membres_colla m ON m.id_usuari = a.id_usuari
             WHERE a.id_esdeveniment = $1
             ORDER BY m.mote ASC`,
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
        const id_esdeveniment = req.query.id;
        const id_user = req.user.id;

        await client.query("BEGIN");

        const result = await client.query(
            `SELECT *
             FROM assistencia a 
             WHERE id_usuari = $1 AND id_esdeveniment = $2`,
            [id_user, id_esdeveniment]
        );

        await client.query("COMMIT");

        res.status(200).json(result.rows[0]);

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
        const { confirmacio_previa, bus, num_acompanyants, arriba_tard, marxa_aviat, 
            comentari, temps_tard, temps_aviat } = req.body;

        const id_assistencia = req.query.id;

        await client.query("BEGIN");

        const result = await client.query(
            `UPDATE assistencia
             SET confirmacio_previa = $2, bus = $3, num_acompanyants = $4, arriba_tard = $5, marxa_aviat = $6, 
             comentari = $7, temps_tard = $8, temps_aviat=$9, data_actualitzacio = NOW()
             WHERE id = $1`,
            [id_assistencia, confirmacio_previa, bus, num_acompanyants, arriba_tard, 
                marxa_aviat, comentari, temps_tard, temps_aviat]
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