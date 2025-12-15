export const SimilarMovieCard = ({ movie }) => (
    <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition">
        <img 
            src={movie.image || 'default_thumb.jpg'} 
            alt={movie.title} 
            className="w-10 h-14 object-cover rounded-sm flex-shrink-0"
        />
        <div>
            <p className="text-white font-semibold line-clamp-1">{movie.title} ({movie.year})</p>
            <div className="flex items-center text-sm text-gray-400">
                <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
                {movie.rate || 'N/A'}
            </div>
        </div>
    </div>
);