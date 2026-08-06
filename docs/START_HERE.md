# START HERE — successor bootstrap (any AI, any account, zero context)
### Written 2026-07-18 by the outgoing manager session (Claude Fable). If you are
### reading this, the owner's prior session ended (usage limit / model switch).
### This file assumes you know NOTHING. Read it fully before touching anything.

## 1. WHAT THIS IS
SettlementForge — a deterministic D&D settlement/world simulator (~612k LOC,
React/Zustand/Supabase), solo owner **Clausell Stokes**. A long audit-driven
program is mid-flight toward launch. The owner delegates heavily ("do what you
think is best") but every judgment is recorded VETOABLY in the ledger; certain
classes are owner-only (push→already authorized as backup; PR-merge, deploys,
`supabase db push`, golden-shifting flag lighting, budget raises, legal).

## 2. THE THREE DOCUMENTS THAT RUN THE PROGRAM (all in docs/, this branch)
1. **THE_REMAINING_ARCHITECTURE.md** — THE PLAYBOOK: every remaining slice/phase
   to launch with laws + done-whens (§1b base ruling; §2 slices; Phase D; folds;
   §4 ROUND 3; then THE ENDGAME TAIL PER §3h). Execute FROM this.
2. **COMPREHENSIVE_REVIEW_PROGRAM.md** — THE LEDGER: reverse-chronological rows
   of every ruling and landing. The newest rows tell you exactly where things
   stopped. Append a row (+ commit) for everything you land. Never rewrite rows.
3. **Design docs** you will need: DESIGN_TRADITIONS.md (frozen; slices T-1..T-5),
   DESIGN_ILLUSTRATED_TOWN.md (slices IT-1..IT-6), THE_BASE_RECONCILIATION_MAP.md
   + THE_BASE_RESTORATION_LEDGER.md (Phase-D gate: zero PENDING rows),
   DESIGN_DEEP_CRAFT_PAGES.md, C1FIN_CONTROL_CENSUS.md (briefs/).

## 3j. ⭐⭐ THE BUILD IS RESUMED, AND THIS IS THE OPUS ERA (2026-08-06, owner
order; supersedes §3i's pause paragraph and everything below; git wins)

**THE PAUSE IS LIFTED.** The owner's order, verbatim intent: continue the work
in the codebase, all decisions delegated, and — where a choice exists between
what is maximally safe for the code as it stands and what is objectively
better but carries risk — **take the better option every single time.** Work
continues until weekly usage is exhausted. A 30-minute lane-keeper tick runs
for the life of the session to ensure everything parallelizable is running and
nothing is stalled. Owner-gated classes are UNCHANGED by this: pushes, deploys,
migrations, schema/persistence shape, data deletion, security posture, paid
surfaces, legal, and the constitutional tuning signature are still never
self-ruled. The risk appetite governs ENGINEERING choices inside scope, not the
gates.

**⏳ THE OPUS-ERA MARKING DIRECTIVE (owner, 2026-08-06, verbatim intent):**
"use opus 5 for everything. anything that is not validated, managed, and
architected by fable five must be labeled as such and marked for validation
from fable at the next time that we have fable 5 weekly usage credit free."
This RATIFIES and TIGHTENS §6b-3. The operative rules: (1) every operation —
chair, implementer, verifier, recon — runs on Opus 5; (2) every ledger row this
era appends to `docs/FABLE_VALIDATION_QUEUE.md` carries **⏳ OPUS-ERA — FABLE
SURVEY OWED** in its heading; (3) every chair-grade judgment is itemized as a
`J-*` entry inside its row so a later Fable session can re-rule it cheaply;
(4) the marking covers all three verbs — architected, managed, AND validated —
so an Opus-architected volume is owed a Fable survey even if an Opus verifier
already passed it; (5) the debt is RETROACTIVE, never gating: nothing waits for
Fable, and the next Fable-available session clears the survey debt FIRST.

**STATE AT WRITE TIME (verify with git — never trust this over git):** build
branch `claude/composite-r4` in `.claude/worktrees/minifold`, resumed from
`cbd348a5` (SP-C, chair-verified at the pause — that verification stands and is
recorded in §3i). Cycle 4 re-dispatched from SP-D, PIPELINED rather than
serial: each wave builds while its predecessor's adversarial verifier runs in
disposable `git archive` trees, so verifiers never assert tree-cleanliness and
a concurrent lane's dirty files cannot pollute wave-end attribution. That
pipelining is a **JUDGMENT (vetoable)** — it takes the riskier ordering for
roughly half the cycle wall-clock, per the owner's risk directive above.
Read-only recon lanes run beside it and are forbidden from invoking vitest: the
gate is a MACHINE mutex, and a parallel run yields fake reds that a lane then
"repairs".

**THE CONCURRENCY LAW IS UNCHANGED** — two build lanes, one landing slot, one
gate slot, one worktree; a third lane only if it is read-only and commits
nothing. See §3i and `memory/concurrency-law-ruled.md`. The risk directive does
NOT license a second engine worktree: that refusal was a MEASURED verdict about
exact-census files merging green-but-wrong, not a caution.

### ⭐⭐ THE WAVE CENSUS — MEASURED FOR THE FIRST TIME (2026-08-06)

**⛔ STRIKE "94 WAVES REMAIN (49 FLAGGED)" WHEREVER YOU MEET IT.** It is not
merely stale, it is INTERNALLY INCONSISTENT: its own stated composition (FP core
61 · WC 17 · WY 12 · ES 7 · EP 6 · HB 10) sums to **113**, or 105 net of its
claimed 8 landed — neither is 94. Three independent defects: "FP core 61"
contradicts the volume's 60 numbered waves; ES is counted at 7 where the volume
declares 8 (ES-0..ES-7); WY at 12 folds in the five SURFACE waves that §5
explicitly excludes. It was also already short by one when written — SP-C landed
at 04:26 and the figure was recorded at 06:29 the same day. Strike it; do not
adjust it. The §3i inventory paragraph carrying it is superseded by this block.

**THE MEASURED FIGURES.** `DESIGN_FP_ARCHITECTURE.md`'s own headline numbers were
labelled PLAUSIBLE-NOT-MEASURED in the integration fold's anomaly A6. They have
now been counted by two independent methods (regex extraction over §5 wave
declarations, and a per-phase recount) and **all three are EXACT**: §5's "75
waves" measures 75, §3's "52 new virtual flags" measures 52 with no duplicates
or gaps, §9's "66 seams pinned" measures 66. **A6's PLAUSIBLE label is hereby
upgraded to MEASURED, and EP's STOP-and-report condition is NOT triggered.**

- **FP: 75 declared — 9 LANDED, 2 PARTIAL, 64 NOT-STARTED → 66 remaining.**
  Landed: SP-A · CW-0w · SP-B · SP-B2 · SP-C · GR-0 · GR-1 · TR-1 · ES-0.
  Partial: SP-D (in flight) and TR-9 (only the TR-9c contract slice landed).
- **Program-wide: 108 declared (75 + EP 6 + HB 10 + WC 17) → 99 REMAINING.**
- **The flag census, which is the scheduling number:** of the 66 remaining FP
  waves, **42 MINT a flag** and must serialize under CQ5, 12 ride an
  already-minted flag, and 12 carry no flag — so **24 of 66 parallelize freely
  and 42 contend for the single flag slot.**
- ⚠ **SEVEN ES WAVES LEAVE THE SERIALIZED COLUMN, NOT SIX.** `espionageEnabled`
  landed at ES-0 (`55674790`, "Joined 2026-08-05 by FP wave ES-0"); §3 row 44
  still says it lands at ES-1 and is STALE. ES-7 is also a slice of that flag,
  so ES-1..ES-7 are all no-new-flag.
- Two label corrections, not count corrections: flag 52 `armySupplyEnabled`
  belongs to WY-8 slice 8a, which is NOT among the 75 (in-scope flags = 51); and
  the manifest lives at `src/domain/worldPulse/simulationRules.js`, not
  `src/domain/simulationRules.js`.

**⚠⚠ THE METHODOLOGICAL FINDING, and it binds every future census: ES-4 IS
NOT-STARTED DESPITE ELEVEN COMMITS NAMING IT.** Commit `8a4b0aef` says verbatim
"THE WAVE DID NOT LAND" — those commits hardened the lighting instrument.
**A census by git-subject grep alone would score ES-4 as landed.** Landed-state
needs the module and manifest evidence, never the commit subject alone.

**THE CRITICAL PATH IS NINE WAVES: SP-D → ES-1 → ES-2 → ES-3 → ES-4 → ES-5 →
ES-6 → ES-7 → CW-3.** Strictly serial by declaration and no parallelism shortens
it. ⭐ **Seven of the nine mint no flag, so the critical path is
DEPENDENCY-bound, not flag-slot-bound — do not spend the second build lane on
it.** Highest unblock-counts, and therefore what a chair schedules first:
**SP-D** (5 direct, and it gates the whole 8-wave ES tail), **GR-2** (5 direct,
and it became FULLY UNBLOCKED the moment SP-C landed), then **GR-3** (3 direct,
and it owns the one-time `catalogGrewSinceWr10` discharge per J-FP-1, which TR-5
and WF-6 must not expect to still exist).

## 3i. ⭐⭐ ACCOUNT-TRANSITION HANDOFF (2026-08-06, ~04:40 EDT — written FOR a
successor on a DIFFERENT CLAUDE ACCOUNT; supersedes everything below; git wins)

