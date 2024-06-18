const { connectToDatabase } = require('../dbConfig');

async function getAllClients(req, res) {
    try {
        const conn = await connectToDatabase();
        conn.query('SELECT * FROM Client', (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                throw err;
            }
            res.json(results);
        });
    } catch (error) {
        res.status(500).send('Failed to retrieve data: ' + error.message);
    }
}

async function getClientById(req, res) {
    const id = req.params.id;
    try {
        const conn = await connectToDatabase();
        conn.query('SELECT * FROM Client WHERE Id = ?', [id], (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                throw err;
            }
            res.json(results[0] || {});
        });
    } catch (error) {
        res.status(500).send('Failed to retrieve data: ' + error.message);
    }
}

async function createClient(req, res) {
    const { Name, PhoneNumber, Bonus, MoneySpend } = req.body;
    try {
        console.log('Parameters:', Name, PhoneNumber, Bonus, MoneySpend);
        const conn = await connectToDatabase();
        const sql = 'INSERT INTO Client (Name, PhoneNumber, Bonus, MoneySpend) VALUES (?, ?, ?, ?)';
        conn.query(sql, [Name, PhoneNumber, Bonus, MoneySpend], (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                throw err;
            }
            res.send('Client created successfully!');
            console.log('Client created successfully!');
        });
    } catch (error) {
        res.status(500).send('Failed to create Client: ' + error.message);
    }
}

async function updateClient(req, res) {
    const { id } = req.params;
    const { Name, PhoneNumber, Bonus, MoneySpend } = req.body;
    try {
        console.log('Parameters:', id, Name, PhoneNumber, Bonus, MoneySpend);
        const conn = await connectToDatabase();
        const sql = 'UPDATE Client SET Name = ?, PhoneNumber = ?, Bonus = ?, MoneySpend = ? WHERE Id = ?';
        conn.query(sql, [Name, PhoneNumber, Bonus, MoneySpend, id], (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).send('Failed to update Client');
            }
            return res.send('Client updated successfully!');
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Failed to update Client');
    }
}


async function deleteClient(req, res) {
    const { id } = req.params;
    try {
        const conn = await connectToDatabase();
        const sql = 'DELETE FROM Client WHERE Id = ?';
        conn.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                throw err;
            }
            res.send('Client deleted successfully!');
        });
    } catch (error) {
        res.status(500).send('Failed to delete data: ' + error.message);
    }
}

module.exports = {
    getAllClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient
};
