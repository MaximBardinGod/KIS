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
    const { SpecificationId, Receivedquantity, Shippedquantity, Dateoperation } = req.body;
    try {
        console.log('Parameters:', SpecificationId, Receivedquantity, Shippedquantity, Dateoperation);
        const conn = await connectToDatabase();
        const sql = `INSERT INTO Stock ( SpecificationId, Receivedquantity, Shippedquantity, Dateoperation) VALUES ( ?, ?, ?, ?)`;
        conn.query(sql, [SpecificationId, Receivedquantity, Shippedquantity, Dateoperation], (err, result) => {
            if (err) throw err;
            res.send('Stock created successfully!');
            console.log('Stock created successfully!');
        });
    } catch (error) {
        res.status(500).send('Failed to create Stock: ' + error.message);
    }
}



async function updateStock(req, res) {
    const { Id, SpecificationId, Receivedquantity, Shippedquantity, Dateoperation } = req.body;
    try {
        console.log('Parameters:', Id, SpecificationId, Receivedquantity, Shippedquantity, Dateoperation);
        const conn = await connectToDatabase();
        const sql = `UPDATE Stock SET SpecificationId = ?, Receivedquantity = ?, Shippedquantity = ?, Dateoperation = ? WHERE Id = ?`;
        conn.query(sql, [SpecificationId, Receivedquantity, Shippedquantity, Dateoperation, Id], (err, result) => {
            if (err) {
                console.error('Failed to execute SQL query:', err);
                return res.status(500).send('Failed to update Stock');
            }
            return res.send('Stock updated successfully!');
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Failed to update Stock');
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
