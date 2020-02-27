const usersRouter = require("express").Router();
const { getUserByUsername } = require("../controllers/users.controllers.js");
const { handle405Errors } = require("../errors/index.js");

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(handle405Errors);

module.exports = usersRouter;
