import { useState, useCallback, useEffect, useRef } from 'react';
import { GameData, GameState, ComboState, ENEMIES, Player, Enemy } from '@/types/game';

// Helper functions for randomization
const getRandomClickCount = (): number => {
    // Random between 5-15 clicks
    return Math.floor(Math.random() * 11) + 5;
};

const getRandomHoldDuration = (): { min: number; max: number; target: number } => {
    // Random base duration between 1.5-3.5 seconds
    const baseDuration = Math.floor(Math.random() * 2000) + 1500; // 1500-3500ms
    const tolerance = 100; // ±150ms tolerance (0.3 seconds total window)

    return {
        min: baseDuration - tolerance,
        max: baseDuration + tolerance,
        target: baseDuration
    };
};

const getRandomTimeLimit = (clickCount: number): number => {
    // Time limit based on click count: 200-400ms per click
    const timePerClick = Math.floor(Math.random() * 100) + 150; // 200-400ms per click
    return clickCount * timePerClick;
};

const createInitialBonk = (): Player => ({
    name: 'Bonk',
    maxHp: 5,
    currentHp: 5,
    image: '/imgs/bonk.png'
});

const createInitialGameData = (): GameData => {
    const bonk = createInitialBonk();
    const enemies = ENEMIES.map(enemy => ({ ...enemy, currentHp: enemy.maxHp }));

    // Generate random combo parameters
    const randomClickCount = getRandomClickCount();
    const randomTimeLimit = getRandomTimeLimit(randomClickCount);
    const randomHoldDuration = getRandomHoldDuration();

    return {
        currentLevel: 0,
        bonk,
        enemies,
        currentEnemy: enemies[0],
        gameState: 'menu',
        comboState: 'idle',
        skillClick: {
            requiredClicks: randomClickCount,
            currentClicks: 0,
            timeLimit: randomTimeLimit,
            timeRemaining: randomTimeLimit,
            isActive: false,
            restPeriod: 1000
        },
        holdRelease: {
            targetDuration: randomHoldDuration.target,
            currentDuration: 0,
            minDuration: randomHoldDuration.min,
            maxDuration: randomHoldDuration.max,
            isHolding: false,
            isActive: false
        },
        isPlayerTurn: true,
        // Add game timer
        gameTimer: {
            startTime: null,
            currentTime: 0,
            isRunning: false
        }
    };
};

