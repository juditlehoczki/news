const express = require('express');
const cors = require('cors');
const apiRouter = require('./routers/api.router.js');

const {
  handlePSQLErrors,
  handleCustomErrors,
  handle500Errors,
  handleWrongRoute
} = require('./errors/index.js');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);
app.use('/*', handleWrongRoute);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handle500Errors);

module.exports = app;
