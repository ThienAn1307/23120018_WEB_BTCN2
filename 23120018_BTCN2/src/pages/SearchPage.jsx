import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMovies } from '../context/MovieContext';
import { MovieCard } from '../components/MovieCard';
import { LoadingScreen } from '../components/LoadingScreen';
import { Pagination } from '../components/Pagination';

// Fallback placeholder as data URI (works offline)
const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="192" viewBox="0 0 128 192"%3E%3Crect fill="%23374151" width="128" height="192"/%3E%3Ctext x="50%25" y="50%25" font-size="14" fill="%239CA3AF" text-anchor="middle" dominant-baseline="middle" font-family="Arial"%3ENo Image%3C/text%3E%3C/svg%3E';

export const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get('q');
    const { searchResults, isLoading, error, searchMovies } = useMovies();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchCriteria, setSearchCriteria] = useState('');
    const [advancedSearch, setAdvancedSearch] = useState({
        title: '',
        genre: '',
        person: ''
    });

    const ITEMS_PER_PAGE = 4;

    useEffect(() => {
        if (query) {
            console.log('🔎 SearchPage - Query:', query);
            setSearchCriteria(`"${query}"`);
            searchMovies(query, { q: query }, 100);
            setCurrentPage(1);
        }
    }, [query]);

    // Handle advanced search
    const handleAdvancedSearch = () => {
        const params = {};
        const criteria = [];
        
        if (advancedSearch.title) {
            params.title = advancedSearch.title;
            criteria.push(`Tiêu đề: ${advancedSearch.title}`);
        }
        if (advancedSearch.genre) {
            params.genre = advancedSearch.genre;
            criteria.push(`Thể loại: ${advancedSearch.genre}`);
        }
        if (advancedSearch.person) {
            params.person = advancedSearch.person;
            criteria.push(`Nhân vật: ${advancedSearch.person}`);
        }

        if (Object.keys(params).length === 0) {
            console.log('⚠️ Vui lòng nhập ít nhất một tiêu chí tìm kiếm');
            return;
        }

        console.log('🔎 Advanced Search:', params);
        setSearchCriteria(criteria.join(' • '));
        searchMovies('advanced', params, 100);
        setCurrentPage(1);
    };

    // Calculate pagination
    const totalPages = Math.ceil(searchResults.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedMovies = searchResults.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    if (isLoading) return <LoadingScreen />;

    return (
        <div className="min-h-screen bg-gray-900 text-white py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Kết quả tìm kiếm</h1>
                    {searchCriteria && (
                        <p className="text-gray-400 mb-2">
                            Tìm kiếm cho: {searchCriteria}
                        </p>
                    )}
                    {searchResults.length > 0 && (
                        <p className="text-gray-300">
                            Tìm thấy <span className="text-red-500 font-bold">{searchResults.length}</span> kết quả
                        </p>
                    )}
                </div>

                {/* Advanced Search Filters */}
                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Tìm kiếm nâng cao</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Title Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Tiêu đề phim
                            </label>
                            <input 
                                type="text"
                                value={advancedSearch.title}
                                onChange={(e) => setAdvancedSearch({...advancedSearch, title: e.target.value})}
                                placeholder="Nhập tên phim..."
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                            />
                        </div>

                        {/* Genre Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Thể loại
                            </label>
                            <input 
                                type="text"
                                value={advancedSearch.genre}
                                onChange={(e) => setAdvancedSearch({...advancedSearch, genre: e.target.value})}
                                placeholder="VD: Action, Drama..."
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                            />
                        </div>

                        {/* Person Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Diễn viên/Đạo diễn
                            </label>
                            <input 
                                type="text"
                                value={advancedSearch.person}
                                onChange={(e) => setAdvancedSearch({...advancedSearch, person: e.target.value})}
                                placeholder="Nhập tên diễn viên/đạo diễn..."
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                            />
                        </div>

                        {/* Search Button */}
                        <div className="flex items-end">
                            <button 
                                onClick={handleAdvancedSearch}
                                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition-colors"
                            >
                                Tìm kiếm
                            </button>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-3">
                        💡 Bạn có thể nhập một hoặc nhiều tiêu chí tìm kiếm cùng lúc
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {/* Results Grid */}
                {searchResults.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 gap-6 mb-8">
                            {paginatedMovies.map((movie, index) => (
                                <div 
                                    key={`${movie.id || movie._id}-${index}`} 
                                    className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                                    onClick={() => navigate(`/movie-detail?id=${movie.id || movie._id}`)}
                                >
                                    {/* Movie Card */}
                                    <div className="flex gap-4 h-full">
                                        {/* Poster */}
                                        <div className="w-32 h-48 flex-shrink-0">
                                            <img 
                                                src={movie.image || PLACEHOLDER_IMAGE} 
                                                alt={movie.title}
                                                className="w-full h-full object-cover rounded-l-lg"
                                                onError={(e) => {
                                                    e.target.src = PLACEHOLDER_IMAGE;
                                                }}
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 p-4 flex flex-col justify-between">
                                            {/* Title, Year and Rating */}
                                            <div>
                                                <div className="flex justify-between items-start gap-2 mb-2">
                                                    <h3 className="text-lg font-semibold text-white hover:text-red-500 transition-colors cursor-pointer flex-1">
                                                        {movie.title}
                                                    </h3>
                                                    {movie.rate && (
                                                        <div className="flex items-center gap-1 bg-red-600/20 px-3 py-1 rounded flex-shrink-0">
                                                            <span className="text-yellow-400">★</span>
                                                            <span className="text-sm font-semibold text-yellow-400">
                                                                {parseFloat(movie.rate).toFixed(1)}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-400">
                                                    Năm: <span className="text-gray-300">{movie.year || 'N/A'}</span>
                                                </p>
                                            </div>

                                            {/* Description */}
                                            <div className="my-3">
                                                <p className="text-sm text-gray-300 line-clamp-3">
                                                    {movie.short_description || movie.description || 'Không có mô tả'}
                                                </p>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-8">
                                <Pagination 
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    paginate={setCurrentPage}
                                />
                            </div>
                        )}
                    </>
                ) : (
                    !isLoading && (
                        <div className="text-center py-12">
                            <p className="text-xl text-gray-400">Không tìm thấy phim nào</p>
                            <p className="text-gray-500 mt-2">Hãy thử tìm kiếm với từ khóa khác</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};
