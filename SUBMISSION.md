# NearSplit — NEAR HACKATHON Submission Pack

**Event:** NEAR HACKATHON — https://nearhackathon.com/
**Deadline:** **Saturday 2026-11-14, 23:59 UTC** (= Sunday 2026-11-15, 06:59 WIB)
**Tracks:** `realworld` (Real-World Money) + `social` (Social Money)
**App:** NearSplit — split any bill with friends; everyone pays their share in NEAR in one tap.

> ⚠️ **Submit ONCE per project/repository.** A second submission of the same
> repo is rejected (409). If anything in a saved submission is wrong, fix it
> via https://nearhackathon.com/request-changes — **never resubmit**.

---

## (a) Submission fields (form at https://nearhackathon.com/#apply)

| Field | Value |
| --- | --- |
| `projectName` | `NearSplit` |
| `leadName` | `[YOUR NAME OR PSEUDONYM]` — suggestion: `Ahkimochi` |
| `email` | `[YOUR EMAIL]` |
| `size` | `1` |
| `tracks` | `["realworld", "social"]` |
| `nearAddress` | `[YOUR MAINNET NEAR ACCOUNT]` — **must be a mainnet account** (e.g. `yourname.near`, or a 64-char implicit account). Prizes are paid in NEAR to this account. A `.testnet` account will NOT work for payout. Create one at https://app.mynearwallet.com/ if you don't have one yet. |
| `projectUrl` | `[PUBLIC REPO URL]` — e.g. `https://github.com/Ahkimochi/near-splitpay` |
| `demoUrl` | `[YOUR X DEMO POST URL]` — the post from step 5 below |
| `idea` | see section (b) — paste exactly, 986 characters (allowed: 20–2000) |
| `consent` | `true` — only after you agree to: "I agree that the organizers may use these details to review our submission and contact us about this hackathon." |

## (b) `idea` description (986 characters)

> Bill splitting still runs on receipt screenshots, bank details in group chats, and one person chasing everyone for days. NearSplit turns it into one link per person. The organizer enters a title, a total in NEAR, and who is splitting; NearSplit computes exact shares in yoctoNEAR (BigInt math with the remainder distributed, so shares sum exactly to the total), adds an optional tip, and generates a personal pay link for every participant — the bill data travels inside the link itself, so there is no backend, no sign-up, and nothing to install. Opening a link shows your share and the organizer's NEAR account; connect a NEAR wallet (via near-api-js) and pay in one tap. The payment is a wallet-to-wallet NEAR transfer that settles in seconds for a fraction of a cent, and both sides can verify it on NearBlocks. The organizer tracks collected vs. outstanding and can mark cash payments manually. NearSplit is programmable money at its most ordinary: group expenses, settled on NEAR.

## (c) X demo post — draft (post it yourself, attach a demo video or screenshots)

> Splitting a bill shouldn't mean screenshots, bank details in group chats, and chasing friends for days.
>
> So I built NearSplit at NEAR HACKATHON: create a split, send each friend their own pay link, and they pay their exact share in NEAR in one tap — wallet-to-wallet, settled in seconds, verifiable on NearBlocks. No backend, no sign-up.
>
> Try it: [LIVE DEMO URL]
> Code: [REPO URL]
>
> @NEARProtocol #NEARHackathon

Tips from the official HACKATHON.md: lead with the user problem (done),
show **one complete moment** in the video/screenshots (create a split →
open a pay link → connect → pay → NearBlocks confirmation), explain NEAR's
role concretely (done), end with a next step (links, done). Optional extra
tags for reach: @NearLegion, @NearBuilders.

## (d) Step-by-step checklist (in this order)

1. **Create a MAINNET NEAR account** (for the prize payout) at
   https://app.mynearwallet.com/ — write the account id into field
   `nearAddress` above. This is separate from any testnet account.
   (For trying the app itself, also create a free testnet account at
   https://testnet.mynearwallet.com/ — it comes with test NEAR.)
2. **Create the public GitHub repo**: new public repository (suggested name
   `near-splitpay`), then push this folder to it. The repo already contains
   the MIT `LICENSE`, `README.md`, and a `.gitignore` excluding
   `node_modules/` and `dist/`.
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/near-splitpay.git
   git push -u origin main
   ```
3. **Host the live demo (GitHub Pages)**: build and publish `dist/` — the
   Vite base is relative (`./`), so a project page works as-is. Fastest
   route (same as the Nimiq build): commit the built files to a `gh-pages`
   branch and set Settings → Pages → Deploy from a branch (`gh-pages`, `/`).
   Confirm the live URL shows the NearSplit home screen. Keep the demo up
   at least until results (18 Nov), ideally 25 Nov.
4. **Test one real testnet payment on the live URL**: create a testnet
   split, open a pay link in a second browser/profile, connect the testnet
   wallet, pay, and check the tx on testnet.nearblocks.io. (The wallet
   redirect flow can't be tested from the build sandbox — this is the
   first real end-to-end check.)
5. **Post the demo on X** from your own account using the draft in
   section (c): fill in the live demo + repo URLs, attach the video or
   screenshots, keep `@NEARProtocol` and `#NEARHackathon` in the text.
   Copy the post URL into `demoUrl`.
6. **Submit ONCE** at https://nearhackathon.com/#apply with the fields in
   section (a), before **Sat 2026-11-14 23:59 UTC**. Double-check the
   `nearAddress` character by character — it is the payout account.
7. **If anything is wrong afterwards**: do NOT submit again. Use
   https://nearhackathon.com/request-changes with the same email, NEAR
   account and repo link you submitted.

### Quick pre-submission sanity checks

- [ ] Live URL opens without errors; home screen renders; network toggle works.
- [ ] Creating a split and copying a pay link works on the live URL.
- [ ] One real testnet payment completed from a pay link; tx visible on NearBlocks.
- [ ] Repo is public and contains README.md + LICENSE (MIT).
- [ ] `nearAddress` is a MAINNET account you control (not `.testnet`).
- [ ] X demo post is public and contains @NEARProtocol + #NEARHackathon.
- [ ] Results are announced by 2026-11-18 23:59 UTC; prizes paid in NEAR within 30 days of results.
