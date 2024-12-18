const mysql = require('mysql2/promise');
const dotenv = require('dotenv').config();

const pool = mysql.createPool({
    host: "mysql.celebreprojetos.com.br",
    password: "585103Aa",
    database: "celebreprojeto05",
    user: "celebreprojeto05"
})

module.exports = pool