const sql = require('mssql')
require('dotenv').config();


const config = {
    user: 'sa',
    password: 'Asdf2022',
    server: 'localhost',
    database: 'CursorMSSQL2024',
    pool: {
        max: 100, // Максимальное количество соединений в пуле
        min: 0,  // Минимальное количество соединений в пуле
        idleTimeoutMillis: 30000 // Время ожидания перед закрытием неиспользуемого соединения
    },
    options: {
        trustServerCertificate: true // если используете самоподписанный сертификат SSL
    }
};
console.log(config)
const pool = new sql.ConnectionPool(config);
const connection = pool.connect();

module.exports = {
    sql,
    connection
}