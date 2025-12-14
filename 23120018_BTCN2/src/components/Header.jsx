import React from 'react';
import { Button } from './ui/button';
import { Switch } from './ui/switch'; 
import { Settings } from 'lucide-react';

export const Header = () => {
    // Hàm xử lý Dark Mode
    const handleDarkMode = (checked) => {
        if (checked) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
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
                <Button variant="outline" className="px-3 py-2">
                    <Settings className="h-5 w-5" />
                </Button>
            </div>
        </header>
    );
};