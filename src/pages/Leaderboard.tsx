import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { getQuests, getSubmissions } from '../utils/storage';
import type { Quest, Submission } from '../types';
import { WalletConnect } from '../components/WalletConnect';
import { EmptyState } from '../components/ui';
import { Trophy, Medal, ArrowLeft } from 'lucide-react';

interface LeaderEntry {
  wallet: string;
  totalRewards: number;
  questsCompleted: number;
  tokens: string[];
}

const MOCK_LEADERS: LeaderEntry[] = [
  { wallet: "7MvTjGzB19x5PzrKqDkP2YY...", totalRewards: 12500000, questsCompleted: 42, tokens: ["NYAN", "BONK", "WIF"] },
  { wallet: "D9rXbA4Qz1KqL2j3NpVtRk3...", totalRewards: 9800000, questsCompleted: 28, tokens: ["NYAN", "WEN"] },
  { wallet: "F5qTz3XkL9RnP2jB19cTzG...", totalRewards: 8400500, questsCompleted: 35, tokens: ["NYAN", "BONK"] },
  { wallet: "H3nKz8XKL9RnP2jB19c5Pz...", totalRewards: 6200000, questsCompleted: 19, tokens: ["PONKE"] },
  { wallet: "J8wTz0XkLQRmP2jB19c5Pz...", totalRewards: 5150000, questsCompleted: 15, tokens: ["BONK"] },
  { wallet: "L1mTz4XkL9RmP2jW19c5Bz...", totalRewards: 4900000, questsCompleted: 12, tokens: ["NYAN"] },
  { wallet: "N9pTz7XkL9RmP2YV19o5Pz...", totalRewards: 3800000, questsCompleted: 11, tokens: ["WEN"] },
  { wallet: "Q2vTz1XkL9GmP2jB19c5Pz...", totalRewards: 2100000, questsCompleted: 8, tokens: ["NYAN"] },
  { wallet: "T4rTz9XkL9RmP2jB19c5Pz...", totalRewards: 1250000, questsCompleted: 6, tokens: ["BONK"] },
  { wallet: "V1yTz2XkL9RmP2jB19c5Pz...", totalRewards: 850000, questsCompleted: 4, tokens: ["WIF"] },
];

