// End-to-end smoke test (jsdom) of the BUILT app bundle, with no NEAR
// wallet connected. Exercises the real app code: home render -> network
// toggle -> create flow (equal split over yocto BigInt math) -> persistence
// -> split detail -> pay-link decode -> pay view in its not-connected state.
// Verifies the app never fakes a payment: with no wallet, the pay page
// offers only "Connect NEAR wallet" (NEAR Connect popup flow — the bundle
// must boot and render with the connector's manifest unreachable, as in
// this sandbox).
// Run: npm run build, then npm install --no-save jsdom && node scripts/smoke.mjs
import { readFileSync, readdirSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const bundleName = readdirSync(new URL('../dist/assets/', import.meta.url).pathname)
  .find((f) => f.endsWith('.js'));
const bundleCode = readFileSync(new URL(`../dist/assets/${bundleName}`, import.meta.url), 'utf8');

const dom = new JSDOM('<!doctype html><html><head></head><body><div id="app"></div></body></html>', {
  url: 'http://localhost/',
  runScripts: 'outside-only',
  pretendToBeVisual: true,
});
const { window } = dom;
const { document } = window;

const errors = [];
window.addEventListener('error', (e) => errors.push(String(e.message || e.error)));

window.eval(bundleCode);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await sleep(500);

let failures = 0;
let total = 0;
const check = (name, ok, extra = '') => {
  total++;
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? ' — ' + extra : ''}`);
};
const text = (sel) => document.querySelector(sel)?.textContent ?? '';

// --- Home -------------------------------------------------------------------
check('home renders brand', text('.brand-name').includes('Near'));
check('network toggle present with Testnet default',
  [...document.querySelectorAll('.seg-btn')].some((b) => b.textContent === 'Testnet' && b.classList.contains('seg-btn-active')));
check('wallet card shows not-connected state', text('.wallet-title').includes('No NEAR wallet connected'));
check('connect button offered on home',
  [...document.querySelectorAll('button')].some((b) => b.textContent.includes('Connect NEAR wallet')));
check('testnet account-creation link points at Intear (not MyNearWallet)',
  [...document.querySelectorAll('a')].some((a) => (a.getAttribute('href') ?? '').includes('intear')) &&
  ![...document.querySelectorAll('a')].some((a) => (a.getAttribute('href') ?? '').includes('mynearwallet')));
check('empty state shown', text('.empty-state h3').includes('No splits'));
check('how-it-works rendered', text('.how-card').includes('How it works'));

// --- Create flow --------------------------------------------------------------
const createBtn = [...document.querySelectorAll('button')].find((b) => b.textContent.includes('Create a split'));
createBtn.click();
await sleep(100);
check('create form opens', !!document.querySelector('#f-title'), window.location.hash);

const setVal = (sel, v) => {
  const el = document.querySelector(sel);
  el.value = v;
  el.dispatchEvent(new window.Event('input', { bubbles: true }));
};
setVal('#f-title', 'Team dinner at Warung Sari');
setVal('#f-organizer', 'Bima');
setVal('#f-total', '10');
setVal('#f-near-account', 'bima.testnet');
const nameInputs = [...document.querySelectorAll('.participant-row input')]
  .filter((i) => !i.classList.contains('participant-amount'));
['Bima', 'Sinta', 'Raka'].forEach((name, i) => {
  nameInputs[i].value = name;
  nameInputs[i].dispatchEvent(new window.Event('input', { bubbles: true }));
});
await sleep(50);
check('preview computes equal share (10 NEAR / 3, 5-digit display)',
  text('.form-preview').includes('3.33333'), text('.form-preview').trim());

const saveBtn = [...document.querySelectorAll('button')].find((b) => b.textContent.includes('Create split'));
saveBtn.click();
await sleep(100);
const splits = JSON.parse(window.localStorage.getItem('nearsplit.splits.v1') || '[]');
check('split persisted', splits.length === 1);
check('shares sum exactly to total in yocto (10 NEAR = 1e25)',
  splits.length === 1 &&
  splits[0].participants.reduce((a, p) => a + BigInt(p.shareYocto), 0n).toString() === '10000000000000000000000000',
  splits.length ? JSON.stringify(splits[0].participants.map((p) => p.shareYocto)) : '');
check('split records network + organizer account',
  splits.length === 1 && splits[0].network === 'testnet' && splits[0].nearAccount === 'bima.testnet');
check('navigated to split detail', window.location.hash.startsWith('#/split/'), window.location.hash);
check('detail view shows 3 participant cards', document.querySelectorAll('.participant-card').length === 3);
check('detail shows pay links hint', text('.view').includes('Pay links'));

// --- Pay link -> pay view, no wallet connected --------------------------------
const s = splits[0];
const payload = { v: 1, id: s.id, t: s.title, o: s.organizer, a: s.nearAccount, net: s.network,
  tot: s.totalYocto, amt: s.participants[1].shareYocto, n: s.participants[1].name,
  ref: 'NSP-' + s.id.slice(0, 4).toUpperCase() + '-2', cnt: 3, all: s.participants.map((p) => p.name) };
const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64')
  .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
window.location.hash = '#/pay/' + encoded;
await sleep(200);
check('pay view decodes link and shows share', text('.pay-share-amount').includes('3.33333'), text('.pay-share-amount').trim());
check('pay view names the participant', text('.pay-share-label').includes('Sinta'));
check('pay view shows organizer account', text('.pay-card').includes('bima.testnet'));
check('pay view offers Connect (no wallet -> no pay button, no fake payment)',
  [...document.querySelectorAll('.pay-actions button')].some((b) => b.textContent.includes('Connect NEAR wallet')) &&
  ![...document.querySelectorAll('.pay-actions button')].some((b) => b.textContent.startsWith('Pay ')));
check('pay view explains testnet honestly', text('.pay-note').includes('test funds'));
check('no runtime errors', errors.length === 0, errors.join(' | '));

console.log(`\n${total - failures}/${total} checks passed`);
window.close();
process.exit(failures || errors.length ? 1 : 0);
