import React from 'react';

interface GameDialogProps {
    title: string;
    message: string;
    onAction: () => void;
    actionText: string;
}

export const GameDialog: React.FC<GameDialogProps> = ({
    title,
    message,
    onAction,
    actionText
}) => {
    const isWin = title.includes('VICTORY');

    return (
        <div className="p-8 text-center">
            {/* Dialog content */}
            <div className="relative z-10 max-w-2xl mx-auto">
                {/* Image instead of icon */}
                <div className="mb-8">
                    <div className="w-48 h-48 md:w-64 md:h-64 mx-auto rounded-2xl overflow-hidden shadow-2xl animate-bounce">
                        <img
                            src={isWin ? '/imgs/victory-bg.png' : '/imgs/defeat-bg.png'}
                            alt={isWin ? 'Victory' : 'Defeat'}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Title */}
                <h1 className={`text-6xl md:text-8xl font-bold mb-6 drop-shadow-lg ${isWin ? 'text-yellow-300' : 'text-white'
                    }`}>
                    {title}
                </h1>

                {/* Message */}
                <p className="text-2xl md:text-3xl text-white/90 mb-12 drop-shadow-lg">
                    {message}
                </p>

                {/* Action button */}
                <button
                    onClick={onAction}
                    className="cursor-pointer group relative text-2xl md:text-3xl font-bold px-12 py-6 rounded-full transition-all duration-200 shadow-2xl hover:scale-105 active:scale-95 overflow-hidden"
                >
                    {/* Button background */}
                    <div className={`absolute inset-0 rounded-full transition-all duration-300 ${isWin
                        ? 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 group-hover:from-green-400 group-hover:via-emerald-400 group-hover:to-teal-400'
                        : 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 group-hover:from-red-400 group-hover:via-orange-400 group-hover:to-yellow-400'
                        }`} />

                    {/* Button border */}
                    <div className="absolute inset-0 rounded-full border-2 border-white/30" />

                    {/* Button shine */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent rounded-full" />

                    {/* Button text */}
                    <span className="relative z-10 text-white">
                        {isWin ? '🎉 ' : ''}{actionText}
                    </span>
                </button>

                {/* Decorative elements for win */}
                {isWin && (
                    <div className="mt-8 flex justify-center gap-4 text-4xl animate-bounce">
                        <span className="animate-bounce delay-100">🎉</span>
                        <span className="animate-bounce delay-200">🎊</span>
                        <span className="animate-bounce delay-300">✨</span>
                        <span className="animate-bounce delay-400">🎈</span>
                        <span className="animate-bounce delay-500">🌟</span>
                    </div>
                )}
            </div>
        </div>
    );
}; 