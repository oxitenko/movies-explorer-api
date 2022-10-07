const UserRoutes = require('express').Router();
const {
  getUserInfo,
  updateUser,
  logout,
} = require('../controllers/users');
const {
  validationUserUpdate,
} = require('../middlewares/validation');

UserRoutes.get('/users/me', getUserInfo);

UserRoutes.patch('/users/me', validationUserUpdate, updateUser);

UserRoutes.delete('/logout', logout);

module.exports = {
  UserRoutes,
};
