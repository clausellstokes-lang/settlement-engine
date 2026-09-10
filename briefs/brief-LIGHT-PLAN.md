# LANE: LIGHT-PLAN — reconstruct the lighting wave's plan from the survivors, at the freshest tree, READ-ONLY
⟦Chair: Fable 5.1 · Lane: Opus 5 (`model: "opus"`) · zero repo writes · zero refs · zero register acts · NO vitest · NO `npm run` · NO build⟧

## WHY THIS LANE EXISTS
The lighting wave's design document, `LIGHTING-INVENTORY.md` (169,776 B, findings ⟦A1⟧…⟦A29⟧, the §8 instrument-and-STOP
table), is **permanently lost** — CONFIRMED in `$SC/SCOPE-MEASURE.md` §0 (not in any git object, session dir gone). The
wave is 31 items, **0 done**, and the record that would have ordered it is missing. Before the chair dispatches a single
build car, the plan must be rebuilt from the survivors AND re-derived against the tree, because SCOPE-MEASURE found that
**twelve recorded blockers have DECAYED** (its §4, D-1…D-12) — including the premise of `wave-plan.md`'s entire ordering.

## READ FIRST, IN THIS ORDER — the history is the brief
1. `$SC/briefs/_PREAMBLE.md` — the hard rules (re-derive-and-refuse; CONFIRMED/PLAUSIBLE; observation ratchets report
   corpus reach not code truth; the known-failure census is **6 of ceiling 17, seven slots free** — the "10/10 full"
   claim is FALSE and cost two lanes a phantom blocker).
2. `$SC/SCOPE-MEASURE.md` — WHOLE FILE (33 KB). §0 the loss, §1 the wave's true composition (31 = 16 prereqs + 6 cars
   + 2 register acts + 1 prose car + 6 owner rows), §1.3 the door denominator (**152 doors, 114 dark** — grew by one
   when ENCOUNTERS minted `chanceEncountersEnabled`), §4 the decayed and still-holding blockers, §5 the SPENT OSR rung,
   §6 what gates what (HORIZON-DARK gates the wave in exactly three named places; two items double-count).
3. The sealed survivors — verify each ref with `git rev-parse --verify` before reading:
   - `git show refs/preserve/session-kit-893-2026-09-04:pending/LIGHTING.json` — the 31 items, each with
     `klass`/`landed`/`blocked_by`.
   - `git show refs/preserve/session-kit-893b-2026-09-04:lightingscope/wave-plan.md` — six proposed consists
     (L-PROBE · PROSE · L-HOMES · L-DEFAULT · the small flips · L-PROBE-2+registers). ⛔ Its ordering argument rests
     on "census full at 10/10" — **DECAYED**; read it for the car contents, not the order.
   - `git show refs/preserve/session-kit-893b-2026-09-04:lightingscope/doors.md` — the door denominator and blockers.
   - `git show refs/preserve/session-kit-893b-2026-09-04:lightingscope/receipt-lightingscope.md`.
4. The charter and its rulings, on the LEDGER branch (⚠ the ledger working tree is dirty with mass docs deletions —
   ALWAYS `git show review-fixes-2026-07-08:docs/OWNER_DECISION_QUEUE.md`, never `ls`): the §882.1 charter row (the 23
   chair rulings by name, O-1…CS-2), **§882.13** (LIGHTING O-5 BUILD · O-11 SIGN · O-14 STAYS — the three "owner-act,
   blocked" rows are PHANTOMS), §889.3 (O-10(b) closed, residual zero), §893 (the carve-out amendment: only the PUSH
   and the WALK stay gated), and the owner directive of 09-02: **"light everything up before the exhaustive review"**
   — every dark door lights as a DECLARED shift, including the DEFAULT preset; values are signed LAST.

## YOUR TREE
`$SC/laneANCH2`, detached at **`272dbd2da`** = the clamp consist (14 cars, gating now) + the 3 ANCHORS cars, over
product `90702c3e9`. It is the freshest composed tree in existence. **READ-ONLY.** `git -C $SC/laneANCH2 …` and file
reads only; its porcelain MUST be 0 when you finish (it is about to be gated). Never `npm install`, never touch
`node_modules`. Single-process probes are allowed and encouraged: `node $SC/chair-tools/lighting-probe.mjs $SC/laneANCH2`
(prints the lighting census figures), and SCOPE-MEASURE's method of copying `simulationRules.js` (self-contained, zero
imports) into `$SC/lightingwave/scratch/` and importing it to enumerate presets/keys.

