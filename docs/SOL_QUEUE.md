# SOL'S QUEUE — the master build sequence (compiled 2026-08-02)

## For the external implementer (Sol), zero session context assumed. Compiled by
## the Fable chair under full owner delegation; owner orders embedded verbatim
## where they bind. Every pointer below is to a committed, AUDITED document in
## this worktree (claude/composite-r4) — no volume in this queue shipped
## unaudited. Where any document and the tree disagree: live code outranks the
## census — STOP and report to the validation chair.

---

## §0 STANDING PROTOCOL (binds every item below)

- DESIGN_WAR_RULINGS_ARCHITECTURE.md **§10 binds verbatim** on every wave in
  every lane: minifold worktree, branch `claude/composite-r4` hard-gated,
  explicit-file (pathspec) commits only, `git stash` FORBIDDEN, gates through
  `npm run check:tail` / `sh scripts/gate-tail.sh` only, goldens captured
  BEFORE wiring, one wave = one commit + ledger row, STOP-and-report on any
  conflict, CONFIRMED/PLAUSIBLE labels in every completion report.
- **Spine requirements 13 + 14** (DESIGN_FP_SPINE.md §1, chair amendments
  2026-08-02) apply to every NEW wave built from now on, in any lane: an
  Alignment line (engagement or declared-empty with reason) and an Edit-verb
  story (DM verb + edits-delta survival + typed-proposal AI surface, or a
  recorded engine-only decision).
- Chair rulings CR-1..CR-7 (FABLE_VALIDATION_QUEUE.md, FP block) bind at the
  waves named in §1/§2 below.
- EVERYTHING BUILDS DARK. Sol never lights a flag, runs a soak, ratifies a
  band, re-records a golden without a recorded ruling, or pushes — see §4.

## §1 LANE A — THE SIMULATION SPINE (serial; this lane outranks everything)

**A1. The war waves** (DESIGN_WAR_RULINGS_ARCHITECTURE.md §5, dependency
order; WR-0/WR-0b/WR-0c already LANDED):

