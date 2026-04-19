const pool = require('../db');

const getUserData = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT * FROM usuaris WHERE id = $1`,
            [userId]
        );

        if (exists.rows.length === 0) {
            return res.status(400).json({ message: 'Usuari no trobat' });
        }

        res.status(201).json(result.rows[0]);

    } catch (error) {

        console.error(error);
        res.status(500).json({ message: 'Error al rebre les dades' });
    }
};

module.exports = { getUserData };