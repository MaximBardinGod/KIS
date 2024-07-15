const express = require('express');
const router = express.Router();
const { pool } = require('../dbconfig');

router.post('/createClientOrder', async (req, res) => {
    const clientData = req.body;
    const { name, phonenumber, address, datetime, paymenttype, sum, orders } = clientData;

    const clientQuery = 'SELECT id FROM client WHERE name = $1 AND phonenumber = $2';
    const createClientQuery = 'INSERT INTO client (name, phonenumber, bonus, moneyspend) VALUES ($1, $2, 0, 0) RETURNING id';
    const createCheckQuery = 'INSERT INTO check_ (sum, datetime, paymenttype, clientid, address) VALUES ($1, $2, $3, $4, $5) RETURNING id';
    const createItemMenuQuery = 'INSERT INTO itemmenu (checkid, productid, count) VALUES ($1, $2, $3)';

    const clientValues = [name, phonenumber];

    try {
        await pool.query('BEGIN');

        let clientResult = await pool.query(clientQuery, clientValues);

        if (clientResult.rows.length === 0) {
            clientResult = await pool.query(createClientQuery, clientValues);
        }

        const clientId = clientResult.rows[0].id;
        const checkValues = [sum, datetime, paymenttype, clientId, address];

        const checkResult = await pool.query(createCheckQuery, checkValues);
        const checkId = checkResult.rows[0].id;

        for (const order of orders) {
            const itemMenuValues = [checkId, order.id, order.count];
            await pool.query(createItemMenuQuery, itemMenuValues);
        }

        await pool.query('COMMIT');
        res.status(201).json({ message: 'Order created successfully' });
    } catch (error) {
        await pool.query('ROLLBACK');
        res.status(500).json({ message: 'Error processing order', error: error.message });
    }
});

module.exports = router;
