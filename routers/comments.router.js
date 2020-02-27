const commentsRouter = require("express").Router();
const { handle405Errors, handleWrongRoute } = require("../errors/index.js");
const {
  patchCommentById,
  deleteCommentById
} = require("../controllers/comments.controller.js");

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentById)
  .delete(deleteCommentById)
  .all(handle405Errors);

commentsRouter.route("/*", handleWrongRoute);

module.exports = commentsRouter;
