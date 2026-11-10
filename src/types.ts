// Core domain types for NearSplit.

export type NetworkId = 'testnet' | 'mainnet';

export type SplitMode = 'equal' | 'custom';

export interface Participant {
  /** Stable local id inside the split. */
  id: string;
  name: string;
  /** Share amount in yoctoNEAR (1 NEAR = 10^24), as a decimal string —
   *  yocto amounts exceed Number.MAX_SAFE_INTEGER, so strings + BigInt only. */
  shareYocto: string;
  paid: boolean;
  /** How the share was marked paid. */
  paidVia?: 'wallet' | 'manual';
  /** Transaction hash, when paid through a wallet. */
  txHash?: string;
  /** ISO timestamp of when the share was marked paid. */
  paidAt?: string;
}

export interface Split {
  id: string;
  title: string;
  /** Organizer display name. */
  organizer: string;
  /** Organizer's NEAR account id — every share is paid to this account. */
  nearAccount: string;
  /** Network this split was created for. */
  network: NetworkId;
  /** Total including tip, in yoctoNEAR (decimal string). */
  totalYocto: string;
  /** Tip percentage that was applied on top of the base total (0 = none). */
  tipPercent: number;
  mode: SplitMode;
  participants: Participant[];
  createdAt: string;
}

/** Compact payload encoded into a personal pay link (#/pay/<base64url>). */
export interface SharePayload {
  v: 1;
  /** Split id. */
  id: string;
  /** Bill title. */
  t: string;
  /** Organizer display name. */
  o: string;
  /** Organizer NEAR account id (receives every share). */
  a: string;
  /** Network the payment must happen on. */
  net: NetworkId;
  /** Total incl. tip, yoctoNEAR decimal string. */
  tot: string;
  /** This participant's share, yoctoNEAR decimal string. */
  amt: string;
  /** This participant's name. */
  n: string;
  /** Reference code for this share, e.g. "NSP-K7X3-1". */
  ref: string;
  /** Number of participants. */
  cnt: number;
  /** Names of all participants (for the roster display). */
  all: string[];
}

/** A locally recorded payment for a share link opened on this device. */
export interface PaidRecord {
  ref: string;
  splitId: string;
  txHash?: string;
  at: string;
}

/** Current NEAR wallet connection state for the active network. */
export interface WalletState {
  network: NetworkId;
  signedIn: boolean;
  /** Connected NEAR account id, when signed in. */
  accountId?: string;
  /** Available balance in yoctoNEAR (decimal string), when it could be read. */
  balanceYocto?: string;
}
