import React from 'react';
import { useNavigate } from 'react-router-dom';

export function MovieCard({ movie }) {
  const navigate = useNavigate();
  const posterSrc = movie.image || 'https://via.placeholder.com/300x450?text=No+Poster'

    const handleClick = () => { 
        if (movie && movie.id) {
            navigate(`/movie-detail?id=${movie.id}`);
        }
    };

  return (
    <div className="w-1/3 cursor-pointer group">
        {/* Container */}
        <div className="rounded-lg overflow-hidden shadow-lg border border-gray-700 h-96 transition-transform duration-300 hover:scale-[1.25] group-hover:z-10 group-hover:relative" onClick={handleClick}>
            {/* Poster Phim */}
            <img
                src={posterSrc}
                alt={movie?.title || 'Movie Poster'}
                className="w-full h-full object-fill"
                loading="lazy"
            />

            {/* Tiêu đề Phim */}
            <div 
                // Vị trí tuyệt đối, nằm ở dưới cùng của container poster
                className="absolute bottom-0 left-0 right-0 p-4 
                            bg-black bg-opacity-75 text-white 
                            transform translate-y-full transition-all duration-300 ease-in-out 
                            opacity-0 
                            group-hover:translate-y-0 group-hover:opacity-100" 
            >
                <p className="text-xl font-bold leading-tight">
                    {movie?.title || 'Untitled Movie'}
                </p>
                {movie.year && (
                  <p className="text-sm font-light mt-1">
                      {movie.year}
                  </p>
                )}
            </div>
        </div>
    </div>
  );
};