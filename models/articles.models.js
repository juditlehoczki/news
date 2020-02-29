const connection = require("../db/connection.js");
const { checkIfExists, countPosts } = require("../db/utils/utils.js");

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
      .first("*")
      .where({ article_id })
      .increment("votes", update.inc_votes || 0)
      .returning("*")
      .then(articleRows => {
        return articleRows[0];
      });
  }
};

const fetchArticles = ({ sort_by, order, author, topic, limit, p }) => {
  if (order !== "asc" && order !== "desc" && order !== undefined) {
    return Promise.reject({
      status: 400,
      msg: `Trying To Order By "${order}" Is Not Valid.`
    });
  } else {
    let doesAuthorExist;
    let doesTopicExist;
    return connection("articles")
      .select(
        "articles.article_id",
        "articles.title",
        "articles.votes",
        "articles.topic",
        "articles.author",
        "articles.created_at"
      )
      .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
      .groupBy("articles.article_id")
      .count({ comment_count: "comments.article_id" })
      .orderBy(sort_by || "created_at", order || "desc")
      .modify(queryBuilder => {
        if (author === undefined) {
          doesAuthorExist = 0;
          return queryBuilder;
        } else {
          doesAuthorExist = checkIfExists(author, "username", "users");
          return queryBuilder.where("articles.author", author);
        }
      })
      .modify(queryBuilder => {
        if (topic === undefined) {
          doesTopicExist = 0;
          return queryBuilder;
        } else {
          doesTopicExist = checkIfExists(topic, "slug", "topics");
          return queryBuilder.where("articles.topic", topic);
        }
      })
      .limit(limit || 10)
      .offset((p - 1 || 0) * (limit || 10))
      .then(articleRows => {
        if (articleRows.length === 0) {
          return Promise.all([doesAuthorExist, doesTopicExist]).then(
            ([doesAuthorExist, doesTopicExist]) => {
              if (author !== undefined && doesAuthorExist === 0) {
                return Promise.reject({
                  status: 404,
                  msg: "Author Doesn't Exist."
                });
              } else if (topic !== undefined && doesTopicExist === 0) {
                return Promise.reject({
                  status: 404,
                  msg: "Topic Doesn't Exist."
                });
              } else {
                return { articles: articleRows, total_count: 0 };
              }
            }
          );
        } else {
          return countPosts("articles", { topic, author }).then(
            articleCount => {
              return { articles: articleRows, total_count: articleCount };
            }
          );
        }
      });
  }
};

const addArticle = ({ username, body, title, topic }) => {
  if (
    username === undefined ||
    body === undefined ||
    title === undefined ||
    topic === undefined
  ) {
    return Promise.reject({ status: 400, msg: "More Information Required." });
  } else {
    const article = {
      author: username,
      body,
      title,
      topic
    };
    return connection("articles")
      .insert(article)
      .returning("*")
      .then(articleRows => articleRows[0]);
  }
};

const removeArticle = ({ article_id }) => {
  return connection("articles")
    .where({ article_id })
    .del()
    .then(rows => {
      if (rows === 0) {
        return Promise.reject({ status: 404, msg: "Article Not Found." });
      }
    });
};

module.exports = {
  fetchArticleById,
  updateArticleById,
  fetchArticles,
  countPosts,
  addArticle,
  removeArticle
};
