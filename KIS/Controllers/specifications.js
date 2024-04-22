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
        const conn = await connectToDatabase();
        const sql = `INSERT INTO Specification (ParentId, Description, QuantityPerParent, Measure) VALUES (?, ?, ?, ?)`;
        conn.query(sql, [ParentId, Description, QuantityPerParent, Measure], (err, result) => {
            if (err) throw err;
            res.send('Specification added successfully!');
        });
    } catch (error) {
        res.status(500).send('Failed to create data: ' + error.message);
    }
}

async function updateSpecification(req, res) {
    const { Id, ParentId, Description, QuantityPerParent, Measure } = req.body;
    try {
        const conn = await connectToDatabase();
        const sql = `UPDATE Specification SET ParentId = ?, Description = ?, QuantityPerParent = ?, Measure = ? WHERE Id = ?`;
        conn.query(sql, [ParentId, Description, QuantityPerParent, Measure, Id], (err, result) => {
            if (err) throw err;
            res.send('Specification updated successfully!');
        });
    } catch (error) {
        res.status(500).send('Failed to update data: ' + error.message);
    }
}

async function deleteSpecification(req, res) {
    const { id } = req.params;
    try {
        const conn = await connectToDatabase();
        const sql = `DELETE FROM Specification WHERE Id = ?`;
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
