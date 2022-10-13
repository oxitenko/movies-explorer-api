const AUTH_ERR = 'Ошибка авторизации';
const AUTH_ERR_LOGIN = 'Неправильные почта или пароль';
const BAD_REQ_ERR = 'Введены некорректные данные';
const CONFLICT_ERR = 'Пользователь с таким email уже существует';
const FORBIDDEN_ERR = 'У вас нет прав на это действие';
const NOTFOUND_ERR = 'Данные не найдены';
const SERV_ERR = 'Ошибка на сервере';
const PORT_NUMBER = 3000;
const ALLOW_ORIGIN = 'movies-explorer-app.nomoredomains.icu';
const DATA_BASE = 'mongodb://localhost:27017/bitfilmsdb';

module.exports = {
  AUTH_ERR,
  BAD_REQ_ERR,
  CONFLICT_ERR,
  FORBIDDEN_ERR,
  AUTH_ERR_LOGIN,
  NOTFOUND_ERR,
  SERV_ERR,
  PORT_NUMBER,
  ALLOW_ORIGIN,
  DATA_BASE,
};
