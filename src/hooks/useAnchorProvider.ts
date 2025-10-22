import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo } from 'react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';

const network = WalletAdapterNetwork.Devnet;
const endpoint = useMemo(() => clusterApiUrl(network), [network]);

const wallets = useMemo(() => [
  new PhantomWalletAdapter(),
], [network]);

const AnchorProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default AnchorProviderWrapper;
