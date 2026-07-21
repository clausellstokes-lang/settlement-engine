# CYCLE 3 — FIX PROGRAM (Fable-tier architecture, 2026-07-21)

Architected by 8 Fable-tier fix-architects + a Fable reconciler (run wf_339bc3be-f34), each
designing the CHOKEPOINT fix per finding CLASS (not N patches) plus the structural-prevention
guard that removes the class's habitat. Fixes from `docs/CYCLE3_AUDIT.md` (45 confirmed). Deepest
finding: the dead-vocabulary class is **the FACTION-KEY defect recurring one level up** —
hand-rolled per-consumer derivations hidden by SILENT defaults (return 0 / no callout / neutral
color), never bound to producer emissions. Full per-class designs: the workflow result.

## Program frame (verified at git)
- **Fix lineage:** `claude/composite-r4` @ minifold, HEAD d2471e36 (already carries the two shipped
  cycle-3 fixes: C1 sanitizer + campaign-map scrub). ALL waves fold here, one at a time.
- **Audit doc** is in the MAIN tree (review-fixes-2026-07-08), read-only, never edited.
- **Standard fold gate every wave:** focused tests → FULL lint/copy families → two-shard suite
  unpiped → build-first then dist contracts → VERIFY_DIST closure quoted vs 1,039,977 (23 B margin).
- **Staffing:** Opus implements/verifies each wave from these specs; Fable dispatches + checks each fold.

## Ordered waves (1–8 dispatch-ready; 9–10 owner-gated)
**Wave 1 — test-integrity** (H8,M6,M7,M8). Chokepoint: `tests/helpers/sourceContract.js`
(fail-closed extractors) + `FAILURE_STAGES` runtime union + 4 test rewrites. Guard:
`contractTestAntiVacuity.walker` (lands last, allowlists start empty). **First — Waves 7/8's new
security tests must be born on these helpers.**
**Wave 2 — data-contract reversible half** (H1,H3,H14,M2,M16,M5,M15 + all chokepoints).
Chokepoints: `src/data/monsterThreat.js` (one normalizer, resolveConfig delegates) · `threatTagged`
data field in STRESS_TYPE_MAP · `src/domain/display/safetySeverity.js` (total, no silent default) ·
`legitimacyBandFor` extraction · DEFENSE_STRESS_STATUS over all 15 keys · H14 shape fix · M16
fail-CLOSED laneClassifier. Guard: `vocabularyTotality.walker` with H15/H16/H4 in a shrink-only T4
WAIVER manifest. ⚠ closure watch (monsterThreat/safetySeverity may hit an eager path — module-split
cure ready).
**Wave 3 — composed-prose reversible half** (H2 + chokepoint). Chokepoint: `src/lib/proseSeams.js`
(normalizePlotHook + collapseDoubledArticles), 4 strippers consolidated. Guard:
`composedProseSeams.test.js` over the generatorGoldenMaster corpus, BANKING the T4 debt; extends
proseLeak's generator-output blind spot.
**Wave 4 — perf-quadratic-tick** (H17,H18,M17,M18,M19,M20). Chokepoint:
`src/domain/worldPulse/tickIndices.js` (WeakMap-cached indices, byte-identical semantics; M19+M20
identity FIRST). Guard: `tickScanBudget.test.js` (asymptotic ratchet S=4/S=8 ≤2.6×, fallbacks===0)
— extends E-F at its recorded cannot-catch (op-count vs per-op cost). Gate PLUS byte-identity
receipt (unchanged counts ARE the proof).
**Wave 5 — ui-a11y** (H12,H13,M9,M10,M12,M13). Chokepoints: the 3 EXISTING primitives
(useDialogFocusTrap, dialog-shell bounding, combobox grammar) — no new runtime module, zero eager
bytes. Guard: `uiA11yContract.walker` + 3 manifests (mousedown-allow born EMPTY). Extends E-I.
**Wave 6 — determinism-leak** (M21). Chokepoint: deterministic FNV-1a fallback in Editable.safeName.
Guard: eslint src/pdf entropy block + `pdfEntropyGuard.test.js` + PDF_FIELD_MANIFEST walker (no
`/^f_/` ships). Extends the localeCompareGuard two-layer model.
**Wave 7 — fmg-fork sinks** (H9,H10,H11; C1 shipped). Chokepoints: tip()→textContent (299 sites) ·
`currentSeed()` reads window.seed · SCOPED storage/cache cleanup (stop nuking the host session).
Guard: 5 new blocks in mapForkXssChain + `mapForkSinkInventory.json` (~272, born at min). CSP flip
stays T5.
**Wave 8 — money-deploy CODE wave** (H20/M22,H21,M23,M11) — commits inert, deploys owner.
`classifyChargeReversal` chokepoint (amount-aware partial refunds) · migration 170 committed INERT
(applied-head NOT bumped) + publicSafe twin + `npcProjectionPathWalker` · verify-checkout rate limit
· M11 token-or-deadline gate. ⚠ **OPERATOR NOTE at this fold: until stripe-webhook deploys, any
partial/goodwill refund claws back the entire seat — issue none.**