1. WR-1 THE TERMINATION READ
2. WR-2 DISPOSITION (four channels)
3. WR-3 THE LINEAGE CLAIM (seam first, then casus)
4. WR-4 COMPARATIVE COSTS + THE HOME FRONT
5. WR-5 THE TWO BOOKS + THE POLITICAL LOOP
6. WR-6 THE COALITION GRAPH
7. WR-7a → 7b → 7c → 7d THE ENVOY PROGRAM (four commits, one per slice)
8. WR-8 CONQUEST + THE RAZING — ⚠️ THE LICENSE-COUPLING STOP GATE: the license
   slice does NOT build until the validation chair rules the edge questions
   (the gate is written into the volume; report, don't rule)
9. WR-9 CONVERGENCE INSTRUMENTATION
10. WR-10 THE SOVEREIGNTY MARKET (after WR-7; the trade-rights components
    degrade gracefully until TR-5 — twin notes in both volumes)

**A2. The Foreign Policy corpus** (DESIGN_FP_SPINE.md §5 order; all eight
volumes corrected @ 36862650 + fdf43790):

11. SP infrastructure as its own waves: SP-1 THE ERRAND SYSTEM · SP-2 THE
    BELIEVED WORLD · SP-4 THE POSTURE READ (degraded books-arm declared until
    INT-1) · SP-5b THE BANDED-STOCK FAMILY · SP-6 THE NARRATION KIT + the
    band-family table · SP-7 THE TEMPORAL WALKER. (SP-3 lands via GRAMMAR;
    SP-8 THE AGE LAYER is its own later wave, owner veto open on J-D12.)
12. GRAMMAR GR-0 → GR-7 (DESIGN_FP_GRAMMAR.md)
13. INFORMATION IN-0 → IN-6 (DESIGN_FP_INFORMATION.md)
14. TRADE TR-1 → TR-9 (DESIGN_FP_TRADE.md) — ⚠️ CR-2 binds at TR-4: FIRST
    consolidate the applyWorldPulse.js:322 second storageMonths fold into
    generosityUpdates.applyFoodDeltasToUpdates behind a no-behavior-change pin
    (same-seed byte-identical); if consolidation shifts behavior, STOP and
    report. TR-2b (the syndicate variant) is recorded shape only — dark,
    UNSCHEDULED until the owner sequences it.
15. FAITH WF-0 → WF-9 (DESIGN_FP_FAITH.md) — CR-4: the seatBooks stance-choices
    consumption stays DEFERRED as recorded; revisit at WF-3 drafting.
16. POPULATIONS POP-1 → POP-7 (DESIGN_FP_POPULATIONS.md) — picks up its
    Alignment lines at build per requirement 13 (currently zero engagement).
17. INTERIOR INT-1 → INT-8 (DESIGN_FP_INTERIOR.md) — ⚠️ CR-1 binds at INT-8:
    the lit-kind pool upgrade takes the DARK PROSE-VERSION-FLAG arm by default
    (goldens byte-identical); the adjudicated batch re-record is owner-elective.
18. COUPLINGS cross-wires CW-1 → CW-2 → CW-3 LAST (DESIGN_FP_COUPLINGS.md).
    ⚠️ CW-0 (the registry + walkers) does NOT wait for this slot: it lands
    EARLY — with the FIRST wave that lands a cross-layer read — and grows under
    the same-commit registry obligation the walker asserts.

## §2 LANE B — THE DOSSIER + PRODUCT SURFACES (parallel to Lane A; different
## files; pathspec discipline keeps the lanes from colliding)

19. **HK-1 → HK-2** hook non-redundancy (DESIGN_HOOK_NONREDUNDANCY.md) —
    recommended OPENER for this lane: small, independent, zero golden motion
    (HK-2 is projection-only). The DM's-pen and clock-anchor protections are
    law, not preference.
20. **HK-3** theme-aware draws — at the next golden window ONLY: its own
    commit, the disclosed same-seed re-record per the design doc §3 (the doc
    is the recorded ruling; quote the field-level diff in the commit).
21. **The 2026-08-02 dictation corpus** (all audited + corrected; specs in
    their named design docs): the Founders' Hall (all-invited 30, no-trade,
    petition letters, presence-sealed) · profile identity + the civility
    guard's block/veil · ~~operator messages~~ **(✅ BUILT — do not re-dispatch;
    see below)** · LD-1..LD-11 · the About split ·
    DESIGN_GALLERY_SHOWCASE · DESIGN_AI_CHAT_SURFACE · the Bound Book register.
    Order within this block is Sol's to optimize (independent surfaces).
    - **✅ OPERATOR MESSAGES IS BUILT** @ `59d298d3` (substrate, Account section,
      admin surfaces, worker, migration 194) + `3b0ba465` (the unread badge).
      Re-verified live on 2026-08-03: 11 vitest files / 88 tests green, and the
      three operator Deno groups 25/25 green. Spec conformance audited against
      `DESIGN_OPERATOR_MESSAGES.md` §1–§8 — no gaps found. **This row's earlier
      unmarked state caused one lane to be dispatched as greenfield against an
      already-complete surface; do not repeat that.**
    - ⚠️ **BEFORE DISPATCHING ANY OTHER SURFACE IN THIS BLOCK, CHECK GIT FIRST.**
      The block lists specs, not open work, and several landed after it was
      written. `git log --oneline -- docs/<ITS_DESIGN_DOC>.md` plus a read of
      that doc's PROGRESS blockquote settles build state in one step. The build
      state of the remaining entries is UNVERIFIED here — this note deliberately
      claims nothing about them rather than guessing.
    - ⚠️ **LD-5 CARRIES A LANDED-SURFACE HAZARD.** Its Account ▾ block predates
      Messages and, built verbatim, would delete it. Both `FIRST_CONTACT_BACKLOG.md`
      (LD-5) and `DESIGN_OPERATOR_MESSAGES.md` §2 now carry the binding
      amendment; read either before touching `AccountMenu.jsx`.
    - ✅ **THE ABOUT SPLIT IS BUILT** (2026-08-03, Lane C) — §1/§2/§3/§5 landed;
      see the PROGRESS blockquote in `docs/DESIGN_ABOUT_PAGES.md` for the receipt
      set and the substrate corrections. **§4 (the About ▾ dropdown) is the ONLY
      remaining piece and it belongs to LD-5**, which is why it was not built
      here. ⚠️ **LD-5's About ▾ block was AMENDED in `FIRST_CONTACT_BACKLOG.md`:
      its old targets `/how-to` and `/how-to?tab=guide` are now WRONG** —
      `/how-to` is a retired redirect and `?tab=guide` never existed. The three
      real targets are `/about/what-this-is`, `/about/guide`, `/founders`. Read
      that amendment before building LD-5, exactly as with the Messages seam.
