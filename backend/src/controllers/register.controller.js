const pool = require('../db');
const bcrypt = require('bcrypt');

const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return minLength && hasLetter && hasNumber && hasSpecial;
};

const register = async (req, res) => {

    if (!validatePassword(contrasenya)) {
        return res.status(400).json({
            message: "Contrasenya no segura (mínim 8 caràcters, una lletra, un número i un símbol)"
        });
    }

    try {
        const { email, contrasenya } = req.body;

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(contrasenya, saltRounds);

        const exists = await pool.query(
            'SELECT id FROM usuaris WHERE email = $1',
            [email]
        );

        if (exists.rows.length > 0) {
            return res.status(400).json({ message: 'Email ja existent' });
        }

        const result = await pool.query(
            `INSERT INTO usuaris (email, contrasenya)
            VALUES ($1, $2)
            RETURNING *`,
            [email, hashedPassword]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {

        console.error(error);

        if (error.code === '23505') {
            return res.status(400).json({ message: 'Email ja existent' });
        }

        res.status(500).json({ message: 'Error al registrar-se' });
    }
};

module.exports = { register };