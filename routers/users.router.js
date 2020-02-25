const usersRouter = require("express").Router();
const { getUserByUsername } = require("../controllers/users.controllers.js");
const { handleWrongRoute } = require("../errors/index.js");

usersRouter.use("/:username", getUserByUsername);
usersRouter.use("/*", handleWrongRoute);

module.exports = usersRouter;
