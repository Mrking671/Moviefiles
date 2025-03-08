import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router-dom';

export default function MovieCard({ movie }) {
  return (
    <Link 
      to={`/movie/${movie.imdbID}`}
      className="relative group block overflow-hidden rounded-lg hover:scale-105 transition-all"
    >
      <LazyLoadImage
        src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.jpg'}
        alt={movie.Title}
        className="w-full h-64 object-cover"
        effect="opacity"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-end">
        <h3 className="text-white font-bold text-lg">{movie.Title}</h3>
      </div>
    </Link>
  );
}
