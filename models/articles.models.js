const connection = require("../db/connection.js");

const fetchArticleById = ({ article_id }) => {
  //send a query to comments where article_id = article_id
  //use length of this array as comment_count
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

module.exports = { fetchArticleById };
