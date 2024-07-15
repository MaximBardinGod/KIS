const { connectToDatabase } = require('../dbConfig');

async function getAllProducts(req, res) {
    try {
        const conn = await connectToDatabase();
        conn.query('SELECT * FROM product', (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                throw err;
            }
            res.json(results);
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Failed to retrieve data: ' + error.message);
    }
}

async function getProductById(req, res) {
    const { id } = req.params;
    try {
        const conn = await connectToDatabase();
        conn.query('SELECT * FROM product WHERE id = ?', [id], (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                throw err;
            }
            res.json(results[0] || {});
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Failed to retrieve data: ' + error.message);
    }
}

async function createProduct(req, res) {
    const { name, type, linktopicture, description, price, compound, calories } = req.body;
    try {
        console.log('Parameters:', name, type, linktopicture, description, price, compound, calories);
        const conn = await connectToDatabase();
        const sql = `INSERT INTO product (name, type, linktopicture, description, price, compound, calories) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        conn.query(sql, [name, type, linktopicture, description, price, compound, calories], (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                throw err;
            }
            res.send('Product created successfully!');
            console.log('Product created successfully!');
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Failed to create product: ' + error.message);
    }
}

async function updateProduct(req, res) {
    const { id, name, type, linktopicture, description, price, compound, calories } = req.body;
    try {
        console.log('Parameters:', id, name, type, linktopicture, description, price, compound, calories);
        const conn = await connectToDatabase();
        const sql = `UPDATE product SET name = ?, type = ?, linktopicture = ?, description = ?, price = ?, compound = ?, calories = ? WHERE id = ?`;
        conn.query(sql, [name, type, linktopicture, description, price, compound, calories, id], (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).send('Failed to update product');
            }
            return res.send('Product updated successfully!');
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Failed to update product');
    }
}

async function deleteProduct(req, res) {
    const { id } = req.params;
    try {
        const conn = await connectToDatabase();
        const sql = 'DELETE FROM product WHERE id = ?';
        conn.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                throw err;
            }
            res.send('Product deleted successfully!');
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Failed to delete product: ' + error.message);
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
