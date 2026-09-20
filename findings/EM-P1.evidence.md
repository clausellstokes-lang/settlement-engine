# EM-P1 — evidence (lane EM COMPILE P3, letter `c`, Opus, session 923472dc)

Base and drift: `EM-B2.evidence.md` §E0/§E12/§E14. Base `d31af2cee`; Wave 0 at `1d2da8c95`;
owner decision A read as DECIDED YES at `799074c99`.

## P1-E1 · THE DEFECT, MEASURED ON ALL THREE CARD KINDS

```
$ sed -n '1629,1633p' src/generators/npcGenerator.js
  // Assign sequential IDs
  npcs.forEach((npc, idx) => { npc.id = `npc_${idx + 1}`; });
$ git grep -n "\bid:" -- src/generators/steps/assembleInstitutions.js
701:      id: `repair.${generationRepairs.length + 1}`,        (a repair row only)
$ git grep -n "institutions.find(i => i.name === instName)" -- src/generators/steps/assembleInstitutions.js
426:    const existing = institutions.find(i => i.name === instName);
492:    const existing = institutions.find(i => i.name === instName);
$ git grep -n "id: \`faction" -- src/generators
src/generators/density/densityAscension.js:142:      id: `faction.${slug(name)}`,
```

**NPC = the array index. INSTITUTION = the display name (no general id mint at all).
FACTION = a slug of the name.** None is drawn from the seed's stream; all three move when a
roster or a name moves — and design §14 makes rosters and names editable.

## P1-E2 · THE THREE CONVICTED READERS, IN THE ESTATE'S OWN WORDS

```
$ git grep -n "npc_3\|npc_6 -> npc_8" -- src/domain
src/domain/locksPreservation.js:228: * moment a locked `npc_3` survives, `npc_3` may name somebody else and the lock
src/domain/npc/characterDrift.js:17:  * orphan, it REBINDS — a keeper moved npc_6 -> npc_8 while `npc_6` came to name a
src/domain/npc/characterEdit.js:51:  *    (`generators/npcGenerator.js` stamps `npc_${idx+1}`), and a preserved
src/domain/npc/characterEdit.js:53:  *    while `npc_3` came to name a different person. Every id-keyed SIDECAR is
```
Three separate modules independently recorded the same defect class. They take the id first.

## P1-E3 · THE MIGRATION PATTERN IS MEASURED AND UNCONDITIONAL

```
$ git grep -n "migrateSaveToV2" -- src/lib/saves.js
190:function migrateSaveToV2(entry) {
195:  // objects users keep. Because migrateSaveToV2 runs on every read AND write
331,443,503,684,713,743,775,850   (every read and every write path)
$ node -e "…Linter max-lines…" src/lib/saves.js
File has too many lines (619).       (layer ceiling 800; no size-baseline entry)
```
`migrateSaveToV2`'s own comment states the property this packet needs: it *"runs on every read AND
write path"*, which is why it *"also RECOVERS the seed for already-saved rows"*. A v3 step inherits
that reach, and satisfies `PACKET_STANDARD.md`'s "Ungated persistence" law by construction —
**no flag may gate it.**

## P1-E4 · ⛔⛔ THE GOLDEN BLAST RADIUS IS WIDER THAN TWO FIXTURES — COUNTED

```
$ ls tests/fixtures/ | grep -ci golden                                  44
$ git grep -c "recordGolden({" -- tests | awk -F: '{s+=$2} END {print s}' 46
$ for f in $(git grep -ln "recordGolden({" -- tests); do grep -q "generateSettlementPipeline\|generateSettlement(" $f && echo $f; done
tests/domain/townCartographyCalibration.test.js
tests/property/generatorGoldenMaster.test.js
$ for f in $(git grep -ln "recordGolden({" -- tests); do grep -qE "\.npcs|generateNPCs" $f && echo $f; done
tests/property/corruptionWebDormancyGolden.test.js
tests/property/generatorGoldenMaster.test.js
tests/property/momentumDormancyGolden.test.js
tests/property/npcCredibilityDormancyGolden.test.js
tests/property/npcGrowthDormancyGolden.test.js
tests/property/npcLadderDormancyGolden.test.js
tests/property/roadsDormancyGolden.test.js
```

