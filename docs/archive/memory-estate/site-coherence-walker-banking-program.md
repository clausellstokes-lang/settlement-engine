---
name: site-coherence-walker-banking-program
description: "Program opened 2e6d872f (docs/SITE_COHERENCE_PLAN.md + _AUDIT.md) — 22 findings, 9 waves, NOTHING started; the realm-coherence law was already written and the code only ever implemented its licence, never its constraint"
metadata: 
  node_type: memory
  type: project
  originSessionId: a4664738-3944-484e-ac39-e1b215fcb7a9
  modified: 2026-08-07T21:22:40.856Z
---

Opened **2e6d872f** on `claude/composite-r4`, 2026-08-07, triggered by [[tcd4-townmap-exports-landed]].
Artifacts: `docs/SITE_COHERENCE_PLAN.md` (9 waves) + `docs/SITE_COHERENCE_AUDIT.md`
(22 findings: 1 C, 4 H, 17 M, across 5 adversarially-refuted lenses). **Zero waves have
started.** The plan's Progress blockquote is the state — read it, not this file, for
what has landed.

**⭐⭐ THE LAW WAS ALREADY WRITTEN — the code implemented half of it.**
`docs/DESIGN_SETTLEMENT_MAP.md:356-361`: *"REALM-COHERENCE LAW: the town site is a
zoom-in of its realm position, never a contradiction of it"*, while explicitly licensing
`mines⇒slopes, fisheries⇒water, peat⇒marsh, salt⇒flats`. So an export IMPLYING a
landform is the DESIGN (do not "fix" it); an export CONTRADICTING the terrain is a law
violation. `siteGenesis.generateSite` implements the licence and never implemented the
constraint — `DRY_BIOME_RE` guards only the WATER arm; the mountain-flank and dunes arms
have **no biome check at all**. Repo-wide grep for `realm-coherence` returns 7 hits in 3
files — that is the entire declared law surface.

**Measured baseline (fixed 462-settlement corpus, 0 gen errors — every wave is graded
against these):** 103/462 (22.3%) carry a contradicting site · 80 water-on-dry (33 of them
marsh-on-dry) · 23 mountain-flank-on-flat · **47 PURELY false-positive** · 122/462 (26.4%)
had siteKind changed by TCD-4 at all. Distinct export vocabulary = 158 strings.

**The collisions are unanchored substring alternatives**: `/mill/`↔"Milled flour",
`/preserved/`↔"Preserved foods", `/coal/`↔"Charcoal", `/fur/`↔"Sulfur", and worst
`/tin/`↔"casTINg / hunTINg / enchanTINg / minTINg" — which ships nonsense provenance in
**347/1008** settlements and SUPPRESSES a real ore site in 27, because `EXPORT_RULES` is a
first-match chain and the mine rule sits at index 2.

**⚠⚠ WAVE 3 MUST PRECEDE WAVE 4 — measured, counter-intuitive.** The site arms and
`EXPORT_RULES` are first-match chains, so narrowing the water predicate ALONE made
flank-on-flat **worse (15 → 19)**: suppressing an earlier arm makes a later incoherent arm
reachable. Land the biome guard first so redistribution has nowhere bad to go.

**⚠ CORRECTION to an earlier session claim (audit finding M12):** it is NOT true that the
walker ceilings were unbanked after TCD-1..TCD-4. TCD-1/2/3 were already banked by the
`ec525a59` re-freeze; **only TCD-4's row is stale.** Measured: a materialized HEAD scan
reports `violations 0 stale 0 bankable 1`. Wave 1 is a three-value JSON edit
(delete the row, `total` 3261→3259, `identities` 2168→2167). **⛔ Never run `--write`** —
it is a whole-tree AMNESTY that would bank other lanes' work and, without `OSR_FREEZE_SHA`,
writes `frozenAtSha: null` and reds the walker.

**Why the row sat unbanked at all:** `bankable` is a REPORT-ONLY channel —
`check-observed-shape-readers.mjs:275` prints "1 row(s) bankable" and returns **0**. Making
it fail the gate is owner-queue #4 (recommended SIGN).

**Two live problems the audit surfaced that predate the program:**
- **H4 — already live from `2c1ec70f`:** the PERSISTED spatial substrate
  (`spatialSubstrateDerive.js:60/:84`) is the one save-resident town-map projection, and its
  reuse gate cannot see a site change, so canonized campaigns reuse a stale substrate. Wave 6.
- **C1:** `scripts/hazard-registry.json`'s `HZ-READERNOWRITER` is STALE — still says
  `"instances": 3` (TCD-4 makes 4) and its note still calls the ratchet "COUNT-based" though
  the baseline is now `"schema": 2`. Wave 0.

**TWO owner sign-offs, both 2026-08-07 — ALL NINE WAVES ARE NOW AUTHORIZED.**
#1 covers substring false positives + the missing biome guard (Waves 3-5). #2 signs
**Wave 9** (terrain-gating `marshlands`/`coal_deposits` upstream — the only fix that makes
the DOSSIER coherent, not just the map), recorded at **1bf3b3da**; it was put as the single
open call and answered *"I permit it"*. ⚠ The grant is **Wave 9 only** — Option D (queue #2,
bounded local features: millpond/wadi/quarry-scar) stays DEFER-to-after-the-tail and the
`coast` arm (queue #3) stays ACCEPT-as-is; queue #4 proceeds as a VETOABLE judgment call
because it reverts cleanly. ⚠ **Signed ≠ unblocked**, and Wave 9's headline 47→13 is the
COMBINED Wave 4+9 figure — Wave 9 alone is 47→30. THE PROMISE is not waived: already-generated
worlds keep their economies; Wave 9 changes only seeds rolled after it lands.

**Gate state at last check (2026-08-07):** ✅ **B1 CLEARED** — the walker lane landed at
`1f4d2f37` ("Determinism: the observedShapeReaders MUTANTS ran five full-tree scans on the
20s default"), so Wave 1 is executable by its own ledger condition. Four files across the
remaining lanes are still dirty (`commercialReasons.js`, `pactProposals.js`,
`spatialUsage.js`, `spatialUsage.test.js`), so B2's live-tree receipt is still unavailable —
use a materialized-tree scan. B3 (single vitest slot) always applies.

**How to apply:** everything is blocked on the shared worktree clearing — the plan's
Blocked-on ledger names the exact command per gate. `tests/docs/` carries **6 pre-existing
reds** at HEAD (proven by identical FAIL identities on a materialized base run); do not
inherit them as yours. Both this program's commits were built by PLUMBING per
[[two-lane-commit-shared-index-race]], and the stale-index reversal fired BOTH times —
for new files it stages a **deletion** — cured by `git reset -q HEAD -- <paths>`.
