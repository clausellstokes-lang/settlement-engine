# R5C hand-back: R5-RECENT's cure builder (VEIL-33's V33-R5C, 2026-11-22)

Worktree `/home/user/wt/r5c`, branch `v33-r5cure`, cut at cbaa8d540 (the brief) over f8d8ea6e3 (the lane's tip with the
instruments merged). The only commit is this file. Nothing pushed, no pull request. Not one line of 212, the rollback, the twin
or the registry is written. 210 and 211 are untouched.

## STOPS
**Two STOPs. Each is one the brief names. Measure first reached both before any edit.**

### STOP 1: the open form (MEASURE FIRST (2))
No form that an open page shows is available for a withheld sentence.
- Every born page carries `powerStructure.recentConflict` as a NON-EMPTY STRING. That holds for 240 of 240 births and for 136 of
  136 nothing-hidden pages served by the twin. No open page shows the key absent, `null` or `''` (the table is below).
- The writer's own code agrees. `governanceNarrative.js :: deriveBaselineConflict` ends on a non-empty fallback string, and every
  stress narrative and the coup sentence (`rulingPower.js :: transferRulingPower`) is a non-empty string.
- So by ruling 62 (2) ("the empty form nothing-hidden pages show"; "a key no open page lacks is never deleted"), absence, `null`
  and `''` are each a TELL. A page without the sentence says a power was withheld. The instrument also counts any other string as
  a fault ("serves a rewritten form").
- The rule as ruled ("WITHHELD, NOT MASKED") cannot be met by any of the three empty forms without serving a tell.

The options, with their cost:
| | Option | What it meets | Cost |
|---|---|---|---|
| O1 | Key absent where it names a withheld power | the six plants (absence is admitted by the instrument) | a presence tell: no born page lacks the key; breaks ruling 62 (2)'s law; needs the chair's word that this tell is the lesser |
| O2 | `null` (or `''`) there | the same | the same tell; `null` and `''` are forms no born page shows |
| O3 | the house-free twin's sentence: re-derive `deriveBaselineConflict` over the served houses and config, as `economy.complexity` is re-derived | the plants and the tell, if the instrument is amended to admit the re-derived sentence | a large port to SQL (about 30 branches, priorities, institution flags, the neighbour, the stress narratives, `rewriteFactionPhrasing`, the sibling sets); the coup sentence has no house-free twin the page can derive; the instrument's "rewritten form" fault must be amended by the chair |
| O4 | one declared sentence of the writer's own pool (for example its final fallback), served in place | the plants, if the instrument is amended | still a rewrite; it may read false against the page (a grazing quarrel where nothing grazes); the instrument amended by the chair |

