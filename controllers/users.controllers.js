const {
  fetchUserByUsername,
  addUser,
  fetchUsers
} = require("../models/users.models.js");

const getUserByUsername = (req, res, next) => {
  fetchUserByUsername(req.params)
    .then(user => res.send({ user }))
    .catch(err => next(err));
};

const postUser = (req, res, next) => {
  addUser(req.body)
    .then(user => res.status(201).send({ user }))
    .catch(err => next(err));
};

const getUsers = (req, res, next) => {
  fetchUsers()
    .then(users => res.send({ users }))
    .catch(err => next(err));
};

module.exports = { getUserByUsername, postUser, getUsers };
