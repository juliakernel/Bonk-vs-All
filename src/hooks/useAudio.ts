import { useRef, useCallback } from 'react';

export interface AudioFiles {
    click: string;
    success: string;
    fail: string;
    attack: string;
    damage: string;
    victory: string;
    defeat: string;
    bgMusic: string;
}

const AUDIO_FILES: AudioFiles = {
    click: '/sounds/click.wav',
    success: '/sounds/success.wav',
    fail: '/sounds/fail.wav',
    attack: '/sounds/attack.wav',
    damage: '/sounds/damage.wav',
    victory: '/sounds/victory.wav',
    defeat: '/sounds/defeat.wav',
    bgMusic: '/sounds/bg-music.wav'
};

export const useAudio = () => {
    const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
    const bgMusicRef = useRef<HTMLAudioElement | null>(null);

    // Initialize audio elements
    const initializeAudio = useCallback(() => {
        Object.entries(AUDIO_FILES).forEach(([key, src]) => {
            if (!audioRefs.current[key]) {
                const audio = new Audio(src);
                audio.preload = 'auto';
                audio.volume = key === 'bgMusic' ? 0.3 : 0.7;

                if (key === 'bgMusic') {
                    audio.loop = true;
                    bgMusicRef.current = audio;
                }

                audioRefs.current[key] = audio;
            }
        });
    }, []);

    // Play a sound effect
    const playSound = useCallback((soundName: keyof AudioFiles) => {
        try {
            const audio = audioRefs.current[soundName];
            if (audio) {
                audio.currentTime = 0;
                audio.play().catch(console.warn);
            }
        } catch (error) {
            console.warn('Audio playback failed:', error);
        }
    }, []);

    // Play background music
    const playBgMusic = useCallback(() => {
        try {
            if (bgMusicRef.current) {
                bgMusicRef.current.play().catch(console.warn);
            }
        } catch (error) {
            console.warn('Background music playback failed:', error);
        }
    }, []);

    // Stop background music
    const stopBgMusic = useCallback(() => {
        try {
            if (bgMusicRef.current) {
                bgMusicRef.current.pause();
                bgMusicRef.current.currentTime = 0;
            }
        } catch (error) {
            console.warn('Background music stop failed:', error);
        }
    }, []);

    // Set volume for all sounds
    const setVolume = useCallback((volume: number) => {
        Object.values(audioRefs.current).forEach(audio => {
            if (audio !== bgMusicRef.current) {
                audio.volume = Math.max(0, Math.min(1, volume));
            }
        });
    }, []);

    // Set background music volume
    const setBgMusicVolume = useCallback((volume: number) => {
        if (bgMusicRef.current) {
            bgMusicRef.current.volume = Math.max(0, Math.min(1, volume));
        }
    }, []);

    return {
        initializeAudio,
        playSound,
        playBgMusic,
        stopBgMusic,
        setVolume,
        setBgMusicVolume
    };
}; 