**READ THIS PARAGRAPH FIRST.** The owner is transitioning to another Claude
account when weekly usage runs out. You may have NO access to this machine's
memory estate (`~/.claude/projects/-Users-cstokes-Desktop-settlement-engine/memory/`)
and NO access to the prior session's workflow journals. **THE REPO IS
AUTHORITATIVE AND IT IS SUFFICIENT.** Everything load-bearing has been landed
into git. Where this file and your memory disagree, git wins; where this file
and the code disagree, THE CODE WINS.

**⭐⭐ THE FULL ARCHIVE IS IN GIT — `docs/archive/` (commit `2149e72d`).**
Read `docs/archive/README.md` first. It holds THE COMPLETE MEMORY ESTATE
(384 files, 2.7 MB — every owner directive verbatim, every hazard class, every
judgment call; **start at `docs/archive/memory-estate/MEMORY.md`, the index —
do not read all 384**), the 18 workflow scripts that are this program's
reproducible dispatch record, and an ORPHANED STASH exported as a patch. If you
have no memory estate of your own, THAT DIRECTORY IS IT.

**⭐ THE VOLUMES ARE NOW IN GIT — `docs/architected-volumes-pending-fold/`.**
Three architected programs (EPOCH 16 waves SEALED · HABIT 10 waves · WAR-
CIRCULATION ~12 waves) plus two verification instruments and the diagnostic-
soak design lived ONLY in a session scratchpad under `/private/tmp/` until
commit `82f06898`. Read that directory's README before touching them. Each
volume quotes its owner directive VERBATIM in its own opening section, so the
intent survives even without the memory estate.

**STATE AT WRITE TIME (verify with git — never trust this over git):**
- Ledger branch `review-fixes-2026-07-08` (this file). Build branch
  `claude/composite-r4` in `.claude/worktrees/minifold`, ~390 commits ahead,
  **NOTHING PUSHED**. Pushes are owner-confirmed, terminal phase only.
- **LANDED this era:** FP cycle 1 (closed) · the ES+WY integration fold ·
  cycle 2 (SP-B, SP-B2, the lighting instrument) · first-paint dist repair ·
  ES-0 (espionage foundations + the CR-ES-3 seat-vocabulary retarget) · the
  ES-4 door-3 arc CLOSED AT THE CAP (`d48224e3`) · the blanket-sign-off row ·
  SP-C (the posture read).
- **MEASURED REMAINING BUILD INVENTORY (2026-08-06, re-measured):** **94
  waves** — FP core 61 (8 landed) · WC 17 · WY 12 · HB 10 · ES 7 · EP **6**.
  **49 carry a flag; 45 do not.** Older figures are STALE: "~65" predates the
  08-05/06 directives, and "EP 16" counted EP-N tokens including judgment ids.
  ⚠ **ES-1..ES-6 are NO-FLAG** — `espionageEnabled` landed at ES-0
  (`55674790`); the ES volume text saying it lands at ES-1 is STALE.
  ⚠ **ES-4 IS FIFTH IN ITS SPINE** (ES-0→ES-1→ES-2→ES-3→ES-4), NOT second —
  its §5 header presents SP-B2 as the last gate and that is FALSE; the stale
  header ALREADY MISROUTED ONE LANE (see `8a4b0aef`). Both doc repairs are
  QUEUED, not landed — composite-r4's tree was held when they were found.
- **CONCURRENCY IS RULED — see memory `concurrency-law-ruled.md`:** TWO build
  lanes, ONE landing slot, ONE gate slot, ALL IN ONE WORKTREE. A second
  worktree is REFUSED for engine lanes (the gate is a MACHINE mutex, not a
  tree resource; and exact-census / shrink-only files merge GREEN-BUT-WRONG in
  both parents). Standing practice ruled: each program certifies in its OWN
  subsystemRows lane file (the totality walker asserts the PARTITION, not the
  address) — this removes ~1/3 of the CQ5 collision at zero cost.
