//Data formatting for before seeding
exports.formatDates = list => {
  return list.map(item => {
    return {
      ...item,
      created_at: new Date(item.created_at)
    };
  });
};

exports.makeRefObj = list => {
  const newObj = {};
  list.forEach(obj => {
    newObj[obj.title] = obj.article_id;
  });
  return newObj;
};

// !!! to-do: refactor with .map
exports.formatComments = (comments, articleRef) => {
  const formattedComments = [];
  comments.forEach(comment => {
    formattedComments.push({ ...comment });
  });
  formattedComments.forEach(comment => {
    comment.author = comment.created_by;
    delete comment.created_by;
    comment.article_id = articleRef[comment.belongs_to];
    delete comment.belongs_to;
    comment.created_at = new Date(comment.created_at);
  });
  return formattedComments;
};

// Helper functions for models
const connection = require("../connection.js");

exports.checkIfExists = (value, column, table) => {
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
