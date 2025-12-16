import React, { useState } from 'react';
import { Heart, Trash2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { Pagination } from '../components/Pagination';

export const FavoritesPage = () => {
    const navigate = useNavigate();
    const { favorites, isLoading, error, removeFavorite, fetchFavorites } = useFavorites();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    // Tính toán phân trang
    const totalPages = Math.ceil(favorites.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentFavorites = favorites.slice(startIndex, endIndex);

    // Xử lý thay đổi trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Debug: Log dữ liệu favorites
    React.useEffect(() => {
        if (favorites.length > 0) {
            console.log('Favorites data:', favorites);
            console.log('First movie data:', favorites[0]);
        }
    }, [favorites]);

    // Điều chỉnh trang hiện tại khi số lượng phim thay đổi
    React.useEffect(() => {
        const newTotalPages = Math.ceil(favorites.length / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
        } else if (favorites.length === 0) {
            setCurrentPage(1);
        }
    }, [favorites.length, currentPage, itemsPerPage]);

    // Xóa phim khỏi danh sách yêu thích
    const handleRemoveFavorite = async (movieId, e) => {
        e.stopPropagation(); // Ngăn không điều hướng đến chi tiết phim
        
        try {
            await removeFavorite(movieId);
        } catch (err) {
            console.error("Lỗi khi xóa phim khỏi yêu thích:", err);
            alert("Không thể xóa phim khỏi danh sách yêu thích.");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Đang tải danh sách yêu thích...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
                <div className="max-w-md w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                        <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 mr-2" />
                        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">Lỗi</h3>
                    </div>
                    <p className="text-red-700 dark:text-red-300">{error}</p>
                    <button
                        onClick={fetchFavorites}
                        className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-150"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white flex items-center">
                        <Heart className="h-10 w-10 mr-3 text-red-500 fill-current" />
                        Phim Yêu Thích
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        {favorites.length > 0 
                            ? `Bạn có ${favorites.length} phim trong danh sách yêu thích`
                            : 'Danh sách yêu thích của bạn đang trống'
                        }
                    </p>
                </div>

                {/* Danh sách phim yêu thích */}
                {favorites.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow">
                        <Heart className="h-24 w-24 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Chưa có phim yêu thích
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Hãy thêm phim vào danh sách yêu thích để xem sau!
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full transition duration-150"
                        >
                            Khám phá phim
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {currentFavorites.map((movie) => {
                                const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="450"%3E%3Crect fill="%23374151" width="300" height="450"/%3E%3Ctext x="50%25" y="50%25" font-size="20" fill="%239CA3AF" text-anchor="middle" dominant-baseline="middle"%3ENo Poster%3C/text%3E%3C/svg%3E';
                                const posterSrc = movie.image || PLACEHOLDER_IMAGE;
                                
                                return (
                                <div key={movie.id} className="relative group">
                                {/* Movie Card */}
                                <div className="cursor-pointer" onClick={() => navigate(`/movie-detail?id=${movie.id}`)}>
                                    <div className="rounded-lg overflow-hidden shadow-lg border border-gray-300 dark:border-gray-700 h-80 transition-transform duration-300 hover:scale-105">
                                        <img
                                            src={movie.image_url || movie.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="450"%3E%3Crect fill="%23374151" width="300" height="450"/%3E%3Ctext x="50%25" y="50%25" font-size="20" fill="%239CA3AF" text-anchor="middle" dominant-baseline="middle"%3ENo Poster%3C/text%3E%3C/svg%3E'}
                                            alt={movie.title}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                            onError={(e) => {
                                                console.error('Image load error for movie:', movie.title, 'URL:', posterSrc);
                                                if (e.target.src !== PLACEHOLDER_IMAGE) {
                                                    e.target.src = PLACEHOLDER_IMAGE;
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="mt-2">
                                        <h3 className="text-sm font-semibold text-gray-800 dark:text-white line-clamp-2">
                                            {movie.title}
                                        </h3>
                                        {movie.year && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {movie.year}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Nút xóa */}
                                <button
                                    onClick={(e) => handleRemoveFavorite(movie.id, e)}
                                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition duration-150 opacity-0 group-hover:opacity-100 z-10"
                                    title="Xóa khỏi yêu thích"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                            );
                            })}
                        </div>

                        {/* Phân trang */}
                        {totalPages > 1 && (
                            <div className="mt-8 flex justify-center">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    paginate={handlePageChange}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};