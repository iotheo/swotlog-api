import { Pool } from 'pg';

const config = {
  user: process.env.DATABASE_USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
};

const pool = new Pool(config);

pool.on('connect', () => {
  console.log('Connected to Database!');
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export {
  pool,
};
