---
name: fp-sp-a-band-families-landed
description: "⭐⭐ FP wave SP-A LANDED @ 59df13a9 — bandedStock.js + bandFamilies.js minted dark; ⚠️⚠️ TWO census premises REFUTED: `routine` IS live in the tree (four kind registries + four news composers), and the INTENSITY ladder {quiet,present,pressing,decisive} is declared NINE times under EIGHT names"
metadata: 
  node_type: memory
  type: project
  originSessionId: c44e5d99-2ba5-49d5-a554-40b68534c8eb
  modified: 2026-08-06T10:27:16.395Z
---

**WHAT LANDED (2026-08-04, `claude/composite-r4`, worktree minifold, NOTHING
PUSHED).** FP wave #1 SP-A — the pure foundations. Commit `59df13a9`, ten files,
+1689, ZERO existing-src edits, no flag, dark by construction.

- `src/domain/worldPulse/bandedStock.js` (100 effective) — the SP-5b family.
- `src/domain/worldPulse/bandFamilies.js` (41 effective) — SP-6a + SP-6b.
- `tests/lint/{spBandFamilies,spTermLiteral,pressureLadderMints}.walker.test.js`
- `tests/domain/{bandedStock,bandFamilies}.test.js`
- Ledger row: `docs/DESIGN_FP_SPINE.md` §6, "WAVE SP-A".

## ⚠️⚠️ REFUTATION 1 — `routine` IS LIVE. The family is a BORROW, not a mint.

`DESIGN_FP_ARCHITECTURE.md` §2a class 4 and `DESIGN_FP_ARCH_CW.md` S15 both say
the ruled significance vocabulary is TWO-valued (`major|notable`) and that
`routine` "does not exist in the tree today". **It does.** Measured:

- AUTHORED on live kind rows in `src/domain/worldPulse/eventProse.js` —
  `DispositionReceiptSignificance` is literally `'notable'|'routine'`;
  `war_culture_suppressed`, `lineage_claim_suppressed`, `trajectory_misread`,
  `envoy_on_the_road` all carry `'routine'`; the lineage/warCost/envoy typedefs
  spell the full three.
- READ at `dispositionNews.js:199-200`, `envoyNews.js:182`,
  `warCostsNews.js:155`, `lineageNews.js:80-81`.

So `SIGNIFICANCE_CLASSES` adopts the three words the estate already speaks and
mints only the frozen ORDER, the rank, and the two shapes (`sectionCapShape`
totality-checked, `admitsSignificance`). **CW-1 is NOT blocked on the word's
existence** — its damping target exists and always did. The real debt the census
meant to name is different and still open: the words are spelled inline
everywhere and compared ad hoc (`heraldFeed.js:95` mixes a banded
`significance === 'major'` with a raw `severity >= 0.72` float). That migration
is SP-E's census plus one small wave per surface.

## ⚠️⚠️ REFUTATION 2 — there are TWO pressure ladders, and the second has NINE copies

§2b item 4 calls `OVERFLOW_BANDS` "THE ONE pressure ladder". True of CAPACITY
pressure (`{easy, filling, pressed, overflowing}`, one authority in
`demographicsResponses.js`; `demographicsPlans.js` re-exports the binding as
`PLAN_OVERFLOW_BANDS` — an alias). **Not true of the tree.** The INTENSITY
ladder `{quiet, present, pressing, decisive}` (± an `unknown` head) is declared
NINE times under EIGHT names, all `src/domain/worldPulse/`:

`negotiationPictures.js` PRESSURE_BANDS(5) · `conquestFeasibility.js`
CONQUEST_PRESSURE_BANDS(5) · `conquestIntent.js` CONQUEST_MARTIAL_BANDS(5) ·
`envoyNegotiationPictureBuilder.js` PRESSURE_BANDS(4) ·
`conquestDoctrineStage.js` PRESSURE_WORDS(4) · `compromiseRound.js`
COMPROMISE_DRAIN_BANDS(4) · `envoyErrandVocabulary.js`
ENVOY_MORALE_EXHAUSTION_BANDS(4) · `warCosts.js` WAR_HOME_FRONT_BANDS(4) ·
`warTermination.js` WAR_TERMINATION_BANDS(4)

