const UserRoutes = require('express').Router();
const { getUserInfo, updateUser } = require('../controllers/users');
const { validationUserUpdate } = require('../middlewares/validation');

UserRoutes.get('/users/me', getUserInfo);

UserRoutes.patch('/users/me', validationUserUpdate, updateUser);

module.exports = {
  UserRoutes,
};