- **IN FLIGHT when this was written** (if these lanes died with the session,
  their work is recoverable ONLY from what is described here plus git):
  cycle 4 (SP-D, GR-2, IN-0a after SP-C) · the HABIT volume's round-4 CAP ·
  the WC architecture pass · four read-only lanes (cycle-5 pre-censuses, the
  parallelization map, the diagnostic-soak harness, the V5 cull counsel).
  **None of them had pushed anything.** Re-dispatch any that did not land.

**⛔ THE BUILD STREAM WAS PAUSED HERE — AND HAS SINCE BEEN RESUMED. THIS
PARAGRAPH IS HISTORY; §3j IS THE CURRENT STATE.** (Kept because it records what
the pause cost and what was verified at it, both of which still bind. Do not
read it as a live instruction — the derive-don't-restate law: one spelling of a
fact, pointers everywhere else.)
Paused at build HEAD `cbd348a5` (SP-C, the posture read) with a CLEAN TREE.
Cycle 4's remaining waves — **SP-D (the errand spine), GR-2 (pact formation),
IN-0a (the plant handoff)** — are UNSTARTED, not half-done: SP-D was still
measuring and had written nothing when the lane was stopped. THE STOP COST
NOTHING; there are no partial edits to survey.

**SP-C WAS INDEPENDENTLY VERIFIED AT THE PAUSE** (chair-executed, not taken
from the lane's own report): its battery `tests/domain/strategicPosture.test.js`
+ `dispositionAppetite` + `strategicPostureDormancyFence` + the collision walker
+ `subsystemRowsVirtual` = **5 files / 92 tests PASSED**; the four shared
walkers it touched = **4 files / 66 tests PASSED**;
`[domain-strict] ✓ no strict-type regressions (1313 errors, ceiling 1313)`,
exit 0; the CQ5 trio confirmed present (flag in `simulationRules.js`, its
certification row in `subsystemRowsVirtual.js`); and CR-C4-1 honored —
`courtPostureOf` / `courtRiskAppetiteOf` are exported and `riskToleranceOf`
still resolves to exactly ONE definition in `src/domain`, the roads NPC read.

**TO RESUME THE BUILD:** re-dispatch cycle 4 from SP-D. Its brief is archived at
`docs/archive/workflow-scripts/fp-cycle4-spine-unlock-wf_0c8e63e0-07b.js.txt`.
SP-D unblocks FIVE downstream waves across four volumes (ES-1, TR-8, WF-2b,
IN-4, INT-3b), so it is the highest-leverage single wave remaining.

**RULINGS MADE THIS SESSION (all vetoable by the owner, all recorded):**
- **§3h — THE ENDGAME TAIL.** Nothing that can move an output may land after
  the TUNING SIGNATURE. Read §3h; it is the ONE authoritative ordering.
- **CR-C4-1** — the court reads are `courtPostureOf` / `courtRiskAppetiteOf`,
  NEVER `riskToleranceOf` (taken by an NPC read at `roads/state.js:319`).
- **J-HB-18** — TILT-NEVER-LOCK is an invariant on PAIRWISE ODDS RATIOS; the
  per-probability claim is FALSE under renormalization and was DELETED.
- **J-HB-23..28** — the habit volume's document-integrity rulings, incl. the
  COUNT LEDGER and the STRUCK-PREMISE SCAN (see the two laws below).

**TWO LAWS MINTED THIS SESSION — they generalize to every volume AND to this
file:**
1. **DERIVE-DON'T-RESTATE.** A hand-maintained restatement of a derivable
   fact (a row count, a set membership, a refuted premise) goes stale at its
   source and GREENS a shrink-only walker seeded wrong. Cures, both proven
   with mutants: the COUNT LEDGER (numbers — one parse script derives every
   counted quantity from the document's own tables and diffs each against its
   declared prose homes, occurrence counts included) and the STRUCK-PREMISE
   SCAN (claims — every refuted premise gets a signature phrase; any
   occurrence outside the register, a strike marker, or a labelled quote
   reds). THIS FILE had the same disease: FOUR spellings of the endgame tail,
   three stale. Cured at §3h by one spelling and three pointers.
2. **A MUTANT THAT PLANTS NOTHING GREENS.** A mutant whose target phrase
   wraps a line substitutes nothing and the battery passes. EVERY mutant must
   assert the file actually CHANGED and abort if it did not.

**DO THIS FIRST, IN ORDER:** (1) `cd .claude/worktrees/minifold`, `git log`,
`git status` — survey before believing anything here; foreign WIP is the
owner's, preserve it. (2) Read `docs/architected-volumes-pending-fold/README.md`.
(3) Read §3h (the tail) and §4 (the protocol — every rule there has bitten).
(4) Read `docs/SOL_QUEUE.md` for the build order. (5) Only then resume.

**THE MODEL-SUCCESSION PROTOCOL IS UNCHANGED BY AN ACCOUNT CHANGE** — see
§6b-3. Work managed or validated by a model other than Fable carries a
FABLE-SURVEY-OWED marker, and the next Fable session clears that debt FIRST.

## 3h. ⭐⭐ THE ENDGAME TAIL — THE ONE AUTHORITATIVE ORDERING (owner-constrained
2026-08-06; supersedes every other tail spelling in this file and in memory)
**Owner, verbatim:** "The soak and tuning are to be the last thing before push
and deploy." Clarified: "i trust your judgement. I just want all the soaks to
be close to the end as possible but not in a way that obstructs the optimal
path towards completion."

**THE LAW (chair-ruled, and it forces the order):** NOTHING THAT CAN MOVE AN
OUTPUT MAY LAND AFTER THE TUNING SIGNATURE. The signature is versioned and
constitutional (THE PROMISE); a band signed against a tree that then
regenerates, lights a flag, or absorbs a walk repair is stale the moment it is
signed.

1. Build waves to completion — every flag DARK.
2. **THE DIAGNOSTIC SOAK** — at build-complete-dark: the LATEST point that
   still leaves repair room. DISPOSABLE tree, flags forced lit, CONCURRENT with
   tail work so it obstructs nothing. ⛔ FINDINGS ONLY — it may not sign,
   apply or adjust one band; movements it suggests ride to step 7 as PROPOSALS.
3. Composition repairs from its findings (their own gated waves).
4. ⛔ THE OWNER'S WALK + its repairs (the owner's eye outranks any green suite).
5. LIGHT THE FLAGS + **THE ONE REGEN** (singular; golden-shift discipline).
6. **THE TERMINAL SOAK** — on the EXACT shipping tree, lit and regenerated.
7. **THE TUNING SIGNATURE** — versioned, owner-signed, frozen tree. THE LAST ACT.
8. PUSH / deploy — each push owner-confirmed (the 08-02 boundary stands). A
   BACKUP push under the standing authorization is a different act and is
   unaffected (chair reading, vetoable; resolves at its own confirm gate).