22. **THE RECEIPT-POOL ANNEXES ARE PRE-AUTHORED (2026-08-02)** — docs/content/
    RECEIPT_POOLS_{WAR,TRADE,FAITH,POPULATIONS,INFORMATION,GRAMMAR,INTERIOR,
    COUPLINGS}.md: 676 phrased kinds, ~3,000 angle-distinct variants, authored
    and adversarially verified under SP-6's voice contract and content-depth
    floor (284 violations caught in the verify pass). Sol WIRES these pools at
    each wave's WHAT_PHRASES/heraldRouting registration rather than authoring
    prose; the floor walker still gates at registration; a pool the build
    finds wanting or unspecced is a STOP-and-report, never a silent rewrite.
    The annex headers carry the slot convention; volume exemplars are variant
    1 verbatim wherever the volume speaks one.
    - ✅ **THE LEGACY ANNEX'S R1 HALF IS BUILT — DO NOT RE-WIRE IT.**
      `RECEIPT_POOLS_LEGACY.md` (the ninth annex, covering the kinds the engine
      ALREADY routes) is wired at **170 of 200 kinds**: §3's 63 authored-anchor
      pools and §4's 107 fallback-voiced pools are LIVE in
      `src/domain/display/rumorPhrasePools.js`,
      `rumorFallbackPhrasePools.js` and `rumorFallbackPhrasePoolsEvents.js`,
      selected by `whatPhrase` in `settlementRumors.js`, across four slices
      (`1b9b2b10`, `6d33aa8d`, `9dc12049`, and slice 4). The annex header carries
      the RETROFIT COMPLETE table; chair rulings J-LEG-WIRE-1..17 are in
      `FABLE_VALIDATION_QUEUE.md`.
    - ⛔ **WHAT REMAINS IN THAT ANNEX IS §1 + §2 (30 pools) AND IT IS A
      DIFFERENT BUILD.** §1's 24 receipt-sentence pools are consumed by the five
      registry-backed receipt functions in `eventProse.js`, each carrying a
      PARALLEL `requiredSlots` array — **a pool grown without its parallel row
      THROWS at the new index** — so wiring note LEG-3's walker
      (`pool.length === requiredSlots.length`, every registry-backed kind) is a
      PREREQUISITE, not a follow-up. §2's 6 are `{headline, summary, reasons}`
      triples keeping live interp keys. Per J-LEG-WIRE-12 these were deliberately
      NOT bundled into the R1 wiring; treat them as their own wave with their own
      golden plan.
    - ⛔ **STILL OWNER-GATED (LEG-7):** DEFECT-1/2/3's de-slugging of the twelve
      MUTILATED §4 anchors (`coup_detat` still renders "detat") and DEFECT-8's
      digit retirement. Each REPLACES a live string rather than widening a pool.
      The twelve are frozen by test roster; do not repair them opportunistically.
23a. **THE WAR AMENDMENTS: CONVENIENCE + TRIBUTE + STATECRAFT + EXPANSION**
    (DESIGN_WAR_CONVENIENCE_AND_TRIBUTE.md, final 2026-08-03 — cohesion-checked
    against all seven volumes, 128 findings folded, re-verified, residuals
    cleared) — Lane A tail, per its own §10 sequencing: CV-1..CV-4 (exit
    vocabulary + the cold edge · the turncoat · alignment weights consuming
    the BUILT climbDownConsequence path · the betrayal market on the join
    bar) EXTEND the landed WR-1..WR-5 code; TB-1..TB-7 + TB-1b (the tribute
    family SUBSUMING the built catalog rows — new rows only prosperity_
    indexed/service/population + the faith wing cult_establishment/
    patron_imposition · four-goal demand doctrine incl. RECONSTRUCTIVE ·
    executors · restraint terms/embargo webs · deliberate lanes · the
    per-observer inequity read · justice-scaled strain with the healing
    lattice); XW-1..XW-8 (secret protocol · the wedge · preventive pressure ·
    subsidy · loan · arbitration+ultimatum · scorched earth OWNER-GATED ·
    the guarantee + third-party compact class). ⚠️ CPL-17 carries the
    owner-override line for the population levy; three cross-volume
    amendment REQUESTS (INT-4 receipts path, GRAMMAR executor kinds via one
    J-GR-15 instrument, COUPLINGS CPL-12 scoping) are recorded in its §10 —
    build on none by assumption. J-CT-1..34 vetoable; the story canon + the
    history shelf are fixture/pool obligations at build.
