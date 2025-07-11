import React from 'react';
import { GameData } from '@/types/game';

interface LevelCompleteScreenProps {
    gameData: GameData;
    onContinue: () => void;
}

export const LevelCompleteScreen: React.FC<LevelCompleteScreenProps> = ({
    gameData,
    onContinue
}) => {
    const { currentLevel, bonk, enemies } = gameData;
    const defeatedEnemy = enemies[currentLevel];
    const nextEnemy = enemies[currentLevel + 1];

    return (
        <div className="h-full relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center max-w-4xl mx-auto px-4 py-8 overflow-y-auto">
                {/* Victory icon */}
                <div className="text-6xl md:text-7xl mb-4 animate-bounce">⚡</div>

                {/* Title */}
                <h2 className="text-4xl md:text-5xl font-bold text-yellow-300 mb-4 drop-shadow-lg">
                    LEVEL {currentLevel + 1} COMPLETE
                </h2>

                {/* Defeated enemy */}
                <div className="mb-6">
                    <p className="text-xl md:text-2xl text-white/90 mb-3">
                        Defeated <span className="font-bold text-red-400">{defeatedEnemy?.name}</span>
                    </p>
                </div>

                {/* Player status */}
                <div className="mb-6 p-4 bg-black/30 rounded-lg">
                    <div className="flex justify-center items-center gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-400">{bonk.currentHp}</div>
                            <div className="text-xs text-white/70">Current HP</div>
                        </div>
                        <div className="text-white text-xl">/</div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-400">{bonk.maxHp}</div>
                            <div className="text-xs text-white/70">Max HP</div>
                        </div>
                    </div>
                    {bonk.currentHp < bonk.maxHp && (
                        <p className="text-yellow-300 text-xs mt-2">
                            HP will carry over to the next level
                        </p>
                    )}
                </div>

                {/* Next opponent */}
                {nextEnemy && (
                    <div className="mb-4">
                        <div className="text-xl font-bold text-orange-400 mb-1">
                            {nextEnemy.name}
                        </div>
                        <div className="text-sm text-white/80">
                            Level {currentLevel + 2}/5
                        </div>
                    </div>
                )}

                {/* Final boss message */}
                {!nextEnemy && (
                    <div className="mb-4">
                        <p className="text-lg text-green-400 mb-2">
                            🎉 You have conquered all opponents! 🎉
                        </p>
                    </div>
                )}

                {/* Progress indicator */}
                <div className="mb-6">
                    <div className="flex justify-center gap-2 mb-2">
                        {enemies.map((_, index) => (
                            <div
                                key={index}
                                className={`w-3 h-3 rounded-full border border-white ${index <= currentLevel
                                    ? 'bg-green-500'
                                    : index === currentLevel + 1
                                        ? 'bg-yellow-500 animate-pulse'
                                        : 'bg-gray-600'
                                    }`}
                            />
                        ))}
                    </div>
                    <div className="text-xs text-white/70">
                        Progress: {currentLevel + 1}/{enemies.length}
                    </div>
                </div>

                {/* Continue button - Make it prominent */}
                <div className="mt-4">
                    <button
                        onClick={onContinue}
                        className="cursor-pointer bg-yellow-400 text-black text-xl md:text-2xl font-bold px-10 py-4 rounded-full hover:bg-yellow-300 hover:scale-105 transform transition-all duration-200 shadow-2xl border-4 border-white animate-pulse"
                    >
                        {nextEnemy ? '⚔️ CONTINUE!' : '🏆 COMPLETE!'}
                    </button>
                </div>
            </div>
        </div>
    );
}; 