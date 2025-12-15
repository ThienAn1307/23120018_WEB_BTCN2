import React from 'react';
import { Button } from './ui/button';
import { Switch } from './ui/switch'; 
import { Settings, User, LogOut } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate(); 
    // Hàm xử lý Dark Mode
    const handleDarkMode = (checked) => {
        if (checked) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    // Hàm xử lý khi chọn Profile
    const handleProfile = () => {
    if (user) {
            console.log('Đang đăng nhập. Chuyển đến trang Profile.');
            navigate('/profile'); // Chuyển hướng đến trang Profile
        } else {
            alert('Bạn chưa đăng nhập. Chuyển hướng đến trang Login.');
            navigate('/login'); // Chuyển hướng đến trang Login
        }
    };

    // Hàm xử lý khi chọn Logout
    const handleLogout = async () => {
        try {
            if (!user) {
                alert('Bạn chưa đăng nhập. Chuyển hướng đến trang Login.');
                navigate('/login'); // Chuyển hướng đến trang Login
                return;
            }
            await logout();
            alert('Đăng xuất thành công!');
            navigate('/'); // Chuyển hướng về trang chủ sau khi đăng xuất
        } catch (error) {
            console.error('Lỗi khi đăng xuất:', error);
            alert('Đăng xuất thất bại. Vui lòng thử lại.');
        }
    };

    return (
        <header className="flex items-center justify-between p-4 border-b bg-white dark:bg-gray-900">
            <div className="text-lg font-bold text-red-600 dark:text-red-400">23120018</div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">Movies Info</div>
            
            <div className="flex items-center space-x-4"> 
                {/* Dark Mode Switch */}
                <Switch id="dark-mode" onCheckedChange={handleDarkMode} />
                {/* Settings */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="px-3 py-2">
                            <Settings className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={handleProfile}>
                            <User className="mr-2 h-4 w-4" />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};