24. **THE HERALD CAUSAL VOICE + SURFACE + INDEX** (SP-6's 2026-08-03
    amendment block: the causal grammar, two registers + subheader, the
    four-tier entry, rumor links upward, the popup convention, the search
    index) — with the causal annex (RECEIPT_POOLS_CAUSAL.md) + the
    deepened/legacy annexes when their runs land. Herald-exclusive; the
    index's typed-ref law closes the recorded wizard-news id gap
    (entity-ref slots at every mint, walker-gated); audience projection
    binds search fail-closed. Wiring rides CW-1 (the braid) + the Herald
    composers; lit-kind prose shifts under the recorded-ruling pattern.
23. **THE REALM MAGIC TOGGLE** (DESIGN_REALM_MAGIC_TOGGLE.md, 2026-08-02) —
    MG-1 the pre-generation modal + fourth realm knob → MG-2 the projection
    into every member's config at mint (the core: one spread, whole-lifecycle
    correctness by inheritance) → MG-3 the twelve-leak closure register
    (REPRODUCE-FIRST each) → MG-4 realm-scope dead-magic pins + the
    twin-world not-thinner envelope. Chair checkpoints in its §6; the
    divine-effects ruling (MG-LAW-2) is vetoable owner surface.

## §3 CHAIR CHECKPOINTS (report, don't rule — the chair answers fast)

| At | Checkpoint |
|---|---|
| WR-8 license slice | The STOP gate's edge rulings (chair) |
| TR-4 first commit | CR-2's fold consolidation outcome (report if behavior shifts) |
| INT-8 | CR-1's arm (dark flag default stands unless the owner elects) |
| HK-3 | The golden re-record (own commit, doc §3 ruling cited) |
| Any census overstatement | STOP-and-report (J-WR-13 / J-GR / §2 warranty rows) |
| Any cross-layer read | CW-0 registry row in the SAME commit (walker-enforced) |

## §4 THE TERMINAL PHASE — NOT SOL'S (owner order 2026-08-02, verbatim:
## "except soaks lighting tuning and pushes thats for you fable at the end")

After the lanes complete, THE FABLE CHAIR executes, in order: the release soak
grid → the lighting batches at the recorded points → the 300y rerun → the
tuning pass (bands prepared from the volumes' §7/§8 tables; owner-signed per
THE PROMISE) → the pushes (the chair confirms with the owner at the moment of
each push, per standing git discipline). The walk and the legal packet remain
the owner's own. Sol's obligation to this phase is exactly: build dark, keep
every dormancy fence golden-pinned, and leave the tuning tables honest.

## §5 BANKED FOR THE CONSOLIDATED ADVERSARIAL PASS

Owner order 2026-08-02: after the current full-gate run, bank failures without
repair, continue implementing the queue, and adjudicate/fix the bank only in the
adversarial review after the queued build is complete. A banked row is evidence,
not a waiver: each remains open until that final pass records a verdict.

