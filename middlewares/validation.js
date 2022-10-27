const { celebrate, Joi } = require('celebrate');
const isURL = require('validator/lib/isURL');
const BadRequestError = require('../errors/BadRequestError');
const { BAD_REQ_ERR } = require('../utils/utils');

const urlValidator = (value) => {
  if (!isURL(value)) {
    throw new BadRequestError(BAD_REQ_ERR);
  }
  return value;
};

const validationMovieCreate = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(urlValidator),
    trailerLink: Joi.string().required().custom(urlValidator),
    thumbnail: Joi.string().required().custom(urlValidator),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.number().required(),
  }),
});

const validationMovieDelete = celebrate({
  body: Joi.object().keys({
    movieId: Joi.string().hex().length(24).alphanum(),
  }),
});

const validationUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  }),
});

const validationUserCreate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validationUserSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

module.exports = {
  validationMovieCreate,
  validationMovieDelete,
  validationUserUpdate,
  validationUserCreate,
  validationUserSignIn,
};
