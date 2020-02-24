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
    comment.author = comment.created_by;
    delete comment.created_by;
    comment.article_id = articleRef[comment.belongs_to];
    delete comment.belongs_to;
    comment.created_at = new Date(comment.created_at);
  });
  return formattedComments;
};
