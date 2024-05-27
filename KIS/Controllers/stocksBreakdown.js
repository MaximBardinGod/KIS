const { connectToDatabase } = require('../dbConfig');

async function getStocksBreakdown(req, res) {
  const { id } = req.params;
  
  const sqlQuery = `
  DECLARE @DateOperation DATE = CAST('2024-05-14' AS DATE); 

    WITH InitialStock AS (
    SELECT
        SpecificationId,
        SUM(Receivedquantity) - SUM(Shippedquantity) AS TotalQuantity
    FROM Stock
    WHERE Dateoperation <= @DateOperation
    GROUP BY SpecificationId
),
RecursiveComponents AS (
    SELECT
        s.Id,
        s.ParentId,
        s.Description,
        s.Measure,
        CAST(ISNULL(st.TotalQuantity, 0) AS FLOAT) AS TotalQuantity,
        CASE 
            WHEN EXISTS(SELECT 1 FROM Specification WHERE ParentId = s.Id) THEN 0 
            ELSE 1 
        END AS IsLeaf
    FROM Specification s
    LEFT JOIN InitialStock st ON s.Id = st.SpecificationId

    UNION ALL

    SELECT
        s.Id,
        s.ParentId,
        s.Description,
        s.Measure,
        CAST(rc.TotalQuantity * s.QuantityPerParent AS FLOAT) AS TotalQuantity,
        rc.IsLeaf
    FROM Specification s
    INNER JOIN RecursiveComponents rc ON s.ParentId = rc.Id
),
AggregatedComponents AS (
    SELECT
        Id,
        Description,
        Measure,
        SUM(TotalQuantity) AS TotalQuantity,
        MAX(IsLeaf) AS IsLeaf
    FROM RecursiveComponents
    GROUP BY Id, Description, Measure
)
SELECT Id, Description AS Description1, Measure, TotalQuantity AS TotalQuantity1
FROM AggregatedComponents
WHERE TotalQuantity > 0 AND IsLeaf = 1
ORDER BY Id
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
  getStocksBreakdown
};
