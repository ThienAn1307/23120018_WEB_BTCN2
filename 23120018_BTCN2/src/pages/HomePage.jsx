import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { MovieCard } from '../components/MovieCard';

import { getMoviesApi } from '../api/api';

const MOVIES_PER_PAGE = 10;

export const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State cho Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Lấy dữ liệu phim với phân trang
  useEffect(() => {
      const loadMovies = async () => {
        setLoading(true);
        setError(null);
        try {
          const result = await getMoviesApi(currentPage, MOVIES_PER_PAGE);
          setMovies(result.data); 
          setTotalPages(result.pagination.total_pages);
          setCurrentPage(result.pagination.current_page);
        } catch (err) {
          // Xử lý lỗi API
          console.error("Lỗi khi tải danh sách phim:", err);
          setError(err.message || "Không thể tải dữ liệu.");
        } finally {
          setLoading(false);
        }
      };
      loadMovies();
    }, [currentPage]);

  const handlePageChange = (newPage) => {
      if (newPage >= 1 && newPage <= totalPages) {
          setCurrentPage(newPage);
          window.scrollTo(0, 0); 
      }
  };

  // Xử lý Trạng thái Loading và Error
  if (loading) {
      return (
        <div className="flex justify-center items-center min-h-[70vh] dark:text-white text-xl">
            Đang tải danh sách phim...
        </div>
      );
  }
  
  if (error) {
      return (
        <div className="text-center p-8 text-red-500 bg-red-100 dark:bg-red-900/20 rounded-lg m-4">
            <h2>Lỗi tải dữ liệu!</h2>
            <p className="mt-2 text-sm">Chi tiết: {error}</p>
        </div>
      );
  }
  
  // Xử lý trường hợp không có dữ liệu
  if (!movies || movies.length === 0) {
      return (
        <div className="text-center p-8 dark:text-white">
            Không tìm thấy dữ liệu phim để hiển thị.
        </div>
      );
  }

  return (
    <div className="dark:text-white p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Tất cả phim</h1>

        {/* Danh sách phim */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {movies.map(movie => (
                <MovieCard key={movie.id} movie={movie} variant="poster" />
            ))}
        </div>

        {/* Điều khiển Phân trang */}
        <div className="flex justify-center items-center space-x-4 mt-10">
            
            {/* Nút Trang Trước */}
            <Button 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1 || loading}
                variant="outline"
            >
                <ArrowLeft className="h-4 w-4 mr-2" /> Trang Trước
            </Button>
            
            {/* Hiển thị số trang hiện tại */}
            <span className="text-lg font-semibold">
                Trang {currentPage} / {totalPages}
            </span>

            {/* Nút Trang Sau */}
            <Button 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages || loading}
                variant="outline"
            >
                Trang Sau <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
        </div>
    </div>
  );
};