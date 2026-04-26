const pool = require('../db');

const getMembers = async (req, res) => {
    try {
        const collaActiva = req.query.id;

        const result = await pool.query(
            `SELECT u.nom, u.cognoms, u.mote, m.data_acces
            FROM membres_colla m, usuaris u
            WHERE m.id_colla = $1 AND m.id_usuari = u.id`,
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