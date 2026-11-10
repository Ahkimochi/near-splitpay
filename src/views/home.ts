// Home view pieces: wallet status card + how-it-works.

import { h } from '../ui';
import { formatYocto } from '../money';
import { shortenAccountId } from '../validate';
import { WALLET_CREATE_URL } from '../wallet';
import type { WalletState } from '../types';

export interface HomeCallbacks {
  onConnect: () => void;
  onSignOut: () => void;
  connectBusy: boolean;
}

export function renderWalletCard(state: WalletState, cb: HomeCallbacks): HTMLElement {
  const card = h('section', { class: 'card wallet-card', 'aria-label': 'Wallet status' });
  const netLabel = state.network === 'testnet' ? 'NEAR Testnet' : 'NEAR Mainnet';

  if (state.signedIn) {
    const rows: Node[] = [
      h('div', { class: 'wallet-dot wallet-dot-on', 'aria-hidden': 'true' }),
      h('div', { class: 'wallet-main' },
        h('div', { class: 'wallet-title' }, 'Connected NEAR wallet'),
        h('div', { class: 'wallet-sub' },
          state.accountId ? shortenAccountId(state.accountId) : 'Account loading…',
          ` · ${netLabel}`,
        ),
      ),
    ];
    if (state.balanceYocto !== undefined) {
      rows.push(
        h('div', { class: 'wallet-balance' },
          h('span', { class: 'wallet-balance-amount' }, formatYocto(state.balanceYocto)),
          h('span', { class: 'wallet-balance-unit' }, 'NEAR'),
        ),
      );
    }
    card.append(h('div', { class: 'wallet-row' }, ...rows));
    const outBtn = h('button', { class: 'btn btn-ghost btn-small', type: 'button' }, 'Sign out') as HTMLButtonElement;
    outBtn.addEventListener('click', cb.onSignOut);
    card.append(h('div', { class: 'wallet-actions' }, outBtn));
  } else {
    card.append(
      h('div', { class: 'wallet-row' },
        h('div', { class: 'wallet-dot wallet-dot-off', 'aria-hidden': 'true' }),
        h('div', { class: 'wallet-main' },
          h('div', { class: 'wallet-title' }, 'No NEAR wallet connected'),
          h('div', { class: 'wallet-sub' },
            `Connect with Meteor, Intear, HOT and more to pay shares on ${netLabel}. Creating splits works without a wallet.`),
        ),
      ),
    );
    const btn = h('button', { class: 'btn btn-secondary btn-small', type: 'button' },
      cb.connectBusy ? 'Opening wallet picker…' : 'Connect NEAR wallet') as HTMLButtonElement;
    btn.disabled = cb.connectBusy;
    btn.addEventListener('click', cb.onConnect);
    const createLink = h('a', {
      class: 'btn btn-ghost btn-small',
      href: WALLET_CREATE_URL[state.network],
      target: '_blank', rel: 'noopener',
    }, state.network === 'testnet' ? 'Create a free testnet account' : 'Create a NEAR account');
    card.append(h('div', { class: 'wallet-actions' }, btn, createLink));
  }
  return card;
}

export function renderHowItWorks(): HTMLElement {
  return h('section', { class: 'card how-card', 'aria-label': 'How NearSplit works' },
    h('h3', { class: 'section-title' }, 'How it works'),
    h('ol', { class: 'how-list' },
      h('li', {}, 'Create a split: title, total in NEAR, who is in. Shares are calculated exactly — down to the last yocto.'),
      h('li', {}, 'Send each person their personal pay link. No app install, no sign-up for them.'),
      h('li', {}, 'They open the link, connect their NEAR wallet (Meteor, Intear, HOT, … via NEAR Connect), and pay their exact share to you in one tap. The payment settles on NEAR and shows up on NearBlocks.'),
    ),
    h('p', { class: 'hint' },
      'NearSplit has no backend and never touches your keys — payments go wallet-to-wallet on NEAR. Splits are stored only on this device; the pay links carry the bill details.'),
  );
}
