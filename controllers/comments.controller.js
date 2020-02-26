const { updateCommentById } = require("../models/comments.models.js");

const patchCommentById = (req, res, next) => {
  updateCommentById(req.params, req.body)
    .then(comment => res.send({ comment }))
    .catch(err => next(err));
};

module.exports = { patchCommentById };
