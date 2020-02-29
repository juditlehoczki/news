const {
  fetchArticleById,
  updateArticleById,
  fetchArticles,
  addArticle,
  removeArticle
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

const getArticles = (req, res, next) => {
  fetchArticles(req.query)
    .then(articles => res.send(articles))
    .catch(err => next(err));
};

const postArticle = (req, res, next) => {
  addArticle(req.body)
    .then(article => res.status(201).send({ article }))
    .catch(err => next(err));
};

const deleteArticle = (req, res, next) => {
  removeArticle(req.params)
    .then(() => res.status(204).send())
    .catch(err => next(err));
};

module.exports = {
  getArticleById,
  patchArticleById,
  getArticles,
  postArticle,
  deleteArticle
};
