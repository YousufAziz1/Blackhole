import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useNavigate } from 'react-router-dom';
import { Button, EmptyState } from '../components/ui';
import { QuestCard } from '../components/QuestCard';
import { getQuests, getAllFanSubmissions } from '../utils/storage';
import { WalletConnect } from '../components/WalletConnect';
import { Logo } from '../components/Logo';
import type { Quest, Submission } from '../types';
import { Trophy, Compass, CheckCircle2 } from 'lucide-react';
import { XIcon, GithubIcon } from '../components/Icons';

export function FanDashboard() {
  const { connected, publicKey } = useWallet();
  const navigate = useNavigate();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [activeTab, setActiveTab] = useState<'explore' | 'mysubs'>('explore');

  useEffect(() => {
    setQuests(getQuests().filter(q => q.isActive && new Date(q.deadline) > new Date()));
    if (publicKey) setSubmissions(getAllFanSubmissions(publicKey.toBase58()));
    else setSubmissions([]);
  }, [connected, publicKey]);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <nav className="h-20 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between px-6">
        <button onClick={() => navigate('/')} className="hover:opacity-80 transition-opacity">
          <Logo />
        </button>

        <div className="absolute left-1/2 -translate-x-1/2 bg-[var(--bg-elevated)] p-1 rounded-full border border-[var(--border-subtle)] flex items-center shadow-md">
          <button onClick={() => navigate('/creator')} className="px-5 py-1.5 text-sm font-semibold rounded-full text-[var(--text-muted)] hover:text-white transition-colors">Creator</button>
          <button className="px-5 py-1.5 text-sm font-semibold rounded-full bg-[var(--accent)] text-black shadow-lg glow">Fan</button>
        </div>

        <div className="flex items-center gap-2">
          <a href="https://x.com/YousufWeb3AI" target="_blank" rel="noreferrer" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors p-2 rounded-lg hover:bg-[var(--bg-elevated)]" title="Follow on X">
            <XIcon size={16} />
          </a>
          <a href="https://github.com/YousufAziz1" target="_blank" rel="noreferrer" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors p-2 rounded-lg hover:bg-[var(--bg-elevated)]" title="GitHub">
            <GithubIcon size={17} />
          </a>
          <WalletConnect />
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-4 border-b border-[var(--border-subtle)] w-full max-w-md">
            <button 
              className={`pb-3 font-medium transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'explore' ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-transparent text-[var(--text-muted)] hover:text-white'}`}
              onClick={() => setActiveTab('explore')}
            >
              <Compass size={18} /> Explore Quests
            </button>
            <button 
              className={`pb-3 font-medium transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'mysubs' ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-transparent text-[var(--text-muted)] hover:text-white'}`}
              onClick={() => setActiveTab('mysubs')}
            >
              <CheckCircle2 size={18} /> My Submissions
            </button>
          </div>
          
          <Button variant="secondary" onClick={() => navigate('/leaderboard')} icon={<Trophy size={16} />}>Leaderboard</Button>
        </div>

        {activeTab === 'explore' && (
          quests.length === 0 ? (
            <EmptyState 
              icon={<Compass />}
              title="No Quests Available"
              description="There are no active quests right now. Check back later!"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in">
              {quests.map(q => <QuestCard key={q.id} quest={q} />)}
            </div>
          )
        )}

        {activeTab === 'mysubs' && (
          submissions.length === 0 ? (
            <EmptyState 
               icon={<CheckCircle2 />}
               title="No Submissions Yet"
               description="You haven't participated in any quests. Explore quests and earn rewards!"
               action={{ label: "Explore Quests", onClick: () => setActiveTab('explore') }}
            />
          ) : (
            <div className="space-y-4 animate-in">
              {submissions.map(sub => {
                const quest = getQuests().find(q => q.id === sub.questId);
                return (
                  <div key={sub.id} className="card-base p-5 bg-[var(--bg-surface)] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-lg">{quest?.title}</h4>
                      <p className="text-[var(--text-muted)] text-sm mb-2">{quest?.tokenSymbol} Reward: {quest?.rewardAmount}</p>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono font-medium border ${
                        sub.status === 'approved' ? 'bg-[var(--success-dim)] text-[var(--success)] border-[var(--success)]/20' : 
                        sub.status === 'rejected' ? 'bg-[var(--error-dim)] text-[var(--error)] border-[var(--error)]/20' : 
                        'bg-[var(--warning-dim)] text-[var(--warning)] border-[var(--warning)]/20'
                      }`}>
                        Status: {sub.status.toUpperCase()}
                      </span>
                    </div>
                    {sub.status === 'approved' && !sub.rewardSent && (
                       <span className="text-sm text-[var(--text-secondary)] italic">Reward Pending Airdrop</span>
                    )}
                    {sub.rewardSent && (
                       <span className="text-sm text-[var(--success)] font-medium">Reward Received 🎉</span>
                    )}
                  </div>
                )
              })}
            </div>
          )
        )}
      </main>
    </div>
  );
}
