const connection = require("../db/connection.js");
const doesItExist = require("../db/utils/utils.js");

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

// move to comments models
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
  addComment,
  fetchCommentsByArticleId,
  fetchArticles
};
