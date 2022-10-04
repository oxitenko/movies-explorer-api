const Movie = require('../models/movies');
const ServerError = require('../errors/ServerError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const getMovies = async (req, res, next) => {
  try {
    const movie = await Movie.find({});
    return res.status(200).send(movie);
  } catch (err) {
    return next(new ServerError('Ошибка на сервере'));
  }
};

const createMovie = async (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  try {
    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner,
    });
    return res.status(200).send(movie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Некорректные данные фильма'));
    }
    return next(new ServerError('Ошибка на сервере'));
  }
};

const deleteMovie = async (req, res, next) => {
  const { movieId } = req.params;
  const id = req.user._id;
  try {
    const movie = await Movie.findOneAndDelete(movieId);
    if (!movie) {
      return next(new NotFoundError('Такого фильма нет'));
    }
    if (id !== movie.owner) {
      return next(new ForbiddenError('Не твой список фильфом'));
    }
    return res.status(200).send(movie);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Некорректные данные запроса'));
    }
    return next(new ServerError('Ошибка на сервере'));
  }
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
