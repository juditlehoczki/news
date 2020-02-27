const connection = require("../db/connection.js");

const updateCommentById = ({ comment_id }, { inc_votes }) => {
  return connection("comments")
    .first("*")
    .where({ comment_id })
    .increment("votes", inc_votes)
    .returning("*")
    .then(commentRows => {
      if (commentRows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment Not Found." });
      } else {
        return commentRows[0];
      }
    });
};

const removeCommentById = ({ comment_id }) => {
  return connection("comments")
    .where("comment_id", comment_id)
    .del()
    .then(rows => {
      if (rows === 0) {
        return Promise.reject({ status: 404, msg: "Comment Not Found." });
      }
    });
};

module.exports = { updateCommentById, removeCommentById };
