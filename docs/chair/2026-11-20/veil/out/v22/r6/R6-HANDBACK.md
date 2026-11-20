# R6 HAND-BACK (VEIL-22, the re-cut)

**Second builder (2026-11-20, from e56a0d42f): units 1-3 of the seat's continuation below the first builder's record.**
The first builder's record follows unchanged (it stopped at unit 1 on the stop rule).

# FIRST BUILDER — STOPPED at unit 1 on the stop rule

Test-only builder for VEIL-22, worktree `/home/user/wt/r6`, branch `v22-r6`, cut from the lane tip 49d3de5b2. No file under
`src/` or `supabase/` changed; `scripts/` only for the manifest row the counterfactual test owes (kept beside R2's
`galleryWithholdAlways` row: the cherry-pick's one conflict, resolved by keeping both rows). Nothing pushed.

## Unit 1, the re-cut: `git cherry-pick b47b7bbdb`, run at the tip (CONFIRMED, executed)
First run, unchanged (`counterfactual-at-tip-before-align.txt`): 4 of 4 RED. After the two ruling-backed alignments below
(`counterfactual-at-tip.txt`, reports `counterfactual.json`, `inversion.json`): **RED arm green, INVERSION arm green;
CONTROL red (8), MAIN red (66).**
- INVERSION: tier 1 inverting measured **none**: **KNOWN_TIER1 `{defence.scores.internal}` -> `{}`** (shrink). The row did
  not move to "not re-derivable": it VANISHED from the arm, because R2 re-classed `defence.scores.*` from diffuse to
  withhold-always (VR33), so the arm no longer judges it. Tier 2 recorded 2 (`economy.prosperity`, `safety.safetyLabel`);
  not re-derivable on the open read 6 prose rows (unchanged); 24 reads compared, 4 Subsistence aside.
- RED: its inversion stand-in was `defence.scores.internal`, now withheld on every read (R2, VR33): the open read no
  longer carries it, so "the open read re-derives its own figure" was false. Aligned: the stand-in is read from the rows
  (the first diffuse re-derived row the open read serves as a number: `legitimacy.score` at this tip), moved by 7, caught.
- MAIN (built (a) 1 `power.stability`; built (b) 56, R2's rows among them; 6 towns x 10 views; unbuilt 54: 31 would fail,
  20 pass, 3 held by no born town). Every R2 withhold-always row passes. **The 66 fails are `cast.stakes` and `cast.roles`
  only — NOT pinned-old-behaviour reds:**
  1. `cast.stakes` @ city-famine-7 (default and shut, Reveal off/on, both engines, gallery and link; 30 lines): the served
     town keeps a stake `Thieves' Guild / gains / "crime gains from the disorder"` where the counterfactual has
     `Merchant Guilds / split`. R2's rule keeps a stake whose `factionId` names a SERVED power, and the Thieves' Guild
     power is still served while its house is hidden: the cure is R3's (`power.entry`), a src change. STOP.
  2. `cast.roles` @ city-insurgency-3 (20 lines): reason `"holds the seat, and the right to it is already in dispute"`
     against the counterfactual's `"holds the seat"`: the wording, not the entry, carries the hidden house (R2's rule is
     per entry, by name). Cure: R3/R5 (re-class `cast.roles.reason`), a src change. STOP.
  3. `cast.stakes` twin vs server, 16 lines (4 towns x 4 reads): a HARNESS ARTEFACT, not a leak. The row's path matches
     the whole stake entry, and the harness compares it as `JSON.stringify` of an object; jsonb orders keys
     (`stake, reason, factionId`), the twin keeps the generator's order. Executed proof (`counterfactual-diag-keyorder.txt`,
     a throwaway copy with key-sorted comparison, deleted): twin-vs-server lines 0, CONTROL green, MAIN 50 (items 1 and 2).
- CONTROL (8 lines, "cast.stakes moved on a share hiding nothing", server only, 4 towns x Reveal off/on): the same key-order
  artefact as item 3. **NOT cured**: a key-order-blind comparison is a looser equality and no ruling moved it. Proposed for
  the seat: canonical (key-sorted) JSON in `valuesAt`; it changes nothing but object key order.

