const pool = require('../db');

const getMembers = async (req, res) => {
    try {
        const collaActiva = req.query.id;

        const result = await pool.query(
            `SELECT m.id_colla, m.id_usuari, u.nom, u.cognoms, m.mote, r.nom AS rol, u.url_foto as foto, u.comentari, 
             m.data_acces, u.lesionat, u.canalla, u.altura_total, u.altura_espatlles, u.envergadura, 
             COALESCE(
                ARRAY_AGG(p.nom) FILTER (WHERE p.nom IS NOT NULL),
                '{}'
             ) AS posicions
            FROM membres_colla m
            JOIN usuaris u ON u.id = m.id_usuari
            JOIN rols r ON r.id = m.id_rol
            LEFT JOIN posicio_usuari pu 
                ON pu.id_usuari = m.id_usuari 
                AND pu.id_colla = m.id_colla
            LEFT JOIN posicions p 
                ON p.id = pu.id_posicio

            WHERE m.id_colla = $1
            GROUP BY m.id_colla, m.id_usuari, u.id, r.id, m.data_acces`,
            [collaActiva]
        );

        if (result.rows == 0) {
            console.log('{INFO} No members exist for this colla')
        }

        res.status(200).json(result.rows);

    } catch (error) {

        console.error(error);
        res.status(500).json({ message: 'Error al rebre les dades {getCollaRoles}' });
    }
}

const searchUsers = async (req, res) => {
    try {
        const { nom, cognoms, email } = req.body;

        let conditions = [];
        let values = [];

        if (nom) {
            values.push(`%${nom}%`);
            conditions.push(`u.nom ILIKE $${values.length}`);
        }

        if (cognoms) {
            values.push(`%${cognoms}%`);
            conditions.push(`u.cognoms ILIKE $${values.length}`);
        }

        if (email) {
            values.push(`%${email}%`);
            conditions.push(`u.email ILIKE $${values.length}`);
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

        const result = await pool.query(
            `SELECT u.id, u.nom, u.cognoms, u.email
            FROM usuaris u
            ${whereClause}`,
            values
        );

        if (result.rows.length === 0) {
            console.log('{INFO} No users exist with these filters')
        }

        res.status(200).json(result.rows);

    } catch (error) {

        console.error(error);
        res.status(500).json({ message: 'Error al rebre les dades {searchUsers}' });
    }
}

const addMember = async (req, res) => {
    try {
        const collaActiva = req.query.id;
        const userId = req.query.userid;

        const result = await pool.query(
            `INSERT INTO membres_colla (id_usuari, id_colla, id_rol, actiu, data_acces)
             VALUES ($1, $2, 2, true, NOW())
             RETURNING *`,
            [userId, collaActiva]
        );

        await pool.query(
            `INSERT INTO assistencia (id_esdeveniment, id_usuari, confirmacio_previa, confirmacio_arribada, comentari)
            SELECT id, $1, 'pendent', 'pendent', ''
            FROM esdeveniments
            WHERE id_colla = $2 AND data_esdeveniment >= NOW()`,
            [userId, collaActiva]
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al rebre les dades {addMember}' });
    }
}

const getDataMember = async (req, res) => {
    try {
        const collaActiva = req.query.collaid;
        const userId = req.query.userid;

        const result = await pool.query(
            `SELECT r.id AS rol_id, r.nom AS rol_nom,
             ARRAY_REMOVE(ARRAY_AGG(DISTINCT g.id), NULL) AS grups_ids,
             ARRAY_REMOVE(ARRAY_AGG(DISTINCT g.nom), NULL) AS grups_noms,
             ARRAY_REMOVE(ARRAY_AGG(DISTINCT p.id), NULL) AS posicions_ids,
             ARRAY_REMOVE(ARRAY_AGG(DISTINCT p.nom), NULL) AS posicions_noms
             FROM membres_colla mc
             LEFT JOIN rols r ON r.id = mc.id_rol
             LEFT JOIN grup_usuari ug ON ug.id_usuari = mc.id_usuari AND ug.id_colla = mc.id_colla
             LEFT JOIN grups g ON g.id = ug.id_grup
             LEFT JOIN posicio_usuari up ON up.id_usuari = mc.id_usuari AND up.id_colla = mc.id_colla
             LEFT JOIN posicions p ON p.id = up.id_posicio
             WHERE mc.id_colla = $1 AND mc.id_usuari = $2
             GROUP BY r.id, r.nom;`,
            [collaActiva, userId]
        );

        if (result.rows.length === 0) {
            console.log('{INFO} No results exist for this member.')
        }

        res.status(200).json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al rebre les dades {getCollaRoles}' });
    }
}

const modifyMember = async (req, res) => {
    const client = await pool.connect();

    try {
        const collaActiva = req.query.collaid;
        const userId = req.query.userid;

        const { id_rol, ids_posicions, ids_grups } = req.body;

        await client.query("BEGIN");

        const resultUpdate = await client.query(
            `UPDATE membres_colla 
            SET id_rol = $3
            WHERE id_usuari = $1 AND id_colla = $2
            RETURNING *`,
            [userId, collaActiva, id_rol]
        );

        if (resultUpdate.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ message: 'Membre no trobat.' });
        }

        await client.query(
            `DELETE FROM posicio_usuari
             WHERE id_usuari = $1 AND id_colla = $2`,
            [userId, collaActiva]
        );

        if (ids_posicions.length > 0) {
            for (let i = 0; i < ids_posicions.length; i++) {
                await client.query(
                    `INSERT INTO posicio_usuari (id_usuari, id_colla, id_posicio)
                    VALUES ($1, $2, $3)
                    RETURNING *`,
                    [userId, collaActiva, ids_posicions[i]]
                );
            }
        } else {
            await client.query(
                `DELETE FROM posicio_usuari
                 WHERE id_usuari = $1 AND id_colla = $2
                 RETURNING *`,
                [userId, collaActiva]
            );
        }

        await client.query(
            `DELETE FROM grup_usuari
             WHERE id_usuari = $1 AND id_colla = $2`,
            [userId, collaActiva]
        );

        if (ids_grups.length > 0) {
            for (let i = 0; i < ids_grups.length; i++) {
                await client.query(
                    `INSERT INTO grup_usuari (id_usuari, id_colla, id_grup)
                     VALUES ($1, $2, $3)
                     RETURNING *`,
                    [userId, collaActiva, ids_grups[i]]
                );
            }
        } else {
            await client.query(
                `DELETE FROM grup_usuari
                 WHERE id_usuari = $1 AND id_colla = $2
                 RETURNING *`,
                [userId, collaActiva]
            );
        }

        await client.query("COMMIT");

        res.status(200).json(resultUpdate.rows[0]);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        res.status(500).json({ message: 'Error al modificar les dades {MemberData}' });
    } finally {
        client.release();
    }
}

