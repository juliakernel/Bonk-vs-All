-- Bonk vs All Game Leaderboard Schema
-- Run this SQL in your Supabase SQL Editor

-- Create scores table for leaderboard
CREATE TABLE IF NOT EXISTS public.scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address VARCHAR(255) NOT NULL,
  completion_time INTEGER NOT NULL, -- Time in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_scores_completion_time ON public.scores(completion_time ASC);
CREATE INDEX IF NOT EXISTS idx_scores_wallet_address ON public.scores(wallet_address);
CREATE INDEX IF NOT EXISTS idx_scores_created_at ON public.scores(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read scores (for leaderboard)
CREATE POLICY "Allow public read access on scores" 
ON public.scores FOR SELECT 
USING (true);

-- Create policy to allow anyone to insert scores
CREATE POLICY "Allow public insert access on scores" 
ON public.scores FOR INSERT 
WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER handle_scores_updated_at
  BEFORE UPDATE ON public.scores
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create view for leaderboard with ranking
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT 
  id,
  wallet_address,
  completion_time,
  created_at,
  ROW_NUMBER() OVER (ORDER BY completion_time ASC) as rank,
  -- Format wallet address for display (show first 6 and last 4 chars)
  CONCAT(
    LEFT(wallet_address, 6), 
    '...', 
    RIGHT(wallet_address, 4)
  ) as formatted_wallet
FROM public.scores
ORDER BY completion_time ASC;

-- Create view for personal best scores per wallet
CREATE OR REPLACE VIEW public.personal_best AS
SELECT DISTINCT ON (wallet_address)
  wallet_address,
  completion_time,
  created_at,
  CONCAT(
    LEFT(wallet_address, 6), 
    '...', 
    RIGHT(wallet_address, 4)
  ) as formatted_wallet
FROM public.scores
ORDER BY wallet_address, completion_time ASC; 