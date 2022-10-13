const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const ServerError = require('../errors/ServerError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const AuthError = require('../errors/AuthError');
const ConflictError = require('../errors/ConflictError');
const {
  SERV_ERR,
  NOTFOUND_ERR,
  BAD_REQ_ERR,
  CONFLICT_ERR,
  AUTH_ERR_LOGIN,
} = require('../utils/utils');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUserInfo = async (req, res, next) => {
  const id = req.user._id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return next(new NotFoundError(NOTFOUND_ERR));
    }
    return res.status(200).send(user);
  } catch (err) {
    return next(new ServerError(SERV_ERR));
  }
};

const updateUser = async (req, res, next) => {
  const { name, email } = req.body;
  const id = req.user._id;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true, runValidators: true },
    );
    if (!user) {
      return next(new NotFoundError(NOTFOUND_ERR));
    }
    return res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(BAD_REQ_ERR));
    }
    if (err.code === 11000) {
      return next(new ConflictError(CONFLICT_ERR));
    }
    return next(new ServerError(SERV_ERR));
  }
};

const createUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, email, password: hash,
    });
    return res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(BAD_REQ_ERR));
    }
    if (err.code === 11000) {
      return next(new ConflictError(CONFLICT_ERR));
    }
    return next(new ServerError(SERV_ERR));
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new AuthError(AUTH_ERR_LOGIN));
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return next(new AuthError(AUTH_ERR_LOGIN));
    }

    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' },
    );
    res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: true,
    });
    return res.status(200).send(user);
  } catch (err) {
    return next(new ServerError(SERV_ERR));
  }
};

const logout = (req, res) => {
  res.clearCookie('jwt');
  return res.status(200).send({ message: 'cookie delete' });
};

module.exports = {
  getUserInfo,
  updateUser,
  createUser,
  login,
  logout,
};
