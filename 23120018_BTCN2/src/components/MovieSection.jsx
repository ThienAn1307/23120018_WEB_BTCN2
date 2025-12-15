import React, { useState} from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MovieCard } from './MovieCard';

const MOVIES_PER_PAGE = 3;

export function MovieSection({ title, movies }) {
  // State để quản lý trang hiện tại, bắt đầu từ 0
  const [currentPage, setCurrentPage] = useState(0);

  if (!movies || movies.length === 0) {
      return null; 
  }

  // Tính toán Tổng số trang
  const totalPages = Math.ceil(movies.length / MOVIES_PER_PAGE);

  // Hàm chuyển trang
  const goToNextPage = () => {
      setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages - 1));
  };

  const goToPrevPage = () => {
      setCurrentPage(prevPage => Math.max(prevPage - 1, 0));
  };

  return (
    <section className="py-6 relative">           
      {/* Tiêu đề Danh mục và Thông tin Phân trang */}
      <div className="flex justify-between items-center mb-4 pl-4 md:pl-8 pr-4 md:pr-8">
          <h2 className="text-2xl font-bold">{title}</h2>
          {totalPages > 1 && (
              <div className="text-gray-400 text-sm">
                  Trang {currentPage + 1} / {totalPages}
              </div>
          )}
      </div>

      {/* Container Phim */}
      <div className="relative" style={{ minHeight: '450px', overflow: 'visible' }}>
        {/* Render tất cả pages xếp chồng */}
        {Array.from({ length: totalPages }).map((_, pageIndex) => {
          const startIndex = pageIndex * MOVIES_PER_PAGE;
          const endIndex = startIndex + MOVIES_PER_PAGE;
          const pageMovies = movies.slice(startIndex, endIndex);
          
          let transform = 'translateX(100%)';
          let zIndex = 0;
          let pointerEvents = 'none';
          let visibility = 'hidden';
          let opacity = 0;
          
          if (pageIndex === currentPage) {
            zIndex = 30;
            transform = 'translateX(0)';
            pointerEvents = 'auto';
            visibility = 'visible';
            opacity = 1;
          } else if (pageIndex < currentPage) {
            transform = 'translateX(-100%)';
          }
          
          return (
            <div
              key={pageIndex}
              className="absolute inset-0 flex justify-center space-x-6 px-4 md:px-8 py-2 transition-all duration-500 ease-in-out"
              style={{
                transform,
                zIndex,
                pointerEvents,
                visibility,
                opacity,
              }}
            >
              {pageMovies.map((movie) => (
                  <MovieCard 
                      key={movie.id} 
                      movie={movie} 
                  />
              ))}
            </div>
          );
        })}

        {/* --- NÚT PHÂN TRANG (PAGINATION CONTROLS) --- */}
        {totalPages > 1 && (
          <>
            {/* Nút Trái (Trang trước) */}
            <button
                onClick={goToPrevPage}
                disabled={currentPage === 0}
                // Đặt nút ở vị trí 0 (bên trái)
                className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-50 p-2 bg-black bg-opacity-50 text-white rounded-r-lg transition duration-300 hidden md:block pointer-events-auto ${currentPage === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-opacity-75 cursor-pointer'}`}
                aria-label="Trang trước"
            >
                <ChevronLeft size={32} />
            </button>

            {/* Nút Phải (Trang sau) */}
            <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages - 1}
                // Đặt nút ở vị trí max-width (bên phải)
                className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-50 p-2 bg-black bg-opacity-50 text-white rounded-l-lg transition duration-300 hidden md:block pointer-events-auto ${currentPage === totalPages - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-opacity-75 cursor-pointer'}`}
                aria-label="Trang sau"
            >
                <ChevronRight size={32} />
            </button>
          </>
        )}
      </div>
    </section>  
  );
};