# FRAME-5 · CF12 — a hall in criminal hands with a live crime wave: the owner's sheet says so (results)

Written 2026-11-20T12:48Z (`date -u`) by the CF12 builder of FRAME-5, on `frame5-cf12` (cut at `8991b83b2`). The brief is `CF12-CAPTURED-HALL.md`; the prompt adds the chair's ADDITION 1 (city-14, 11:21 UTC) and ADDITION 2 (every reader of the sheet's facts states its audience, 11:25 UTC), and the coordinator relayed the chair's addition of 11:58 UTC (W4 agreed; the gate and its test named; both counts; the stored sides untouched). The scratch is `/tmp/claude-0/-home-user-settlement-engine/5842d846-a428-5b75-9043-bc5fde251649/scratchpad/CF12/`, and every script is quoted at the end.

## The measure, taken first (no edit before it)

**The pool.** B2's `pool.mjs 55`, born from this tree: **tried 484, calm 330** (55 a tier). B7's crisis pool is B7's `gen.mjs` seeds and forced kinds (`b7-<kind>-<tier>-<i>`, 24 a kind), with full records cached: **360 born, 0 misses**.

**FRAME-5's `cf12.mjs`** over the calm pool gives FRAME-5's six towns exactly: `{"town":2,"city":3,"metropolis":1}`, total 6.

| town | the hall at corrupted | the crime wave's sides (as stored) | framed today |
|---|---|---|---|
| frame-calm-town-20 | Town Mayor | Military/Guard · Those who would take the law into their own hands · the criminal network | no |
| frame-calm-town-80 | Town Mayor | (the same three) | no |
| frame-calm-city-12 | Merchant Guild Council | Military/Guard · Those who would take… · Thieves' Guild | no |
| frame-calm-city-14 | Merchant oligarchy | Military/Guard · Those who would take… · Thieves' Guild | **yes, W2 on this crime wave** |
| frame-calm-city-49 | Merchant oligarchy | Military/Guard · Those who would take… · Thieves' Guild | no |
| frame-calm-metropolis-51 | Ducal Governorship | Military/Guard · Those who would take… · Thieves' Guild | no |

town-20 and town-80 seat **no criminal power**: their third side is the generator's fallback words, "the criminal network", and the crime signal reads no criminal power on their roster. Their captured hall (the Mayor's) has no corrupted relation row.

**The design was measured on a probe copy of `src/` before the build.** A W4 strain, built as the brief's design in a scratch copy of the base tree, moved exactly the five unframed towns and nothing else (the figures below). The final tree gives the same five sheets byte for byte (`cmp` of the probe's sheets with the tip's: equal). Nothing in the measure refuted the design:
- **The strain is printed nowhere.** `troubleOfWeight(...).strain` is read only inside `troubleCast.js` (grep over `src/`), and `frameOf` prints the cast's type, line, hooks and sides, never its grade. So no line joins `FRAME_REASONS`.
- **No town moves without both facts.** W4 needs both, by construction and by the count.

**City-14 (ADDITION 1).** Its people to voice are its crime wave's three sides, each one by name:
- The Guard: Rhiannon Byrne, the garrison commander, "because she commands the Guard";
- Those who would take the law into their own hands: Waitling Whelan, the house boss, by a tie;
- The Thieves' Guild: Niall Carey, the network's head, "because he heads the Thieves' Guild, which works outside the law".

**No side is missing**, so city-14 keeps its sheet byte for byte (W2 outranks W4). Its owner sheet digests `d9c0870f07fe7c2a` at the base and at the tip. Its hooks are those three people's own.

## What was built

