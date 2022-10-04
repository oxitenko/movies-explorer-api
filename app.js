const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const { PORT = 3000 } = process.env;
const app = express();
const cors = require('cors');

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  }),
);

const cookieParser = require('cookie-parser');
const path = require('path');
const { errors, celebrate, Joi } = require('celebrate');
const { UserRoutes } = require('./routes/users');
const { MovieRoutes } = require('./routes/movies');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const ServerError = require('./errors/ServerError');
const NotFoundError = require('./errors/NotFoundError');

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(requestLogger);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);

app.use(UserRoutes);
app.use(MovieRoutes);

app.delete('/logout', (req, res) => {
  res.clearCookie('jwt');
  return res.status(200).send({ message: 'cookie delete' });
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next(err);
});

async function main() {
  try {
    await mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
      useNewUrlParser: true,
      useUnifiedTopology: false,
    });
    await app.listen(PORT);
  } catch (error) {
    throw new ServerError('Ошибка на сервере');
  }
}

main();
