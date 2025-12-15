import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { MovieSection } from '../components/MovieSection';

import { useMovies } from '../context/MovieContext';
import { useLoading } from '../context/LoadingContext';
import { useNavigate } from 'react-router-dom';

export const HomePage = () => {
  const { popularMovies, topRatedMovies, getPopularMovies, getTopRatedMovies } = useMovies();
  const { startLoading, stopLoading } = useLoading();
  const navigate = useNavigate();

  // Tải phim khi trang được tải
  useEffect(() => {
    getPopularMovies(30);
    getTopRatedMovies('IMDB_TOP_50', 30);
    
    // Stop loading sau 800ms để animation xong
    const timer = setTimeout(() => {
      stopLoading();
    }, 800);
    
    return () => clearTimeout(timer);
  }, [getPopularMovies, getTopRatedMovies, stopLoading]);

  // Giới hạn hiển thị 5 phim đầu tiên
  const featuredMovies = popularMovies.slice(0, 5);
  const [currentIndex, setCurrentIndex] = useState(0); // Chỉ số phim hiện tại trong slideshow
  const [isTransitioning, setIsTransitioning] = useState(false); // Trạng thái chuyển tiếp

  const totalMovies = featuredMovies.length;
  
  // Hàm chuyển poster
  const goToNext = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex === totalMovies - 1 ? 0 : prevIndex + 1));
      setIsTransitioning(false);
    }, 300);
  }, [totalMovies]);
  
  const goToPrev = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? totalMovies - 1 : prevIndex - 1));
      setIsTransitioning(false);
    }, 300);
  }, [totalMovies]);
  
  // Kiểm tra nếu không có phim hoặc ít hơn 1 phim
  if (!featuredMovies || featuredMovies.length === 0) {
    return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Không có dữ liệu để hiển thị.</div>;
  }
  
  const currentMovie = featuredMovies[currentIndex];
  const handlePosterClick = () => {
    if (currentMovie && currentMovie.id) {
      startLoading();
      setTimeout(() => {
        navigate(`/movie-detail?id=${currentMovie.id}`);
        stopLoading();
      }, 500);
    }
  };


  return (
    <>  
      {/* --- Khu vực 1: Slideshow Phim doanh thu cao --- */}
      <div className="relative flex justify-center items-center py-6">
        {/* Nút Previous */}
        <button
            onClick={goToPrev}
            className="absolute left-0 flex items-center z-10 p-3 bg-black/40 hover:bg-black/60 rounded-full text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 mx-2"
            aria-label="Previous movie"
        >
            <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Poster Chính ở Giữa */}
        <div className="flex flex-col items-center" onClick={handlePosterClick}>
          <div className="relative rounded-lg overflow-hidden shadow-xl cursor-pointer" style={{ perspective: '1000px', aspectRatio: '2/3', width: '280px' }}>
            {/* Render tất cả poster xếp chồng */}
            {featuredMovies.map((movie, index) => {
              const isActive = index === currentIndex;
              const isNextActive = index === (currentIndex + 1) % featuredMovies.length;
              const isPrevActive = index === (currentIndex - 1 + featuredMovies.length) % featuredMovies.length;
              
              let zIndex = 0;
              let transform = 'translateX(100%) rotateY(45deg)';
              let opacity = 0;
              
              if (isActive) {
                zIndex = 30;
                transform = 'translateX(0) rotateY(0deg)';
                opacity = 1;
              } else if (isNextActive) {
                zIndex = 20;
                transform = 'translateX(100%) rotateY(45deg)';
                opacity = 0.5;
              } else if (isPrevActive) {
                zIndex = 20;
                transform = 'translateX(-100%) rotateY(-45deg)';
                opacity = 0.5;
              }
              
              return (
                <div
                  key={movie.id}
                  className="absolute inset-0 rounded-lg overflow-hidden transition-all duration-500 ease-in-out flex items-center justify-center"
                  style={{
                    transform,
                    opacity,
                    zIndex,
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <img 
                    src={movie.image} 
                    alt={movie.title} 
                    className="w-full h-full object-contain"
                  />
                  
                  {/* Overlay để hiển thị Title và Rating */}
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent rounded-lg p-4">
                    <h3 className="text-white text-xl font-bold mb-1">

                      {movie.title}
                    </h3>
                    <div className="flex items-center text-sm text-yellow-400 mb-2">
                      <Star className="h-4 w-4 mr-1 fill-yellow-400" />
                      <span>{movie.rate}</span>
                    </div>
                    {movie.genres && movie.genres.length > 0 && (
                      <div className="text-xs text-gray-300">
                        {movie.genres.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
            {/* Pagination Dots */}
            <div className="flex justify-center space-x-2 mt-4 w-full">
                {featuredMovies.map((_, index) => (
                    <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentIndex(index);
                        }}
                        className={`h-2 w-2 rounded-full transition-all duration-300 ${
                            index === currentIndex ? 'bg-red-600 w-5' : 'bg-gray-400 dark:bg-gray-600'
                        }`}
                        aria-label={`Go to movie ${index + 1}`}
                    />
                ))}
            </div>
        </div>

        {/* Nút Next */}
        <button
            onClick={goToNext}
            className="absolute right-0 flex items-center z-10 p-3 bg-black/40 hover:bg-black/60 rounded-full text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 mx-2"
            aria-label="Next movie"
        >
            <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* --- Khu vực 2: Phim phổ biến nhất --- */}
      <MovieSection 
        title="Most Popular"
        movies={popularMovies}
      />

      {/* --- Khu vực 3: Phim xếp hạng cao --- */}
      <MovieSection 
        title="Top Rating"
        movies={topRatedMovies}
      />
    </>
  );
};