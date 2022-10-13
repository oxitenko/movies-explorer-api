require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const {
  SERV_ERR,
  PORT_NUMBER,
  ALLOW_ORIGIN,
  DATA_BASE,
} = require('./utils/utils');

const { PORT = PORT_NUMBER } = process.env;
const globalRouter = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorsGlobal } = require('./middlewares/errorsGlobal');
const ServerError = require('./errors/ServerError');

const app = express();

app.use(
  cors({
    origin: ALLOW_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(requestLogger);

app.use(helmet());

app.use('/', globalRouter);

app.use(errorLogger);

app.use(errors());

app.use(errorsGlobal);

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
