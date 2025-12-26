import React from 'react';

const PasswordStrength = ({ password }) => {
    const getStrength = (pwd) => {
        if (!pwd) return 0;
        
        let strength = 0;
        if (pwd.length >= 8) strength++;
        if (pwd.length >= 12) strength++;
        if (/[a-z]/.test(pwd)) strength++;
        if (/[A-Z]/.test(pwd)) strength++;
        if (/[0-9]/.test(pwd)) strength++;
        if (/[^a-zA-Z0-9]/.test(pwd)) strength++;
        
        return Math.min(strength, 4);
    };

    const strength = getStrength(password);
    const strengthLabels = ['Rất yếu', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'];
    const strengthColors = [
        'bg-red-500',
        'bg-orange-500',
        'bg-yellow-500',
        'bg-blue-500',
        'bg-green-500'
    ];

    if (!password) return null;

    return (
        <div className="mt-2 space-y-2">
            <div className="flex gap-1">
                {[0, 1, 2, 3].map((index) => (
                    <div
                        key={index}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            index < strength
                                ? `${strengthColors[strength - 1]} shadow-lg`
                                : 'bg-gray-700'
                        }`}
                    />
                ))}
            </div>
            <p className={`text-xs font-medium ${
                strength <= 1 ? 'text-red-400' :
                strength === 2 ? 'text-yellow-400' :
                strength === 3 ? 'text-blue-400' :
                'text-green-400'
            }`}>
                Độ mạnh: {strengthLabels[strength]}
            </p>
        </div>
    );
};

export default PasswordStrength;

