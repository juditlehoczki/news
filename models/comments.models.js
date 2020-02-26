const connection = require("../db/connection.js");

const updateCommentById = ({ comment_id }, { inc_votes }) => {
  return connection("comments")
    .first("*")
    .where({ comment_id })
    .increment("votes", inc_votes)
    .returning("*")
    .then(commentRows => commentRows[0]);
};

const removeCommentById = ({ comment_id }) => {
  console.log("hello>>>>");
  return connection("comments")
    .where("comment_id", comment_id)
    .del();
  // .returning("*")
  // .then(console.log);
};

module.exports = { updateCommentById, removeCommentById };
