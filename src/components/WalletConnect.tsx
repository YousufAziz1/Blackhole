import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Badge } from './ui';

export function WalletConnect() {
  const { connected, publicKey } = useWallet();

  return (
    <div className="flex items-center gap-4">
      {connected && publicKey && (
        <Badge variant="accent" dot>
          {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
        </Badge>
      )}
      <WalletMultiButton 
        style={{
          backgroundColor: 'var(--accent)',
          color: '#000',
          fontFamily: 'DM Mono, monospace',
          fontWeight: 700,
          borderRadius: '12px',
          padding: '0 24px',
          height: '48px',
          transition: 'all 0.2s',
          border: 'none',
          boxShadow: '0 8px 30px var(--accent-glow)'
        }}
      />
    </div>
  );
}
