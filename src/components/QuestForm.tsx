import { useState } from 'react';
import { Card, Button, Input } from './ui';
import { AIQuestSuggest } from './AIQuestSuggest';
import type { QuestIdea, Quest, QuestType } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { saveQuest } from '../utils/storage';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

interface QuestFormProps {
  creatorWallet: string;
  defaultTokenDetails?: {
    mint: string;
    name: string;
    symbol: string;
    projectLink?: string;
  };
  holderCount: number;
  editQuest?: Quest;
  onClose: () => void;
  onSuccess: () => void;
}

export function QuestForm({ creatorWallet, defaultTokenDetails, holderCount, editQuest, onClose, onSuccess }: QuestFormProps) {
  const [tokenData, setTokenData] = useState({
    name: editQuest?.tokenName || defaultTokenDetails?.name || '',
    symbol: editQuest?.tokenSymbol || defaultTokenDetails?.symbol || '',
    mint: editQuest?.tokenMint || defaultTokenDetails?.mint || '',
    projectLink: editQuest?.projectLink || defaultTokenDetails?.projectLink || ''
  });

  const [formData, setFormData] = useState({
    title: editQuest?.title || '',
    description: editQuest?.description || '',
    questType: editQuest?.questType || 'follow_x' as QuestType,
    mode: editQuest?.mode || 'single',
    tasks: editQuest?.tasks || { follow: false, like: false, retweet: false, comment: false, postUrl: '', followUsername: '', commentText: '' },
    rewardAmount: editQuest?.rewardAmount || 0,
    maxCompletions: editQuest?.maxCompletions || 100,
    deadline: editQuest?.deadline || '',
    proofInstructions: editQuest?.proofInstructions || '',
    requirements: editQuest?.requirements || ({} as Record<string, any>)
  });

  const handleTaskChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      tasks: { ...prev.tasks, [field]: value }
    }));
  };

  const handleAISuggestion = (idea: QuestIdea) => {
    let defaultReqs: Record<string, any> = {};
    if (idea.questType === 'hold_tokens') {
      defaultReqs = { tokenName: tokenData.symbol, minTokens: 1, duration: 7 };
    } else if (idea.questType === 'join_telegram') {
      defaultReqs = { tgLink: 'https://t.me/example', groupName: `${tokenData.name} Community` };
    } else if (idea.questType === 'share_post') {
      defaultReqs = { postLink: 'https://x.com/...', like: true, retweet: true, comment: false };
    } else if (idea.questType === 'create_content') {
      defaultReqs = { platform: 'X', topic: `Why ${tokenData.symbol} is the future` };
    } else if (idea.questType === 'follow_x') {
      defaultReqs = { link: 'https://x.com/example', username: '@example' };
    }

    setFormData(prev => ({
      ...prev,
      title: idea.title,
      description: idea.description,
      questType: idea.questType,
      rewardAmount: idea.suggestedReward,
      maxCompletions: idea.maxCompletions,
      requirements: defaultReqs
    }));
  };

  const handleRequirementChange = (key: string, value: any) => {
    setFormData(prev => {
      const newReqs = { ...prev.requirements, [key]: value };
      
      // Auto-description bonus logic
      let autoDesc = prev.description;
      if (prev.questType === 'follow_x' && key === 'username') {
        autoDesc = `Follow ${value || 'our account'} on X and stay updated with latest alpha drops.`;
      } else if (prev.questType === 'join_telegram' && key === 'groupName') {
        autoDesc = `Join the official ${value || 'Telegram'} community to participate in exclusive chats.`;
      } else if (prev.questType === 'hold_tokens' && key === 'minTokens') {
        autoDesc = `Hold a minimum of ${value || '1'} ${tokenData.symbol} to prove you are a true believer!`;
      }

      return {
        ...prev,
        requirements: newReqs,
        description: prev.description === '' || prev.description.startsWith('Follow @') || prev.description.startsWith('Join the') || prev.description.startsWith('Hold a') ? autoDesc : prev.description
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newQuest: Quest = {
      id: editQuest ? editQuest.id : uuidv4(),
      creatorWallet,
      tokenMint: tokenData.mint,
      tokenName: tokenData.name,
      tokenSymbol: tokenData.symbol,
      projectLink: tokenData.projectLink || undefined,
      ...formData,
      currentCompletions: editQuest ? editQuest.currentCompletions : 0,
      createdAt: editQuest ? editQuest.createdAt : new Date().toISOString(),
      isActive: editQuest ? editQuest.isActive : true,
    };
    saveQuest(newQuest);
    toast.success(editQuest ? "Quest updated successfully!" : "Quest created successfully!");
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto py-10 custom-scrollbar">
      <Card className="w-full max-w-lg relative bg-[var(--bg-elevated)] shrink-0 my-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] z-10">
          <X size={20} />
        </button>
        
        <h2 className="text-2xl font-display font-semibold mb-6">{editQuest ? "Edit Quest" : "Create New Quest"}</h2>
        
        {!editQuest && (
          <div className="mb-6">
            <AIQuestSuggest 
              tokenName={tokenData.name || 'My Token'} 
              tokenSymbol={tokenData.symbol || 'TKN'} 
              holderCount={holderCount} 
              onSelect={handleAISuggestion} 
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] space-y-4 mb-6">
            <h3 className="font-semibold text-sm text-[var(--accent)] mb-2 uppercase tracking-wide">Project Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Token Name *" required placeholder="e.g. Alpha Coin" value={tokenData.name} onChange={e => setTokenData({...tokenData, name: e.target.value})} />
              <Input label="Token Symbol *" required placeholder="e.g. ALPHA" value={tokenData.symbol} onChange={e => setTokenData({...tokenData, symbol: e.target.value})} />
              <Input label="Contract Address *" required placeholder="Solana Address..." value={tokenData.mint} onChange={e => setTokenData({...tokenData, mint: e.target.value})} />
              <Input label="Bags.fm Profile Link" placeholder="https://bags.fm/..." type="url" value={tokenData.projectLink} onChange={e => setTokenData({...tokenData, projectLink: e.target.value})} />
            </div>
          </div>

          <div className="mb-4 bg-[var(--bg-elevated)] p-4 rounded-xl border border-[var(--border-subtle)]">
            <label className="text-sm font-medium text-[var(--accent)] uppercase tracking-wide block mb-3">Quest Mode</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="mode" className="accent-[var(--accent)] cursor-pointer" checked={formData.mode === 'single'} onChange={() => setFormData({...formData, mode: 'single'})} />
                <span className={`text-sm ${formData.mode === 'single' ? 'text-white font-medium' : 'text-[var(--text-muted)]'}`}>Single Task</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="mode" className="accent-[var(--accent)] cursor-pointer" checked={formData.mode === 'multi'} onChange={() => setFormData({...formData, mode: 'multi'})} />
                <span className={`text-sm ${formData.mode === 'multi' ? 'font-semibold text-[var(--accent)] glow' : 'text-[var(--text-muted)]'}`}>Multi-Task Campaign 🚀</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {formData.mode === 'single' ? (
              <>
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-sm font-medium text-[var(--text-secondary)]">Quest Type</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl text-sm bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent)] focus:outline-none"
                    value={formData.questType}
                    onChange={e => setFormData({...formData, questType: e.target.value as QuestType, requirements: {}})}
                  >
                    <option value="follow_x">Follow on X</option>
                    <option value="hold_tokens">Hold Tokens (Auto-verify)</option>
                    <option value="share_post">Share Post</option>
                    <option value="join_telegram">Join Telegram</option>
                    <option value="create_content">Create Content</option>
                  </select>
                </div>
                
                {/* Dynamic Fields Based on Quest Type */}
                {formData.questType === 'follow_x' && (
                  <>
                    <div className="col-span-2">
                      <Input label="X Account Link" required placeholder="https://x.com/bagsalpha" value={formData.requirements.link || ''} onChange={e => handleRequirementChange('link', e.target.value)} />
                    </div>
                    <div className="col-span-2">
                      <Input label="Username to follow" required placeholder="@bagsalpha" value={formData.requirements.username || ''} onChange={e => handleRequirementChange('username', e.target.value)} />
                    </div>
                  </>
                )}
                
                {formData.questType === 'share_post' && (
                  <>
                    <div className="col-span-2">
                      <Input label="Post Link" required placeholder="https://x.com/.../tweet" value={formData.requirements.postLink || ''} onChange={e => handleRequirementChange('postLink', e.target.value)} />
                    </div>
                    <div className="col-span-2 flex gap-4">
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={formData.requirements.like} onChange={e => handleRequirementChange('like', e.target.checked)} /> Like</label>
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={formData.requirements.retweet} onChange={e => handleRequirementChange('retweet', e.target.checked)} /> Retweet</label>
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={formData.requirements.comment} onChange={e => handleRequirementChange('comment', e.target.checked)} /> Comment</label>
                    </div>
                  </>
                )}

                {formData.questType === 'join_telegram' && (
                  <>
                    <div className="col-span-2">
                      <Input label="Telegram Group Link" required placeholder="https://t.me/bagsalpha" value={formData.requirements.tgLink || ''} onChange={e => handleRequirementChange('tgLink', e.target.value)} />
                    </div>
                    <div className="col-span-2">
                      <Input label="Group Name" required placeholder="Bags Alpha Community" value={formData.requirements.groupName || ''} onChange={e => handleRequirementChange('groupName', e.target.value)} />
                    </div>
                  </>
                )}

                {formData.questType === 'hold_tokens' && (
                  <>
                    <div className="col-span-2">
                      <Input label="Token Name" required value={formData.requirements.tokenName || tokenData.name} onChange={e => handleRequirementChange('tokenName', e.target.value)} />
                    </div>
                    <Input label="Minimum Tokens to Hold" type="number" required value={formData.requirements.minTokens || ''} onChange={e => handleRequirementChange('minTokens', Number(e.target.value))} />
                    <Input label="Holding Duration (days)" type="number" required value={formData.requirements.duration || ''} onChange={e => handleRequirementChange('duration', Number(e.target.value))} />
                  </>
                )}

                {formData.questType === 'create_content' && (
                  <>
                    <div className="col-span-2 flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-[var(--text-secondary)]">Content Platform</label>
                      <select className="w-full px-4 py-3 rounded-xl text-sm bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent)] focus:outline-none" value={formData.requirements.platform || 'X'} onChange={e => handleRequirementChange('platform', e.target.value)}>
                        <option value="X">X (Twitter)</option>
                        <option value="YouTube">YouTube</option>
                        <option value="Instagram">Instagram</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <Input label="Content Topic" required placeholder="Why Bags is the future..." value={formData.requirements.topic || ''} onChange={e => handleRequirementChange('topic', e.target.value)} />
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="col-span-2 border border-[var(--border-active)] rounded-xl p-5 bg-[var(--bg-elevated)] space-y-4">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Tasks to Complete</h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-[var(--accent)] w-4 h-4 cursor-pointer" checked={formData.tasks.follow} onChange={e => handleTaskChange('follow', e.target.checked)} /> Follow on X</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-[var(--accent)] w-4 h-4 cursor-pointer" checked={formData.tasks.like} onChange={e => handleTaskChange('like', e.target.checked)} /> Like Post</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-[var(--accent)] w-4 h-4 cursor-pointer" checked={formData.tasks.retweet} onChange={e => handleTaskChange('retweet', e.target.checked)} /> Retweet</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-[var(--accent)] w-4 h-4 cursor-pointer" checked={formData.tasks.comment} onChange={e => handleTaskChange('comment', e.target.checked)} /> Comment</label>
                </div>

                {formData.tasks.follow && (
                  <div className="pt-3 border-t border-[var(--border-subtle)]">
                    <Input label="X Username to Follow" required placeholder="@username" value={formData.tasks.followUsername} onChange={e => handleTaskChange('followUsername', e.target.value)} />
                  </div>
                )}
                
                {(formData.tasks.like || formData.tasks.retweet || formData.tasks.comment) && (
                  <div className="pt-3 border-t border-[var(--border-subtle)] space-y-4">
                    <Input label="X Post URL" required placeholder="https://x.com/..." value={formData.tasks.postUrl} onChange={e => handleTaskChange('postUrl', e.target.value)} />
                    {formData.tasks.comment && (
                      <Input label="Comment Instruction text" required placeholder="Comment GM or LFG" value={formData.tasks.commentText} onChange={e => handleTaskChange('commentText', e.target.value)} />
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <Input 
            label="Quest Title" 
            required 
            value={formData.title} 
            onChange={e => setFormData({...formData, title: e.target.value})} 
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Description</label>
            <textarea 
              required
              rows={3}
              className="w-full px-4 py-3 rounded-xl text-sm bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent)] focus:outline-none"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label={`Reward (${tokenData.symbol})`} 
              type="number" 
              required 
              min="0"
              value={formData.rewardAmount} 
              onChange={e => setFormData({...formData, rewardAmount: Number(e.target.value)})} 
            />
            <Input 
              label="Max Winners" 
              type="number" 
              required 
              min="1"
              value={formData.maxCompletions} 
              onChange={e => setFormData({...formData, maxCompletions: Number(e.target.value)})} 
            />
          </div>

          <Input 
            label="Deadline" 
            type="datetime-local" 
            required 
            value={formData.deadline} 
            onChange={e => setFormData({...formData, deadline: e.target.value})} 
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-secondary)]">What users need to submit *</label>
            <textarea 
              required
              rows={2}
              placeholder="e.g., Submit your X username..."
              className="w-full px-4 py-3 rounded-xl text-sm bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent)] focus:outline-none"
              value={formData.proofInstructions}
              onChange={e => setFormData({...formData, proofInstructions: e.target.value})}
            />
          </div>

          <Button type="submit" fullWidth className="mt-6">{editQuest ? "Update Quest" : "Create Quest"}</Button>
        </form>
      </Card>
    </div>
  );
}
