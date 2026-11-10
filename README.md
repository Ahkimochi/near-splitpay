# NearSplit — split any bill with friends, paid in NEAR

**NearSplit** turns bill splitting into a one-tap NEAR payment. The organizer
creates a split (dinner, taxi, rent, a group gift…), every participant gets
their own **personal pay link**, and each link opens a pay page where the
exact share is paid wallet-to-wallet to the organizer in one tap — a real
NEAR transfer, verifiable on NearBlocks.

Built for **NEAR HACKATHON** (nearhackathon.com) — tracks: **Real-World Money**
(`realworld`) + **Social Money** (`social`).

- **No backend, no accounts, no tracking.** Split data lives in the pay links
  themselves and in the organizer's browser (`localStorage`).
- **Testnet by default** (safe to try with test funds), one toggle switches
  the whole app — RPC, wallet, explorer — to mainnet.
- **Exact money math.** All amounts are yoctoNEAR (1 NEAR = 10²⁴ yocto)
  handled with BigInt as decimal strings. Shares always sum *exactly* to
  the total — no floating point anywhere.

## The problem

Splitting a group bill still means screenshots of receipts, bank-account
numbers in group chats, and one person chasing everyone for days. Crypto
should make this trivial — instant, near-free, verifiable settlement — but
only if nobody has to install anything or understand the chain. NearSplit
is that flow: a link, a wallet connect, one tap, settled on NEAR.

## What it does

- **Create a split** — title, total in NEAR, optional tip (0/5/10/15/20 %,
  added on top), organizer name, and the organizer's NEAR account id
  (auto-filled from the connected wallet, editable, and validated against
  the NEAR account-id grammar — named and 64-hex implicit accounts).
- **Equal or custom shares** — equal shares distribute the rounding
  remainder one yocto at a time so they sum exactly to the total; custom
  amounts must sum exactly to the total and the form shows the
  missing/excess amount when they don't.
- **Personal pay links** — `#/pay/<base64url-json>` encodes the split id,
  title, organizer, receiving account, network, total, that participant's
  share, the full roster, and a reference code (`NSP-XXXX-N`). Copy button
  and native share sheet (with copy fallback).
- **One-tap pay page** — big share amount, bill total, organizer account,
  roster, and progress. "Connect NEAR wallet" opens the NEAR Connect
  wallet picker (Meteor, Intear, HOT, …) right on the page — no redirect,
  the pay link never leaves the screen; "Pay X NEAR" then sends a real
  transfer, approved in the wallet. Success shows the transaction hash
  with a NearBlocks link. Rejections and errors (insufficient funds,
  cancelled in wallet, …) are explained in plain language.
- **Organizer tools** — "My Splits" list, per-participant status, manual
  mark-as-paid (e.g. someone paid cash), collected vs. outstanding summary,
  clone ("Split again") for repeat bills, and delete (with confirmation).
- **Network toggle** — Testnet/Mainnet switch in the header. A pay link
  carries its network; opening a mainnet link while on testnet (or the
  reverse) offers a one-tap switch instead of letting you pay on the
  wrong chain. The create form also rejects account/network mismatches
  (e.g. a `.testnet` account while on mainnet).
- **No fake payments, ever.** Without a connected wallet the pay page can
  only offer "Connect NEAR wallet" — there is no simulated or offline
  payment path anywhere in the app.

## Try it (judge walkthrough)

```bash
npm ci
npm run dev        # or: npm run build && npm run preview
```

