# L2's 14 importer reds: a cure proposed for each (PAGE-6's builder, 2026-11-20; no edits made)

All 14 are red only with L2: every one was green with the two data files at eb5fedd13. A = a count or shape pin. B = a seed-pinned anchor. C = a content law broken.

**PROBE 1 (B):** I ran a scratch copy of 324e95796 with only the positive or liveness half of each B arm removed. Every forbidden ("gone") assertion still held, for every MUST NOT, CURED and anchored row. So each B red is the anchor moving, not a law broken. The cure is to re-key each one BY CAUSE (the files' own "RE-KEYED BY IDENTITY"): pick a census seed where the guarded fault still stands and the sibling prints, or compute the anchor from the record or the pool export. `tests/helpers/drawnProse.js` cannot compute these anchors: it follows `stateProseKernel` draws, and arrival beats draw by `pickRandom` on the 'arrival-scene' substream.

**PROBE 2 (C):** I ran a second scratch copy with the C cures below applied. Results:
- bar4ScenePresumption: 0/720 findings.
- narrativeArrival: green.
- arrivalPoolsDeepened: green.
- Measure on the 300: share still 14.2%; other fields moved 0/300.

These cures re-draw some towns, so the B list must be re-keyed after them, not before.

**C cures (data, append-only, no line moved):**
- **Fish dominant NEW [6] "Talk…turns to fish", [7] "A gutting knife…", [8] "Even the dogs…" (7 of the 10 A1 findings).** Add `needs: ['trade at work: fish'], excludes: ['crisis: hunger']`, as sibling [4] "Barrels of salt fish…" declares. The `needs` alone left 3 findings, the famine's "Scarce in the famine." landings.
- **Arcane dominant NEW [7] "Sigils…" (r2s-religious_conversion-town-2).** Add `needs: ['trade at work: arcane']`, as sibling [2] "The air prickles faintly…" declares. NEW [8], [9]: same risk, same declaration (in the probe).
- **Livestock lines NEW [7] "Someone leads a single beast…" (r2s-recently_betrayed-hamlet-2, grazing "Short of livestock.").** No vocabulary atom covers this (`trade at work` has no livestock key). The proposal is `{ text, colour: true }`, as "The smell of horses and hay comes from the stables." is marked. The pool is not crisis-scoped, so dropping `crisis: ['any']` changes no reach. This is a judgment call (does one beast presume nothing?), the chair's to make. NEW [5] and [6], and smiths NEW [8]–[10], carry the same risk, undrawn so far.
- **Port NEW [6].** Change to "The last stretch of road into {name} runs **beside the sea**, and the sound of the surf…". The test's maritime word list: `harbou?r|sea|salt|masts?|gulls?|quays?|coast|port`.
- **Port NEW [8].** Change to "Boats ride at their moorings **in the harbour** below {name}…". The line already needs docks, and its words now match the harbour pattern: `harbour|quays|masts|dock crews|chandlers|working port`.
- **River NEW [6] (the chair's line).** Change to "Trees lean over **the river** on the way into {name}…". The riverside port reads `\briver|barge|waterfront|quay|dock\b`; base lines [0]–[3] all satisfy it.
- **River NEW [5].** Same pattern, not yet drawn: change to "along the **riverbank**".

| file | rule (the assertion) | class | cure |
|---|---|---|---|
| tailHistoryBatch1 | Y4 KEEP `expect(/notice of the next fair\|Porters…/.test(arrivalText(town))).toBe(true)` | B | re-key 3 KEEP seeds |
| tailHistoryBatch4 | MUST NOT `toMatch(instead)` then `not.toMatch(gone)`; KEEP `toMatch(KEEP[i][1])` | B | re-key 3 MUST NOT and 1 KEEP; gone holds |
| tailHistoryBatch6 | `expectAbsentWithAnchor(…, gone, instead)`; KEEP `toMatch` | B | re-key 7 and 4; gone holds |
| w2FixData12Rows | `toMatch(WINE)` (r2r-town-2); forge `toMatch(/The hammering…\|The clang…/)` before `not.toMatch(LIVES)` | B | re-key 1 and 2 |
| textOf | `rows.filter(object).length).toBe(244)` | A, a count only | re-pin to 284, or 290 after the C cures (6 bare lines become objects) |
| arrivalHarbourDocks (shape) | non-harbour rows `toEqual(['coast'])`; `toHaveLength(2)` | the law is C (moorings words, cured above); the count is A | re-pin the length to 4 |
| arrivalHarbourDocks (thorp) | opener `toMatch(/comes down to the sea\|face to the open water/)`, then `not.toMatch(HARBOUR)` | B | compute the opener from the port rows needing only `coast`; no harbour opener still holds |
| arrivalIndebtedDistrictTwin | D1 `toBe(REST[seed])`, a literal of the scene's later beats | B | recompute the 2 REST strings; no district and the twin present still hold |
| bar2PlacesRows | `toMatch(instead)` / `not.toMatch(gone)` | B | re-key 2 |
| bar3PlacesRows | the same, plus KEEP `toMatch(kept)` | B | re-key 5 and 3 |
| bar4ScenePresumption | A1: the detector finds nothing over the 720 | C | the fish, arcane and livestock declarations above |
| bar8Scenes | `pool()[pool().length-1]).toBe(slow())` | A, an accident | The twin order law (`twinsOf → [noSign, slow]`; "the LAST admitted twin answers", arrivalScene.js) still holds. "Last in pool" only recorded the append. Re-pin as `pool().indexOf(slow())` = 6 |
| narrativeArrival | `toMatch(maritimeTerms)`; riverside `toMatch(/\briver…/)` | C | port [6] and river [6] words, above |
| tailNarrativeRows | B5 KEEP or anchor, 2 rows | B | re-key 2; gone holds |
| w2FixDataHistoryItems | `expectAbsentWithAnchor(arrivalScene, w, PRINTS[seed][1])` | B | re-key the 3 arrival anchors |
