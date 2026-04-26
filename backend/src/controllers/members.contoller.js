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

const addMember = async (req, res) => {

}

const modifyMember = async (req, res) => {

}

const deleteMember = async (req, res) => {

}

module.exports = { getMembers, addMember, modifyMember, deleteMember };