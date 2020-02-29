const topicsRouter = require("express").Router();
const {
  getTopics,
  postTopic
} = require("../controllers/topics.controllers.js");
const { handle405Errors } = require("../errors/index.js");

topicsRouter
  .route("/")
  .get(getTopics)
  .post(postTopic)
  .all(handle405Errors);

module.exports = topicsRouter;
