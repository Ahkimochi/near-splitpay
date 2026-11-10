// NEAR integration — the only file that talks to a wallet.
//
// Wallet layer: @hot-labs/near-connect@0.12.0 (NEAR Connect), written
// against the installed package's own TypeScript definitions, verified
// BEFORE coding (node_modules/@hot-labs/near-connect/build/):
//   - new NearConnector(options?: NearConnectorOptions)
//       (NearConnector.d.ts) — options.network?: "mainnet" | "testnet".
//       The connector loads its wallet manifest (Meteor, Intear, HOT, …)
//       and renders its own wallet-picker popup; there is no redirect.
//   - connector.connect(input?: NearConnector_ConnectOptions):
//       Promise<NearWalletBase> — opens the picker UI, then calls the
//       chosen wallet's signIn({ network }); closing the picker rejects
//       with Error("User rejected") (NearConnector.js, selectWallet).
//   - connector.getConnectedWallet():
//       Promise<{ wallet: NearWalletBase, accounts: Account[] }> —
//       restores a previous session (selected wallet id in localStorage
//       + wallet.getAccounts()); throws when nobody is connected.
//   - connector.disconnect(wallet?): Promise<void> — signOut + clears
//       the stored selection, emits "wallet:signOut".
//   - connector.on("wallet:signIn", ({ wallet, accounts, success }) => …)
//     connector.on("wallet:signOut", …)  (types/index.d.ts, EventMap)
//   - NearWalletBase.getAccounts(data?: { network? }):
//       Promise<Array<Account>>, Account = { accountId, publicKey? }
//   - NearWalletBase.signAndSendTransaction(params:
//       SignAndSendTransactionParams): Promise<FinalExecutionOutcome>
//       params = { receiverId, actions: Array<Action | ConnectorAction>,
//                  network?, signerId? }
//       A plain transfer is the ConnectorAction
//         { type: "Transfer", params: { deposit: "<yocto string>" } }
//       (actions/types.d.ts, TransferAction). FinalExecutionOutcome
//       (@near-js/types) carries the hash at transaction_outcome.id.
//   - connector.switchNetwork(network) exists, but NearSplit instead
//     rebuilds the connector per network (see initNear) so each network
//     keeps an independent session state in this module.
//
// Why not MyNearWallet (the previous near-api-js WalletConnection flow)?
// MyNearWallet was sunset on 2026-10-31: account creation, swaps and new
// app connections are switched off, so the redirect flow cannot connect
// any wallet anymore. NEAR Connect is what NEAR's current frontend docs
// use, and its popup flow also removes the old full-page redirect (and
// the sessionStorage pay-link stash that redirect required).
//
// Balances are read straight from the chain: a JSON-RPC `view_account`
// query against the network's public RPC (no SDK needed for a read).

import { NearConnector } from '@hot-labs/near-connect';
import type { NearWalletBase } from '@hot-labs/near-connect';
import type { NetworkId } from './types';

export interface NetworkConfig {
  networkId: NetworkId;
  nodeUrl: string;
  explorerTxBase: string;
}

export const NETWORKS: Record<NetworkId, NetworkConfig> = {
  testnet: {
    networkId: 'testnet',
    nodeUrl: 'https://rpc.testnet.near.org',
    explorerTxBase: 'https://testnet.nearblocks.io/txns/',
  },
  mainnet: {
    networkId: 'mainnet',
    nodeUrl: 'https://rpc.mainnet.near.org',
    explorerTxBase: 'https://nearblocks.io/txns/',
  },
};

/** Where to create an account for each network (used by "no account yet" links). */
export const WALLET_CREATE_URL: Record<NetworkId, string> = {
  // Intear Wallet — full testnet support, account creation inside the wallet.
  testnet: 'https://wallet.intear.tech/',
  // Meteor Wallet — the designated MyNearWallet migration target.
  mainnet: 'https://wallet.meteorwallet.app/',
};

let connector: NearConnector | null = null;
let connectedWallet: NearWalletBase | null = null;
let connectedAccountId = '';
let currentNetwork: NetworkId | null = null;

/**
 * (Re)build the NEAR Connect connector for a network and restore any
 * existing wallet session on it. Switching networks signs the old
 * session out first and creates a fresh connector: NEAR accounts and
 * funds are per-network, and one active network keeps the state honest.
 * Restore failures (manifest unreachable, wallet gone, …) simply mean
 * "not connected" — creating splits keeps working.
 */
