const globalRouter = require('express').Router();

const auth = require('../middlewares/auth');
const { UserRoutes } = require('./users');
const { MovieRoutes } = require('./movies');
const { createUser, login } = require('../controllers/users');
const { validationUserCreate, validationUserSignIn } = require('../middlewares/validation');
const NotFoundError = require('../errors/NotFoundError');
const { NOTFOUND_ERR } = require('../utils/utils');

globalRouter.post('/signup', validationUserCreate, createUser);

globalRouter.post('/signin', validationUserSignIn, login);

globalRouter.use(auth, UserRoutes);
globalRouter.use(auth, MovieRoutes);

globalRouter.use('*', (req, res, next) => {
  next(new NotFoundError(NOTFOUND_ERR));
});

module.exports = globalRouter;
