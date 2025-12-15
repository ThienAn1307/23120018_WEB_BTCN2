import React, { useState, useEffect } from 'react';
import { getCurrentUserApi } from '../api/api'; 
import { User, Mail, Phone, Calendar, Star } from 'lucide-react';

export const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProfile = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getCurrentUserApi();
            setProfile(data);
        } catch (err) {
            console.error("Lỗi khi tải thông tin người dùng:", err);
            setError("Không thể tải thông tin người dùng.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (isLoading) {
        return <div>Đang tải thông tin người dùng...</div>;
    }

    if (error) {
        return (
            <div className="text-center p-8 text-red-600 dark:text-red-400">
                Lỗi: {error}
            </div>
        );
    }

    if (!profile) {
        return <div className="text-center p-8 text-gray-600 dark:text-gray-400">Không có dữ liệu người dùng.</div>;
    }

    const formatDOB = (dateString) => {
        if (!dateString) return 'Chưa cung cấp';
        try {
            return new Date(dateString).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        } catch {
            return dateString; 
        }
    };

    return (
        <div className="p-4 sm:p-8 bg-gray-100 dark:bg-gray-900">
            <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
                        <User className="h-7 w-7 mr-2 text-indigo-600 dark:text-indigo-400" />
                        Thông Tin Hồ Sơ
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        ID: {profile.id}
                    </p>
                </div>

                <div className="p-6 space-y-4">
                    <ProfileItem Icon={User} label="Tên người dùng" value={profile.username} color="text-indigo-500" />
                    <ProfileItem Icon={Mail} label="Email" value={profile.email} color="text-blue-500" />
                    <ProfileItem Icon={Phone} label="Số điện thoại" value={profile.phone || 'Chưa cung cấp'} color="text-green-500" />
                    <ProfileItem Icon={Calendar} label="Ngày sinh" value={formatDOB(profile.dob)} color="text-yellow-500" />
                    <ProfileItem Icon={Star} label="Vai trò" value={profile.role?.toUpperCase() || 'N/A'} color="text-red-500" />
                </div>
            </div>
        </div>
    );
};

const ProfileItem = ({ Icon, label, value, color }) => (
    <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <Icon className={`h-6 w-6 flex-shrink-0 ${color}`} />
        <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-base font-semibold text-gray-800 dark:text-white break-words">{value}</p>
        </div>
    </div>
);