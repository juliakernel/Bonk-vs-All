import React, { useEffect, useState, useRef } from 'react';
import { GameData } from '@/types/game';

interface HoldReleaseComboProps {
    gameData: GameData;
    onHoldStart: () => void;
    onHoldEnd: () => void;
}

export const HoldReleaseCombo: React.FC<HoldReleaseComboProps> = ({
    gameData,
    onHoldStart,
    onHoldEnd
}) => {
    const { holdRelease, comboState, currentLevel } = gameData;
    const targetRangeStart = (holdRelease.minDuration / holdRelease.maxDuration) * 100;
    const targetRangeEnd = 100;
    const currentProgress = holdRelease.isHolding
        ? Math.min(100, (Date.now() - (Date.now() - holdRelease.currentDuration)) / holdRelease.maxDuration * 100)
        : (holdRelease.currentDuration / holdRelease.maxDuration) * 100;

    // Show timer display for first 2 rounds (level 0 and 1)
    const showTimerDisplay = currentLevel <= 1;

    // Real-time timer for display - use a ref to track start time consistently
    const [realtimeHoldDuration, setRealtimeHoldDuration] = useState(0);
    const holdStartTimeRef = useRef<number | null>(null);

    // Update real-time timer
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (holdRelease.isHolding) {
            // Ensure we have a start time
            if (!holdStartTimeRef.current) {
                holdStartTimeRef.current = Date.now();
            }

            interval = setInterval(() => {
                if (holdStartTimeRef.current) {
                    const currentTime = Date.now();
                    const duration = currentTime - holdStartTimeRef.current;
                    setRealtimeHoldDuration(duration);
                }
            }, 50); // Update every 50ms for better performance
        } else {
            // When not holding, show the final duration from game state
            setRealtimeHoldDuration(holdRelease.currentDuration);
            holdStartTimeRef.current = null;
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [holdRelease.isHolding, holdRelease.currentDuration]);

    // Reset timer when hold starts - simplified
    useEffect(() => {
        if (holdRelease.isHolding) {
            if (!holdStartTimeRef.current) {
                holdStartTimeRef.current = Date.now();
                setRealtimeHoldDuration(0);
            }
        } else {
            holdStartTimeRef.current = null;
            setRealtimeHoldDuration(holdRelease.currentDuration);
        }
    }, [holdRelease.isHolding, holdRelease.currentDuration]);

    // Global mouse/touch event listeners to handle release outside button
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            if (holdRelease.isActive && holdRelease.isHolding) {
                onHoldEnd();
            }
        };

        const handleGlobalTouchEnd = () => {
            if (holdRelease.isActive && holdRelease.isHolding) {
                onHoldEnd();
            }
        };

        if (holdRelease.isHolding) {
            document.addEventListener('mouseup', handleGlobalMouseUp);
            document.addEventListener('touchend', handleGlobalTouchEnd);
            document.addEventListener('touchcancel', handleGlobalTouchEnd);
        }

        return () => {
            document.removeEventListener('mouseup', handleGlobalMouseUp);
            document.removeEventListener('touchend', handleGlobalTouchEnd);
            document.removeEventListener('touchcancel', handleGlobalTouchEnd);
        };
    }, [holdRelease.isHolding, holdRelease.isActive, onHoldEnd]);

    const handleMouseDown = () => {
        if (holdRelease.isActive && !holdRelease.isHolding) {
            onHoldStart();
        }
    };

    const handleMouseUp = () => {
        // This will be handled by global event listener
        // Keep this for consistency but the global listener will handle the actual logic
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        e.preventDefault();
        handleMouseDown();
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        e.preventDefault();
        // This will be handled by global event listener
    };

    return (
        <div className="p-8 text-center">
            {/* Main content */}
            <div className="relative z-10 max-w-lg mx-auto">
                {/* Title */}
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 drop-shadow-lg">
                    HOLD & RELEASE
                </h2>

                {/* Instructions */}
                <div className="text-xl md:text-2xl text-white/90 mb-8">
                    {holdRelease.isHolding ? (
                        <div className="text-yellow-300 animate-pulse">
                            Hold for {holdRelease.minDuration / 1000}s - {holdRelease.maxDuration / 1000}s!
                        </div>
                    ) : (
                        <div>
                            Press and hold for {holdRelease.minDuration / 1000}s to {holdRelease.maxDuration / 1000}s!
                        </div>
                    )}
                </div>

                {/* Hold progress circle */}
                <div className="relative w-64 h-64 mx-auto mb-8">
                    {/* Background circle */}
                    <div className="absolute inset-0 rounded-full border-8 border-gray-400/30"></div>

                    {/* Target range indicator */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle
                            cx="50%"
                            cy="50%"
                            r="112"
                            fill="none"
                            stroke="rgba(34, 197, 94, 0.5)"
                            strokeWidth="16"
                            strokeDasharray={`${(targetRangeEnd - targetRangeStart) * 7.04} 704`}
                            strokeDashoffset={`${-targetRangeStart * 7.04}`}
                            className="drop-shadow-lg"
                        />
                    </svg>

                    {/* Progress circle */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle
                            cx="50%"
                            cy="50%"
                            r="112"
                            fill="none"
                            stroke={holdRelease.isHolding ? "#fbbf24" : "#3b82f6"}
                            strokeWidth="8"
                            strokeDasharray="704"
                            strokeDashoffset={704 - (holdRelease.isHolding ? Math.min(100, (realtimeHoldDuration / holdRelease.maxDuration) * 100) * 7.04 : currentProgress * 7.04)}
                            className="transition-all duration-100 drop-shadow-lg"
                            style={{
                                filter: holdRelease.isHolding ? 'drop-shadow(0 0 10px #fbbf24)' : undefined
                            }}
                        />
                    </svg>

                    {/* Center content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                            {holdRelease.isHolding ? 'HOLD!' : 'PRESS'}
                        </div>
                        <div className="text-lg text-white/80">
                            {holdRelease.isHolding
                                ? `${(realtimeHoldDuration / 1000).toFixed(1)}s`
                                : holdRelease.currentDuration > 0
                                    ? `${(holdRelease.currentDuration / 1000).toFixed(1)}s`
                                    : 'Ready'
                            }
                        </div>
                        {/* Debug info */}
                        <div className="text-xs text-white/50 mt-1">
                            RT: {realtimeHoldDuration}ms | State: {holdRelease.isHolding ? 'HOLDING' : 'NOT_HOLDING'}
                        </div>
                    </div>
                </div>

                {/* Hold button */}
                <button
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    disabled={!holdRelease.isActive}
                    className={`cursor-pointer group relative text-2xl md:text-3xl font-bold px-16 py-8 rounded-full transition-all duration-200 shadow-lg select-none overflow-hidden ${holdRelease.isHolding
                        ? 'scale-110'
                        : 'hover:scale-105 active:scale-95'
                        }`}
                >
                    {/* Button background */}
                    <div className={`absolute inset-0 rounded-full transition-all duration-300 ${holdRelease.isHolding
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-yellow-500/50'
                        : 'bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 group-hover:from-green-400 group-hover:via-teal-400 group-hover:to-blue-400'
                        }`} />

                    {/* Button border */}
                    <div className="absolute inset-0 rounded-full border-2 border-white/30" />

                    {/* Button shine */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent rounded-full ${holdRelease.isHolding ? 'animate-pulse' : ''
                        }`} />

                    {/* Button text */}
                    <span className={`relative z-10 ${holdRelease.isHolding ? 'text-black' : 'text-white'}`}>
                        {holdRelease.isHolding ? 'HOLDING...' : 'PRESS & HOLD'}
                    </span>
                </button>

                {/* Key instruction */}
                <div className="mt-6 text-white/70 text-lg">
                    Or press and hold SPACE key
                </div>

                {/* Target zone indicator */}
                <div className="mt-8 text-center">
                    <div className="text-sm text-white/60 mb-2">Target Zone:</div>
                    <div className="flex justify-center items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <span className="text-white text-sm">
                            {holdRelease.minDuration / 1000}s - {holdRelease.maxDuration / 1000}s
                        </span>
                    </div>
                </div>

                {/* Status message */}
                {comboState === 'success' && (
                    <div className="mt-8 text-3xl font-bold text-green-400 animate-bounce">
                        COMBO COMPLETE!
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