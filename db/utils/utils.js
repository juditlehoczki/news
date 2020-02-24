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

exports.formatComments = (comments, articleRef) => {};
