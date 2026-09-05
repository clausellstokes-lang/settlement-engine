# RECEIPT — lane PDFDRIFT — **COMPLETE · VERDICT: REFUSE (measured)**
⟦Seat: Opus 5 — Fable-unvalidated · Lane: PDFDRIFT · dock `$SC/lanePDF` @ `df7cdd37e` (verified, porcelain 0)⟧

## HEADLINE
**REFUSE option (a), with measurement. Nothing implemented, nothing committed.**
The ruling's load-bearing premise — *"a settlement that belongs to a campaign exports different artefacts
depending on which button was pressed"* — is **FALSE as measured**. The two "campaign-less" surfaces and the
seam-threading surface are **mutually exclusive by three source guards**: no settlement can ever be exported
from both. Routing them through `resolveExportSeam` would not cure a drift; it would **breach a documented
paid-rights entitlement floor** on one surface and **leak a premium chapter into an anonymous purchase** on
the other. Both are paid-surface behaviour changes in the harmful direction, on a refuted premise.

## THE MEASUREMENT — why the drift cannot occur
### Guard 1 — the card's export button exists ONLY on a plan-inactive save
`src/components/settlements/SettlementCard.jsx:399` opens `{!active && planInactive ? ( … ) : ( … )}`.
The `Export PDF` button (`:415-425`, calling `handleExportFrozen` → `:115`) lives in the **first** arm only.
`active = isSaveActive(s)` (`:68`), `planInactive = isPlanInactiveSave(s)` (`:69`), and
`src/lib/saveAccess.js:9-15` makes those two states disjoint (`'active'` vs `'inactive_plan'`).
An **active** card renders `Open` and **no export affordance at all** (`:431`).

### Guard 2 — a plan-inactive save can NEVER reach `SettlementDetail` (the seam-threading surface)
All three routes that can open the dossier are `isSaveActive`-gated:
| route | file:line | guard |
|---|---|---|
| Library open | `src/components/SettlementsPanel.jsx:580-591` | `if (!isSaveActive(s)) return;` |
| Map focus request | `src/components/SettlementsPanel.jsx:267-274` | `if (match && isSaveActive(match))` |
| Deep link `/settlements/:id` | `src/components/SettlementsPanel.jsx:287-294` | `if (match && isSaveActive(match))` |

⇒ **Guard 1 ∧ Guard 2**: the settlement that can use the card's export is exactly the settlement that
cannot use the dossier's export, and vice versa. **The alleged PDF↔PDF drift has no possible subject.**
This is already pinned in the tree: `tests/components/settlementCardSignals.test.jsx:138-143`
— *"an active card shows Open, never the frozen Export affordance"*.