Reusing one intensity vocabulary across nine subjects is fine design; declaring
it nine times is the per-volume-minting problem. SP-A did NOT consolidate (all
nine are war-lane files, several at/near the size ceiling, and the charter is
zero existing-src edits). `tests/lint/pressureLadderMints.walker.test.js` freezes
the nine SHRINK-ONLY, freezes the eight NAMES, and pins all nine to spell the
SAME rungs — **the first copy to drift reds and names itself.** ⚠️ `pressed`
(capacity) and `pressing` (intensity) differ by one letter across two ladders;
the two vocabularies are pinned disjoint from live imports.

## HOW TO APPLY

- **Never author a decay law.** `decayTowardNeutral(value, neutral, ageWeeks,
  band)` with a band from `HALF_LIFE_BANDS` = `a_season`/`a_year`/`a_few_years`/
  `a_decade`/`a_generation` (13/52/156/520/1040 weeks, DERIVED from
  `INTERVAL_WEEKS`). Fifteen call sites still hand-roll `Math.pow(0.5, …)`;
  a new one is a fork.
- **Never author a significance or severity scale.** Import from
  `bandFamilies.js`. SP-6b severity is `glancing/telling/grave/ruinous` — four
  words measured to appear as quoted literals ZERO times under `src/` before
  the mint, so reading the wrong ladder is impossible by SPELLING. The walker
  keeps it so; a module that re-types a rung reds.
- **Band-crossing receipts have ONE grammar.** `bandCrossingReceipt({stockKind,
  ladder, from, to, cause, tick})` — frozen, and it THROWS on any non-integer
  number, so L5 is structural. `cause` is the instance's own closed vocabulary.
- **Every later SP wave must author its `**Bands:**` line** in its
  `docs/DESIGN_FP_ARCH_SP.md` §5 block, EQUAL verbatim to its §7 rows, and
  remove its id from `SP_WAVES_OWING_A_BANDS_LINE` in
  `tests/lint/spBandFamilies.walker.test.js`. The backlog is shrink-only.
- **Every later SP wave adds its leaves to `SP_MODULES`** in
  `tests/lint/spTermLiteral.walker.test.js` or the no-term-literal scan is blind
  to them.

## GATE STATE AT LANDING (attribution, executed)

`tests/lint` run live AND against a `git archive` of start HEAD `99d63d92` with
`node_modules` symlinked: **identical 10-file failing set**; the single extra
failing ROW (`does not attribute a future array push…`, proseNumerics) traces to
the concurrent CW-0w lane's then-uncommitted `tests/helpers/proseNumericsWalk.js`.
Full `tsc` 352 errors live and at base, identical file set. `eslint` 30 problems
/ 3 errors both sides. Domain strict green at 1313/1313, both leaves
strict-clean. Zero rows attributable to SP-A.

## Migrated from the memory index (2026-08-06)

- **THE NINE-COPY CONSOLIDATION IS A CHAIR DECISION OWED.** SP-A froze the nine
  declarations / eight names SHRINK-ONLY and did not consolidate (reasons above);
  the consolidation itself is an OPEN CHAIR DECISION, recorded at cycle-1 close as
  "the nine-copy intensity-ladder consolidation (CHAIR DECISION OWED, frozen
  shrink-only meanwhile)" — [[fp-cycle1-serialized-landing-and-cq5-row-guard]].
  Frozen is the interim state, not the answer.
- Naming, for the one-line form of REFUTATION 1: the BORROWED significance family
  (`major`/`notable`/`routine`) is **SP-6a**; the MINTED severity ladder
  (`glancing`/`telling`/`grave`/`ruinous`) is **SP-6b**. Both live in
  `bandFamilies.js` (41 effective). "SP-6a is a BORROW, not a mint" is the index's
  compression of REFUTATION 1.
