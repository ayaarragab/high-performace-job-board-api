import express, { type Request, type Response } from 'express';
import sql from './db/config.js';
import 'dotenv/config';

const app = express();

const PORT = process.env.PORT;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: "Hello from Express with TypeScript!" });
});

try {
  const establishDBConn = await sql`Select 1`;
  if (establishDBConn) {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });   
  }
} catch (error) {
  console.log(error);
}