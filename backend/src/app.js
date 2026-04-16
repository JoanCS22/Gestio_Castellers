const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authentication.routes');

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
};

app.use(cors(corsOptions));

app.options(/.*/, cors(corsOptions));

app.use(express.json());

app.use('/', authRoutes);

module.exports = app;