## Unit 3, VS1 (b) (CONFIRMED, executed)
RED at the tip: **24 lines** (12 births x Reveal off/on), every one `"(b): safety blackMarketCapture"` (`vs1b-red.txt`). The
"21" of `out/v22/v102-merged-guards-at-d136940c3.txt` is that file's 42-line tail, which starts mid-list at
`vs-thorp-3 dm`. Aligned by the same device as `weight`, now read from the registry: the expected show copy is the
unveiled projection less every BUILT withhold-always row of `REGISTRY_ROWS` (54 rows; `income.weight` and
`safety.blackMarketCapture` among them), compared on every family key; the hand `servedAs` is gone. GREEN 9 of 9, (b) 24 of
24 (`vs1b-green.txt`, `vs1b-green-tally.json`). Teeth, per copy: a planted served `blackMarketCapture` on the show copy is
caught **24 of 24**; a family value the registry does not withhold (`crimeTypes`) removed from the show copy is caught **24 of 24**.

## Guards
`mutationCoverageManifest` + `pgliteHookTimeoutRatchet` 28 of 28 (`guards.txt`); eslint clean on both test files.

## NOT DONE (stopped on the rule): units 2 and 4
- Unit 2, `rosterChoiceInversion.pglite.test.js`: not measured, not touched.
- Unit 4, the chair's condition on `safety.blackMarketCapture`: not measured. Read only (PLAUSIBLE, not executed):
  `sanitizeDossier` decides `unveiled = !served && !readShareVeil(veilOverrides).marked`, from the row's
  `gallery_member_overrides` alone; on the party link an unmarked share is given the default veil first
  (`writeShareVeil`), so the link should never draw the capture, marked or not.

## A SLIP TO REPORT
One `npx vitest run tests/domain/display/criminalVeilSwitch.test.js` ran with cwd `/home/user/settlement-engine` (a
backgrounded `cd` chain). It changed no tracked file there (`git status` clean) but vitest wrote its own cache
(`node_modules/.vite/vitest/.../results.json`, `node_modules/.vite-temp`) in that checkout. Left as found.

# SECOND BUILDER (VEIL-22's continuation, 2026-11-20)

## Unit 1, VR45 (the seat's key-order ruling, stood by the chair as VR45, arm (c) added) — CONFIRMED, executed
Applied in `tests/security/rosterChoiceCounterfactual.pglite.test.js` (comment `VR45, THE KEY-ORDER RULING` at `canon`):
`canon` = JSON with object keys sorted, recursively; arrays untouched. Used ONLY by `sameAtModKeyOrder`, called in two
places: CONTROL's "nothing moves" and MAIN's twin-versus-server. The judges, RED and INVERSION keep plain `JSON.stringify`.
Run (`counterfactual-keyorder-ruled.txt`; reports `counterfactual.json`, `inversion.json`, `keyorder-ruling-*.json`):
**6 of 7 green; MAIN red 50 lines; twin-vs-server lines 0; CONTROL green** (was 8 red).
- VR45 arms (each on MAIN's pair `cast.stakes` @ city-calm-1 default server-vs-twin AND CONTROL's pair city-calm-1 open
  server-vs-unveiled; clean pair passes, every object's keys reversed passes, the plant caught both plain and keys-reversed):
  (a) array reversed: caught 2/2; (b) one value moved: caught 2/2; (c) a key ADDED / a key MISSING on the entry: caught
  2/2 each, and at the DEEPEST object of every served document (48 documents, server and twin, every read; depth up to 6):
  added caught 48/48, missing caught 48/48 (`keyorder-ruling-keyset.json`).
- MAIN's remaining reds (NOT this builder's; MAIN unaltered):
  1. `cast.stakes` @ city-famine-7, 30 lines (default and shut, Reveal off/on; server gallery, twin, server link): a stake
     `Thieves' Guild / gains / "crime gains from the disorder"` against the counterfactual's `Merchant Guilds / split`. The
     stake is kept because its power is still served. CURE: R3 (`power.entry`: the criminal power withheld, its stake with it).
  2. `cast.roles` @ city-insurgency-3, 20 lines: reason `"holds the seat, and the right to it is already in dispute"`
     against `"holds the seat"`: the wording carries the hidden house. CURE: R3/R5 (re-class `cast.roles.reason`).

## Unit 2, `rosterChoiceInversion.pglite.test.js` under VR32 — CONFIRMED, executed
- At the tip, unchanged (`inversion-at-tip.txt`): **4 of 4 green**; inverting exactly the frozen six (`economy.prosperity`,
  `economy.prosperityStanding`, `legitimacy.colours|label|score`, `safety.safetyLabel`). Its `revisit` was CHAINED (the
  re-derived prosperity fed the defence profile, the re-derived readiness label the legitimacy reading): not VR32.