**WHAT THIS CORRECTS — measured, not remembered:** FOUR spellings of the tail
existed (:17, :85, :379 below, and memory/MEMORY.md) and they disagreed on
where the walk sits. **ALL FOUR placed THE ONE REGEN AFTER TUNING** — and the
regen is the act that lights the eight flags, so every recorded plan would
have signed constitutional bands against a world about to be transformed. Cure:
ONE spelling (this section), POINTERS everywhere else — the derive-dont-restate
law. Banked at memory/endgame-tail-order-ruled.md.

## 3g. ⭐⭐ SNAPSHOT REFRESH 2026-08-05 (~05:30 EDT — CYCLE 1 CLOSED, THE FOLD IN FLIGHT; supersedes §3f and everything below; git wins)
Same machine ⇒ the §6 memory dir survives and is CURRENT (read its index
second; the freshest hazards live there). Build lives in minifold
(.claude/worktrees/minifold, claude/composite-r4, NOTHING pushed). Session
of record: c44e5d99 (workflow journals + scratchpad under its project dir).
- **FP BUILD CYCLE 1 IS CLOSED IN FULL**: span 59df13a9..32cc17f7. Landing
  93c118b6/caab995a/b441bca5/d1cfdb67 (TR-1 repair, GR-1, GR-0, premium
  census row); close repairs 1137f935 (CR-FP-11 BOTH ARMS — LAYER_PATTERNS
  reach + the 179-entry shrink-only UNLAYERED CENSUS; matched-pair control
  flipped), f786df89 (the crossing pin now mints same-tick; mutant C2 reds
  by name), 79bceff5 (CR-FP-1 — desk rule = authority-or-token, 7 rows
  amended, THE FORBID + controls), 88150241 (CR-FP-2 re-record 404→413 —
  ⚠ the ruling's stated CAUSE was REFUTED by measurement; the act executed
  with the MEASURED cause declared in the commit body), 32cc17f7 (the
  89-line cycle-close ledger row). Verifier chain PASS end-to-end; lint AND
  domain failing-row diffs EMPTY both directions. Debts: TWO REACH_OWED
  registry rows frozen in the inclusion walker (rows owed, not baselined).
- **SEVENTEEN CHAIR RULINGS BANKED** (all vetoable, canonical text in the
  fold workflow script + memory/fable-build-era-takeover.md): CR-FP-3..10
  (the FP §11 eight), CR-ES-1..5 (the espionage five; ⚠ CR-ES-2 amends the
  2026-07-19 anonymity header BOTH homes, BY-THE-ENGINE load-bearing),
  CR-FP-11 (inclusion reach), CR-FP-12 (ES-0 early motion DECLINED — CQ2
  set unchanged), CR-ES-6 (the WY encounter table admits the spy-dwell
  FIFTEENTH row; registry unified, catch math per-resolver).
- **THE INTEGRATION FOLD IS DRAFTED AND IN FINAL POLISH** (run
  wf_3ab9cd44-602; package in c44e5d99 scratchpad fold-pass/ —
  DESIGN_FP_ARCH_ES.md 1,653 lines + DESIGN_FP_ARCH_WY.md + composed
  PARENT-DELTAS.md + QUEUE-AND-AMENDMENTS.md). Verdict arc: coh
  NEEDS-REVISION (2 HIGH) → revise → recheck NEEDS-REVISION (6 narrow) →
  polish+final RUNNING at write time. LANDING = task #34 (tree is FREE):
  copy the two volumes into docs/ (stamp HEAD-AT-LANDING), apply the edit
  pairs RE-VERIFYING every OLD anchor at land HEAD (the close lane
  appended 89 ledger lines — anchors may have drifted), admit ES+WY as the
  TENTH+ELEVENTH coupling prefixes per the walker-semantics answer,
  EXECUTE the WY §5b item-10 census (or the commit is incomplete), the GR
  erratum row (DESIGN_FP_ARCH_GR.md §3 item 1), the five-home three-member
  lighting condition, byte-scans, pathspec commits, gates via check:tail.
- **THE ADVANCE-EPOCH DIRECTIVE (owner, "extremely important")** —
  memory/advance-epoch-living-futures-directive.md is LAW: every user
  advance/reroll draws FRESH (recorded nonces ⇒ internal byte-exact
  replay); the lived past immutable; seed = starting-world address; THE
  PROMISE amends owner-signed. Architecture RUNNING (run wf_ec31fa7e-773:
  4 censuses → architect → critic; draft lands in c44e5d99 scratchpad
  epoch-arch/). Slots as its own small wave family at the next integration
  point. ⚠ its ONE kernel seam (the stream-identity term) is chair-signed;
  dark state must be BYTE-IDENTICAL including stream strings.
- **CYCLE 2 RECON IS BANKED** (memory/cycle2-lighting-road-recon.md, run
  wf_f4c426e7-c21): ⚠⚠ the SP doc's routePositionBand spelling is WRONG
  (consumer reads routeBand — pin against the appraisal typedef + rename
  mutant; correct the doc in the landing diff); the WR-9 lighting-order
  row is a PHANTOM — cycle 2 BUILDS the instrument; SP-B strictly precedes
  SP-B2 and is CQ5-BOUND (flag names bound by TR-1 forward refs;
  outboundImpression pre-registered in two walkers); ES-1 gated on SP-D's
  errandMint.js (unminted). Order: fold lands → SP-B (serialized) → SP-B2
  + the lighting instrument (+ES-4 per its gates) → onward per §5.
- **LAUNCH DECISION (owner)**: NO pre-launch post — the whole thing
  completes first, then it speaks for itself. The launch-post skeleton +
  r/rpg research + voice calibration are banked in
  memory/owner-marketing-doctrine.md. "Complete" = the written endgame
  tail — §3h is its ONE authoritative spelling — not a feeling.
- **V5 PHOTOREAL**: unchanged — 13 4K generations await OWNER CULL; 2
  sign-offs open (lettering grammar, seal ladder).
- **RESUME (in order): (1)** cd minifold, git log/status, survey; **(2)**
  read the wf_3ab9cd44-602 journal — if the fold is unlanded, land it per
  task #34's obligations above; **(3)** read the wf_ec31fa7e-773 journal —
  chair the epoch cohesion verdict (amend rounds as needed), then fold it
  at the next integration point; **(4)** dispatch cycle 2 per the recon
  charters; **(5)** the continuous-run order stands until usage exhausts →
  §6b-2 succession with FULL authority. The §10 protocol + FP §1 laws bind
  every lane. CHECK-GIT-FIRST.

