const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topics.controllers.js");
const { handleWrongRoute } = require("../errors/index.js");

topicsRouter.route("/").get(getTopics);
topicsRouter.use("/*", handleWrongRoute);

module.exports = topicsRouter;
