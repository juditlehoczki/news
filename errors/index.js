const handlePSQLErrors = (err, req, res, next) => {
  if (err.code !== undefined) {
    const errCodes = {
      "22P02": {
        status: 400,
        msg: "Invalid Data Type."
      },
      "23502": { status: 400, msg: "More Information Required." },
      "23503": { status: 404, msg: "Not Found." },
      "42703": { status: 400, msg: "Invalid Column." }
    };
    res.status(errCodes[err.code].status).send({ msg: errCodes[err.code].msg });
  } else next(err);
};
const handleCustomErrors = (err, req, res, next) => {
  if (err.status !== undefined) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};
const handle500Errors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Error. Sorry!" });
};

const handleWrongRoute = (req, res, next) => {
  res.status(404).send({ msg: "Route Not Found." });
};

const handle405Errors = (req, res, next) => {
  res.status(405).send({ msg: "Method Not Allowed." });
};

const teaPot = (req, res, next) => {
  res.status(418).send({ msg: "You're a teapot." });
};

module.exports = {
  handlePSQLErrors,
  handleCustomErrors,
  handle500Errors,
  handleWrongRoute,
  handle405Errors,
  teaPot
};
