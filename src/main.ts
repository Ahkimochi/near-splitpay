// NearSplit — app entry, hash router, NEAR wallet bootstrap.

// Wallet connections run through NEAR Connect (@hot-labs/near-connect):
// a popup wallet picker on this page — no redirect, no Node shims needed.

import './style.css';
import { h, clear, toast } from './ui';
import {
  initNear,
  isSignedIn,
  signedInAccountId,
  fetchBalanceYocto,
  connectWallet,
  signOut as walletSignOut,
} from './wallet';
import {
  loadSplits,
  upsertSplit,
  deleteSplit as storeDeleteSplit,
  loadNetwork,
  saveNetwork,
  newSplitId,
} from './store';
import { decodeSharePayload, freshSuffix } from './links';
import { renderWalletCard, renderHowItWorks } from './views/home';
import { renderSplitCard } from './views/splitList';
import { renderCreateForm } from './views/create';
import { renderSplitDetail } from './views/detail';
import { renderPayView } from './views/pay';
import { shortenAccountId } from './validate';
import type { NetworkId, Split, WalletState } from './types';

const app = document.getElementById('app');
if (!app) throw new Error('Missing #app element');

// ---------------------------------------------------------------------------
// Wallet state
// ---------------------------------------------------------------------------

const wallet: WalletState = {
  network: loadNetwork(),
  signedIn: false,
};

let connectBusy = false;

async function refreshWallet(): Promise<void> {
  try {
    await initNear(wallet.network);
    wallet.signedIn = isSignedIn();
    wallet.accountId = wallet.signedIn ? signedInAccountId() : undefined;
    wallet.balanceYocto = wallet.signedIn
      ? ((await fetchBalanceYocto()) ?? undefined)
      : undefined;
  } catch {
    // RPC unreachable etc. — the app still works for creating/sharing splits.
    wallet.signedIn = false;
  }
  render();
}

async function handleConnect(): Promise<void> {
  connectBusy = true;
  render();
  try {
    await initNear(wallet.network);
    // NEAR Connect opens its wallet-picker popup on this page and resolves
    // when the user has signed in — no redirect, so the current route
    // (including a pay link) is untouched.
    await connectWallet();
    await refreshWallet();
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    toast(
      message.toLowerCase().includes('reject')
        ? 'Wallet connection cancelled — nothing was connected.'
        : message || 'Could not open the wallet picker.',
      'error',
    );
  } finally {
    connectBusy = false;
    render();
  }
}

function handleSignOut(): void {
  void walletSignOut();
  wallet.signedIn = false;
  wallet.accountId = undefined;
  wallet.balanceYocto = undefined;
  toast('Wallet disconnected', 'info');
  render();
}

async function handleSwitchNetwork(next: NetworkId): Promise<void> {
  if (next === wallet.network) return;
  wallet.network = next;
  saveNetwork(next);
  wallet.signedIn = false;
  wallet.accountId = undefined;
  wallet.balanceYocto = undefined;
  await refreshWallet();
}

// ---------------------------------------------------------------------------
// Routing
// ---------------------------------------------------------------------------

type Route =
  | { name: 'home' }
  | { name: 'create' }
  | { name: 'split'; id: string }
  | { name: 'pay'; encoded: string }
  | { name: 'notfound' };

