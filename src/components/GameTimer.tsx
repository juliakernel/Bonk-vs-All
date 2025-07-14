import React from 'react';
import { formatTime } from '@/lib/supabase';
import { GameTimer as GameTimerType } from '@/types/game';

interface GameTimerProps {
    gameTimer: GameTimerType;
    className?: string;
}

export const GameTimer: React.FC<GameTimerProps> = ({ gameTimer, className = '' }) => {
    if (!gameTimer.isRunning && gameTimer.currentTime === 0) {
        return null;
    }

    return (
        <div className={`${className}`}>
            <div className="bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                <div className="flex items-center gap-2">
                    <div className="text-white/70 text-sm">⏱️ Time:</div>
                    <div className="text-white font-mono text-lg font-bold">
                        {formatTime(gameTimer.currentTime)}
                    </div>
                    {gameTimer.isRunning && (
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    )}
                </div>
            </div>
        </div>
    );
}; 