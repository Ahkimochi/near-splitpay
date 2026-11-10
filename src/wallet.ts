// NEAR integration — the only file that talks to near-api-js.
//
// Everything here is written against near-api-js@2.1.4, verified BEFORE
// coding from the installed package's own TypeScript definitions:
//   - connect(config: ConnectConfig): Promise<Near>
//       (lib/browser-connect.d.ts; ConnectConfig extends NearConfig in
//        @near-js/wallet-account/lib/near.d.ts: networkId, nodeUrl,
//        walletUrl?, keyStore?)
//   - keyStores.BrowserLocalStorageKeyStore
//       (lib/key_stores/browser-index.d.ts)
//   - new WalletConnection(near, appKeyPrefix)
//       (@near-js/wallet-account/lib/wallet_account.d.ts):
//       isSignedIn(): boolean, isSignedInAsync(): Promise<boolean>,
//       getAccountId(): string,
//       requestSignIn({ contractId?, methodNames?, successUrl?, failureUrl? }),
//       signOut(): void, account(): ConnectedWalletAccount
//   - ConnectedWalletAccount extends Account (@near-js/accounts):
//       sendMoney(receiverId: string, amount: BN): Promise<FinalExecutionOutcome>
//       getAccountBalance(): Promise<{ total, stateStaked, staked, available }>
//     FinalExecutionOutcome.transaction_outcome.id is the transaction hash.
//     sendMoney's amount is typed BN (bn.js) — the borsh-serialized Transfer
//     action requires a real BN, so yocto strings are wrapped with new BN().
//   - utils.format.parseNearAmount(amt?: string): string | null
//     utils.format.formatNearAmount(balance: string, fracDigits?): string
//       (@near-js/utils/lib/format.d.ts, re-exported by near-api-js)
//
// Sign-in is the classic redirect flow: requestSignIn sends the browser to
// the wallet (MyNearWallet), which returns to successUrl with the account
// id + a full-access key stored in the BrowserLocalStorageKeyStore. Because
// the key is a full-access key kept locally, sendMoney afterwards signs
// locally and resolves with the FinalExecutionOutcome (no second redirect
// for a plain transfer).

import { connect, keyStores, utils, WalletConnection } from 'near-api-js';
import type { Near } from 'near-api-js';
import BN from 'bn.js';
import type { NetworkId } from './types';

export interface NetworkConfig {
  networkId: NetworkId;
  nodeUrl: string;
  walletUrl: string;
  helperUrl: string;
  explorerTxBase: string;
  walletHome: string;
}

export const NETWORKS: Record<NetworkId, NetworkConfig> = {
  testnet: {
    networkId: 'testnet',
    nodeUrl: 'https://rpc.testnet.near.org',
    walletUrl: 'https://testnet.mynearwallet.com/',
    helperUrl: 'https://helper.testnet.near.org',
    explorerTxBase: 'https://testnet.nearblocks.io/txns/',
    walletHome: 'https://testnet.mynearwallet.com/',
  },
  mainnet: {
    networkId: 'mainnet',
    nodeUrl: 'https://rpc.mainnet.near.org',
    walletUrl: 'https://app.mynearwallet.com/',
    helperUrl: 'https://helper.mainnet.near.org',
    explorerTxBase: 'https://nearblocks.io/txns/',
    walletHome: 'https://app.mynearwallet.com/',
  },
};

const APP_KEY_PREFIX = 'nearsplit';

let nearInstance: Near | null = null;
let walletInstance: WalletConnection | null = null;
let currentNetwork: NetworkId | null = null;

/**
 * (Re)build the NEAR connection + wallet for a network. Switching networks
 * rebuilds everything: RPC endpoint, wallet URL, and the keystore namespace
 * are all network-specific. WalletConnection re-reads its auth state from
 * localStorage on construction, so a completed sign-in redirect is picked
 * up here on the next page load.
 */
