import { type Application } from "express";
import type { Server } from "http";
import { type Sql } from "postgres";
import startDB from "../db/dbInit.js";
import "dotenv/config";


export const startServer = async (app: Application, sql: Sql) => {
  const PORT = process.env.PORT;

  let server;
  try {
    await startDB(sql);
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
