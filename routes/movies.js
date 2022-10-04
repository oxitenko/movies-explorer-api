const MovieRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const isURL = require('validator/lib/isURL');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const BadRequestError = require('../errors/BadRequestError');

const urlValidator = (value) => {
  if (!isURL(value)) {
    throw new BadRequestError('Невалидная ссылка');
  }
  return value;
};

MovieRoutes.get('/movies', getMovies);

MovieRoutes.post('/movies', celebrate({
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
    movieId: Joi.string().alphanum().length(24),
    owner: Joi.string().alphanum().length(24),
  }),
}), createMovie);

MovieRoutes.delete('/movies/:movieId', celebrate({
  body: Joi.object().keys({
    movieId: Joi.string().alphanum().length(24),
  }),
}), deleteMovie);

module.exports = {
  MovieRoutes,
};
