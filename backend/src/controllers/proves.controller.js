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
             ORDER BY ordre ASC`,
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

        res.status(200).json(result.rows[0]);

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

        const ordreFinal = ordre.rows[0]?.ordre + 1 || 1;

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
        const { nom, comentari, public, xarxa, estructura, id_plantilla } = req.body;

        const idProva = req.query.id;

        await client.query("BEGIN");

        const result = await client.query(
            `UPDATE proves 
             SET nom = $2, comentari = $3, public = $4, xarxa = $5, estructura = $6, 
             id_plantilla = $7, data_actualitzacio = NOW()
             WHERE id = $1
             RETURNING *`,
            [idProva, nom, comentari, public, xarxa, estructura, id_plantilla]
        );

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

const publishProva = async (req, res) => {

    const client = await pool.connect();

    try {

        const { public, id } = req.body;

        await client.query("BEGIN");

        await client.query(
            `UPDATE proves
             SET public = $1
             WHERE id = $2`,
            [public, id]
        );

        await client.query("COMMIT");

        res.status(200).json({
            message: "Visibilitat de prova canviada"
        });

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        res.status(500).json({
            message: "Error actualitzant visibilitat"
        });

    } finally {
        client.release();
    }
};

const updateFavorite = async (req, res) => {

    const client = await pool.connect();

    try {

        const { favorita, id } = req.body;

        await client.query("BEGIN");

        await client.query(
            `UPDATE proves
             SET favorita = $1
             WHERE id = $2`,
            [favorita, id]
        );

        await client.query("COMMIT");

        res.status(200).json({
            message: "Visibilitat de prova canviada"
        });

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        res.status(500).json({
            message: "Error actualitzant visibilitat"
        });

    } finally {
        client.release();
    }
};

const updateFeta = async (req, res) => {

    const client = await pool.connect();

    try {

        const { feta, id } = req.body;

        await client.query("BEGIN");

        await client.query(
            `UPDATE proves
             SET feta = $1
             WHERE id = $2`,
            [feta, id]
        );

        await client.query("COMMIT");

        res.status(200).json({
            message: "Visibilitat de prova canviada"
        });

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        res.status(500).json({
            message: "Error actualitzant visibilitat"
        });

    } finally {
        client.release();
    }
};

const updateOrder = async (req, res) => {

    const client = await pool.connect();

    try {

        const { proves } = req.body;

        await client.query("BEGIN");

        for (const prova of proves) {

            await client.query(
                `UPDATE proves
                 SET ordre = $1
                 WHERE id = $2`,
                [prova.ordre, prova.id]
            );
        }

        await client.query("COMMIT");

        res.status(200).json({
            message: "Ordre actualitzat"
        });

    } catch (error) {

        await client.query("ROLLBACK");

        console.error(error);

        res.status(500).json({
            message: "Error actualitzant ordre"
        });

    } finally {
        client.release();
    }
};

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

const getAssignacionsProva = async (req, res) => {
    const client = await pool.connect();

    try {
        const id_prova = req.query.id;

        await client.query("BEGIN");

        const result = await client.query(
            `SELECT *
             FROM assignacions_prova 
             WHERE id_prova = $1`,
            [id_prova]
        );

        await client.query("COMMIT");

        res.status(200).json(result.rows);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        res.status(500).json({ message: "Error al rebre dades {getAssignacionsProva}" });

    } finally {
        client.release();
    }
}

const asignarPosicioProva = async (req, res) => {
    const client = await pool.connect();

    try {
        const { id_prova, id_posicio, id_usuari } = req.body;

        await client.query("BEGIN");

        const result = await client.query(
            `INSERT INTO assignacions_prova (id_prova, id_posicio, id_usuari)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [id_prova, id_posicio, id_usuari]
        );

        await client.query("COMMIT");

        res.status(200).json(result.rows[0]);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        res.status(500).json({ message: "Error a l'assignar usuari a posició" });

    } finally {
        client.release();
    }
}

const canviarAssignacio = async (req, res) => {
    const client = await pool.connect();

    try {
        const { id_assignacio, id_usuari, id_posicio } = req.body;

        console.log("Entra a canviarAssignacion", req.body)

        await client.query("BEGIN");

        if (id_usuari) {
            await client.query(
                `UPDATE assignacions_prova
                 SET id_usuari = $2
                 WHERE id_assignacio = $1`,
                [id_assignacio, id_usuari]
            );
        } else if (id_posicio) {
            await client.query(
                `UPDATE assignacions_prova
                 SET id_posicio = $2
                 WHERE id_assignacio = $1`,
                [id_assignacio, id_posicio]
            );
        }

        await client.query("COMMIT");

        res.status(200).json({
            message: "Assignació actualitzada"
        });

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        res.status(500).json({
            message: "Error actualitzant assignació"
        });

    } finally {
        client.release();
    }
};

