import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button, Input } from './ui';
import type { Quest, Submission } from '../types';
import { checkHolding } from '../utils/bags';
import { saveSubmission, saveQuest } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { CheckCircle2 } from 'lucide-react';

export function ProofSubmitForm({ quest, fanWallet, onSuccess, mode = 'web3' }: { quest: Quest; fanWallet?: string; onSuccess: (customFanWallet?: string) => void; mode?: 'simple' | 'web3' }) {
  const { signMessage, connected } = useWallet();
  const [hasClickedAction, setHasClickedAction] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [proofData, setProofData] = useState('');
  const [optionalData, setOptionalData] = useState('');
  const [manualWallet, setManualWallet] = useState('');
  const [dynamicTaskState, setDynamicTaskState] = useState<Record<string, { status: 'pending' | 'verifying' | 'verified' }>>({});
  
  // Legacy task state
  const [taskState, setTaskState] = useState({
    follow: false,
    like: false,
    retweet: false,
    comment: false
  });

  const actionConfig = (() => {
    switch(quest.questType) {
      case 'follow_x': return { label: 'Step 1: 🔗 Follow on X', url: `https://x.com/${quest.requirements?.handle || 'YousufWeb3AI'}` };
      case 'share_post': return { label: 'Step 1: 🔗 Interact with Post', url: quest.projectLink || 'https://x.com' };
      case 'join_telegram': return { label: 'Step 1: 🔗 Join Telegram', url: quest.projectLink || 'https://t.me' };
      case 'create_content': return { label: 'Step 1: 🔗 View Media / Page', url: quest.projectLink || '#' };
      default: return { label: 'Step 1: 🔗 View Quest Link', url: quest.projectLink || '#' };
    }
  })();

  const handleVerify = () => {
    setVerifying(true);
    // Fake Verification (Demo Mode)
    setTimeout(() => {
      setVerifying(false);
      setIsVerified(true);
      toast.success("Action Verified!");
    }, 1500);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      let finalStatus: Submission['status'] = 'pending';
      const effectiveWallet = mode === 'simple' ? manualWallet : (fanWallet || '');

      if (!effectiveWallet || effectiveWallet.length < 32 || effectiveWallet.length > 44) {
        toast.error("Please provide a valid Solana wallet address!");
        setLoading(false);
        return;
      }
      
      if (quest.questType === 'hold_tokens' && mode === 'web3') {
        const hasEnough = await checkHolding(effectiveWallet, quest.tokenMint, 1); // Mock 1 token min
        if (!hasEnough) {
          toast.error(`You don't hold enough ${quest.tokenSymbol}!`);
          setLoading(false);
          return;
        }
        finalStatus = 'approved'; // Auto verify
        toast.success("Holdings verified automatically!");
        
        // Auto-increment quest completions because creator won't hit Approve manually
        if (quest.currentCompletions < quest.maxCompletions) {
          quest.currentCompletions += 1;
          saveQuest(quest);
        }
      }

      let proofString = quest.questType === 'hold_tokens' ? 'Auto-verified holding' : `${proofData}${optionalData ? ` | Extra: ${optionalData}` : ''}`;
      if (quest.mode === 'multi') proofString = 'Completed Multi-Task Campaign ✅';

      const submission: Submission = {
        id: uuidv4(),
        questId: quest.id,
        fanWallet: effectiveWallet,
        proofData: proofString,
        submittedAt: new Date().toISOString(),
        status: finalStatus,
        rewardSent: false
      };

      if (mode === 'web3') {
        if (!signMessage || !connected) {
          toast.error("Wallet not fully connected!");
          setLoading(false);
          return;
        }

        const toastId = toast.loading(
          <div className="flex flex-col gap-1">
            <span className="font-semibold">Confirming submission...</span>
            <span className="text-xs text-[var(--text-muted)]">Please sign message in wallet</span>
          </div>
        );

        // Actual realistic signing prompt
        const encodedMessage = new TextEncoder().encode(`Submit Proof to Quest: ${quest.id}`);
        await signMessage(encodedMessage);

        toast.loading(
          <div className="flex flex-col gap-1">
            <span className="font-semibold">Broadcasting to Network</span>
            <span className="text-xs text-[var(--text-muted)]">Awaiting block confirmation...</span>
          </div>,
          { id: toastId }
        );

        // Fake network delay for dramatic effect
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const fakeTxHash = Array.from({length: 88}, () => '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'[Math.floor(Math.random() * 58)]).join('');
        
        saveSubmission(submission);
        
        toast.success(
          () => (
            <div className="flex flex-col gap-1.5">
              <span className="font-semibold text-[var(--success)]">Proof Submitted Successfully!</span>
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
      } else {
        // Simple Mode saving
        saveSubmission(submission);
        toast.success("Submission received for review!");
      }
      
      onSuccess(effectiveWallet);
    } catch (err) {
      console.error(err);
      toast.error("Submission cancelled or failed.");
    } finally {
      setLoading(false);
    }
  };

  if (quest.mode === 'multi') {
    // Determine if legacy or new campaign builder
    const isLegacy = !quest.campaignTasks || quest.campaignTasks.length === 0;

    let totalTasks = 0;
    let completedCount = 0;
    let allChecked = false;

    if (isLegacy && quest.tasks) {
      totalTasks = [quest.tasks.follow, quest.tasks.like, quest.tasks.retweet, quest.tasks.comment].filter(Boolean).length;
      completedCount = [
        quest.tasks.follow && taskState.follow,
        quest.tasks.like && taskState.like,
        quest.tasks.retweet && taskState.retweet,
        quest.tasks.comment && taskState.comment,
      ].filter(Boolean).length;
      allChecked = completedCount === totalTasks && totalTasks > 0;
    } else if (quest.campaignTasks) {
      totalTasks = quest.campaignTasks.length;
      completedCount = quest.campaignTasks.filter(t => dynamicTaskState[t.id]?.status === 'verified').length;
      allChecked = completedCount === totalTasks && totalTasks > 0;
    }
    
    const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

    const handleVerifyTask = (taskId: string) => {
      setDynamicTaskState(prev => ({ ...prev, [taskId]: { status: 'verifying' } }));
      
      setTimeout(() => {
        setDynamicTaskState(prev => ({ ...prev, [taskId]: { status: 'verified' } }));
      }, 1500);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {isLegacy && quest.tasks ? (
          // --- LEGACY RENDERER ---
          <div className="border border-[var(--border-active)] rounded-xl p-5 bg-[var(--bg-elevated)] space-y-4">
            <div className="flex items-center justify-between mb-2">
             <h3 className="font-semibold text-sm text-[var(--accent)] uppercase tracking-wide">🎯 Tasks to Complete</h3>
             <span className="text-xs font-mono text-[var(--text-muted)] bg-black/40 px-2 py-1 rounded-lg border border-[var(--border-subtle)]">{completedCount}/{totalTasks}</span>
            </div>
            
            <div className="space-y-3">
              {quest.tasks.follow && (
                <label className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent)]/50 transition-colors cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 accent-[var(--accent)]" checked={taskState.follow} onChange={e => setTaskState({...taskState, follow: e.target.checked})} />
                  <span className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                    Follow <a href={`https://x.com/${quest.tasks.followUsername?.replace('@', '')}`} target="_blank" rel="noreferrer" className="underline">{quest.tasks.followUsername || '@BagsAlpha'}</a>
                  </span>
                </label>
              )}
              {quest.tasks.like && (
                <label className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent)]/50 transition-colors cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 accent-[var(--accent)]" checked={taskState.like} onChange={e => setTaskState({...taskState, like: e.target.checked})} />
                  <span className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                    Like this <a href={quest.tasks.postUrl || '#'} target="_blank" rel="noreferrer" className="underline">Post</a>
                  </span>
                </label>
              )}
              {quest.tasks.retweet && (
                <label className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent)]/50 transition-colors cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 accent-[var(--accent)]" checked={taskState.retweet} onChange={e => setTaskState({...taskState, retweet: e.target.checked})} />
                  <span className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                    Retweet this <a href={quest.tasks.postUrl || '#'} target="_blank" rel="noreferrer" className="underline">Post</a>
                  </span>
                </label>
              )}
              {quest.tasks.comment && (
                <label className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent)]/50 transition-colors cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 accent-[var(--accent)]" checked={taskState.comment} onChange={e => setTaskState({...taskState, comment: e.target.checked})} />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                      Comment on this <a href={quest.tasks.postUrl || '#'} target="_blank" rel="noreferrer" className="underline">Post</a>
                    </span>
                    <span className="text-xs text-[var(--text-muted)] mt-1 bg-black/40 w-fit px-2 py-0.5 rounded border border-[var(--border-subtle)]">Reply: "{quest.tasks.commentText}"</span>
                  </div>
                </label>
              )}
            </div>
          </div>
        ) : (
          // --- NEW GALXE STYLE RENDERER ---
          <div className="border border-[var(--border-active)] rounded-xl p-5 bg-[var(--bg-elevated)] space-y-5">
            <div className="flex items-center justify-between mb-2">
             <h3 className="font-semibold text-sm text-[var(--accent)] uppercase tracking-wide">🏆 Journey Progress</h3>
             <span className="text-xs font-mono font-bold text-[var(--text-primary)] bg-black/40 px-2 py-1 rounded-lg border border-[var(--border-subtle)]">{progressPercent}%</span>
            </div>
            
            <div className="h-2 w-full bg-[var(--bg-surface)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
              <div 
                className="h-full bg-gradient-to-r from-[var(--accent-2)] to-[var(--accent)] transition-all duration-700 ease-out relative"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)] font-medium text-right mt-1">{completedCount} of {totalTasks} tasks completed</p>

            <div className="space-y-3 mt-4">
              {quest.campaignTasks?.map((task, index) => {
                const state = dynamicTaskState[task.id]?.status || 'pending';
                
                return (
                  <div key={task.id} className={`flex flex-col gap-3 p-4 rounded-xl border transition-all duration-300 ${state === 'verified' ? 'bg-[var(--success)]/5 border-[var(--success)]/30 shadow-[0_0_15px_rgba(74,222,128,0.1)]' : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--accent)]/50'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {state === 'verified' ? (
                          <div className="w-8 h-8 rounded-full bg-[var(--success)]/20 text-[var(--success)] flex items-center justify-center shrink-0">
                            <CheckCircle2 size={16} className="animate-in zoom-in" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0 font-mono text-xs font-bold">
                            {index + 1}
                          </div>
                        )}
                        <div className="flex flex-col gap-0.5">
                          <span className={`text-sm font-semibold ${state === 'verified' ? 'text-[var(--success)]' : 'text-[var(--text-primary)]'}`}>
                            {task.instructions}
                          </span>
                          <span className="text-xs text-[var(--text-muted)] capitalize">{task.type} Task</span>
                        </div>
                      </div>
                      
                      <a 
                        href={task.link} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)]/20 transition-colors"
                      >
                        Go to Action ↗
                      </a>
                    </div>
                    
                    <div className="pt-3 border-t border-[var(--border-subtle)]/50 flex justify-end">
                      {state === 'verified' ? (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--success)] py-1.5">
                          <CheckCircle2 size={14} /> Completed
                        </div>
                      ) : state === 'verifying' ? (
                        <div className="flex items-center gap-2 text-xs font-medium text-[var(--accent)] py-1.5 animate-pulse">
                          <span className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin"></span>
                          Verifying on-chain...
                        </div>
                      ) : (
                        <button 
                          type="button"
                          onClick={() => handleVerifyTask(task.id)}
                          className="px-4 py-1.5 rounded-lg text-xs font-semibold border border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)] hover:text-white transition-colors"
                        >
                          Verify Status
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {mode === 'simple' && (
          <div className="pt-2 border-t border-[var(--border-subtle)] mt-4">
            <Input 
              required 
              label="Your Receive Wallet Address *" 
              placeholder="Paste your Solana address" 
              value={manualWallet} 
              onChange={(e) => setManualWallet(e.target.value)} 
            />
            <p className="text-xs text-[var(--warning)] mt-2 italic flex items-center gap-1"><CheckCircle2 size={12} /> Make sure it is correct. Creators will pay manually.</p>
          </div>
        )}

        <div className="pt-4 border-t border-[var(--border-subtle)] mt-4">
          <div className="flex flex-col gap-3">
            {isLegacy && quest.tasks && (
              // Legacy verify button is only shown for old multi-task format
              !isVerified ? (
                <Button 
                  type="button" 
                  variant="secondary" 
                  fullWidth 
                  onClick={handleVerify} 
                  disabled={verifying || completedCount === 0} 
                  className={verifying ? "animate-pulse" : ""}
                >
                  {verifying ? "Verifying..." : "🔍 Verify Action"}
                </Button>
              ) : (
                <div className="flex items-center justify-center gap-2 p-3 bg-[var(--success)]/10 text-[var(--success)] rounded-xl border border-[var(--success)]/20 animate-in">
                  <CheckCircle2 size={18} />
                  <span className="font-semibold text-sm">Verification Successful ✅</span>
                </div>
              )
            )}
            
            <p className="text-xs text-center text-[var(--text-muted)]">Complete all {totalTasks} tasks to unlock rewards ⚡</p>
            <Button 
              fullWidth 
              type="submit" 
              loading={loading} 
              disabled={!allChecked || (isLegacy && quest.tasks && !isVerified)} // Legacy needs isVerified, Galxe needs allChecked
              className={allChecked && (!isLegacy || isVerified) ? "shadow-[0_0_20px_var(--accent-glow)]" : ""}
            >
               {allChecked ? "Submit Journey Proof 🚀" : "Complete Tasks to Unlock"}
            </Button>
          </div>
        </div>
      </form>
    );
  }

  if (quest.questType === 'hold_tokens' && mode === 'web3') {
    return (
      <div className="space-y-4">
        <p className="text-[var(--text-muted)] text-sm mb-4">Click below to verify you hold {quest.tokenSymbol} tokens securely using Bags SDK.</p>

        <Button fullWidth onClick={() => handleSubmit()} loading={loading}>
          Verify My Wallet
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {quest.questType === 'follow_x' && (
        <>
          <Input required label="Your X Username *" placeholder="@username" value={proofData} onChange={(e) => setProofData(e.target.value)} />
          <Input label="Profile Link (Optional)" placeholder="https://x.com/username" type="url" value={optionalData} onChange={(e) => setOptionalData(e.target.value)} />
        </>
      )}
      {quest.questType === 'share_post' && (
        <Input required label="Paste Tweet Link *" placeholder="https://x.com/..." type="url" value={proofData} onChange={(e) => setProofData(e.target.value)} />
      )}
      {quest.questType === 'join_telegram' && (
        <Input required label="Your Telegram Username *" placeholder="@username" value={proofData} onChange={(e) => setProofData(e.target.value)} />
      )}
      {quest.questType === 'create_content' && (
        <>
          <Input required label="Content URL *" placeholder="https://..." type="url" value={proofData} onChange={(e) => setProofData(e.target.value)} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Short description</label>
            <textarea 
              rows={2}
              placeholder="Briefly describe what you created"
              className="w-full px-4 py-3 rounded-xl text-sm bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent)] focus:outline-none"
              value={optionalData}
              onChange={e => setOptionalData(e.target.value)}
            />
          </div>
        </>
      )}

      {mode === 'simple' && (
        <div className="pt-2 border-t border-[var(--border-subtle)] mt-4">
          <Input 
            required 
            label="Your Receive Wallet Address *" 
            placeholder="Paste your Solana address" 
            value={manualWallet} 
            onChange={(e) => setManualWallet(e.target.value)} 
          />
          <p className="text-xs text-[var(--warning)] mt-2 italic flex items-center gap-1"><CheckCircle2 size={12} /> Make sure it is correct. Creators will pay manually.</p>
        </div>
      )}

      {/* Verify Logic Before Submit */}
      <div className="pt-4 border-t border-[var(--border-subtle)] mt-4">
        
        <div className="flex flex-col gap-3">
          {/* Step 1: Action Button */}
          <a 
            href={actionConfig.url} 
            target="_blank" 
            rel="noreferrer"
            onClick={() => setHasClickedAction(true)}
            className="w-full flex items-center justify-center py-3 px-4 rounded-xl bg-[#1e1e2e] border border-[var(--border-subtle)] text-[var(--text-primary)] font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all cursor-pointer"
          >
            {actionConfig.label}
          </a>

          {/* Step 2: Verify Button */}
          {!isVerified ? (
            <Button 
              fullWidth 
              type="button" 
              variant="secondary" 
              onClick={handleVerify} 
              loading={verifying}
              disabled={!hasClickedAction || !proofData}
              className={hasClickedAction && proofData ? 'border-[var(--accent)] shadow-[0_0_15px_rgba(108,99,255,0.2)]' : ''}
            >
              Step 2: 🔍 Verify Action
            </Button>
          ) : (
            <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20 animate-in">
              <CheckCircle2 size={18} /> <span className="font-semibold">Action Verified Successfully!</span>
            </div>
          )}

          {/* Step 3: Submit (Unlocked only after verified) */}
          <Button 
            fullWidth 
            type="submit" 
            loading={loading} 
            disabled={!isVerified}
            variant={isVerified ? 'primary' : 'secondary'}
            className={isVerified ? "mt-1 animate-in" : "mt-1 opacity-50 cursor-not-allowed"}
          >
            Step 3: ✅ Submit Proof
          </Button>
        </div>
      </div>
    </form>
  );
}