### STOP 2: the owner-hidden plants ((b) r5-owner and (c) r5-owner-lower)
Meeting (c) r5-owner-lower needs the hidden power's NAME. In the ruled host, `pub` does not hold it in either engine.
- **The twin, CONFIRMED (probe):** `galleryPayloadFor(stored, { shareDm: false })` on the plant's town keeps neither the row of
  "Silent Hand" nor any `hidden` key. The name appears nowhere in `pub` except inside the lower-case sentence itself ("Since the
  silent hand overthrew ..."). The mask is a case-sensitive split (`publicSafe.js :: maskText`), so it does not catch that
  spelling. `applyRosterChoices(s, pub, idOf)` gets only `pub`.
- **The server, CONFIRMED by reading 212 and 211:** `_gallery_veil(pub, overrides, link, copy)` and
  `_gallery_veil_roster_choices(doc, pub)` receive only the projection. Where the full town is in hand:
  - **Gallery read and import:** `_gallery_apply_member_overrides`'s `dm_full` (`_gallery_dm_full_json`) has it.
  - **Party link:** it is NOT in hand. `get_unlisted_dossier`'s `dm_full` is the projection plus `relationships`,
    `prominentRelationship` and `pressureSentence`, with no power rows.
  - **Campaign map's member:** it is NOT in hand. 211's `get_gallery_map`, which 212 does not restate, passes
    `_gallery_sanitize_public_json(src.j)` straight to `_gallery_veil`.
- (b) alone does NOT need the name. The projection writes "an unseen interest" in its place, and the served sentence carries that
  mask.

The options, with their cost:
| | Option | (b) | (c) owner-lower | teeth | Cost |
|---|---|---|---|---|---|
| H1 | In the ruled host, both engines: withhold where the served sentence carries the mask `an unseen interest` | green | **red** | green | cheap; a lower-case, possessive or other spelling of an owner-hidden power still leaks (the class stays open past the case-sensitive mask) |
| H2 | Withhold wherever the stored record holds any `hidden: true` power on a read that drops it | green | green | **tooth r5-owner-served red** | needs the full town where it is not in hand (the link's `dm_full` widened; `get_gallery_map` restated in 212); the twin in `galleryPayloadFor`; withholds sentences that name only served powers; the instrument amended |
| H3 | The lane's fold over the full town's hidden powers' names, where the full town is in hand | green | green | green | a second host outside the ruled one: the server in `_gallery_apply_member_overrides` (gallery, import), the link's `dm_full` widened to carry the hidden names, `get_gallery_map` restated in 212 (a 211 function newly in 212: VR27, the search-path pin ledger, the rollback); the twin in `galleryPayloadFor` / `gallerySecondHomes.js` (at its layer's size ceiling, 1,356 lines); the registry row then names two hosts |
| H4 | 210's sanitizer masks by the lane's fold, case-blind | green | green | green | a change to 210 (and its twin `publicSafe.js`): forbidden here |

(a) and the three rule-withheld (c) plants (r5-bare, r5-possessive, r5-lower) are buildable in the ruled host as the brief
rules. `wn`, `wn_ids` and `buildNameSearch` are there, but only where a house is hidden whole: `withholdPowerCopies` runs only
when `whole`. They are blocked by STOP 1 alone, since there is no withheld form to serve. I built nothing. The owner-hidden
answer may move the host. H3 puts the full town in hand on every read, and the rule-withheld plants could then sit in the same
place, so a roster-choices build now could be built twice.

## THE OPEN-FORM MEASURE
- **Probe:** `R5C-openform.probe.mjs` in this folder (untracked; its output is `R5C-openform.out`). It makes 40 births per size,
  with the lane's dials (`veilChain.shared.mjs :: BIRTH_DIALS`, random stresses) and seeds `r5c-open-<size>-<i>`.
- **What it reads:** each town's `powerStructure.recentConflict` as stored, and as served by the twin
  (`projectShareVeil(galleryPayloadFor(t, { shareDm: false }), null)`, the unmarked share).
- **Nothing-hidden:** a town with no hideable house and no `hidden: true` power.

| Size | Births | Stored: string | Served: string | Nothing-hidden births | Nothing-hidden served: string | absent | `null` | `''` |
|---|---|---|---|---|---|---|---|---|
| thorp | 40 | 40 | 40 | 34 | 34 | 0 | 0 | 0 |
| hamlet | 40 | 40 | 40 | 39 | 39 | 0 | 0 | 0 |
| village | 40 | 40 | 40 | 38 | 38 | 0 | 0 | 0 |
| town | 40 | 40 | 40 | 23 | 23 | 0 | 0 | 0 |
| city | 40 | 40 | 40 | 2 | 2 | 0 | 0 | 0 |
| metropolis | 40 | 40 | 40 | 0 | n/a | 0 | 0 | 0 |
| **all** | **240** | **240** | **240** | **136** | **136** | **0** | **0** | **0** |

- **Present, a string: 240 of 240. Null, '' or absent: 0.**
- No metropolis birth hides nothing: all 40 have a hideable house.
- This was a twin-side probe. The server's served form was not read on these births (PLAUSIBLY the same: server = twin at the key
  on every plant read, R5R).

## THE RULE AS BUILT, BOTH ENGINES
**None.** Both STOPs fell before the first edit. The registry row `power.recentConflict` stays COMPOSED on the planned host
`_gallery_veil_composed` / `withholdComposed`.

A further note for the seat. The registry names the row's writer as `src/generators/power/conflicts.js :: generateConflicts`, and
no line of `conflicts.js` mentions `recentConflict` (CONFIRMED by grep). The writers are:
- `power/governanceNarrative.js :: buildGovernanceLabels`, through `rulingStructure.js :: generatePowerStructure` and
  `factionDynamics.js :: boycottReadsRelation`;
- `domain/rulingPower.js :: transferRulingPower`, the coup sentence of the witness, "X overthrew the ... and reshaped the
  government as a ...".

## RED AND GREEN
Measure first (1), both instruments at the cut. The cut carries unit (viii) past the instruments' own branch (69ccb5498), so
these were re-run here.

Both runs waited for the seat's pool to show END, then ran under `sh scripts/gate-mutex.sh --run --`, through `gate-tail.sh`,
with `--maxWorkers=1` and GIT_* unset. Their logs are in this folder, untracked (`R5C-plant-red.*`, `R5C-walker-red.*`).

**`tests/security/galleryVeilRecent.pglite.test.js`: exit 1, Tests 6 failed | 3 passed (9). Plant RED 6 of 6, teeth GREEN.**

| Title | Seed | Gated engine-reads | Own reads withholding the target (all gated) | Faults |
|---|---|---|---|---|
| PLANT (a) | r5-taker | 100 | 28 | 100 |
| PLANT (b) | r5-owner | 60 | 20 | 60 |
| PLANT (c) | r5-bare | 100 | 28 | 100 |
| PLANT (c) | r5-possessive | 100 | 28 | 100 |
| PLANT (c) | r5-lower | 100 | 28 | 100 |
| PLANT (c) | r5-owner-lower | 60 | 20 | 60 |

- Every plant has 54 reads.
- **Kept fault lines** (the first 40 a plant): 200 "names the withheld power" and 40 "serves the mask's form". The mask's form
  is all from (b).
- **server = twin:** 0 parity faults.
- **TOOTH r5-served:** 108 engine-reads, 100 beside the withheld power, 0 faults.
- **TOOTH r5-owner-served:** 108 engine-reads, 60 beside it, 0 faults.
- **TOOTH hides-nothing:** 108 open-town engine-reads, plus 52 reads of other towns that hide nothing, 0 faults.
- These are the same counts as R5R's run 3, now at the cut.

**`tests/lint/rosterChoiceComposedHosts.walker.test.js`: exit 1, Tests 27 failed | 6 passed (33).**
- Each RED row is titled "<row>: its server and twin hosts are declared and exist (not PLANNED)". In walk order:
  - power.recentConflict, power.desc, power.label, power.relation.dmNote
  - prose.posture.posture, prose.posture.prize, prose.posture.terrain
  - prose.state.firstSurvey, prose.state.publicOrder.field, prose.state.publicOrder.beside,
    prose.state.publicOrder.rung.sentence, prose.state.publicOrder.rung.glance
  - prose.threat.economic, prose.wall.rationale, prose.shadowEconomy, prose.incomeMix, prose.prosperityHeader.detail,
    prose.prosperity.sentence, prose.legacyLines.a, prose.legacyLines.b, prose.legitimacyBanner, prose.legitimacyLens,
    prose.stabilityHeader, prose.structureFlag, prose.successionRisk, prose.conditionSeverity, prose.templeFraud
- GREEN: 4 controls, `history.founding.overcoming` and `prose.incomeWeight`.

**RED commit:** none is needed. The instruments are red at the cut, as shown above. **CURE commit:** none, because of the STOPs.

## RE-RUNS NAMED IN THE BRIEF
All of these belong to a cure, and there is none. Not run: the plant green 9/9, the walker green on `power.recentConflict`,
`rosterChoiceRegistry.walker`, `rosterChoicePools.walker`, `node scripts/veil/rosterChoiceRegistry.mjs --check`,
`galleryRosterChoices.pglite`, `galleryServerVeil`, `galleryVeilHandRows`, Tell3, Tell4, Tell5, Tell8, typecheck, eslint and
`tests/lint` whole. No file under `src/`, `supabase/` or `tests/` changed, so they stand as the seat's last pool left them.

## 212 AND THE ROLLBACK (unchanged)
- `supabase/migrations/212_share_veil_later_cures.sql`: `0352a5028544cce06c7bd9f610c23c60bc6fda5413528467fb4e478792bbb278`
  (the brief's `0352a5028544cce0…`)
- `supabase/rollback/212_share_veil_later_cures.down.sql`: `8cbd7d1c7a6d60f609b7473b14b7fe2b2ca8a3b6f3081151c2ae49d82cded5b0`
- 211, byte-frozen: `eface6d093933170b9541fe630068c26e5bd41477e95e913ae7168e373be0b01`
- 210: `9118c235c15d4ed434e192fb60e49dacd2040d52b7b8c28b3acc262494358a60`

## CONFIRMED vs PLAUSIBLE
**CONFIRMED:**
- The open-form table (twin, 240 births). The writer's baseline is never empty (code read).
- The twin's `pub` on a player read holds no name and no `hidden` flag of an owner-hidden power (probe).
- The server's veil and roster choices receive only the projection. The full town is in hand only in
  `_gallery_apply_member_overrides` on the gallery read and the import, and not on the link or the map's member (read in 212
  and 211).
- The registry's writer attribution for `power.recentConflict` is wrong (grep).
- 212 and the rollback are unchanged (sha256).
- At the cut, both engines: the plant is red 6 of 6 with every precondition held, the teeth are green, and there are 0 parity
  faults. The walker is red on 27 rows.

**PLAUSIBLE:**
- That the server's served form on born pages matches the twin's table. It was not read on these births. It is PLAUSIBLE from the
  0 parity faults on every plant read.
- That H1 turns (b) green with the teeth green. Reasoned from the plant's judgment (`gatedFault`), not executed.
- That H3 meets all nine. Reasoned, not executed.

## FOR THE OWNER, IN PLAIN WORDS
The fault is real: a shared page can name a power the page is meant to hide, in the one-line "recent conflict" story. I did not
fix it, because two of the rules I was given cannot both hold.

First, every town the generator makes has that story line. When a story has to be hidden, removing it or blanking it leaves a
gap no ordinary page has, and the gap itself tells a reader something was hidden. Replacing it with a different sentence is the
other way out, but my instructions count that as a fault too. Someone above me has to choose which of those costs to accept.

Second, when you hide a power yourself, the public copy of the town no longer holds that power's name. Where the story spells the
name differently, for example in lower case, the place where I was told to put the fix cannot recognise it. Catching it needs the
full town in hand, which today only some of the share links have. Giving it to the rest means touching more of the server than
this unit was cleared for.

Nothing here is live, so nothing leaks today. I have written out the options and what each costs, for the chair to pick.
