const articlesRouter = require("express").Router();
const { handle405Errors, handleWrongRoute } = require("../errors/index.js");
const {
  getArticleById,
  patchArticleById,
  getArticles
} = require("../controllers/articles.controller.js");

const {
  postComment,
  getCommentsByArticleId
} = require("../controllers/comments.controller.js");

articlesRouter
  .route("/")
  .get(getArticles)
  .all(handle405Errors);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .all(handle405Errors);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(getCommentsByArticleId)
  .all(handle405Errors);

articlesRouter.route("/*", handleWrongRoute);

module.exports = articlesRouter;
