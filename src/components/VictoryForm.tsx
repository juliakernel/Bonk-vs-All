import React, { useState } from 'react';
import { scoreAPI, formatTime } from '@/lib/supabase';

interface VictoryFormProps {
    completionTime: number;
    onSubmitSuccess: () => void;
    onCancel: () => void;
}

export const VictoryForm: React.FC<VictoryFormProps> = ({
    completionTime,
    onSubmitSuccess,
    onCancel
}) => {
    const [walletAddress, setWalletAddress] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [rank, setRank] = useState<number | null>(null);

    const validateWalletAddress = (address: string): boolean => {
        // Basic validation for common wallet formats
        const trimmed = address.trim();

        // Solana wallet (base58, 32-44 chars)
        if (trimmed.length >= 32 && trimmed.length <= 44 && /^[1-9A-HJ-NP-Za-km-z]+$/.test(trimmed)) {
            return true;
        }

        // Ethereum wallet (0x + 40 hex chars)
        if (trimmed.length === 42 && /^0x[a-fA-F0-9]{40}$/.test(trimmed)) {
            return true;
        }

        // Bitcoin wallet (26-35 chars, starts with 1, 3, or bc1)
        if (trimmed.length >= 26 && trimmed.length <= 35 && /^[13bc1][a-zA-Z0-9]+$/.test(trimmed)) {
            return true;
        }

        return false;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!walletAddress.trim()) {
            setError('Please enter your wallet address');
            return;
        }

        if (!validateWalletAddress(walletAddress)) {
            setError('Please enter a valid wallet address');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // Submit score to database
            const result = await scoreAPI.submitScore(walletAddress.trim(), completionTime);

            if (result) {
                // Get rank for this score
                const playerRank = await scoreAPI.getRankForScore(completionTime);
                setRank(playerRank);
                setSubmitted(true);
            } else {
                setError('Failed to submit score. Please try again.');
            }
        } catch (err) {
            setError('Network error. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getRankMessage = (rank: number) => {
        if (rank === 1) return "🥇 NEW RECORD! You're #1!";
        if (rank <= 3) return `🥉 Amazing! You're #${rank}!`;
        if (rank <= 10) return `🏅 Great job! You're #${rank}!`;
        return `💪 Well done! You're #${rank}!`;
    };

    const getRankColor = (rank: number) => {
        if (rank === 1) return 'text-yellow-400';
        if (rank <= 3) return 'text-orange-400';
        if (rank <= 10) return 'text-blue-400';
        return 'text-green-400';
    };

    if (submitted && rank !== null) {
        return (
            <div className="p-8 text-center max-w-md mx-auto">
                <div className="text-6xl mb-4">🎉</div>

                <h2 className="text-3xl font-bold text-white mb-4">
                    Score Submitted!
                </h2>

                <div className={`text-xl font-bold mb-4 ${getRankColor(rank)}`}>
                    {getRankMessage(rank)}
                </div>

                <div className="bg-black/30 rounded-lg p-4 mb-6">
                    <div className="text-white/70 text-sm mb-2">Your Time</div>
                    <div className="text-2xl font-bold text-white">
                        {formatTime(completionTime)}
                    </div>
                    <div className="text-white/50 text-sm">
                        {completionTime} seconds
                    </div>
                </div>

                <div className="bg-black/30 rounded-lg p-4 mb-6">
                    <div className="text-white/70 text-sm mb-2">Wallet Address</div>
                    <div className="text-white font-mono text-sm break-all">
                        {walletAddress}
                    </div>
                </div>

                <button
                    onClick={onSubmitSuccess}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                    Continue
                </button>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-md mx-auto">
            <div className="text-center mb-6">
                <div className="text-6xl mb-4">🏆</div>
                <h2 className="text-3xl font-bold text-white mb-2">
                    Congratulations!
                </h2>
                <p className="text-white/70 mb-4">
                    You completed the challenge in
                </p>
                <div className="text-4xl font-bold text-yellow-400 mb-4">
                    {formatTime(completionTime)}
                </div>
                <p className="text-white/70">
                    Enter your wallet address to save your score to the leaderboard
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="wallet" className="block text-white font-semibold mb-2">
                        Wallet Address
                    </label>
                    <input
                        id="wallet"
                        type="text"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        placeholder="Enter your wallet address..."
                        className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                        disabled={isSubmitting}
                    />
                    <p className="text-white/50 text-xs mt-2">
                        Supports Solana, Ethereum, and Bitcoin addresses
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                        disabled={isSubmitting}
                    >
                        Skip
                    </button>
                    <button
                        type="submit"
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                        disabled={isSubmitting || !walletAddress.trim()}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Score'}
                    </button>
                </div>
            </form>
        </div>
    );
}; 