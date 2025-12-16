import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getFavoritesApi, addFavoritesApi, removeFavoritesApi } from '../api/api';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [favoritesIds, setFavoritesIds] = useState(new Set());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch danh sách phim yêu thích
    const fetchFavorites = useCallback(async () => {
        if (!user) {
            setFavorites([]);
            setFavoritesIds(new Set());
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const data = await getFavoritesApi();
            setFavorites(data || []);
            // Tạo Set các ID để kiểm tra nhanh
            setFavoritesIds(new Set((data || []).map(movie => movie.id)));
        } catch (err) {
            console.error("Lỗi khi tải phim yêu thích:", err);
            setError(err.message);
            setFavorites([]);
            setFavoritesIds(new Set());
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    // Load favorites khi user đăng nhập
    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    // Kiểm tra xem phim có trong danh sách yêu thích không
    const isFavorite = useCallback((movieId) => {
        return favoritesIds.has(movieId);
    }, [favoritesIds]);

    // Thêm phim vào danh sách yêu thích
    const addFavorite = useCallback(async (movie) => {
        if (!user) {
            throw new Error('Vui lòng đăng nhập để thêm phim yêu thích');
        }

        try {
            await addFavoritesApi(movie.id);
            
            // Cập nhật state local
            setFavorites(prev => [...prev, movie]);
            setFavoritesIds(prev => new Set([...prev, movie.id]));
            
            return true;
        } catch (err) {
            console.error("Lỗi khi thêm phim yêu thích:", err);
            throw err;
        }
    }, [user]);

    // Xóa phim khỏi danh sách yêu thích
    const removeFavorite = useCallback(async (movieId) => {
        if (!user) {
            throw new Error('Vui lòng đăng nhập');
        }

        try {
            await removeFavoritesApi(movieId);
            
            // Cập nhật state local
            setFavorites(prev => prev.filter(movie => movie.id !== movieId));
            setFavoritesIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(movieId);
                return newSet;
            });
            
            return true;
        } catch (err) {
            console.error("Lỗi khi xóa phim yêu thích:", err);
            throw err;
        }
    }, [user]);

    // Toggle favorite (thêm hoặc xóa)
    const toggleFavorite = useCallback(async (movie) => {
        if (isFavorite(movie.id)) {
            await removeFavorite(movie.id);
            return false; // Đã xóa
        } else {
            await addFavorite(movie);
            return true; // Đã thêm
        }
    }, [isFavorite, addFavorite, removeFavorite]);

    const value = {
        favorites,
        favoritesIds,
        isLoading,
        error,
        fetchFavorites,
        isFavorite,
        addFavorite,
        removeFavorite,
        toggleFavorite,
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};
