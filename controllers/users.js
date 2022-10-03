const bcrypt = require('bcryptjs');
const User = require('../models/users');
const ServerError = require('../errors/ServerError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
// const AuthError = require('../errors/AuthError');
const ConflictError = require('../errors/ConflictError');

const getUserInfo = async (req, res, next) => {
  const id = req.user_id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
    }
    return res.status(200).send(user);
  } catch (err) {
    return next(new ServerError('Ошибка на сервере'));
  }
};

const updateUser = async (req, res, next) => {
  const { name, email } = req.body;
  const id = req.user_id;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true, runValidators: true },
    );
    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
    }
    return res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Некорректные данные пользователя'));
    }
    return next(new ServerError('Ошибка на сервере'));
  }
};

const createUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = User.create({
      name, email, password: hash,
    });
    return res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Некорректные данные пользователя'));
    }
    if (err.code === 11000) {
      return next(new ConflictError('Пользователь с таким email уже существует'));
    }
    return next(new ServerError('Ошибка на сервере'));
  }
};

module.exports = {
  getUserInfo,
  updateUser,
  createUser,
};
