// Personal pay links: the full share payload is encoded into the URL hash
// (#/pay/<base64url-json>) so links work with no backend and no accounts.
// Unicode-safe: the JSON is UTF-8 encoded before base64.

import type { SharePayload, Split } from './types';
import { isValidNearAccountId } from './validate';
import { randomCode } from './store';

/** Per-share reference code, e.g. "NSP-K7X3-1" (1-based participant index). */
export function shareRef(splitId: string, index: number): string {
  return `NSP-${splitId.slice(0, 4).toUpperCase()}-${index + 1}`;
}

export function buildSharePayload(split: Split, index: number): SharePayload {
  const participant = split.participants[index]!;
  return {
    v: 1,
    id: split.id,
    t: split.title,
    o: split.organizer,
    a: split.nearAccount,
    net: split.network,
    tot: split.totalYocto,
    amt: participant.shareYocto,
    n: participant.name,
    ref: shareRef(split.id, index),
    cnt: split.participants.length,
    all: split.participants.map((p) => p.name),
  };
}

export function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function fromBase64Url(encoded: string): string {
  const b64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** Encode a payload as the route param used in pay links. */
export function encodeSharePayload(payload: SharePayload): string {
  return toBase64Url(JSON.stringify(payload));
}

/** Absolute URL of the pay view for a participant (keeps current path/host). */
export function shareUrl(split: Split, index: number): string {
  const encoded = encodeSharePayload(buildSharePayload(split, index));
  const base = `${location.origin}${location.pathname}`;
  return `${base}#/pay/${encoded}`;
}

const YOCTO_RE = /^\d+$/;

/** Decode and validate a share payload from the route param. Null if invalid. */
export function decodeSharePayload(encoded: string): SharePayload | null {
  try {
    const parsed = JSON.parse(fromBase64Url(encoded)) as SharePayload;
    if (!parsed || parsed.v !== 1) return null;
    if (typeof parsed.id !== 'string' || typeof parsed.t !== 'string') return null;
    if (typeof parsed.o !== 'string' || typeof parsed.n !== 'string') return null;
    if (!isValidNearAccountId(parsed.a)) return null;
    if (parsed.net !== 'testnet' && parsed.net !== 'mainnet') return null;
    if (typeof parsed.tot !== 'string' || !YOCTO_RE.test(parsed.tot)) return null;
    if (typeof parsed.amt !== 'string' || !YOCTO_RE.test(parsed.amt)) return null;
    if (!Array.isArray(parsed.all)) return null;
    return parsed;
  } catch {
    return null;
  }
}

// Note: an earlier build stashed the pay payload in sessionStorage to
// survive the MyNearWallet full-page sign-in redirect. NEAR Connect's
// popup flow never leaves the page, so no stash is needed anymore — the
// payload simply stays in the URL hash where it started.

/** A short-lived unique marker for cloned splits (keeps ids collision-free). */
export function freshSuffix(): string {
  return randomCode(3).toLowerCase();
}