export async function initNear(network: NetworkId): Promise<WalletConnection> {
  if (walletInstance && currentNetwork === network) return walletInstance;
  const cfg = NETWORKS[network];
  nearInstance = await connect({
    networkId: cfg.networkId,
    nodeUrl: cfg.nodeUrl,
    walletUrl: cfg.walletUrl,
    helperUrl: cfg.helperUrl,
    keyStore: new keyStores.BrowserLocalStorageKeyStore(),
  });
  walletInstance = new WalletConnection(nearInstance, APP_KEY_PREFIX);
  // Resolve any just-completed sign-in redirect before callers read state.
  await walletInstance.isSignedInAsync().catch(() => false);
  currentNetwork = network;
  return walletInstance;
}

export function getWallet(): WalletConnection {
  if (!walletInstance) throw new Error('NEAR not initialized — call initNear first.');
  return walletInstance;
}

export function isSignedIn(): boolean {
  return walletInstance?.isSignedIn() ?? false;
}

export function signedInAccountId(): string {
  return walletInstance?.getAccountId() ?? '';
}

/**
 * Redirect to the wallet to sign in. Returns to exactly `returnUrl`
 * (the app passes the current URL, pay-link hash included).
 */
export async function requestSignIn(returnUrl: string): Promise<void> {
  const wallet = getWallet();
  await wallet.requestSignIn({
    successUrl: returnUrl,
    failureUrl: returnUrl,
  });
}

export function signOut(): void {
  walletInstance?.signOut();
}

/** Available balance (yocto string) of the signed-in account, or null. */
export async function fetchBalanceYocto(): Promise<string | null> {
  if (!walletInstance || !walletInstance.isSignedIn()) return null;
  try {
    const balance = await walletInstance.account().getAccountBalance();
    return balance.available;
  } catch {
    return null;
  }
}

export interface PayResult {
  txHash: string;
  explorerUrl: string;
}

/**
 * Pay a share: a plain NEAR transfer of exactly `amountYocto` to the
 * organizer account, signed by the connected wallet account.
 */
export async function payShare(
  network: NetworkId,
  receiverId: string,
  amountYocto: string,
): Promise<PayResult> {
  const wallet = getWallet();
  if (!wallet.isSignedIn()) throw new Error('Connect your NEAR wallet first.');
  const outcome = await wallet.account().sendMoney(receiverId, new BN(amountYocto));
  const txHash =
    (typeof outcome.transaction?.hash === 'string' && outcome.transaction.hash) ||
    outcome.transaction_outcome?.id ||
    '';
  return { txHash, explorerUrl: explorerTxUrl(network, txHash) };
}

export function explorerTxUrl(network: NetworkId, txHash: string): string {
  return `${NETWORKS[network].explorerTxBase}${txHash}`;
}

/** near-api-js's own yocto <-> NEAR converters (used + unit-tested). */
export const nearFormat = {
  parseNearAmount: (amt: string): string | null => utils.format.parseNearAmount(amt),
  formatNearAmount: (yocto: string, fracDigits?: number): string =>
    utils.format.formatNearAmount(yocto, fracDigits),
};

export interface FriendlyError {
  kind: 'cancelled' | 'error';
  message: string;
}

/** Turn wallet/RPC errors into plain-language messages. */
export function friendlyError(error: unknown): FriendlyError {
  const raw = error instanceof Error ? error.message : String(error ?? '');
  const lower = raw.toLowerCase();
  if (
    lower.includes('reject') ||
    lower.includes('cancel') ||
    lower.includes('denied') ||
    lower.includes('user closed') ||
    lower.includes('not authorized')
  ) {
    return { kind: 'cancelled', message: 'Payment cancelled in the wallet — nothing was sent.' };
  }
  if (lower.includes('insufficient') || lower.includes('not enough')) {
    return {
      kind: 'error',
      message: 'Not enough NEAR in the connected account for this share plus the network fee. Top up and try again.',
    };
  }
  if (lower.includes('does not exist') || lower.includes('account id') && lower.includes('invalid')) {
    return {
      kind: 'error',
      message: 'The receiving account in this link does not look valid on this network. Ask the organizer for a fresh link.',
    };
  }
  return {
    kind: 'error',
    message: raw ? `Payment failed: ${raw}` : 'Payment failed. Please try again.',
  };
}
