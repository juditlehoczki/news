const description = require("../endpoints.json");

const getAPIDescription = (req, res, next) => {
  res.send({ description });
};

module.exports = { getAPIDescription };
