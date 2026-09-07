import express from "express";
import { startServer, handleShutdown } from "./utils/serverUtils.js";
import sql from "./db/config.js";

const app = express();

const server = await startServer(app, sql);

if (!server) {
  throw new Error("Server object doesn't exist!")
}

handleShutdown(server, sql);