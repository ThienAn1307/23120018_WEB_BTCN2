import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Home } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useLoading } from '../context/LoadingContext';
import { useMovies } from '../context/MovieContext';

export const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { startLoading, stopLoading } = useLoading();
    const { searchMovies } = useMovies();

    // Check if on search page
    const isOnSearchPage = location.pathname === '/search';

    // Xử lý khi người dùng nhấn Enter hoặc nút Search
    const handleSearch = async (e) => {
        e.preventDefault();
        
        // Disable search khi đang ở SearchPage
        if (isOnSearchPage) {
            setSearchTerm('');
            return;
        }

        if (searchTerm.trim()) {
            try {
                const results = await searchMovies(searchTerm.trim(), { q: searchTerm.trim() }, 100);
                
                // Điều hướng đến trang search sau khi fetch xong
                navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
                setSearchTerm('');
            } catch (error) {
                console.error('❌ Lỗi tìm kiếm:', error.message);
            }
        }
    };

    const handleHomeClick = (e) => {
        e.preventDefault();
        startLoading();
        setTimeout(() => {
            navigate('/');
            stopLoading();
        }, 500);
    };

    return (
        <nav className="bg-gray-100 dark:bg-gray-800 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-14">
                
                {/* Nút Home */}
                <div className="flex items-center">
                    <button onClick={handleHomeClick} className="text-red-600 hover:bg-gray-200 rounded dark:text-red-400 dark:hover:bg-gray-700 transition duration-150">
                        <Home className="m-2 h-6 w-6" />
                    </button>
                </div>
                
                {/* Search Box và Search Button */}
                <form onSubmit={handleSearch} className="flex items-center space-x-2 w-full max-w-lg">
                    {/* Search Box */}
                    <div className="relative flex-grow">
                        <Input 
                            type="text"
                            placeholder="Tìm kiếm phim..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:ring-red-500 focus:border-red-500"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-300" />
                    </div>
                    
                    {/* Search Button */}
                    <Button 
                        type="submit" 
                        className={`${isOnSearchPage ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-400'} dark:bg-red-400 dark:hover:bg-red-500 text-white font-medium px-4 py-2`}
                        disabled={isOnSearchPage}
                    >
                        <Search className="h-5 w-5 md:hidden" /> 
                        <span className="hidden md:inline">{isOnSearchPage ? 'Dùng tìm kiếm nâng cao' : 'Tìm Kiếm'}</span>
                    </Button>
                </form>

            </div>
        </nav>
    );
};