---
name: ""
metadata:
  node_type: memory
  title: "ENFORCER E-G shipped — the narrative-parity walker: one story across every surface (bar 20 capstone)"
  date: 2026-07-21
  tags:
    - tranche-2-enforcer
    - E-G
    - narrative-parity
    - the-story
    - aplus
    - bar-20
    - bar-2
    - not-folded
  branch: claude/e-narrative
  tip: 2d892d0f
  base: b339e178
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-21T07:11:09.033Z
---

# Enforcer E-G shipped — the narrative-parity walker

⭐ TRANCHE-2 ENFORCER E-G (the STORY capstone) @ claude/e-narrative tip **2d892d0f**
(base b339e178, composite-r4; NOT folded/pushed). Spec: docs/THE_APLUS_EXECUTION_ARCHITECTURE.md
§E-G (advances bar 20 THE STORY + bar 2 COHESION). ONE commit, tests only, eager Δ 0.
Complements C5's story census (same seed → same story across RUNS) with the cross-SURFACE axis.

## What the enforcer is
**tests/simulation/narrativeParity.test.js** — one everything-on seeded decade (arc-soak
fixture + provenanceLedgerEnabled lit test-locally, 10y × 120 one_month ticks × 8, seed
'narrative-parity-seed') composed through all four reader surfaces — chronicler's letter,
chronicle read-model, world-book collector (dm face), cause-walk (all 2,150 recorded roots)
— asserting (a) BEAT-SET PARITY (letter↔book exact multiset; 0 digest orphans vs an
everSeen minted ledger; feed→digest window coverage ≥0.45, measured 69.6%), (b)
CLAIMS-PARITY on narrative (0 embellishments — every line/row/event/hop traces
byte-for-byte to a recorded event or an exported honest-fallback constant), (c) DIRECTION
AGREEMENT (0 contradictions on 167 digest∩feed + 93 letter∩digest shared ids + every
hop↔chronicle pair). Determinism: second drive → identical hashed projection.
**REAL CONTRADICTIONS SURFACED: none** — the surfaces genuinely project one substrate.

## Durable substrate facts (verified in code, load-bearing for the walker)
- **pulseHistory[].impactDigest = compactImpactDigest(applied.newsEntries)**
  (pulseKernel.js:1615) — digest beats ARE feed-minted beats, same ids, verbatim
  headline/summary (top-18-by-score cap). But POST-RECORD kernels (realm arcs, infowar,
  army transit, naval, pestilence, calamity, generosity, tempo…) append feed entries AFTER
  the record is cut (pulseKernel.js:1763+) ⇒ feed→digest containment is a FLOOR, never
  equality.
- **capEntries (wizardNews.js) evicts by recency + major-arc RESCUE** (orphan arc heads
  displace the oldest recency entries, ≤ max/2) ⇒ the surviving feed window is NOT
  tick-contiguous. Cure in the walker: a per-tick everSeen minted ledger (id → versions)
  captured during the drive; containment asserted against THAT, exactly.
- ⚠ **worldState.canonizedAt is ENGINE-NEUTRAL** (spatial gating deliberately keys on
  spatialCanonVersion — worldState.js:381) but it GATES collectRealmSummary/the book's
  State-of-the-Realm chapter. Verified empirically: lighting it changed realmMajors 0→10
  and NO other count. A fixture wanting the realm chapter must set it.
- Measured 0 multi-version feed ids over the decade (arc re-emission mints new ids on this
  fixture), but appendWizardNewsEntries MERGES BY ID, so the walker keeps a per-version
  allowance (E-6) rather than assuming immutable prose.
- Unexported honest-fallback literals pinned in the walker (drift REDS deliberately):
  'an earlier cause' (causeWalk resolveReceipt), 'World pulse outcome'/'World pulse impact'
  (nodesFromRecord), 'A ruling in your absence' (deputysDiary), 'A quiet thread'
  (buildThread). QUIET_FALLBACK/REDACTED_HOP/NO_DEEPER_MEMORY/LEDGER_DARK_LINE are exported.

## How to apply / gotchas
- Gate that passed (verbatim reproducible): `node scripts/check-domain-strict.mjs` bare = 0
  → tsc --noEmit -p tsconfig.full.json = 0 → eslint on the file = 0 → walker 9/9 (~27s,
  cheap — two full drives) → python NUL scan 0 → eager Δ 0 (tests-only).
- ⚠ vitest 4 HIDES test console.log in run mode — diagnostics need
  `--disableConsoleIntercept` (the arc-soak's printed band has the same trap).
- Cause-walk parity NEEDS provenanceLedgerEnabled lit test-locally (the
  provenanceDormancyGolden idiom); without it every walk is ledgerDark ⇒ vacuous.
- The secrets/redaction contract is pinned on a SYNTHETIC covert fixture inside the test
  (the decade produced no covert receipt to walk) — never invent covert beats into the
  seeded drive.
- NOT folded/pushed (owner-gated). Sits parallel to the other E-lanes on b339e178.
