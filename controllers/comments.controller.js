const {
  updateCommentById,
  removeCommentById
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

module.exports = { patchCommentById, deleteCommentById };
