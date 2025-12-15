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


// Định nghĩa Zod Schema cho form đăng ký
export const RegisterSchema = z.object({
    username: z.string().min(3, "Username phải có ít nhất 3 ký tự."),
    
    email: z.string().email("Địa chỉ Email không hợp lệ."),
    
    // Số điện thoại Việt Nam (10 số, bắt đầu bằng 0)
    phone: z.string().regex(/^0\d{9}$/, "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0."),
    
    // DOB: Kiểm tra là một chuỗi ngày hợp lệ
    dob: z.string().refine((val) => {
        // Kiểm tra xem chuỗi có phải là định dạng ngày hợp lệ (yyyy-mm-dd) hay không
        return !isNaN(Date.parse(val)) && val.match(/^\d{4}-\d{2}-\d{2}$/);
    }, {
        message: "Ngày sinh không hợp lệ (cần định dạng YYYY-MM-DD).",
    }),
    
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự."),
});

export const RegisterPage = () => {
    // State cho nút hiển thị mật khẩu
    const [showPassword, setShowPassword] = useState(false);
    const [apiError, setApiError] = useState(null); // Lỗi từ API
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { register: authRegister, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Cấu hình React Hook Form với Zod Resolver
    const { 
        register,
        handleSubmit,
        formState: { errors, isValid, isDirty }
    } = useForm({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            username: '',
            email: '',
            phone: '',
            dob: '',
            password: '',
        }
    });

    if (isAuthenticated) {
        navigate('/');
        return null;
    }

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const onSubmit = async (data) => {
        setApiError(null);
        setIsSubmitting(true);
        
        try {
            // Dữ liệu 'data' đã được Zod xác thực
            await authRegister(data); 
            navigate('/login');
            
        } catch (err) {
            console.error("Lỗi đăng ký API:", err);
            setApiError(err.message || "Đăng ký thất bại. Vui lòng thử lại sau.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Hàm hiển thị lỗi cho từng trường
    const renderFieldError = (fieldName) => {
        // Hiển thị lỗi cho từng trường nếu có
        return errors[fieldName] ? (
            <p className="text-red-500 text-xs mt-1 dark:text-red-400">{errors[fieldName].message}</p>
        ) : null;
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 p-4">
            <Card className="w-full max-w-md dark:bg-gray-900 dark:border-gray-800">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold dark:text-white">Đăng Ký Tài Khoản</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4"> 
                        
                        {/* Trường Username */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                            <Input
                                id="username" type="text" placeholder="Tên đăng nhập" disabled={isSubmitting}
                                {...register("username")} 
                                className={`dark:bg-gray-800 dark:border-gray-700 dark:text-white ${errors.username ? 'border-red-500' : ''}`}
                            />
                            {renderFieldError('username')}
                        </div>

                        {/* Trường Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                            <Input
                                id="email" type="email" placeholder="Nhập email" disabled={isSubmitting}
                                {...register("email")}
                                className={`dark:bg-gray-800 dark:border-gray-700 dark:text-white ${errors.email ? 'border-red-500' : ''}`}
                            />
                            {renderFieldError('email')}
                        </div>

                        {/* Trường Phone */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Số điện thoại</label>
                            <Input
                                id="phone" type="tel" placeholder="VD: 0901234567" disabled={isSubmitting}
                                {...register("phone")}
                                className={`dark:bg-gray-800 dark:border-gray-700 dark:text-white ${errors.phone ? 'border-red-500' : ''}`}
                            />
                            {renderFieldError('phone')}
                        </div>

                        {/* Trường DOB */}
                        <div>
                            <label htmlFor="dob" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ngày sinh</label>
                            <Input
                                id="dob" type="date" disabled={isSubmitting}
                                {...register("dob")}
                                className={`dark:bg-gray-800 dark:border-gray-700 dark:text-white ${errors.dob ? 'border-red-500' : ''}`}
                            />
                            {renderFieldError('dob')}
                        </div>

                        {/* Trường Mật khẩu */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mật khẩu</label>
                            <div className="relative"> 
                                <Input
                                    id="password" name="password" 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="Tối thiểu 6 ký tự"
                                    disabled={isSubmitting}
                                    {...register("password")}
                                    className={`w-full pr-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${errors.password ? 'border-red-500' : ''}`}
                                />
                                {renderFieldError('password')}
                                <Button 
                                    type="button" variant="ghost" size="sm"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-0 top-0 h-full px-3 py-1 hover:bg-transparent dark:text-gray-400 dark:hover:text-white"
                                    disabled={isSubmitting}
                                >
                                    {showPassword ? (<EyeOff className="h-4 w-4" />) : (<Eye className="h-4 w-4" />)}
                                </Button>
                            </div>
                        </div>

                        {/* Hiển thị Lỗi API (nếu có) */}
                        {apiError && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm dark:bg-red-900/30 dark:border-red-600 dark:text-red-300" role="alert">
                                Lỗi API: {apiError}
                            </div>
                        )}

                        {/* Nút Đăng ký */}
                        <Button
                            type="submit"
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 transition duration-200 mt-6"
                            disabled={isSubmitting || (isDirty && !isValid)} 
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang Đăng ký...
                                </>
                            ) : (
                                "Đăng Ký Tài Khoản"
                            )}
                        </Button>
                    </form>

                    {/* Liên kết Đăng nhập */}
                    <p className="mt-4 text-center text-sm dark:text-gray-400">
                        Đã có tài khoản?{' '}
                        <Link 
                            to="/login" 
                            className="text-red-600 hover:text-red-500 font-medium transition duration-150"
                        >
                            Đăng nhập ngay
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};