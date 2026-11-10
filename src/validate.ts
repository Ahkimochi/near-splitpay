// NEAR account id validation.
//
// Rules (per NEAR docs / the account-id grammar enforced by nearcore):
//  - Named accounts: dot-separated segments; each segment is lowercase
//    letters, digits, '-' and '_', but may not start or end with '-' or '_'.
//    Total length 2-64 characters.
//  - Implicit accounts: exactly 64 lowercase hex characters (the account id
//    is the hex encoding of the public key).
// The submission API at nearhackathon.com uses the same grammar:
// ^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$ with length 2-64.

const NAMED_ACCOUNT_RE = /^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$/;
const IMPLICIT_ACCOUNT_RE = /^[0-9a-f]{64}$/;

/** True for a 64-char lowercase-hex implicit account id. */
export function isImplicitAccountId(accountId: string): boolean {
  return IMPLICIT_ACCOUNT_RE.test(accountId);
}

/**
 * True if the string is a syntactically valid NEAR account id.
 * Strict: the raw string must match the grammar exactly (no trimming) —
 * use normalizeNearAccountId() on user input first.
 */
export function isValidNearAccountId(accountId: string): boolean {
  if (typeof accountId !== 'string') return false;
  if (accountId.length < 2 || accountId.length > 64) return false;
  if (isImplicitAccountId(accountId)) return true;
  return NAMED_ACCOUNT_RE.test(accountId);
}

/** Normalize user input: trim + lowercase (account ids are lowercase-only). */
export function normalizeNearAccountId(accountId: string): string {
  return accountId.trim().toLowerCase();
}

/** Shorten an account id for display: "alice.te…ar" / implicit "0123…cdef". */
export function shortenAccountId(accountId: string): string {
  if (accountId.length <= 16) return accountId;
  return `${accountId.slice(0, 8)}…${accountId.slice(-4)}`;
}
