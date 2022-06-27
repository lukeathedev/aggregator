import config from "./config";
import "dotenv/config";

export const log = require("simple-node-logger").createSimpleLogger();
log.setLevel(config.log.level);

import express from "express";
import xls2sql from "./xls2sql";
import { Pool } from "pg";

const shutdown = () => {
  log.info("Shutting down...");
  server.close((err) => {
    process.exit(err ? 1 : 0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

const pool = new Pool();

const app = express();
const host = String(process.env.HOST);
const port = Number(process.env.PORT);
const server = app.listen(port, host, () => {
  log.info(`Listening on ${host}:${port}`);
});

app.get("/", (req, res) => {
  return res.send("Hello :)");
});

app.get("/scrape", (req, res) => {
  return res.send("scrape :)");
});

// TODO: make POST
app.get("/update", async (req, res) => {
  const fn = req.query.file;
  if (!fn) {
    res.status(400);
    res.end();
    return;
  }

  const sql = await xls2sql(`./downloads/${fn}`);

  pool.query(sql, (err, res) => {
    log.info(err, res);
  });
  res.send(fn);
});
