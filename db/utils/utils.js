exports.formatDates = list => {
  const formattedObjs = [];
  list.forEach(obj => {
    formattedObjs.push({ ...obj });
  });
  formattedObjs.forEach(obj => {
    obj.created_at = new Date(obj.created_at);
  });
  return formattedObjs;
};

exports.makeRefObj = (list, key, value) => {
  const newObj = {};
  list.forEach(obj => {
    newObj[obj[key]] = obj[value];
  });
  return newObj;
};

exports.formatComments = (comments, articleRef) => {
  const formattedComments = [];
  comments.forEach(comment => {
    formattedComments.push({ ...comment });
  });
  formattedComments.forEach(comment => {
    // Its created_by property renamed to an author key
    comment.author = comment.created_by;
    delete comment.created_by;
    // Its belongs_to property renamed to an article_id key
    // The value of the new article_id key must be the id corresponding to the original title value provided
    comment.article_id = articleRef[comment.belongs_to];
    delete comment.belongs_to;
    // Its created_at value converted into a javascript date object
    comment.created_at = new Date(comment.created_at);
    // The rest of the comment's properties must be maintained
  });
  return formattedComments;
};
