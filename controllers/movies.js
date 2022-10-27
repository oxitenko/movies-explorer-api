const Movie = require('../models/movies');
const ServerError = require('../errors/ServerError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const {
  SERV_ERR,
  BAD_REQ_ERR,
  NOTFOUND_ERR,
  FORBIDDEN_ERR,
} = require('../utils/utils');

const getMovies = async (req, res, next) => {
  const owner = req.user._id;
  try {
    const movie = await Movie.find({ owner });
    return res.status(200).send(movie);
  } catch (err) {
    return next(new ServerError(SERV_ERR));
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
      return next(new BadRequestError(BAD_REQ_ERR));
    }
    return next(new ServerError(SERV_ERR));
  }
};

const deleteMovie = async (req, res, next) => {
  const { movieId } = req.params;
  const id = req.user._id;
  try {
    const movie = await Movie.findOneAndDelete(movieId);
    if (!movie) {
      return next(new NotFoundError(NOTFOUND_ERR));
    }
    if (id !== movie.owner) {
      return next(new ForbiddenError(FORBIDDEN_ERR));
    }
    return res.status(200).send(movie);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError(BAD_REQ_ERR));
    }
    return next(new ServerError(SERV_ERR));
  }
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