- **`src/domain/tension/troubleCast.js`** (W4, the brief's design):
  - `WEIGHT_GRADES` gains its own last row, `['hall-captured']`, the weakest.
  - `WEIGHT_MATTER.hall = ['crime_wave']`.
  - `HALL_TAKEN = ['corrupted', 'capture']` is held as the ladder's own words. A test pins it to `corruption.js :: CAPTURE_LADDER.slice(indexOf('corrupted'))`. It is not imported, because importing `corruption.js` added six `corruption.js#*_TUNING: dependents moved` rows to `tuningRegister`'s red. Measured, then undone.
  - `troubleOfWeight` reads it on `powerStructure.factions[].captureState`, and a `crime_wave` is about W4 where any power holds such a rung.
  - The frame's sides, faces, reasons, hooks, caps and the hash are the existing machinery's. Nothing new is drawn.
  - The stored sides (`tensions[].factions`), `sideKey`, `templateLabelOf` and `GENERATOR_REPLACED_SIDES` are untouched.
- **`src/foundry/journalPages.js`** (ADDITION 2): the Foundry crisis page's `printedFacts` passes `{ audience: TONIGHT_AUDIENCES.owner }`, as the same file's Tonight page does. The module is the DM's own export.
- **`src/domain/coherence/crisisFactFindings.js`** (ADDITION 2): `crisisCastSenseFindings` passes **`{ audience: TONIGHT_AUDIENCES.owner }`**. Why the owner:
  - It checks what only the owner's record carries: `want_not_own` reads a cast person's own `goal`, and `target_runs_plot` reads the crisis's secret. Every public projection strips both NPC fields (`display/publicSafe.js`), so the sheet it checks is the DM's.
  - It is the page battery (`coherenceBattery.js`), run by the soak and the certification over the DM's own birth, beside the PDF and the Foundry text, both owner exports.
  - It composes only for a town whose crisis carries a cast, and a town in crisis draws no frame for anyone. So the people it reads are the same for every reader.
- **Tests**:
  - `tests/domain/tension/troubleWeight.test.js` gains a new block (4 tests).
  - `tests/domain/summary/tonightSheetAudience.test.js` is new: the walker.
  - `tests/security/frameShareVeil.test.jsx` gains one new `describe` at the END of the file. Nothing above it is touched.
  - `tests/domain/tension/troubleCast.test.js`: the one pin that moves, below.

## The count (the chair's 11:58 addition: both figures, by size)

| framed calm towns | thorp | hamlet | village | town | city | metropolis | total |
|---|---:|---:|---:|---:|---:|---:|---:|
| base 8991b83b2, the owner | 0 | 8 | 15 | 5 | 12 | 18 | 58 |
| **the reader's count** (W1–W3 at the tip, today's standing) | 0 | 8 | 15 | 5 | 12 | 18 | **58, unchanged** |
| **the owner's count** (tip) | 0 | 8 | 15 | **7** | **14** | **19** | **63 = 58 + 5** |

The five W4 opens are town-20, town-80, city-12, city-49 and metropolis-51, each on its crime wave at #0. The reader's count above counts the towns W1–W3 weigh, as the chair framed it. A reader who is not the owner is in fact composed no frame at all: on the 330 towns, at the base and at the tip, every stranger sheet is the no-frame sheet (1320 of 1320 identical, below).

## Who the W4 frame casts, by name, side and reason (the owner's sheet; full text in `CF12-SHEETS.txt`)

| town | The Guard | Those who would take the law… | the criminal side |
|---|---|---|---|
| town-20 | Barlas Arlat, the innkeeper: trade | Alaqai Ba'arin, the master butcher: her own hook | "the criminal network": no one named; reached through Hulegu Khwarezm, who keeps the taverns |
| town-80 | **Titia Cato, the watch captain: "because she commands the Guard"** | Accia Cicero, the tavern keeper: trade | "the criminal network": no one named; reached through Xenia Publicola, who keeps the inn |
| city-12 | Iulia Pulvillus, the stable master: trade | Vibia Paullus, Master of the Guilds (the seat): a tie, Silent Partnership | **Vita Salinator, the gang boss: heads the Thieves' Guild** |
| city-49 | **Lujain al-Omani, the garrison commander: commands the Guard** | Samira ibn Jubayr, First Magnate (the seat): a tie, Silent Partnership | **Saida ibn Khaldun, the gang boss: heads the Thieves' Guild** |
| metropolis-51 | Phokas Nestongos, the coaching-inn keeper: trade | Angelos Niketas, the master furrier: his own hook | **Gregorios Zoe, the network's head: heads the Thieves' Guild** |

**One sheet as printed, before and after: frame-calm-city-49.**

- **Before**, people to voice:
  - Samira ibn Jubayr, First Magnate [seat]: "Wants to find out what it would cost to buy their way free of the Thieves' Guild."
  - Imad al-Hassan, the dean [cleric].
