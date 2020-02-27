const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topics.controllers.js");
const { handle405Errors } = require("../errors/index.js");

topicsRouter
  .route("/")
  .get(getTopics)
  .all(handle405Errors);

module.exports = topicsRouter;
