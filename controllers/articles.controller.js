const {
  fetchArticleById,
  updateArticleById,
  addComment
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

module.exports = { getArticleById, patchArticleById, postComment };
