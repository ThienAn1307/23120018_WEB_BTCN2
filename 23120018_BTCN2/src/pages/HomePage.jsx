import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { MovieSection } from '../components/MovieSection';

import { useMovies } from '../context/MovieContext';

export const HomePage = () => {
  const { popularMovies, topRatedMovies, getPopularMovies, getTopRatedMovies } = useMovies();

  // Tải phim khi trang được tải
  useEffect(() => {
    getPopularMovies(30);
    getTopRatedMovies('IMDB_TOP_50', 30);
  }, [getPopularMovies, getTopRatedMovies]);

  // Giới hạn hiển thị 5 phim đầu tiên
  const featuredMovies = popularMovies.slice(0, 5);
  const [currentIndex, setCurrentIndex] = useState(0); // Chỉ số phim hiện tại trong slideshow

  const totalMovies = featuredMovies.length;
  
  // Hàm chuyển poster
  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === totalMovies - 1 ? 0 : prevIndex + 1));
  }, [totalMovies]);
  
  const goToPrev = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? totalMovies - 1 : prevIndex - 1));
  }, [totalMovies]);
  
  // Kiểm tra nếu không có phim hoặc ít hơn 1 phim
  if (!featuredMovies || featuredMovies.length === 0) {
    return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Không có dữ liệu để hiển thị.</div>;
  }
  
  const currentMovie = featuredMovies[currentIndex];
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
        <div className="relative w-fit mx-auto max-w-xs sm:max-w-sm md:max-w-md transition-opacity duration-500 ease-in-out">
          <div className="relative rounded-lg overflow-hidden shadow-xl">
            <img 
                src={currentMovie.image} 
                alt={currentMovie.title} 
                className="w-full h-96 object-contain"
            />
            
            {/* Overlay để hiển thị Title và Rating */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end">
                <h3 className="text-white text-xl font-bold mb-1">
                    {currentMovie.title}
                </h3>
                <div className="flex items-center text-sm text-yellow-400">
                    <Star className="h-4 w-4 mr-1 fill-yellow-400" />
                    <span>{currentMovie.rate}</span>
                </div>
            </div>
          </div>

            {/* Pagination Dots */}
            <div className="flex justify-center space-x-2 mt-4">
                {featuredMovies.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
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