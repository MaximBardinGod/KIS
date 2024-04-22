const { connectToDatabase } = require('../dbConfig');

async function getAllOrders(req, res) {
    try {
        const conn = await connectToDatabase();
        conn.query('SELECT * FROM Order_', (err, results) => {
            if (err) throw err;
            res.json(results);
        });
    } catch (error) {
        res.status(500).send('Failed to retrieve orders: ' + error.message);
    }
}

async function getOrderById(req, res) {
    const id = req.params.id;
    try {
        const conn = await connectToDatabase();
        conn.query(`SELECT * FROM Order_ WHERE Id = ${id}`, (err, results) => {
            if (err) throw err;
            res.json(results[0] || {});
        });
    } catch (error) {
        res.status(500).send('Failed to retrieve order: ' + error.message);
    }
}

async function createOrder(req, res) {
    const { SpecificationId, OrderDate, ClientName, Count } = req.body;
    try {
        const conn = await connectToDatabase();
        const sql = `INSERT INTO Order_ (SpecificationId, OrderDate, ClientName, Count) VALUES (?, ?, ?, ?)`;
        conn.query(sql, [SpecificationId, OrderDate, ClientName, Count], (err, result) => {
            if (err) throw err;
            res.send('Order created successfully!');
        });
    } catch (error) {
        res.status(500).send('Failed to create order: ' + error.message);
    }
}

async function updateOrder(req, res) {
    const { Id, SpecificationId, OrderDate, ClientName, Count } = req.body;
    try {
        const conn = await connectToDatabase();
        const sql = `UPDATE Order_ SET SpecificationId = ?, OrderDate = ?, ClientName = ?, Count = ? WHERE Id = ?`;
        conn.query(sql, [SpecificationId, OrderDate, ClientName, Count, Id], (err, result) => {
            if (err) throw err;
            res.send('Order updated successfully!');
        });
    } catch (error) {
        res.status(500).send('Failed to update order: ' + error.message);
    }
}

async function deleteOrder(req, res) {
    const { id } = req.params;
    try {
        const conn = await connectToDatabase();
        const sql = `DELETE FROM Order_ WHERE Id = ?`;
        conn.query(sql, [id], (err, result) => {
            if (err) throw err;
            res.send('Order deleted successfully!');
        });
    } catch (error) {
        res.status(500).send('Failed to delete order: ' + error.message);
    }
}

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
};
