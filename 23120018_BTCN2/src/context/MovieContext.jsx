import React, { createContext, useContext, useState, useCallback } from 'react';

import { getMoviesApi, getTopRatedMoviesApi, getPopularMoviesApi, searchMoviesApi, getMovieByIdApi } from '../api/api'; 

import { fetchPaginatedMovies } from '@/lib/utils';
import { set } from 'zod';

const MovieContext = createContext();

export const useMovies = () => useContext(MovieContext);

export const MoviesProvider = ({ children }) => {
    // Trạng thái chung
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Trạng thái dữ liệu
    const [popularMovies, setPopularMovies] = useState([]);
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    // Chi tiết phim hiện tại
    const [currentMovieDetail, setCurrentMovieDetail] = useState(null);

    // Hàm tải phim phổ biến
    const getPopularMovies = useCallback(async (totalItems = 30) => {
        setIsLoading(true);
        setError(null);
        try {
            const movies = await fetchPaginatedMovies(getPopularMoviesApi, [], totalItems);
            setPopularMovies(movies);
        } catch (err) {
            setError("Không thể tải phim phổ biến.");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Hàm tải phim xếp hạng cao
    const getTopRatedMovies = useCallback(async (category = 'IMDB_TOP_50', totalItems = 30) => {
        setIsLoading(true);
        setError(null);
        try {
            const movies = await fetchPaginatedMovies(getTopRatedMoviesApi, [category], totalItems);
            setTopRatedMovies(movies);
        } catch (err) {
            setError("Không thể tải phim xếp hạng cao.");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Hàm tìm kiếm
    const searchMovies = async (keyword, params = {}) => {
        try {
            const result = await searchMoviesApi(keyword, params);
            setSearchResults(result.data);
        } catch (err) {
            setError("Lỗi khi tìm kiếm phim.");
            throw err;
        }
    }
    
    // Hàm tải chi tiết phim
    const getMovieById = useCallback(async (movieId) => {
        setIsLoading(true);
        setError(null);
        setCurrentMovieDetail(null); // Xóa chi tiết phim cũ
        try {
            const result = await getMovieByIdApi(movieId);
            setCurrentMovieDetail(result);
            return result;
        } catch (err) {
            setError("Lỗi khi tải chi tiết phim.");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const value = {
        isLoading,
        error,
        popularMovies,
        topRatedMovies,
        searchResults,
        currentMovieDetail,
        setCurrentMovieDetail,
        getPopularMovies,
        getTopRatedMovies,
        searchMovies,
        getMovieById,
        
    };

    return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
};