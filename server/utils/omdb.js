import axios from 'axios';

const OMDB_API_KEY = process.env.OMDB_API_KEY;

export async function searchMovies(query) {
  const response = await axios.get(
    `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${query}`
  );
  return response.data;
}

export async function getMovieDetails(id) {
  const response = await axios.get(
    `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${id}&plot=full`
  );
  return response.data;
}
