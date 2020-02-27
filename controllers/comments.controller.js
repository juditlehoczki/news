const {
  updateCommentById,
  removeCommentById,
  fetchCommentsByArticleId,
  addComment
} = require("../models/comments.models.js");

const patchCommentById = (req, res, next) => {
  updateCommentById(req.params, req.body)
    .then(comment => res.send({ comment }))
    .catch(err => next(err));
};
const deleteCommentById = (req, res, next) => {
  removeCommentById(req.params)
    .then(() => res.status(204).send())
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

module.exports = {
  patchCommentById,
  deleteCommentById,
  postComment,
  getCommentsByArticleId
};
