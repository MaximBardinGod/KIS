const { connectToDatabase } = require('../dbConfig');

async function getAllStocks(req, res) {
    try {
        const conn = await connectToDatabase();
        conn.query('SELECT * FROM Stock', (err, results) => {
            if (err) throw err;
            res.json(results);
        });
    } catch (error) {
        res.status(500).send('Failed to retrieve stocks: ' + error.message);
    }
}

async function getStockById(req, res) {
    const id = req.params.id;
    try {
        const conn = await connectToDatabase();
        conn.query(`SELECT * FROM Stock WHERE Id = ${id}`, (err, results) => {
            if (err) throw err;
            res.json(results[0] || {});
        });
    } catch (error) {
        res.status(500).send('Failed to retrieve stock: ' + error.message);
    }
}

async function createStock(req, res) {
    const { SpecificationId, ReceivedQuantity, ShippedQuantity, DateOperation } = req.body;
    try {
        const conn = await connectToDatabase();
        const sql = `INSERT INTO Stock (SpecificationId, ReceivedQuantity, ShippedQuantity, DateOperation) VALUES (?, ?, ?, ?)`;
        conn.query(sql, [SpecificationId, ReceivedQuantity, ShippedQuantity, DateOperation], (err, result) => {
            if (err) throw err;
            res.send('Stock entry created successfully!');
        });
    } catch (error) {
        res.status(500).send('Failed to create stock entry: ' + error.message);
    }
}

async function updateStock(req, res) {
    const { Id, SpecificationId, ReceivedQuantity, ShippedQuantity, DateOperation } = req.body;
    try {
        const conn = await connectToDatabase();
        const sql = `UPDATE Stock SET SpecificationId = ?, ReceivedQuantity = ?, ShippedQuantity = ?, DateOperation = ? WHERE Id = ?`;
        conn.query(sql, [SpecificationId, ReceivedQuantity, ShippedQuantity, DateOperation, Id], (err, result) => {
            if (err) throw err;
            res.send('Stock entry updated successfully!');
        });
    } catch (error) {
        res.status(500).send('Failed to update stock entry: ' + error.message);
    }
}

async function deleteStock(req, res) {
    const { id } = req.params;
    try {
        const conn = await connectToDatabase();
        const sql = `DELETE FROM Stock WHERE Id = ?`;
        conn.query(sql, [id], (err, result) => {
            if (err) throw err;
            res.send('Stock entry deleted successfully!');
        });
    } catch (error) {
        res.status(500).send('Failed to delete stock entry: ' + error.message);
    }
}

module.exports = {
    getAllStocks,
    getStockById,
    createStock,
    updateStock,
    deleteStock
};
