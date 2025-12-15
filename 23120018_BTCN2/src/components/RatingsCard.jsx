import { Zap } from 'lucide-react';

export const RatingsCard = ({ ratings }) => {
    const getRatingSource = (key) => {
        switch (key.toLowerCase()) {
            case 'imdb':
            case 'imdbtop250':
            case 'imdp':
                return { name: 'IMDb', color: 'bg-yellow-500', icon: 'I' };
            case 'metacritic':
                return { name: 'Metacritic', color: 'bg-green-500', icon: 'M' };
            case 'rottentomatoes':
                return { name: 'Rotten Tomatoes', color: 'bg-red-600', icon: 'T' };
            case 'themoviedb':
                return { name: 'The Movie Database', color: 'bg-blue-500', icon: 'TMDB' };
            case 'filmaffinity':
                return { name: 'FilmAffinity', color: 'bg-indigo-500', icon: 'FA' };
            default:
                return { name: key, color: 'bg-gray-500', icon: '?' };
        }
    };

    return (
        <div className="ratings-section">
            <h2 className="text-2xl font-bold border-b border-gray-700 pb-2 mb-4 flex items-center">
                <Zap className="h-6 w-6 mr-2 text-yellow-400" /> Đánh giá & Điểm Số
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {Object.entries(ratings).map(([key, value]) => {
                    const source = getRatingSource(key);
                    
                    let displayValue = value;
                    if (key.toLowerCase() === 'metacritic') {
                        displayValue = `${value}/100`; 
                    } else if (key.toLowerCase() === 'rottentomatoes') {
                        displayValue = `${value}%`; 
                    } else {
                        const valueStr = String(value);
                        if (!valueStr.includes('/') && !valueStr.includes('%')) {
                            displayValue = `${value}/10`;
                        }
                    }

                    return (
                        <div 
                            key={key} 
                            className={`p-2 rounded-lg text-center shadow-md border border-gray-700`}
                        >
                            <div className={`text-xl font-extrabold text-gray-800 dark:text-white mb-1`}>
                                {displayValue}
                            </div>
                            <div className="flex items-center justify-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                                <span className={`w-4 h-4 rounded-full ${source.color} mr-1 flex items-center justify-center text-xs text-white`}>
                                    {source.icon.length <= 2 ? source.icon : ''}
                                </span>
                                {source.name}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
