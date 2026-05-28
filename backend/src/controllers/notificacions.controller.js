const pool = require('../db');

const getUserNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const collaActiva = req.query.id;


        const result = await pool.query(
            `SELECT n.* 
             FROM notificacions n
             JOIN receptors_notificacions rn ON n.id = rn.id_notificacio
             JOIN grup_usuari gu ON rn.id_grup = gu.id_grup
             WHERE gu.id_usuari = $1 
             AND gu.id_colla = $2`,
            [userId, collaActiva]
        );

        if (result.rows.length === 0) {
            return res.status(200).json({ message: 'Usuari no té notificacions' });
        }

        res.status(200).json(result.rows);

    } catch (error) {

        console.error(error);
        res.status(500).json({ message: 'Error al rebre notificacions' });
    }
};

const createNotification = async (req, res) => {
    try {
        const userId = req.user.id;
        const collaActiva = req.query.id;
        const { titol, missatge, data_programacio, ids_grups } = req.body;

        await client.query("BEGIN");

        const userName = await pool.query(
            `SELECT u.mote
             FROM usuaris
             WHERE id = $1`,
            [userId]
        );

        if (!userName) {
            await client.query("ROLLBACK");
            return res.status(200).json({ message: 'Usuari no trobat' });
        }

        const result = await client.query(
            `INSERT INTO notificacions (titol, missatge, data_creacio, data_programacio, nom_emisor)
             VALUES ($1, $2, $3, NOW(), $4)
             RETURNING *`,
            [titol, missatge, data_programacio, userName[0].nom]
        );

        if (ids_grups.length > 0) {
            for (let i = 0; i < ids_grups.length; i++) {
                await client.query(
                    `INSERT INTO receptors_notificacions (id_notificacio, id_grup)
                     VALUES ($1, $2)
                     RETURNING *`,
                    [result[0].id, collaActiva, ids_grups[i]]
                );
            }
        }

        await client.query("COMMIT");

        res.status(200).json(result.rows[0]);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        res.status(500).json({ message: "Error a l'enviar la notificació" });

    } finally {
        client.release();
    }
};

module.exports = { getUserNotifications, createNotification };