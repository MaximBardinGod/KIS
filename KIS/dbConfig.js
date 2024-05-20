const sql = require('msnodesqlv8');

const connectionString = "server=KOMPUTER\\SQLEXPRESS;Database=KIS;trusted_connection=yes;driver={SQL Server Native Client 11.0}";

function connectToDatabase() {
    return new Promise((resolve, reject) => {
        sql.open(connectionString, (err, conn) => {
            if (err) {
                console.error('Не удалось подключится к БД! Ошбика:', err);
                return reject(err);
            }
            console.log('Подключение к БД...');
            resolve(conn);
            
        });
    });
}

module.exports = {
    connectToDatabase
};
