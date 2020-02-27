const connection = require("../db/connection.js");
const { checkIfExists } = require("../db/utils/utils.js");

const updateCommentById = ({ comment_id }, { inc_votes }) => {
  return connection("comments")
    .first("*")
    .where({ comment_id })
    .increment("votes", inc_votes || 0)
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

const addComment = ({ article_id }, { username, body }) => {
  const updateObj = { article_id, username, body };
  updateObj.author = username;
  delete updateObj.username;
  return connection("comments")
    .insert(updateObj)
    .returning("*")
    .then(commentRows => commentRows[0]);
};

const fetchCommentsByArticleId = ({ article_id }, { sort_by, order }) => {
  if (order !== "asc" && order !== "desc" && order !== undefined) {
    return Promise.reject({
      status: 400,
      msg: `Trying To Order By "${order}" Is Not Valid.`
    });
  } else {
    return connection("comments")
      .where({ article_id })
      .select("comment_id", "votes", "created_at", "author", "body")
      .orderBy(sort_by || "created_at", order || "desc")
      .then(commentsRows => {
        const existsOrNot = checkIfExists(article_id, "article_id", "articles");
        return Promise.all([existsOrNot, commentsRows]);
      })
      .then(([existsOrNot, commentsRows]) => {
        if (existsOrNot === 0) {
          return Promise.reject({ status: 404, msg: "Article Doesn't Exist." });
        } else {
          return commentsRows;
        }
      });
  }
};

module.exports = {
  updateCommentById,
  removeCommentById,
  addComment,
  fetchCommentsByArticleId
};
