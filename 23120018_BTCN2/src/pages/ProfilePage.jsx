import React, { useState, useEffect } from 'react';
import { getCurrentUserApi, updateUserApi } from '../api/api'; 
import { User, Mail, Phone, Calendar, Star, Edit, Save, X } from 'lucide-react';
import { ProfileItem } from '../components/ProfileItem';

export const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [updateMessage, setUpdateMessage] = useState(null);

    const normalizeDateForInput = (isoDateString) => {
        if (!isoDateString) return '';
        
        // Nếu có T, cắt bỏ phần thời gian
        if (isoDateString.includes('T')) {
            return isoDateString.split('T')[0];
        }
        // Trường hợp khác (nếu API trả về định dạng lạ), cố gắng trả về nguyên gốc
        return isoDateString; 
    };

    const fetchProfile = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getCurrentUserApi();
            // Chuẩn hóa ngày sinh cho form input
            if (data.dob) {
                data.dob = normalizeDateForInput(data.dob);
            }

            setProfile(data);
            setFormData(data);
        } catch (err) {
            console.error("Lỗi khi tải thông tin người dùng:", err);
            setError("Không thể tải thông tin người dùng.");
        } finally {
            setIsLoading(false);
        }
    };

    // Tải thông tin người dùng khi component được gắn kết
    useEffect(() => {
        fetchProfile();
    }, []);

    // Logic xử lý form và cập nhật thông tin người dùng
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);
        setError(null);
        setUpdateMessage(null);

        const dataToSend = { ...formData };
        if (dataToSend.dob && !dataToSend.dob.includes('T')) {
            // Thêm phần thời gian và múi giờ giả định (00:00:00.000Z)
            dataToSend.dob = `${dataToSend.dob}T00:00:00.000Z`;
        }

        try {
            const result = await updateUserApi(dataToSend);

            setProfile(result);
            setIsEditing(false);
            setUpdateMessage("Cập nhật thông tin thành công!");
        } catch (err) {
            console.error("Lỗi khi cập nhật thông tin người dùng:", err);
            setError("Không thể cập nhật thông tin người dùng.");
        } finally {
            setIsSubmitting(false); 
        }
    };

    const handleCancel = () => {
        setFormData(profile);
        setIsEditing(false);
        setError(null);
        setUpdateMessage(null);
    };
    
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
            <form onSubmit={handleUpdate} className="max-w-xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
                            <User className="h-7 w-7 mr-2 text-indigo-600 dark:text-indigo-400" />
                            {isEditing ? 'Chỉnh Sửa Hồ Sơ' : 'Thông Tin Hồ Sơ'}
                        </h2>
                        <div>
                            { isEditing ? (
                                <div className="flex space-x-2">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-3 rounded-full mr-2 transition duration-150 flex items-center"
                                        disabled={isSubmitting}>
                                            <X className="h-5 w-5 mr-1" /> Hủy</button>
                                    <button
                                        type="submit"
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-3 rounded-full transition duration-150 flex items-center"
                                        disabled={isSubmitting}>
                                            {isSubmitting ? 'Đang lưu...' : <><Save className="h-5 w-5 mr-1" /> Lưu</>}
                                    </button>
                                </div>
                            ) : (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(true)}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-3 rounded-full transition duration-150 flex items-center"
                                    >
                                        <Edit className="h-5 w-5 mr-1" /> Chỉnh Sửa
                                    </button>
                            )}
                        </div>

                    </div>  
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        ID: {profile.id}
                    </p>

                    {updateMessage && (
                    <div className="p-4 bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200 border-l-4 border-green-500">
                        {updateMessage}
                    </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200 border-l-4 border-red-500">
                            Lỗi: {error}
                        </div>
                    )}
                </div>


                <div className="p-6 space-y-4">
                    <ProfileItem Icon={User} label="Tên người dùng" value={profile.username} color="text-indigo-500"/>
                    <ProfileItem Icon={Mail} label="Email" name="email" value={formData?.email || ''} color="text-blue-500" isEditable={isEditing} onChange={handleInputChange} />
                    <ProfileItem Icon={Phone} label="Số điện thoại" name="phone" value={formData?.phone || 'Chưa cung cấp'} color="text-green-500" isEditable={isEditing} onChange={handleInputChange}  />
                    <ProfileItem Icon={Calendar} label="Ngày sinh" name="dob" value={formData?.dob || ''} color="text-yellow-500" isEditable={isEditing} onChange={handleInputChange} inputType="date" displayValue={formatDOB(profile.dob)}/>
                    <ProfileItem Icon={Star} label="Vai trò" value={profile.role?.toUpperCase() || 'N/A'} color="text-red-500" isEditable={false}/>
                </div>
            </form>
        </div>
    );
};