import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PersonCard = ({ person, role }) => {
    const navigate = useNavigate();

    const handlePersonClick = () => {
        if (person.id) {
            navigate(`/person-detail?id=${person.id}`);
        }
    };

    return (
        <div 
            onClick={handlePersonClick}
            className="flex items-center space-x-3 p-3 bg-gray-300 dark:bg-gray-800 rounded-lg mb-2 cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-700 transition-colors transform hover:scale-105 transition-transform"
        >
            {person.image && person.image !== '' ? (
                <img 
                    src={person.image} 
                    alt={person.name} 
                    className="w-12 h-12 object-cover rounded-full flex-shrink-0"
                />
            ) : (
                <div className="w-12 h-12 bg-gray-400 dark:bg-gray-700 rounded-full flex-shrink-0 flex items-center justify-center">
                    <Users className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                </div>
            )}
            <div>
                <p className="text-gray-800 dark:text-white font-semibold hover:text-indigo-500 dark:hover:text-indigo-400">
                    {person.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{role}</p>
            </div>
        </div>
    );
};