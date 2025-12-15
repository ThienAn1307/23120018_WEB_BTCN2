// base URL của API
const BASE_URL = '/api';

// token truy cập API
const APP_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjIzXzMxIiwicm9sZSI6InVzZXIiLCJhcGlfYWNjZXNzIjp0cnVlLCJpYXQiOjE3NjUzNjE3NjgsImV4cCI6MTc3MDU0NTc2OH0.O4I48nov3NLaKDSBhrPe9rKZtNs9q2Tkv4yK0uMthoo';

// hàm lấy token người dùng từ localStorage (nếu có)
const getUserToken = () => localStorage.getItem('authToken');

// hàm thực hiện yêu cầu API với xử lý lỗi cơ bản
const handleRequest = async (url, options = {}) => {
    // Thêm header mặc định
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'x-app-token': APP_TOKEN,
        'Authorization': `Bearer ${APP_TOKEN}`,
        ...options.headers,
    };
    
    const finalOptions = {
        ...options,
        headers: defaultHeaders,
    };

    const response = await fetch(url, finalOptions);
    
    if (!response.ok) {
        let errorData = { message: 'Lỗi API: ' + response.status };
        try {
            const text = await response.text();
            if (text) {
                errorData = JSON.parse(text);
            }
        } catch (e) {
            // Không phải JSON, giữ nguyên lỗi
        }
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
    }

    if (response.status === 204) return null;
    return response.json();
};

// ----- AUTH API (USERS) -----

// Hàm đăng ký người dùng
export const registerApi = async (data) => {
    // data: { username, email, password, phone, dob }
    return handleRequest(`${BASE_URL}/users/register`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

// Hàm đăng nhập người dùng
export const loginApi = async (data) => {
    // data: { username, password }
    return handleRequest(`${BASE_URL}/users/login`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

// Hàm đăng xuất người dùng
export const logoutApi = async () => {
    const userToken = getUserToken();
    if (!userToken) {   
        return; // Không có token, không cần gọi API
    }

    return handleRequest(`${BASE_URL}/users/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${userToken}` },
    });
}

// Hàm lấy thông tin người dùng hiện tại
export const getCurrentUserApi = async () => {
    const userToken = getUserToken();
    if (!userToken) throw new Error('Yêu cầu đăng nhập');

    return handleRequest(`${BASE_URL}/users/profile`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${userToken}` },
    });
}

// Hàm cập nhật thông tin người dùng
export const updateUserApi = async (data) => {
    const userToken = getUserToken();
    if (!userToken) throw new Error('Yêu cầu đăng nhập');

    const updateData = {
        username: data.username,
        email: data.email,
        phone: data.phone,
        dob: data.dob,
    };

    return handleRequest(`${BASE_URL}/users/profile`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${userToken}` },
        body: JSON.stringify(updateData),
    });
}

// ----- FAVORITES API -----

// Hàm lấy danh sách phim yêu thích của người dùng
export const getFavoritesApi = async () => {
    const userToken = getUserToken();

    if (!userToken) return []; 
    return handleRequest(`${BASE_URL}/users/favorites`, {
        method: 'GET', 
        headers: { 'Authorization': `Bearer ${userToken}` } 
    });
};

export const addFavoritesApi = async (movieId) => {
    const userToken = getUserToken();

    if (!userToken) throw new Error('Yêu cầu đăng nhập');
    return handleRequest(`${BASE_URL}/users/favorites/${movieId}`, {
        method: 'POST', 
        headers: { 'Authorization': `Bearer ${userToken}` } 
    });
};

export const removeFavoritesApi = async (movieId) => {
    const userToken = getUserToken();

    if (!userToken) throw new Error('Yêu cầu đăng nhập');
    return handleRequest(`${BASE_URL}/users/favorites/${movieId}`, {
        method: 'DELETE', 
        headers: { 'Authorization': `Bearer ${userToken}` } 
    });
};

// ----- MOVIES API -----

// Hàm lấy danh sách phim với phân trang và lọc
export const getMoviesApi = async (page = 1, limit = 10) => { //
    const query = new URLSearchParams({ page, limit }).toString();
    const url = `${BASE_URL}/movies?${query ? `${query}` : ''}`;
    return handleRequest(url, {
        method: 'GET',
    });
};

// Hàm tìm kiếm phim theo từ khóa
export const searchMoviesApi = async (keyword, params = {}) => {
    const defaultParams = { page: 1, limit: 10 };
    params = { ...defaultParams, ...params };
    const query = new URLSearchParams(params).toString();
    const url = `${BASE_URL}/movies/search?${encodeURIComponent(keyword)}${query ? `?${query}` : ''}`;
    return handleRequest(url, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${APP_TOKEN}` }
    });
};

// Hàm lấy danh sách phim được xếp hạng cao
export const getTopRatedMoviesApi = async (category = 'IMDB_TOP_50', page = 1, limit = 10) => {
    const query = new URLSearchParams({category, page, limit }).toString();
    const url = `${BASE_URL}/movies/top-rated${query ? `?${query}` : ''}`;
    return handleRequest(url, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${APP_TOKEN}` }
    });
};

// Hàm lấy danh sách phim phổ biến nhất
export const getPopularMoviesApi = async (page = 1, limit = 10) => {
    const query = new URLSearchParams({ page, limit }).toString();
    const url = `${BASE_URL}/movies/most-popular${query ? `?${query}` : ''}`;
    return handleRequest(url, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${APP_TOKEN}` }
    });
};

// Hàm lấy thông tin chi tiết của một phim theo ID
export const getMovieByIdApi = async (movieId) => {
    return handleRequest(`${BASE_URL}/movies/${movieId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${APP_TOKEN}` }
    });
};

// ----- REVIEWS API -----

// Hàm lấy đánh giá của một phim
export const getReviewsByMovieIdApi = async (movieId) => {
    return handleRequest(`${BASE_URL}/movies/${movieId}/reviews`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${APP_TOKEN}` }
    });
};

// ----- PERSON API -----

// Hàm lấy danh sách diễn viên/đạo diễn
export const getPersonsApi = async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const url = `${BASE_URL}/persons${query ? `?${query}` : ''}`;
    return handleRequest(url, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${APP_TOKEN}` }
    });
};

// Hàm lấy thông tin chi tiết người và danh sách phim họ đã tham gia theo ID
export const getPersonByIdApi = async (personId) => {
    return handleRequest(`${BASE_URL}/persons/${personId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${APP_TOKEN}` }
    });
};