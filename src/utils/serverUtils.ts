import { type Application } from "express";
import type { Server } from "http";
import { type Sql } from "postgres";
import "dotenv/config";

const establishDBConn = async (sql: Sql) => {
  try {
    const conn = await sql`Select 1`;
    console.log("DB connection established correctly");
  } catch (error) {
    throw new Error(
      "Issue while connection to database: " + (error as Error).message,
    );
  }
};

export const startServer = async (app: Application, sql: Sql) => {
  const PORT = process.env.PORT;
  let server;
  try {
    await establishDBConn(sql);
    server = app.listen(PORT, () => {
      console.log(`Server started successfully at port: ${PORT}`);
    });
  } catch (error) {
    throw new Error(
      "Issue while starting the server: " + (error as Error).message,
    );
  }
  return server;
};

const shutdown = async (server: Server, sql: Sql, signal: string) => {
    console.log(`${signal} signal received: closing HTTP server...`);
    server.close(async () => {
      console.log("HTTP Server is closed");
      try {
        console.log("Closing SQL connection...");
        await sql.end();
        console.log("Database connections closed successfully.");

        process.exit(0);
      } catch (error) {
        console.error("Issue while closing the database: ", error);
        process.exit(1);        
      }
    });
}

export const handleShutdown = (server: Server, sql: Sql) => {
  process.on("SIGTERM", async () => {
    await shutdown(server, sql, "SIGTERM");
  });
  process.on("SIGINT", async () => {
    await shutdown(server, sql, "SIGINT");
  });
};
