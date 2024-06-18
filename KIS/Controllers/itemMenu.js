const { connectToDatabase } = require('../dbConfig');

async function getItemMenuByCheckId(req, res) {
    const { checkId } = req.params;
    try {
        const conn = await connectToDatabase();
        conn.query('SELECT * FROM ItemMenu WHERE CheckId = ?', [checkId], (err, results) => {
            if (err) throw err;
            res.json(results);
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Failed to retrieve data: ' + error.message);
    }
}


async function createItemMenu(req, res) {
    const { CheckId, ProductId, Count } = req.body;
    try {
        console.log('Parameters:', CheckId, ProductId, Count);
        const conn = await connectToDatabase();
        const sql = `INSERT INTO ItemMenu ( CheckId, ProductId, Count) VALUES ( ?, ?, ?)`;
        conn.query(sql, [CheckId, ProductId, Count], (err, result) => {
            if (err) throw err;
            res.send('ItemMenu created successfully!');
            console.log('ItemMenu created successfully!');
        });
    } catch (error) {
        res.status(500).send('Failed to create ItemMenu: ' + error.message);
    }
}
module.exports = {
    getItemMenuByCheckId,
    createItemMenu
};