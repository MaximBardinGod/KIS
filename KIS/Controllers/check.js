const { connectToDatabase } = require('../dbConfig');

async function getAllChecks(req, res) {
    try {
        const conn = await connectToDatabase();
        conn.query('SELECT * FROM [Check_]', (err, results) => {
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

async function getCheckById(req, res) {
    const id = req.params.id;
    try {
        const conn = await connectToDatabase();
        conn.query('SELECT * FROM [Check_] WHERE Id = ?', [id], (err, results) => {
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

async function createCheck(req, res) {
  const { Sum, Date, PaymentType, ClientId } = req.body;
  try {
      const conn = await connectToDatabase();

      // Start a transaction
      conn.beginTransaction(async err => {
          if (err) throw err;

          const sql = `INSERT INTO Check_ (Sum, Date, PaymentType, ClientId) VALUES (?, ?, ?, ?)`;
          conn.query(sql, [Sum, Date, PaymentType, ClientId], async (err, result) => {
              if (err) {
                  return conn.rollback(() => {
                      throw err;
                  });
              }

              // Calculate Bonus
              const bonus = Math.round(Sum * 0.01);

              // Update Client's MoneySpend
              const updateClientSql = `UPDATE Client SET MoneySpend = MoneySpend + ? WHERE Id = ?`;
              conn.query(updateClientSql, [Sum, ClientId], async (err, result) => {
                  if (err) {
                      return conn.rollback(() => {
                          throw err;
                      });
                  }

                  // Update Client's Bonus
                  const updateClientBonusSql = `UPDATE Client SET Bonus = Bonus + ? WHERE Id = ?`;
                  conn.query(updateClientBonusSql, [bonus, ClientId], async (err, result) => {
                      if (err) {
                          return conn.rollback(() => {
                              throw err;
                          });
                      }

                      conn.commit(err => {
                          if (err) {
                              return conn.rollback(() => {
                                  throw err;
                              });
                          }
                          res.send('Check created, Client MoneySpend updated, and Bonus updated successfully!');
                      });
                  });
              });
          });
      });
  } catch (error) {
      res.status(500).send('Failed to create Check: ' + error.message);
  }
}


async function updateCheck(req, res) {
    const { Id, Sum, Date, PaymentType, ClientId } = req.body;
    try {
        const conn = await connectToDatabase();
        const sql = `UPDATE Check_ SET Sum = ?, Date = ?, PaymentType = ?, ClientId = ? WHERE Id = ?`;
        conn.query(sql, [Sum, Date, PaymentType, ClientId, Id], (err, result) => {
            if (err) {
                console.error('Failed to execute SQL query:', err);
                return res.status(500).send('Failed to update Check');
            }
            return res.send('Check updated successfully!');
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Failed to update Check');
    }
}

async function deleteCheck(req, res) {
    const { id } = req.params;
    try {
        const conn = await connectToDatabase();

        // Retrieve the check to get the Sum and ClientId before deletion
        conn.query('SELECT Sum, ClientId FROM [Check_] WHERE Id = ?', [id], (err, results) => {
            if (err) throw err;

            if (results.length === 0) {
                return res.status(404).send('Check not found');
            }

            const { Sum, ClientId } = results[0];

            // Start a transaction
            conn.beginTransaction(err => {
                if (err) throw err;

                const sql = 'DELETE FROM [Check_] WHERE Id = ?';
                conn.query(sql, [id], (err, result) => {
                    if (err) {
                        return conn.rollback(() => {
                            throw err;
                        });
                    }

                    // Update Client's MoneySpend
                    const updateClientSql = `UPDATE Client SET MoneySpend = MoneySpend - ? WHERE Id = ?`;
                    conn.query(updateClientSql, [Sum, ClientId], (err, result) => {
                        if (err) {
                            return conn.rollback(() => {
                                throw err;
                            });
                        }

                        // Commit the transaction
                        conn.commit(err => {
                            if (err) {
                                return conn.rollback(() => {
                                    throw err;
                                });
                            }
                            res.send('Check deleted and Client MoneySpend updated successfully!');
                        });
                    });
                });
            });
        });
    } catch (error) {
        res.status(500).send('Failed to delete data: ' + error.message);
    }
}

module.exports = {
    getAllChecks,
    getCheckById,
    createCheck,
    updateCheck,
    deleteCheck
};