**44 golden fixtures and 46 `recordGolden` call sites exist.** The charter's phrase "the golden
fixtures gain the id keys" resolves to a CANDIDATE SET of **eight** suites — the two that hash a
whole settlement plus the six that reach NPC records:

| # | suite | why it is a candidate |
|---|---|---|
| 1 | `tests/property/generatorGoldenMaster.test.js` | hashes the whole serialised settlement (525 rows) |
| 2 | `tests/domain/townCartographyCalibration.test.js` | generates settlements into a calibration corpus |
| 3 | `tests/property/corruptionWebDormancyGolden.test.js` | reads `.npcs` |
| 4 | `tests/property/momentumDormancyGolden.test.js` | reads `.npcs` |
| 5 | `tests/property/npcCredibilityDormancyGolden.test.js` | reads `.npcs` |
| 6 | `tests/property/npcGrowthDormancyGolden.test.js` | reads `.npcs` |
| 7 | `tests/property/npcLadderDormancyGolden.test.js` | reads `.npcs` |
| 8 | `tests/property/roadsDormancyGolden.test.js` | reads `.npcs` |

⛔ **A CANDIDATE IS NOT A MOVER.** Only a fixture whose SERIALISED payload carries the new keys
actually moves; a dormancy golden that projects a few scalars off an NPC may not. The packet
therefore requires the implementer to MEASURE which of the eight move, name them exactly with
before/after SHA-256, and hand the chair that list — **the chair executes the door ONCE, over the
measured movers only.** Guessing the set is how a one-time re-record becomes two.

The door, by symbol:
```
$ git grep -n "export function recordGolden" -- tests
tests/helpers/goldenRecordDoor.js:238:export function recordGolden({ surface, path, produce, root = process.cwd() }) {
$ sed -n '13,14p' tests/property/generatorGoldenMaster.test.js
 * To regenerate after an INTENTIONAL output change, run:
 *   UPDATE_GOLDEN=1 npx vitest run tests/property/generatorGoldenMaster.test.js
```

## P1-E5 · THE BUDGET — IT FITS, JUST

| Row | Measured | Limit |
|---|---:|---:|
| existing logic files modified | **3** — `src/generators/npcGenerator.js`, `src/lib/saves.js`, and ONE institution/faction minting file | ≤3 |
| new logic leaves | 0 | ≤2 |
| registration-only files | 1 (`scripts/mutation-coverage-manifest.json`) | ≤3 |

⚠ **THREE IS THE CEILING AND THIS PACKET SITS ON IT.** The three convicted readers
(`locksPreservation.js`, `characterDrift.js`, `characterEdit.js`) are a FOURTH, FIFTH and SIXTH
file, so they **cannot** ride here. The packet names them as an explicit follow-on
(`EM-P1b`), which is the smallest honest split: minting the id is one behaviour family, and
re-pointing the joins that read it is another.

Effective lines at the base: `src/lib/saves.js` **619** (ceiling 800, no baseline entry);
`src/generators/npcGenerator.js` is over the 800 generator ceiling and **carries a frozen
`scripts/.size-baseline.json` entry** — the id edit must be shaped at or under net zero there, and
the packet says so.

```
$ grep -n '"src/generators/npcGenerator.js"' scripts/.size-baseline.json
17:  "src/generators/npcGenerator.js": 1345,
$ node -e "…Linter max-lines{skipBlankLines,skipComments}…"
src/generators/npcGenerator.js              -> File has too many lines (1345).
src/generators/steps/assembleInstitutions.js-> File has too many lines (571).
src/generators/density/densityAscension.js  -> File has too many lines (45).
```

⛔⛔ **`src/generators/npcGenerator.js` MEASURES 1345 EFFECTIVE AGAINST A FROZEN BASELINE OF
1345 — ZERO HEADROOM.** `eslint.config.js:89-97` turns each `.size-baseline.json` entry into a
per-file `max-lines: ['error', { max }]` override and `tests/lint/sizeBaseline.test.js` keeps the
map shrink-only, so **the id edit there must be shaped at NET ZERO effective lines** — the same
class as `src/store/settlementSlice.js` (816/816). The mint replaces the existing two-line
`npcs.forEach((npc, idx) => { npc.id = … })` one-line-for-one-line; it does not add a block.
`assembleInstitutions.js` (571) and `densityAscension.js` (45) both sit under the 800 generator
ceiling with room.
