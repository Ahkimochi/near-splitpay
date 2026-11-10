// "My Splits" list item + collected-amount helper.

import { h } from '../ui';
import { formatNear, sumYocto } from '../money';
import type { Split } from '../types';

export function collectedYocto(split: Split): bigint {
  return sumYocto(split.participants.filter((p) => p.paid).map((p) => p.shareYocto));
}

export function renderSplitCard(split: Split, onOpen: (id: string) => void): HTMLElement {
  const paidCount = split.participants.filter((p) => p.paid).length;
  const totalCount = split.participants.length;
  const collected = collectedYocto(split);
  const settled = paidCount === totalCount;

  const card = h('article', { class: 'card split-card' });
  const open = () => onOpen(split.id);
  card.addEventListener('click', open);
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `Open split ${split.title}`);
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      open();
    }
  });

  const pct = totalCount === 0 ? 0 : Math.round((paidCount / totalCount) * 100);
  card.append(
    h('div', { class: 'split-card-head' },
      h('h3', { class: 'split-card-title' }, split.title),
      h('span', { class: `badge ${settled ? 'badge-done' : 'badge-open'}` },
        settled ? 'Settled ✓' : `${paidCount}/${totalCount} paid`),
    ),
    h('div', { class: 'split-card-meta' },
      `${formatNear(split.totalYocto)} · to ${split.nearAccount} · ${split.network}`),
    h('div', { class: 'progress', 'aria-hidden': 'true' },
      h('div', { class: 'progress-bar', style: `width:${pct}%` })),
    h('div', { class: 'split-card-foot' },
      h('span', {}, `Collected ${formatNear(collected)}`),
      h('span', { class: 'muted' }, `Outstanding ${formatNear(BigInt(split.totalYocto) - collected)}`),
    ),
  );
  return card;
}
