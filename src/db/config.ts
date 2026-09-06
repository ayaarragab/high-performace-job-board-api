import postgres from 'postgres';
import 'dotenv/config';

const host = process.env.DB_HOST;
const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;


if (!host || !database || !user) {
  throw new Error("Missing database connection credentials in .env file");
}

const sql = postgres({
  host, 
  port,
  database,
  user,
  password
});

export default sql;