### Guard 3 — the purchase page has no save id, and structurally cannot
`src/components/SingleDossierSuccessPage.jsx` is the **anonymous $2.99 one-shot** post-checkout landing.
Its `settlement` comes from the verified Stripe response or the local stash (`:114`,
`data?.settlement || readPendingDossierByToken(token)?.settlement`) — it is **never in
`liveStore.savedSettlements`** and there is no save id anywhere on the page (the user has no account yet;
the page's own upsell at `:399-435` invites them to make one). `resolveExportSeam(liveStore, null)`
therefore returns `campaign: null` by `resolveExportSeam.js:25-30`. The brief anticipates this and asks for
it to be "pinned as correct" — but a seam call that is **provably constant** is not a repair, it is
ceremony, and it drags a second value with it (below).

## WHAT OPTION (a) WOULD ACTUALLY DO — the harm, per surface
### `SettlementCard.jsx:115` — it would breach the AUDIT-2.2 paid-rights floor
The call site carries an explicit contract docblock at `:97-101`:
> *"AUDIT-2.2 — read-only PDF extraction for a retention-frozen save. Exports the STORED settlement
> (**never the live store, no worldState, no faith chapter, no reactivation**), so it can never resume the
> simulation — the lapsed-plan owner gets out exactly what they made."*

`resolveExportSeam` returns precisely `worldState`, `regionalGraph`, the sibling `settlements` array and
`faithUnlocked` — **the four things this docblock forbids**. Option (a) on this site does not harmonise a
paid surface; it hands a **lapsed, non-paying** account the live campaign world its plan no longer entitles
it to. That is a paid-surface behaviour change *against* the entitlement boundary.

### `SingleDossierSuccessPage.jsx:183` — it would leak the premium chapter into an anonymous one-shot
`campaign` would be constant `null` (Guard 3), so the seam buys nothing there. But the seam returns a
**pair**, and `faithUnlocked = resolveFaithUnlocked(liveStore)` (`resolveExportSeam.js:67-70`) is
`tier === 'premium' || isElevated()`. A signed-in premium user who completes a one-shot purchase (or any
elevated session) would flip `faithUnlocked` from today's implicit `false` to `true`, adding the Faith & War
chapter to a **$2.99 anonymous artefact** that is not sold with it. `generateSettlementPDF.js:239`
defaults `faithUnlocked = false` with the comment *"free / lapsed / anon exports never carry deity names."*

### Already-recorded posture — this is not an unexamined gap
`src/pdf/SettlementPDF.jsx:77-83` names all four surfaces and their differing options explicitly:
> *"VERIFIED POSTURE (2026-07-30): NO production caller passes true. The single-dossier purchase export
> passes `false` explicitly (SingleDossierSuccessPage.jsx), and the three account export surfaces
> (SettlementCard, ExportDraftButton, SettlementDetail) omit it and take this default … an open product
> call, **recorded here, not a defect to re-find**."*

## THE FOUR-SITE TABLE — before, and after under my refusal (unchanged)
| # | site | surface / precondition | `campaign` | `faithUnlocked` | verdict |
|---|---|---|---|---|---|
| 1 | `SettlementDetail.jsx:426` (+ `:418` Foundry) | saved settlement, **active** save only | `resolveExportSeam` | `resolveExportSeam` | correct — the seam's home |
| 2 | `SettlementCard.jsx:115` | **plan-inactive (frozen)** save only | absent ⇒ `null` | absent ⇒ `false` | **correct by AUDIT-2.2**; disjoint from #1 |
| 3 | `SingleDossierSuccessPage.jsx:183` | **anonymous** purchase, **no save id** | absent ⇒ `null` | absent ⇒ `false` | **correct**; seam is provably constant here |
| 4 | `ExportDraftButton.jsx:64` | unsaved draft | explicit `null` | explicit `false` | correct (brief agrees) |

`campaign` and `faithUnlocked` default to `null` / `false` at `generateSettlementPDF.js:235,239`, so #2/#3's
omission and #4's explicit pass are **behaviourally identical today**.

## PER-SURFACE BEHAVIOUR STATEMENT (for the chair's declaration)
- **Dossier (`SettlementDetail`)** — before: seam-resolved campaign + faith. After: **unchanged**.
- **Library card (`SettlementCard`, frozen saves only)** — before: stored settlement, no live world.
  After: **unchanged**. (Option (a) would have added live `worldState`/`regionalGraph`/sibling settlements
  and a tier-derived `faithUnlocked` to a lapsed-plan export.)
- **Purchase page (`SingleDossierSuccessPage`, anonymous)** — before: no campaign, no faith chapter.
  After: **unchanged**. (Option (a) would have left `campaign` at `null` but flipped `faithUnlocked` to
  the live tier, adding the Faith & War chapter for premium/elevated sessions.)
- **Draft (`ExportDraftButton`)** — before and after: `campaign: null`, `faithUnlocked: false`. Untouched, as briefed.


## THE RESIDUE — the real question C5 was reaching for
The seal's image — *"quartered from the dossier, un-quartered from the Library card"* — is reachable for one
settlement only **across time**, never at one moment: export from the dossier while the plan is live, then the
plan lapses, then export again from the now-frozen card. The second PDF is poorer than the first **by design**
(AUDIT-2.2). So the open question is not *consistency* at all; it is:

> **Does the paid-rights floor include the arms?** When W-ARMS lands, a frozen save's extraction will carry
> un-quartered arms while its own earlier dossier export carried quartered ones.

That is a product call about what a lapsed owner is entitled to keep — **owner-gated, not a lane repair, and
not curable by routing.** Recording it here rather than deciding it.

## RECOMMENDATION TO THE CHAIR (not executed — the chair takes register acts)
1. **Withdraw option (a).** Its premise does not survive measurement; both edits would move a paid surface in
   the wrong direction. Option (b) is likewise moot — there is no drift to make consistent.
2. If the chair wants the floor *guaranteed* rather than *documented*, the correct instrument is a **pin, not a
   routing change**: assert that `SettlementCard`'s frozen export passes no `campaign` / `worldState` /
   `faithUnlocked`, and that the purchase page's export keeps `faithUnlocked: false`. That converts the
   AUDIT-2.2 docblock from prose into machinery (hazard-conversion law: MACHINERY or ACCEPTED). It is a **new
   test file** ⇒ it owes census + register acts ⇒ the chair's call, deliberately not taken by this lane.
   Note the exposure is live, not theoretical: **this brief is itself an instance of a chair ruling the change
   that the docblock forbids, with nothing in the tree that would have gone red.**
3. Minor, recorded not fixed: a Founder Lifetime account's frozen-card export omits `isFounder`, so the cover
   loses the Founder Edition badge. Marginal (a lifetime purchase should not produce a plan-inactive save) and
   deliberately untouched.

## REGISTER DELTAS
**None.** No file added, renamed, deleted or modified under `src/` or `tests/`. Porcelain stays 0; no commit,
no car. `tests/lint/` is therefore **not owed** (its trigger is a file add/rename/delete);
`typecheck:domain:strict` and eslint are **not owed** (no `src/` change). Predicted register figures: all
unchanged from `df7cdd37e`.

## RETROVALIDATION ROW
| field | value |
|---|---|
| **What was judged** | That the chair's C5-derived ruling (option (a)) rests on a false premise, and that implementing it would breach the AUDIT-2.2 paid-rights floor and leak `faithUnlocked` into the anonymous one-shot. Lane declined to implement a paid-surface behaviour change on a refuted premise. |
| **What the Fable chair must re-derive** | (1) The three `isSaveActive` guards at `SettlementsPanel.jsx:270,294,581` — that they are the *only* routes into `SettlementDetail`. (2) `SettlementCard.jsx:399` — that the `Export PDF` arm is `!active && planInactive` only. (3) That `SingleDossierSuccessPage` holds no save id on any path. (4) The AUDIT-2.2 docblock at `SettlementCard.jsx:97-101` as a binding contract, and `SettlementPDF.jsx:77-83` as an already-recorded posture. (5) Whether the paid-rights floor should include W-ARMS arms — owner-gated. |
| **Receipts by path** | `src/components/settlements/SettlementCard.jsx:68-69,97-121,399-425` · `src/components/SettlementsPanel.jsx:267-274,287-294,580-592` · `src/components/SingleDossierSuccessPage.jsx:78,107-135,175-190` · `src/components/SettlementDetail.jsx:200,405-429` · `src/components/generate/ExportDraftButton.jsx:64-76` · `src/components/settlementDetail/resolveExportSeam.js:24-70` · `src/utils/generateSettlementPDF.js:219-293` · `src/pdf/SettlementPDF.jsx:60-95` · `src/lib/saveAccess.js:9-15` · `src/lib/campaigns.js:33-35` · `src/store/authSlice.js:41-51` · `tests/components/settlementCardSignals.test.jsx:121-144` · `tests/ui/settlementDetailPdfThreading.test.jsx:211-278` |
| **Priority** | **HIGH — blocking.** The ruling as written would ship a regression to two paid surfaces. No car should be replayed for PDFDRIFT until the chair re-rules. |

## PROOF — executed, exits captured in-shell
**Quiet-window law satisfied** before any vitest: three consecutive 60-s probes with load-1 < 4.0 and zero
`[v]itest/dist/workers` processes — `3.29/0`, `2.43/0`, `1.91/0` (probes 4-6; probes 1-3 were red at
`17.62/7`, `10.81/0`, `5.13/0` while the chair's gate ran, and were correctly refused).
Run made **only** through `sh scripts/gate-mutex.sh --run --` (lock acquired as PID 67435, 0 polls).

```
=== HEAD df7cdd37e porcelain=0 ===
 RUN  v4.1.11 …/scratchpad/lanePDF
 Test Files  2 passed (2)
      Tests  20 passed (20)
   Duration  3.99s
EXIT_RUN1=0
=== FINAL porcelain=0 HEAD=df7cdd37e ===
```
Files: `tests/components/settlementCardSignals.test.jsx` (the disjointness pin) +
`tests/ui/settlementDetailPdfThreading.test.jsx` (the seam pin). **CONFIRMED**: the current posture is green
and the disjointness is a live, landed pin — not merely a reading of the source.

**No plant-out was performed, and none was possible**: the brief's plant-out asks me to prove the repair RED
when reverted, but there is no repair — the lane implements nothing. The corresponding negative control is
the grep below, which shows the repair would have been invisible to the suite in the first place.

### Negative control — what would have caught option (a)? Nothing.
```
$ grep -rln "vi.mock.*generateSettlementPDF" tests/
tests/ui/settlementDetailPdfThreading.test.jsx        # mounts SettlementDetail ONLY
```
Exactly **one** test in the tree can observe `generateSettlementPDF`'s options, and it mounts only the
dossier surface. Had option (a) been implemented on `SettlementCard` or `SingleDossierSuccessPage`, **the
entire suite would have stayed green** while two paid surfaces changed behaviour. This is the concrete
argument for recommendation 2.

## LABELS
- **CONFIRMED** (executed): the two pins are green at `df7cdd37e`; the mutex + quiet-window law were honoured;
  porcelain 0 and HEAD unmoved at start and end; exactly one test can observe the export options.
- **CONFIRMED** (source read, quoted above with file:line): the three `isSaveActive` route guards; the
  `!active && planInactive` render arm; the absence of any save id on the purchase page; the option defaults
  at `generateSettlementPDF.js:235,239`.
- **PLAUSIBLE** (reasoning, not executed): that a premium/elevated session on the purchase page would flip
  `faithUnlocked` to true. It follows directly from `resolveExportSeam.js:67-70`, but no test exercises that
  path today — the chair should treat it as the predicted consequence of a change I did not make.
