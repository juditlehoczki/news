const connection = require("../db/connection.js");

const fetchArticleById = ({ article_id }) => {
  return connection
    .select("articles.*")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
    .groupBy("articles.article_id")
    .count({ comment_count: "comments.article_id" })
    .modify(queryBuilder => {
      return queryBuilder.where("articles.article_id", article_id);
    })
    .then(articleRows => {
      if (articleRows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article Not Found." });
      } else {
        return articleRows[0];
      }
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

const fetchArticles = ({ sort_by, order, author, topic }) => {
  if (order === "asc" || order === "desc" || order === undefined) {
    return connection
      .select(
        "articles.article_id",
        "articles.title",
        "articles.votes",
        "articles.topic",
        "articles.author",
        "articles.created_at"
      )
      .from("articles")
      .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
      .groupBy("articles.article_id")
      .count({ comment_count: "comments.article_id" })
      .orderBy(sort_by || "created_at", order || "desc")
      .modify(queryBuilder => {
        if (author === undefined) queryBuilder;
        else queryBuilder.where("articles.author", author);
      })
      .modify(queryBuilder => {
        if (topic === undefined) queryBuilder;
        else queryBuilder.where("articles.topic", topic);
      })
      .then(articleRows => {
        if (articleRows.length === 0) {
          return connection("users")
            .where("username", author)
            .then(usersRows => {
              if (usersRows.length === 0) {
                return Promise.reject({
                  status: 404,
                  msg: "User doesn't exist."
                });
              } else {
                return articleRows;
              }
            });
        } else {
          return articleRows;
        }
      });
  } else {
    return Promise.reject({
      status: 400,
      msg: `Trying To Sort By "${order}" Is Not Valid.`
    });
  }
};

module.exports = {
  fetchArticleById,
  updateArticleById,
  fetchArticles
};
