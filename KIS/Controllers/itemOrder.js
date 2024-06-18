const { connectToDatabase } = require('../dbConfig');

async function getItemOrderByOrderId(req, res) {
    const { orderId } = req.params;
    try {
        const conn = await connectToDatabase();
        conn.query('SELECT * FROM ItemOrder WHERE OrderId = ?', [orderId], (err, results) => {
            if (err) throw err;
            res.json(results);
        });
    } catch (error) {
        res.status(500).send('Failed to retrieve data: ' + error.message);
    }
}


async function createItemOrder(req, res) {
    const { OrderId, ProductId, Count } = req.body;
    try {
        console.log('Parameters:', OrderId, ProductId, Count);
        const conn = await connectToDatabase();
        const sql = `INSERT INTO ItemOrder ( OrderId, ProductId, Count) VALUES ( ?, ?, ?)`;
        conn.query(sql, [OrderId, ProductId, Count], (err, result) => {
            if (err) throw err;
            res.send('ItemOrder created successfully!');
            console.log('ItemOrder created successfully!');
        });
    } catch (error) {
        res.status(500).send('Failed to create ItemOrder: ' + error.message);
    }
}
module.exports = {
    getItemOrderByOrderId,
    createItemOrder
};