const connection = require("../db/connection.js");

const fetchTopics = () => {
  return connection("topics").select("*");
};

const addTopic = topic => {
  return connection("topics")
    .insert(topic)
    .returning("*")
    .then(topicRow => topicRow[0]);
};

module.exports = { fetchTopics, addTopic };
