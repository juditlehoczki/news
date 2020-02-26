const apiRouter = require("express").Router();
const topicsRouter = require("./topics.router.js");
const usersRouter = require("./users.router.js");
const articlesRouter = require("./articles.router.js");
const commentsRouter = require("./comments.router.js");
const { handleWrongRoute, teaPot } = require("../errors/index.js");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

apiRouter.use("/teapot", teaPot);

apiRouter.use("/*", handleWrongRoute);

module.exports = apiRouter;
