import React, { useEffect, useContext, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; 
import { useMovies } from '../context/MovieContext';
import { Clock, Star, Film, Calendar, Award, MessageCircle, DollarSign, Users, ClipboardList, Zap } from 'lucide-react';
import { ReviewCard } from '../components/ReviewCard';
import { RatingsCard } from '../components/RatingsCard';
import { PersonCard } from '../components/PersonCard';
import { SimilarMovieCard } from '../components/SimilarMovieCard';
import { Pagination } from '../components/Pagination';

// Fallback placeholder as data URI (works offline)
const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450"%3E%3Crect fill="%23374151" width="300" height="450"/%3E%3Ctext x="50%25" y="50%25" font-size="20" fill="%239CA3AF" text-anchor="middle" dominant-baseline="middle" font-family="Arial"%3ENo Poster%3C/text%3E%3C/svg%3E';

export const MovieDetailPage = () => {
    const { getReviewsByMovieId } = useMovies();

    // Lấy ID phim từ Query String
    const [searchParams] = useSearchParams();
    const movieId = searchParams.get('id'); 
    
    // State để lưu đánh giá phim từ API
    const [fetchedReviewsData, setFetchedReviewsData] = useState(null);
    const [isReviewsLoading, setIsReviewsLoading] = useState(false);
    const [reviewsError, setReviewsError] = useState(null);

    // Lấy hàm và state từ Context
    const { getMovieById, isLoading, error } = useMovies();
    const [movieDetail, setMovieDetail] = useState(null);

    useEffect(() => {
        if (movieId) {
            getMovieById(movieId).then(data => {
                if(data) setMovieDetail(data);
                console.log("Movie Detail Data:", data);
            });
            getReviewsByMovieId(movieId).then(reviewsData => {
                if(reviewsData) setFetchedReviewsData(reviewsData);
            })
        }
        return () => { setMovieDetail(null); }; 
    }, [movieId, getMovieById]); 

    // Pagination state cho reviews
    const [reviewPage, setReviewPage] = useState(1);

    // Xử lý dữ liệu reviews từ API response
    const reviewsData = fetchedReviewsData || { data: movieDetail?.reviews || [], pagination: {} };
    const allReviews = reviewsData.data || [];
    const pagination = reviewsData.pagination || {};
    
    // Lấy thông tin pagination từ API
    const reviewsPerPage = 5;
    const totalReviews = pagination.total_items || allReviews.length;
    const totalReviewPages = pagination.total_pages || Math.ceil(totalReviews / reviewsPerPage);
    
    // Lấy reviews cho trang hiện tại
    const startIndex = (reviewPage - 1) * reviewsPerPage;
    const currentReviews = allReviews.slice(startIndex, startIndex + reviewsPerPage);

    const paginateReviews = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalReviewPages) {
            setReviewPage(pageNumber);
        }
    };
    // --- Xử lý hiển thị ---
    if (isLoading && !movieDetail) {
        return <div className="loading-state text-center p-8">Đang tải chi tiết phim...</div>;
    }
    if (error) {
        return <div className="error-state text-center p-8 text-red-600">{error}</div>;
    }
    if (!movieDetail) {
        return <div className="not-found-state text-center p-8">Không tìm thấy chi tiết phim.</div>;
    }
    
    const movie = movieDetail;

    return (
        <div className="movie-detail-page bg-gray-200 dark:bg-gray-900 min-h-screen">
            
            {/* Header và Poster Chính */}
            <div className="relative h-[550px] overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-all duration-500" 
                    style={{ backgroundImage: `url(${movie.image || PLACEHOLDER_IMAGE})` }}
                />
                <div className="absolute inset-0 bg-gray-400 dark:bg-gray-800 bg-opacity-80 flex items-center p-10 backdrop-blur-sm">
                    <img 
                        src={movie.image || PLACEHOLDER_IMAGE} 
                        alt={movie.title} 
                        className="w-full max-w-[300px] h-auto rounded-lg shadow-2xl flex-shrink-0 mr-10"
                        onError={(e) => {
                            if (e.target.src !== PLACEHOLDER_IMAGE) {
                                e.target.src = PLACEHOLDER_IMAGE;
                            }
                        }}
                    />
                    
                    {/* Tiêu đề & Thông số nhanh */}
                    <div>
                        <h1 className="text-5xl font-extrabold mb-2">{movie.full_title || movie.title}</h1>
                        <p className="text-xl text-gray-800 mb-4">{movie.year} | {movie.runtime}</p>
                        
                        {/* Ratings */}
                        <div className='mb-5'>
                            {movie.ratings && Object.keys(movie.ratings).length > 0 && (
                                <RatingsCard ratings={movie.ratings} />
                            )}
                        </div>
                        
                        {/* Genres */}
                        <p className="text-lg text-gray-800 dark:text-gray-300">
                            Thể loại: <span className="font-semibold text-gray-800 dark:text-white">{(movie.genres || []).join(', ') || 'N/A'}</span>
                        </p>

                        {/* Countries */}
                        <p className="text-lg text-gray-800 dark:text-gray-300">
                            Quốc gia: <span className="font-semibold text-gray-800 dark:text-white">{(movie.countries || []).join(', ') || 'N/A'}</span>
                        </p>
                        

                    </div>
                </div>
            </div>

            {/* Nội dung Chi tiết */}
            <div className="p-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* Cột 1 & 2: Plot, Awards, Crew */}
                <div className="lg:col-span-2 space-y-10">
                            
                    {/* Tóm tắt Chi tiết (Plot Full) */}
                    <div>
                        <h2 className="text-3xl font-bold border-b border-gray-700 pb-2 mb-4 flex items-center">
                            <ClipboardList className="h-6 w-6 mr-2 text-indigo-400" /> Cốt Truyện Chi Tiết
                        </h2>
                            
                        {movie.plot_full
                            ? movie.plot_full
                                .replace(/<\/p>/g, '\n\n') 
                                .replace(/<[^>]*>/g, '')
                                .trim()
                            : 'Chưa có thông tin cốt truyện'}
                    </div>
                    
                    {/* Giải thưởng */}
                    {movie.awards && (
                        <div>
                            <h3 className="text-2xl font-bold flex items-center mb-3 ">
                                <Award className="h-5 w-5 mr-2 text-yellow-600 dark:text-yellow-400" /> Giải Thưởng
                            </h3>
                            <div className="p-4 font-semibold bg-gray-300 dark:bg-gray-800 rounded-lg border border-gray-400 dark:border-gray-700 text-gray-800 dark:text-gray-300">{movie.awards}</div>
                        </div>
                    )}
                    
                    {/* Box Office */}
                    {movie.box_office && Object.keys(movie.box_office).length > 0 && (
                        <div>
                            <h3 className="text-2xl font-bold flex items-center mb-3">
                                <DollarSign className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" /> Doanh Thu
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {movie.box_office.budget && <DetailItem label="Ngân sách" value={movie.box_office.budget} />}
                                {movie.box_office.cumulativeWorldwideGross && <DetailItem label="Tổng Doanh thu" value={movie.box_office.cumulativeWorldwideGross} />}
                                {movie.box_office.grossUSA && <DetailItem label="Doanh thu Mỹ" value={movie.box_office.grossUSA} />}
                                {movie.box_office.openingWeekendUSA && <DetailItem label="Doanh thu cuối tuần mở màn Mỹ" value={movie.box_office.openingWeekendUSA} />}
                            </div>
                        </div>
                    )}

                    {/* Đánh giá (Reviews) */}
                    <div>
                        <h2 className="text-3xl font-bold border-b border-gray-700 pb-2 mb-4 flex items-center">
                            <MessageCircle className="h-6 w-6 mr-2 text-pink-400" /> Đánh Giá ({totalReviews || 0})
                        </h2>
                        {isReviewsLoading && (
                            <p className="text-blue-400 p-4">Đang tải đánh giá...</p>
                        )}
                        {reviewsError && (
                            <p className="text-red-400 p-4">Lỗi tải đánh giá: {reviewsError}</p>
                        )}
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                {currentReviews.length > 0 ? (
                                    currentReviews.map((review, index) => ( 
                                        <ReviewCard 
                                            // Key: Sử dụng index trong trang hiện tại + số trang
                                            key={`review-${reviewPage}-${index}`} 
                                            review={review} 
                                        />
                                    ))
                                ) : (
                                    <p className="text-gray-400 p-4">Chưa có đánh giá nào.</p>
                                )}
                            </div>
                            
                            {/* Thanh Phân Trang (Chỉ hiện nếu có nhiều hơn 1 trang) */}
                            <Pagination 
                                totalPages={totalReviewPages}
                                currentPage={reviewPage}
                                paginate={paginateReviews}
                            />
                    </div>
                </div>
                
                {/* Cột 3: Sidebar - Đạo diễn, Diễn viên, Phim tương tự */}
                <div className="lg:col-span-1 space-y-8">
                    
                    {/* Đạo diễn */}
                    <div>
                        <h3 className="text-2xl font-bold flex items-center mb-3">
                            <Film className="h-5 w-5 mr-2 text-indigo-400" /> Đạo Diễn
                        </h3>
                        {(movie.directors || []).map(director => (
                            <PersonCard key={director.id} person={director} role="Đạo diễn" />
                        ))}
                    </div>

                    {/* Diễn viên */}
                    <div>
                        <h3 className="text-2xl font-bold flex items-center mb-3">
                            <Users className="h-5 w-5 mr-2 text-teal-500" /> Diễn Viên Chính
                        </h3>
                        
                        <div className="max-h-96 overflow-y-auto pr-2"> 
                            {(movie.actors || []).map(actor => (
                                <PersonCard 
                                    key={actor.id || actor.name} 
                                    person={actor} 
                                    role={actor.character} 
                                />
                            ))}
                        </div>
                        
                    </div>

                    {/* Phim tương tự */}
                    <div>
                        <h3 className="text-2xl font-bold border-b border-gray-700 pb-2 mb-4">Phim Tương Tự</h3>
                        <div className="space-y-4">
                            {(movie.similar_movies || []).slice(0, 4).map(similar => (
                                <SimilarMovieCard key={similar.id} movie={similar} />
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

// Item thông số chung
const DetailItem = ({ label, value }) => (
    <div className="p-3 bg-gray-300 dark:bg-gray-800 rounded-lg border border-gray-400 dark:border-gray-700">
        <span className="text-sm text-gray-700 dark:text-gray-400 uppercase font-medium block">{label}</span>
        <span className="text-lg font-bold text-gray-900 dark:text-white block mt-1">{value}</span>
    </div>
);