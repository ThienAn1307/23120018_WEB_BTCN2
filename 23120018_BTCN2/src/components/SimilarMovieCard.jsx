// Fallback placeholder as data URI (works offline)
const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="56" viewBox="0 0 40 56"%3E%3Crect fill="%23374151" width="40" height="56"/%3E%3C/svg%3E';

export const SimilarMovieCard = ({ movie }) => (
    <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition">
        <img 
            src={movie.image || PLACEHOLDER_IMAGE} 
            alt={movie.title} 
            className="w-10 h-14 object-cover rounded-sm flex-shrink-0"
            onError={(e) => {
                if (e.target.src !== PLACEHOLDER_IMAGE) {
                    e.target.src = PLACEHOLDER_IMAGE;
                }
            }}
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