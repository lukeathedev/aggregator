import config from "./config";
import "dotenv/config";

const log = require("simple-node-logger").createSimpleLogger();
log.setLevel(config.log.level);

import express from "express";

const app = express();
const host = String(process.env.HOST);
const port = Number(process.env.PORT);
app.listen(port, host, () => {
  log.info(`Listening on ${host}:${port}`)
})

app.get("/", (req, res) => {
  return res.send("Hello :)")
})

app.get("/scrape", (req, res) => {
  return res.send("scrape :)")
})