const { connectToDatabase } = require('../dbConfig');

async function getItemMenuByCheckId(req, res) {
    const { checkid } = req.params;
    try {
        const conn = await connectToDatabase();
        conn.query('SELECT * FROM itemmenu WHERE checkId = ?', [checkid], (err, results) => {
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

async function createItemMenu(req, res) {
    const { checkid, productid, count } = req.body;
    try {
        console.log('Parameters:', checkId, productId, count);
        const conn = await connectToDatabase();
        const sql = 'INSERT INTO itemmenu (checkid, productid, count) VALUES (?, ?, ?)';
        conn.query(sql, [checkId, productId, count], (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                throw err;
            }
            res.send('ItemMenu created successfully!');
            console.log('ItemMenu created successfully!');
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Failed to create ItemMenu: ' + error.message);
    }
}

module.exports = {
    getItemMenuByCheckId,
    createItemMenu
};
