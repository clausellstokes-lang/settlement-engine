# R5D-SQL hand-back (VEIL-36, R5-DESC's cure, the first of two builders)

Seat brief: `docs/chair/2026-11-20/veil/briefs/R5D-SQL-BRIEF.md` (lane `lane/veil-36-2026-11-22` at 24b81c2b8). Worktree
`/home/user/wt/r5desc`, branch `lane/veil-36-2026-11-22-r5desc-wip`, built on b30a9cdce. NOT PUSHED.

## 1. Commits, bytes, runs, the cost law

**Commits**
- `051bae78e`: the cure (212, the twin's two files, the registry and its door's registry.json / rulings.json).
- This hand-back: the commit after it.

**Bytes**
- 212 `supabase/migrations/212_share_veil_later_cures.sql`: **a9b0884eb41890fd265048ac4c9762d6520e7d4773703bec0a26eeddbee3b58b**
  (was ff20ed89e3e67240... at the lane tip).
- Rollback `supabase/rollback/212_share_veil_later_cures.down.sql`: **8cbd7d1c7a6d60f609b7473b14b7fe2b2ca8a3b6f3081151c2ae49d82cded5b0**, UNCHANGED
  (no helper added, removed or re-signed, so its drops by signature still hold).
- 211 `eface6d093933170b9541fe630068c26e5bd41477e95e913ae7168e373be0b01`, UNCHANGED. 210 `9118c235c15d4ed434e192fb60e49dacd2040d52b7b8c28b3acc262494358a60`,
  UNCHANGED (`git diff HEAD` empty on 211, 210 and the rollback).
