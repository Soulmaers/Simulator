const sql = require('mssql')
require('dotenv').config();


const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    pool: {
        max: 100, // Максимальное количество соединений в пуле
        min: 0,  // Минимальное количество соединений в пуле
        idleTimeoutMillis: 30000 // Время ожидания перед закрытием неиспользуемого соединения
    },
    options: {
        trustServerCertificate: true // если используете самоподписанный сертификат SSL
    }
};

const pool = new sql.ConnectionPool(config);
const connection = pool.connect();

module.exports = {
    sql,
    connection
}