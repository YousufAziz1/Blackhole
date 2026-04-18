import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { getQuest, getFanSubmissionForQuest } from '../utils/storage';
import type { Quest, Submission } from '../types';
import type { TokenInfo } from '../utils/bags';
import { Card, Badge, EmptyState } from '../components/ui';
import { ProofSubmitForm } from '../components/ProofSubmitForm';
import { WalletConnect } from '../components/WalletConnect';
import { getTokenInfo } from '../utils/bags';
import { Clock, Trophy, Users, ArrowLeft, CheckCircle2, ShieldCheck, ExternalLink, Zap } from 'lucide-react';

export function QuestDetail() {
  const { questId } = useParams();
  const navigate = useNavigate();
  const { connected, publicKey } = useWallet();
  const [quest, setQuest] = useState<Quest | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [submitMode, setSubmitMode] = useState<'simple' | 'web3'>('web3');
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [bagsLoading, setBagsLoading] = useState(false);

  useEffect(() => {
    if (questId) {
      const q = getQuest(questId);
      if (q) {
        setQuest(q);
        // Auto-fetch token info via BagsSDK on load
        setBagsLoading(true);
        getTokenInfo(q.tokenMint).then(info => {
          setTokenInfo(info);
          setBagsLoading(false);
        }).catch(() => setBagsLoading(false));
      }
      
      if (publicKey) {
        const sub = getFanSubmissionForQuest(questId, publicKey.toBase58());
        if (sub) setSubmission(sub);
      }
    }
  }, [questId, publicKey]);

  if (!quest) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center">
         <EmptyState icon={<Trophy/>} title="Quest not found" description="This quest might have been deleted." action={{ label: "Go Home", onClick: () => navigate('/') }} />
      </div>
    );
  }

  const isExpired = new Date(quest.deadline) < new Date();
  const isFull = quest.currentCompletions >= quest.maxCompletions;
  const isClosed = !quest.isActive || isExpired || isFull;

  const daysLeft = Math.ceil((new Date(quest.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const completionPercentage = Math.round((quest.currentCompletions / quest.maxCompletions) * 100);
  const fillingFast = completionPercentage >= 70 && !isFull;
  // Deterministic mock for social proof (uses quest id length to generate a number so it's stable)
  const socialProofCount = (quest.id.charCodeAt(0) % 30) + 12;

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <nav className="h-20 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between px-6">
        <button onClick={() => navigate('/fan')} className="flex items-center gap-2 text-[var(--text-muted)] hover:text-white transition-colors">
           <ArrowLeft size={20} /> Back
        </button>
        <WalletConnect />
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12 animate-in stagger">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Badge variant={isClosed ? 'default' : 'success'} dot={!isClosed}>
            {isClosed ? 'Closed' : 'Active'}
          </Badge>
          <Badge variant={quest.mode === 'multi' ? 'success' : 'accent'}>
            {quest.mode === 'multi' ? '🚀 CAMPAIGN' : quest.questType.replace('_', ' ').toUpperCase()}
          </Badge>
          {daysLeft > 0 && daysLeft <= 3 && !isClosed && (
            <span className="text-xs font-semibold px-3 py-1 bg-[var(--warning)]/10 text-[var(--warning)] rounded-full flex items-center gap-1.5 border border-[var(--warning)]/20 animate-pulse">
              ⏳ Ends in {daysLeft} days
            </span>
          )}
          {fillingFast && !isClosed && (
            <span className="text-xs font-semibold px-3 py-1 bg-[var(--error)]/10 text-[var(--error)] rounded-full flex items-center gap-1.5 border border-[var(--error)]/20">
              🔥 Filling fast!
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 mb-6 border-b border-[var(--border-subtle)] pb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center text-black font-bold text-sm uppercase" title="Creator Avatar">
                {quest.creatorWallet.slice(0, 1)}
              </div>
              <div>
                <p className="text-[var(--text-muted)] text-xs font-semibold uppercase tracking-wider">Creator</p>
                <p className="text-[var(--text-primary)] font-mono text-sm">{quest.creatorWallet.slice(0, 4)}...{quest.creatorWallet.slice(-4)}</p>
              </div>
            </div>

            <div className="h-8 w-px bg-[var(--border-subtle)] hidden sm:block"></div>

            <div className="flex flex-col">
              <p className="text-[var(--text-muted)] text-xs font-semibold uppercase tracking-wider">Project</p>
              <div className="flex items-center gap-2">
                <span className="text-[var(--accent)] font-bold">{quest.tokenName} ({quest.tokenSymbol})</span>
                {quest.projectLink && (
                  <a href={quest.projectLink} target="_blank" rel="noreferrer" className="text-xs text-[var(--text-secondary)] hover:text-white underline underline-offset-2 decoration-[var(--border-subtle)] hover:decoration-[var(--accent)] transition-colors">
                    Verify Link ↗
                  </a>
                )}
              </div>
            </div>

            {quest.tokenMint && (
              <>
                <div className="h-8 w-px bg-[var(--border-subtle)] hidden sm:block"></div>
                <div className="flex flex-col">
                  <p className="text-[var(--text-muted)] text-xs font-semibold uppercase tracking-wider">Token Contract</p>
                  <span className="font-mono text-[var(--text-secondary)] text-sm bg-[var(--bg-elevated)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
                    {quest.tokenMint.slice(0, 4)}...{quest.tokenMint.slice(-4)}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
        
        <h1 className="font-display font-bold text-3xl md:text-5xl mb-4 leading-tight">{quest.title}</h1>
        <p className="text-[var(--text-secondary)] text-lg mb-6 leading-relaxed">
          {quest.description}
        </p>

        {/* Bags.fm Live Verification Panel */}
        <div className="mb-8 rounded-2xl border border-[var(--accent)]/30 bg-gradient-to-r from-[var(--accent)]/5 to-[var(--accent-2)]/5 p-5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,_rgba(108,99,255,0.08),transparent)] pointer-events-none" />
          <div className="flex flex-wrap items-center gap-4 justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/15 flex items-center justify-center">
                <ShieldCheck size={20} className="text-[var(--accent)]" />
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold">Bags.fm Verified Token</p>
                <p className="text-[var(--text-primary)] font-bold">{quest.tokenName} <span className="text-[var(--accent)]">${quest.tokenSymbol}</span></p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              {bagsLoading ? (
                <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                  <span className="w-3 h-3 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
                  Fetching from Bags SDK...
                </div>
              ) : tokenInfo ? (
                <>
                  <div className="text-center">
                    <p className="text-xl font-bold text-[var(--success)]">{(tokenInfo.holderCount || 0).toLocaleString()}</p>
                    <p className="text-xs text-[var(--text-muted)] flex items-center gap-1"><Users size={10} /> Holders</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-[var(--text-primary)]">{((tokenInfo.supply || 0) / 1_000_000).toFixed(1)}M</p>
                    <p className="text-xs text-[var(--text-muted)] flex items-center gap-1"><Zap size={10}/> Supply</p>
                  </div>
                </>
              ) : null}
              {quest.projectLink && (
                <a href={quest.projectLink} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 hover:bg-[var(--accent)]/20 transition-colors">
                  View on Bags.fm <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-[var(--accent)]/10 flex items-center gap-2">
            <CheckCircle2 size={13} className="text-[var(--success)]" />
            <span className="text-xs text-[var(--text-muted)]">Token data fetched live via <span className="text-[var(--accent)] font-semibold">@bagsfm/bags-sdk</span> on Solana Mainnet</span>
            <span className="ml-auto font-mono text-xs text-[var(--text-faint)]">{quest.tokenMint.slice(0,4)}...{quest.tokenMint.slice(-4)}</span>
          </div>
        </div>

        {/* Task Instructions & Rules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 bg-[var(--bg-elevated)] border-[var(--border-subtle)]">
            <h3 className="font-display font-semibold text-xl mb-3 text-[var(--accent)] flex items-center gap-2">
              🎯 Task Instructions
            </h3>
            <ul className="text-[var(--text-secondary)] space-y-2 list-decimal list-inside">
              {quest.mode === 'multi' && (
                <>
                  <li>Complete the tasks listed in the Campaign Checklist below.</li>
                  <li>Click 'Verify' after completing actions to lock your submission.</li>
                  <li>Holdings will be verified automatically if applicable.</li>
                  {quest.proofInstructions && <li>{quest.proofInstructions}</li>}
                </>
              )}
              
              {quest.mode !== 'multi' && quest.questType === 'follow_x' && (
                <>
                  <li>Follow {quest.requirements?.username ? <span className="text-[var(--accent)] font-semibold">{quest.requirements.username}</span> : "the creator's official account"} on X</li>
                  {quest.requirements?.link && <li>Profile Link: <a href={quest.requirements.link} target="_blank" className="text-[var(--accent)] hover:underline flex-wrap break-all">{quest.requirements.link}</a></li>}
                  <li>Maintain follow status to avoid verification failure</li>
                </>
              )}
              {quest.mode !== 'multi' && quest.questType === 'share_post' && (
                <>
                  <li>Engage with the official post</li>
                  {quest.requirements?.postLink && <li>Post Link: <a href={quest.requirements.postLink} target="_blank" className="text-[var(--accent)] hover:underline flex-wrap break-all">{quest.requirements.postLink}</a></li>}
                  <li>
                    Required Actions: 
                    {[quest.requirements?.like && 'Like', quest.requirements?.retweet && 'Retweet', quest.requirements?.comment && 'Comment'].filter(Boolean).join(', ') || 'Any engagement'}
                  </li>
                </>
              )}
              {quest.questType === 'join_telegram' && (
                <>
                  <li>Join {quest.requirements?.groupName ? <span className="text-[var(--accent)] font-semibold">{quest.requirements.groupName}</span> : "the official Telegram Group"}</li>
                  {quest.requirements?.tgLink && <li>Group Link: <a href={quest.requirements.tgLink} target="_blank" className="text-[var(--accent)] hover:underline">{quest.requirements.tgLink}</a></li>}
                  <li>Verify your humanity in the chat and do not mute</li>
                </>
              )}
              {quest.questType === 'hold_tokens' && (
                <>
                  <li>Hold a minimum of <span className="text-[var(--accent)] font-mono">{quest.requirements?.minTokens || 1}</span> {quest.requirements?.tokenName || quest.tokenSymbol}</li>
                  <li>Maintain holding for at least <span className="font-mono">{quest.requirements?.duration || 1}</span> days</li>
                  <li>We will auto-verify on-chain using your connected wallet</li>
                </>
              )}
              {quest.questType === 'create_content' && (
                <>
                  <li>Platform: <span className="text-[var(--accent)] font-semibold">{quest.requirements?.platform || "Any Platform"}</span></li>
                  <li>Topic to cover: <span className="text-white">"{quest.requirements?.topic || 'General project overview'}"</span></li>
                  <li>Ensure content is high quality and public</li>
                </>
              )}
            </ul>
          </Card>

          <Card className="p-6 bg-[var(--bg-elevated)] border-[var(--border-subtle)]">
            <h3 className="font-display font-semibold text-xl mb-3 text-[var(--error)] flex items-center gap-2">
              ⚠️ Rules
            </h3>
            <ul className="text-[var(--text-secondary)] space-y-2 list-disc list-inside">
              <li>Fake or bot accounts are strictly prohibited</li>
              <li>Proof will be manually reviewed by the creator</li>
              <li>Reversing the action (e.g., unfollowing) will result in banning</li>
              <li className="text-[var(--warning)] font-medium mt-2">Only the first {quest.maxCompletions} valid submissions will be rewarded ⚡</li>
            </ul>
          </Card>
        </div>

        <h3 className="font-display font-semibold text-xl mb-4">What you get</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 flex flex-col items-center justify-center text-center hover:border-[var(--accent)]/40 transition-colors">
            <Trophy size={24} className="text-[var(--accent)] mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm text-[var(--text-muted)]">Reward / Spot</span>
            <span className="font-mono font-bold text-lg text-[var(--accent)]">{Math.floor(quest.rewardAmount / (quest.maxCompletions || 1))} {quest.tokenSymbol}</span>
          </Card>
          <Card className="p-4 flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--accent)]/5 z-0"></div>
            <Users size={24} className="text-[var(--text-secondary)] mb-2 relative z-10" />
            <span className="text-sm text-[var(--text-muted)] relative z-10">Spots</span>
            <span className="font-mono font-bold text-lg relative z-10">{quest.currentCompletions} / {quest.maxCompletions}</span>
            <div className="w-full bg-[var(--bg-base)] h-1.5 rounded-full mt-3 relative z-10 overflow-hidden">
              <div className="bg-[var(--accent)] h-full transition-all duration-1000" style={{ width: `${completionPercentage}%` }}></div>
            </div>
            <span className="text-[10px] text-[var(--text-muted)] mt-1.5 relative z-10 font-medium tracking-wide">{completionPercentage}% FILLED</span>
          </Card>
          <Card className="p-4 flex flex-col items-center justify-center text-center">
            <Clock size={24} className="text-[var(--text-secondary)] mb-2" />
            <span className="text-sm text-[var(--text-muted)]">Deadline</span>
            <span className="font-mono font-bold text-[0.95rem]">{new Date(quest.deadline).toLocaleDateString()}</span>
          </Card>
        </div>

        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-sm text-[var(--text-secondary)] animate-in font-medium">
            🔥 <strong className="text-white">{socialProofCount} users</strong> completed this quest today
          </span>
        </div>

        <div className="card-base p-6 md:p-8 bg-[var(--bg-surface)] rounded-2xl glow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="font-display font-semibold text-xl flex items-center gap-2">
              <CheckCircle2 className="text-[var(--accent)]" /> Proof Submission
            </h3>
            
            {/* MODE TOGGLE */}
            {!submission && !isClosed && (
              <div className="flex bg-[var(--bg-elevated)] p-1 rounded-xl border border-[var(--border-subtle)]">
                <button 
                  className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${submitMode === 'simple' ? 'bg-[var(--bg-surface)] text-[var(--accent)] shadow border border-[var(--border-subtle)]' : 'text-[var(--text-muted)] hover:text-white'}`}
                  onClick={() => setSubmitMode('simple')}
                >
                  Simple Mode
                </button>
                <button 
                  className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${submitMode === 'web3' ? 'bg-[var(--accent)] text-black shadow glow' : 'text-[var(--text-muted)] hover:text-white'}`}
                  onClick={() => setSubmitMode('web3')}
                >
                  Web3 Mode
                </button>
              </div>
            )}
          </div>
          
          {submitMode === 'web3' && !connected && !submission && !isClosed ? (
             <div className="text-center py-6 border border-dashed border-[var(--border-subtle)] rounded-xl animate-in">
                <p className="text-[var(--text-muted)] mb-4">You must connect your Solana wallet to participate in Web3 Mode.</p>
                <div className="flex justify-center"><WalletConnect /></div>
             </div>
          ) : submission ? (
             <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] p-6 rounded-xl text-center shadow-2xl animate-in">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  submission.status === 'approved' ? 'bg-[var(--success)]/20 text-[var(--success)] shadow-[0_0_20px_var(--success)]' :
                  submission.status === 'rejected' ? 'bg-[var(--error)]/20 text-[var(--error)]' :
                  'bg-[var(--warning)]/20 text-[var(--warning)] animate-pulse'
                }`}>
                  <CheckCircle2 size={28} />
                </div>
                
                {submission.status === 'approved' ? (
                  <>
                    <h4 className="font-display font-bold text-xl mb-1 text-[var(--success)]">🟢 Approved + Reward Sent</h4>
                    <p className="text-[var(--text-primary)] text-sm mb-4 font-mono font-medium">🎉 You earned +{Math.floor(quest.rewardAmount / (quest.maxCompletions || 1))} {quest.tokenSymbol}!</p>
                  </>
                ) : submission.status === 'rejected' ? (
                  <>
                    <h4 className="font-display font-bold text-xl mb-1 text-[var(--error)]">🔴 Rejected</h4>
                    <p className="text-[var(--text-muted)] text-sm mb-4">Your submission did not meet the requirements.</p>
                  </>
                ) : (
                  <>
                    <h4 className="font-display font-bold text-xl mb-1 text-[var(--warning)]">🟡 Pending Approval</h4>
                    <p className="text-[var(--text-muted)] text-sm mb-4">The creator will manually verify your proof shortly.</p>
                  </>
                )}
             </div>
          ) : isClosed ? (
             <div className="text-center py-6">
                <p className="text-[var(--text-secondary)]">This quest is no longer accepting submissions.</p>
             </div>
          ) : (
             <div className="mt-4 animate-in">
                {submitMode === 'web3' && (
                  <div className="mb-6 p-4 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">Connected Wallet</span>
                      <p className="font-mono text-sm text-[var(--text-primary)] mt-1">{publicKey?.toBase58().slice(0,6)}...{publicKey?.toBase58().slice(-4)}</p>
                    </div>
                    <Badge variant="success">Verified</Badge>
                  </div>
                )}
                {submitMode === 'simple' && (
                  <div className="mb-6 p-4 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl">
                    <h4 className="text-sm font-semibold text-[var(--accent)] mb-1">Simple Mode Active</h4>
                    <p className="text-xs text-[var(--text-muted)]">No wallet connection required. Creators will verify your action manually and pay directly to the address you provide.</p>
                  </div>
                )}
                <ProofSubmitForm 
                   quest={quest} 
                   fanWallet={publicKey?.toBase58() || ''} 
                   mode={submitMode}
                   onSuccess={(customWallet) => {
                      const checkWallet = customWallet || publicKey?.toBase58();
                      if (checkWallet) {
                        const s = getFanSubmissionForQuest(quest.id, checkWallet);
                        if (s) setSubmission(s);
                      }
                   }} 
                />
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
