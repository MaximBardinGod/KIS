const { pool } = require('../dbConfig');

async function getAllClients(req, res) {
    try {
        const client = await pool.connect();
        try {
            const result = await client.query('SELECT * FROM Client');
            res.json(result.rows);
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Ошибка выполнения запроса:', error);
        res.status(500).send('Failed to retrieve data: ' + error.message);
    }
}

async function getClientById(req, res) {
    const id = req.params.id;
    try {
        const client = await pool.connect();
        try {
            const result = await client.query('SELECT * FROM Client WHERE Id = $1', [id]);
            res.json(result.rows[0] || {});
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Ошибка выполнения запроса:', error);
        res.status(500).send('Failed to retrieve data: ' + error.message);
    }
}

async function createClient(req, res) {
    const { Name, PhoneNumber, Bonus, MoneySpend } = req.body;
    try {
        console.log('Parameters:', Name, PhoneNumber, Bonus, MoneySpend);
        const client = await pool.connect();
        try {
            const sql = 'INSERT INTO Client (Name, PhoneNumber, Bonus, MoneySpend) VALUES ($1, $2, $3, $4)';
            await client.query(sql, [Name, PhoneNumber, Bonus, MoneySpend]);
            res.send('Client created successfully!');
            console.log('Client created successfully!');
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Ошибка выполнения запроса:', error);
        res.status(500).send('Failed to create Client: ' + error.message);
    }
}

async function updateClient(req, res) {
    const { id } = req.params;
    const { Name, PhoneNumber, Bonus, MoneySpend } = req.body;
    try {
        console.log('Parameters:', id, Name, PhoneNumber, Bonus, MoneySpend);
        const client = await pool.connect();
        try {
            const sql = 'UPDATE Client SET Name = $1, PhoneNumber = $2, Bonus = $3, MoneySpend = $4 WHERE Id = $5';
            await client.query(sql, [Name, PhoneNumber, Bonus, MoneySpend, id]);
            res.send('Client updated successfully!');
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Ошибка выполнения запроса:', error);
        res.status(500).send('Failed to update Client: ' + error.message);
    }
}

async function deleteClient(req, res) {
    const { id } = req.params;
    try {
        const client = await pool.connect();
        try {
            const sql = 'DELETE FROM Client WHERE Id = $1';
            await client.query(sql, [id]);
            res.send('Client deleted successfully!');
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Ошибка выполнения запроса:', error);
        res.status(500).send('Failed to delete Client: ' + error.message);
    }
}

module.exports = {
    getAllClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient
};
