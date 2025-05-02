import { BLOCK_EXPLORERS } from '@/config/contracts';
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Returns the block explorer URL for a given chain ID
 * 
 * @param chainId The chain ID to get the block explorer for
 * @returns The block explorer URL
 */
export function getBlockExplorerURL(chainId: number): string {
  return BLOCK_EXPLORERS[chainId as keyof typeof BLOCK_EXPLORERS] || BLOCK_EXPLORERS[80002]; // Default to Polygon Amoy
}

/**
 * Shortens an Ethereum address for display
 * 
 * @param address The Ethereum address to shorten
 * @param chars Number of characters to show at start and end (default: 4)
 * @returns The shortened address
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  
  return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`;
}

/**
 * Formats a number as currency
 * 
 * @param value The number to format
 * @param currency The currency code (default: USD)
 * @param decimals Number of decimal places (default: 2)
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, currency = 'USD', decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Delays execution for specified time
 * 
 * @param ms Milliseconds to delay
 * @returns Promise that resolves after the delay
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Combines multiple class values into a single Tailwind CSS class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a blockchain address to a shorter version for display
 * e.g. 0x1234...5678
 */
export function formatAddress(address: string, start: number = 6, end: number = 4): string {
  if (!address) return "";
  if (address.length < start + end) return address;
  return `${address.substring(0, start)}...${address.substring(address.length - end)}`;
}

/**
 * Formats a number to display with specified decimal places
 */
export function formatNumber(num: number | string, decimals: number = 2): string {
  if (typeof num === 'string') {
    num = parseFloat(num);
  }
  return num.toFixed(decimals);
}

/**
 * Converts a bigint to a formatted currency string
 */
export function formatBigIntCurrency(value: bigint | number | string, decimals: number = 18, symbol: string = '$'): string {
  let bigintValue: bigint;
  
  if (typeof value === 'string') {
    bigintValue = BigInt(value);
  } else if (typeof value === 'number') {
    bigintValue = BigInt(Math.floor(value));
  } else {
    bigintValue = value;
  }
  
  // Convert to string with proper decimal places
  const valueStr = bigintValue.toString();
  const len = valueStr.length;
  
  if (len <= decimals) {
    // Less than one token
    const fractionalPart = valueStr.padStart(decimals, '0');
    return `${symbol}0.${fractionalPart}`;
  } else {
    // More than one token
    const wholePart = valueStr.slice(0, len - decimals);
    const fractionalPart = valueStr.slice(len - decimals);
    return `${symbol}${wholePart}.${fractionalPart}`;
  }
}

/**
 * Returns IPFS URL for a given IPFS hash
 */
export function getIPFSUrl(ipfsHash: string): string {
  if (!ipfsHash) return "";
  
  // Check if it's already a URL
  if (ipfsHash.startsWith('http')) {
    return ipfsHash;
  }
  
  // Check if it's an IPFS hash with ipfs:// protocol
  if (ipfsHash.startsWith('ipfs://')) {
    return `https://ipfs.filebase.io/ipfs/${ipfsHash.replace('ipfs://', '')}`;
  }
  
  // Assume it's just a hash
  return `https://ipfs.filebase.io/ipfs/${ipfsHash}`;
}

/**
 * Returns a link to the blockchain explorer for a transaction hash
 */
export function getExplorerLink(chainId: number, hash: string, type: 'tx' | 'address' | 'token' = 'tx'): string {
  const explorerBaseUrl = BLOCK_EXPLORERS[chainId as keyof typeof BLOCK_EXPLORERS];
  if (!explorerBaseUrl || !hash) return '';

  switch (type) {
    case 'tx':
      return `${explorerBaseUrl}/tx/${hash}`;
    case 'address':
      return `${explorerBaseUrl}/address/${hash}`;
    case 'token':
      return `${explorerBaseUrl}/token/${hash}`;
    default:
      return `${explorerBaseUrl}/${hash}`;
  }
}

/**
 * Returns the transaction hash from a URL
 */
export function hashFromUrl(url: string): string {
  if (!url) return '';
  const parts = url.split('/');
  return parts[parts.length - 1];
}

/**
 * Truncates text to a specific length with ellipsis
 */
export function truncateText(text: string, length: number = 30): string {
  if (!text) return '';
  if (text.length <= length) return text;
  
  return `${text.substring(0, length)}...`;
}

/**
 * Formats a blockchain timestamp (in seconds) to a readable date string
 * Blockchain timestamps are typically in seconds since Unix epoch,
 * while JavaScript uses milliseconds
 */
export function formatBlockchainDate(timestamp: number, options?: Intl.DateTimeFormatOptions): string {
  if (!timestamp) return 'N/A';
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  const dateOptions = options || defaultOptions;
  
  try {
    const date = new Date(timestamp * 1000);
    return new Intl.DateTimeFormat('en-US', dateOptions).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
} 