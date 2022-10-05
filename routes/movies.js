const MovieRoutes = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { validationMovieCreate, validationMovieDelete } = require('../middlewares/validation');

MovieRoutes.get('/movies', getMovies);

MovieRoutes.post('/movies', validationMovieCreate, createMovie);

MovieRoutes.delete('/movies/:movieId', validationMovieDelete, deleteMovie);

module.exports = {
  MovieRoutes,
};
