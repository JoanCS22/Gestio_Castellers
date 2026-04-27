const pool = require('../db');

const getMembers = async (req, res) => {
    try {
        const collaActiva = req.query.id;

        const result = await pool.query(
            `SELECT m.id_colla, m.id_usuari, u.nom, u.cognoms, u.mote, r.nom AS rol, m.data_acces,
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

        res.status(200).json(result.rows);

    } catch (error) {

        console.error(error);
        res.status(500).json({ message: 'Error al rebre les dades {addMember}' });
    }
}

const modifyMember = async (req, res) => {

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

        res.status(200).json(result.rows);

    } catch (error) {

        console.error(error);
        res.status(500).json({ message: 'Error al rebre les dades {deleteMember}' });
    }
}

module.exports = { getMembers, addMember, modifyMember, deleteMember, searchUsers };