export async function initNear(network: NetworkId): Promise<NearConnector> {
  if (connector && currentNetwork === network) return connector;
  if (connector && connectedWallet) {
    await connector.disconnect().catch(() => undefined);
  }
  connectedWallet = null;
  connectedAccountId = '';
  currentNetwork = network;

  const instance = new NearConnector({ network });
  connector = instance;
  instance.on('wallet:signIn', ({ accounts }) => {
    if (connector !== instance) return;
    connectedAccountId = accounts[0]?.accountId ?? connectedAccountId;
    void instance
      .getConnectedWallet()
      .then(({ wallet }) => {
        if (connector === instance) connectedWallet = wallet;
      })
      .catch(() => undefined);
  });
  instance.on('wallet:signOut', () => {
    if (connector !== instance) return;
    connectedWallet = null;
    connectedAccountId = '';
  });

  try {
    const restored = await instance.getConnectedWallet();
    if (connector === instance) {
      connectedWallet = restored.wallet;
      connectedAccountId = restored.accounts[0]?.accountId ?? '';
    }
  } catch {
    // No previous session on this network — the normal first-run state.
  }
  return instance;
}

export function getConnector(): NearConnector {
  if (!connector) throw new Error('NEAR not initialized — call initNear first.');
  return connector;
}

export function isSignedIn(): boolean {
  return connectedWallet !== null && connectedAccountId !== '';
}

export function signedInAccountId(): string {
  return connectedAccountId;
}

/**
 * Open the NEAR Connect wallet picker (Meteor, Intear, HOT, …) and sign
 * in with the chosen wallet. Stays on this page — popup flow, no
 * redirect. Resolves once the wallet reports the signed-in accounts;
 * rejects (Error "User rejected") if the user closes the picker.
 */
export async function connectWallet(): Promise<void> {
  const instance = getConnector();
  const wallet = await instance.connect();
  const accounts = await wallet.getAccounts({ network: currentNetwork ?? undefined });
  connectedWallet = wallet;
  connectedAccountId = accounts[0]?.accountId ?? connectedAccountId;
  if (!connectedAccountId) throw new Error('The wallet did not return an account.');
}

/** Disconnect the current wallet (sign out in the wallet + locally). */
export async function signOut(): Promise<void> {
  const instance = connector;
  connectedWallet = null;
  connectedAccountId = '';
  if (instance) await instance.disconnect().catch(() => undefined);
}

/** Display balance (yocto string) of the connected account, or null. */
export async function fetchBalanceYocto(): Promise<string | null> {
  if (!isSignedIn() || !currentNetwork) return null;
  try {
    const cfg = NETWORKS[currentNetwork];
    const res = await fetch(cfg.nodeUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'nearsplit',
        method: 'query',
        params: {
          request_type: 'view_account',
          finality: 'optimistic',
          account_id: connectedAccountId,
        },
      }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      result?: { amount?: string; locked?: string };
      error?: unknown;
    };
    if (json.error || typeof json.result?.amount !== 'string') return null;
    // Spendable balance for a normal account: total minus locked (staking
    // at the account level). Ordinary wallet accounts have locked = "0".
    const amount = BigInt(json.result.amount);
    const locked = BigInt(json.result.locked ?? '0');
    return (amount - locked).toString();
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
 * organizer account, approved in the connected wallet's own UI.
 */
export async function payShare(
  network: NetworkId,
  receiverId: string,
  amountYocto: string,
): Promise<PayResult> {
  if (currentNetwork !== network || !connector) await initNear(network);
  let wallet = connectedWallet;
  if (!wallet) {
    try {
      wallet = await getConnector().wallet();
      const accounts = await wallet.getAccounts({ network });
      connectedWallet = wallet;
      connectedAccountId = accounts[0]?.accountId ?? connectedAccountId;
    } catch {
      wallet = null;
    }
  }
  if (!wallet || !connectedAccountId) {
    throw new Error('Connect your NEAR wallet first.');
  }
  const outcome = await wallet.signAndSendTransaction({
    receiverId,
    actions: [{ type: 'Transfer', params: { deposit: amountYocto } }],
  });
  const txHash =
    outcome.transaction_outcome?.id ||
    (typeof (outcome.transaction as { hash?: unknown })?.hash === 'string'
      ? (outcome.transaction as { hash: string }).hash
      : '') ||
    '';
  return { txHash, explorerUrl: explorerTxUrl(network, txHash) };
}

export function explorerTxUrl(network: NetworkId, txHash: string): string {
  return `${NETWORKS[network].explorerTxBase}${txHash}`;
}

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
