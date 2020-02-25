const connection = require("../db/connection.js");

const fetchUserByUsername = ({ username }) => {
  return connection("users")
    .where({ username })
    .select("*")
    .then(userRows => {
      if (userRows.length === 0) {
        return Promise.reject({ status: 404, msg: "User Not Found." });
      } else {
        return userRows[0];
      }
    });
};

module.exports = { fetchUserByUsername };