## Owner-gated waves
**Wave 9 — the SINGLE merged T4 ONE REGEN** (never two regens). Data-contract golden flips
(H15,H16,H4 +M5/M15 if golden-observed) + composed-prose golden seams (H5,H6,H7,M1,M3,M4), both new
baselines shrinking in the SAME commit that fixes them (the regen diff = the walkers' shrink proof),
batched with the already-queued em-dash sweep + pressureModel humanization + chronicle-rawId/decrees
retirement. One declared owner-signed shift. **Requires Waves 2–3 folded first (makes it mechanical).**
**Wave 10 — deploy/posture** (very end): db push mig 170 → stripe deploy (operator note retires) →
verify-checkout deploy → client release (publicSafe twin + M11) → then T5 Turnstile + CSP enforce.

## Standing prevention layer (the program's permanent dividend — maintain, don't bypass)
- `contractTestAntiVacuity.walker` + `sourceContract.js` — sibling of check-e2e-not-vacuous (assertion-level).
- `vocabularyTotality.walker` + shrink-only waivers — extends E-B; producer↔consumer exact-set both ways.
- `composedProseSeams` + generator corpus baseline — closes E-E/proseLeak's generator-output blind spot.
- `tickScanBudget` + tickIndices counters — extends E-F at its recorded cannot-catch.
- `uiA11yContract.walker` + 3 manifests — extends E-I; keyboard-reachable + focus-trapped.
- mapForkXssChain 5 blocks + sink inventory — the only gate the fork has.
- `npcProjectionPathWalker` + `moneyEndpointGuardScan` + refund-amount pins — extends E-D.
- eslint src/pdf entropy + `pdfEntropyGuard` + PDF_FIELD_MANIFEST — determinism family, new scope.

## Honest notes — findings with NO clean structural guard (accepted, header-documented)
M4 cross-pool name collision (data-design, no walker) · M15 role-perspective swap (one symmetry
test) · M11 captcha race (instance pin only) · H20/M22 future reversal routing (contract-factory
pins only) · H10 fork re-vendor renaming `seed` (header blind spot) · M16 fail-open external boolean
class (the GOLDEN-LAW gate itself now fails closed — the part that matters).

## NEW finding surfaced during architecture (owner audit-ledger candidate)
`SupplyChainFlow.jsx:234` uses `localeCompare` in a visible-order path — a determinism/order shift.
Not folded into M21; needs its own gate-class ruling.

## Dispatch status
Waves 1–8 dispatch-ready NOW (reversible-no-golden), serialized folds on claude/composite-r4.
Waves 9–10 owner-gated (the single ONE REGEN; deploy/posture) — complete mechanical specs recorded
so the owner's act is sign-and-run.
