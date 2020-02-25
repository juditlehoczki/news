const { fetchTopics } = require("../models/topics.models.js");

const getTopics = (req, res, next) => {
  fetchTopics()
    .then(topics => res.send({ topics }))
    .catch(err => next(err));
};

module.exports = { getTopics };
