import { useWallet } from '@solana/wallet-adapter-react';
import { useNavigate } from 'react-router-dom';
import { WalletConnect } from '../components/WalletConnect';
import { Logo } from '../components/Logo';
import { Target, Zap, Shield, Users } from 'lucide-react';
import { XIcon, GithubIcon } from '../components/Icons';

const SOCIAL = {
  x: 'https://x.com/YousufWeb3AI',
  github: 'https://github.com/YousufAziz1',
};

export function Home() {
  const { connected } = useWallet();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-mesh">
      {/* Ambient orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 h-20 border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/80 backdrop-blur-xl z-50 flex items-center justify-between px-6">
        <Logo />

        <div className="flex items-center gap-3">
          <a href={SOCIAL.x} target="_blank" rel="noreferrer" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors p-2 rounded-lg hover:bg-[var(--bg-elevated)] leading-none text-xl translate-y-[2px]">
            <XIcon size={18} />
          </a>
          <a href={SOCIAL.github} target="_blank" rel="noreferrer" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors p-2 rounded-lg hover:bg-[var(--bg-elevated)] leading-none text-sm font-bold">
            <GithubIcon size={18} />
          </a>
          <WalletConnect />
          {connected && (
            <button
              onClick={() => navigate('/fan')}
              className="px-4 py-2 text-sm font-semibold rounded-xl bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30 hover:bg-[var(--accent)]/25 transition-colors"
            >
              Enter App →
            </button>
          )}
        </div>
      </nav>

      {/* Hero */}
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col justify-center min-h-screen">
        <div className="max-w-3xl mx-auto text-center stagger">
          <div className="animate-in mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-active)] bg-[var(--accent)]/10 text-[var(--accent)] text-sm font-medium">
            <Zap size={16} /> Now Live on Bags.fm
          </div>
          
          <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-display font-bold leading-[1.05] tracking-tight mb-6 text-white animate-in">
            Reward your <span className="text-gradient">True Fans</span> <br/>on Solana.
          </h1>
          
          <p className="text-lg text-[var(--text-muted)] mb-10 max-w-xl mx-auto leading-relaxed animate-in">
            Create AI-powered quests for your token holders. Boost engagement, grow your community, and automatically reward your most loyal fans on Bags.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in">
            {!connected && (
              <button
                onClick={() => navigate('/fan')}
                className="px-6 py-3 text-base font-semibold rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--accent)] hover:bg-[var(--bg-elevated)] hover:-translate-y-0.5 transition-all shadow-lg text-center"
              >
                Browse Quests
              </button>
            )}
            <div className={`relative group p-1 rounded-2xl ${connected ? 'bg-transparent' : 'bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)]'}`}>
              <div className="bg-[var(--bg-base)] rounded-xl p-1 flex">
                <WalletConnect />
              </div>
            </div>
            {connected && (
              <button
                onClick={() => navigate('/fan')}
                className="px-6 py-3 text-base font-semibold rounded-xl bg-[var(--accent)] text-black hover:brightness-110 hover:-translate-y-0.5 transition-all shadow-lg shadow-[var(--accent-glow)] text-center"
              >
                Go to App →
              </button>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 stagger animate-in">
          <div className="card-base p-6 rounded-2xl bg-[var(--bg-surface)]">
            <Target className="text-[var(--accent)] mb-4" size={32} />
            <h3 className="font-display font-semibold text-lg mb-2">Engage Holders</h3>
            <p className="text-[var(--text-muted)] text-sm">Create actions like retweeting, joining TG, or holding minimum balance to engage your community natively.</p>
          </div>
          <div className="card-base p-6 rounded-2xl bg-[var(--bg-surface)]">
            <Shield className="text-[var(--accent)] mb-4" size={32} />
            <h3 className="font-display font-semibold text-lg mb-2">Auto-Verification</h3>
            <p className="text-[var(--text-muted)] text-sm">Using Bags SDK, instantly verify if a fan holds your token without manual checks. Trustless validation.</p>
          </div>
          <div className="card-base p-6 rounded-2xl bg-[var(--bg-surface)]">
            <Users className="text-[var(--accent)] mb-4" size={32} />
            <h3 className="font-display font-semibold text-lg mb-2">Growth Through AI</h3>
            <p className="text-[var(--text-muted)] text-sm">Let Gemini AI generate highly contextual quest ideas tailored exactly for your token size and niche.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-subtle)] py-8 px-6 bg-[var(--bg-surface)]/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="relative w-6 h-6 shrink-0">
              <img src="/logo.jpg" alt="logo" className="w-full h-full object-cover rounded-full border border-[var(--border-subtle)]" />
            </div>
            <span className="font-display font-bold text-sm text-[var(--text-muted)]">Blackhole</span>
          </div>
          <p className="text-xs text-[var(--text-faint)]">Built by <a href={SOCIAL.x} target="_blank" rel="noreferrer" className="text-[var(--accent)] hover:underline">@YousufWeb3AI</a> for the Bags.fm Hackathon</p>
          <div className="flex items-center gap-3">
            <a href={SOCIAL.x} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
              <span className="leading-none text-lg translate-y-[1px]"><XIcon size={15} /></span> Follow on X
            </a>
            <span className="text-[var(--border-subtle)]">·</span>
            <a href={SOCIAL.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
              <span className="leading-none text-xs font-bold"><GithubIcon size={15} /></span> GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