- **After**, people to voice:
  - Lujain al-Omani, the garrison commander [The Guard]: because she commands the Guard;
  - Samira ibn Jubayr, First Magnate [Those who would take the law into their own hands]: because she and Abdullah al-Andalusi are partners in something neither will name;
  - Saida ibn Khaldun, the gang boss [The Thieves' Guild]: because she heads the Thieves' Guild, which works outside the law.
- **Hooks after**: the faces' own hooks first (Samira ibn Jubayr, Lujain al-Omani, Saida ibn Khaldun).

**For the chair, measured and not built around:**
- The ruling names "the first of the criminal power, and the keeper of the watch or the law house". The existing variety ladder fills the Guard side by office in 2 of 5 towns: the watch captain, the garrison commander. In the other 3 it fills it by trade (an innkeeper, a stable master, a coaching-inn keeper), by the hash against `FRAME_TUNING.rates.enforcer`. That is the owner's own "the garrison commander is not always the one", and the brief's design ("the variety ladder").
- In town-20 and town-80 the record holds **no** criminal power, so that side names no one (law 1).
- In city-12 and city-49 the seat stands on the vigilantes' side by a crooked tie on the record.

## Proofs

**(a) Byte-identity** (`compare.mjs`, base `8991b83b2` against the tip, over the cached pools; sha256 of the composed sheet):
- **Calm pool, the owner's sheet:** 325 identical, 5 differ. The 5 are the W4 towns. They include none of: the 267 other unframed towns, the 57 framed towns other than city-14, or city-14 itself.
- **Calm pool, a stranger's sheet** (no options, `{}`, `'player'`, `'gallery'`): 1320 of 1320 identical.
- **B7's crisis pool:** owner 360 of 360 identical; stranger 1440 of 1440 identical.
- **`troubleOfWeight`, strain and place:** 325 of 330 calm identical (the 5 move none → W4); 359 of 360 crisis identical. `b7-under_siege-metropolis-1` reads W4, but a town in crisis is never given a frame, so its sheets stay identical (above).
- **`troubleWeight.test.js`'s pins:** none moved (every existing arm green, unchanged).

**ADDITION 2, the two readers, byte-identical before and after** (`readers.mjs`):

| reader | calm pool (330) | B7 crisis pool (360) |
|---|---|---|
| journalPages crisis page, printed facts (base no audience vs tip owner) | 330 identical | 360 identical |
| journalPages crisis page, the page's markdown as built | 330 identical (no page: calm) | 360 identical (360 pages) |
| crisisCastSenseFindings, findings | 330 identical | 360 identical |
| the sheet people it reads (base no audience vs tip owner) | 330 identical | 360 identical |

The findings are 0 on both pools at the base and at the tip, so the people row is the load-bearing one.

**(b) Red first, then green.** The new tests ran against the base source, in an archive of `8991b83b2` with only the test files copied in:
- `troubleWeight.test.js` + `tonightSheetAudience.test.js`: **4 failed, 7 passed (11)**.
  - The walker: `src/domain/coherence/crisisFactFindings.js:207 composeTonightSheet(settlement)` and `src/foundry/journalPages.js:193 composeTonightSheet(settlement)`.
  - "the grade is its own last row…" fails, as does "5 calm towns with both facts…" (5 of 5: `expected null to match object`).
  - "both facts, each needed…" fails: `capture: expected null`.
  - city-14's keep-pin is **green at the base**.
- The veil file, `-t CF12`: **1 failed** (5 of 5 towns: "W4: expected undefined").
- **Green at the tip:** 11 of 11, and the veil file 8 of 8.

**(c) Fixtures and pins** (`grep tests/` for `WEIGHT_GRADES`, `troubleOfWeight`, `crime_wave`, `captureState`, golden):
- **One pin moves:** `tests/domain/tension/troubleCast.test.js`, "the sharpest grade opens the sheet, over the record's order; the record's order breaks a tie; severity is never read". It pins `WEIGHT_GRADES.flat()`, which the brief orders to gain a row. The literal gains `'hall-captured'`, nothing else.
- No digest and no golden is re-recorded. The veil arms' `TODAY` digests are NEW pins, written at the base by the block's own door (`CF12_VEIL_PRINT`), as the file's other pins were.
- **Stored figures moved: none.** The change is render and cast only.
- **The tuning row.** `WEIGHT_GRADES` gains a row of strings: not a `*_TUNING` table, and no numeral. `tuningRegister.walker.test.js` › "the measured tree matches the committed inventory exactly" is red at the base and at the tip with the **same three items** (`FRAME_TUNING: measured, not in the inventory`; `CRISIS_CAST_TUNING` and `WANT_MAX_WORDS: dependents moved`). **Mine adds nothing.**
- The lighting census (a new file, `tonightSheetAudience.test.js`; a new suite with 4 tests in `troubleWeight.test.js`; a new suite with 1 test in the veil file) is the integrator's to re-take at the merge.

**(d) For the security reader** (the chair's 11:58 addition: the gate and its test):
- **THE GATE** is `src/domain/summary/tonightSheet.js :: composeTonightSheet`. It composes the frame only when `options.audience === TONIGHT_AUDIENCES.owner` (`forOwner`), so every other value fails closed. W4 rides that same frame, so it inherits that gate.
- **The second lock** is `src/domain/tension/troubleCast.js :: castTroubleFrame`'s seed gate (`_seed`, stripped by every shared projection).
- **A third lock on public records:** `display/publicSafe.js :: publicVeilPass` deletes `captureState`, so `troubleOfWeight` holds no W4 there.
- **The DM layer of a shared read keeps it.** The gallery read with DM content shared keeps `captureState`, measured on all five towns, and its sheet is the seeded record's. There the audience gate and the missing seed hold the frame back, as they do for every strain.
- **THE TEST** is `tests/security/frameShareVeil.test.jsx`, "CF12: a hall in criminal hands with a live crime wave draws for the owner only" › "5 born towns: the owner's sheet opens on the crime wave; every other reader, every shared read and every page is today's". On each of the five towns:
  - liveness (W4, the crime wave, the owner's sheet is not today's);
  - no options, `{}`, `'player'` and `'gallery'` on the seeded record give today's digest;
  - the gallery read (default and DM content shared) and the party link give today's sheet for every reader, the owner included;
  - on the two veiled reads, no W4 even with the seed handed back;
  - the real gallery page (default and DM shared) and the party link's page (Reveal DM off and on), opened by "Open Tonight", show today's sheet text, no sides, and none of the owner's frame lines.
  - The first-lock arms of B3 above it stay green (8 of 8).
- **Also:** `tests/domain/tension/troubleWeight.test.js` › "5 calm towns with both facts…" asserts the stranger's sheet carries no frame. "both facts, each needed…" asserts that a record with `captureState` deleted gives no W4, and neither do `none`, `adversarial` or `equilibrium`.
- **What a reader of a shared page could newly meet: nothing.** The new lines (the crime wave's sentence as the opening, its sides, the gang boss "because she heads the Thieves' Guild, which works outside the law") reach the owner's sheet only. What I would test further: the gallery DM-shared read keeps `captureState` under the DM layer (the security lane's posture, not mine). Any future frame strain must not read a field the DM layer keeps without the seed lock.
- **The walker:** `tests/domain/summary/tonightSheetAudience.test.js` › "the walker finds every call, and each passes an explicit audience". It reads code only (`codeOnly`), and requires the second argument of every `composeTonightSheet` call to name `audience`. `crisisPage.js`'s call passes `forOwner ? { audience: … } : null` and counts. If P1b reshapes that call, the walker reads it again at the merge.

## Gates (each to a file, read by its count lines)

| gate | result |
|---|---|
| `tests/domain/tension` + `tests/domain/crisis` | 26 files, 205 passed |
| `tests/security/frameShareVeil.test.jsx` | 8 of 8 |
| the new tests | 11 of 11 (+ the veil arm) |
| the 72 test files that import `troubleCast.js`, `journalPages.js`, `crisisFactFindings.js`, `coherenceBattery.js` or `tonightSheet.js`, run with the three above (96 files) | 95 files green; 809 passed, 1 expected fail, **1 failed**: `tuningRegister.walker.test.js` › "the measured tree matches the committed inventory exactly", red at the base with the same three items (not mine) |
| `npm run typecheck:ratchet` | exit 0 (167, ceiling 167) |
| `npm run typecheck:domain:strict` | exit 0 (1113, ceiling 1113) |
| `npm run lint` | exit 0 (0 errors; 38 warnings, none in my files) |

## The scripts (node, from the scratch; absolute `src/` paths with a trailing slash)

`pool.mjs 55 calm.json <src/>` is B2's, quoted in `frame2/B2-WEIGHT-RESULTS.md`. `cf12.mjs` is FRAME-5's, quoted in the brief. `b7pool.mjs b7.json <src/>` is B7's `gen.mjs` loop, caching `{ seed, tier, kind, s }` whole.

`compare.mjs <calm.json> <b7.json> <base src/> <tip src/> [sheets.txt]`:
```js
import fs from 'node:fs'; import crypto from 'node:crypto';
const [CALM, B7, BASE, TIP, SHEETS] = process.argv.slice(2);
const load = async (R) => ({ sheet: await import(R + 'domain/summary/tonightSheet.js'), cast: await import(R + 'domain/tension/troubleCast.js') });
const B = await load(BASE), T = await load(TIP);
const d = (x) => crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex').slice(0, 16);
const OWNER = { audience: 'owner' };
const STRANGERS = [undefined, {}, { audience: 'player' }, { audience: 'gallery' }];
// per calm town: castTroubleFrame at each tree (the count by tier); owner sheet digests base vs tip (a moved town's
// sheet printed before/after); each stranger's sheet base vs tip. Per B7 town: owner and stranger digests base vs tip.
```
(The full text, with the plain-text printer, is `CF12/compare.mjs` in the scratch.)

`readers.mjs <calm.json> <b7.json> <base src/> <tip src/>` (the base must be a full archive, for `foundry-module/`). Per town:
- base `composeTonightSheet(s).facts` vs tip `composeTonightSheet(s, { audience: 'owner' }).facts`;
- the journal's crisis page (`buildJournalPages(buildViewModel({ settlement: s }), { settlement: s })`, the page named `CRISIS_PAGE_COPY.tab`), base vs tip;
- `crisisCastSenseFindings(s, {})` base vs tip, and the sheet people it reads, base (no audience) vs tip (owner) for a town in crisis;
- `troubleOfWeight` strain and place, base vs tip.
