// Unit tests for NearSplit's pure modules, run against the REAL TypeScript
// sources (compiled on the fly with the esbuild that ships with Vite — no
// extra dependencies) and the REAL near-api-js format converters.
//
// Covers: split math exactness (equal + remainder, custom validation, tip),
// NEAR account-id validation, pay-link encode/decode round-trip, and
// yocto parse/format round-trips (ours + near-api-js's).
//
// Run: node scripts/unit.mjs   (or: npm run test:unit)
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { build } from 'esbuild';
import * as nearApi from 'near-api-js';

// --- tiny localStorage/sessionStorage stubs (store.ts + links.ts use them)
const mem = () => {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
  };
};
globalThis.localStorage = mem();
globalThis.sessionStorage = mem();

// --- compile the pure TS modules to one ESM bundle and import it
const outDir = mkdtempSync(join(tmpdir(), 'nearsplit-unit-'));
const entry = join(outDir, 'entry.ts');
writeFileSync(entry, `
export * from ${JSON.stringify(new URL('../src/money.ts', import.meta.url).pathname)};
export * from ${JSON.stringify(new URL('../src/validate.ts', import.meta.url).pathname)};
export * from ${JSON.stringify(new URL('../src/links.ts', import.meta.url).pathname)};
`);
const bundlePath = join(outDir, 'bundle.mjs');
await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'neutral', outfile: bundlePath, logLevel: 'silent' });
const M = await import(bundlePath);