| ID | Captured after | CONFIRMED evidence | Status |
|---|---|---|---|
| SOL-BANK-1 | Operator Messages exact-tree gate | Main Vitest census passed 2,129 files + 1 skipped and 22,581 tests + 54 skipped, then the process exited 1 on five late `EnvironmentTeardownError` reports from `tests/components/navFlowArrows.test.jsx` attempting to load `src/lib/creditLedger.js` after environment teardown. Earlier same-code full gate exited 0 through build, 311-route prerender, and 364/364 dist tests. | OPEN; cause only PLAUSIBLY load-sensitive. Do not isolate or fix until the consolidated adversarial pass. |
| SOL-BANK-2 | WR-2 composed focused matrix | 25/26 files and 622/623 tests passed. The sole red was `tests/lint/proseNumerics.test.js`: live and committed debt both held 401 rows, while the emitted diff showed unchanged legacy snippets in `peaceTerms.js` and `settlementStrategy.js` at shifted line coordinates after WR-2 insertions. No baseline was regenerated. | OPEN; line-location drift is CONFIRMED in the emitted rows, while whole-baseline equivalence remains PLAUSIBLE until the consolidated adversarial pass. Per owner order, do not repair or rebaseline now. |
| SOL-BANK-3 | WR-2 post-undo typecheck | `npm run typecheck` exited 2 at `src/domain/worldPulse/realmVerbExecution.js:323`: `Record<string, unknown>[]` from the repudiation result is not assignable to the exact disposition-news transition array because the broad row type does not guarantee `kind`, `id`, `channel`, `toBand`, and `tick`. A later `npm run check:tail` passed every preceding validation stage and stopped at the same type error. The chained scoped ESLint command did not run after the first typecheck exit. | OPEN; the static contract mismatch is CONFIRMED. Per owner order, do not narrow or cast it until the consolidated adversarial pass. |
| SOL-BANK-4 | WR-2 adversarial deterministic-math slice | `npx vitest run tests/lint/transcendentalMathBaseline.test.js tests/store/dispositionChannelsUndo.test.js` passed the real undo round-trip but failed two transcendental-ratchet assertions: `src/domain/worldPulse/dispositionLedger.js` introduced one direct `Math.pow` call over the committed zero-site baseline. | OPEN; direct transcendental use and the named §1a-3 guard violation are CONFIRMED. Do not replace or rebaseline it until the consolidated adversarial pass. |
| SOL-BANK-5 | WR-2 scoped ESLint after functional repair | The scoped run was otherwise clean and reported only two max-lines ceilings: `peaceTerms.js` 823 > 800 and `warDeployment.js` 1115 > 1106. The additions are the mediation-disposition join and producer-owned causal IDs; their focused behavior is green. | OPEN; pure file-budget/organization overhead under the owner's clarified boundary. Consolidate during the terminal adversarial pass rather than interrupting the functional queue. |
| SOL-BANK-6 | WR-2 read-only adversarial enforcement audit | Functional defects were repaired (single consumption, dark channel preservation, truthful polarity/cause prose, player privacy, actual visible-text measurement, mediation consumption/learning). Remaining enforcement debt: the maintained observation records phrase repetition but has no authored powered verdict; no exact scorer-family receipt walker or authoring-site ID+settlement-name census exists; the certification row's module list omits integration sites. | OPEN; CONFIRMED enforcement/evidence debt. Add the walkers, powered envelope, and complete certification provenance together in the consolidated adversarial review. No soak/tuning bound is ratified here. |
| SOL-BANK-7 | WR-3 member-birth undo threading | `tests/lint/wizardNewsAuthoring.walker.test.js` passed 8/10 and failed only because insertion above `campaignWorldPulseDeferred.js` moved the exact location of its one non-authoring `kind:'proposal'` undo-snapshot exclusion: candidate/exclusion count 86 vs 87 and the same object reappeared as a location-bound 20th debt row. The object is not Wizard News and its behavior is unchanged. | OPEN; exact-line census maintenance overhead under the owner's functional-first boundary. Refresh the exclusion coordinate/signature in the consolidated adversarial pass, together with the already-banked authoring walkers; do not baseline it as real news debt. |
| SOL-BANK-8 | WR-3 scoped ESLint after functional acceptance | `npx eslint src/domain/worldPulse/lineageClaim.js src/domain/worldPulse/pulseKernel.js` reported exactly two structural findings: `lineageClaim.js:532` initializes `inversion01` before both exhaustive branches overwrite it (`no-useless-assignment`), and `pulseKernel.js` is 1,404 lines against its 1,362-line budget. The composed WR-3 behavior matrix remains green. | OPEN; lint/file-organization overhead under the owner's functional-first boundary. Remove the redundant initializer and consolidate the pulse integration seam during the terminal adversarial pass, not during this behavior wave. |
| SOL-BANK-9 | WR-4 pre-commit staged-file hook after functional acceptance | The hook's `eslint --fix` reported exactly two max-lines ceilings and no behavioral defect: `eventProse.js` 895 > 800 and `pulseKernel.js` 1,422 > 1,362. The composed WR-4 behavior/compatibility matrix had just passed 33 files / 509 tests and the independent functional audit was clear. | OPEN; pure file-organization overhead under the owner's functional-first boundary. Consolidate the narration registry and pulse integration seams with the other line-budget work in the terminal adversarial pass; bypass the hook for this behavior commit rather than interrupting the queue. |
| SOL-BANK-10 | WR-6 cost/settlement compatibility matrix | `tests/property/dispositionChannelsDormancyGolden.test.js` passes its absent-vs-false and legacy-shape contracts but its pre-wiring manifest rejects the same three rows (`wr2-a\|2\|one_week`, `wr2-b\|5\|one_month`, `wr2-c\|7\|one_week`) on both clean `aaa4b3ac` and the repaired WR-6 tree. A clean `git archive HEAD` reproduction failed 1/5 identically; the historical capture commit `7796954e` passes 5/5. During diagnosis WR-6 did expose a second dark sentinel defect, but that behavior defect was fixed before acceptance by installing the sunk-cost callback only under the exact four-flag gate; no fixture or manifest was changed. | OPEN; the surviving red is a CONFIRMED pre-existing stale manifest, not a WR-6 behavioral regression. Do not re-record it piecemeal; adjudicate its accumulated legitimate shifts and refresh or replace the fence in the consolidated adversarial pass. |