1. Open the app — **see** the home screen: wallet card ("No NEAR wallet
   connected"), "+ Create a split", an empty "My splits", and How it works.
   The network toggle in the header is on **Testnet**.
2. Click **Connect NEAR wallet** — a wallet picker (NEAR Connect) pops up
   on the page. Pick a wallet that supports testnet — **Intear Wallet**
   ([wallet.intear.tech](https://wallet.intear.tech/)) or **Meteor
   Wallet** — and create a free testnet account inside it if you don't
   have one (it comes with test NEAR). Approve the connection in the
   wallet — **see** the picker close with your account id in the
   NearSplit header and your balance on the wallet card. You never leave
   the page: there is no redirect.
3. Click **+ Create a split**: title "Team dinner", total **10 NEAR**,
   your name, participants "You / Sinta / Raka" — **see** the preview:
   "3 people · 3.33333 NEAR each (rounded fairly) · Total 10 NEAR". Save —
   **see** the split detail with three pay links (shares of
   3.333…334 / 3.333…333 / 3.333…333 NEAR — they sum to exactly 10 NEAR).
4. Copy Sinta's pay link and open it (same or another browser) — **see**
   "Sinta, your share is 3.33333 NEAR", the organizer account, and a
   Connect button. Connect a (second) testnet wallet and click
   **Pay 3.33333 NEAR** — **see** the "You paid your share ✓" banner with a
   NearBlocks link; open it and **see** the real transfer on
   testnet.nearblocks.io to the organizer account.
5. Back in the organizer view, Sinta's row can be marked paid; the summary
   shows collected vs. outstanding updating.

## How NEAR is used (concretely)

Wallet connections run through **NEAR Connect**
(`@hot-labs/near-connect@0.12.0`), verified before coding from the
installed package's own TypeScript definitions
(`build/NearConnector.d.ts`, `build/types/index.d.ts`,
`build/actions/types.d.ts`). The exact calls used (all in
`src/wallet.ts`):

| Purpose | Call |
| --- | --- |
| Connector | `new NearConnector({ network: 'testnet' \| 'mainnet' })` — loads the wallet manifest (Meteor, Intear, HOT, …) and renders its own picker popup |
| Connect | `connector.connect()` → `Promise<NearWalletBase>` — opens the picker, runs the chosen wallet's `signIn({ network })`; closing the picker rejects with `Error("User rejected")` |
| Session restore | `connector.getConnectedWallet()` → `{ wallet, accounts }`, `accounts[0].accountId`; events `connector.on('wallet:signIn' \| 'wallet:signOut', …)` keep app state in sync |
| Disconnect | `connector.disconnect()` |
| Balance | JSON-RPC `view_account` against the network RPC via `fetch` → spendable = `amount − locked` (yocto string) — a plain read needs no SDK |
| Pay a share | `wallet.signAndSendTransaction({ receiverId: organizerAccount, actions: [{ type: 'Transfer', params: { deposit: shareYocto } }] })` → `FinalExecutionOutcome`; tx hash from `transaction_outcome.id` |
| Amount conversion | NearSplit's own strict BigInt parser in `src/money.ts` (user input is never trusted to library converters) |

Networks: testnet RPC `https://rpc.testnet.near.org`, mainnet RPC
`https://rpc.mainnet.near.org`; explorers `testnet.nearblocks.io` /
`nearblocks.io`. Switching networks signs the current session out and
rebuilds the connector for the new network.

### Why NEAR Connect (and not MyNearWallet)

The first NearSplit build connected wallets through MyNearWallet
(near-api-js `WalletConnection`, full-page redirect). **MyNearWallet was
sunset on 2026-10-31** — account creation, swaps and *new app
connections* are switched off, so that flow can no longer connect any
wallet, on any network. NearSplit therefore migrated to NEAR Connect —
the connector NEAR's own current frontend documentation uses. Bonus: the
popup flow never navigates away, so a pay link stays on screen while
connecting, and the `sessionStorage` stash the redirect flow needed to
protect the link could be deleted entirely.

## Architecture

- **Stack**: Vite 6 + TypeScript (vanilla DOM, no framework) +
  `@hot-labs/near-connect@0.12.0` as the only runtime dependency.
  Production bundle ≈ 94 kB JS (27 kB gzip) + 9 kB CSS.
- **No backend**: a split is just data. The organizer's copy lives in
  `localStorage` (`nearsplit.splits.v1`); each pay link carries its own
  copy of the share data in the URL hash, so links work on any device
  with no server and no sign-up. A payment made on a device is remembered
  there (`nearsplit.paid.v1`) and, when the split also lives on that
  device, the organizer's copy is updated with the tx hash too.
- **Consequence, stated honestly**: payment status does not sync across
  devices — there is no server to sync through. The real payment itself
  is on-chain and verifiable by anyone on NearBlocks; the organizer
  confirms from the explorer or marks shares paid manually. This is
  deliberate: zero infrastructure, zero data leaving the device, and
  links that keep working forever.
- **Code layout**: `src/wallet.ts` (all NEAR integration — NEAR Connect
  connector, session state, RPC balance, payments),
  `src/money.ts` (BigInt yocto math + strict parsing),
  `src/validate.ts` (NEAR account-id grammar), `src/links.ts` (pay-link
  encode/decode), `src/store.ts` (localStorage),
  `src/views/` (home, create, detail, pay), `src/main.ts` (hash router,
  network toggle, wallet bootstrap).

## Tests

```bash
npm run test:unit    # 47 checks: split math exactness (equal + remainder,
                     # custom-sum validation, tip), account-id validation,
                     # pay-link round-trip, yocto parse/format round-trips,
                     # and the wallet module's network config, explorer
                     # URLs, error mapping and no-session restore with the
                     # real @hot-labs/near-connect bundled in
npm run build
npm install --no-save jsdom && npm run test:smoke
                     # 21 checks: the built bundle end-to-end in jsdom —
                     # home -> create (10 NEAR / 3 sums exactly in yocto)
                     # -> persistence -> detail -> pay link -> pay view
                     # in its no-wallet state (Connect offered, no fake pay)
```

## Known limitation (honest)

The live wallet flow — NEAR Connect picker popup, the wallet's own
approval screen, and `signAndSendTransaction` — cannot be exercised
end-to-end from a headless sandbox: it needs a real browser and a real
(testnet) account in a real wallet (Intear/Meteor). The integration code
is strictly typed against the verified near-connect definitions, the
built bundle is smoke-tested (including booting with the connector's
wallet manifest unreachable), and the judge walkthrough above performs
the real payment on testnet in about a minute. First recommended
real-world check: one testnet payment of a small share after deploying
(see SUBMISSION.md).

## AI-use disclosure

NearSplit was built with the help of an AI coding assistant (as the
hackathon explicitly allows). The concept, product decisions and
submission are the author's; the assistant helped write and test the
code. The bill-splitting concept was first built by the same author as
"SplitPay" for the Nimiq Mini Apps Competition (a different chain and
competition); NearSplit is a fresh codebase for NEAR, reusing the proven
split math and link-encoding approach.

## License

MIT — see [LICENSE](LICENSE).
