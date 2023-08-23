import express from 'express';
import cors from 'cors';
import pg from 'pg';

const { Pool } = pg;

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5001;

console.log('Rodando');

const pool = new Pool({
  user: 'postgres',
  password: 'Shift1234',
  host: 'localhost',
  port: 5432,
  database: 'postgres'
});

app.get('/', async (req, res) => {
  try {
    // Execute a sample SQL query (replace with your own query)
    const sqlQuery = 'SELECT * FROM contagem'; // Replace with your table name

    const client = await pool.connect();
    const result = await client.query(sqlQuery);

    // Release the client back to the pool
    client.release();

    // Process and send the query results as a JSON response
    res.json(result.rows);
  } catch (error) {
    console.error('Error executing SQL query:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/postSensor', async (req, res) => {

  const { id, epoch, dir } = req.body;

  if (id == new Guid("123e4567-e89b-12d3-a456-426655440000")) {

    const sqlQuery = "UPDATE sensor SET ativo = " + dir + " WHERE id = '123e4567-e89b-12d3-a456-426655440000'";
    const client = await pool.connect();
    const result = await client.query(sqlQuery);

    client.release();
    res.json(result.rows);

  }

  else {

    const sqlQuery = "UPDATE sensor SET ativo = " + dir + " WHERE id = '123e4567-e89b-12d3-a456-426655440001'";
    const client = await pool.connect();
    const result = await client.query(sqlQuery);

    client.release();
    res.json(result.rows);

  }

  const sqlQuery = 'SELECT * compare()';

  const client = await pool.connect();
  await client.query(sqlQuery);


  
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});