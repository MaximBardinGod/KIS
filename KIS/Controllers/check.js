const { pool } = require('../dbConfig');

async function getAllChecks(req, res) {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM check_');
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Failed to retrieve data: ' + error.message);
    }
}

async function getCheckById(req, res) {
    const id = req.params.id;
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM check_ WHERE id = $1', [id]);
        res.json(result.rows[0] || {});
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Failed to retrieve data: ' + error.message);
    }
}

async function createCheck(req, res) {
    const { sum, date, paymentType, clientId } = req.body;
    try {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const insertCheckText = `INSERT INTO check_ (sum, date, paymentType, clientId) VALUES ($1, $2, $3, $4) RETURNING id`;
            const insertCheckValues = [sum, date, paymentType, clientId];
            const result = await client.query(insertCheckText, insertCheckValues);

            const checkId = result.rows[0].id;

            // Calculate Bonus
            const bonus = Math.round(sum * 0.01);

            // Update Client's MoneySpend
            const updateClientMoneySpendText = `UPDATE client SET moneySpend = moneySpend + $1 WHERE id = $2`;
            await client.query(updateClientMoneySpendText, [sum, clientId]);

            // Update Client's Bonus
            const updateClientBonusText = `UPDATE client SET bonus = bonus + $1 WHERE id = $2`;
            await client.query(updateClientBonusText, [bonus, clientId]);

            await client.query('COMMIT');

            res.send('Check created, Client MoneySpend updated, and Bonus updated successfully!');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Failed to create Check:', error);
        res.status(500).send('Failed to create Check: ' + error.message);
    }
}

async function updateCheck(req, res) {
    const { id, sum, date, paymentType, clientId } = req.body;
    try {
        const client = await pool.connect();
        const sql = `UPDATE check_ SET sum = $1, date = $2, paymentType = $3, clientId = $4 WHERE id = $5`;
        await client.query(sql, [sum, date, paymentType, clientId, id]);
        res.send('Check updated successfully!');
    } catch (error) {
        console.error('Failed to update Check:', error);
        res.status(500).send('Failed to update Check: ' + error.message);
    }
}

async function deleteCheck(req, res) {
    const id = req.params.id;
    try {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // Retrieve the check to get the sum and clientId before deletion
            const selectCheckText = 'SELECT sum, clientId FROM check_ WHERE id = $1';
            const selectCheckResult = await client.query(selectCheckText, [id]);

            if (selectCheckResult.rows.length === 0) {
                return res.status(404).send('Check not found');
            }

            const { sum, clientId } = selectCheckResult.rows[0];

            const deleteCheckText = 'DELETE FROM check_ WHERE id = $1';
            await client.query(deleteCheckText, [id]);

            // Update Client's MoneySpend
            const updateClientMoneySpendText = `UPDATE client SET moneySpend = moneySpend - $1 WHERE id = $2`;
            await client.query(updateClientMoneySpendText, [sum, clientId]);

            await client.query('COMMIT');

            res.send('Check deleted and Client MoneySpend updated successfully!');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Failed to delete Check:', error);
        res.status(500).send('Failed to delete Check: ' + error.message);
    }
}

module.exports = {
    getAllChecks,
    getCheckById,
    createCheck,
    updateCheck,
    deleteCheck
};
