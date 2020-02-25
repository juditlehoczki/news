const {
  fetchArticleById,
  updateArticleById
} = require("../models/articles.models.js");

const getArticleById = (req, res, next) => {
  fetchArticleById(req.params)
    .then(article => res.send({ article }))
    .catch(err => next(err));
};

const patchArticleById = (req, res, next) => {
  // console.log("controller");
  // console.log(req.params, req.body);
  updateArticleById(req.params, req.body)
    .then(article => res.send({ article }))
    .catch(err => next(err));
};

module.exports = { getArticleById, patchArticleById };
