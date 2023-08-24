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
  connectionString: "postgres://default:klDvRcZun0G2@ep-curly-bush-26450901-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require",
});

const tableCreate = new Pool({
  connectionString: "postgres://default:klDvRcZun0G2@ep-curly-bush-26450901-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require",
});

let createTableQuery = `
CREATE TABLE IF NOT EXISTS public.contagem
(
    id integer NOT NULL,
    entrada timestamp without time zone NOT NULL,
    saida timestamp without time zone,
    contador integer,
    total integer,
    CONSTRAINT contagem_pkey PRIMARY KEY (id)
);`;

tableCreate.query(createTableQuery, (error, results) => {
  if (error) {
    console.error('Error creating the table:', error);
  } else {
    console.log('Table created successfully');
  }
});

createTableQuery =
  `CREATE TABLE IF NOT EXISTS public.sensor
(
    id uuid NOT NULL,
    contador integer,
    ativo integer NOT NULL DEFAULT 0,
    CONSTRAINT sensor_pkey PRIMARY KEY (id)
);`;

pool.query(createTableQuery, (error, results) => {
  if (error) {
    console.error('Error creating the table:', error);
  } else {
    console.log('Table created successfully');
  }
});

let createFunctionSQL = `
CREATE OR REPLACE FUNCTION public.compare(
	)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
contadorIF integer;
	ativoSensorUm integer;
	ativoSensorDois integer;
BEGIN
	SELECT ativo INTO ativoSensorUm FROM sensor WHERE id = '123e4567-e89b-12d3-a456-426655440000';
	SELECT ativo INTO ativoSensorDois FROM sensor WHERE id = '123e4567-e89b-12d3-a456-426655440001';
	CASE
		
		WHEN ativoSensorUm = 2 THEN
			UPDATE sensor
			SET ativo = 0
			WHERE id = '123e4567-e89b-12d3-a456-426655440000';
			
			UPDATE sensor
			SET ativo = 0
			WHERE id = '123e4567-e89b-12d3-a456-426655440001';
			
			UPDATE contagem
    		SET contador = contador + 1, total = total + 1
			WHERE id = 1;
			
		WHEN ativoSensorDois = 2 THEN
			UPDATE sensor
			SET ativo = 0
			WHERE id = '123e4567-e89b-12d3-a456-426655440001';
			
			UPDATE sensor
			SET ativo = 0
			WHERE id = '123e4567-e89b-12d3-a456-426655440000';
			
			SELECT contador INTO contadorIF FROM contagem WHERE id = 1;
				IF contadorIF = 1 THEN
        		UPDATE contagem
    			SET 
				contador = 0, saida = CURRENT_TIMESTAMP
			WHERE id = 1;
    ELSE
        UPDATE contagem
    	SET contador = contador - 1
		WHERE id = 1;
    END IF;
			
        WHEN ativoSensorUm = 1 THEN
			UPDATE sensor
			SET ativo = 2
			WHERE id = '123e4567-e89b-12d3-a456-426655440000';
			
        WHEN ativoSensorDois = 1 THEN
			UPDATE sensor
			SET ativo = 2
			WHERE id = '123e4567-e89b-12d3-a456-426655440001';
			
        ELSE
        UPDATE sensor
        SET ativo = 0
        WHERE id = '123e4567-e89b-12d3-a456-426655440001';
        
        UPDATE sensor
			SET ativo = 0
			WHERE id = '123e4567-e89b-12d3-a456-426655440000';
			
      END CASE;
      END;
      $BODY$;
      `;

pool.query(createFunctionSQL, (error, results) => {
  if (error) {
    console.error('Error creating the function:', error);
  } else {
    console.log('Function created successfully');
  }
});

createFunctionSQL = `
  CREATE OR REPLACE FUNCTION public.entrada_pessoa(
	)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
    UPDATE contagem
    SET contador = contador + 1, total = total + 1
	WHERE id = 1;
END;
$BODY$;
CREATE OR REPLACE FUNCTION public.saida_pessoa(
	)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    contadorIF integer;
BEGIN
	SELECT contador INTO contadorIF FROM contagem WHERE id = 1;
	IF contadorIF = 1 THEN
        UPDATE contagem
    	SET 
			contador = 0, saida = CURRENT_TIMESTAMP
		WHERE id = 1;
    ELSE
        UPDATE contagem
    	SET contador = contador - 1
		WHERE id = 1;
    END IF;
END;
$BODY$;
`;

pool.query(createFunctionSQL, (error, results) => {
  if (error) {
    console.error('Error creating the function:', error);
  } else {
    console.log('Function created successfully');
  }
});

createFunctionSQL = `
CREATE OR REPLACE FUNCTION public.saida_pessoa(
	)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    contadorIF integer;
BEGIN
	SELECT contador INTO contadorIF FROM contagem WHERE id = 1;
	IF contadorIF = 1 THEN
        UPDATE contagem
    	SET 
			contador = 0, saida = CURRENT_TIMESTAMP
		WHERE id = 1;
    ELSE
        UPDATE contagem
    	SET contador = contador - 1
		WHERE id = 1;
    END IF;
END;
$BODY$;
`;

// let insertInto = `
// INSERT INTO sensor values ('123e4567-e89b-12d3-a456-426655440001', NULL, 0);
// `;

// pool.query(insertInto, (error, results) => {
//   if (error) {
//     console.error('Error insert sensor:', error);
//   } else {
//     console.log('Sensor cadastrado');
//   }
// });

// insertInto = `
// INSERT INTO sensor values ('123e4567-e89b-12d3-a456-426655440000', NULL, 0);
// `;

// pool.query(insertInto, (error, results) => {
//   if (error) {
//     console.error('Error insert sensor:', error);
//   } else {
//     console.log('Sensor cadastrado');
//   }
// });

// let insertInto = `
// INSERT INTO contagem VALUES (1, CURRENT_TIMESTAMP, NULL, 0, 0)
// `;

// pool.query(insertInto, (error, results) => {
//   if (error) {
//     console.error('Error insert Contagem:', error);
//   } else {
//     console.log('Contagem cadastrada');
//   }
// });

// let insertInto = `
// DELETE FROM contagem
// WHERE id = 1;
// `;

// pool.query(insertInto, (error, results) => {
//   if (error) {
//     console.error('Error delete Contagem:', error);
//   } else {
//     console.log('Contagem delete');
//   }
// });

app.get('/get', async (req, res) => {

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

  res.json({
    Contador: contagem,
    Sensores: sensor,
  });

});

app.post('/postSensor', async (req, res) => {

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

  res.json(response)

});

const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});