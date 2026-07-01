# SettlementForge — Risk Register

> **Living document. Last reviewed: 2026-06-16** (branch `analytics-intelligence-layer`).
>
> **Supersedes [`REVIEW_FINDINGS.md`](./REVIEW_FINDINGS.md)** — that file is a point-in-time
> snapshot (2026-06-13) of a 133-finding multi-agent review. Most of its high-severity items
> have since been remediated (see [§4](#4-historical-findings-the-133-finding-snapshot)); it is
> retained only as a historical record. **This file is the source of truth going forward.**

## How to use this

- Severity here = **current residual risk**, not the severity in the original report.
- Each entry cites **`file:line` on the current branch** so it can be re-verified, not taken on faith.
- Update an entry the same commit you change its code. Add new risks at the top of [§3](#3-open-risk-register-prioritized).
- This register is deliberately a **register**, not a findings dump. Exhaustive per-finding evidence
  for the old review lives in `REVIEW_FINDINGS.md` / `.review_findings.json`.

---

## 1. Top risk class — distributed-state consistency ("broken joins")

The client is **one composed Zustand+Immer store** (14 slices) mirrored to **localStorage** and
**Supabase**. The dominant historical bug class — confirmed by git history (Cohesion Waves 1–8) and
the F1/F2 remediation — is **two stores written separately that then disagree**: campaign ↔ settlement
↔ regional graph ↔ local cache ↔ cloud. This is the #1 thing to get right; types and slice boundaries
do not address it.

**Shared persistence primitives** (`src/store/campaignSliceShared.js`):
`persistCampaignState` = synchronous localStorage cache write + **fire-and-forget** cloud sync;
`persistSaveUpdate` = **fire-and-forget**, never throws, reports failures via `campaignSyncError` banner.
Atomicity is therefore *local-first*: the in-memory + localStorage write is transactional inside one
`set()`, but cloud agreement is eventual and a failed cloud write surfaces as a banner, not a rollback.

### Seam status (write-pairs that must agree)

| Seam | Protection | Status | Evidence |
|---|---|---|---|
| Regional impact apply: settlement save ↔ graph `applied` ↔ cloud | **Ordered-await** (F2): optimistic local → `await persistSaveUpdate` → mark applied, guarded on still-`queued` | ✅ protected | `campaignRegionalSlice.js:419-523` |
| Regional impact **resolve**: condition removed ↔ graph `resolved` ↔ cloud | **Ordered-await** (F2): optimistic local removal → `await persistSaveUpdate` → mark resolved, guarded on still-`applied` (R1 fixed 2026-06-16) | ✅ protected | `campaignRegionalSlice.js:525-617` |
| Campaign delete ↔ in-flight `loadCampaigns` merge ↔ cloud | **Deletion tombstone** recorded synchronously before async cloud delete; `mergeCampaignLists` consumes it | ✅ protected | `campaignSliceShared.js:106-118` |
| World-pulse advance: campaign world ↔ every member save ↔ cloud | Local cache sync in `set()`, then `await flushWorldPulsePersist` (ordered per-save then snapshot) | ⚠️ partial atomicity | `campaignWorldPulseSlice.js:151-278` |
| Apply world-pulse proposal ↔ member saves ↔ cloud | Same optimistic-then-awaited-flush pattern as advance | ⚠️ partial atomicity | `campaignWorldPulseSlice.js:280-310` |
| Pulse undo: snapshot ↔ campaign world ↔ member saves ↔ live view ↔ cloud | Membership-guarded restore in one `set()`, then awaited flush | ✅ protected | `campaignWorldPulseSlice.js:391-466` |
| `applyEvent` settlement effect ↔ campaign-world twin (`rippleEventThroughWorld`) | Settlement: in-`set()` write + fire-and-forget persist; world side: **best-effort** after, each in try/catch | ⚠️ partial (by design) | `settlementSlice.js:1485-1506` |
| `undoLastEvent` settlement scrub ↔ roaming-stressor twin withdraw | Scrub + fire-and-forget persist, then best-effort `undoCampaignStressorBridge` (spread/re-ignite guards) | ⚠️ partial (by design) | `settlementSlice.js:1607-1676` |
| `addToCampaign` reassignment (one settlement, one campaign) | Single `set()` mutates target + every other campaign that held it, one `persistCampaignState(changedIds)` | ✅ protected | `campaignSlice.js:436-457` |
| `removeFromCampaign` ↔ that member's queued `pendingEvents` | Single `set()` prunes `settlementIds` AND `pendingEvents` together | ✅ protected | `campaignSlice.js:459-476` |
| Gallery-with-campaign import: cloned member rows ↔ new `settlementIds` + placement remap | `await` each save building old→new id map; try/catch rolls back inserted clones on failure | ⚠️ partial | `campaignSlice.js:313-408` |
| Map annotation/placement edits ↔ durable campaign copy | In-memory `mapState` + undo snapshot only; persists **only** on explicit `saveCampaignMap` | ⚠️ unprotected (explicit-save model) | `mapSlice.js:268-355` |
| Custom content local id ↔ cloud-minted uuid (add→update/delete ordering) | `pendingAdds` promise chain: update/delete await the add() to get the cloud id | ✅ protected | `customContentSlice.js:135-251` |
| `destroySavedSettlement` status+log ↔ live view ↔ cloud | Atomic `set()` then fire-and-forget persist | ✅ protected | `settlementSlice.js:1120-1172` |

**Read:** the highest-frequency / highest-value seam (impact *apply*) is protected by the F2 ordered-write.
Most "partial" rows are *intentional* best-effort world-side ripples whose failure is non-destructive
(the settlement effect already committed) — acceptable, but worth a periodic reconcile pass. The "partial"
that is a genuine **inconsistency vs its own sibling** is `resolveRegionalImpact` (see R1).

---

## 2. Dimension scorecard (2026-06-16)

| Dimension | Grade | Recent wins | Top remaining |
|---|---|---|---|
| Security (edge fns / RLS / credit ledger) | **A−** | stripe-webhook async verify; `refund_credits` service-role-only (migration 033) + service-role callers; pglite ledger coverage | Edge-fn tests are source-text contract only — no live signed-event smoke test |
| Architecture / code | **B+** | WS4: campaignSlice 2062→657 (5 cohesive modules); cross-slice contracts documented; coupling pin-tested | `settlementSlice.js` 1734 (next megaslice); `aiSlice.js` 1106 |
| Testing fidelity | **A−** | 323 files / 4479 tests; teardown-rpc flake root-caused & fixed; structural pin tests | Edge-fn runtime behavior unverified; coverage thresholds not gated |
| Accessibility | **A−** | jsx-a11y `warn`→**error** (gate-enforced); 162→0 burn-down | Static lint only — focus management, dialog focus-trap, live regions uncovered |
| Performance | **B+** | Map-undo no longer clones the ~MB FMG blob per op; html2canvas verified lazy; tuned manualChunks | No perf-budget in gate; a stray import could re-bloat first paint silently |
| Product / UX coherence | **B** | DM-story cohesion pass (whole-prose context, chronicles, apply-first) | See [`PRODUCT_COHERENCE.md`](./PRODUCT_COHERENCE.md): two-"canon" ambiguity, simulation-surface sprawl |
| Documentation | **B−** | This register; WS4 cross-slice contract headers; ARCHITECTURE.md | Several large `docs/*.md` audits are point-in-time; bus-factor-one |

---

## 3. Open risk register (prioritized)

| ID | Sev | Risk | Evidence | Next step |
|---|---|---|---|---|
| ~~R1~~ | ✅ done | `resolveRegionalImpact` now uses the F2 phase-1/2/3 ordered-await (await the condition-removed settlement save before marking `resolved`, guarded on still-`applied`). Adversarially verified; regression test added. **Fixed 2026-06-16.** | `campaignRegionalSlice.js:525-617`; `tests/store/campaignSlice.regional.test.js` | — |
| ~~R2~~ | ✅ done | External-mill banalité lockout now keys off `/access to external mill/i` in `processingInstitutions` (only the grain chain contemplates external-mill processing), not `/\bmill/i` — so `floodplain_agriculture`/`river_milling` (local mills) are no longer wrongly export-suppressed or stamped with the grain note. Adversarially verified; 3 regression tests. **Fixed 2026-06-16.** _Pre-existing & out of scope: when grain is locked, `Milled flour` + the `Baked goods` chain-output are correctly withheld, but bulk `Grain surplus`/`Bulk food exports` still export via the independent raw-resource path._ | `computeActiveChains.js:236-248`; `tests/joins/chains.test.js` | — |
| ~~R3~~ | ✅ done | Edge functions now have real Deno **runtime** tests, not just source-text contracts. `stripe-webhook/index.test.ts` executes the handler and asserts a missing/bad signature returns 400 with **zero** DB writes (`stub.calls.rpc.length === 0`); `refundPolicy`/`promptCache`/`auth-recovery`/`account-actions` carry behavioral tests. They run in CI's `deno-tests` job (`deno task test:edge`), and `deno task check:edge` type-checks all 13 entrypoints. **Fixed — runtime coverage added.** | `supabase/functions/*/index.test.ts`; `deno.json` (`test:edge`/`check:edge`); CI `deno-tests` job | — |
| **R4** | Low | `settlementSlice.js` (~2425 lines) and the generators are the largest logic files — navigability/onboarding cost on the most-tested core. | `settlementSlice.js`; `src/generators/*` | Deferred by design: extract only the *clean perimeter* when a file starts churning; do NOT split the tangled generation/event core preemptively. Now **machine-enforced**: `tests/architecture/fileSizeBudget.test.js` is a monotonic-shrink ratchet — the megafiles cannot grow, and a slack guard forces each ceiling DOWN whenever a file shrinks, so the debt can only decrease (never re-grow into banked slack). |
| **R5** | Low | Dead/divergent save path: `store.saveSettlement` only pushes a `local_`-prefixed row into the array with no cloud write; production saves bypass it via `savesService.save()` directly. | `settlementSlice.js:1043-1093` | Remove the dead action or document it as test-only to prevent a future caller minting non-cloud saves. |
| ~~R6~~ | ✅ done | Gate now has a hard first-paint bundle budget (`scripts/check-bundle-budget.mjs`, wired into `build`): entry + first-paint-total ceilings, PLUS an explicit lazy-chunk guard that fails the build if a deliberately-lazy chunk (`vendor-pdf` ~614 KB gz, `engine`) leaks into the first-paint modulepreload set via a stray static import — named precisely, not just as an opaque total. Non-vacuity proven. **Fixed.** | `scripts/check-bundle-budget.mjs`; `tests/architecture/bundleBudgetGuard.test.js` | — |
| ~~R7~~ | ✅ done | A11y now covers dynamic concerns end-to-end. Earlier: `Dialog` focus-trap + live-region tests. Now (completing the 2026-07-01 over-claim): a real skip-to-content link + `<main id="main-content" tabIndex={-1}>`, focus moved to `<main>` on every view change via the unit-tested `useFocusOnViewChange` hook (WCAG 2.4.3), and the four previously-bare `aria-modal` modals (ExportSheet, SimulationDrawer, MapShareEditorOverlay, SuccessorPrompt) now back the promise with the shared `useDialogFocusTrap`. Behavior is tested, not just claimed. **Fixed.** | `src/hooks/useFocusOnViewChange.js`; `src/App.jsx`; `src/styles/a11y.css`; `tests/hooks/useFocusOnViewChange.test.jsx`; `tests/ui/a11yNavigationWiring.test.js` | — |
| ~~R8~~ | ✅ done | PDF parity is now machine-checked, not a manual audit: full-document + NotableNPCs **byte-render** tests exercise the real react-pdf render path. **Fixed.** | `tests/pdf/fullDocByteRender.test.js`; `tests/pdf/notableNpcsByteRender.test.js` | — |
| **R9** | Info | Full compiler-enforced store typing is deferred (loose JSDoc by design; `get()` is `any`). | `tsconfig.json` (`strict:false`) | Do it as a prerequisite of the deferred ~650-error JSX-in-tsc project, not standalone. See the WS4 typing analysis. |
| **R10** | Info | Bus-factor-one: single authorial voice / plan vocabulary throughout. | `ARCHITECTURE.md` | Keep ARCHITECTURE.md + this register as the cold-start path. |
| **R11** | Info | "Is the deployed DB at migration head?" was tribal knowledge — no in-repo record, and the live `SUPABASE_MIGRATION_HEAD` probe only runs in the deploy pipeline. As of 2026-07-01 prod is at head (097). | `supabase/applied-head.json`; `scripts/check-migration-head.mjs` | Now tracked: the checked-in applied-head ledger is cross-checked on every `npm run check` — it must reference a real migration and never exceed the repo head, and when the repo is ahead the gate lists the pending (undeployed) migrations. Bump it in the same PR as each `db push`. |

---

## 4. Historical findings — the 133-finding snapshot

`REVIEW_FINDINGS.md` (2026-06-13) recorded **133 findings: 1 critical, 14 high, 65 medium, 53 low.**

On **2026-06-16** the 15 **critical + high** items were re-verified against the current branch
(triage + an adversarial second pass on every item claimed fixed). Result: **14 confirmed-fixed, 1 partial.**

| Original finding (sev) | Status now | Where |
|---|---|---|
| stripe-webhook sync `constructEvent` in Deno (silent paid-revenue loss) — **CRITICAL** | ✅ fixed (`constructEventAsync` + `createSubtleCryptoProvider`) | `stripe-webhook/index.ts:179` |
| `refund_credits` callable by any authenticated user (free generations) — **CRITICAL¹** | ✅ fixed (revoked to `service_role`; service-role callers) | `migration 033`; `generate-narrative/index.ts:1981`, `generate-chronicle/index.ts:84` |
| PDF Overview renders object/array `settlementReason` raw | ✅ fixed (`coerceProse`) | `pdf/lib/viewModel.js:405-407` |
| Canonical save skips neighbour-network migration + back-link | ✅ fixed (moved into `lib/saves.js`) | `saves.js:131-150,213-231,324-342` |
| Library search/sort/filter UI inert | ✅ fixed (renders the filtered set) | `SettlementsPanel.jsx:941-1054` |
| `findFaction` searches wrong list (faction events no-op) | ✅ fixed (union of `powerStructure.factions` + `factions`) | `domain/events/mutate.js:1391` |
| "Tonight at the Table" renders `[object Object]` for NPC secrets | ✅ fixed (`npcSecretText`) | `tonightAtTheTable.js:31-63` |
| "Tonight at the Table" HOOK cards never render | ✅ fixed (`collectPlotHooks`) | `tonightAtTheTable.js:75-81` |
| "Tonight at the Table" TWIST reads nonexistent fields | ✅ fixed | `tonightAtTheTable.js` |
| External-mill lockout applied to **every** chain | ⚠️ **partial** — narrowed but still over-matches `floodplain_agriculture` (see **R2**) | `computeActiveChains.js:239-246` |
| History anchor pass writes through mismatched indices | ✅ fixed | history anchor pass |
| `getBaseChance` keys tier logic off raw `settType` sentinel | ✅ fixed | event chance |
| `generateNPCs` never receives powerStructure/economicState | ✅ fixed | NPC generation |
| DEPLOY.md deploys stripe-webhook without `--no-verify-jwt` | ✅ fixed | `DEPLOY.md` |
| Credit balance fetched once at mount, never refreshed | ✅ fixed | credit refresh |
| generate-chronicle refund doesn't skip elevated (phantom credits) | ✅ fixed (`if (isElevated) return`) | `generate-chronicle/index.ts` |

¹ A second critical (`refund_credits`) — the SQL/RLS one — making the header's "1 critical" effectively understated; both money-path criticals are fixed.

The **65 medium + 53 low** findings were **not** individually re-triaged in this pass. Many were
addressed by the Cohesion Waves; treat the archived `REVIEW_FINDINGS.md` as the lookup for any specific
medium/low item, and verify against current code before acting (it predates the 2026-06-16 remediation).
