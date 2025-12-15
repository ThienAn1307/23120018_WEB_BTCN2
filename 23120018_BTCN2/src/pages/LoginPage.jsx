import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Loader2, Eye, EyeOff } from 'lucide-react';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Định nghĩa Zod Schema cho form đăng nhập
export const LoginSchema = z.object({
    username: z.string().min(3, "Username phải có ít nhất 3 ký tự."),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự."),
});

export const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);

    const [apiError, setApiError] = useState(null);
    
    const { login, isAuthenticated } = useAuth(); 
    const navigate = useNavigate();

    const { 
        register, // Hàm đăng ký input của RHF
        handleSubmit, // Wrapper xử lý submit
        formState: { errors, isSubmitting } // isSubmitting thay cho state local
    } = useForm({
        resolver: zodResolver(LoginSchema), // Kết nối với Zod Schema
        defaultValues: {
            username: '',
            password: '',
        }
    });

    if (isAuthenticated) {
        navigate('/');
        return null;
    }

    const onSubmit = async (data) => {
        setApiError(null);
        try {
            const { username, password } = data;
            await login(username, password);
            navigate('/'); // Chuyển hướng sau khi đăng nhập thành công
        } catch (err) {
            console.error("Lỗi đăng nhập API:", err);
            setApiError(err.message || "Đã có lỗi xảy ra trong quá trình đăng nhập.");
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const renderFieldError = (fieldName) => {
        return errors[fieldName] ? (
            <p className="text-red-500 text-xs mt-1 dark:text-red-400">{errors[fieldName].message}</p>
        ) : null;
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 p-4">
            <Card className="w-full max-w-md dark:bg-gray-900 dark:border-gray-800">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold dark:text-white">Đăng Nhập</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        
                        {/* Trường Username */}
                        <div>
                            <label 
                                htmlFor="username" 
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                                Username
                            </label>
                            <Input
                                id="username"
                                name="username"
                                type="text" 
                                required
                                {...register("username")}
                                placeholder="Tên đăng nhập"
                                disabled={isSubmitting}
                                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            />
                            {renderFieldError('username')}
                        </div>

                        {/* Trường Mật khẩu */}
                        <div>
                            <label 
                                htmlFor="password" 
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    {...register("password")}
                                    placeholder="Nhập mật khẩu"
                                    disabled={isSubmitting}
                                    className="w-full pr-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                />
                                {renderFieldError('password')}
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-0 top-0 h-full px-3 py-1 hover:bg-transparent dark:text-gray-400 dark:hover:text-white"
                                    disabled={isSubmitting}
                                >
                                    {/* Hiển thị icon tương ứng với trạng thái */}
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Hiển thị lỗi */}
                        {apiError && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm dark:bg-red-900/30 dark:border-red-600 dark:text-red-300" role="alert">
                                {apiError}
                            </div>
                        )}

                        {/* Nút Đăng nhập */}
                        <Button
                            type="submit"
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 transition duration-200"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : (
                                "Đăng Nhập"
                            )}
                        </Button>
                    </form>

                    {/* Liên kết đăng ký */}
                    <p className="mt-4 text-center text-sm dark:text-gray-400">
                        Chưa có tài khoản?{' '}
                        <Link 
                            to="/register" 
                            className="text-red-600 hover:text-red-500 font-medium transition duration-150"
                        >
                            Đăng ký ngay
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    )
};