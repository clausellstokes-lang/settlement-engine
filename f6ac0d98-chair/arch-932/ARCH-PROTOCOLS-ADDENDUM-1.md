# ARCH-PROTOCOLS — ADDENDUM 1 (the chair, Fable 5.1, 2026-09-15 22:2x EDT) — THE LIT REGIME MEETS THE VIRTUALITY LAW

Written under the owner's 14:4x grant and the 16:5x order ("everything that we built is built lit on"), on the trade skeptic's two
family-wide findings (both CONFIRMED at source by the skeptic at laneCONSIST-932 `315080928`). Every ruling below is VETOABLE; a veto
reverts code. Read this after ARCH-PROTOCOLS.md §1–§2 and before any LIT car. It binds EVERY family, not trade alone.

## 1. THE FINDINGS

**F1 — the virtuality law.** `tests/lint/tradeConvergenceContract.walker.test.js:367` asserts every one of the eight `TRADE_RULINGS_FLAG_KEYS`
is "absent from the defaults and from every preset spread" (`PRESET_RULE_KEYS` at `:141-144` = `Object.values(SIMULATION_RULE_PRESETS)
.flatMap(p => Object.keys(p.rules))`, so a `...SIM_LIT` spread IS a preset key), and its message cites L2 of the compiled architecture
(`docs/DESIGN_FP_ARCHITECTURE.md:92`: "Every FP flag is VIRTUAL: absent from DEFAULT_SIMULATION_RULES and every preset spread"), restated
in `DESIGN_FP_ARCH_EP.md:799`, `ES:316`, `POP:138`, `SP:45`. No FP flag has ever been lit in a preset; the built-lit regime has never met
this wall. Every LIT car in every family reds `:367` and contradicts L2 as written.

**F2 — the lighting-order law is executable.** `evaluateTradeFlagLighting` (`src/domain/certification/tradeConvergenceContract.js:493-525`)
pushes `trade_precondition_dark` when a lit TRADE key's `requiresTradeFlags` are dark in that preset (`tradePactsEnabled` requires
`casusCommerciiEnabled`, `:337-341`) and `foreign_precondition_dark` when its `requiresForeignFlags` are dark there (`venturesEnabled`
requires `commodityFlowEnabled`, `:353-361`; `foodCaravansEnabled` likewise). `commodityFlowEnabled` is lit ONLY in `realistic_regional`
(`simulationRules.js:769`) and the ceiling preset (`:938`); it is DARK in `dramatic_campaign` and `living_realm`, two of the four lit presets.
A LIT car that declares a TRADE key in all four presets therefore fails its own contract in two of them.

## 2. THE RULINGS

