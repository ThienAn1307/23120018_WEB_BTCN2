export const ReviewCard = ({ review }) => {
    // HÀM FORMAT NGÀY THÁNG
    const formatReviewDate = (isoDate) => {
        if (!isoDate) return 'Không rõ ngày';
        try {
            return new Date(isoDate).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }); // Kết quả: 15/12/2025
        } catch (e) {
            return isoDate.split('T')[0]; // Dự phòng nếu format thất bại (chỉ lấy phần ngày)
        }
    };
    return (
    <div className="p-4 bg-gray-300 dark:bg-gray-800 rounded-lg border border-gray-400 dark:border-gray-700">
        <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-lg text-gray-900 dark:text-white">{review.title || 'Đánh giá không tiêu đề'}</span>
            <span className={`text-xl font-bold ${review.rate >= 7 ? 'text-green-600' : 'text-yellow-600'}`}>
                {review.rate ? review.rate + '/10.0' : 'N/A'}
            </span>
        </div>
        <div className="flex items-center space-x-2"> 
            <p className="text-gray-900 dark:text-gray-300 text-lg font-bold">{review.user} </p>
            <p className="text-gray-900 dark:text-gray-300 text-sm italic">{formatReviewDate(review.date)}</p>
        </div>
        <p className="text-gray-500 text-sm line-clamp-3">{review.content}</p>

    </div>
    )
};