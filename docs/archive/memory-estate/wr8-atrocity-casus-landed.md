---
name: wr8-atrocity-casus-landed
description: "WR-8's 16th casus atrocity_answer <-> atrocity_atoned landed @ a80dd74a; THE TAXONOMY REFUSES A REGISTRATION-ONLY MEMBER — the diversity walker demands a callable WITNESS clearing MIN_SCORE, so a new war reason needs a real scorer, not a name in a list"
metadata:
  node_type: memory
  type: project
  date: 2026-08-03
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
---

Landed 2026-08-03 @ `a80dd74a` on `claude/composite-r4` (committed, NOT pushed),
under chair ruling CR-WR8-C. `WAR_REASON_TYPES` / `PEACE_REASON_TYPES` are now
**16**, with `atrocity_answer` <-> `atrocity_atoned` in
`src/domain/worldPulse/warReasonTaxonomy.js`.

**THE LESSON, which cost this lane a re-plan.** The plan was to register the pair
and let R's razing writer feed it later, in the seam `treaty_default` and
`corruption_exposed` already document ("typed now, fed later"). NINE walkers red
instead. The decisive one is in
`tests/domain/warReasonsPredationFaith.test.js` — "THE DIVERSITY WALKER: every
reason CAN win, or this reds" — whose `WAR_WITNESSES` / `PEACE_WITNESSES` tables
must key-match the catalogs EXACTLY and whose each entry is a **callable** that
must return `>= REASON_TUNING.MIN_SCORE`. A name in a list cannot satisfy it.

**The full surface a new casus must feed (all totality-enforced):**
`WAR_REASON_TYPES`, `PEACE_REASON_TYPES`, `REASON_MIRRORS` (bijection + equal
lengths), `WAR_CAUSE_DISSOLUTION` + `DISSOLVED_CAUSE_PROSE` +
`TERMINATION_PEACE_PROSE` (now in `warTerminationCauseTables.js`, with three
module-load `throw`s), `WAR_WITNESSES`/`PEACE_WITNESSES`, and four hardcoded
count literals across `warReasons.test.js`, `warTermination.test.js`,
`peaceCausalVerbs.test.js`, `peaceReasons.test.js` plus
`tests/property/peaceCausalDormancyGolden.test.js`.

**What was authored:** `scoreAtrocityAnswer` (warReasons.js) mints on BELIEVED
razings only and decays on `REASON_TUNING.ATROCITY_DECAY_TICKS` = **260**;
`scoreAtrocityAtoned` (peaceReasons.js) switches on R2's two roads (`answered`,
`razerGone`). Pins in `tests/domain/atrocityCasusWr8.test.js` (12 tests).

**JUDGMENT CALL, VETOABLE:** `atrocity_answer` is NOT DM-declarable — decreeing
it would manufacture the razing and, through R2's licence machinery, a warrant to
burn a city. The derived-cause set went two -> three
(`NON_DECLARABLE_WAR_REASON_TYPES`). `DECLARABLE_WAR_REASON_TYPES` is
consequently the SAME thirteen in the SAME order as at fifteen, so
`realmManifest`'s enum dial and the generated compendium data did NOT move —
pinned as such.

**Why:** the taxonomy's totality machinery is stronger than the "registration
seam" comment in warReasons.js implies, and a lane that plans a name-only
registration will lose a cycle discovering that.

**How to apply:** budget a real scorer + witness for any new casus. Also budget
SIZE: `warTermination.js` was frozen at exactly 880/880 with zero headroom, so
the three cause tables had to be extracted to
`src/domain/worldPulse/warTerminationCauseTables.js` (with their assertions) and
the baseline ratcheted 880 -> 818. `warTermination.js` re-exports
`WAR_CAUSE_DISSOLUTION` so no consumer import path moved.

Related: [[wr8-razing-tier-demotion-fork]], [[sizebaseline-exact-ceiling-hazard]],
[[authored-nul-byte-in-agent-edits]].
