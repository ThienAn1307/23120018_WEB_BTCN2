import { Users } from 'lucide-react';
export const PersonCard = ({ person, role }) => (
    <div className="flex items-center space-x-3 p-3 bg-gray-300 dark:bg-gray-800 rounded-lg mb-2">
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
            <p className="text-gray-800 dark:text-white font-semibold">{person.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{role}</p>
        </div>
    </div>
);