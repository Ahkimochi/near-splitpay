// Organizer detail view for one split: per-participant pay links + status,
// manual mark-as-paid, clone ("split again") and delete.

import { h, toast, copyText, shareNative } from '../ui';
import { formatNear } from '../money';
import { shareUrl } from '../links';
import { explorerTxUrl } from '../wallet';
import { collectedYocto } from './splitList';
import type { Split } from '../types';

export interface DetailCallbacks {
  onTogglePaid: (split: Split, participantId: string) => void;
  onClone: (split: Split) => void;
  onDelete: (split: Split) => void;
  onBack: () => void;
}

export function renderSplitDetail(split: Split, cb: DetailCallbacks): HTMLElement {
  const root = h('section', { class: 'view' });
  const collected = collectedYocto(split);
  const paidCount = split.participants.filter((p) => p.paid).length;

  const rows = split.participants.map((participant, index) => {
    const url = shareUrl(split, index);

    const copyBtn = h('button', { type: 'button', class: 'btn btn-ghost btn-small' }, 'Copy link') as HTMLButtonElement;
    copyBtn.addEventListener('click', async () => {
      const ok = await copyText(url);
      toast(ok ? `Pay link for ${participant.name} copied` : 'Copy failed — long-press the link to copy it.', ok ? 'success' : 'error');
    });

    const shareBtn = h('button', { type: 'button', class: 'btn btn-ghost btn-small' }, 'Share') as HTMLButtonElement;
    shareBtn.addEventListener('click', async () => {
      const shared = await shareNative({
        title: 'NearSplit',
        text: `Hi ${participant.name}, your share of “${split.title}” is ${formatNear(participant.shareYocto)}. Pay it in NEAR here:`,
        url,
      });
      if (!shared) {
        const ok = await copyText(url);
        toast(ok ? 'Share not available — link copied instead' : 'Could not share or copy the link.', ok ? 'info' : 'error');
      }
    });

    const toggleBtn = h('button', {
      type: 'button',
      class: `btn btn-small ${participant.paid ? 'btn-ghost' : 'btn-secondary'}`,
    }, participant.paid ? 'Mark unpaid' : 'Mark as paid') as HTMLButtonElement;
    toggleBtn.addEventListener('click', () => cb.onTogglePaid(split, participant.id));

    const status = participant.paid
      ? h('span', { class: 'status status-paid' },
          participant.paidVia === 'wallet' ? 'Paid via wallet ✓' : 'Paid ✓ (marked)')
      : h('span', { class: 'status status-open' }, 'Waiting to pay');

    const txNode = participant.txHash
      ? h('a', {
          class: 'tx-link mono',
          href: explorerTxUrl(split.network, participant.txHash),
          target: '_blank', rel: 'noopener',
        }, `tx ${participant.txHash.slice(0, 10)}…`)
      : h('span', {});

    return h('li', { class: 'participant-card' },
      h('div', { class: 'participant-head' },
        h('span', { class: 'participant-name' }, participant.name),
        h('span', { class: 'participant-amount' }, formatNear(participant.shareYocto)),
      ),
      h('div', { class: 'participant-row-between' }, status, txNode),
      h('div', { class: 'participant-actions' }, copyBtn, shareBtn, toggleBtn),
    );
  });

  const cloneBtn = h('button', { type: 'button', class: 'btn btn-secondary' }, 'Split again (clone)') as HTMLButtonElement;
  cloneBtn.addEventListener('click', () => cb.onClone(split));

  const deleteBtn = h('button', { type: 'button', class: 'btn btn-danger-ghost' }, 'Delete split') as HTMLButtonElement;
  deleteBtn.addEventListener('click', () => {
    if (window.confirm(`Delete “${split.title}”? The pay links for this split will stop matching your list.`)) {
      cb.onDelete(split);
    }
  });

  const backBtn = h('button', { type: 'button', class: 'btn btn-ghost' }, '← All splits') as HTMLButtonElement;
  backBtn.addEventListener('click', cb.onBack);

  root.append(
    backBtn,
    h('h2', { class: 'view-title' }, split.title),
    h('p', { class: 'muted' },
      `Total ${formatNear(split.totalYocto)}` +
      (split.tipPercent > 0 ? ` (incl. ${split.tipPercent}% tip)` : '') +
      ` · ${split.participants.length} people · organized by ${split.organizer}`),
    h('p', { class: 'muted small' }, `Payments go to ${split.nearAccount} on ${split.network === 'testnet' ? 'NEAR Testnet' : 'NEAR Mainnet'}`),
    h('div', { class: 'summary-card card' },
      h('div', { class: 'summary-item' },
        h('span', { class: 'summary-label' }, 'Collected'),
        h('span', { class: 'summary-value' }, formatNear(collected))),
      h('div', { class: 'summary-item' },
        h('span', { class: 'summary-label' }, 'Outstanding'),
        h('span', { class: 'summary-value' }, formatNear(BigInt(split.totalYocto) - collected))),
      h('div', { class: 'summary-item' },
        h('span', { class: 'summary-label' }, 'Paid'),
        h('span', { class: 'summary-value' }, `${paidCount} of ${split.participants.length}`)),
    ),
    h('h3', { class: 'section-title' }, 'Pay links — send each person their own'),
    h('ul', { class: 'participant-list' }, ...rows),
    h('p', { class: 'hint' },
      'When someone pays through their link, their payment lands directly in the organizer account on NEAR (check it on NearBlocks) — or just mark them as paid here. Statuses live on this device.'),
    h('div', { class: 'form-actions' }, deleteBtn, cloneBtn),
  );
  return root;
}
