const { connectToDatabase } = require('../dbConfig');

async function getStockBalance(req, res) {
    const date = req.query.date;

    if (!date) {
        return res.status(400).send('Укажите дату.');
    }

    const sqlQuery = `
        SELECT 
            SpecificationId,
            SUM(Receivedquantity) - SUM(Shippedquantity) AS RemainingStock
        FROM 
            Stock
        WHERE 
            Dateoperation <= ?
        GROUP BY 
            SpecificationId;
    `;

    try {
        const conn = await connectToDatabase();
        
        conn.query(sqlQuery, [date], (err, results) => {
            if (err) {
                res.status(500).send('Ошибка при получении данных: ' + err.message);
                return;
            }
            res.json(results);
        });
    } catch (err) {
        res.status(500).send('Ошибка при подключении к базе данных: ' + err.message);
    }
}

module.exports = {
    getStockBalance
};