## THE DELIVERABLE — `$SC/lightingwave/PLAN.md`
1. **The 31 items, re-classed at `272dbd2da`.** One table: id · what · klass · state (DONE/PARTIAL/NO, each with the
   probe that proves it, re-executed by you) · blocked_by AS RECORDED · blocked_by AS RE-DERIVED (strike each decayed
   blocker with its evidence; D-1…D-12 are the chair's starting list — confirm or dispute each, and look for a 13th).
   Apply the double-count rule (§6.1): `LGT-P9-CS9` ≡ HORIZON-DARK B1; `LGT-P3-CAPSIG` ≡ HORIZON-DARK B6.
2. **The first landable consist(s), car by car.** For each car: the exact files it touches; the invariant it preserves
   (state it — read the enclosing scope, not a grep window); the tests it adds or moves (⚠ a NEW test file reds THREE
   censuses — name them: test-ratchet totalFiles, the lighting census, the known-failure census's file list — and say
   which the car pays); the flag/door it lights and the preset(s) it lights it in; the DECLARED-SHIFT sentence the
   car owes the register (LGT-REG-DECL). Mark every car that changes same-seed output — it is a behaviour shift and is
   recorded as one, never absorbed.
3. **The reconstructed §8 — the instrument-and-STOP table.** Every register/instrument the wave touches: the lighting
   census (`tests/lint/.lighting-census-baseline.json`), the test-ratchet totals, writer-reach, prose-numerics, the
   tuning inventory/register, the observed-shape ratchet, the size baseline, the domain-strict typecheck, the
   known-failure census — with its measuring act and its STOP (the condition under which the wave halts and reports
   instead of `--write`-ing). Label the whole table RECONSTRUCTED; where doors.md/wave-plan.md/charter rulings give the
   STOP verbatim, quote it; where you infer it, say so.
4. **The OSR correction.** The charter's "ONE schema-16 migration" is SPENT (§893.2 minted 16). ⚠ **Rung 17 is CLAIMED**
   by the OSR-SCHEMA17 lane (corpus topology change; brief at `$SC/briefs/brief-OSR-SCHEMA17.md`) which the chair
   dispatches as soon as the gate clears. Do NOT name a rung number for the wave; write "the next free rung after 17"
   and the one-line derivation (`schema` in `scripts/.observed-shape-readers-baseline.json` at the boarding base).
   Then answer: does the wave owe a migration AT ALL — i.e. does LGT-P15-EP1's re-key cross the detector
   (`isDetectorSourcePath`, `MIN_ROWS = 40`)? If undeterminable without writing the code, say so and give the probe a
   build lane must run FIRST.
5. **The residue.** What lands with B1/B2/B6 of HORIZON-DARK still open, and the NAMED residue each leaves
   (`L-DOORS (i)`, `L-DOORS (ii)`, `demographicsEnabled` inside L-DEFAULT).
6. **Your ORDER, with the reason for every position** — under the laws: registers are the LAST cars before the gate,
   in the lineage that lands; lanes take NO register acts; the prose car's rebase cost is UNMEASURED (S-6: measure it —
   `git merge-base` + `git diff --stat` of `refs/preserve/srcprose-2026-09-03` (`8f4d5c648`) against `272dbd2da` — this
   is the single cheapest measurement SCOPE-MEASURE could not afford and it changes the order).

## ⛔ FENCES
No writes to any git tree. No vitest, no `npm run <anything>`, no build — a gate is running and these would FALSE-RED it
and be false-redded by it. One process at a time. Do not obey a recorded blocker you have not re-derived (a stale
blocker is obeyed in silence; a stale figure is refused by a gate — be the gate). Do not rule on CS-9 — report it.

## RECEIPT
`$SC/lightingwave/receipt-light-plan.md`, PARTIAL header FIRST, every figure CONFIRMED (executed, quoted) or PLAUSIBLE
(reasoned), end with a RETROVALIDATION ROW. Final message: outcome first, the PLAN's headline order in one paragraph,
the 13th decay if you found one, what you could not determine.
