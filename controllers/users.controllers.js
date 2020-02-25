const { fetchUserByUsername } = require("../models/users.models.js");

const getUserByUsername = (req, res, next) => {
  fetchUserByUsername(req.params)
    .then(user => res.send({ user }))
    .catch(err => next(err));
};

module.exports = { getUserByUsername };