const intercanviarPosicions = async (req, res) => {
    const client = await pool.connect();

    try {

        const { id_assignacio_1, id_assignacio_2 } = req.body;

        await client.query("BEGIN");

        const id_usuari1 = await client.query(
            `SELECT id_usuari
             FROM assignacions_prova 
             WHERE id_assignacio = $1`,
            [id_assignacio_1]
        );

        const id_usuari2 = await client.query(
            `SELECT id_usuari
             FROM assignacions_prova 
             WHERE id_assignacio = $1`,
            [id_assignacio_2]
        );

        const id_usuari_1 = id_usuari1.rows[0]?.id_usuari;
        const id_usuari_2 = id_usuari2.rows[0]?.id_usuari;

        await client.query(
            `UPDATE assignacions_prova
             SET id_usuari = $1
             WHERE id_assignacio = $2`,
            [id_usuari_2, id_assignacio_1]
        );

        await client.query(
            `UPDATE assignacions_prova
             SET id_usuari = $1
             WHERE id_assignacio = $2`,
            [id_usuari_1, id_assignacio_2]
        );

        await client.query("COMMIT");

        res.status(200).json({
            message: "Posicions intercanviades"
        });

    } catch (error) {

        await client.query("ROLLBACK");

        console.error(error);

        res.status(500).json({
            message: "Error intercanviant posicions"
        });

    } finally {
        client.release();
    }
}

const canviPosicionsBuidaPlena = async (req, res) => {
    const client = await pool.connect();

    try {

        const { id_assignacio, id_posicio } = req.body;

        await client.query("BEGIN");

        const result = await client.query(
            `UPDATE assignacions_prova
             SET id_posicio = $1
             WHERE id_assignacio = $2`,
            [id_posicio, id_assignacio]
        );

        await client.query("COMMIT");

        res.status(200).json({
            message: "Posicions intercanviades"
        });

    } catch (error) {

        await client.query("ROLLBACK");

        console.error(error);

        res.status(500).json({
            message: "Error intercanviant posicions"
        });

    } finally {
        client.release();
    }
}

const desasignarPosicioProva = async (req, res) => {
    const client = await pool.connect();

    try {
        const id_assignacio = req.query.id;

        await client.query("BEGIN");

        const result = await client.query(
            `DELETE FROM assignacions_prova 
             WHERE id_assignacio = $1
             RETURNING *`,
            [id_assignacio]
        );

        await client.query("COMMIT");

        res.status(200).json(result.rows);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        res.status(500).json({ message: "Error al desasignar membre de posició" });

    } finally {
        client.release();
    }
}

const buidarPlantillaProva = async (req, res) => {
    const client = await pool.connect();

    try {
        const id_prova = req.query.id;

        await client.query("BEGIN");

        const result = await client.query(
            `DELETE FROM assignacions_prova 
             WHERE id_prova = $1
             RETURNING *`,
            [id_prova]
        );

        await client.query("COMMIT");

        res.status(200).json(result.rows);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        res.status(500).json({ message: "Error al buidar la plantilla" });

    } finally {
        client.release();
    }
}

const eliminarAbsentsProva = async (req, res) => {
    const client = await pool.connect();

    try {
        const id_esdeveniment = req.query.id;

        await client.query("BEGIN");

        const result = await client.query(
            `DELETE FROM assignacions_prova ap
             WHERE ap.id_prova IN (
                SELECT id
                FROM proves p
                WHERE p.id_esdeveniment = $1
             )
             AND ap.id_usuari IN (
                SELECT a.id_usuari
                FROM assistencia a
                WHERE a.id_esdeveniment = $1
                AND ((a.confirmacio_previa = 'no' AND a.confirmacio_arribada = 'pendent') OR a.confirmacio_arribada = 'no' )
             )
             RETURNING *`,
            [id_esdeveniment]
        );

        await client.query("COMMIT");

        res.status(200).json(result.rows);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        res.status(500).json({ message: "Error al buidar la plantilla" });

    } finally {
        client.release();
    }
}

module.exports = {
    getProvesByEsdeveniment, getProvaById,
    createProva, deleteProva,
    modifyInfoProva, updateOrder, publishProva, updateFavorite, updateFeta,
    getAssignacionsProva, desasignarPosicioProva, buidarPlantillaProva, eliminarAbsentsProva,
    asignarPosicioProva, intercanviarPosicions, canviarAssignacio, canviPosicionsBuidaPlena
};