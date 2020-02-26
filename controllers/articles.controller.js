const {
  fetchArticleById,
  updateArticleById,
  addComment,
  fetchCommentsByArticleId,
  fetchArticles
} = require("../models/articles.models.js");

const getArticleById = (req, res, next) => {
  fetchArticleById(req.params)
    .then(article => res.send({ article }))
    .catch(err => next(err));
};

const patchArticleById = (req, res, next) => {
  updateArticleById(req.params, req.body)
    .then(article => res.send({ article }))
    .catch(err => next(err));
};

const postComment = (req, res, next) => {
  addComment(req.params, req.body)
    .then(comment => res.status(201).send({ comment }))
    .catch(err => next(err));
};

const getCommentsByArticleId = (req, res, next) => {
  fetchCommentsByArticleId(req.params, req.query)
    .then(comments => res.send({ comments }))
    .catch(err => next(err));
};

const getArticles = (req, res, next) => {
  fetchArticles(req.query)
    .then(articles => res.send({ articles }))
    .catch(err => next(err));
};

module.exports = {
  getArticleById,
  patchArticleById,
  postComment,
  getCommentsByArticleId,
  getArticles
};
