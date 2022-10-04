const UserRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUserInfo, updateUser } = require('../controllers/users');

UserRoutes.get('/users/me', getUserInfo);

UserRoutes.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
  }),
}), updateUser);

module.exports = {
  UserRoutes,
};
