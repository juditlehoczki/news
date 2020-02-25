const express = require("express");
const apiRouter = require("./routers/api.router.js");

const app = express();

app.use("/api", apiRouter);

module.exports = app;
