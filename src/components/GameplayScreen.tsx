import React from 'react';
import { GameData } from '@/types/game';
import { HeartDisplay } from './HeartDisplay';
import { HealthBar } from './HealthBar';

interface GameplayScreenProps {
    gameData: GameData;
    onStartAttack: () => void;
}

export const GameplayScreen: React.FC<GameplayScreenProps> = ({
    gameData,
    onStartAttack
}) => {
    const { bonk, currentEnemy, currentLevel, gameState, comboState } = gameData;

    // Determine which background image to show based on game state
    const getBackgroundImage = () => {
        // If in transition states, show appropriate image
        if (gameState === 'transition-lose') {
            return currentEnemy.attackImage || currentEnemy.background;
        }
        if (gameState === 'transition-win') {
            return currentEnemy.defendImage || currentEnemy.background;
        }

        // During combo states, show dynamic backgrounds
        if (comboState === 'failed') {
            // Bonk failed either part, enemy is attacking
            return currentEnemy.attackImage || currentEnemy.background;
        }
        if (comboState === 'success' && gameState === 'hold-release') {
            // Full combo completed (both parts successful), enemy is defending
            return currentEnemy.defendImage || currentEnemy.background;
        }

        // Default background (including skill-click success, which doesn't show defend yet)
        return currentEnemy.background;
    };

    return (
        <div className="h-full relative flex flex-col">
            {/* Background image with overlay */}
            {getBackgroundImage() && (
                <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
                    style={{ backgroundImage: `url(${getBackgroundImage()})` }}
                />
            )}
            <div className="absolute inset-0 bg-black/10" />

            {/* Game UI */}
            <div className="relative z-10 h-full flex flex-col">
                {/* Top Health Bars */}
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        {/* Bonk Health Bar */}
                        <HealthBar
                            name="BONK"
                            currentHp={bonk.currentHp}
                            maxHp={bonk.maxHp}
                            side="left"
                            color="blue"
                        />

                        {/* Level indicator */}
                        <div className="relative">
                            <div className="bg-gradient-to-r from-white/25 to-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-xl">
                                <div className="text-white text-xl font-bold">ROUND {currentLevel + 1}/5</div>
                                <div className="text-white/80 text-sm">{currentEnemy.name}</div>
                            </div>
                        </div>

                        {/* Enemy Health Bar */}
                        <HealthBar
                            name={currentEnemy.name}
                            currentHp={currentEnemy.currentHp}
                            maxHp={currentEnemy.maxHp}
                            side="right"
                            color="red"
                        />
                    </div>
                </div>

                {/* Battle arena */}
                <div className="flex-1 flex items-center justify-center px-8">
                    <div className="w-full max-w-6xl h-full grid grid-cols-1 items-center gap-8">
                        {/* VS indicator and attack button */}
                        <div className="text-center">
                            <div className="text-white text-5xl md:text-7xl font-bold mb-6 animate-pulse drop-shadow-lg">
                                VS
                            </div>

                            {/* Attack button */}
                            <button
                                onClick={onStartAttack}
                                className="cursor-pointer group relative px-8 py-4 text-xl md:text-2xl font-bold text-white rounded-xl overflow-hidden transition-all duration-300 hover:scale-105"
                            >
                                {/* Button background */}
                                <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-red-600 rounded-xl transition-all duration-300 group-hover:from-red-400 group-hover:via-orange-400 group-hover:to-red-500" />

                                {/* Button border */}
                                <div className="absolute inset-0 rounded-xl border-2 border-white/30" />

                                {/* Button shine */}
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent rounded-xl" />

                                {/* Button text */}
                                <span className="relative z-10">⚔️ ATTACK!</span>
                            </button>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
}; 