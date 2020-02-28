// const dbConfig = require("../knexfile.js");

// const knex = require("knex");

// const connection = knex(dbConfig);

// module.exports = connection;

const ENV = process.env.NODE_ENV || "development";
const knex = require("knex");

const dbConfig =
  ENV === "production"
    ? { client: "pg", connection: process.env.DATABASE_URL }
    : require("../knexfile.js");

module.exports = knex(dbConfig);

// why am I not setting this up in the knexfile.js?
