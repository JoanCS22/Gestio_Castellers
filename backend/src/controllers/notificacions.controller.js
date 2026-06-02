const pool = require('../db');

const getUserNotifications = async (req, res) => {
    const client = await pool.connect();
    try {
        const userId = req.user.id;
        const collaActiva = req.query.id;

        const result = await client.query(
            `SELECT n.*, rn.vist
             FROM notificacions n
             JOIN receptors_notificacions rn ON n.id = rn.id_notificacio
             WHERE rn.id_usuari = $1
             AND rn.id_colla = $2
             AND n.data_programacio < NOW()
             ORDER BY n.data_programacio DESC`,
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
            `SELECT mote
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
            [titol, missatge, data_programacio, userName.rows[0].mote]
        );

        const idNotificacio = notification.rows[0].id;

        if (Array.isArray(ids_grups) && ids_grups.length > 0) {
            await client.query(
                `INSERT INTO receptors_notificacions (id_notificacio, id_usuari, id_colla)
                 SELECT DISTINCT $1::bigint, gu.id_usuari, g.id_colla
                 FROM grup_usuari gu
                 JOIN grups g ON g.id = gu.id_grup
                 WHERE gu.id_grup = ANY($2)`,
                [idNotificacio, ids_grups]
            );
        } else {
            await client.query(
                `INSERT INTO receptors_notificacions (id_notificacio, id_usuari, id_colla)
                 SELECT DISTINCT $1::bigint, mc.id_usuari, mc.id_colla
                 FROM membres_colla mc
                 WHERE mc.id_colla = $2`,
                [idNotificacio, collaActiva]
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