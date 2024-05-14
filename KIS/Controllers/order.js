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
    const { SpecificationId, OrderDate, Status, ClientName, Count } = req.body;
    try {
        console.log('Parameters:', SpecificationId, OrderDate, Status, ClientName, Count); // Добавляем лог параметров
        const conn = await connectToDatabase();
        const sql = `INSERT INTO Order_ (SpecificationId, OrderDate, Status, ClientName, Count) VALUES (?, ?, ?, ?, ?)`;
        conn.query(sql, [SpecificationId, OrderDate, Status, ClientName, Count], (err, result) => {
            if (err) throw err;
            res.send('Order created successfully!');
            console.log('Order created successfully!');
        });
    } catch (error) {
        res.status(500).send('Failed to create order: ' + error.message);
    }
}



async function updateOrder(req, res) {
    const { Id, SpecificationId, Orderdate, Status, ClientName, Count } = req.body; // Заменили Id на ID
    try {
        console.log('Parameters:', Id, SpecificationId, Orderdate, Status, ClientName, Count);
        const conn = await connectToDatabase();
        const sql = `UPDATE Order_ SET SpecificationId = ?, Orderdate = ?, Status = ?, ClientName = ?, Count = ? WHERE Id = ?`;
        conn.query(sql, [SpecificationId, Orderdate, Status, ClientName, Count, Id], (err, result) => {
            if (err) {
                console.error('Failed to execute SQL query:', err);
                return res.status(500).send('Failed to update order');
            }
            return res.send('Order updated successfully!');
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Failed to update order');
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
