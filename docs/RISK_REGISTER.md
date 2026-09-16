# SettlementForge — Risk Register

> **Historical risk register — last reviewed 2026-06-16** (branch
> `analytics-intelligence-layer`). It predates the spatial engine, the multi-wave engine
> stack, and the comprehensive review program, and is kept for its distributed-state /
> seam analysis (still substantially accurate) — NOT as the current risk surface.
>
> **For the CURRENT live risks** (master-merge lineage collision, prod migration lag,
> un-soaked deploy) see the execution playbook
> [`docs/PHASE55_EXECUTION_PLAYBOOK.md`](./PHASE55_EXECUTION_PLAYBOOK.md) §0.0.2 and the
> newest review doc [`docs/COMPREHENSIVE_REVIEW_2026-07-15.md`](./COMPREHENSIVE_REVIEW_2026-07-15.md).
>
> **Supersedes `REVIEW_FINDINGS.md`** — a point-in-time snapshot (2026-06-13) of a
> 133-finding multi-agent review; most of its high-severity items have since been
> remediated (see [§4](#4-historical-findings-the-133-finding-snapshot)).
> ⚠ **That file was EXTRACTED FROM THE REPO on 2026-08-10** (IP exposure: it names
> files and line numbers for live security seams). It and its `.review_findings.json`
> sidecar now live outside the repo in the owner's design-handoff folder under
> `repo-extracted-2026-08-10/`. §4 below is the in-repo summary that survives it.

## How to use this

- Severity here = **current residual risk**, not the severity in the original report.
- Each entry cites **`file:line` on the current branch** so it can be re-verified, not taken on faith.
- Update an entry the same commit you change its code. Add new risks at the top of [§3](#3-open-risk-register-prioritized).
- This register is deliberately a **register**, not a findings dump. Exhaustive per-finding evidence
  for the old review lived in `REVIEW_FINDINGS.md` / `.review_findings.json`, both **extracted from
  the repo 2026-08-10** — see the owner's out-of-repo `repo-extracted-2026-08-10/INDEX.md`.

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
| **R3** | Low | Edge-function tests are **source-text contract** assertions (`readFileSync` + `toMatch`), not runtime. A regression in stripe-webhook signature verification or the refund path would pass the gate. | `tests/edgeFunctions/contracts.test.js` | Add a real signed-event smoke test (`generateTestHeaderString` + `createSubtleCryptoProvider`) asserting 200 + state mutation. |
| **R4** | Low | `settlementSlice.js` (1734 lines) is the largest store file — navigability/onboarding cost on the most-tested core. | `settlementSlice.js` | Deferred by design: extract only the *clean perimeter* (pending-edits, user-edits/rename, snapshots) when it starts churning; do NOT split the tangled generation/event core. See the WS4 sub-slicing analysis. |
| ~~R5~~ | ✅ done | Dead `store.saveSettlement` action removed (F34). Its live-designed side effects (first_save/third_save pricing moments + `'saved'` research capture) were revived as `src/store/saveMoments.js` (`recordSaveMomentForActiveSave`) and invoked from the REAL save chokepoints — `SaveToLibraryButton` and the `SAVE_SETTLEMENT` auth intent — so the funnel actually fires. **Fixed 2026-07-08.** | `settlementSlice.js`; `src/store/saveMoments.js`; `tests/store/saveMoments.test.js` | — |
| ~~R6~~ | ✅ done | A first-paint byte budget now gates the build: `tests/build/vendorPdfLazy.test.js` computes the entry's transitive **static** import closure and asserts it stays under a monotone-ratchet ceiling (CI runs it after `npm run build`). The ceiling was ratcheted **down** 2026-07-09 (2,140,000 → 2,075,000) when the campaign world-pulse advance/preview/apply-proposal/party machinery was moved behind a memoized dynamic `loadWorldEngine()` — the entry chunk dropped ~47 kB (711,694 → 664,652) as the advance-exclusive modules split into a lazy chunk fetched on first pulse. **Known remaining anchor** (out of scope, follow-up filed): `settlementSlice → domain/events/partyEventLinkage.js → worldPulse/partyImpact.js` (a `PARTY_IMPACT_KINDS` const import) still drags applyWorldPulse's heavy graph into first paint because the project doesn't mark modules side-effect-free; extracting that const to a leaf module unlocks it. **Fixed 2026-07-09.** | `tests/build/vendorPdfLazy.test.js` (budget + closure BFS); `src/store/campaignWorldPulseSlice.js` (`loadWorldEngine`); `vite.config.js` | — |
| **R7** | Low | A11y enforcement is static markup lint only — dynamic concerns (focus on view change, custom `Dialog` focus-trap, live-region announcements) are unverified. | `eslint.config.js:166-181` (jsx-a11y errors) | Add focused interaction/axe tests for the dialog + primary view transitions. |
| **R8** | Low | PDF and on-screen dossier are separate render paths and can drift; parity is a manual audit. | `src/pdf/**` vs `src/components/**`; `PDF_PARITY_AUDIT.md` | Keep the parity audit current; consider shared view-model assertions. |
| **R9** | Info | Full compiler-enforced store typing is deferred (loose JSDoc by design; `get()` is `any`). | `tsconfig.json` (`strict:false`) | Do it as a prerequisite of the deferred ~650-error JSX-in-tsc project, not standalone. See the WS4 typing analysis. |
| **R10** | Info | Bus-factor-one: single authorial voice / plan vocabulary throughout. | `ARCHITECTURE.md` | Keep ARCHITECTURE.md + this register as the cold-start path. |

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
addressed by the Cohesion Waves, but **118 findings carry no remediation status of any kind** — neither
the markdown nor the JSON sidecar ever had a per-finding open/closed field.

⚠ The per-item lookup is **no longer in the repo.** `REVIEW_FINDINGS.md` and `.review_findings.json`
were extracted 2026-08-10; the JSON (every row carrying `file`, `line`, `severity`, `evidence`,
`suggested_fix`) is the worklist for any specific medium/low item and lives in the owner's out-of-repo
`repo-extracted-2026-08-10/`. Verify against current code before acting on any of them — the register
predates the spatial engine, the multi-wave engine stack, and the whole Cohesion Wave remediation.