function parseRoute(): Route {
  const hash = location.hash || '#/';
  if (hash === '#/' || hash === '#') return { name: 'home' };
  if (hash === '#/create') return { name: 'create' };
  const splitMatch = hash.match(/^#\/split\/([a-z0-9]+)$/i);
  if (splitMatch) return { name: 'split', id: splitMatch[1]! };
  const payMatch = hash.match(/^#\/pay\/([A-Za-z0-9_-]+)$/);
  if (payMatch) return { name: 'pay', encoded: payMatch[1]! };
  return { name: 'notfound' };
}

function navigate(hash: string): void {
  if (location.hash === hash) render();
  else location.hash = hash;
}

// ---------------------------------------------------------------------------
// Split actions
// ---------------------------------------------------------------------------

function handleCreate(split: Split): void {
  upsertSplit(split);
  navigate(`#/split/${split.id}`);
}

function handleTogglePaid(split: Split, participantId: string): void {
  const splits = loadSplits();
  const target = splits.find((s) => s.id === split.id);
  if (!target) return;
  const participant = target.participants.find((p) => p.id === participantId);
  if (!participant) return;
  participant.paid = !participant.paid;
  participant.paidVia = participant.paid ? 'manual' : undefined;
  participant.paidAt = participant.paid ? new Date().toISOString() : undefined;
  participant.txHash = participant.paid ? participant.txHash : undefined;
  upsertSplit(target);
  render();
}

function handleClone(split: Split): void {
  const clone: Split = {
    ...split,
    id: `${newSplitId()}${freshSuffix()}`.slice(0, 11),
    title: split.title,
    participants: split.participants.map((p) => ({
      ...p,
      paid: false,
      paidVia: undefined,
      txHash: undefined,
      paidAt: undefined,
    })),
    createdAt: new Date().toISOString(),
  };
  upsertSplit(clone);
  toast('Cloned — a fresh copy with all shares unpaid', 'success');
  navigate(`#/split/${clone.id}`);
}

function handleDelete(split: Split): void {
  storeDeleteSplit(split.id);
  toast('Split deleted', 'info');
  navigate('#/');
}

// ---------------------------------------------------------------------------
// Views
// ---------------------------------------------------------------------------

function renderHeader(): HTMLElement {
  const testnetBtn = h('button', {
    type: 'button',
    class: `seg-btn ${wallet.network === 'testnet' ? 'seg-btn-active' : ''}`,
  }, 'Testnet') as HTMLButtonElement;
  testnetBtn.addEventListener('click', () => void handleSwitchNetwork('testnet'));
  const mainnetBtn = h('button', {
    type: 'button',
    class: `seg-btn ${wallet.network === 'mainnet' ? 'seg-btn-active' : ''}`,
  }, 'Mainnet') as HTMLButtonElement;
  mainnetBtn.addEventListener('click', () => void handleSwitchNetwork('mainnet'));

  return h('header', { class: 'app-header' },
    h('a', { class: 'brand', href: '#/' },
      h('span', { class: 'brand-mark', 'aria-hidden': 'true' }, '◐'),
      h('span', { class: 'brand-name' }, 'Near', h('span', { class: 'brand-accent' }, 'Split')),
    ),
    h('div', { class: 'header-right' },
      h('div', { class: 'seg', role: 'group', 'aria-label': 'Network' }, testnetBtn, mainnetBtn),
      wallet.signedIn && wallet.accountId
        ? h('span', { class: 'net-badge' }, shortenAccountId(wallet.accountId))
        : h('span', { class: 'net-badge net-badge-off' }, 'Not connected'),
    ),
  );
}

function renderFooter(): HTMLElement {
  return h('footer', { class: 'app-footer' },
    h('p', {}, 'NearSplit splits bills in NEAR. Payments go wallet-to-wallet on the NEAR blockchain — NearSplit never sees your keys.'),
    h('p', { class: 'muted small' }, 'Splits are stored only on this device. Pay links contain the bill details, so treat them like the bill itself.'),
  );
}

function renderHome(main: HTMLElement): void {
  main.append(renderWalletCard(wallet, {
    onConnect: () => void handleConnect(),
    onSignOut: handleSignOut,
    connectBusy,
  }));

  const createBtn = h('button', { type: 'button', class: 'btn btn-primary btn-block' },
    '+ Create a split') as HTMLButtonElement;
  createBtn.addEventListener('click', () => navigate('#/create'));
  main.append(createBtn);

  main.append(h('h2', { class: 'section-title splits-heading' }, 'My splits'));
  const splits = loadSplits();
  if (splits.length === 0) {
    main.append(
      h('div', { class: 'card empty-state' },
        h('div', { class: 'empty-emoji', 'aria-hidden': 'true' }, '🧾'),
        h('h3', {}, 'No splits yet'),
        h('p', { class: 'muted' },
          'Split a dinner, a taxi, or the rent. Everyone gets a personal pay link and pays their share in NEAR in one tap.'),
      ),
    );
  } else {
    const list = h('div', { class: 'split-list' });
    for (const split of splits) {
      list.append(renderSplitCard(split, (id) => navigate(`#/split/${id}`)));
    }
    main.append(list);
  }

  main.append(renderHowItWorks());
}

function render(): void {
  if (!app) return;
  clear(app);
  const route = parseRoute();
  const main = h('main', { class: 'app-main', id: 'main' });
  app.append(renderHeader(), main, renderFooter());

  switch (route.name) {
    case 'home':
      renderHome(main);
      break;
    case 'create':
      main.append(renderCreateForm(wallet, handleCreate, () => navigate('#/')));
      break;
    case 'split': {
      const split = loadSplits().find((s) => s.id === route.id);
      if (!split) {
        main.append(
          h('div', { class: 'card empty-state' },
            h('h3', {}, 'Split not found'),
            h('p', { class: 'muted' },
              'This split is not stored on this device. Splits live in this browser only — open NearSplit on the device where you created it.'),
            (() => {
              const b = h('button', { type: 'button', class: 'btn btn-primary' }, 'Go to my splits') as HTMLButtonElement;
              b.addEventListener('click', () => navigate('#/'));
              return b;
            })(),
          ),
        );
        break;
      }
      main.append(renderSplitDetail(split, {
        onTogglePaid: handleTogglePaid,
        onClone: handleClone,
        onDelete: handleDelete,
        onBack: () => navigate('#/'),
      }));
      break;
    }
    case 'pay': {
      const payload = decodeSharePayload(route.encoded);
      if (!payload) {
        main.append(
          h('div', { class: 'card empty-state' },
            h('h3', {}, 'This pay link looks broken'),
            h('p', { class: 'muted' },
              'The link may have been cut off while sharing. Ask the organizer to copy and send it again.'),
            (() => {
              const b = h('button', { type: 'button', class: 'btn btn-primary' }, 'Go to my splits') as HTMLButtonElement;
              b.addEventListener('click', () => navigate('#/'));
              return b;
            })(),
          ),
        );
        break;
      }
      main.append(renderPayView(payload, wallet, {
        onBack: () => navigate('#/'),
        onConnect: () => {
          // If the app is on the wrong network, align it with the link
          // first so the sign-in happens against the right network.
          if (wallet.network !== payload.net) {
            void handleSwitchNetwork(payload.net).then(() => handleConnect());
          } else {
            void handleConnect();
          }
        },
        onSwitchNetwork: () => void handleSwitchNetwork(payload.net),
        refreshWallet,
      }));
      break;
    }
    default:
      main.append(
        h('div', { class: 'card empty-state' },
          h('h3', {}, 'Page not found'),
          h('p', { class: 'muted' }, 'This address does not match any NearSplit page.'),
        ),
      );
  }
  window.scrollTo({ top: 0 });
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

render();
window.addEventListener('hashchange', render);

// Restore any existing NEAR Connect wallet session for the active
// network, then re-render with the real connection state.
void refreshWallet();
