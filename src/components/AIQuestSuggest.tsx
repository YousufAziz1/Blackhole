import { useState } from 'react';
import { Button, PulseDots } from './ui';
import { generateQuestIdeas } from '../utils/gemini';
import type { QuestIdea } from '../types';
import toast from 'react-hot-toast';
import { Sparkles } from 'lucide-react';

export function AIQuestSuggest({ tokenName, tokenSymbol, holderCount, onSelect }: { 
  tokenName: string; tokenSymbol: string; holderCount: number; onSelect: (idea: QuestIdea) => void 
}) {
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<QuestIdea[]>([]);

  const generate = async () => {
    setLoading(true);
    try {
      const result = await generateQuestIdeas(tokenName, tokenSymbol, holderCount);
      setIdeas(result);
      toast.success("AI generated quest ideas!");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate ideas");
    } finally {
      setLoading(false);
    }
  };

  if (ideas.length > 0) {
    return (
      <div className="space-y-4 animate-in">
        <h4 className="font-semibold text-[var(--accent)] flex items-center gap-2">
          <Sparkles size={16} /> AI Suggestions
        </h4>
        <div className="max-h-[340px] overflow-y-auto pr-2 custom-scrollbar mb-4">
          <div className="grid grid-cols-1 gap-4 pb-2">
            {ideas.map((idea, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent)]/50 transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-[var(--accent)]/20 transition-colors"></div>
                <h5 className="font-display font-semibold text-[var(--accent)] mb-1">{idea.title}</h5>
                <p className="text-sm text-[var(--text-primary)] mb-3 leading-relaxed">{idea.description}</p>
                
                {idea.whyItWorks && (
                  <div className="mb-4 text-xs p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] font-medium italic">
                    💡 {idea.whyItWorks}
                  </div>
                )}
                
                <div className="flex justify-between items-center mt-2 border-t border-[var(--border-subtle)] pt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-1 rounded">
                      Reward: {idea.suggestedReward}
                    </span>
                    <span className="text-xs font-mono text-[var(--text-muted)] bg-[var(--bg-surface)] px-2 py-1 rounded truncate max-w-[100px]">
                      {idea.questType.replace('_', ' ')}
                    </span>
                  </div>
                  <Button size="sm" variant="secondary" onClick={() => { onSelect(idea); setIdeas([]); }}>
                    Use Idea
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Button variant="ghost" fullWidth onClick={() => setIdeas([])}>Hide Suggestions</Button>
      </div>
    );
  }

  return (
    <Button 
      variant="secondary" 
      fullWidth 
      onClick={generate} 
      disabled={loading}
      icon={<Sparkles size={16} />}
      className="border-dashed"
    >
      {loading ? <PulseDots /> : "Generate AI Quest Ideas"}
    </Button>
  );
}
