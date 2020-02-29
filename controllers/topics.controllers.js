const { fetchTopics, addTopic } = require("../models/topics.models.js");

const getTopics = (req, res, next) => {
  fetchTopics()
    .then(topics => res.send({ topics }))
    .catch(err => next(err));
};

const postTopic = (req, res, next) => {
  addTopic(req.body)
    .then(topic => res.status(201).send({ topic }))
    .catch(err => next(err));
};

module.exports = { getTopics, postTopic };