export function Leaderboard() {
  const navigate = useNavigate();
  const { publicKey } = useWallet();
  const [entries, setEntries] = useState<LeaderEntry[]>([]);

  useEffect(() => {
    const quests = getQuests();
    const walletMap: Record<string, LeaderEntry> = {};

    quests.forEach((q: Quest) => {
      const approved = getSubmissions(q.id).filter((s: Submission) => s.status === 'approved');
      approved.forEach((sub: Submission) => {
        const w = sub.fanWallet;
        if (!walletMap[w]) {
          walletMap[w] = { wallet: w, totalRewards: 0, questsCompleted: 0, tokens: [] };
        }
        walletMap[w].totalRewards += q.rewardAmount;
        walletMap[w].questsCompleted += 1;
        if (!walletMap[w].tokens.includes(q.tokenSymbol)) {
          walletMap[w].tokens.push(q.tokenSymbol);
        }
      });
    });

    // Sort by total rewards descending
    const sorted = Object.values(walletMap).sort((a, b) => b.totalRewards - a.totalRewards);
    
    // Merge real data with mock data so the platform looks alive for demo
    const combined = [...sorted];
    MOCK_LEADERS.forEach(mock => {
      // Avoid exact duplicates if somehow wallet matches
      if (!combined.find(e => e.wallet.slice(0, 5) === mock.wallet.slice(0, 5))) {
        combined.push(mock);
      }
    });

    combined.sort((a, b) => b.totalRewards - a.totalRewards);
    setEntries(combined);
  }, []);

  const myWallet = publicKey?.toBase58();
  const myRank = entries.findIndex(e => e.wallet === myWallet) + 1;

  const rankIcon = (rank: number) => {
    if (rank === 1) return <span className="text-2xl">🥇</span>;
    if (rank === 2) return <span className="text-2xl">🥈</span>;
    if (rank === 3) return <span className="text-2xl">🥉</span>;
    return <span className="text-sm font-mono text-[var(--text-muted)] w-8 text-center">#{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <nav className="h-20 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between px-6">
        <button onClick={() => navigate('/fan')} className="flex items-center gap-2 text-[var(--text-muted)] hover:text-white transition-colors">
          <ArrowLeft size={20} /> Back
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 bg-[var(--bg-elevated)] p-1 rounded-full border border-[var(--border-subtle)] flex items-center shadow-md">
          <button onClick={() => navigate('/creator')} className="px-5 py-1.5 text-sm font-semibold rounded-full text-[var(--text-muted)] hover:text-white transition-colors">Creator</button>
          <button onClick={() => navigate('/fan')} className="px-5 py-1.5 text-sm font-semibold rounded-full text-[var(--text-muted)] hover:text-white transition-colors">Fan</button>
        </div>
        <WalletConnect />
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12 animate-in">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-[var(--accent)]/15 border border-[var(--accent)]/30 flex items-center justify-center mx-auto mb-5 text-[var(--accent)]" style={{ boxShadow: '0 0 30px var(--accent-glow)' }}>
            <Trophy size={30} />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
            🏆 <span className="text-gradient">Alpha Leaderboard</span>
          </h1>
          <p className="text-[var(--text-muted)]">Top quest completers ranked by total tokens earned</p>
        </div>

        {/* Global Platform Statistics */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-10 animate-in stagger">
          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent)]/50 transition-colors text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--accent)]/5 pointer-events-none"></div>
            <p className="text-[10px] md:text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold mb-1">Total Distributed</p>
            <p className="font-mono font-bold text-lg md:text-2xl text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">42.5M+</p>
          </div>
          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent)]/50 transition-colors text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--accent)]/5 pointer-events-none"></div>
            <p className="text-[10px] md:text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold mb-1">Active Fans</p>
            <p className="font-mono font-bold text-lg md:text-2xl text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">12.4K</p>
          </div>
          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent)]/50 transition-colors text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--accent)]/5 pointer-events-none"></div>
            <p className="text-[10px] md:text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold mb-1">Quests Done</p>
            <p className="font-mono font-bold text-lg md:text-2xl text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">89.2K</p>
          </div>
        </div>

        {/* My Rank Banner (if connected and on board) */}
        {myWallet && myRank > 0 && (
          <div className="mb-8 p-4 rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/30 flex items-center justify-between animate-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center text-black font-bold text-sm">
                {myWallet.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">Your Rank</p>
                <p className="font-mono font-bold text-[var(--accent)]">#{myRank} — {myWallet.slice(0,4)}...{myWallet.slice(-4)}</p>
              </div>
            </div>
            <span className="text-[var(--accent)] font-bold text-lg font-mono">
              {entries[myRank - 1]?.totalRewards.toLocaleString()} tokens earned
            </span>
          </div>
        )}

        {/* Leaderboard List */}
        {entries.length === 0 ? (
          <EmptyState
            icon={<Medal />}
            title="No Winners Yet"
            description="Complete quests and get approved by creators to appear on the leaderboard!"
          />
        ) : (
          <div className="space-y-3">
            {entries.map((entry, idx) => {
              const rank = idx + 1;
              const isMe = entry.wallet === myWallet;
              return (
                <div
                  key={entry.wallet}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 group
                    ${rank <= 3
                      ? 'bg-gradient-to-r from-[var(--bg-surface)] to-[var(--bg-elevated)] border-[var(--accent)]/25 hover:border-[var(--accent)]/60'
                      : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--border-default)]'
                    }
                    ${isMe ? 'ring-1 ring-[var(--accent)]/50' : ''}
                  `}
                >
                  {/* Rank */}
                  <div className="w-10 flex items-center justify-center shrink-0">
                    {rankIcon(rank)}
                  </div>

                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center font-bold text-sm
                    ${rank === 1 ? 'bg-gradient-to-tr from-yellow-400 to-orange-400 text-black' :
                      rank === 2 ? 'bg-gradient-to-tr from-gray-300 to-gray-500 text-black' :
                      rank === 3 ? 'bg-gradient-to-tr from-orange-500 to-amber-600 text-black' :
                      'bg-[var(--bg-elevated)] text-[var(--text-muted)]'
                    }`}>
                    {entry.wallet.slice(0, 1).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-[var(--text-primary)] truncate">
                        {entry.wallet.slice(0, 6)}...{entry.wallet.slice(-4)}
                      </span>
                      {isMe && <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/20 shrink-0">You</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-[var(--text-muted)]">{entry.questsCompleted} quest{entry.questsCompleted !== 1 ? 's' : ''} completed</span>
                      {entry.tokens.map(t => (
                        <span key={t} className="text-xs text-[var(--accent)] font-mono font-medium">${t}</span>
                      ))}
                    </div>
                  </div>

                  {/* Reward Total */}
                  <div className="text-right shrink-0">
                    <p className={`font-mono font-bold text-lg ${rank <= 3 ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>
                      {entry.totalRewards.toLocaleString()}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">tokens</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
