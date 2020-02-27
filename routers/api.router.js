const apiRouter = require("express").Router();
const topicsRouter = require("./topics.router.js");
const usersRouter = require("./users.router.js");
const articlesRouter = require("./articles.router.js");
const commentsRouter = require("./comments.router.js");
const { getAPIDescription } = require("../controllers/api.controllers.js");
const { handle405Errors, teaPot } = require("../errors/index.js");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

apiRouter
  .route("/")
  .get(getAPIDescription)
  .all(handle405Errors);

apiRouter.use("/teapot", teaPot);

module.exports = apiRouter;
