const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'database',
    database: 'castellers',
    password: 'secret',
    port: 5432,
});

module.exports = pool;