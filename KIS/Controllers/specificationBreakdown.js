const { connectToDatabase } = require('../dbConfig');

async function getSpecificationBreakdown(req, res) {
  const { id } = req.params;
  
  const sqlQuery = `
    DECLARE @RootId INT = ?;

    WITH Subcomponents AS (
      SELECT
        Id,
        ParentId,
        Description,
        Measure,
        CAST(1.0 AS FLOAT) AS TotalRequired
      FROM specification
      WHERE Id = @RootId

      UNION ALL

      SELECT
        s.Id,
        s.ParentId,
        s.Description,
        s.Measure,
        CAST(sc.TotalRequired * s.QuantityPerParent AS FLOAT) AS TotalRequired
      FROM specification s
      INNER JOIN Subcomponents sc ON s.ParentId = sc.Id
    ),
    LeafComponents AS (
      SELECT *
      FROM Subcomponents
      WHERE NOT EXISTS (
        SELECT 1
        FROM specification
        WHERE ParentId = Subcomponents.Id
      )
    )
    SELECT
      Id,
      ParentId,
      Description,
      Measure,
      SUM(TotalRequired) AS TotalRequiredForProduction
    FROM LeafComponents
    GROUP BY Id, ParentId, Description, Measure
    OPTION (MAXRECURSION 0);
  `;

  try {
    const conn = await connectToDatabase();
    conn.query(sqlQuery, [id], (err, results) => {
      if (err) {
        console.error('Ошибка при выполнении SQL-запроса:', err);
        return res.status(500).json({ error: 'Ошибка при выполнении SQL-запроса' });
      }
      res.json(results);
    });
  } catch (error) {
    console.error('Ошибка при подключении к базе данных:', error);
    res.status(500).json({ error: 'Ошибка при подключении к базе данных' });
  }
}

module.exports = {
  getSpecificationBreakdown
};
