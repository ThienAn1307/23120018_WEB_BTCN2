import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getPersonByIdApi, searchMoviesApi } from '../api/api';
import { SimilarMovieCard } from '../components/SimilarMovieCard';
import { Pagination } from '../components/Pagination';
import { Calendar, Users, Award, Heart } from 'lucide-react';

export const PersonDetailPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const personId = searchParams.get('id');

    const [personDetail, setPersonDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [relatedMovies, setRelatedMovies] = useState([]);
    const [isLoadingMovies, setIsLoadingMovies] = useState(false);
    const [moviePage, setMoviePage] = useState(1);

    useEffect(() => {
        if (!personId) {
            setError('Không tìm thấy ID người');
            return;
        }

        const fetchPersonDetail = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getPersonByIdApi(personId);
                console.log('Person Detail:', data);
                setPersonDetail(data);
                
                // Tìm kiếm phim dựa vào tên người
                if (data.name) {
                    setIsLoadingMovies(true);
                    try {
                        const moviesData = await searchMoviesApi({ person: data.name, limit: 50 });
                        console.log('Search Movies Result:', moviesData);
                        setRelatedMovies(moviesData.data || []);
                    } catch (err) {
                        console.error('Error searching movies:', err);
                    } finally {
                        setIsLoadingMovies(false);
                    }
                }
            } catch (err) {
                console.error('Error fetching person detail:', err);
                setError(err.message || 'Lỗi khi tải thông tin người');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPersonDetail();
    }, [personId]);

    if (isLoading) {
        return (
            <div className="loading-state text-center p-8 text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-900 min-h-screen flex items-center justify-center">
                Đang tải thông tin...
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-state text-center p-8 text-red-600 bg-gray-200 dark:bg-gray-900 min-h-screen flex items-center justify-center flex-col">
                {error}
                <button
                    onClick={() => navigate(-1)}
                    className="block mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                >
                    Quay lại
                </button>
            </div>
        );
    }

    if (!personDetail) {
        return (
            <div className="not-found-state text-center p-8 text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-900 min-h-screen flex items-center justify-center flex-col">
                Không tìm thấy thông tin người.
                <button
                    onClick={() => navigate(-1)}
                    className="block mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                >
                    Quay lại
                </button>
            </div>
        );
    }

    const person = personDetail;
    const knownFor = person.known_for || [];
    
    // Sử dụng relatedMovies từ search API, nếu không có thì dùng known_for
    const moviesToDisplay = relatedMovies.length > 0 ? relatedMovies : knownFor;
    
    // Phân trang phim
    const moviesPerPage = 4;
    const totalMovies = moviesToDisplay.length;
    const totalMoviePages = Math.ceil(totalMovies / moviesPerPage);
    const startIndex = (moviePage - 1) * moviesPerPage;
    const currentMovies = moviesToDisplay.slice(startIndex, startIndex + moviesPerPage);
    
    const paginateMovies = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalMoviePages) {
            setMoviePage(pageNumber);
        }
    };

    return (
        <div className="person-detail-page bg-gray-200 dark:bg-gray-900 min-h-screen">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-gradient-to-b from-gray-300 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                    style={{
                        backgroundImage: `url(${person.image || 'default_poster.jpg'})`
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-400 via-gray-400 to-gray-300 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 bg-opacity-90 backdrop-blur-sm"></div>
                <div className="relative p-10 max-w-7xl mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-6 px-4 py-2 bg-slate-600 dark:bg-slate-500 hover:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
                    >
                        ← Quay lại
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Poster */}
                        <div className="md:col-span-1">
                            <img
                                src={person.image || 'default_poster.jpg'}
                                alt={person.name}
                                className="w-full h-auto rounded-lg shadow-2xl"
                            />
                        </div>

                        {/* Info Section */}
                        <div className="md:col-span-3">
                            <h1 className="text-5xl font-extrabold mb-2 text-gray-900 dark:text-white">{person.name}</h1>
                            <p className="text-2xl text-gray-700 dark:text-gray-300 mb-8 font-semibold">
                                {person.role || 'Diễn viên/Đạo diễn'}
                            </p>

                            {/* Info Grid */}
                            <div className="space-y-3">
                                {person.birth_date && (
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm text-gray-800 dark:text-gray-200 uppercase font-bold">
                                            Ngày sinh:
                                        </p>
                                        <p className="text-gray-900 dark:text-white font-semibold">
                                            {new Date(person.birth_date).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                )}

                                {person.death_date && (
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm text-gray-800 dark:text-gray-200 uppercase font-bold">
                                            Ngày mất:
                                        </p>
                                        <p className="text-gray-900 dark:text-white font-semibold">
                                            {new Date(person.death_date).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                )}

                                {person.height && (
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm text-gray-800 dark:text-gray-200 uppercase font-bold">
                                            Chiều cao:
                                        </p>
                                        <p className="text-gray-900 dark:text-white font-semibold">
                                            {person.height}
                                        </p>
                                    </div>
                                )}

                                {knownFor.length > 0 && (
                                    <div className="flex flex-col gap-2">
                                        <p className="text-sm text-gray-800 dark:text-gray-200 uppercase font-bold">
                                            Phim nổi tiếng ({knownFor.length}):
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {knownFor.slice(0, 5).map((movie) => (
                                                <span 
                                                    key={movie.id} 
                                                    className="inline-block px-3 py-1 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white text-xs rounded-full font-semibold hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                                                    onClick={() => navigate(`/movie-detail?id=${movie.id}`)}
                                                    title={movie.title}
                                                >
                                                    {movie.title.length > 15 ? movie.title.substring(0, 15) + '...' : movie.title}
                                                </span>
                                            ))}
                                            {knownFor.length > 5 && (
                                                <span className="inline-block px-3 py-1 text-gray-600 dark:text-gray-400 text-xs font-semibold">
                                                    +{knownFor.length - 5} phim khác
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-10 max-w-7xl mx-auto">
                {/* Summary */}
                {person.summary && (
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold border-b border-gray-400 dark:border-gray-600 pb-2 mb-4 text-gray-900 dark:text-white">
                            Tiểu sử
                        </h2>
                        <p className="text-gray-800 dark:text-gray-300 leading-relaxed text-lg">
                            {person.summary}
                        </p>
                    </div>
                )}

                {/* Known For Movies */}
                {moviesToDisplay.length > 0 && (
                    <div>
                        <h2 className="text-3xl font-bold border-b border-gray-400 dark:border-gray-600 pb-2 mb-6 flex items-center text-gray-900 dark:text-white">
                            <Heart className="h-6 w-6 mr-2 text-red-500" />
                            Phim tham gia ({moviesToDisplay.length})
                        </h2>
                        {isLoadingMovies && (
                            <p className="text-blue-600 dark:text-blue-400 p-4">Đang tải danh sách phim...</p>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {currentMovies.map((movie) => (
                                <div
                                    key={movie.id}
                                    className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow cursor-pointer hover:scale-105 transform transition-transform border border-gray-300 dark:border-gray-700"
                                    onClick={() => navigate(`/movie-detail?id=${movie.id}`)}
                                >
                                    <img
                                        src={movie.image || 'default_poster.jpg'}
                                        alt={movie.title}
                                        className="w-full h-64 object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                            {movie.title}
                                        </h3>
                                        <p className="text-sm text-gray-700 dark:text-gray-400 mb-2">
                                            ({movie.year})
                                        </p>
                                        {movie.genres && movie.genres.length > 0 && (
                                            <p className="text-sm text-gray-700 dark:text-gray-400 mb-3">
                                                {movie.genres.join(', ')}
                                            </p>
                                        )}
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold px-2 py-1 bg-yellow-500 text-gray-900 rounded">
                                                ⭐ {movie.rate || 'N/A'}
                                            </span>
                                            {movie.role && (
                                                <span className="text-xs text-indigo-400 font-semibold">
                                                    {movie.role}
                                                    {movie.character && `: ${movie.character}`}
                                                </span>
                                            )}
                                        </div>
                                        {movie.short_description && (
                                            <p className="text-xs text-gray-700 dark:text-gray-400 mt-3 line-clamp-2">
                                                {movie.short_description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Thanh Phân Trang */}
                        <Pagination 
                            totalPages={totalMoviePages}
                            currentPage={moviePage}
                            paginate={paginateMovies}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
