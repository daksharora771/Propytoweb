'use client'

import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { WagmiProvider, http } from 'wagmi';
import { polygonAmoy } from 'wagmi/chains';
// Create a temporary project ID - in production, replace this with your actual WalletConnect project ID
const projectId = "propyto-demo-project-id";

const config = getDefaultConfig({
  appName: 'Propyto',
  projectId, 
  chains: [polygonAmoy], // Only include Amoy testnet
  transports: {
    [polygonAmoy.id]: http(),
  },
});

const queryClient = new QueryClient();

export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
} 