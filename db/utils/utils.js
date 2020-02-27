//Formatting data before seeding
const formatDates = list => {
  return list.map(item => {
    return {
      ...item,
      created_at: new Date(item.created_at)
    };
  });
};

const makeRefObj = list => {
  const newObj = {};
  list.forEach(obj => {
    newObj[obj.title] = obj.article_id;
  });
  return newObj;
};

const formatComments = (comments, articleRef) => {
  return comments.map(comment => {
    const formattedComment = { ...comment };
    formattedComment.author = comment.created_by;
    delete formattedComment.created_by;
    formattedComment.article_id = articleRef[comment.belongs_to];
    delete formattedComment.belongs_to;
    formattedComment.created_at = new Date(comment.created_at);
    return formattedComment;
  });
};

// Utility function for models
const connection = require("../connection.js");

const checkIfExists = (value, column, table) => {
  if (value === undefined) {
    return 0;
  } else {
    return connection(table)
      .select("*")
      .where(column, value)
      .then(rows => {
        return rows.length;
      })
      .catch(err => {
        if (err.code === "42703") {
          return "Column Doesn't Exist.";
        } else if (err.code === "42P01") {
          return "Table Doesn't Exist.";
        } else {
          return err;
        }
      });
  }
};

module.exports = { formatDates, makeRefObj, formatComments, checkIfExists };