## 3f. ⭐⭐ SNAPSHOT REFRESH 2026-08-05 (~00:30 EDT — THE FP-ERA HANDOFF; supersedes §3e and everything below; git wins)
Written as the owner's 5-hour window closes, WORK IN FLIGHT. Same machine ⇒ the
§6 memory dir survives and its index is CURRENT (read it second). Build lives in
minifold (.claude/worktrees/minifold, claude/composite-r4, NOTHING pushed).
- **WR-10 / THE WAR LANE IS FINISHED IN FULL** (wired dark): wave 106df58e..
  71e78fe9, ledger row @ 67a907fe in FABLE_VALIDATION_QUEUE.md (rulings
  CR-WR10-C..K; three honest rejects; the two whole-wave proofs @ 3754c6f3).
  Lighting owner-signed at the soak redo, GATED on the belief-legs waves
  (SP-B + SP-B2 + ES-4 per the amended condition).
- **THE FP ERA IS OPEN AND BUILDING.** docs/DESIGN_FP_ARCHITECTURE.md + nine
  DESIGN_FP_ARCH_*.md companions landed @ 99d63d92 (60 waves, 43 flags, 45
  refuted premises; chair rulings CQ2 early-motion AUTHORIZED + CQ5 flag
  one-commit law AFFIRMED in the commit body; 8 CQs remain chair-owed).
  **FP BUILD CYCLE 1 was IN FLIGHT at handoff** (workflow wf_0cdf49ef-9c9,
  session c44e5d99): LANDED — CW-0w slices 1-3 @ b3fb8f49/f7da6b60/03dee5fd,
  SP-A first commit @ 59df13a9; IN FLIGHT — CW-0w slice 4 (proseNumericsWalk
  push-indirection; dirty WIP in tests/helpers/proseNumericsWalk.js +
  proseNumerics baseline/test — SURVEY, never sweep), SP-A walkers, then
  GR-0/GR-1/TR-1/TR-9c behind the phase-0 verifier. A dead session KILLS the
  workflow but NOT the commits: survey git, read the journal at
  <session>/subagents/workflows/wf_0cdf49ef-9c9/journal.jsonl, then re-run
  the script (path in §resume below) with landed lanes converted to data
  literals (the WR-10w resume precedent).
- **THE ESPIONAGE LAYER IS DESIGNED AND IN COHESION-REVISION.** Owner
  directive + 8 additions (A-H) at memory/espionage-confirmers-directive.md
  (BINDING). Architecture draft (1,186 lines, 8 waves, flag espionageEnabled,
  zero new keys, ES-4 = the third leg of the WR-10 lighting discharge) at the
  c44e5d99 scratchpad espionage-arch/; first cohesion verdict NEEDS-REVISION
  (9 findings, all narrow); the amend + re-cohesion round then closed
  COHESIVE (all 9 findings repaired, all EIGHT owner additions A-H verified
  architected; 1,592 lines; NF-1 fold obligation: admit ES as the TENTH
  coupling-registry prefix + same-commit registry rows, mechanical). 5 espionage OQs + the fold-into-FP-volume integration
  are chair-owed. The tap-order ruling (H) is CONSTITUTIONAL for the whole
  information program.
- **V5 PHOTOREAL**: 13 nano_banana_pro 4K generations complete, spelling
  gates PASSED, awaiting OWNER CULL (gallery shown; workings in c44e5d99
  scratchpad v5-photo/); asset plan + prompts there too; 2 owner sign-offs
  open (lettering grammar, seal ladder); references + curation in Desktop
  "Settlement Forge template review".
- **STANDING**: disposition proposal @ 534d17f6 (D-W1 executed by WW-G; the
  rest waits per §5 order); tests/lint red base is SHRINKING (13 kind-pool
  rows cured); the espionage-and-FP chair questions ride the integration
  pass; owner-gated arms unchanged.
- **RESUME (in order): (1)** cd minifold, git log/status, survey ALL dirty
  WIP (live lanes at handoff); **(2)** read the two workflow journals
  (wf_0cdf49ef-9c9 = FP cycle 1, wf_60586a6a-68c = espionage) under
  /Users/cstokes/.claude/projects/-Users-cstokes-Desktop-settlement-engine/c44e5d99-2ba5-49d5-a554-40b68534c8eb/subagents/workflows/;
  scripts live under the same session's workflows/scripts/ (fp-build-cycle-1
  script is under the -minifold-keyed twin dir) — re-dispatch with landed
  lanes as data literals; **(3)** finish cycle 1 through its verifiers;
  **(4)** the espionage integration pass (fold amended draft into the FP
  volume, rule 8+5 questions, land, queue insertion); **(5)** next cycles
  per §5 order (SP-B/SP-B2 + ES joint waves next — the lighting road).
  The §10 protocol + the FP volume §1 laws bind every lane. CHECK-GIT-FIRST.

## 3e. ⭐⭐ SNAPSHOT REFRESH 2026-08-04 (~13:00 EDT — THE PAUSED HANDOFF; supersedes §3d and everything below; git wins)
Written at an ACCOUNT SWITCH with EVERYTHING DELIBERATELY PAUSED by owner order
("pause everything for now"). Same machine ⇒ the §6 memory dir survives and its
index is CURRENT (read it second, after this section). NOTHING is running.
- **WHERE THE BUILD LIVES**: minifold worktree (.claude/worktrees/minifold,
  branch claude/composite-r4, ~380 commits ahead, NOTHING PUSHED). This ledger
  branch takes "Ledger:" rows only. Rulings registry =
  minifold docs/FABLE_VALIDATION_QUEUE.md (through WR-10's row + WR-9's).
- **THE WAR LANE (Lane A1) IS BUILD-COMPLETE except one paused repair.**
  WR-1..8 CLOSED — WR-8 via the era's FIRST rejected-then-repaired close
  (@ 1b7c1eac + 39ba6590; the channel_inferred vocabulary leak + a strict red
  were caught by verification, cured by membership-after-normalization,
  CR-WZ5-A/B). WR-9 COMPLETE AS AN INSTRUMENT (@ fd222269, 06c58f69, 7a3c51ef,
  a70c9284 + the chair's anchor repair d91e3ea0): endings classifier, duration
  envelopes with an `unmeasured` cell, six force cells (force 3 permanently
  UNOBSERVED, owner-gated), the collector counting real wars via the OUTCOME
  STREAM (the briefed year-boundary census was measured BLIND to within-year
  wars and replaced — J-WR9D-2). The acceptance VERDICT stays owner-held.
  WR-10's INSTRUMENT is BUILT (@ f9a7ddea, 32f4708f, 03b8ecde, a5647976:
  sovereignty_transfer term row, K3 zero-import appraisal, the two-sided
  bundle conjunction with `ceiling_reached` receipted, ledger-membership
  eligibility, the three-read geographic bound, the TR-5 degradation contract
  pinned) — its verifier CONFIRMED architecture/byte-identity/9 mutants and
  REJECTED on 3 small ratchet-attribution defects. **WR-10r (the repair) was
  DISPATCHED THEN PAUSED seconds later, zero commits — resume:**
  `Workflow({scriptPath: '<session-dir>/workflows/scripts/build-cycle-49-wr10r-ratchet-repairs-wf_8cc3d233-668.js', resumeFromRunId: 'wf_8cc3d233-668'})`
  (full path in memory: wr10-sovereignty-market-state.md; the brief carries
  CR-WR10-A clamp fork + CR-WR10-B twin-note reconciliation, complete).
  WR-10's WIRING (transfer writer, plan trigger, Herald kinds) is
  DEFERRED-RECORDED on measured reasons incl. the volume's missing §4
  persistence story (chair/owner item).
