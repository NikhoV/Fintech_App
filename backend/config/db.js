require('dotenv').config(); // Carica le variabili dal file .env
const mysql = require('mysql2');

// Creiamo un "Pool" di connessioni (più efficiente per le app reali)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Esportiamo la promessa per usare async/await
const promisePool = pool.promise();

// Test veloce della connessione
pool.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Errore di connessione al database:", err.message);
    } else {
        console.log("✅ Connessione al database MySQL riuscita!");
        connection.release();
    }
});

module.exports = promisePool;