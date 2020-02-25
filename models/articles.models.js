const connection = require("../db/connection.js");

const fetchArticleById = ({ article_id }) => {
  return connection("comments")
    .where({ article_id })
    .then(comments => {
      return connection("articles")
        .where({ article_id })
        .select("*")
        .then(articleRows => {
          if (articleRows.length === 0) {
            return Promise.reject({ status: 404, msg: "Article Not Found." });
          } else {
            return { ...articleRows[0], comment_count: comments.length };
          }
        });
    });
};

const updateArticleById = ({ article_id }, update) => {
  if (update.inc_votes === undefined) {
    return Promise.reject({ status: 400, msg: "Invalid Data Type." });
  } else if (Object.keys(update).length !== 1) {
    return Promise.reject({
      status: 400,
      msg: "You Can Only Update Votes."
    });
  } else {
    return connection("articles")
      .where({ article_id })
      .select("votes")
      .then(currentVoteValue => {
        return connection("articles")
          .where({ article_id })
          .update({ votes: currentVoteValue[0].votes + update.inc_votes })
          .returning("*")
          .then(articleRows => {
            return articleRows[0];
          });
      });
  }
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

module.exports = { fetchArticleById, updateArticleById, addComment };
