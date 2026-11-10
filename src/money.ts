// Money handling: NEAR amounts are yoctoNEAR (1 NEAR = 10^24 yocto).
// Yocto values exceed Number.MAX_SAFE_INTEGER, so ALL math is BigInt and
// amounts travel as decimal strings. No floating point anywhere.

export const YOCTO_PER_NEAR = 10n ** 24n;
export const NEAR_DECIMALS = 24;

/**
 * Parse a user-typed NEAR amount ("12.5", "12,50", ".5") into yoctoNEAR.
 * Returns null for empty/invalid/negative input or more than 24 decimals.
 * Pure BigInt arithmetic.
 */
export function parseNearToYocto(input: string): bigint | null {
  if (typeof input !== 'string') return null;
  const s = input.trim().replace(/\s/g, '').replace(',', '.');
  if (!s) return null;
  if (!/^\d*(\.\d*)?$/.test(s)) return null;
  if (s === '.') return null;
  const [intPartRaw, fracPartRaw = ''] = s.split('.');
  const intPart = intPartRaw === '' ? '0' : intPartRaw;
  if (fracPartRaw.length > NEAR_DECIMALS) return null; // more precise than 1 yocto
  const frac = fracPartRaw.padEnd(NEAR_DECIMALS, '0');
  try {
    return BigInt(intPart) * YOCTO_PER_NEAR + (frac ? BigInt(frac) : 0n);
  } catch {
    return null;
  }
}

/**
 * Format yoctoNEAR for display: grouped integer part, fraction trimmed of
 * trailing zeros but capped at `maxFrac` digits (default 5, so typical
 * shares stay readable: "0.33333"). Display only — never used for payments.
 */
export function formatYocto(yocto: bigint | string, maxFrac = 5): string {
  const value = typeof yocto === 'bigint' ? yocto : BigInt(yocto);
  const negative = value < 0n;
  const abs = negative ? -value : value;
  const intPart = abs / YOCTO_PER_NEAR;
  const fracPart = abs % YOCTO_PER_NEAR;
  const intStr = intPart.toLocaleString('en-US');
  let fracStr = '';
  if (fracPart > 0n) {
    const full = fracPart.toString().padStart(NEAR_DECIMALS, '0');
    fracStr = '.' + full.slice(0, maxFrac).replace(/0+$/, '');
    if (fracStr === '.') fracStr = '';
  }
  return `${negative ? '-' : ''}${intStr}${fracStr}`;
}

/** Format yoctoNEAR with the unit: "1.5 NEAR". */
export function formatNear(yocto: bigint | string): string {
  return `${formatYocto(yocto)} NEAR`;
}

/** Full-precision NEAR decimal string for a yocto amount (inputs, payloads).
 *  No thousands grouping — this string must re-parse exactly. */
export function yoctoToInput(yocto: bigint | string): string {
  const value = typeof yocto === 'bigint' ? yocto : BigInt(yocto);
  const negative = value < 0n;
  const abs = negative ? -value : value;
  const intPart = abs / YOCTO_PER_NEAR;
  const fracPart = abs % YOCTO_PER_NEAR;
  let fracStr = '';
  if (fracPart > 0n) {
    fracStr = '.' + fracPart.toString().padStart(NEAR_DECIMALS, '0').replace(/0+$/, '');
  }
  return `${negative ? '-' : ''}${intPart.toString()}${fracStr}`;
}

/**
 * Split `totalYocto` equally among `n` people. Remainder yocto units are
 * distributed one each to the first participants, so shares always sum
 * exactly to the total.
 */
export function equalShares(totalYocto: bigint, n: number): bigint[] {
  if (n <= 0) return [];
  const count = BigInt(n);
  const base = totalYocto / count;
  const remainder = totalYocto - base * count;
  return Array.from({ length: n }, (_, i) => base + (BigInt(i) < remainder ? 1n : 0n));
}

/** Apply a tip percentage on top of a base total (rounded to whole yocto). */
export function applyTip(baseYocto: bigint, tipPercent: number): bigint {
  return (baseYocto * BigInt(100 + tipPercent)) / 100n;
}

/** Sum a list of yocto amounts. */
export function sumYocto(amounts: Array<bigint | string>): bigint {
  return amounts.reduce<bigint>((acc, a) => acc + BigInt(a), 0n);
}
