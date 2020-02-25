const { fetchArticleById } = require("../models/articles.models.js");

const getArticleById = (req, res, next) => {
  fetchArticleById(req.params)
    .then(article => res.send({ article }))
    .catch(err => next(err));
};

module.exports = { getArticleById };
