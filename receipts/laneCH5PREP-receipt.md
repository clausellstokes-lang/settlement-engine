# lane TE-CH-5-PREP — receipt

STARTED 2026-08-24 — read-only analysis lane. Slot 79b78881c. No worktree, no gate, no sub-agents.
Deliverable: scratchpad/CH5-RULING-BRIEF.md — ruling on separating magic-dependence from ARCANE_INST_TAGS.

## RESUME POINT
- DONE: lane law read; slot confirmed (79b78881ca86612ec312602c2e3dc6d06aa34df8).
- NEXT: locate ARCANE_INST_TAGS at slot, enumerate members + readers.

## CHECKPOINT 1 — ground truth measured (read-only, plain node over a `git archive` snapshot of the slot's src/)
Snapshot: scratchpad/ch5-slotsrc (git archive 79b78881c -- src; node_modules symlinked; NO worktree created).
- ARCANE_INST_TAGS = ['arcane','planar','alchemy','enchanting'] @ src/domain/arcaneInstitutionVocabulary.js:38 (4 members).
- Catalog: 311 (tier,cat,name) triples / 276 distinct normalised names.
- Tag carriage (distinct names/triples): arcane 20/22 · planar 2/2 · alchemy 2/2 · enchanting 1/1. ANY member: 21/23.
- magicLicense declared: 25 distinct names / 28 triples. none 6 · low 5 · medium 3 · high 11.
- LICENCE-vs-TAG conflicts = 4 distinct names (NOT 3): Alchemist shop, Alchemist quarter, Warden's Lodge
  (tag arcane / lic none) + Healer (divine, 1st level) (tag mundane / lic low). The "3" is the count WITHIN
  the none-licensed subset only.
- Deleting the `arcane` tag leaves 5 names still tag-arcane (NOT 2): Alchemist shop, Alchemist quarter (alchemy),
  Enchanter's shop (enchanting), Planar traders, Planar embassy (planar).
- magicForms ARCANE GATE reads TAG.ARCANE (the single 'arcane' string) via institutionHasTag — NOT ARCANE_INST_TAGS.
  20 catalog names pass it, all by DECLARED tag, 0 by keyword backfill.

## RESUME POINT
- DONE: readers mapped, catalog census, per-shape verdict deltas (probe6), magicForms form delta (probe7).
- NEXT: corpus blast radius via generateSettlementPipeline in plain node; then write CH5-RULING-BRIEF.md.

## CHECKPOINT 2 — blast radii measured
TOTALITY CONTROL: the plain-node harness reproduces ALL 525 committed golden hashes at the slot
(`tests/fixtures/generator-golden-master.json`, 0 mismatches). Every figure below is licensed by that.
- Shape F-i (ARCANE_INST_TAGS loses `alchemy`): 0 hashes / 0 rosters of 525 golden AND 0/0 of 2,555
  (511-row grid x 5 magic cases). PROVABLY FREE.
- Shape F (F-i + the three `none`-licensed rows drop their `arcane` tag): 187 of 525 golden hashes;
  409 of 2,555 sweep hashes, ALL in priorityMagic 50/80, ZERO in magicExists:false / pm0 / pm20;
  0 rosters anywhere. Path-template census at pm80: 7 templates, all tags-array removals except a
  documented light-heuristic TRACE row (`simulationTrace[*].downstreamEffects` magicCapacity).
- Shape A (magicForms gate -> licence): 0 shipped bytes. magicForms.js has NO src importer
  (closure: magicForms <- {magicFormsPractitioner, magicRegimeLifecycle} <- {}). 118 of 525 settlements
  would present a different form set to that UNWIRED ladder.

## DONE — 2026-08-24
Deliverable written: scratchpad/CH5-RULING-BRIEF.md.
RECOMMENDATION: Shape F — `alchemy` (and only `alchemy`) leaves ARCANE_INST_TAGS into a sibling
TRADE_INST_TAGS; the three `none`-licensed rows drop their now-redundant `arcane` tag.
VERDICT: REPAIR, chair-ruled. One declared golden shift (187/525, 0 rosters).
Repo untouched: no commit, no pin, no push, no packet, no worktree, no test run.
