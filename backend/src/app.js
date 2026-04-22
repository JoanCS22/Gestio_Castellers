const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authentication.routes');
const profileRoutes = require('./routes/profile.routes');
const collaRoutes = require('./routes/colla.routes')

require("dotenv").config();

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
app.use('/profile', profileRoutes); 
app.use('/colla', collaRoutes);

module.exports = app;