- **THE IDENTITY PROGRAM**: V4 is CLOSED (V4C 653be592..5ddd0d08 + V4D
  a2dbdd36..98edbc9f + chip cures 456271ea/ca46705b/76ea345c) — mobile plaque
  cured, blend contract pinned, docstrings measured-true. **V5 is the LIVE
  DIRECTION** (memory: ribbon-v5-direction.md): FOUR owner directives — organic
  asymmetric hanging vanes with per-feather thread bindings; the cartographer's
  CARTOUCHE wordmark with the wax seal AS the O, prominent; THE HALF-ARROW
  DEPTH LAW (the header is the BOTTOM HALF of a cylinder, axis at the top
  edge; shadows systematic; the FONT CURVES with the barrel, subtly, legibility
  outranks); burned-into-wood reference tabs. **The counsel pass (spec +
  mockups, ZERO src changes) was amended with all four then PAUSED — resume:**
  `Workflow({scriptPath: '<session-dir>/workflows/scripts/design-cycle-48-ribbon-v5-counsel-wf_98216244-174.js', resumeFromRunId: 'wf_046c88e2-739'})`.
  The owner generated a Nano Banana Pro reference set; the chair's binding
  curation is at Desktop **"Settlement Forge template review"/
  V5-NANO-BANANA-REFERENCES.md** (owner still owes the PNGs into that folder;
  the doc stands alone meanwhile). Key verdicts: burned-frame cartouche at
  header scale, torn-leaf silhouette at large registers, seal-in-O oversized,
  spiral lengthwise binding added, ⚠ the PENDANT PROBLEM (vanes must read as
  fletching at rest, never hanging charms).
- **OWNER-GATED, PARKED (never silently build)**: the WR-8/WR-10 cert-row
  preset fork (+32 bytes on new-campaign saves — measured, reverted, two arms
  in the ledger); force 3's substrate (war identity on a persisted
  seat-transition record); F1 raw "channel inferred" in DM prose (materializer
  population, closing = signed golden shift); K1 severity carry; seat ransom +
  persistence; counterpart re-mint; XW-7 scorched earth; K-cap; §6b picks.
  The V4-era nock/whole-arrow glance items are SUPERSEDED by V5.
- **PROGRAM-LEVEL DEBT the terminal phase must clear first**: tests/lint is
  RED AT BASE (32 tests / 11 files — stale ratchets, warDeployment 16→17,
  three SP-6 kind-pool walkers) + mechanismLitCoverage 2. No full `npm run
  check` can green until dispositioned. Chair owes the owner a disposition-wave
  proposal.
