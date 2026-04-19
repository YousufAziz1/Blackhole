import { useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { Toaster } from 'react-hot-toast';

import { Home } from './pages/Home';
import { CreatorDashboard } from './pages/CreatorDashboard';
import { FanDashboard } from './pages/FanDashboard';
import { QuestDetail } from './pages/QuestDetail';
import { Leaderboard } from './pages/Leaderboard';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';
import './index.css';

function App() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter({ network }),
      new SolflareWalletAdapter({ network }),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <WalletModalProvider>
          <BrowserRouter>
            <Toaster 
              position="bottom-right" 
              toastOptions={{ 
                style: { 
                  background: 'var(--bg-elevated)', 
                  color: 'var(--text-primary)', 
                  border: '1px solid var(--border-default)',
                  fontFamily: 'DM Sans, sans-serif'
                } 
              }} 
            />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/creator" element={<CreatorDashboard />} />
              <Route path="/fan" element={<FanDashboard />} />
              <Route path="/quest/:questId" element={<QuestDetail />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              {/* Fallback to Home */}
              <Route path="*" element={<Home />} />
            </Routes>
          </BrowserRouter>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
