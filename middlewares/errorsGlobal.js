const { SERV_ERR } = require('../utils/utils');

const errorsGlobal = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? SERV_ERR
      : message,
  });
  next(err);
};

module.exports = {
  errorsGlobal,
};