export const useGameState = () => {
    const [gameData, setGameData] = useState<GameData>(createInitialGameData);
    const skillClickTimerRef = useRef<NodeJS.Timeout | null>(null);
    const holdStartTimeRef = useRef<number | null>(null);
    const restPeriodTimerRef = useRef<NodeJS.Timeout | null>(null);
    const gameTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Start new game
    const startGame = useCallback(() => {
        const newGameData = createInitialGameData();
        const startTime = Date.now();

        setGameData({
            ...newGameData,
            gameState: 'playing',
            gameTimer: {
                startTime: startTime,
                currentTime: 0,
                isRunning: true
            }
        });
    }, []);

    // Reset game
    const resetGame = useCallback(() => {
        setGameData(createInitialGameData());
    }, []);

    // Update game timer
    useEffect(() => {
        if (gameData.gameTimer.isRunning && gameData.gameTimer.startTime) {
            gameTimerRef.current = setInterval(() => {
                setGameData(prev => {
                    if (!prev.gameTimer.isRunning || !prev.gameTimer.startTime) {
                        return prev;
                    }

                    const currentTime = Math.floor((Date.now() - prev.gameTimer.startTime) / 1000);
                    return {
                        ...prev,
                        gameTimer: {
                            ...prev.gameTimer,
                            currentTime
                        }
                    };
                });
            }, 1000); // Update every second
        } else {
            if (gameTimerRef.current) {
                clearInterval(gameTimerRef.current);
                gameTimerRef.current = null;
            }
        }

        return () => {
            if (gameTimerRef.current) {
                clearInterval(gameTimerRef.current);
                gameTimerRef.current = null;
            }
        };
    }, [gameData.gameTimer.isRunning, gameData.gameTimer.startTime]);

    // Start skill click combo
    const startSkillClick = useCallback(() => {
        // Clear any existing timer first
        if (skillClickTimerRef.current) {
            clearInterval(skillClickTimerRef.current);
            skillClickTimerRef.current = null;
        }

        if (restPeriodTimerRef.current) {
            clearTimeout(restPeriodTimerRef.current);
            restPeriodTimerRef.current = null;
        }

        // Generate new random values for this combo
        const randomClickCount = getRandomClickCount();
        const randomTimeLimit = getRandomTimeLimit(randomClickCount);

        setGameData(prev => ({
            ...prev,
            gameState: 'skill-click',
            comboState: 'skill-click',
            skillClick: {
                ...prev.skillClick,
                requiredClicks: randomClickCount,
                currentClicks: 0,
                timeLimit: randomTimeLimit,
                timeRemaining: randomTimeLimit,
                isActive: true
            }
        }));

        // Start countdown timer
        skillClickTimerRef.current = setInterval(() => {
            setGameData(prev => {
                // Don't update if already failed or succeeded
                if (prev.comboState !== 'skill-click') {
                    return prev;
                }

                const newTimeRemaining = prev.skillClick.timeRemaining - 100;

                if (newTimeRemaining <= 0) {
                    // Time's up - check if successful
                    const isSuccess = prev.skillClick.currentClicks === prev.skillClick.requiredClicks;

                    // Clear timer when time is up
                    if (skillClickTimerRef.current) {
                        clearInterval(skillClickTimerRef.current);
                        skillClickTimerRef.current = null;
                    }

                    // Clear rest period timer if exists
                    if (restPeriodTimerRef.current) {
                        clearTimeout(restPeriodTimerRef.current);
                        restPeriodTimerRef.current = null;
                    }

                    return {
                        ...prev,
                        skillClick: { ...prev.skillClick, timeRemaining: 0, isActive: false },
                        comboState: isSuccess ? 'success' : 'failed'
                    };
                }

                return {
                    ...prev,
                    skillClick: { ...prev.skillClick, timeRemaining: newTimeRemaining }
                };
            });
        }, 100);
    }, []);

    // Handle skill click
    const handleSkillClick = useCallback(() => {
        setGameData(prev => {
            if (!prev.skillClick.isActive || prev.comboState !== 'skill-click') {
                return prev;
            }

            const newClicks = prev.skillClick.currentClicks + 1;

            // Check if exceeded required clicks
            if (newClicks > prev.skillClick.requiredClicks) {
                // Clear any existing rest period timer
                if (restPeriodTimerRef.current) {
                    clearTimeout(restPeriodTimerRef.current);
                    restPeriodTimerRef.current = null;
                }

                return {
                    ...prev,
                    skillClick: { ...prev.skillClick, currentClicks: newClicks, isActive: false },
                    comboState: 'failed'
                };
            }

            // Check if reached exact required clicks
            if (newClicks === prev.skillClick.requiredClicks) {
                // Start rest period - player must not click for 1 second
                restPeriodTimerRef.current = setTimeout(() => {
                    setGameData(current => {
                        // Only set success if still in skill-click state and not failed
                        if (current.gameState === 'skill-click' && current.comboState === 'skill-click') {
                            return {
                                ...current,
                                comboState: 'success'
                            };
                        }
                        return current;
                    });
                }, prev.skillClick.restPeriod);

                return {
                    ...prev,
                    skillClick: { ...prev.skillClick, currentClicks: newClicks }
                };
            }

            return {
                ...prev,
                skillClick: { ...prev.skillClick, currentClicks: newClicks }
            };
        });
    }, []);

    // Handle clicking during rest period (should fail)
    const handleRestPeriodViolation = useCallback(() => {
        if (restPeriodTimerRef.current) {
            clearTimeout(restPeriodTimerRef.current);
            restPeriodTimerRef.current = null;
        }

        setGameData(prev => ({
            ...prev,
            skillClick: { ...prev.skillClick, isActive: false },
            comboState: 'failed'
        }));
    }, []);

    // Start hold and release combo
    const startHoldRelease = useCallback(() => {
        // Generate new random values for this combo
        const randomHoldDuration = getRandomHoldDuration();

        setGameData(prev => ({
            ...prev,
            gameState: 'hold-release',
            comboState: 'hold-release',
            holdRelease: {
                ...prev.holdRelease,
                targetDuration: randomHoldDuration.target,
                minDuration: randomHoldDuration.min,
                maxDuration: randomHoldDuration.max,
                currentDuration: 0,
                isHolding: false,
                isActive: true
            }
        }));
    }, []);

    // Handle hold start
    const handleHoldStart = useCallback(() => {
        holdStartTimeRef.current = Date.now();
        setGameData(prev => ({
            ...prev,
            holdRelease: { ...prev.holdRelease, isHolding: true }
        }));
    }, []);

    // Handle hold end
    const handleHoldEnd = useCallback(() => {
        if (!holdStartTimeRef.current) return;

        const duration = Date.now() - holdStartTimeRef.current;
        holdStartTimeRef.current = null;

        setGameData(prev => {
            const isSuccess = duration >= prev.holdRelease.minDuration && duration <= prev.holdRelease.maxDuration;

            return {
                ...prev,
                holdRelease: {
                    ...prev.holdRelease,
                    currentDuration: duration,
                    isHolding: false,
                    isActive: false
                },
                comboState: isSuccess ? 'success' : 'failed'
            };
        });
    }, []);

    // Apply combo result
    const applyComboResult = useCallback(() => {
        setGameData(prev => {
            if (prev.comboState === 'success') {
                // Bonk's attack succeeded
                if (prev.gameState === 'skill-click') {
                    // First combo succeeded, start hold-release
                    return prev; // Will be handled by useEffect
                } else if (prev.gameState === 'hold-release') {
                    // Full combo succeeded, damage enemy by 1 HP
                    const newEnemyHp = Math.max(0, prev.currentEnemy.currentHp - 1);
                    const updatedEnemies = prev.enemies.map(enemy =>
                        enemy.name === prev.currentEnemy.name
                            ? { ...enemy, currentHp: newEnemyHp }
                            : enemy
                    );

                    return {
                        ...prev,
                        enemies: updatedEnemies,
                        currentEnemy: { ...prev.currentEnemy, currentHp: newEnemyHp },
                        gameState: 'playing',
                        comboState: 'idle'
                    };
                }
            } else if (prev.comboState === 'failed') {
                // Bonk failed, take damage
                const newBonkHp = Math.max(0, prev.bonk.currentHp - 1);

                return {
                    ...prev,
                    bonk: { ...prev.bonk, currentHp: newBonkHp },
                    gameState: 'playing',
                    comboState: 'idle'
                };
            }

            return prev;
        });
    }, []);

    // Check win/lose conditions
    const checkGameEnd = useCallback(() => {
        setGameData(prev => {
            // Check if Bonk died
            if (prev.bonk.currentHp <= 0) {
                return { ...prev, gameState: 'transition-lose' };
            }

            // Check if current enemy died
            if (prev.currentEnemy.currentHp <= 0) {
                // Check if all enemies defeated
                if (prev.currentLevel + 1 >= prev.enemies.length) {
                    return { ...prev, gameState: 'transition-win' };
                }

                // Show level complete screen, don't auto-advance
                return {
                    ...prev,
                    gameState: 'level-complete'
                };
            }

            return prev;
        });
    }, []);

    // Continue to next level
    const continueToNextLevel = useCallback(() => {
        setGameData(prev => {
            const nextLevel = prev.currentLevel + 1;

            // Make sure we don't go beyond available enemies
            if (nextLevel >= prev.enemies.length) {
                return { ...prev, gameState: 'win' };
            }

            // Move to next enemy
            const nextEnemy = prev.enemies[nextLevel];
            return {
                ...prev,
                currentLevel: nextLevel,
                currentEnemy: nextEnemy,
                gameState: 'playing'
            };
        });
    }, []);

    // Cleanup timers
    useEffect(() => {
        return () => {
            if (skillClickTimerRef.current) {
                clearInterval(skillClickTimerRef.current);
            }
            if (restPeriodTimerRef.current) {
                clearTimeout(restPeriodTimerRef.current);
            }
        };
    }, []);

    // Auto-start hold-release after successful skill-click
    useEffect(() => {
        if (gameData.comboState === 'success' && gameData.gameState === 'skill-click') {
            const timer = setTimeout(() => {
                startHoldRelease();
            }, 500); // Reduced delay to 0.5 seconds

            return () => clearTimeout(timer);
        }
    }, [gameData.comboState, gameData.gameState, startHoldRelease]);

    // Auto-apply combo results for skill-click failures and hold-release results
    useEffect(() => {
        if (gameData.comboState === 'failed' && gameData.gameState === 'skill-click') {
            // Close dialog immediately but wait for background transition
            const timer = setTimeout(() => {
                applyComboResult();
            }, 800); // Wait for background transition to be visible

            return () => clearTimeout(timer);
        }
    }, [gameData.comboState, gameData.gameState, applyComboResult]);

    useEffect(() => {
        if ((gameData.comboState === 'success' || gameData.comboState === 'failed') &&
            gameData.gameState === 'hold-release') {
            // Close dialog immediately but wait for background transition
            const timer = setTimeout(() => {
                applyComboResult();
            }, 800); // Wait for background transition to be visible

            return () => clearTimeout(timer);
        }
    }, [gameData.comboState, gameData.gameState, applyComboResult]);

    // Auto-check game end
    useEffect(() => {
        if (gameData.gameState === 'playing') {
            checkGameEnd();
        }
    }, [gameData.bonk.currentHp, gameData.currentEnemy.currentHp, checkGameEnd]);

    // Handle transition delays for win/lose states
    useEffect(() => {
        if (gameData.gameState === 'transition-win') {
            // Stop timer when transitioning to win
            setGameData(prev => ({
                ...prev,
                gameTimer: {
                    ...prev.gameTimer,
                    isRunning: false
                }
            }));

            const timer = setTimeout(() => {
                setGameData(prev => ({ ...prev, gameState: 'win' }));
            }, 2000); // 2 second delay to show background transition

            return () => clearTimeout(timer);
        }
    }, [gameData.gameState]);

    useEffect(() => {
        if (gameData.gameState === 'transition-lose') {
            // Stop timer when losing
            setGameData(prev => ({
                ...prev,
                gameTimer: {
                    ...prev.gameTimer,
                    isRunning: false
                }
            }));

            const timer = setTimeout(() => {
                setGameData(prev => ({ ...prev, gameState: 'lose' }));
            }, 2000); // 2 second delay to show background transition

            return () => clearTimeout(timer);
        }
    }, [gameData.gameState]);

    // Clear skill click timer when combo ends or state changes
    useEffect(() => {
        if (gameData.gameState !== 'skill-click') {
            if (skillClickTimerRef.current) {
                clearInterval(skillClickTimerRef.current);
                skillClickTimerRef.current = null;
            }
            if (restPeriodTimerRef.current) {
                clearTimeout(restPeriodTimerRef.current);
                restPeriodTimerRef.current = null;
            }
        }
    }, [gameData.gameState, gameData.comboState]);

    return {
        gameData,
        startGame,
        resetGame,
        startSkillClick,
        handleSkillClick,
        handleRestPeriodViolation,
        handleHoldStart,
        handleHoldEnd,
        continueToNextLevel
    };
}; 