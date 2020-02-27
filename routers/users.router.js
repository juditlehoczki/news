const usersRouter = require("express").Router();
const { getUserByUsername } = require("../controllers/users.controllers.js");
const { handle405Errors, handleWrongRoute } = require("../errors/index.js");

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(handle405Errors);

usersRouter.use("/*", handleWrongRoute);

module.exports = usersRouter;
