const articlesRouter = require("express").Router();
const {
  getArticleById,
  patchArticleById,
  postComment,
  getCommentsByArticleId,
  getArticles
} = require("../controllers/articles.controller.js");

articlesRouter.route("/").get(getArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(getCommentsByArticleId);

module.exports = articlesRouter;