// --- harness
let failures = 0;
let total = 0;
const check = (name, ok, extra = '') => {
  total++;
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? ' — ' + extra : ''}`);
};
const eq = (a, b) => JSON.stringify(a, (_k, v) => (typeof v === 'bigint' ? `bigint:${v}` : v)) ===
  JSON.stringify(b, (_k, v) => (typeof v === 'bigint' ? `bigint:${v}` : v));

// === Split math: equal shares + remainder distribution =====================
{
  const shares = M.equalShares(100n, 3);
  check('equal 100/3 sums exactly', M.sumYocto(shares) === 100n, shares.join(','));
  check('equal 100/3 remainder goes to first shares', eq(shares, [34n, 33n, 33n]));

  // 10 NEAR among 3 people — the classic repeating-decimal case, in yocto.
  const total = 10n * M.YOCTO_PER_NEAR;
  const s3 = M.equalShares(total, 3);
  check('equal 10 NEAR / 3 sums exactly to total', M.sumYocto(s3) === total);
  check('equal 10 NEAR / 3 differs by at most 1 yocto',
    s3.every((s) => s === s3[0] || s === s3[0] - 1n));

  const one = M.equalShares(7n, 1);
  check('equal split for 1 person is the total', eq(one, [7n]));
  check('equal split for 0 people is empty', eq(M.equalShares(7n, 0), []));

  // Awkward total: 1 yocto among 4 people.
  const tiny = M.equalShares(1n, 4);
  check('equal 1 yocto / 4 sums exactly', M.sumYocto(tiny) === 1n, tiny.join(','));
}

// === Split math: custom validation (the rule the create form enforces) =====
{
  const total = M.parseNearToYocto('10');
  const good = ['4', '3.5', '2.5'].map((v) => M.parseNearToYocto(v));
  check('custom shares summing to total validate', M.sumYocto(good) === total);
  const bad = ['4', '3.5', '2.4'].map((v) => M.parseNearToYocto(v));
  check('custom shares off by 0.1 NEAR are rejected', M.sumYocto(bad) !== total);
  check('zero/negative-ish custom amounts parse to <= 0 and are rejected by the form rule',
    M.parseNearToYocto('0') === 0n && M.parseNearToYocto('-1') === null);
}

// === Tip ====================================================================
{
  const base = M.parseNearToYocto('10');
  check('tip 0% leaves total unchanged', M.applyTip(base, 0) === base);
  check('tip 10% on 10 NEAR = 11 NEAR', M.applyTip(base, 10) === M.parseNearToYocto('11'));
  const tipped = M.applyTip(M.parseNearToYocto('3.33'), 15);
  const shares = M.equalShares(tipped, 3);
  check('tipped total still splits exactly', M.sumYocto(shares) === tipped);
}

// === NEAR account-id validation =============================================
{
  const valid = [
    'alice.near', 'alice.testnet', 'my-team_1.testnet', 'a.b.c.near', 'ab',
    '0'.repeat(64), '0123456789abcdef'.repeat(4), 'near', 'x-y_z.near',
  ];
  const invalid = [
    '', 'a', 'Alice.near', 'ALICE.near', 'alice..near', '.alice.near', 'alice.near.',
    '-alice.near', 'alice-.near', '_alice.near', 'alice_.near', 'alice near',
    'alice@near', 'a'.repeat(65), 'élice.near', 'alice.near ', ' alice.near',
  ];
  check('valid account ids accepted', valid.every((v) => M.isValidNearAccountId(v)),
    valid.filter((v) => !M.isValidNearAccountId(v)).join(','));
  check('invalid account ids rejected', invalid.every((v) => !M.isValidNearAccountId(v)),
    invalid.filter((v) => M.isValidNearAccountId(v)).join(','));
  check('implicit account detected', M.isImplicitAccountId('0123456789abcdef'.repeat(4)));
  check('named account is not implicit', !M.isImplicitAccountId('alice.near'));
  check('normalize lowercases + trims', M.normalizeNearAccountId('  Alice.Testnet ') === 'alice.testnet');
}

// === Pay-link encode/decode round-trip ======================================
{
  const split = {
    id: 'k7x3abcd', title: 'Dinner — ünïcode 🍜', organizer: 'Bima',
    nearAccount: 'bima.testnet', network: 'testnet',
    totalYocto: (3n * M.YOCTO_PER_NEAR).toString(), tipPercent: 10, mode: 'equal',
    participants: [
      { id: '0', name: 'Bima', shareYocto: M.YOCTO_PER_NEAR.toString(), paid: false },
      { id: '1', name: 'Sinta', shareYocto: M.YOCTO_PER_NEAR.toString(), paid: false },
      { id: '2', name: 'Raka', shareYocto: M.YOCTO_PER_NEAR.toString(), paid: false },
    ],
    createdAt: new Date().toISOString(),
  };
  const payload = M.buildSharePayload(split, 1);
  check('payload ref format', payload.ref === 'NSP-K7X3-2', payload.ref);
  const decoded = M.decodeSharePayload(M.encodeSharePayload(payload));
  check('pay-link round-trip preserves payload', eq(decoded, payload));
  check('round-trip keeps unicode title', decoded?.t === 'Dinner — ünïcode 🍜');
  check('round-trip keeps yocto strings exact', decoded?.amt === M.YOCTO_PER_NEAR.toString());
  check('garbage link decodes to null', M.decodeSharePayload('not-a-real-link!!!') === null);
  check('tampered account decodes to null', (() => {
    const bad = { ...payload, a: 'NOT AN ACCOUNT' };
    return M.decodeSharePayload(M.encodeSharePayload(bad)) === null;
  })());
  check('wrong version decodes to null', (() => {
    const bad = { ...payload, v: 2 };
    return M.decodeSharePayload(M.encodeSharePayload(bad)) === null;
  })());
}

// === Yocto parse/format round-trips (ours) ==================================
{
  const cases = ['0', '1', '0.5', '12.25', '1000000', '0.00001', '3.333333333333333333333333'];
  check('parse/format round-trip (full precision)',
    cases.every((c) => M.yoctoToInput(M.parseNearToYocto(c)) === c),
    cases.map((c) => `${c}->${M.yoctoToInput(M.parseNearToYocto(c))}`).join(' '));
  check('parse accepts comma decimal separator', M.parseNearToYocto('1,5') === M.parseNearToYocto('1.5'));
  check('parse rejects >24 decimals (sub-yocto)', M.parseNearToYocto('0.0000000000000000000000001') === null);
  check('parse rejects junk', ['abc', '1.2.3', '', ' ', 'NEAR 5', '1e3'].every((v) => M.parseNearToYocto(v) === null));
  check('format groups thousands', M.formatYocto(M.parseNearToYocto('1234.5')) === '1,234.5');
  check('format trims to 5 frac digits by default', M.formatYocto(M.parseNearToYocto('0.333333333')) === '0.33333');
  check('formatNear adds unit', M.formatNear(M.parseNearToYocto('2')) === '2 NEAR');
}

// === near-api-js format converters (the real dependency) ====================
{
  const { parseNearAmount, formatNearAmount } = nearApi.utils.format;
  check('near-api-js parseNearAmount("1.5")', parseNearAmount('1.5') === (15n * 10n ** 23n).toString(), parseNearAmount('1.5'));
  check('near-api-js parse/format agree with ours on 3.25 NEAR',
    parseNearAmount('3.25') === M.parseNearToYocto('3.25').toString() &&
    formatNearAmount(parseNearAmount('3.25')) === '3.25');
  check('near-api-js parseNearAmount("") -> null', parseNearAmount('') === null);
  // Documented quirk (verified): near-api-js does NOT validate non-numeric
  // input — parseNearAmount('abc') returns 'abc000…'. That is exactly why
  // NearSplit validates user input with its own strict parser (money.ts)
  // and only relies on near-api-js's converters for well-formed amounts.
  check('near-api-js parseNearAmount is unsafe on junk (hence our own parser)',
    parseNearAmount('abc') === 'abc000000000000000000000000' && M.parseNearToYocto('abc') === null);
  const roundTrips = ['0.1', '1', '42.42', '0.00001'];
  check('near-api-js round-trips typical amounts',
    roundTrips.every((v) => formatNearAmount(parseNearAmount(v)) === v));
}

console.log(`\n${total - failures}/${total} checks passed`);
process.exit(failures ? 1 : 0);
