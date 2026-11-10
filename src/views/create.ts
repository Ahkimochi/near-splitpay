// Create-a-split form. Returns the form element; calls onCreate with a
// validated Split when the user saves.

import { h, toast } from '../ui';
import { applyTip, equalShares, formatNear, parseNearToYocto } from '../money';
import { isValidNearAccountId, normalizeNearAccountId } from '../validate';
import { newSplitId } from '../store';
import type { Participant, Split, WalletState } from '../types';

interface ParticipantRow {
  name: HTMLInputElement;
  amount: HTMLInputElement;
  row: HTMLElement;
}

export function renderCreateForm(
  wallet: WalletState,
  onCreate: (split: Split) => void,
  onCancel: () => void,
): HTMLElement {
  let mode: 'equal' | 'custom' = 'equal';
  const rows: ParticipantRow[] = [];

  const root = h('section', { class: 'view' });

  // --- basic fields -------------------------------------------------------
  const titleInput = h('input', {
    class: 'input', type: 'text', id: 'f-title', maxlength: '80',
    placeholder: 'Team dinner at Warung Sari', autocomplete: 'off',
  }) as HTMLInputElement;
  const organizerInput = h('input', {
    class: 'input', type: 'text', id: 'f-organizer', maxlength: '40',
    placeholder: 'Your name', autocomplete: 'off',
  }) as HTMLInputElement;
  const totalInput = h('input', {
    class: 'input', type: 'text', id: 'f-total', inputmode: 'decimal',
    placeholder: '0.00', autocomplete: 'off',
  }) as HTMLInputElement;
  const tipSelect = h('select', { class: 'input', id: 'f-tip' },
    h('option', { value: '0' }, 'No tip'),
    h('option', { value: '5' }, 'Tip 5%'),
    h('option', { value: '10' }, 'Tip 10%'),
    h('option', { value: '15' }, 'Tip 15%'),
    h('option', { value: '20' }, 'Tip 20%'),
  ) as HTMLSelectElement;

  const accountInput = h('input', {
    class: 'input mono', type: 'text', id: 'f-near-account', maxlength: '64',
    placeholder: 'yourname.testnet', autocomplete: 'off', spellcheck: 'false',
  }) as HTMLInputElement;
  if (wallet.signedIn && wallet.accountId) accountInput.value = wallet.accountId;

  // --- mode toggle ----------------------------------------------------------
  const equalBtn = h('button', { type: 'button', class: 'seg-btn seg-btn-active' }, 'Split equally') as HTMLButtonElement;
  const customBtn = h('button', { type: 'button', class: 'seg-btn' }, 'Custom amounts') as HTMLButtonElement;
  const setMode = (next: 'equal' | 'custom') => {
    mode = next;
    equalBtn.classList.toggle('seg-btn-active', next === 'equal');
    customBtn.classList.toggle('seg-btn-active', next === 'custom');
    rows.forEach((r) => {
      r.amount.style.display = next === 'custom' ? '' : 'none';
    });
    refreshPreview();
  };
  equalBtn.addEventListener('click', () => setMode('equal'));
  customBtn.addEventListener('click', () => setMode('custom'));

  // --- participants ---------------------------------------------------------
  const rowsContainer = h('div', { class: 'participant-rows' });

  const addRow = (name = '') => {
    const nameInput = h('input', {
      class: 'input', type: 'text', maxlength: '40', placeholder: 'Name',
      'aria-label': 'Participant name', autocomplete: 'off',
    }) as HTMLInputElement;
    nameInput.value = name;
    const amountInput = h('input', {
      class: 'input participant-amount', type: 'text', inputmode: 'decimal',
      placeholder: '0.00', 'aria-label': 'Custom amount', autocomplete: 'off',
    }) as HTMLInputElement;
    amountInput.style.display = 'none';
    const removeBtn = h('button', {
      type: 'button', class: 'btn btn-ghost btn-icon', 'aria-label': 'Remove participant',
    }, '✕') as HTMLButtonElement;
    const row = h('div', { class: 'participant-row' }, nameInput, amountInput, removeBtn);
    const entry: ParticipantRow = { name: nameInput, amount: amountInput, row };
    removeBtn.addEventListener('click', () => {
      const idx = rows.indexOf(entry);
      if (idx >= 0) rows.splice(idx, 1);
      row.remove();
      refreshPreview();
    });
    nameInput.addEventListener('input', refreshPreview);
    amountInput.addEventListener('input', refreshPreview);
    rows.push(entry);
    rowsContainer.append(row);
  };
  addRow('You');
  addRow('');
  addRow('');

  const addBtn = h('button', { type: 'button', class: 'btn btn-ghost' }, '+ Add person') as HTMLButtonElement;
  addBtn.addEventListener('click', () => {
    addRow('');
    const last = rows[rows.length - 1];
    last?.name.focus();
  });

  // --- summary / preview ------------------------------------------------------
  const preview = h('p', { class: 'form-preview muted', role: 'status' });
  const errorBox = h('p', { class: 'form-error', role: 'alert' });
  errorBox.style.display = 'none';

  function effectiveTotalYocto(): bigint | null {
    const base = parseNearToYocto(totalInput.value);
    if (base === null || base <= 0n) return null;
    const tip = Number(tipSelect.value) || 0;
    return applyTip(base, tip);
  }

  function refreshPreview(): void {
    const named = rows.filter((r) => r.name.value.trim().length > 0);
    const total = effectiveTotalYocto();
    if (total === null || named.length === 0) {
      preview.textContent = named.length === 0
        ? 'Add at least one person to split with.'
        : 'Enter the bill total to see the shares.';
      return;
    }
    if (mode === 'equal') {
      const shares = equalShares(total, named.length);
      preview.textContent = `${named.length} people · ${formatNear(shares[0]!)} each` +
        (shares.some((s) => s !== shares[0]) ? ' (rounded fairly)' : '') +
        ` · Total ${formatNear(total)}`;
    } else {
      preview.textContent = `Total ${formatNear(total)} — custom amounts must add up to it exactly.`;
    }
  }
  totalInput.addEventListener('input', refreshPreview);
  tipSelect.addEventListener('change', refreshPreview);
  accountInput.addEventListener('input', refreshPreview);

  function showError(message: string): void {
    errorBox.textContent = message;
    errorBox.style.display = '';
    errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // --- actions ------------------------------------------------------------------
  const saveBtn = h('button', { type: 'button', class: 'btn btn-primary btn-block' },
    'Create split & get pay links') as HTMLButtonElement;
  saveBtn.addEventListener('click', () => {
    errorBox.style.display = 'none';
    const title = titleInput.value.trim();
    if (!title) return showError('Give the bill a title, e.g. “Team dinner at Warung Sari”.');
    const organizer = organizerInput.value.trim();
    if (!organizer) return showError('Add your name so friends know who organized this split.');
    const total = effectiveTotalYocto();
    if (total === null) return showError('Enter a valid total amount in NEAR.');

    const nearAccount = normalizeNearAccountId(accountInput.value);
    if (!isValidNearAccountId(nearAccount)) {
      return showError(
        `The receiving NEAR account “${accountInput.value.trim()}” is not a valid account id. ` +
        'Named accounts are lowercase (e.g. yourname.testnet on testnet, yourname.near on mainnet); ' +
        'payments go to this account, so check it carefully.');
    }
    if (wallet.network === 'testnet' && !nearAccount.endsWith('.testnet') && nearAccount.includes('.')) {
      return showError('You are on Testnet — the receiving account should be a testnet account (… .testnet). Switch the network in the header for mainnet accounts.');
    }
    if (wallet.network === 'mainnet' && nearAccount.endsWith('.testnet')) {
      return showError('You are on Mainnet but the receiving account is a testnet account. Switch the network in the header to Testnet.');
    }

    const named = rows.filter((r) => r.name.value.trim().length > 0);
    if (named.length === 0) return showError('Add at least one person to split with.');
    const names = named.map((r) => r.name.value.trim());
    const duplicates = names.filter((n, i) => names.indexOf(n) !== i);
    if (duplicates.length > 0) {
      return showError(`“${duplicates[0]}” appears twice. Give everyone a unique name so their pay links stay personal.`);
    }

    let shareYoctos: bigint[];
    if (mode === 'equal') {
      shareYoctos = equalShares(total, named.length);
    } else {
      shareYoctos = [];
      for (const entry of named) {
        const parsed = parseNearToYocto(entry.amount.value);
        if (parsed === null || parsed <= 0n) {
          return showError(`Enter a valid amount for ${entry.name.value.trim()}.`);
        }
        shareYoctos.push(parsed);
      }
      const sum = shareYoctos.reduce((a, b) => a + b, 0n);
      if (sum !== total) {
        return showError(
          `Custom amounts add up to ${formatNear(sum)}, but the total is ${formatNear(total)}. ` +
          (sum < total ? `You are missing ${formatNear(total - sum)}.` : `That is ${formatNear(sum - total)} too much.`));
      }
    }

    const participants: Participant[] = named.map((_entry, i) => ({
      id: `${i}`,
      name: names[i]!,
      shareYocto: shareYoctos[i]!.toString(),
      paid: false,
    }));
    const split: Split = {
      id: newSplitId(),
      title,
      organizer,
      nearAccount,
      network: wallet.network,
      totalYocto: total.toString(),
      tipPercent: Number(tipSelect.value) || 0,
      mode,
      participants,
      createdAt: new Date().toISOString(),
    };
    toast('Split created 🎉', 'success');
    onCreate(split);
  });

  const cancelBtn = h('button', { type: 'button', class: 'btn btn-ghost' }, 'Cancel') as HTMLButtonElement;
  cancelBtn.addEventListener('click', onCancel);

  root.append(
    h('h2', { class: 'view-title' }, 'Split a bill'),
    h('p', { class: 'hint' },
      `This split lives on ${wallet.network === 'testnet' ? 'NEAR Testnet' : 'NEAR Mainnet'} — the network selected in the header.`),
    h('div', { class: 'field' },
      h('label', { class: 'label', for: 'f-title' }, 'What is this bill for?'),
      titleInput),
    h('div', { class: 'field' },
      h('label', { class: 'label', for: 'f-total' }, 'Total amount (NEAR)'),
      totalInput),
    h('div', { class: 'field' },
      h('label', { class: 'label', for: 'f-tip' }, 'Tip'),
      tipSelect,
      h('p', { class: 'hint' }, 'The tip is added on top of the total before splitting.')),
    h('div', { class: 'field' },
      h('label', { class: 'label', for: 'f-organizer' }, 'Your name (organizer)'),
      organizerInput),
    h('div', { class: 'field' },
      h('label', { class: 'label', for: 'f-near-account' }, 'Your NEAR account (receives every share)'),
      accountInput,
      h('p', { class: 'hint' }, wallet.signedIn
        ? 'Auto-filled from your connected wallet. Everyone pays their share directly to this account.'
        : 'Connect your wallet to auto-fill this, or type your NEAR account id. Everyone pays their share directly to this account.')),
    h('div', { class: 'field' },
      h('label', { class: 'label' }, 'Who is splitting?'),
      h('div', { class: 'seg', role: 'group', 'aria-label': 'Split mode' }, equalBtn, customBtn),
      rowsContainer,
      addBtn,
      h('p', { class: 'hint' }, 'Tip: include yourself if you also owe a share. Everyone gets their own personal pay link.')),
    preview,
    errorBox,
    h('div', { class: 'form-actions' }, cancelBtn, saveBtn),
  );

  refreshPreview();
  return root;
}
