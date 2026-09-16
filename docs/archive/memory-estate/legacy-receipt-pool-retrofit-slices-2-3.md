---
name: legacy-receipt-pool-retrofit-slices-2-3
description: "RECEIPT_POOLS_LEGACY.md retrofit slices 2+3 (war/events + economy/trade) landed @ minifold 6d33aa8d and 9dc12049 — 57 of §3's 63 kinds wired, the desk-roster architecture, the normalized envelope band, and the six kinds left for the faith/divination desk"
metadata: 
  node_type: memory
  type: project
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-03T13:38:01.660Z
---

2026-08-03. Continues [[legacy-receipt-pool-retrofit-slice-1]] — that file holds the
architecture (canonical PREPENDED not copied, `WHAT_PHRASES` must keep its string shape,
the corpus in its own data leaf, seedless = dark path). This file holds what slices 2+3
added and what a successor needs to wire the LAST desk.

**WHAT LANDED (minifold `claude/composite-r4`, dark, NOT pushed).**
- **6d33aa8d** — slice 2: §3a the war desk (12 kinds) + §3d the events desk (28), plus the
  anchor housekeeping below.
- **9dc12049** — slice 3: the rest of §3c, the economy/trade desk (13 kinds). §3c CLOSED.
- Retrofit now covers **57 of §3's 63 kinds**. ⭐ WHAT REMAINS: the **faith desk (§3b, 5
  kinds)** and the **divination desk (§3e, `conflict_pressure`)** — authored in the annex,
  deliberately unwired, recorded as J-LEG-WIRE-11. Wiring them completes §3; §4's 107
  fallback pools are a DIFFERENT architecture (no `WHAT_PHRASES` row exists to prepend).

**THE THREE THINGS SLICE 2 CHANGED IN THE PIN SET — copy these, not slice 1's:**
1. **DESK ROSTERS, plural.** `POPULATION_/WAR_/EVENTS_/TRADE_DESK_KINDS` + the union
   `WIRED_DESK_KINDS`, all AUTHORED (never `Object.keys`) so the census keeps an
   independent denominator. §3c is deliberately SPLIT across two rosters (J-LEG-WIRE-10):
   the rosters are the ledger of what shipped when, and each slice carries its own golden
   plan. Do not "tidy" them into one.
2. **⚠️ THE ENVELOPE BAND MUST BE NORMALIZED TO 1/poolLength.** Slice 1's fixed
   `max < 0.25` is ARITHMETICALLY IMPOSSIBLE for a floor-4 pool (uniform on four members
   IS 0.25), and §3a/§3d introduce three of them (conquest, occupation_vassalized,
   commons_riot). The band is now `max < 2×` uniform, `min > 0.4×`. Measured over all 57
   wired kinds at 400 draws: worst max 1.52×, worst min 0.66×, zero unreachable members
   under both the real and the parity-degenerate seed family.
3. **The unwired negative control moved** `conquest` → **`pantheon_ascendancy`** (slice 2
   wires conquest). It must move again when the faith desk lands. There is also now an
   EXHAUSTIVE control: every registered kind not on a roster is driven with a seed and
   proven to return its exact `WHAT_PHRASES` row.
   Also added: the doc's `CADENCE: … → floor N` line is PARSED and joined, so a pool wired
   short of the floor SP-6 prices reds (J-LEG-WIRE-6); and cross-kind variant uniqueness
   (J-LEG-WIRE-9), exempting variant 1 because shared live rows are the inherited defect.

**HOW TO WIRE A DESK MECHANICALLY (this is how slices 2+3 were built, ~15 min each).**
Generate the JS pool literal FROM the doc with a script rather than transcribing — byte
equality is then true by construction and the corpus-join pin re-verifies it independently.
Parse `### <kind> — R1 subject phrase — significance: … — desk: …` headings, strip the
trailing `` `[live, verbatim]` `` mark from numbered rows, emit variants 2..N. Before
wiring, run three STOP gates: variant 1 byte-equals `WHAT_PHRASES[kind]` for every kind
(57/57 clean so far, the gate has never fired); the R1 register law over every variant;
and no intra/cross-pool duplicate and no member that is a substring of a sibling (the last
one matters because the live-path pin attributes a headline by substring).

**GOLDEN PLAN — the cheap decisive measurement.** Byte-scan all 56 artifacts under
`tests/fixtures` for each kind's live phrase: ZERO hits for all 57 kinds, so no persisted
golden carries this prose at all. Then run the 21-file rumor cohort AND the whole
`tests/property` tree before and after. Re-run rather than assume.

**⚠️ PRE-EXISTING REDS ON THIS TREE (2026-08-03, none of them this lane's):**
`npm run build` fails at HEAD — "targetCommissionedPlant is not exported by
brokerageServicesPlant.js" (envoy lane e51ec17e), so **verify:dist CANNOT RUN** and the
leaf's chunk placement is UNVERIFIED. `tests/property` reds 3 (dispositionChannels
DormancyGolden, mechanismLitCoverage, peaceCausalDormancyGolden). `tests/copy`
voiceMechanics reds on customContent/magicAssertionText/magicProfile + 7 JSX.
`tests/docs` reds on ARCHITECTURE.md / DEPLOY.md migration counts.

**THE ANCHOR-WALKER LESSON (cycle-4 verifier's undisclosed finding, cured in 6d33aa8d).**
`tests/lint/negativeAssertionAnchor.walker.test.js` holds a frozen roster that MAY NOT
GROW — a new test file with a bare `not.toContain/toMatch/toHaveProperty` reds it and
cannot be banked. Slice 1's file had 5 such sites. Cured at the source: the five R1 shape
laws became one `R1_FORBIDDEN` table, collapsing 5 assertion sites into 1, and that one
carries an `// anchored: <reason>` line. ⚠️ **The annotation must be the LAST comment line
immediately above the assertion** — the walker tests `lines[i-1]` only, so a multi-line
explanation whose `anchored:` prefix sits three lines up does NOT count. The walker is
still red estate-wide on 37 other files from concurrent lanes.
