const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const { errors } = require('celebrate');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const {
  SERV_ERR,
  NOTFOUND_ERR,
  PORT_NUMBER,
  ALLOW_ORIGIN,
  DATA_BASE,
} = require('./utils/utils');

const { PORT = PORT_NUMBER } = process.env;
const app = express();

app.use(
  cors({
    origin: ALLOW_ORIGIN,
    credentials: true,
  }),
);

const { UserRoutes } = require('./routes/users');
const { MovieRoutes } = require('./routes/movies');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorsGlobal } = require('./middlewares/errorsGlobal');
const { validationUserCreate, validationUserSignIn } = require('./middlewares/validation');
const ServerError = require('./errors/ServerError');
const NotFoundError = require('./errors/NotFoundError');

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(requestLogger);

app.use(helmet());

app.post('/signup', validationUserCreate, createUser);

app.post('/signin', validationUserSignIn, login);

app.use(auth);

app.use(UserRoutes);
app.use(MovieRoutes);

app.delete('/logout', (req, res) => {
  res.clearCookie('jwt');
  return res.status(200).send({ message: 'cookie delete' });
});

app.use(errorLogger);

app.use(errors());

app.use(errorsGlobal);

app.use('*', (req, res, next) => {
  next(new NotFoundError(NOTFOUND_ERR));
});

async function main() {
  try {
    await mongoose.connect(DATA_BASE, {
      useNewUrlParser: true,
      useUnifiedTopology: false,
    });
    await app.listen(PORT);
  } catch (error) {
    throw new ServerError(SERV_ERR);
  }
}

main();
