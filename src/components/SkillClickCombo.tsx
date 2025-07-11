import React from 'react';
import { GameData } from '@/types/game';

interface SkillClickComboProps {
    gameData: GameData;
    onSkillClick: () => void;
    onRestPeriodViolation: () => void;
}

export const SkillClickCombo: React.FC<SkillClickComboProps> = ({
    gameData,
    onSkillClick,
    onRestPeriodViolation
}) => {
    const { skillClick, comboState } = gameData;
    const timePercentage = (skillClick.timeRemaining / skillClick.timeLimit) * 100;
    const isInRestPeriod = skillClick.currentClicks >= skillClick.requiredClicks && comboState === 'skill-click';

    const handleClick = () => {
        if (!skillClick.isActive) return;

        if (isInRestPeriod) {
            onRestPeriodViolation();
        } else {
            onSkillClick();
        }
    };

    return (
        <div
            className="p-8 text-center cursor-pointer"
            onClick={handleClick}
        >
            {/* Main content */}
            <div className="relative z-10">
                {/* Title */}
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 drop-shadow-lg">
                    SKILL CLICK
                </h2>

                {/* Instructions */}
                <div className="text-xl md:text-2xl text-white/90 mb-8">
                    {isInRestPeriod ? (
                        <div className="text-yellow-300 animate-pulse">
                            WAIT 1 SECOND - DON'T CLICK!
                        </div>
                    ) : (
                        <div>
                            Click {skillClick.requiredClicks} times in {skillClick.timeLimit / 1000} seconds!
                        </div>
                    )}
                </div>

                {/* Click counter */}
                <div className="mb-8">
                    <div className="text-6xl md:text-8xl font-bold text-white drop-shadow-lg mb-4">
                        {skillClick.currentClicks}/{skillClick.requiredClicks}
                    </div>

                    {/* Click indicator */}
                    <div className="flex justify-center gap-2">
                        {Array.from({ length: skillClick.requiredClicks }).map((_, index) => (
                            <div
                                key={index}
                                className={`w-4 h-4 rounded-full border-2 border-white transition-all duration-200 ${index < skillClick.currentClicks
                                    ? 'bg-green-500 scale-110'
                                    : 'bg-transparent'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Time progress bar */}
                <div className="w-full max-w-md mx-auto mb-8">
                    <div className="text-white text-lg mb-2">
                        Time: {(skillClick.timeRemaining / 1000).toFixed(1)}s
                    </div>
                    <div className="w-full h-6 bg-gray-800 rounded-full border-2 border-white overflow-hidden">
                        <div
                            className={`h-full transition-all duration-100 ease-linear rounded-full ${timePercentage > 50 ? 'bg-green-500' :
                                timePercentage > 25 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                            style={{ width: `${timePercentage}%` }}
                        />
                    </div>
                </div>

                {/* Click button for touch devices */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleClick();
                    }}
                    disabled={!skillClick.isActive}
                    className={`cursor-pointer group relative text-2xl md:text-3xl font-bold px-12 py-6 rounded-full transition-all duration-200 shadow-lg overflow-hidden ${isInRestPeriod
                        ? 'cursor-not-allowed'
                        : 'hover:scale-105 active:scale-95'
                        }`}
                >
                    {/* Button background */}
                    <div className={`absolute inset-0 rounded-full transition-all duration-300 ${isInRestPeriod
                        ? 'bg-gradient-to-r from-red-500 to-red-600'
                        : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 group-hover:from-blue-400 group-hover:via-purple-400 group-hover:to-pink-400'
                        }`} />

                    {/* Button border */}
                    <div className="absolute inset-0 rounded-full border-2 border-white/30" />

                    {/* Button shine */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent rounded-full" />

                    {/* Button text */}
                    <span className="relative z-10 text-white">
                        {isInRestPeriod ? 'DON\'T CLICK!' : 'CLICK NOW!'}
                    </span>
                </button>

                {/* Key instruction */}
                <div className="mt-6 text-white/70 text-lg">
                    Or press SPACE key
                </div>

                {/* Status message */}
                {comboState === 'success' && (
                    <div className="mt-8 text-3xl font-bold text-green-400 animate-bounce">
                        SUCCESS!
                    </div>
                )}

                {comboState === 'failed' && (
                    <div className="mt-8 text-3xl font-bold text-red-400 animate-bounce">
                        FAILED!
                    </div>
                )}
            </div>
        </div>
    );
}; 