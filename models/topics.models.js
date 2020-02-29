const connection = require("../db/connection.js");

const fetchTopics = () => {
  return connection("topics").select("*");
};

const addTopic = ({ slug, description }) => {
  if (slug === undefined || description === undefined) {
    return Promise.reject({ status: 400, msg: "More Information Required." });
  } else {
    return connection("topics")
      .insert({ slug, description })
      .returning("*")
      .then(topicRow => topicRow[0]);
  }
};

module.exports = { fetchTopics, addTopic };