- **LAWS LEARNED SINCE §3d (each bit; all in memory + queue rows)**: attribute
  lint by VIOLATION ROWS, never failing-file names (count growth inside an
  already-red walker is invisible by name — bit TWICE); a negative control
  must restore EVERY file class the walker scans (src-only restore is blind to
  a test-file cause); byte-identity claims need PROVENANCE-COVERING fixtures +
  an EXECUTED non-vacuity count, acceptance = PER-CELL equality (combined
  cross-harness hashes are unverifiable BY CONSTRUCTION); membership tests on
  vocabularies come AFTER normalization (before kills the aliases); TWO
  populations persist relationshipStates and only the WRITER was the bug;
  a year-boundary census is blind to within-year wars — read the outcome
  stream; the SPATIAL CANON exists only in the soak fixture (probes without it
  confirm broken designs); an ANALYTIC pin computing a composite from tokens
  cannot see a missing declaration — pin the RENDERED element; a geometry
  proven on one breakpoint is a claim about one breakpoint; `// anchored:`
  counts only on the assertion line or the line immediately above; an
  empty-vs-empty diff exits 0 (assert both sides non-empty AND untruncated —
  gate-tail truncates); declaring a VIRTUAL preset key moves new-campaign
  saves; queue rows are SPECS not open work — re-measure every premise with
  multi-spelling greps (the chair's own force-2 grep missed CAPABILITY_FLOOR).

## 3d. ⭐⭐ SNAPSHOT REFRESH 2026-08-04 (~00:45 EDT — THE BUILD ERA HANDOFF; superseded by §3e; git wins)
Written for an ACCOUNT SWITCH: the owner may resume from a different Anthropic
account. Same machine ⇒ the memory dir in §6 survives and its index is current;
different machine ⇒ THIS FILE + the two queue docs are sufficient alone.
- **WHERE THE BUILD LIVES**: minifold worktree
  (.claude/worktrees/minifold, branch claude/composite-r4, ~260 commits ahead
  of origin, NOTHING PUSHED — pushes are owner-confirmed, terminal phase).
  The ledger (this branch) takes "Ledger:" rows only.
- **THE ERA**: Fable chaired cycles 6-37 (2026-08-03→04) under total
  delegation: Opus implements+verifies, chair rules vetoably into
  docs/FABLE_VALIDATION_QUEUE.md (the CR-*/R-BLD-* registry lives there).
  Zero reverts. Every landing adversarially verified.
- **STATE AT WRITE TIME (verify with git log first — lanes may have landed
  after this line was written):** WR-1..7 COMPLETE+WIRED. WR-8: slices 1-6
  built+verified; the razing WIRED at the warDeployment mouth; the license
  SPREAD LANDED net-zero (WZ-3 @ b43986b5 — CR-PK-1's premise was FALSE,
  disproven by espree, the safe restructure taken; a multi-razing
  accumulator leak found+fixed in the same commit); the WD E-H debt closed
  (35→30); CR-WR8-H answered (believed razings = news ledger + hop-delay
  arrival, NO new persisted surface). Lane WZ-4 (wf_f902672d) was IN FLIGHT
  on the last three quarters: observer-axis hits, deterrence consuming
  readAllianceWebRisk (census: exactly ONE consumer today, must become
  exactly TWO), the casus wired. Its verifier says "WR-8 IS CLOSED" only if
  everything holds — read its queue row. THEN: WR-9 (instrumentation) → WR-10 (certification) →
  the war-file strict burn-down → Herald mint-index → FP engine waves.
- **THE RIBBON/IDENTITY PROGRAM**: docs/DESIGN_RIBBON_V4_SPEC.md (minifold)
  is THE LAW — the war-arrow header (cedar shaft, gilded wordmark on a bole
  bed, seal-o carrying the site device on a size ladder, four mirrored
  parallel feather slashes, quill-line indicator, texture-complete-at-part-2).
  Lane V4 (wf_80bd2b67) was IN FLIGHT executing it; V4.1 (task #105,
  OWNER-APPROVED counsel integrations incl. the nock build-and-show)
  dispatches when V4 lands. The bottom underline is RETIRED, not duplicated.
- **IN-FLIGHT LANES AT WRITE TIME** (if dead on resume: SURVEY PARTIAL EDITS
  FIRST — killed agents leave partial work; never sweep, never stash):
  wf_7fb11f8c (WZ-3, worldPulse), wf_80bd2b67 (V4, nav/brand/theme).
- **OWNER-GATED, PARKED (never silently build)**: K1 severity carry, seat
  ransom decisions, ransom persistence, compromise counterpart re-mint,
  razing-as-MINOR (J-WZ2-1, vetoable), the gilded-seal treatment (vetoable,
  rosette fallback), the nock (build-and-show, owner's glance decides),
  XW-7 scorched earth, K-cap signing, all §6b picks.
- **LAWS LEARNED THIS ERA (each bit; all in memory + queue rows)**: the
  STAGED-SET law (verify git diff --cached before EVERY commit; commit with
  pathspec); NUL bytes 5× (python byte-scan every write; grep/tail blind);
  per-file tsc --strict is VACUOUS; shared ratchets need git-diff-before-
  staging; the edge bundles are BUILT ARTIFACTS (freshness reds are never
  "inherited"; rebuild = repair, deploy = owner); lint-staged lints only
  staged files; parallel-load test reds are fake (ps aux first); the
  registration walkers in tests/domain are part of every decomposition gate;
  substring pins cannot see grammar; hand-keyed line addresses rot.

## 3c. ⭐⭐ SNAPSHOT REFRESH 2026-07-26 (~17:00 EDT — supersedes §3b and §3; git wins)
- **THE BANKING FOLD**: claude/composite-r4 @ 7a6603de now carries EVERYTHING the
  2026-07-20→26 era built — 12 lane commits (b503fe05..7a6603de, ~175k insertions):
  migrations contiguous to 188, the T5 launch surface (obligation webhook, cron
  workers, 4 ops runbooks, release identity, CSP enforce-flip pending owner
  ratification), the application-command spine, import reconciliation, the
  custom-content platform, TownScene 3D (opt-in), and the game-grade proof slices
  (all flags dark). Pushed to origin as backup under standing authorization —
  verify with `git ls-remote origin claude/composite-r4`.
- **GOVERNANCE**: decisions live in ONE surface now — docs/OWNER_DECISION_QUEUE.md
  (this branch). The 2026-07-26 ledger rows carry four rulings: 07-24 pivot
  ratified-by-banking (PRODUCT_COMPLETION_ARCHITECTURE's 10-step order = the
  governing frame; ⛔ tail acts unchanged) · golden-regen adjudicated (in-tree
  regens = documented corrections; THE ONE REGEN still owed, singular) · WAVE 8
  CONFIRMED NEVER RUN (money-code items missing; respec migs from 189; issue NO
  partial refunds until the webhook train deploys) · queue consolidated.
- **LIVE LANE**: a capability-remediation session (CAPABILITY_REMEDIATION_PLAN.md,
  waves R-0..R-5, minifold) was actively writing through the fold — fresh dirty
  state in minifold is ITS work; never clean/reset; its reds (mutation-manifest
  totality, distribution depth measurements) are expected until it closes.
- **Successor chain**: this file → COMPREHENSIVE_REVIEW_PROGRAM.md newest rows →
  OWNER_DECISION_QUEUE.md → minifold docs/CURRENT_STATE.md +
  PRODUCT_COMPLETION_ARCHITECTURE.md → lane docs.

## 3b. ⭐ SNAPSHOT REFRESH 2026-07-19 (~05:45 EDT — supersedes §3 below; git wins)
- The NIGHT RUN landed the ENTIRE deep-craft build: C1–C16 all complete;
  traditions lane complete (T-1..T-5, tip 80b8ad71); illustrated-town complete
  (d16d348e); FOLD BATCH 1 folded c2(+c2l)/c13/c5 into claude/deep-craft
  (tip aa55836a+burn-down commits, main deep-craft worktree agent-a39bc...).
- UNFOLDED branches awaiting FOLD BATCH 2 (ceilings set to measured counts at
  the fold): deep-craft-c14c15 @ 7748d49a · deep-craft-c16 @ 41ae4a1e ·
  deep-craft-pages @ 55e4a69c (carries a DECLARED kill-list red by design) ·
  restoration-pdf @ 2e4f3282 · restoration-chrome (running) ·
  restoration-compendium (running) · the burn-down commits on deep-craft itself.
- Phase-D: census COMPLETE (docs/PHASE_D_RESTORATION_CENSUS_2026-07-19.md);
  restoration ledger at ZERO PENDING (23 RESTORATION-OWED being worked by the
  sweeps). Expected reds NOW: the 4 parked goldens (aiGrounding freshness was
  CURED at the deep-wave fold — no longer expected);
  organicSamples was CURED at C3-e (a red there = new drift); pages-lineage
  branches carry the declared kill-list red until fold 2.
- The 15-min lane-keeper heartbeat + the ledger rows (newest-first around line
  ~1137) are the live state. THE FABLE BOUNDARY: 23:59:59 PT Jul 19 — the
  continuity order (§6b) hands this loop to the Opus successor unchanged.

## 3. STATE SNAPSHOT AT WRITE TIME (verify with git — never trust this over git)
- **Main tree** (/Users/cstokes/Desktop/settlement-engine) = branch
  `review-fixes-2026-07-08` — LEDGER ONLY. Never check out code branches here.
- **Worktrees** (.claude/worktrees/): `agent-a04d3f325c72e62dd` =
  claude/the-composite @ 78a04afc (the code base of record) ·
  `agent-a39bc277a620ae767` = claude/deep-craft (create page COMPLETE + library
  restored + Living Backdrop; last known a7afc9cc) · `illustrated-town` =
  claude/illustrated-town (IT-1..IT-3 landed @ 5324c246; IT-4 was RUNNING —
  check `git -C <wt> log/status`: clean tree = last commit is truth; dirty tree
  = an agent died mid-work, DISCARD nothing, read the diff first) ·
  `traditions` = claude/traditions (T-1 @ 686d2cb9; T-2 was RUNNING — same check).
- **GitHub backup** (origin): review-fixes @ b95bf331 + w7-prep + the-composite +
  deep-craft@9906d793 pushed/verified. The lane branches were NOT yet pushed
  (pre-push hook rejected under machine load — retry when quiet; hook runs the
  full suite, ~7 min; NEVER --no-verify).
- **Expected suite reds on the composite lineage — EXACTLY 4**: the 4 parked
  golden families (generatorGoldenMaster, beliefMapGolden, worldpulseDeityGolden,
  pdf goldenViewModel). aiGroundingBundle.freshness was CURED at the deep-wave
  fold (`npm run build:edge-shared`) and is no longer a red. THE_RESURVEY_HANDOFF
  §3g carries the live baseline. ANY other red: triage by name vs
  the base tip; timeout-shaped reds under machine load are FLAKES — isolation
  re-run before diagnosis (proven ~6× on 2026-07-18).

## 4. THE NON-NEGOTIABLE PROTOCOL (each has bitten this program; all are load-bearing)
- Hard gate EVERY state-mutating compound: `[ "$(git branch --show-current)" =
  "<expected>" ] || exit 1` — cwd resets between shell calls silently.
- `git stash` FORBIDDEN. A foreign stash (analytics-intelligence-layer) exists —
  never touch it. Never `git add -A/-u/.` — explicit files only.
- Gates run BARE, each exit code checked — a pipe (`| tail`) masks failures.
- `npm run build` BEFORE verify:dist. Worktrees resolve the MAIN tree's
  node_modules (works; triage reds by name-identity vs base).
- NUL-scan diffs with python before merges (grep silently lies on NUL bytes).
- Eager first-paint budget 1,040,000 B (ratchet-tested); everything new lazy.
- Kill-list ratchets (tests/design/deepCraftKillList.test.js) are tolerance-0
  shrink-only. domainAnyCastBaseline runs PER-COMMIT on any domain-touching lane.
- New engine systems ship DARK behind VIRTUAL flags (absent from
  DEFAULT_SIMULATION_RULES) with byte-identical dormancy goldens.
- Full suite at every fold (focused gates have a proven blind spot).
- Behavioral test pins stay green UNTOUCHED; a rewritten pin is a violation.

## 5. HOW TO RESUME (in order)
1. `git -C <each worktree> branch --show-current && git log --oneline -3 &&
   git status --porcelain` — build the real state picture. Reconcile against the
   ledger's newest rows.
2. Finish any half-done slice per its design doc's slice spec (the briefs' shape:
   lettered commits, focused gates per commit, full suite at lane end).
3. Then follow THE_REMAINING_ARCHITECTURE.md top to bottom. The remaining arc:
   T-3..T-5 · IT-5..IT-6 · deep-craft slices C4 (dossier — the owner's CLOSED
   content model), C2 (the Welcome FILM — spec in §2, six chapter legs from the
   master at ~/Desktop/settlementforge-marketing-masters/), C3/C5/C6-C16 ·
   Phase D (ratchets 0×4 + restoration ledger zero PENDING) · the folds ·
   ⛔owner finished-site walk · push completion · ROUND 3 (vs THE EIGHT CROWNS,
   §4, intake pre-stocked) · THE ENDGAME TAIL PER §3h (walk and THE ONE REGEN
   precede the terminal soak; tuning is the last act) · THE VERY END (⛔owner: legal,
   support-email flip after MX verified, merge button, db push).
4. Ledger row + commit after every landing. The owner walks; their eye overrides
   any green suite — treat their one-line corrections as rulings and record them.

## 6. IF YOU ARE CLAUDE (same machine/user): persistent memory lives at
~/.claude/projects/-Users-cstokes-Desktop-settlement-engine/memory/ (MEMORY.md is
the index — hazards, rulings, gotchas). If you are NOT Claude: everything
load-bearing from memory has been mirrored into the docs above; trust the repo.

## 6b-3. ⭐⭐ THE FABLE-DEBT CLAUSE (owner, 2026-08-05 — extends 6b-2, verbatim intent)
"When [Fable weekly usage runs out] switch every operation to Opus 5.
However, everything that has not been managed and/or validated by fable
five will be required upon the next free fable usage from whichever
Claude to be surveyed and validated by fable."
PROTOCOL: (1) on Fable exhaustion, Opus 5 takes EVERY operation, full
authority, nothing pauses — validation is retroactive, never gating;
(2) EVERY Opus-era ledger row in docs/FABLE_VALIDATION_QUEUE.md carries
"⏳ OPUS-ERA — FABLE SURVEY OWED" in its heading, with chair-grade
judgment calls listed as J-* entries for cheap re-ruling; (3) the next
Fable-available session (from whichever Claude) clears the
survey-and-validate debt FIRST — survey every owed row, EXECUTED
spot-validation of load-bearing claims, adversarial re-verification for
sensitive substrate — marking each ✅ FABLE-VALIDATED or spawning a
repair; (4) depth default (vetoable): survey + executed spot-validation,
not a full era re-gate, unless the survey finds cause. Full protocol:
memory/opus-succession-active.md.

## 6b-2. ⭐⭐ CONTINUITY ORDER UPDATED (owner, 2026-07-31 — supersedes 6b's model):
"If i run out of fable, i want you to seemlessley switch to opus 5." An OPUS 5
successor inherits FULL standing authority the moment the prior session ends — same
laws as 6b (judgments vetoable, owner-gated classes never self-ruled, ultracode on,
manager+implementer both chairs). NEW OBLIGATION: every Fable-chair judgment
(acceptance, architecture deviation, golden adjudication, soak interpretation, tuning
ratification) made under Opus is recorded as a row in the code branch's
docs/FABLE_VALIDATION_QUEUE.md; a later Fable-capable account re-validates oldest-first
(CONFIRM/ADJUST-forward/ESCALATE) and readjusts instructions on systematic lean. The
LIVE program surface is minifold docs/DESIGN_REALM_DIRECTIVES.md (Progress blockquote).

## 6b. ⭐ STANDING CONTINUITY ORDER (owner, 2026-07-18, verbatim intent):
"if i run out of fable, automatically switch and continue all the work with opus
4.8 ultracode fast. don't wait on me." — A successor session on OPUS 4.8 (fast
mode, ULTRACODE ON) inherits FULL standing authority the moment the prior session
ends: DO NOT wait for the owner, do not re-ask for the delegation — resume per §5
immediately. Same laws: judgments recorded vetoably in the ledger; owner-gated
classes (⛔ items) still never self-ruled; the owner's walk feedback = rulings.
Ultracode standing: orchestrate with workflows/parallel implementer agents by
default; adversarially verify findings; the manager/implementer split continues
with Opus in both chairs.

## 7. STAFFING NOTE (owner's standing preference, brand-agnostic)
One MANAGER context holds the ledger and dispatches; IMPLEMENTER agents/sessions
do every code change in the correct worktree with VERIFY-FIRST briefs (state the
expected branch+tip; the implementer stops on any mismatch). If your platform has
no subagents, work serially as your own implementer — the protocol is identical.
The owner's model split (strongest model = manager/architect; capable model =
implementers) translates to whatever tiers you have.
