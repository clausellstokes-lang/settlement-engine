# R5R hand-back: R5-RECENT's red-first instruments (VEIL-33's V33-R5R, 2026-11-22)

Branch `v33-r5recent`, cut at abd68e653. Commits: 190c10cd5 (walker), a1f07a235 (pglite test), b36bfc1d1 (manifest rows), and
this file. Nothing pushed, no pull request. Nothing in `supabase/`, the twin or the registry changed.

## STOPS
**None.** Every tooth is green.

There are three notes for the seat. None is a STOP:
1. **The record has an error.** a1f07a235's message says plant (b) served "the name on the gallery's shown setting". That is
   wrong. Every fault of plant (b) is the mask's form. The note keeps the first 40 of its 60 faults, and all 40 are the mask's
   form, "an unseen interest overthrew the council's old guard ...". The other 20 come from the same reads in the master shape,
   so they are PLAUSIBLY the same. The commit stands as made, and this file corrects it.
2. **Measured (CONFIRMED in both engines): on Reveal DM an owner-hidden power's row IS SERVED.** The row carries
   `hidden: true`, and `recentConflict` names the power unmasked. The read does not withhold that power, so the instrument does
   not judge it. My first run judged it, by the `hidden` flag alone. I narrowed that after run 1: an owner-hidden power counts as
   withheld only where the read does not serve its row. That is the player view, and the map's member whatever the share says.
   Whether Reveal DM should serve an owner-hidden power at all is not this unit's question. It is the chair's.
3. **Branch name.** The work is on `v33-r5recent`, the branch the seat's prompt named. The brief names
   `lane/veil-33-2026-11-22-r5recent-wip`.

## 1. `tests/security/galleryVeilRecent.pglite.test.js`: RED at the tip by design
- **Run 3** (the gate mutex, `--maxWorkers=1`) exited 1: Tests 6 failed | 3 passed (9). Logs: `plant-run3.log`,
  `plant-run3.full.log`, `plant-run3.measures.txt`.
- **Harness:** each town is read in both stored shapes, at 11 settings, Reveal DM off and on. That is 54 reads, judged in two
  engines each.
- **Preconditions:** every plant held its preconditions before its fault list was judged. On the own setting the target is
  withheld on 28 engine-reads for (a) and (c), and on 20 for the owner plants (the player view). On each of those reads the
  stored sentence names the target. Every red is the fault list's own assertion.

RED titles, with their counts:

| Plant | Seed | What it plants | Faults | Fault class |
|---|---|---|---|---|
| (a) | r5-taker | a hidden criminal house's criminal power took the seat, named as itself | 100 of 100 gated engine-reads | names the withheld power |
| (b) | r5-owner | a power the OWNER hid (`hidden: true`), named as itself | 60 of 60 | the mask's form |
| (c) | r5-bare | the withheld power's BARE form, without its qualifier | 100 of 100 | names it |
| (c) | r5-possessive | a POSSESSIVE of the withheld power | 100 of 100 | names it |
| (c) | r5-lower | the withheld power in LOWER CASE | 100 of 100 | names it |
| (c) | r5-owner-lower | the owner-hidden power in LOWER CASE | 60 of 60 | names it, past the mask |

Every title continues: "on every read that withholds the power, recentConflict is withheld ... server = twin".

**server = twin:** 0 parity faults on every read of every town. The twin and 212 serve the same bytes at the key.

**Plant red: 6 of 6.**

## TEETH: GREEN (run 3)
- **TOOTH r5-served** (a sentence naming only served powers, beside a withheld criminal power): 108 engine-reads, 100 of them
  beside the withheld power, 0 faults.
- **TOOTH r5-owner-served** (the same beside an owner-hidden power): 108 engine-reads, 60 beside it, 0 faults.
- **TOOTH hides-nothing:** the open town gives 108 engine-reads, every one served as stored. Other towns give 52 more reads
  that hide nothing, served as stored. 0 faults.

## 2. `tests/lint/rosterChoiceComposedHosts.walker.test.js`: RED at the tip by design
- **Result:** exit 1, Tests 27 failed | 6 passed (33). Logs: `walker-run1.log`, `walker-run1.full.log`.
- **Green:** the 4 synthetic controls; `history.founding.overcoming` (host `get_gallery_dossier`, which exists);
  `prose.incomeWeight` (host `_gallery_veil_apply`, which exists).
- **RED, 27 rows**, every one on R5's planned host (`_gallery_veil_composed` / `withholdComposed`), in walk order:
  - power.recentConflict, power.desc, power.label, power.relation.dmNote
  - prose.posture.posture, prose.posture.prize, prose.posture.terrain
  - prose.state.firstSurvey, prose.state.publicOrder.field, prose.state.publicOrder.beside,
    prose.state.publicOrder.rung.sentence, prose.state.publicOrder.rung.glance
  - prose.threat.economic, prose.wall.rationale, prose.shadowEconomy, prose.incomeMix, prose.prosperityHeader.detail,
    prose.prosperity.sentence, prose.legacyLines.a, prose.legacyLines.b, prose.legitimacyBanner, prose.legitimacyLens,
    prose.stabilityHeader, prose.structureFlag, prose.successionRisk, prose.conditionSeverity, prose.templeFraud

## Manifest, lint whole, typecheck, eslint
- **Manifest (b36bfc1d1):** the pglite test takes `pglite-executed`. The walker takes an inline rationale.
  `mutationCoverageManifest.test.js` is green.
- **`tests/lint` whole** (the gate mutex, `--maxWorkers=1`) exited 1. Log: `lint-whole.full.log`.
  - Totals: Test Files 17 failed | 206 passed (223); Tests 49 failed | 3248 passed (3297).
  - The 16 standing files fail with their standing counts (22 failures). The other 27 failures are the new walker's designed
    red.
  - No standing failure names a new file. **Standing only.**
- **`node scripts/check-full-typecheck.mjs`:** exit 0 (167 errors, ceiling 167).
- **eslint on both files:** exit 0.
- **Anchors:** every negative assertion carries `// anchored:` on its own line or the line above.

## CONFIRMED vs PLAUSIBLE
**CONFIRMED** (each executed, both engines):
- The six plant reds and their counts, and that every precondition held.
- The three teeth green.
- 0 parity faults.
- Owner-hidden rows served on Reveal DM.
- The walker's 27 red rows.
- Lint whole has standing failures only, plus the walker.
- Typecheck and eslint exit 0.

**PLAUSIBLE:**
- That the 20 unkept faults of (b) are the mask's form, like the 40 kept.
- That the writer's cure, `recentConflict` absent, null or '' on the reads that withhold the power, turns the six plants green
  without moving a tooth. Not executed: the cure is the writer's.

The receipt logs in this folder are left untracked. Only this file is committed.
