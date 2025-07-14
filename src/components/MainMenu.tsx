import React, { useState } from 'react';
import { Leaderboard } from './Leaderboard';

interface MainMenuProps {
    onStartGame: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStartGame }) => {
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    if (showLeaderboard) {
        return (
            <div className="h-full flex flex-col">
                {/* Back button */}
                <div className="p-6">
                    <button
                        onClick={() => setShowLeaderboard(false)}
                        className="cursor-pointer flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                    >
                        ← Back to Menu
                    </button>
                </div>

                {/* Leaderboard */}
                <div className="flex-1 px-6 pb-6 overflow-auto">
                    <Leaderboard />
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col items-center justify-center relative">
            {/* Main content card */}
            <div className="relative max-w-4xl mx-auto p-8">
                {/* Glassmorphism container */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-black/25">
                    {/* Content */}
                    <div className="relative z-10 p-12 text-center">
                        {/* Game title */}
                        <div className="mb-8">
                            <h1 className="text-7xl md:text-9xl font-bold bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent mb-4 drop-shadow-lg">
                                BONK'S
                            </h1>
                            <h2 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent mb-8 drop-shadow-lg">
                                CHALLENGE
                            </h2>

                            {/* Subtitle */}
                            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
                                Battle 5 powerful opponents with rhythmic attack combos!
                            </p>
                        </div>

                        {/* Enemy list */}
                        <div className="mb-8">
                            <h3 className="text-lg text-white/80 mb-4">Your Opponents:</h3>
                            <div className="flex flex-wrap justify-center gap-3">
                                {['Jup Studio', 'LaunchLab', 'Moonshot', 'Believe', 'Pumpfun'].map((enemy, index) => (
                                    <div key={enemy} className="relative">
                                        <div className="px-4 py-2 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/90 font-medium">
                                            {index + 1}. {enemy}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="mb-8 flex flex-col gap-4">
                            <button
                                onClick={onStartGame}
                                className="cursor-pointer group relative px-12 py-4 text-2xl md:text-3xl font-bold text-white rounded-full overflow-hidden transition-all duration-300 hover:scale-105"
                            >
                                {/* Button background */}
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full transition-all duration-300 group-hover:from-orange-400 group-hover:via-red-400 group-hover:to-pink-400" />

                                {/* Button border */}
                                <div className="absolute inset-0 rounded-full border-2 border-white/30" />

                                {/* Button shine */}
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent rounded-full" />

                                {/* Button text */}
                                <span className="relative z-10">🎮 START GAME</span>
                            </button>

                            {/* Leaderboard button */}
                            <button
                                onClick={() => setShowLeaderboard(true)}
                                className="cursor-pointer group relative px-8 py-3 text-lg md:text-xl font-bold text-white rounded-full overflow-hidden transition-all duration-300 hover:scale-105"
                            >
                                {/* Button background */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full transition-all duration-300 group-hover:from-blue-400 group-hover:via-purple-400 group-hover:to-indigo-400" />

                                {/* Button border */}
                                <div className="absolute inset-0 rounded-full border-2 border-white/30" />

                                {/* Button shine */}
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent rounded-full" />

                                {/* Button text */}
                                <span className="relative z-10">🏆 LEADERBOARD</span>
                            </button>
                        </div>

                        {/* Instructions */}
                        <div className="text-white/70">
                            <p className="text-sm md:text-base">
                                Use <kbd className="px-2 py-1 bg-white/20 rounded border border-white/30 text-xs">SPACE</kbd> key or mouse click to perform attack combos
                            </p>
                        </div>
                    </div>

                    {/* Glass shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />

                    {/* Animated background elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-yellow-400/20 to-transparent rounded-full blur-3xl animate-pulse" />
                        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-red-400/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
                    </div>
                </div>
            </div>
        </div>
    );
}; 