- `revisit` aligned to VR32 (each deriver over the served values as served, none fed another's; the stores' months still
  read from the served food record), run (`inversion-vr32-measure-red.txt`, where-map `inversion-vr32-where.json`): TOTAL,
  FIDELITY, RED green; MAIN red ONLY by SHRINKING: inverting `{economy.prosperity, economy.prosperityStanding,
  safety.safetyLabel}` (the three legitimacy rows left); not-re-derivable the same six prose rows; unfaithful `[]`.
- Shrunk `KNOWN_INVERTING` to those three (all tier 2 under VR28): **4 of 4 green** (`inversion-vr32-shrunk.txt`).
- NOTE against PART 22: `economy.prosperityStanding` STILL inverts here (with `economy.prosperity`, on this file's own
  birth metropolis-insurgency-5, which the counterfactual's births do not include). Tier 2: recorded, not blocking.

RECOMMENDATION: **ALIGN (done), do NOT retire yet.** What it holds, and which living arm holds it:
| it holds | held by a living arm? |
|---|---|
| RED: a served `legitimacy.score` moved by 7 is caught | YES: counterfactual RED (its inversion judge picks the first diffuse served number: `legitimacy.score`, +7) |
| MAIN, tier 1: no tier-1 row inverts | YES, stronger: counterfactual INVERSION (same town veiled vs its own open read; `KNOWN_TIER1` = {} asserted) |
| MAIN, tier 2: the inverting band set EXACTLY (shrink-only pin) | NO: counterfactual INVERSION only RECORDS tier 2 (2 rows), asserts nothing; and misses `prosperityStanding` (birth not in its set) |
| MAIN: KNOWN_NOT_REDERIVABLE exactly (6 prose rows) | NO: counterfactual records the same 6 (`notRederivable`), unasserted |
| TOTAL: every diffuse row re-derived or named with what is not served (11 named) | NO: counterfactual reports `notJudged` 11 as a count, no reasons, unasserted |
| FIDELITY: on the stored town each deriver reproduces the stored value (`KNOWN_UNFAITHFUL` {}) | NO arm anywhere |
| its 8 births (seeds `vr26-*`) | NO: different seeds |
Retire it only after the counterfactual's INVERSION arm pins the tier-2 set, the not-re-derivable set, TOTAL and FIDELITY
(and the births that show `prosperityStanding`): the seat's call.

## Unit 3, the chair's condition on `safety.blackMarketCapture` — CONFIRMED, executed (GREEN at first run)
NEW `tests/security/blackMarketCaptureSignal.pglite.test.js` (manifest row `pglite-executed` added beside its siblings):
12 born towns (7 with a criminal house, 5 without) on a pglite chain of every migration; each stored marked (default veil)
and unmarked, Reveal DM off and on; read through `get_gallery_dossier` and `get_unlisted_dossier`, then through
`fetchPublicDossier` (rpc stubbed with the server's row as returned) = `sanitizeDossier`'s own path. 3 of 3 green
(`blackmarket-capture-condition.txt`, `.json`).
- Server: no read carries the figure (96 reads). Every stored town holds a finite figure.
| arm | criminal towns drawn | non-criminal drawn | equal to owner's | served signal |
|---|---|---|---|---|
| gallery marked, DM off / on | 0/7 / 0/7 | 0/5 / 0/5 | - | served, marked |
| gallery UNMARKED, DM off / on | 7/7 / 7/7 | 5/5 / 5/5 | 12/12 / 12/12 | not served, unmarked |
| link marked, DM off / on | 0/7 / 0/7 | 0/5 / 0/5 | - | served, marked |
| link unmarked, DM off / on | 0/7 / 0/7 | 0/5 / 0/5 | - | served, marked (212 gives the link the default veil) |
- (i) drawn exactly where sanitizeDossier's expression over the SERVED overrides says, every read; one signal per arm.
  Swap arm: a body read with the other read's served overrides follows the overrides: 48 swaps, 0 against the signal.

## Guards (second builder)
`mutationCoverageManifest` + `pgliteHookTimeoutRatchet` 28 of 28 (`guards-2.txt`); eslint clean on the three test files.
