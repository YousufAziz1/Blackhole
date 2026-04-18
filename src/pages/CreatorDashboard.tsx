import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useNavigate } from 'react-router-dom';
import { Button, EmptyState } from '../components/ui';
import { QuestCard } from '../components/QuestCard';
import { QuestForm } from '../components/QuestForm';
import { getQuests, getSubmissions, saveSubmission, deleteQuest, saveQuest } from '../utils/storage';
import { WalletConnect } from '../components/WalletConnect';
import { Logo } from '../components/Logo';
import type { Quest, Submission } from '../types';
import toast from 'react-hot-toast';
import { Plus, ListTodo, ClipboardCheck, Check, X, Filter, Trophy, Star, Copy } from 'lucide-react';
import { XIcon, GithubIcon } from '../components/Icons';

export function CreatorDashboard() {
  const { connected, publicKey, signMessage } = useWallet();
  const navigate = useNavigate();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [winners, setWinners] = useState<Submission[]>([]);
  const [showQuestForm, setShowQuestForm] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [activeTab, setActiveTab] = useState<'quests' | 'approvals' | 'winners'>('quests');
  const [filterExpired, setFilterExpired] = useState<'active' | 'expired'>('active');
  const [filterQuestId, setFilterQuestId] = useState<string>('all');

  const displaySubmissions = filterQuestId === 'all' ? submissions : submissions.filter(s => s.questId === filterQuestId);
  const displayWinners = filterQuestId === 'all' ? winners : winners.filter(s => s.questId === filterQuestId);

  // Hardcoded holders for AI calculation since we don't have on-chain API connected in this demo,
  // but Token identity is now fully dynamic.
  const holderCount = 250;

  const loadData = () => {
    if (!publicKey) return;
    const all = getQuests().filter(q => q.creatorWallet === publicKey.toBase58());
    setQuests(all);

    let allSubs: Submission[] = [];
    let allWins: Submission[] = [];
    all.forEach(q => {
      const subs = getSubmissions(q.id);
      allSubs.push(...subs.filter(s => s.status === 'pending'));
      allWins.push(...subs.filter(s => s.status === 'approved'));
    });
    setSubmissions(allSubs);
    setWinners(allWins);
  };

  useEffect(() => {
    if (!connected) navigate('/');
    else loadData();
  }, [connected, publicKey, navigate]);

  const handleApproval = async (submission: Submission, approve: boolean) => {
    if (approve) {
      if (!signMessage) {
        toast.error("Wallet not connected completely!");
        return;
      }
      
      try {
        const toastId = toast.loading(
          <div className="flex flex-col gap-1">
            <span className="font-semibold">Confirming approval...</span>
            <span className="text-xs text-[var(--text-muted)]">Please sign message in wallet</span>
          </div>
        );

        // Actual realistic signing prompt
        const encodedMessage = new TextEncoder().encode(`Approve Reward for Submission: ${submission.id}`);
        await signMessage(encodedMessage);

        toast.loading("Broadcasting reward transaction to Solana...", { id: toastId });
        await new Promise(res => setTimeout(res, 1800)); // Simulate propagation

        const fakeTxHash = "5k" + Math.random().toString(36).substring(2, 12) + "solanaTxFakeSignature" + Date.now().toString(36);

        toast.success(
          () => (
            <div className="flex flex-col gap-1.5">
              <span className="font-semibold text-[var(--success)]">Reward Sent Successfully!</span>
              <div className="text-xs text-[var(--text-muted)] bg-black/40 p-1.5 rounded border border-[var(--border-subtle)] font-mono break-all line-clamp-1">
                {fakeTxHash}
              </div>
              <a href={`https://solscan.io/tx/${fakeTxHash}?cluster=devnet`} target="_blank" rel="noreferrer" className="text-xs text-[var(--accent)] hover:underline flex items-center gap-1 mt-1">
                View on Solscan ↗
              </a>
            </div>
          ),
          { id: toastId, duration: 6000 }
        );
      } catch (error) {
        console.error(error);
        toast.error("Transaction cancelled or failed.");
        return; // Important: Don't approve if they decline
      }
    } else {
      toast.success("Submission Rejected");
    }

    submission.status = approve ? 'approved' : 'rejected';
    saveSubmission(submission);

    if (approve) {
      const q = quests.find(q => q.id === submission.questId);
      if (q && q.currentCompletions < q.maxCompletions) {
        q.currentCompletions += 1;
        saveQuest(q);
      }
    }

    loadData();
  };

  const handleDeleteQuest = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this quest?")) {
      deleteQuest(id);
      loadData();
      toast.success("Quest deleted successfully.");
    }
  };

  const handleToggleActive = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const q = quests.find(q => q.id === id);
    if (q) {
      q.isActive = !q.isActive;
      saveQuest(q);
      loadData();
      toast.success(q.isActive ? "Quest activated!" : "Quest deactivated.");
    }
  };

  const handleEditQuest = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const q = quests.find(q => q.id === id);
    if (q) {
      setEditingQuest(q);
      setShowQuestForm(true);
    }
  };

  const pendingApprovalsCount = submissions.length;

  const filteredQuests = quests.filter(q => {
    const isExpired = new Date(q.deadline) < new Date();
    return filterExpired === 'active' ? !isExpired : isExpired;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <nav className="h-20 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between px-6">
        <button onClick={() => navigate('/')} className="hover:opacity-80 transition-opacity">
          <Logo />
        </button>
        
        <div className="absolute left-1/2 -translate-x-1/2 bg-[var(--bg-elevated)] p-1 rounded-full border border-[var(--border-subtle)] flex items-center shadow-md">
          <button className="px-5 py-1.5 text-sm font-semibold rounded-full bg-[var(--accent)] text-black shadow-lg glow">Creator</button>
          <button onClick={() => navigate('/fan')} className="px-5 py-1.5 text-sm font-semibold rounded-full text-[var(--text-muted)] hover:text-white transition-colors">Fan</button>
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
        
        {/* Top Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 animate-in stagger">
          <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center group-hover:scale-110 transition-transform"><ListTodo size={20} /></span>
              <p className="text-sm text-[var(--text-secondary)] font-medium uppercase tracking-wider">Total Quests</p>
            </div>
            <h4 className="text-4xl font-display font-bold text-[var(--text-primary)]">{quests.length}</h4>
          </div>
          
          <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--warning)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-10 rounded-xl bg-[var(--warning)]/10 text-[var(--warning)] flex items-center justify-center group-hover:scale-110 transition-transform"><ClipboardCheck size={20} /></span>
              <p className="text-sm text-[var(--text-secondary)] font-medium uppercase tracking-wider">Pending Action</p>
            </div>
            <div className="flex items-end gap-2">
              <h4 className="text-4xl font-display font-bold text-[var(--text-primary)]">{submissions.length}</h4>
              {submissions.length > 0 && <span className="text-[var(--warning)] text-sm mb-1 animate-pulse flex border-none focus-visible:outline-none">● Needs review</span>}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--success)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-10 rounded-xl bg-[var(--success)]/10 text-[var(--success)] flex items-center justify-center group-hover:scale-110 transition-transform"><Trophy size={20} /></span>
              <p className="text-sm text-[var(--text-secondary)] font-medium uppercase tracking-wider">Alpha Winners</p>
            </div>
            <h4 className="text-4xl font-display font-bold text-[var(--text-primary)]">{winners.length}</h4>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex gap-4 border-b border-[var(--border-subtle)] w-full max-w-md">
            <button 
              className={`pb-3 font-medium transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'quests' ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-transparent text-[var(--text-muted)] hover:text-white'}`}
              onClick={() => setActiveTab('quests')}
            >
              <ListTodo size={18} /> My Quests
            </button>
            <button 
              className={`pb-3 font-medium transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'approvals' ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-transparent text-[var(--text-muted)] hover:text-white'}`}
              onClick={() => setActiveTab('approvals')}
            >
              <ClipboardCheck size={18} /> 
              Approvals 
              {pendingApprovalsCount > 0 && <span className="bg-[var(--accent)] text-black text-xs px-2 py-0.5 rounded-full">{pendingApprovalsCount}</span>}
            </button>
            <button 
              className={`pb-3 font-medium transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'winners' ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-transparent text-[var(--text-muted)] hover:text-white'}`}
              onClick={() => setActiveTab('winners')}
            >
              <Star size={18} /> Winners
            </button>
          </div>
          <div className="flex items-center gap-4">
            {activeTab === 'quests' && (
              <div className="bg-[var(--bg-elevated)] p-1 rounded-xl flex border border-[var(--border-subtle)] text-sm">
                <button 
                  onClick={() => setFilterExpired('active')}
                  className={`px-3 py-1 flex items-center gap-1.5 rounded-lg transition-colors ${filterExpired === 'active' ? 'bg-[var(--accent)] text-black font-semibold shadow' : 'text-[var(--text-muted)] hover:text-white'}`}
                ><Filter size={14} /> Active</button>
                <button 
                  onClick={() => setFilterExpired('expired')}
                  className={`px-3 py-1 flex items-center gap-1.5 rounded-lg transition-colors ${filterExpired === 'expired' ? 'bg-[var(--bg-surface)] text-white font-semibold shadow' : 'text-[var(--text-muted)] hover:text-white'}`}
                >Expired</button>
              </div>
            )}
            {(activeTab === 'approvals' || activeTab === 'winners') && quests.length > 0 && (
              <select 
                className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm rounded-xl px-3 py-1.5 outline-none focus:border-[var(--accent)]"
                value={filterQuestId}
                onChange={(e) => setFilterQuestId(e.target.value)}
              >
                <option value="all">All Quests</option>
                {quests.map(q => <option key={q.id} value={q.id}>{q.title}</option>)}
              </select>
            )}
            <Button icon={<Plus size={18} />} onClick={() => setShowQuestForm(true)} size="sm">New Quest</Button>
          </div>
        </div>

        {activeTab === 'quests' && (
          filteredQuests.length === 0 ? (
            <EmptyState 
              icon={<ListTodo />}
              title={filterExpired === 'active' ? "No Active Quests" : "No Expired Quests"}
              description="You have no quests matching this filter."
              action={filterExpired === 'active' ? { label: 'Create Quest', onClick: () => setShowQuestForm(true) } : undefined}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in">
              {filteredQuests.map(q => (
                <QuestCard 
                  key={q.id} 
                  quest={q} 
                  isCreator 
                  onDelete={handleDeleteQuest}
                  onToggleActive={handleToggleActive}
                  onEdit={handleEditQuest}
                />
              ))}
            </div>
          )
        )}

        {activeTab === 'approvals' && (
          submissions.length === 0 ? (
            <EmptyState 
               icon={<ClipboardCheck />}
               title="All caught up!"
               description="You don't have any pending proofs to review at the moment."
            />
          ) : (
            <div className="space-y-4 animate-in">
              {displaySubmissions.map(sub => {
                const quest = quests.find(q => q.id === sub.questId);
                return (
                  <div key={sub.id} className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-4 mb-2">
                        <h4 className="font-semibold text-[var(--text-primary)]">Quest: {quest?.title}</h4>
                        <div 
                          className="flex items-center gap-1.5 text-xs font-mono bg-black/40 px-2.5 py-1 rounded border border-[var(--border-subtle)] text-[var(--accent)] cursor-pointer hover:bg-[var(--accent)]/10 transition-colors" 
                          onClick={() => {navigator.clipboard.writeText(sub.fanWallet); toast.success("Address copied!");}} 
                          title="Click to copy full address"
                        >
                          Fan: {sub.fanWallet} <Copy size={12} />
                        </div>
                      </div>
                      <div className="bg-[var(--bg-elevated)] p-3 rounded-lg text-sm font-mono break-all text-[var(--text-secondary)]">
                        {sub.proofData}
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <Button size="sm" variant="success" icon={<Check size={16} />} onClick={() => handleApproval(sub, true)}>Approve</Button>
                       <Button size="sm" variant="danger" icon={<X size={16} />} onClick={() => handleApproval(sub, false)}>Reject</Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {activeTab === 'winners' && (
          winners.length === 0 ? (
            <EmptyState 
               icon={<Trophy />}
               title="No Winners Yet"
               description="Approve submissions to see your top fans here."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in">
              {displayWinners.map(sub => {
                const quest = quests.find(q => q.id === sub.questId);
                return (
                  <div key={sub.id} className="p-5 bg-gradient-to-r from-[var(--bg-surface)] to-[var(--bg-elevated)] border border-[var(--accent)]/20 rounded-xl relative overflow-hidden group hover:border-[var(--accent)]/60 transition-colors">
                    <div className="absolute -right-4 -top-4 w-16 h-16 bg-[var(--accent)]/10 rounded-full blur-xl" />
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center text-black font-bold">
                        <Trophy size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider mb-0.5">Alpha Winner</p>
                        <div 
                           className="text-[var(--text-primary)] font-mono text-xs md:text-sm flex items-center gap-2 cursor-pointer hover:text-[var(--accent)] transition-colors w-fit"
                           onClick={() => {navigator.clipboard.writeText(sub.fanWallet); toast.success("Address copied!");}}
                           title="Click to copy full address"
                        >
                           <span className="truncate max-w-[200px] sm:max-w-xs">{sub.fanWallet}</span> <Copy size={12} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-[var(--bg-base)] p-3 rounded-lg border border-[var(--border-subtle)] flex items-center justify-between">
                       <span className="text-sm font-medium text-[var(--text-secondary)]">{quest?.title}</span>
                       <span className="text-sm font-bold font-mono text-[var(--accent)]">+{quest ? Math.floor(quest.rewardAmount / (quest.maxCompletions || 1)) : 0} {quest?.tokenSymbol}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </main>

      {showQuestForm && publicKey && (
        <QuestForm 
          creatorWallet={publicKey.toBase58()}
          defaultTokenDetails={quests.length > 0 ? {
            mint: quests[0].tokenMint,
            name: quests[0].tokenName,
            symbol: quests[0].tokenSymbol,
            projectLink: quests[0].projectLink || ''
          } : undefined}
          holderCount={holderCount}
          editQuest={editingQuest || undefined}
          onClose={() => { setShowQuestForm(false); setEditingQuest(null); }}
          onSuccess={() => { setShowQuestForm(false); setEditingQuest(null); loadData(); }}
        />
      )}
    </div>
  );
}
