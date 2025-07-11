export interface Player {
    name: string;
    maxHp: number;
    currentHp: number;
    image?: string;
}

export interface Enemy {
    name: string;
    maxHp: number;
    currentHp: number;
    image?: string;
    background?: string;
    attackImage?: string;
    defendImage?: string;
}

export type GameState = 'menu' | 'playing' | 'skill-click' | 'hold-release' | 'win' | 'lose' | 'level-complete' | 'transition-win' | 'transition-lose';

export type ComboState = 'idle' | 'skill-click' | 'hold-release' | 'success' | 'failed';

export interface SkillClickData {
    requiredClicks: number;
    currentClicks: number;
    timeLimit: number;
    timeRemaining: number;
    isActive: boolean;
    restPeriod: number; // 1 second rest period after reaching required clicks
}

export interface HoldReleaseData {
    targetDuration: number;
    currentDuration: number;
    minDuration: number;
    maxDuration: number;
    isHolding: boolean;
    isActive: boolean;
}

export interface GameData {
    currentLevel: number;
    bonk: Player;
    enemies: Enemy[];
    currentEnemy: Enemy;
    gameState: GameState;
    comboState: ComboState;
    skillClick: SkillClickData;
    holdRelease: HoldReleaseData;
    isPlayerTurn: boolean;
}

export const ENEMIES: Enemy[] = [
    {
        name: 'Jup Studio',
        maxHp: 5,
        currentHp: 5,
        background: '/imgs/jup-bg.png',
        attackImage: '/imgs/jup-attack.png',
        defendImage: '/imgs/jup-defend.png'
    },
    {
        name: 'LaunchLab',
        maxHp: 5,
        currentHp: 5,
        background: '/imgs/launchlab-bg.png',
        attackImage: '/imgs/launchlab-attack.png',
        defendImage: '/imgs/launchlab-defend.png'
    },
    {
        name: 'Moonshot',
        maxHp: 5,
        currentHp: 5,
        background: '/imgs/moonshot-bg.png',
        attackImage: '/imgs/moonshot-attack.png',
        defendImage: '/imgs/moonshot-defend.png'
    },
    {
        name: 'Believe',
        maxHp: 5,
        currentHp: 5,
        background: '/imgs/believe-bg.png',
        attackImage: '/imgs/believe-attack.png',
        defendImage: '/imgs/believe-defend.png'
    },
    {
        name: 'Pumpfun',
        maxHp: 5,
        currentHp: 5,
        background: '/imgs/pumpfun-bg.png',
        attackImage: '/imgs/pumpfun-attack.png',
        defendImage: '/imgs/pumpfun-defend.png'
    }
]; 