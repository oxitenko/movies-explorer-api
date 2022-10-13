const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');
const { AUTH_ERR } = require('../utils/utils');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new AuthError(AUTH_ERR));
  }
  req.user = payload;
  next();
};

module.exports = auth;
