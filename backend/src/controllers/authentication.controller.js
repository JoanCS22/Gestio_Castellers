const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>_-]/.test(password);

    return minLength && hasLetter && hasNumber && hasSpecial;
};

const register = async (req, res) => {
    try {
        const { email, contrasenya } = req.body;

        if (!validatePassword(contrasenya)) {
            return res.status(400).json({
                message: "Contrasenya no segura (mínim 8 caràcters, una lletra, un número i un símbol)"
            });
        }

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

const login = async (req, res) => {
    try {
        const { email, contrasenya } = req.body;

        const result = await pool.query(
            'SELECT id, email, contrasenya FROM usuaris WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Usuari no existeix' });
        }

        const user = result.rows[0];

        const validPassword = await bcrypt.compare(contrasenya, user.contrasenya);

        if (!validPassword) {
            return res.status(400).json({ message: 'Contrasenya incorrecta' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Error al login' });
    }
};

module.exports = { register, login };