- STANDING_FORMS as each engine holds it, extracted between its markers (212's undoubled): sha256
  794367e0e6ae71dc7b82b5ee95ca69e8c4dfb77a990e2b2e81aeed36de4e8cc8, 23,737 characters, in both, the same as `--print`.

**Runs** (all local: the cluster at PGHOST=/var/tmp/rv7, template `v27x211`; no git repository variables set; vitest
through `scripts/gate-mutex.sh --run` in its shared tier, `--maxWorkers`; scratch `/tmp/claude-0/r5dsql/`)
| run | exit |
|---|---|
| `node scripts/veil/rosterChoiceRegistry.mjs` (the door: registry.json, rulings.json written) | 0 |
| `node scripts/veil/rosterChoiceRegistry.mjs --check` | 0 |
| `node scripts/veil/standingForms.mjs --check` | 0 (117 rows) |
| `vitest run tests/lint/rosterChoiceRegistry.walker.test.js` | 0 (11 of 11) |
| `npm run typecheck:domain:strict`, `npm run typecheck:ratchet` (via `gate-tail.sh`) | 0, 0 |
| eslint on the three JS files touched | 0 |
| local apply 001..211 (`v27x211`) + 212 | 0 |
| the same + the rollback; every public function's definition md5 and ACL against `v27x211` | 0, and `cmp` equal (480 functions) |
| on 001..211 + 212: `_gallery_veil*` executable by anon or authenticated | 0 functions |
| R5D-FORMS's proof `standingForms.proof.mjs <scratch> --pg`, then its 6,009 cases through 212's `_gallery_veil_withhold_always` | PROOF 0; SQL = reference 6,009 / 6,009; the twin's `standingBase` = reference 6,009 / 6,009 |
| scratch probe (`r5dsql.probe.jsx`): 70 born towns (`v11-ties-<size>-<calm/infiltrated>-<i>`), 108 gallery reads (unmarked, default veil, Reveal DM) against the twin's `projectShareVeil(galleryPayloadFor(...))`, plus the link | 0: twin differs on **0 of 108**; 730 served descs, 414 cut, 316 base only, **0** still ending in a table tail, **0** differing from the reference cut of the stored desc |

**THE COST LAW** (ruling 12; the largest born metropolis, 502,604 characters, default veil record, read as anon, 9 rounds,
medians; chains `r5dsql_x211` = 211 frozen, `r5dsql_tip` = the lane tip's 212, `r5dsql_a` = this 212; load 1.1 to 1.9):
| read | 211 | lane tip 212 | this 212 |
|---|---|---|---|
| gallery, Reveal DM off | 423.0 | 743.8 | 747.5 ms |
| gallery, Reveal DM | 239.7 | 649.3 | **641.7 ms** |
| link | 304.5 | 573.8 | 607.6 ms |

The Reveal-DM read is **641.7 ms against twice 211's read (2 x 423.0 = 846.0): WITHIN**. This 212 against the lane tip's: 1.01,
0.99, 1.06.

THE FIRST BUILD WAS OUTSIDE, and was changed before the commit: with the rows outermost and `~` first, as briefed, every row
compiled every pass (about 0.9 ms a compile here; 117 rows, 3 passes), so the always-pass on the largest town's nine descs
cost 330 ms and the Reveal-DM read 979.7 ms against 722.9 (2 x 361.4): **OUTSIDE**. The cure: a row is asked (by `~`, then the
capture) only of a text that ENDS IN THE LITERAL TEXT ITS PATTERN ENDS IN, read off the row at run time (the run before its
`$` of non-metacharacters, a one-character bracket as its character; '' where the row is unsure: a `|` outside every
group, a group deeper than five, no final `$`). Every match of a tail ends in that text, so no answer moves (the 6,009 cases
above were run AFTER this change). Every row of today's table has no top-level `|`, a paren depth of 4 at most and a literal
tail of 25 characters or more (the SQL extraction equals a JS one on 117 of 117). The always-pass's cut now costs about 8 ms
there. The twin compiles each row once a process and carries no precheck; the brief's shape (rows outermost, `~` first, the
capture only where it matches) is kept. **This is a step the brief did not name: vetoable; the seat may prefer another.**

## 2. What was built (212 (36); the header also gains (35b), R5-RECENT, which R5C5 had not written)

1. **The standing cut** (`-- registry: power.desc`), in `_gallery_veil_withhold_always` and `withholdAlways`, after
   `power.relation.ratio`: on EVERY non-owner read, each string `desc` of `powerStructure.factions[]` and master's `factions[]`
   loses its tail by the table, earliest start removed with its joining space, repeated while a row matches; ties by the
   smaller id (iteration in id order, `collate "C"`, strict `<` on the base's length); no match: as it stands. The literal is
   between `STANDING_FORMS begin` / `end` markers in both engines (212: a `jsonb` literal, the single quote doubled; the twin:
   a template literal, `JSON.parse`d). The registry row left the composed form: withhold, always, page re-derive
   (`pageRederive.js :: rederiveStanding`), built on the always-host.
2. **The hidden or masked row's own desc**, the same block, FIRST: a row whose `hidden` is JSON true, or whose `faction` or
   `name` is `'an unseen interest'` (`publicSafe.js :: HIDDEN_POWER_MASK`; the twin imports it), is served with no `desc`, both
   lists, every read the always-pass runs on.
3. **The belt**, in `_gallery_veil_roster_choices`' withheld-power block (after the trace) and `withholdPowerCopies`: where a
   house is hidden whole, a desc that names a withheld power whole AND whose base (as the cut leaves it) still names one leaves
   WHOLE, both lists. No new helper: 212 takes the bases by calling `_gallery_veil_withhold_always` on a document of those descs
   alone (the table is held once); the twin by `standingBase`. Hits over the bases by `_gallery_veil_name_hits` with the same
   search. Expected 0 on born towns; planted, it fires (below).
4. **dmNote per entry** (`-- registry: power.relation.dmNote`), in R3's relations block (`if withheld`), both engines: a
   served relation's `dmNote` that names a withheld power (pub's two lists less both served lists; the fold, the bare form,
   the id: `_gallery_veil_power_named`; the twin's new `withheldPowerNamer`, which `withholdPowerCopies` now also uses)
   leaves, the key. Asked only where a served relation carries a string note. The row keeps its input and derives
   withhold / house-hidden; the rule runs wherever a power is withheld, which holds more back than that.
5. **The masked tension party** (`-- registry: history.tension.maskedParty`, a new row: withhold, always, path
   `history.currentTensions[].factions[]`), always-pass: an entry equal to the mask leaves; the tension stays.
6. `power.label`: off the composed form, a plain diffuse row (0 names, 0 kind lines, 0 mask in 33,814 served labels).
7. `power.conflicts`' scope: "follows power.recentConflict" replaced by "leaves whole with it (power.entry)".
8. Presence-picked bases: nothing (E126).
9. registry.json and rulings.json regenerated by the door; each `-- registry:` / `// registry:` marker on its own line.

**Plants, each asked of both engines' passes directly (scratch probe; all SQL = JS):**
- A (always): hidden row and masked row lose their desc (both lists); two standings cut from one desc; a base-only desc kept;
  the masked tension party gone, the other entries and the non-array `factions` left alone.
- B (roster choices with a house hidden whole, then always): the dmNote naming `Shadow Hand` by name and the one naming it by
  id leave, the other note stays; the desc whose BASE names `Shadow Hand` leaves whole (the belt); the descs whose standing
  alone names it are kept, then cut to their bases.
- C (a power withheld, no house hidden): the dmNotes go as in B; the belt does not run (it is in the whole-house block, as briefed).

## 3. Findings for the seat (STOP-class items: none were invented around)

- **THE MASK INSIDE A STANDING IS NOT CUT BY THE TABLE (R5D-PAGE's plant (e) will red on it).** The name and label slots
  begin `[A-Z]`, so "Behind an unseen interest by enough margin..." matches no row in either engine (the reference `--cut`
  says "No match"; 212 serves it whole). The table is generated and frozen, so I did not touch it. The cure is a table row or
  slot change by R5D-FORMS (a migration adds it, by the data file's "grows" rule), or a ruling.
- A desc that is ALL standing (no base) is served as `desc: ''` in both engines (the reference cut's base is ''). No born desc
  in the probe is like that.
- The registry row `power.desc` keeps its writer (`rulingStructure.js :: generatePowerStructure`); the standing's own writer
  (`factionStanding.js :: annotateFactionStanding`, named in the data file's header) is not cited there.
- Not run, being R5D-PAGE's or outside the brief: the page walkers, the composed-hosts walker, the galleryServerVeil suites, the
  born gates, the full check.
