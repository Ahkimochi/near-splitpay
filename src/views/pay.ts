// Pay view: what a participant sees when opening their personal pay link.
// Real NEAR payment only — there is no simulated/offline payment path.

import { h, toast } from '../ui';
import { formatNear } from '../money';
import { findPaidRecord, recordPaid, loadSplits, upsertSplit } from '../store';
import { payShare, friendlyError, explorerTxUrl, WALLET_CREATE_URL } from '../wallet';
import { isValidNearAccountId, shortenAccountId } from '../validate';
import type { Participant, SharePayload, WalletState } from '../types';

export interface PayCallbacks {
  onBack: () => void;
  /** Open the NEAR Connect wallet-picker popup for payload.net. */
  onConnect: () => void;
  /** Switch the app's active network (to the one this link needs). */
  onSwitchNetwork: () => void;
  refreshWallet: () => Promise<void>;
}

type PayPhase = 'idle' | 'paying' | 'paid';

export function renderPayView(
  payload: SharePayload,
  wallet: WalletState,
  cb: PayCallbacks,
): HTMLElement {
  const root = h('section', { class: 'view' });
  const addressValid = isValidNearAccountId(payload.a);
  const wrongNetwork = wallet.network !== payload.net;

  // Known progress: if this split was created on this device, use live status.
  const localSplit = loadSplits().find((s) => s.id === payload.id);
  const paidRefsKnown = localSplit
    ? localSplit.participants.filter((p) => p.paid).length
    : null;

  const existingRecord = findPaidRecord(payload.ref);
  let phase: PayPhase = existingRecord ? 'paid' : 'idle';
  let ownTxHash: string | undefined = existingRecord?.txHash;

  // --- dynamic regions -----------------------------------------------------
  const statusRegion = h('div', { class: 'pay-status' });
  const actionRegion = h('div', { class: 'pay-actions' });
  const noteRegion = h('div', { class: 'pay-note' });

  function renderStatus(): void {
    statusRegion.replaceChildren();
    if (phase === 'paid') {
      statusRegion.append(
        h('div', { class: 'paid-banner', role: 'status' },
          h('div', { class: 'paid-banner-title' }, 'You paid your share ✓'),
          ownTxHash
            ? h('a', {
                class: 'tx-link mono',
                href: explorerTxUrl(payload.net, ownTxHash),
                target: '_blank', rel: 'noopener',
              }, `View on NearBlocks: ${ownTxHash.slice(0, 12)}…`)
            : h('span', { class: 'muted small' }, 'Marked as paid on this device.'),
        ),
      );
    } else if (phase === 'paying') {
      statusRegion.append(
        h('p', { class: 'muted', role: 'status' }, 'Sending your payment on NEAR…'),
      );
    }
  }

  function renderActions(): void {
    actionRegion.replaceChildren();
    noteRegion.replaceChildren();
    if (phase === 'paid' || phase === 'paying') return;

    if (!addressValid) {
      actionRegion.append(
        h('p', { class: 'form-error', role: 'alert' },
          'The NEAR account in this link does not look valid. Ask the organizer to send you a fresh link — do not pay to a different account.'),
      );
      return;
    }

    if (wrongNetwork) {
      const btn = h('button', { type: 'button', class: 'btn btn-primary btn-block btn-big' },
        `Switch to ${payload.net === 'testnet' ? 'Testnet' : 'Mainnet'} to pay`) as HTMLButtonElement;
      btn.addEventListener('click', cb.onSwitchNetwork);
      actionRegion.append(btn);
      noteRegion.append(
        h('p', { class: 'hint' },
          `This bill is on ${payload.net === 'testnet' ? 'NEAR Testnet' : 'NEAR Mainnet'}, but the app is currently set to ${wallet.network}. NEAR accounts and funds are separate per network — switching only changes which network NearSplit talks to.`),
      );
      return;
    }

    if (!wallet.signedIn) {
      const btn = h('button', { type: 'button', class: 'btn btn-primary btn-block btn-big' },
        'Connect NEAR wallet') as HTMLButtonElement;
      btn.addEventListener('click', cb.onConnect);
      const createLink = h('a', {
        class: 'btn btn-ghost btn-block',
        href: WALLET_CREATE_URL[payload.net],
        target: '_blank', rel: 'noopener',
      }, payload.net === 'testnet' ? 'No account yet? Create a free testnet account' : 'No account yet? Create a NEAR account');
      actionRegion.append(btn, createLink);
      noteRegion.append(
        h('p', { class: 'hint' },
          'A wallet picker (NEAR Connect) opens right here — pick your wallet (Meteor, Intear, HOT, …) and approve the connection without leaving this page. NearSplit never simulates payments — paying means connecting a real wallet and sending real NEAR on ' +
          (payload.net === 'testnet' ? 'testnet (test funds, no real money).' : 'mainnet.')),
      );
      return;
    }

    const btn = h('button', { type: 'button', class: 'btn btn-primary btn-block btn-big' },
      `Pay ${formatNear(payload.amt)}`) as HTMLButtonElement;
    btn.addEventListener('click', () => void doPay(btn));
    actionRegion.append(btn);

    const notes: string[] = [
      `Connected as ${wallet.accountId ?? ''} — the payment goes directly to ${payload.a}. A small network fee (usually < 0.001 NEAR) is paid by your account on top of the share.`,
    ];
    if (wallet.balanceYocto !== undefined && BigInt(wallet.balanceYocto) < BigInt(payload.amt)) {
      notes.push('Heads up: your available balance looks lower than this share — the payment will fail until you top up.');
    }
    noteRegion.append(h('p', { class: 'hint' }, notes.join(' ')));
  }

  async function doPay(btn: HTMLButtonElement): Promise<void> {
    phase = 'paying';
    btn.disabled = true;
    btn.textContent = 'Sending…';
    renderStatus();
    try {
      const result = await payShare(payload.net, payload.a, payload.amt);
      phase = 'paid';
      ownTxHash = result.txHash || undefined;
      recordPaid({ ref: payload.ref, splitId: payload.id, txHash: result.txHash || undefined, at: new Date().toISOString() });
      markLocalSplitPaid(result.txHash || undefined);
      toast('Payment sent 🎉', 'success');
      renderStatus();
      renderActions();
      void cb.refreshWallet();
    } catch (error) {
      phase = 'idle';
      const friendly = friendlyError(error);
      toast(friendly.message, friendly.kind === 'cancelled' ? 'info' : 'error');
      btn.disabled = false;
      btn.textContent = `Pay ${formatNear(payload.amt)}`;
      renderStatus();
    }
  }

  /** If the organizer's copy of this split lives on this device, tick it off. */
  function markLocalSplitPaid(txHash: string | undefined): void {
    const splits = loadSplits();
    const split = splits.find((s) => s.id === payload.id);
    if (!split) return;
    // Participant index is the last segment of the ref code (NSP-XXXX-N).
    const idxFromRef = Number(payload.ref.split('-').pop()) - 1;
    let participant: Participant | undefined = split.participants[idxFromRef];
    if (!participant || participant.name !== payload.n || participant.shareYocto !== payload.amt) {
      participant = split.participants.find(
        (p) => p.name === payload.n && p.shareYocto === payload.amt);
    }
    if (!participant || participant.paid) return;
    participant.paid = true;
    participant.paidVia = 'wallet';
    participant.txHash = txHash;
    participant.paidAt = new Date().toISOString();
    upsertSplit(split);
  }

  // --- static layout -------------------------------------------------------
  const backBtn = h('button', { type: 'button', class: 'btn btn-ghost' }, '← My splits') as HTMLButtonElement;
  backBtn.addEventListener('click', cb.onBack);

  const roster = payload.all.map((name) =>
    h('li', { class: `roster-item ${name === payload.n ? 'roster-item-you' : ''}` },
      name, name === payload.n ? ' (you)' : ''));

  root.append(
    backBtn,
    h('p', { class: 'eyebrow' }, `${payload.o} is splitting a bill`),
    h('h2', { class: 'view-title' }, payload.t),
    h('div', { class: 'card pay-card' },
      h('div', { class: 'pay-share-label' }, `${payload.n}, your share is`),
      h('div', { class: 'pay-share-amount' }, formatNear(payload.amt)),
      h('div', { class: 'pay-share-meta' },
        `of ${formatNear(payload.tot)} total · ${payload.cnt} people · ${payload.net === 'testnet' ? 'NEAR Testnet' : 'NEAR Mainnet'}`),
      statusRegion,
      actionRegion,
      noteRegion,
      h('p', { class: 'muted small' }, `Paid to ${shortenAccountId(payload.a)} (${payload.a}) · Ref ${payload.ref}`),
    ),
    h('div', { class: 'card' },
      h('h3', { class: 'section-title' }, 'Who is in this split'),
      h('ul', { class: 'roster' }, ...roster),
      paidRefsKnown !== null
        ? h('p', { class: 'muted small' }, `Progress on this device: ${paidRefsKnown} of ${payload.cnt} shares marked paid.`)
        : h('p', { class: 'muted small' },
            'Progress is tracked by the organizer — after paying, show them your NearBlocks confirmation so they can tick you off.'),
    ),
  );

  renderStatus();
  renderActions();
  return root;
}
