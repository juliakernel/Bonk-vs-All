'use client';

import React, { useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useAudio } from '@/hooks/useAudio';
import { GlassDialog } from './GlassDialog';
import { MainMenu } from './MainMenu';
import { GameplayScreen } from './GameplayScreen';
import { SkillClickCombo } from './SkillClickCombo';
import { HoldReleaseCombo } from './HoldReleaseCombo';
import { GameDialog } from './GameDialog';
import { LevelCompleteScreen } from './LevelCompleteScreen';

export const GameScreen: React.FC = () => {
    const {
        gameData,
        startGame,
        resetGame,
        startSkillClick,
        handleSkillClick,
        handleRestPeriodViolation,
        handleHoldStart,
        handleHoldEnd,
        continueToNextLevel
    } = useGameState();

    const { initializeAudio, playSound, playBgMusic, stopBgMusic } = useAudio();

    // Initialize audio when component mounts
    useEffect(() => {
        initializeAudio();
    }, [initializeAudio]);

    // Handle game state changes for audio
    useEffect(() => {
        switch (gameData.gameState) {
            case 'menu':
                stopBgMusic();
                break;
            case 'playing':
                playBgMusic();
                break;
            case 'transition-win':
                stopBgMusic();
                break;
            case 'transition-lose':
                stopBgMusic();
                break;
            case 'win':
                playSound('victory');
                break;
            case 'lose':
                playSound('defeat');
                break;
        }
    }, [gameData.gameState, playSound, playBgMusic, stopBgMusic]);

    // Handle combo state changes for audio
    useEffect(() => {
        switch (gameData.comboState) {
            case 'success':
                // Only play success sound for skill-click success (not full combo)
                if (gameData.gameState === 'skill-click') {
                    playSound('success');
                }
                break;
            case 'failed':
                playSound('fail');
                break;
        }
    }, [gameData.comboState, gameData.gameState, playSound]);



    // Track hold-release completion for damage sound
    useEffect(() => {
        if (gameData.comboState === 'success' && gameData.gameState === 'hold-release') {
            // Full combo completed successfully - play damage sound after delay
            const timer = setTimeout(() => {
                playSound('damage');
            }, 400); // Play during background transition

            return () => clearTimeout(timer);
        }
    }, [gameData.comboState, gameData.gameState, playSound]);

    // Track combo failures for defeat sound
    useEffect(() => {
        if (gameData.comboState === 'failed') {
            // Combo failed - play defeat sound after delay
            const timer = setTimeout(() => {
                playSound('defeat');
            }, 400); // Play during background transition

            return () => clearTimeout(timer);
        }
    }, [gameData.comboState, playSound]);

    // Enhanced skill click handler with audio
    const handleSkillClickWithAudio = () => {
        playSound('click');
        handleSkillClick();
    };

    // Enhanced rest period violation handler with audio
    const handleRestPeriodViolationWithAudio = () => {
        playSound('fail');
        handleRestPeriodViolation();
    };

    // Enhanced attack start handler with audio
    const handleStartAttackWithAudio = () => {
        playSound('attack');
        startSkillClick();
    };

    // Handle keyboard events
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === 'Space') {
                event.preventDefault();

                if (gameData.gameState === 'skill-click') {
                    if (gameData.skillClick.currentClicks >= gameData.skillClick.requiredClicks) {
                        // In rest period, any click should fail the combo
                        handleRestPeriodViolationWithAudio();
                    } else {
                        handleSkillClickWithAudio();
                    }
                } else if (gameData.gameState === 'hold-release' && !gameData.holdRelease.isHolding) {
                    handleHoldStart();
                }
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.code === 'Space' && gameData.gameState === 'hold-release' && gameData.holdRelease.isHolding) {
                event.preventDefault();
                handleHoldEnd();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [gameData.gameState, gameData.skillClick.currentClicks, gameData.skillClick.requiredClicks, gameData.holdRelease.isHolding, handleSkillClickWithAudio, handleRestPeriodViolationWithAudio, handleHoldStart, handleHoldEnd]);

    // Render main game screen
    const renderMainScreen = () => {
        if (gameData.gameState === 'menu') {
            return <MainMenu onStartGame={startGame} />;
        }
        return (
            <GameplayScreen
                gameData={gameData}
                onStartAttack={handleStartAttackWithAudio}
            />
        );
    };

    // Get background style based on game state
    const getBackgroundStyle = () => {
        switch (gameData.gameState) {
            case 'transition-win':
                return 'bg-gradient-to-br from-emerald-900/30 via-green-900/30 to-teal-900/30';
            case 'transition-lose':
                return 'bg-gradient-to-br from-red-900/30 via-rose-900/30 to-pink-900/30';
            case 'win':
                return 'bg-gradient-to-br from-emerald-900/30 via-green-900/30 to-teal-900/30';
            case 'lose':
                return 'bg-gradient-to-br from-red-900/30 via-rose-900/30 to-pink-900/30';
            default:
                return 'bg-gradient-to-br from-violet-900/20 via-purple-900/20 to-fuchsia-900/20';
        }
    };

    // Get background image based on game state
    const getBackgroundImage = () => {
        if (gameData.gameState === 'menu') return null;

        const { currentEnemy, gameState, comboState } = gameData;

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

    // Get orb colors and animations based on game state
    const getOrbStyles = () => {
        switch (gameData.gameState) {
            case 'transition-win':
            case 'win':
                return {
                    orb1: 'bg-emerald-500/50 animate-victory-pulse',
                    orb2: 'bg-green-500/50 animate-victory-pulse',
                    orb3: 'bg-teal-500/50 animate-victory-pulse',
                    orb4: 'bg-cyan-500/50 animate-victory-pulse'
                };
            case 'transition-lose':
            case 'lose':
                return {
                    orb1: 'bg-red-500/50 animate-defeat-shake',
                    orb2: 'bg-rose-500/50 animate-defeat-shake',
                    orb3: 'bg-pink-500/50 animate-defeat-shake',
                    orb4: 'bg-orange-500/50 animate-defeat-shake'
                };
            default:
                return {
                    orb1: 'bg-blue-500/20 animate-orb-float',
                    orb2: 'bg-purple-500/20 animate-orb-float',
                    orb3: 'bg-pink-500/20 animate-orb-float',
                    orb4: 'bg-indigo-500/20 animate-orb-float'
                };
        }
    };

    const orbStyles = getOrbStyles();

    return (
        <div className="fixed inset-0 overflow-hidden">
            {/* Base background image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(/imgs/san-dau.png)` }}
            />

            {/* Animated background overlay */}
            <div className={`absolute inset-0 transition-all duration-2000 ease-in-out ${getBackgroundStyle()}`}>
                {/* Enemy background image */}
                {getBackgroundImage() && (
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out opacity-30"
                        style={{ backgroundImage: `url(${getBackgroundImage()})` }}
                    />
                )}

                {/* Floating orbs */}
                <div className={`absolute top-1/4 left-1/4 w-96 h-96 ${orbStyles.orb1} rounded-full blur-3xl transition-all duration-2000`} />
                <div className={`absolute bottom-1/4 right-1/4 w-80 h-80 ${orbStyles.orb2} rounded-full blur-3xl delay-1000 transition-all duration-2000`} />
                <div className={`absolute top-1/2 left-1/2 w-64 h-64 ${orbStyles.orb3} rounded-full blur-3xl delay-500 transition-all duration-2000`} />
                <div className={`absolute top-3/4 left-1/6 w-72 h-72 ${orbStyles.orb4} rounded-full blur-3xl delay-1500 transition-all duration-2000`} />

                {/* Grid overlay */}
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20" />
            </div>

            {/* Game content */}
            <div className="relative z-10 h-full">
                {renderMainScreen()}

                {/* Combo dialogs */}
                <GlassDialog
                    isOpen={gameData.gameState === 'skill-click' && gameData.comboState !== 'success' && gameData.comboState !== 'failed'}
                    size="large"
                    backdrop="blur"
                >
                    <SkillClickCombo
                        gameData={gameData}
                        onSkillClick={handleSkillClickWithAudio}
                        onRestPeriodViolation={handleRestPeriodViolationWithAudio}
                    />
                </GlassDialog>

                <GlassDialog
                    isOpen={gameData.gameState === 'hold-release' && gameData.comboState !== 'success' && gameData.comboState !== 'failed'}
                    size="large"
                    backdrop="blur"
                >
                    <HoldReleaseCombo
                        gameData={gameData}
                        onHoldStart={handleHoldStart}
                        onHoldEnd={handleHoldEnd}
                    />
                </GlassDialog>

                {/* Level complete dialog */}
                <GlassDialog
                    isOpen={gameData.gameState === 'level-complete'}
                    size="large"
                    backdrop="blur"
                >
                    <LevelCompleteScreen
                        gameData={gameData}
                        onContinue={continueToNextLevel}
                    />
                </GlassDialog>

                {/* Win/Lose dialogs */}
                <GlassDialog
                    isOpen={gameData.gameState === 'win'}
                    size="medium"
                    backdrop="blur"
                >
                    <GameDialog
                        title="VICTORY!"
                        message="Bonk has defeated all opponents!"
                        onAction={resetGame}
                        actionText="Play Again"
                    />
                </GlassDialog>

                <GlassDialog
                    isOpen={gameData.gameState === 'lose'}
                    size="medium"
                    backdrop="blur"
                >
                    <GameDialog
                        title="DEFEAT!"
                        message="Bonk has been defeated!"
                        onAction={resetGame}
                        actionText="PLAY AGAIN"
                    />
                </GlassDialog>
            </div>
        </div>
    );
}; 