const deleteMember = async (req, res) => {
    try {
        const collaActiva = req.query.id;
        const userId = req.query.userid;

        const result = await pool.query(
            `DELETE FROM membres_colla 
             WHERE id_usuari = $1 AND id_colla = $2
             RETURNING *`,
            [userId, collaActiva]
        );

        await pool.query(
            `DELETE FROM assistencia
             WHERE id_usuari = $1 AND id_esdeveniment IN (
             SELECT id
             FROM esdeveniments WHERE id_colla = $2
             AND data_esdeveniment >= NOW())`,
            [userId, collaActiva]
        );

        res.status(200).json(result.rows);

    } catch (error) {

        console.error(error);
        res.status(500).json({ message: 'Error al rebre les dades {deleteMember}' });
    }
}

const getMemberPermissions = async (req, res) => {
    try {
        const collaActiva = req.query.id;
        const loggedUserId = req.user.id;

        const result = await pool.query(
            `SELECT r.permisos 
             FROM rols r, membres_colla mc 
             WHERE mc.id_usuari = $1 AND (r.id_colla = $2 OR r.nom in ('Administrador', 'Membre', 'Tècnica')) 
             AND mc.id_rol = r.id`,
            [loggedUserId, collaActiva]
        );

        res.status(200).json(result.rows[0]);

    } catch (error) {

        console.error(error);
        res.status(500).json({ message: 'Error al rebre les dades {deleteMember}' });
    }
}

module.exports = { getMembers, addMember, modifyMember, deleteMember, searchUsers, getDataMember, getMemberPermissions };