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

const addUser = ({ username, name, avatar_url }) => {
  return connection("users")
    .insert({ name, username, avatar_url })
    .returning("*")
    .then(userRow => userRow[0]);
};

const fetchUsers = ({ sort_by, order }) => {
  if (order !== "asc" && order !== "desc" && order !== undefined) {
    return Promise.reject({
      status: 400,
      msg: `Trying To Order By "${order}" Is Not Valid.`
    });
  } else {
    return connection("users")
      .select("*")
      .orderBy(sort_by || "username", order || "asc");
  }
};

module.exports = { fetchUserByUsername, addUser, fetchUsers };
