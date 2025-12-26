import React from 'react';
import { FaCrown, FaMedal, FaTrophy, FaGem } from 'react-icons/fa';

const RankBadge = ({ rank, size = 'md', showName = true }) => {
    // Rank configuration
    const rankConfig = {
        Bronze: {
            color: 'from-orange-700 to-orange-500',
            icon: <FaMedal />,
            shadow: 'shadow-orange-500/50',
            border: 'border-orange-400'
        },
        Silver: {
            color: 'from-slate-400 to-slate-200',
            icon: <FaMedal />,
            shadow: 'shadow-slate-400/50',
            border: 'border-slate-300'
        },
        Gold: {
            color: 'from-yellow-600 to-yellow-300',
            icon: <FaCrown />,
            shadow: 'shadow-yellow-500/50',
            border: 'border-yellow-200'
        },
        Diamond: {
            color: 'from-cyan-600 to-cyan-300',
            icon: <FaGem />,
            shadow: 'shadow-cyan-500/50',
            border: 'border-cyan-200'
        }
    };

    const config = rankConfig[rank?.name] || rankConfig['Bronze'];

    // Size classes
    const sizeClasses = {
        sm: 'w-6 h-6 text-xs',
        md: 'w-10 h-10 text-lg',
        lg: 'w-16 h-16 text-2xl',
        xl: 'w-24 h-24 text-4xl'
    };

    return (
        <div className={`flex flex-col items-center gap-2 ${showName ? '' : 'justify-center'}`}>
            <div className={`
                relative flex items-center justify-center rounded-full 
                bg-gradient-to-br ${config.color} 
                ${sizeClasses[size]} 
                shadow-lg ${config.shadow}
                border-2 ${config.border}
                animate-float
            `}>
                <div className="text-white drop-shadow-md">
                    {config.icon}
                </div>

                {/* Shine effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-50"></div>
            </div>

            {showName && (
                <span className={`font-bold bg-clip-text text-transparent bg-gradient-to-r ${config.color} uppercase tracking-wider ${size === 'xl' ? 'text-xl' : 'text-sm'}`}>
                    {rank?.name || 'Bronze'}
                </span>
            )}
        </div>
    );
};

export default RankBadge;
