const connection = require("../db/connection.js");

const updateCommentById = ({ comment_id }, { inc_votes }) => {
  return connection("comments")
    .first("*")
    .where({ comment_id })
    .increment("votes", inc_votes)
    .returning("*")
    .then(commentRows => commentRows[0]);
};

module.exports = { updateCommentById };