**R1 — L2 IS AMENDED (the owner's 16:5x order supersedes a law compiled under the built-dark regime).** L2 now reads: *"Every FP flag is
VIRTUAL: absent from `DEFAULT_SIMULATION_RULES`, and absent from every preset spread EXCEPT the `SIM_LIT` cohort of the four lit presets
(`realistic_regional`, `dramatic_campaign`, `living_realm`, `full_simulation`), where a LANDED wave's key is declared `true` by its LIT car
and nowhere else."* The walker at `:367` is re-cut to assert EXACTLY that: (a) absent from the defaults; (b) present in a preset spread
ONLY through `SIM_LIT`; (c) every `SIM_LIT` key has a register entry in `ENGINE_GATED_VIRTUAL_RULE_KEYS` and a certification row
(ARCH-PROTOCOLS §1's shape). The L2 sentence and its four restatements are amended ON THE LEDGER by the chair at the §932 landing (they are
ledger-branch docs); the dock's walker message cites "L2 as amended by ARCH-PROTOCOLS ADDENDUM 1 (2026-09-15)". Until the terminal soak
ends and the regime reverts to built-dark, `SIM_LIT` is the one lawful home of a lit FP key; after the soak, emptying `SIM_LIT` is the
single reverting act.

**R2 — THE LIGHTING-ORDER LAW BINDS THE BOARDING ORDER.** No LIT car declares a key while the family's contract evaluator
(`evaluateTradeFlagLighting` for trade; each family's own, where one exists; ARCH-PROTOCOLS §3's fences otherwise) reports a violation for
ANY lit preset. Consequences: (i) THE LIGHTING DOOR TRAIN (D0, §3 below) lands BEFORE any LIT car of any family; (ii) within trade,
`casusCommerciiEnabled` (lane 7) is lit before `tradePactsEnabled` (lane 2); `commodityFlowEnabled` (door car B) before `foodCaravansEnabled`
(lane 1) and `venturesEnabled` (lane 56a); `merchantHousesEnabled` (lane 55) before `corneringEnabled` (lane 8), as brief 8 already
orders; (iii) EVERY LIT car is built AT LANDING on the consist, rebased, where cross-lane preconditions are visible — never in the dock
against the slot's dark presets. A brief states its lane's lighting preconditions in BOTH directions (what it needs lit first; what it
unblocks), as the skeptic asked of brief 7.

**R3 — THE MINT/LIGHTING SPLIT (law 2 read precisely).** The DARK MINT — the register entry in `ENGINE_GATED_VIRTUAL_RULE_KEYS` and the one
by-name `=== true` gate read — MAY land early in a lane, so the feature is gated from its first car. The LIGHTING — the `SIM_LIT`
declaration, the tail-leaf certification row, the three `subsystemRowsVirtual.test.js` edits, BOTH `contributionLedgerShape` literals read
off HEAD, the covering-array census, the two edge bundles + metas, the LIT-shape fence, the witness re-record, the shift-ledger draft — is
the LAST car of the lane, rebased at landing, its counts taken from HEAD. Law 2 ("the flag-mint car is last") means THIS car. The trade
briefs' split stands under this reading; the count-from-HEAD literals move from the early mint car to the last car wherever a brief pays
them early (the skeptic's rows for lanes 1, 2, 7, 8, 55, 56a, 56b).

**R3 AMENDED (22:5x, on the correcting architect's measurement at the consist):** the partition above is UNLANDABLE as written — `tests/lint/engineGatedRuleKeys.walker.test.js:512-520` (`manifestWithoutRow`) reds a register entry without its certification row, `VIRTUAL_PENDING_RULE_KEYS` is pinned `[]` (`subsystemRowsVirtual.test.js:647`), `:646` pins the ordered `VIRTUAL_RULES`, and `contributionLedgerShape.test.js:118-119` pins both lengths. THEREFORE the DARK-MINT car carries, in one commit: the register entry, its certification row, the three `subsystemRowsVirtual.test.js` edits, BOTH literals read off HEAD at ITS base, the covering-array union and the two edge bundles + metas; the LAST car (the lighting: the `SIM_LIT` declaration, the LIT-shape fence, the witness re-record, the shift-ledger draft) RE-READS every count off HEAD at landing and re-pays any that moved. Law 2 is satisfied by the last car's re-read, not by deferring the literals. Every trade brief already records this as its one forced departure from R3-as-first-written.

**R4 — SP-4a (lane 55, car 0).** The constitution amendment (`POSTURE_ACTOR_KINDS` widened past `['settlement']`, `strategicPosture.js:97`,
the closed-set pin `tests/domain/strategicPosture.test.js:137`) is TAKEN under the grant as a DECLARED cross-family change: car 0 lands with
the amendment named in its body, the ODQ row is written at the landing, and the owner's veto is the code revert of car 0. Lane 55 boards in
its order (after lanes 1, 2, 7, 8), so the window between this addendum and car 0 is the veto window.

**R5 — PACKET_STANDARD.** Where a LIT car counts more than 12 handwritten files, the 7a/7b split IS the plan (7a the mint + lighting, 7b
the census bills and literals), never a contingency. Lanes 2 and 8 adopt it in the correction.

## 3. THE LIGHTING DOOR TRAIN — D0 (two cars; the dock `lane-932-door` cut at `a5876c0ea`; lands FIRST at §932)

**Car A — the virtuality law re-cut and the empty cohort.** Files: `tests/lint/tradeConvergenceContract.walker.test.js` (the `:367` arm
re-cut to R1(a)–(c); its message cites L2-as-amended); `src/domain/worldPulse/simulationRules.js` (a frozen `SIM_LIT` cohort, EMPTY at this car,
spread after `...ONE_REGEN` in exactly the four lit presets and nowhere else — read `:644-654` WAVES, whose nine keys are PINNED and not
touched); any walker that pins the preset key set or the preset object shape (read `tests/lint/engineGatedRuleKeys.walker.test.js`,
`tests/lint/presetLightingWitness*.test.js`, `tests/domain/subsystemRowsVirtual.test.js` — extend an arm only where the empty spread
changes a measured shape; a byte in `simulationRules.js` STALES the two edge bundles + metas — rebuild by `node scripts/build-edge-shared.mjs`
with the immer/seedrandom clone-then-relink ritual, and commit the bundles in the same car). Pins with negative controls: (1) a TRADE key
declared `true` directly in a preset object (not via `SIM_LIT`) reds the re-cut arm; (2) a key placed in `SIM_LIT` without a register entry
reds arm (c); (3) the empty cohort changes no preset's resolved rules (deep-equal every preset's resolved rules base-vs-tip — the arm that
proves this car moves nothing). Byte rule: `simulationRules.js` sits in the eager first-paint closure — quote the first-paint table and
the engine-chunk line from a real build. Gate: the template's whole families + build + verify:dist. Exit: the walker green with the new
arms, every preset byte-identical in resolution, the bundles fresh.

**Car B — `commodityFlowEnabled` lit in `dramatic_campaign` and `living_realm` (a DECLARED SHIFT).** This is not an FP virtual key; it is a
preset key already `true` at `:769` and `:938`. Set it `true` in the two remaining lit presets. THEN the settling experiment BEFORE landing
(ARCH-PROTOCOLS §2): run the base-vs-tip classified diff on those two presets and NAME THE MOVERS — the M6a goods physics (caravans, finite
origin stocks, exact-integer conservation, entrepôts/tolls, M6c dispatch, M7 contraband) now runs on those presets' first tick; re-record
by their own rituals every golden that moves (the preset lighting witness by the `measureWitness()` one-liner; any dormancy fence over
M6a/M6b/M6c/M7 that a lit preset now reaches; the prose-manifest cells if a cell moves); the generator golden master is UNTOUCHED (this is
pulse-side). Pins: (1) `evaluateTradeFlagLighting` reports no `foreign_precondition_dark` for `commodityFlowEnabled` in any lit preset;
(2) the conservation walker (`commodityFlow.js:260 assertGoodsConservation`) green under both newly lit presets over a 200-tick soak of the
fixture realm; (3) a negative control that unsets the key in one preset reddens pin 1. Bills: the lighting census refreeze on a clean tree
as its own commit; the shift-ledger entry (`GOLDEN_SHIFT_LEDGER.md` shape, drafted under docs/implementation/ in the dock for the chair to
land on the ledger). Exit: both presets lit, the movers named, the goldens re-recorded with the cause stated, zero UNDECLARED lines.

**Seat/Lane:** `Seat: Opus 5 — Fable-unvalidated` · `Lane: D0`. The chair verifies, seals `refs/preserve/lane-932-door-2026-09-15`, composes
D0 FIRST onto `laneCONSIST-932`, and re-stamps the registers before any LIT car of any train composes behind it.

## 4. WHAT THE CORRECTION STEP DOES WITH THIS

The architect's correction cites THIS ADDENDUM by path in every brief's OWNER-GATED/RISKS row instead of re-deriving the law eight times:
"the virtuality law is amended by ARCH-PROTOCOLS-ADDENDUM-1 R1; this lane's LIT car lands after door D0 and after <the keys R2 names>".
The YES briefs (7, 55, 56b) receive the same one-line citation at their LIT cars when their trains board (the train prompt points here).

**R6 — THE VOLUME IS WRITTEN BACK AT EVERY LANDING (the chair, 23:5x, on the owner's complaint that the August volumes were left to rot).** At every §93x landing the chair's ledger act ALSO appends, to each family volume whose waves landed or whose substrate another lane moved (`docs/DESIGN_FP_ARCH_<CODE>.md` on the ledger branch), a dated LANDING BLOCK in the TR-9c form (`DESIGN_FP_ARCH_TR.md:517-539`): the wave and cars by sha, what is now LANDED-LIT / LANDED-DARK / PART-BUILT, which substrate rows changed (a leaf built under another programme's name is written into the wave's row the day it lands, never left for a census), which premise the landing falsified (as W-COIN falsified 'no money' and nobody wrote it). The history folds (`recon-32-34/HISTORY-<CODE>-2026-09-15.md`) are folded into the volumes at the §932 landing as the first such blocks. A volume without its landing block is a defect of the landing, caught by `collect-932.sh` (it lists the families the landing's cars touch and refuses a landing whose volumes lack a block dated that landing). Nobody re-runs a history census for want of a paragraph again.

**R7 — THE GOLDEN FREEZE REGISTER IS FROZEN (the genesis act, 2026-09-16, `Owner-Signed: §901`, the owner's "sign the golden"); every golden re-record goes through the signed door.** ARCH-PROTOCOLS §1.4 row 11 and §2.4 ("the freeze register is UNFROZEN: no door yet, and no measured field may be filled") are STALE from this act. From here: (a) `tests/fixtures/.golden-freeze-register.json` carries frozenAt/frozenAtSha/genesis and a measured sha256/rows/ownerRow on every row; `tests/lint/goldenFreeze.walker.test.js` BINDS each row to its manifest's bytes — a fixture that moves without its register row reds the gate; (b) a golden, a dormancy fixture, the preset-lighting witness, or an in-file corpus constant (the espionage fences' `PRE_*` shas — the register pins the SUITE FILE's bytes for those, so the header ritual is itself a door act) moves ONLY through `tests/helpers/goldenRecordDoor.js` under `GOLDEN_SHIFT_SIGNED=docs/shift-records/<record>.json`: the CHAIR cuts the record (ownerWords = the owner's standing words for the regime, ownerDate, odqRow = the landing's §, ONE cause, the seat, the surfaces with action `re-record` and `predictedRows`), the LIT car's implementer runs the capture arm with the env set (the door writes fixture + register row and THROWS by design; the plain re-run is the receipt) and commits fixture + register + record together with an `Owner-Signed: §<row>` trailer; (c) a brief's LIT car therefore names the record path the chair will cut and the surfaces it moves; the compose protocol's register pass re-runs the walker at the consist tip; (d) the six fixtureless `*DormancyGolden` suites on the register's unresolved roster owe a ruling (a row with a proofForm, or a written exclusion) at the first landing that touches them — the family lane says which in its brief.
