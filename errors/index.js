const handlePSQLErrors = (err, req, res, next) => {
  if (err.code !== undefined) {
    console.log("it is a PSQL error >>>>>>>>>", err.code);
    const errCodes = {
      "22P02": {
        status: 400,
        msg: "Invalid Data Type."
      },
      "23503": { status: 404, msg: "Article Or User Not Found." }
    };
    res.status(errCodes[err.code].status).send({ msg: errCodes[err.code].msg });
  } else next(err);
};
const handleCustomErrors = (err, req, res, next) => {
  if (err.status !== undefined) {
    console.log("it is a custom error >>>>>>>>>", err);
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};
const handle500Errors = (err, req, res, next) => {
  console.log("is it a 500 error?");
};

const handleWrongRoute = (req, res, next) => {
  console.log("it is a 404 wrong route error");
  res.status(404).send({ msg: "Route Not Found." });
};

const handle405Errors = (req, res, next) => {
  console.log("it is a 405 method error");
  res.status(405).send({ msg: "Method Not Allowed." });
};

module.exports = {
  handlePSQLErrors,
  handleCustomErrors,
  handle500Errors,
  handleWrongRoute,
  handle405Errors
};
