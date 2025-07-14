import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Score {
    id: string;
    wallet_address: string;
    completion_time: number;
    created_at: string;
    updated_at: string;
}

export interface LeaderboardEntry {
    id: string;
    wallet_address: string;
    completion_time: number;
    created_at: string;
    rank: number;
    formatted_wallet: string;
}

// API Functions
export const scoreAPI = {
    // Submit a new score
    async submitScore(walletAddress: string, completionTimeSeconds: number): Promise<Score | null> {
        try {
            const { data, error } = await supabase
                .from('scores')
                .insert([
                    {
                        wallet_address: walletAddress,
                        completion_time: completionTimeSeconds,
                    },
                ])
                .select()
                .single();

            if (error) {
                console.error('Error submitting score:', error);
                return null;
            }

            return data;
        } catch (error) {
            console.error('Error submitting score:', error);
            return null;
        }
    },

    // Get top scores for leaderboard
    async getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
        try {
            const { data, error } = await supabase
                .from('leaderboard')
                .select('*')
                .limit(limit);

            if (error) {
                console.error('Error fetching leaderboard:', error);
                return [];
            }

            return data || [];
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            return [];
        }
    },

    // Get personal best for a wallet
    async getPersonalBest(walletAddress: string): Promise<LeaderboardEntry | null> {
        try {
            const { data, error } = await supabase
                .from('personal_best')
                .select('*')
                .eq('wallet_address', walletAddress)
                .single();

            if (error) {
                console.error('Error fetching personal best:', error);
                return null;
            }

            return data;
        } catch (error) {
            console.error('Error fetching personal best:', error);
            return null;
        }
    },

    // Get total number of scores
    async getTotalScores(): Promise<number> {
        try {
            const { count, error } = await supabase
                .from('scores')
                .select('*', { count: 'exact', head: true });

            if (error) {
                console.error('Error fetching total scores:', error);
                return 0;
            }

            return count || 0;
        } catch (error) {
            console.error('Error fetching total scores:', error);
            return 0;
        }
    },

    // Get rank for a specific score
    async getRankForScore(completionTime: number): Promise<number> {
        try {
            const { count, error } = await supabase
                .from('scores')
                .select('*', { count: 'exact', head: true })
                .lt('completion_time', completionTime);

            if (error) {
                console.error('Error fetching rank:', error);
                return 0;
            }

            return (count || 0) + 1;
        } catch (error) {
            console.error('Error fetching rank:', error);
            return 0;
        }
    },
};

// Utility functions
export const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatWalletAddress = (address: string): string => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}; 