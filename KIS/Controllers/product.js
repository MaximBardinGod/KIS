const { connectToDatabase } = require('../dbConfig');

async function getAllProducts(req, res) {
    try {
        const conn = await connectToDatabase();
        conn.query('SELECT * FROM Product', (err, results) => {
            if (err) throw err;
            res.json(results);
        });
    } catch (error) {
        res.status(500).send('Failed to retrieve data: ' + error.message);
    }
}

async function getProductById(req, res) {
    const id = req.params.id;
    try {
        const conn = await connectToDatabase();
        conn.query(`SELECT * FROM Product WHERE Id = ${id}`, (err, results) => {
            if (err) throw err;
            res.json(results[0] || {});
        });
    } catch (error) {
        res.status(500).send('Failed to retrieve data: ' + error.message);
    }
}

async function createProduct(req, res) {
    const { ParentId, Name, QuantityPerParent, Measure, Calories } = req.body;
    try {
        console.log('Parameters:', ParentId, Name, QuantityPerParent, Measure, Calories);
        const conn = await connectToDatabase();
        const sql = `INSERT INTO Product ( ParentId, Name, QuantityPerParent, Measure, Calories) VALUES ( ?, ?, ?, ?, ?)`;
        conn.query(sql, [ParentId, Name, QuantityPerParent, Measure, Calories], (err, result) => {
            if (err) throw err;
            res.send('Product created successfully!');
            console.log('Product created successfully!');
        });
    } catch (error) {
        res.status(500).send('Failed to create Product: ' + error.message);
    }
}



async function updateProduct(req, res) {
    const { Id, ParentId, Name, QuantityPerParent, Measure, Calories } = req.body;
    try {
        console.log('Parameters:', Id, ParentId, Name, QuantityPerParent, Measure, Calories);
        const conn = await connectToDatabase();
        const sql = `UPDATE Product SET ParentId = ?, Name = ?, QuantityPerParent = ?, Measure = ?, Calories = ? WHERE Id = ?`;
        conn.query(sql, [ParentId, Name, QuantityPerParent, Measure, Calories, Id], (err, result) => {
            if (err) {
                console.error('Failed to execute SQL query:', err);
                return res.status(500).send('Failed to update Product');
            }
            return res.send('Product updated successfully!');
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Failed to update Product');
    }
}

async function deleteProduct(req, res) {
    const { id } = req.params;
    try {
        const conn = await connectToDatabase();
        const sql = `WITH RecursiveDelete AS (
            SELECT Id
            FROM Product
            WHERE Id = ?
            
            UNION ALL
            
            SELECT t.Id
            FROM Product t
            INNER JOIN RecursiveDelete rd ON t.ParentId = rd.Id
            )
            DELETE FROM Product
            WHERE Id IN (SELECT Id FROM RecursiveDelete);`;
        conn.query(sql, [id], (err, result) => {
            if (err) throw err;
            res.send('Product deleted successfully!');
        });
    } catch (error) {
        res.status(500).send('Failed to delete data: ' + error.message);
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
