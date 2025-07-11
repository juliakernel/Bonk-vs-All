import React from 'react';

interface HeartDisplayProps {
    currentHp: number;
    maxHp: number;
    side: 'left' | 'right';
}

export const HeartDisplay: React.FC<HeartDisplayProps> = ({
    currentHp,
    maxHp,
    side
}) => {
    return (
        <div className={`flex gap-1 justify-center ${side === 'right' ? 'flex-row-reverse' : ''}`}>
            {Array.from({ length: maxHp }).map((_, index) => (
                <div
                    key={index}
                    className="relative group"
                >
                    {/* Heart shape */}
                    <div className={`text-3xl transition-all duration-500 transform ${index < currentHp
                        ? 'text-red-500 drop-shadow-lg scale-110 hover:scale-125'
                        : 'text-gray-700 opacity-30 scale-90'
                        }`}>
                        <svg
                            viewBox="0 0 24 24"
                            className="w-8 h-8 fill-current"
                            style={{ filter: index < currentHp ? 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.6))' : 'none' }}
                        >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    </div>

                    {/* Pulse animation for filled hearts */}
                    {index < currentHp && (
                        <div className="absolute inset-0 text-red-500 animate-ping opacity-20">
                            <svg
                                viewBox="0 0 24 24"
                                className="w-8 h-8 fill-current"
                            >
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                        </div>
                    )}

                    {/* Break effect for damaged hearts */}
                    {index >= currentHp && index < maxHp && (
                        <div className="absolute inset-0 text-gray-600 opacity-40">
                            <svg
                                viewBox="0 0 24 24"
                                className="w-8 h-8 fill-current"
                            >
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                {/* Crack lines */}
                                <path
                                    d="M12 3 L12 21 M8 8 L16 16 M16 8 L8 16"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                    fill="none"
                                />
                            </svg>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}; 