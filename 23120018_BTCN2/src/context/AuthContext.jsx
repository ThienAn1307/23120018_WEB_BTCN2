import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
    loginApi, 
    registerApi, 
    logoutApi
} from '../api/api'; 

const getUserToken = () => localStorage.getItem('authToken');

// Khởi tạo Context
const AuthContext = createContext();

// Hook để sử dụng AuthContext 
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // Trạng thái người dùng và trạng thái loading
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Kiểm tra trạng thái đăng nhập khi khởi tạo ứng dụng
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                // Xử lý lỗi JSON parse nếu localStorage bị hỏng
                localStorage.clear();
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    // --- LOGIC AUTH VỚI API ---

    const login = async (username, password) => {
        setLoading(true);
        try {
            // Gọi API Login
            const loginData = {username, password};
            const { user: userData, token } = await loginApi(loginData);
            
            // Lưu trữ
            localStorage.setItem('authToken', token);
            
            // Cập nhật trạng thái
            setUser(userData);

            setLoading(false);
            return true;
        } catch (error) {
            setLoading(false);
            // Re-throw để LoginPage hiển thị lỗi
            throw error; 
        }
    };

    const register = async (data) => {
        setLoading(true);
        try {
            await registerApi(data);
            
            setLoading(false);
            return true;
        } catch (error) {
            setLoading(false);
            throw error; 
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            // Gọi API logout 
            await logoutApi(); 
        } catch (error) {
            console.warn("Logout API failed, continuing client cleanup.", error);
        } finally {
            // Xóa trạng thái và lưu trữ cục bộ
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setUser(null);
            setLoading(false);
        }
    };

    // --- VALUE CUNG CẤP QUA CONTEXT ---
    const value = {
        user,
        isAuthenticated: !!user,
        loading,
        // Auth methods
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {/* Chỉ render children khi trạng thái loading ban đầu hoàn tất */}
            {!loading && children}
        </AuthContext.Provider>
    );
};