const pool = require('../db');

const getUserNotifications = async (req, res) => {
    const client = await pool.connect();
    try {
        const userId = req.user.id;
        const collaActiva = req.query.id;

        const result = await client.query(
            `SELECT n.*, rn.vista
             FROM notificacions n
             JOIN receptors_notificacions rn ON n.id = rn.id_notificacio
             JOIN membres_colla mc ON rn.id_usuari = mc.id_usuari
             WHERE mc.id_usuari = $1 
             AND mc.id_colla = $2`,
            [userId, collaActiva]
        );

        res.status(200).json(result.rows);

    } catch (error) {

        console.error(error);
        res.status(500).json({ message: 'Error al rebre notificacions' });
    }
};

const createNotification = async (req, res) => {
    const client = await pool.connect();
    try {
        const userId = req.user.id;
        const collaActiva = req.query.id;
        const { titol, missatge, data_programacio, ids_grups } = req.body;

        await client.query("BEGIN");

        const userName = await client.query(
            `SELECT u.mote
             FROM usuaris
             WHERE id = $1`,
            [userId]
        );

        if (userName.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(200).json({ message: 'Usuari no trobat' });
        }

        const notification = await client.query(
            `INSERT INTO notificacions (titol, missatge, data_programacio, nom_emisor)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [titol, missatge, data_programacio, userName.rows[0].nom]
        );

        if (ids_grups.length > 0) {
            await client.query(
                `INSERT INTO receptors_notificacions (id_notificacio, id_usuari)
                 SELECT DISTINCT $1, gu.id_usuari
                 FROM grup_usuari gu
                 WHERE gu.id_grup = ANY($2::bigint[])`,
                [notification.rows[0].id, ids_grups]
            );
        }

        await client.query("COMMIT");

        res.status(200).json(notification.rows[0]);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        res.status(500).json({ message: "Error a l'enviar la notificació" });

    } finally {
        client.release();
    }
};

module.exports = { getUserNotifications, createNotification };