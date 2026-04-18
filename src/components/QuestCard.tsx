import { Card, Badge } from './ui';
import type { Quest } from '../types';
import { useNavigate } from 'react-router-dom';
import { Clock, Trophy, Users, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function QuestCard({ quest, isCreator = false, onDelete, onToggleActive, onEdit }: { quest: Quest; isCreator?: boolean; onDelete?: (id: string, e: React.MouseEvent) => void; onToggleActive?: (id: string, e: React.MouseEvent) => void; onEdit?: (id: string, e: React.MouseEvent) => void }) {
  const navigate = useNavigate();

  const isExpired = new Date(quest.deadline) < new Date();
  const isFull = quest.currentCompletions >= quest.maxCompletions;
  const status = !quest.isActive ? 'Inactive' : isExpired ? 'Expired' : isFull ? 'Filled' : 'Active';

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/quest/${quest.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Quest link copied! Share with your fans.");
  };

  return (
    <Card 
      onClick={() => !isCreator && navigate(`/quest/${quest.id}`)}
      className={`animate-up stagger ${!quest.isActive || isExpired || isFull ? 'opacity-60 grayscale' : ''} ${isCreator ? 'cursor-default transition-all duration-300' : ''}`}
      glow={quest.isActive && !isExpired && !isFull}
      footer={isCreator && (
        <div className="flex items-center justify-between gap-2 mt-2">
          <div className="flex gap-2">
            <button onClick={(e) => onEdit?.(quest.id, e)} className="text-xs font-medium text-[var(--accent)] hover:underline border border-[var(--bg-elevated)] bg-[var(--bg-elevated)] px-3 py-1.5 rounded-lg">Edit</button>
            <button onClick={handleShare} className="text-xs font-medium text-[var(--text-primary)] hover:text-[var(--accent)] border border-[var(--border-subtle)] px-3 py-1.5 rounded-lg flex items-center gap-1"><Share2 size={12}/> Share</button>
          </div>
          <div className="flex gap-2">
            <button onClick={(e) => onToggleActive?.(quest.id, e)} className="text-xs font-medium text-[var(--warning)] hover:underline border border-[var(--border-subtle)] px-3 py-1.5 rounded-lg">{quest.isActive ? 'Deactivate' : 'Activate'}</button>
            <button onClick={(e) => onDelete?.(quest.id, e)} className="text-xs font-medium text-[var(--error)] hover:underline border border-[var(--border-subtle)] px-3 py-1.5 rounded-lg">Delete</button>
          </div>
        </div>
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <Badge variant={status === 'Active' ? 'success' : status === 'Expired' ? 'error' : 'default'} dot={status === 'Active'}>
          {status === 'Expired' ? '❌ Expired' : status}
        </Badge>
        <span className="text-xs font-mono px-2 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded-lg">
          {quest.mode === 'multi' ? '🚀 CAMPAIGN' : quest.questType.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      <h3 className="font-display text-xl font-semibold mb-2">{quest.title}</h3>
      <p className="text-[var(--text-muted)] text-sm mb-6 line-clamp-2">{quest.description}</p>

      <div className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <Trophy size={16} /> Reward / Spot
          </span>
          <span className="font-mono text-[var(--accent)] font-semibold">
            {Math.floor(quest.rewardAmount / (quest.maxCompletions || 1))} {quest.tokenSymbol}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <Users size={16} /> Spots
          </span>
          <span className="font-mono text-[var(--text-primary)]">
            {quest.currentCompletions} / {quest.maxCompletions}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <Clock size={16} /> Deadline
          </span>
          <span className="font-mono text-[var(--text-primary)]">
            {new Date(quest.deadline).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Card>
  );
}
