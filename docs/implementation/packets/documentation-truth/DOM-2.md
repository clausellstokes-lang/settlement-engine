# DOM / DOM-2 — the derived edge-secret census, and the runbook that was missing 35 names

- **Status:** LANDED
- **Landed at:** `3aef7b7a`
- **Verified base:** `claude/composite-r4` at `30638bb77f188a6bc4a8017bc53c74b63a05cb71`
- **Train:** `dom`, family **DOM**, member **2**. It owns `docs/DEPLOY.md` OUTRIGHT
  (J-TC22-1), carrying DOM-1's gate-length line as a rider so all members stay path-disjoint.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§87.2** · **§88.4** (launch-blocking) ·
  **§115.1** (J-TC22-1 and J-TC22-3 signed) · **§120.3** (two more secrets join the census).
- **Compile of record:** `laneTC22-DOM-PLAN.md` §3.2, annex rows DOM.M11, DOM.M15..M18.

---

## §1 · THE DEFECT — A RUNBOOK AN OPERATOR CANNOT DEPLOY FROM

`docs/DEPLOY.md` listed **17** required secrets. The deployed edge functions read **53**
distinct environment names. An operator who sets exactly what the runbook lists deploys code
that reads the other 35 as empty strings, and the first failure is a paying user.

Measured at base, word-bounded: **26** consumed names have ZERO hits anywhere in `docs/`, and
**24** of those are absent from `.env.example` too. Seven are deploy-blocking, and
`STRIPE_PRICE_SURVEYOR` is the sharpest: unset it resolves to `''` and `create-checkout`
throws `Price ID not configured for surveyor` at the FIRST Surveyor purchase.

## §2 · ⚠ THE SCAN NEEDS THREE ARMS BECAUSE THE CODE HAS THREE SPELLINGS

⛔ **A LITERAL-ONLY SCAN SHIPS THIS MEMBER'S WHOLE POINT VACUOUS.** It reads 47 of 53, and the
six it misses are not a rounding error — they are every durable-worker cron secret and the
entire mail seam.

| arm | shape | what only IT sees |
|---|---|---|
| 1 | `Deno.env.get('NAME')` | 47 names |
| 2 | `const IDENT = 'NAME'` then `Deno.env.get(IDENT)` | `ACCOUNT_DELETION_CRON_SECRET`, `PAYMENT_REFUND_CRON_SECRET`, `OPERATOR_MESSAGE_CRON_SECRET` |
| 3 | `env('NAME')` through an injected getter | `EMAIL_PROVIDER`, `POSTMARK_SERVER_TOKEN`, `POSTMARK_FROM_EMAIL` |

⭐ **ARM 2 IS WHAT MAKES THE DELIBERATE EXCLUSION EXPRESSIBLE AT ALL.** The runbook records in
prose that `OPERATOR_MESSAGE_CRON_SECRET` is intentionally NOT set for this release. A scan
that never sees the name cannot carry an allowlist row for it, so the one exclusion the
runbook actually reasons about would have been indistinguishable from an oversight.

⭐ **ARM 3 IS THIS LANE'S OWN FINDING** and the compile's `47 → 50` is corrected to **53**: the
mail adapter takes its env reader as a parameter, so its five names are invisible to both of
the ruled arms. Three of them are consumed nowhere else.

⭐ **§120.3'S TWO NAMES ARE PICKED UP BY CONSTRUCTION**, which was the point of deriving rather
than listing: `ANALYTICS_HASH_PEPPER` (unset, the device/actor hash degenerates and the linkage
is SILENTLY lost — nothing errors, nothing logs) and `EXPORT_SHARED_SECRET`.

## §3 · THE PIN, AND ITS CONTROLS

- **A planted-secret positive control.** Three synthetic sources in a throwaway tree, one per
  spelling, plus a `.test.ts` double that must NOT enter the census. A scan reporting zero and
  a scan that is broken look identical from outside; this tells them apart.
- **A non-redundancy control.** Arms 2 and 3 must each still find live names the earlier arms
  miss. If that ever passes trivially, a later lane is told so rather than left guessing.
- **The allowlist carries reasons.** A row without a stated reason is not a row, it is a hole
  with a name on it — so the pin asserts the reason exists AND that DEPLOY still explains it.

⚠ **THE PIN RUNS IN ONE DIRECTION ONLY: consumed ⊆ documented.** The reverse is a RECORDED
DEFERRAL, not an oversight. DOM-3 lands behind this member and abolishes the founder purchase
path; the moment it does, `STRIPE_PRICE_FOUNDER_LIFETIME` becomes documented and unconsumed,
and a bidirectional pin would red on that alone. A documented secret nobody reads is inert; an
undocumented secret nobody sets breaks a cutover.

## §4 · THE TWO RIDERS DOM-1 HANDED OVER

- `docs/DEPLOY.md` pre-deploy check said "the full 14-stage gate" — now 17, and DERIVED by a
  new arm rather than left as a second hand-kept copy.
- `docs/DEPLOY.md` said `vercel.json` points at `npx vite build`. It points at `npm run build`,
  and the difference is material: only the npm script runs `prebuild` (the sitemap) and
  `postbuild` (prerender), which this runbook's own sitemap section depends on. Pinned against
  `vercel.json`'s real `buildCommand`.

## §5 · SAME-SEED POSTURE

**NEUTRAL.** One markdown file and one test file. No generator, no corpus, no persisted shape.

## §6 · STOP CONDITIONS

1. The pin ships with the literal arm alone (J-TC22-3), or an allowlist row lands without a
   stated reason (fork DOM.U3).
2. The allowlist is widened to absorb whatever the scan happens to find, instead of the runbook
   being written.
3. The pin is made bidirectional in this member (§3's deferral).
4. Any secret VALUE is written into the repo. The runbook names names; it never carries values.
