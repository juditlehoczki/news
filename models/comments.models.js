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

const addComment = ({ article_id }, { username, body }) => {
  const updateObj = { article_id, username, body };
  updateObj.author = username;
  delete updateObj.username;
  return connection("comments")
    .insert(updateObj)
    .returning("*")
    .then(commentRows => commentRows[0]);
};

// move to comments models
const fetchCommentsByArticleId = ({ article_id }, { sort_by, order }) => {
  if (order === "asc" || order === "desc" || order === undefined) {
    return (
      connection("comments")
        //USE MODIFY!!
        .where({ article_id })
        .select("comment_id", "votes", "created_at", "author", "body")
        .orderBy(sort_by || "created_at", order || "desc")
        .then(commentsRows => {
          // let houseQuery;
          if (commentsRows.length === 0) {
            //checking whether the article doesn't exist or it does but has no comments

            //articleQuery = connection("articles").select("*").where({article_id})

            return Promise.reject({ status: 404, msg: "No Comments Found." });
          } else {
            return commentsRows;
            //articleQuery = true;
          }
          // return Promise.all([commentRows, articleQuery])
        })
    );
    //have to do another .then outside this one with a Promise.all([]) to make sure both promises returned when resolved
    //.then(([comments, articleExists]) => {if (articleExists) return comments
    //else return Promise.reject({status: 404})})
  } else {
    return Promise.reject({
      status: 400,
      msg: `Trying To Sort By "${order}" Is Not Valid.`
    });
  }
};

module.exports = {
  updateCommentById,
  removeCommentById,
  addComment,
  fetchCommentsByArticleId
};
