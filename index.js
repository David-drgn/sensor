import express, { response } from 'express';
import cors from 'cors';
import pg from 'pg';
import { v4 as uuidv4 } from 'uuid';

const { Pool } = pg;

const app = express();
app.use(express.json());
app.use(cors());

console.log('Rodando');

const pool = new Pool({
  connectionString: "postgres://default:HwfDaIVR6Op8@ep-mute-fog-73040295-pooler.ap-southeast-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require",
});

app.get('/oi', (req, res) => {
  return res.json("oi")
});

app.get('/getRodando', (req, res) => {
  return res.json("Rodando")
});

app.get('/', async (req, res) => {

  let contagem;
  let sensor;

  try {
    const sqlQuery = 'SELECT * FROM sensor';

    const client = await pool.connect();
    const result = await client.query(sqlQuery);

    client.release();

    sensor = result.rows.map((row) => {
      return {
        id: row.id,
        ativo: row.ativo,
      };
    });

  } catch (error) {
    console.error('Error executing SQL query:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

  try {
    const sqlQuery = 'SELECT * FROM contagem';

    const client = await pool.connect();
    const result = await client.query(sqlQuery);

    client.release();

    contagem = result.rows.map((row) => {
      return {
        total: row.total,
        contagem: row.contador,
        horaEntrada: row.entrada,
        horaSaida: row.saida,
      };
    });

  } catch (error) {
    console.error('Error executing SQL query:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

  return res.json({
    Contador: contagem,
    Sensores: sensor,
  });

});

app.post('/', async (req, res) => {

  const { id, epoch, dir } = req.body;

  let response;

  if (id == "123e4567-e89b-12d3-a456-426655440000") {

    const sqlQuery = "UPDATE sensor SET ativo = " + dir + " WHERE id = '123e4567-e89b-12d3-a456-426655440000'";
    const client = await pool.connect();
    await client.query(sqlQuery);

    client.release();

    response = "Sensor de entrada";

  }

  else {

    const sqlQuery = "UPDATE sensor SET ativo = " + dir + " WHERE id = '123e4567-e89b-12d3-a456-426655440001'";
    const client = await pool.connect();
    await client.query(sqlQuery);

    client.release();

    response = "Sensor de saida";
  }

  const sqlQuery = 'SELECT compare()';

  const client = await pool.connect();
  await client.query(sqlQuery);

  return res.json(response)

});

const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});