import React from 'react';

interface HealthBarProps {
    name: string;
    currentHp: number;
    maxHp: number;
    side: 'left' | 'right';
    color?: string;
}

export const HealthBar: React.FC<HealthBarProps> = ({
    name,
    currentHp,
    maxHp,
    side,
    color = 'red'
}) => {
    const hpPercentage = (currentHp / maxHp) * 100;

    const getBarColor = () => {
        if (color === 'blue') return 'bg-blue-500';
        if (color === 'green') return 'bg-green-500';
        if (color === 'purple') return 'bg-purple-500';
        return 'bg-red-500'; // default red
    };

    return (
        <div className={`flex flex-col ${side === 'right' ? 'items-end' : 'items-start'} min-w-[200px]`}>
            {/* Character name */}
            <div className="text-white text-lg font-bold mb-2 drop-shadow-lg">
                {name}
            </div>

            {/* HP bar container */}
            <div className="w-full bg-gray-800/70 rounded-full h-6 border-2 border-white/30 overflow-hidden backdrop-blur-sm">
                {/* HP bar fill */}
                <div
                    className={`h-full ${getBarColor()} transition-all duration-500 ease-out relative`}
                    style={{ width: `${hpPercentage}%` }}
                >
                    {/* HP bar shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent" />
                </div>
            </div>

            {/* HP text */}
            <div className="text-white/90 text-sm mt-1 font-semibold drop-shadow">
                {currentHp}/{maxHp} HP
            </div>
        </div>
    );
}; 