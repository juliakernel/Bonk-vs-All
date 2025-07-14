import React, { useEffect, useState } from 'react';
import { scoreAPI, LeaderboardEntry, formatTime } from '@/lib/supabase';

interface LeaderboardProps {
    className?: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ className = '' }) => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPlayers, setTotalPlayers] = useState(0);

    // Fetch leaderboard data
    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            try {
                const [leaderboardData, totalCount] = await Promise.all([
                    scoreAPI.getLeaderboard(10), // Top 10
                    scoreAPI.getTotalScores()
                ]);

                setLeaderboard(leaderboardData);
                setTotalPlayers(totalCount);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    // Refresh leaderboard
    const refreshLeaderboard = async () => {
        const [leaderboardData, totalCount] = await Promise.all([
            scoreAPI.getLeaderboard(10),
            scoreAPI.getTotalScores()
        ]);

        setLeaderboard(leaderboardData);
        setTotalPlayers(totalCount);
    };

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return '🥇';
            case 2:
                return '🥈';
            case 3:
                return '🥉';
            default:
                return '🏅';
        }
    };

    const getRankColor = (rank: number) => {
        switch (rank) {
            case 1:
                return 'text-yellow-400';
            case 2:
                return 'text-gray-300';
            case 3:
                return 'text-orange-400';
            default:
                return 'text-white';
        }
    };

    return (
        <div className={`${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        🏆 LEADERBOARD
                    </h2>
                    <p className="text-white/70">
                        {totalPlayers} players have completed the challenge
                    </p>
                </div>
                <div>
                </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="text-white/70 text-lg">Loading leaderboard...</div>
                    </div>
                ) : leaderboard.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="text-6xl mb-4">🎮</div>
                        <div className="text-white text-xl mb-2">No scores yet!</div>
                        <div className="text-white/70">Be the first to complete the challenge!</div>
                    </div>
                ) : (
                    <div className="divide-y divide-white/10">
                        {/* Header */}
                        <div className="px-6 py-4 bg-white/5">
                            <div className="grid grid-cols-12 gap-4 text-white/70 text-sm font-semibold">
                                <div className="col-span-2">RANK</div>
                                <div className="col-span-6">PLAYER</div>
                                <div className="col-span-4 text-right">TIME</div>
                            </div>
                        </div>

                        {/* Leaderboard entries */}
                        {leaderboard.map((entry, index) => (
                            <div
                                key={entry.id}
                                className={`px-6 py-4 hover:bg-white/5 transition-colors ${entry.rank <= 3 ? 'bg-gradient-to-r from-yellow-500/10 to-transparent' : ''
                                    }`}
                            >
                                <div className="grid grid-cols-12 gap-4 items-center">
                                    {/* Rank */}
                                    <div className="col-span-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">{getRankIcon(entry.rank)}</span>
                                            <span className={`font-bold text-lg ${getRankColor(entry.rank)}`}>
                                                #{entry.rank}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Player */}
                                    <div className="col-span-6">
                                        <div className="text-white font-mono text-lg">
                                            {entry.formatted_wallet}
                                        </div>
                                        <div className="text-white/50 text-sm">
                                            {new Date(entry.created_at).toLocaleDateString()}
                                        </div>
                                    </div>

                                    {/* Time */}
                                    <div className="col-span-4 text-right">
                                        <div className={`font-bold text-xl ${getRankColor(entry.rank)}`}>
                                            {formatTime(entry.completion_time)}
                                        </div>
                                        <div className="text-white/50 text-sm">
                                            {entry.completion_time}s
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Stats */}
            {leaderboard.length > 0 && (
                <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="bg-black/20 rounded-xl p-4 text-center">
                        <div className="text-yellow-400 text-2xl font-bold">
                            {formatTime(leaderboard[0]?.completion_time || 0)}
                        </div>
                        <div className="text-white/70 text-sm">Best Time</div>
                    </div>
                    <div className="bg-black/20 rounded-xl p-4 text-center">
                        <div className="text-blue-400 text-2xl font-bold">
                            {formatTime(
                                Math.floor(
                                    leaderboard.reduce((sum, entry) => sum + entry.completion_time, 0) / leaderboard.length
                                )
                            )}
                        </div>
                        <div className="text-white/70 text-sm">Average Time</div>
                    </div>
                    <div className="bg-black/20 rounded-xl p-4 text-center">
                        <div className="text-green-400 text-2xl font-bold">
                            {totalPlayers}
                        </div>
                        <div className="text-white/70 text-sm">Total Players</div>
                    </div>
                </div>
            )}
        </div>
    );
}; 