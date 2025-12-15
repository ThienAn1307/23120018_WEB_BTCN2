export const ProfileItem = ({ Icon, label, value, name, color, isEditable, onChange, inputType = 'text', displayValue }) => (
    <div className="flex flex-col space-y-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div>
            <Icon className={`h-6 w-6 flex-shrink-0 ${color}`} />
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        </div>
        {isEditable ? (
            <input
                type={inputType}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full text-base font-semibold text-gray-800 dark:text-white bg-transparent border-b border-indigo-300 dark:border-indigo-600 focus:outline-none focus:border-indigo-500 p-1"
                required={inputType !== 'date' ? false : true}
            />
        ) : (
            <p className="text-base font-semibold text-gray-800 dark:text-white break-words p-1">
                {inputType === 'date' ? displayValue : value}
            </p>
        )}
    </div>
);