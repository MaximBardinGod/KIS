const { connectToDatabase } = require('../dbConfig');

async function getAllSpecifications(req, res) {
    try {
        const conn = await connectToDatabase();
        conn.query('SELECT * FROM Specification', (err, results) => {
            if (err) throw err;
            res.json(results);
        });
    } catch (error) {
        res.status(500).send('Failed to retrieve data: ' + error.message);
    }
}

async function getSpecificationById(req, res) {
    const id = req.params.id;
    try {
        const conn = await connectToDatabase();
        conn.query(`SELECT * FROM Specification WHERE Id = ${id}`, (err, results) => {
            if (err) throw err;
            res.json(results[0] || {});
        });
    } catch (error) {
        res.status(500).send('Failed to retrieve data: ' + error.message);
    }
}

async function createSpecification(req, res) {
    const { ParentId, Description, QuantityPerParent, Measure } = req.body;
    try {
        console.log('Parameters:', ParentId, Description, QuantityPerParent, Measure);
        const conn = await connectToDatabase();
        const sql = `INSERT INTO Specification ( ParentId, Description, QuantityPerParent, Measure) VALUES ( ?, ?, ?, ?)`;
        conn.query(sql, [ParentId, Description, QuantityPerParent, Measure], (err, result) => {
            if (err) throw err;
            res.send('Specification created successfully!');
            console.log('Specification created successfully!');
        });
    } catch (error) {
        res.status(500).send('Failed to create Specification: ' + error.message);
    }
}



async function updateSpecification(req, res) {
    const { Id, ParentId, Description, QuantityPerParent, Measure } = req.body;
    try {
        console.log('Parameters:', Id, ParentId, Description, QuantityPerParent, Measure);
        const conn = await connectToDatabase();
        const sql = `UPDATE Specification SET ParentId = ?, Description = ?, QuantityPerParent = ?, Measure = ? WHERE Id = ?`;
        conn.query(sql, [ParentId, Description, QuantityPerParent, Measure, Id], (err, result) => {
            if (err) {
                console.error('Failed to execute SQL query:', err);
                return res.status(500).send('Failed to update Specification');
            }
            return res.send('Specification updated successfully!');
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Failed to update Specification');
    }
}

async function deleteSpecification(req, res) {
    const { id } = req.params;
    try {
        const conn = await connectToDatabase();
        const sql = `WITH RecursiveDelete AS (
            SELECT Id
            FROM specification
            WHERE Id = ?
            
            UNION ALL
            
            SELECT t.Id
            FROM specification t
            INNER JOIN RecursiveDelete rd ON t.ParentId = rd.Id
            )
            DELETE FROM specification
            WHERE Id IN (SELECT Id FROM RecursiveDelete);`;
        conn.query(sql, [id], (err, result) => {
            if (err) throw err;
            res.send('Specification deleted successfully!');
        });
    } catch (error) {
        res.status(500).send('Failed to delete data: ' + error.message);
    }
}

module.exports = {
    getAllSpecifications,
    getSpecificationById,
    createSpecification,
    updateSpecification,
    deleteSpecification
};
