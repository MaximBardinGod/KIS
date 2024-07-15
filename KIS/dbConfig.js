const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'gurmanika',
    password: 'rootroot',
    port: 5432
});

async function connectToDatabase() {
    try {
        const client = await pool.connect();
        console.log('Подключение к БД установлено успешно!');
        return client;
    } catch (err) {
        console.error('Не удалось подключиться к БД! Ошибка:', err);
        throw err;
    }
}


module.exports = {
    connectToDatabase,
    pool
};
