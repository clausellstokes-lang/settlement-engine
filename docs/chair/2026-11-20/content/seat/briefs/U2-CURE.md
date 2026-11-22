# U2-CURE — the chair's rulings on U2's three stops, built (CS6). Builder B2c. Read `briefs/COMMON.md` (all of it) and `briefs/U2-TABLE.md` and U2's own report `briefs/U2-REPORT.md` (on `origin/lane/seat-2026-11-20-u2`) first.

**Where you start.** U2 is built at `0ab034531` (`origin/lane/seat-2026-11-20-u2`). Read its diff whole (`git diff fd5323d05 0ab034531`). Your branch: `git checkout -b lane/seat-2026-11-20-u2-cure 0ab034531`, then `npm ci`.

**The chair's rulings (09:26Z; each vetoable by the owner):**
1. **Bytes:** recorded as OWED by SEAT-2 in the hand-back. You re-record nothing and buy back nothing. Do not split the table: CS6 keeps ONE home.
2. **`factionCompetition.js` at its 800-line `max-lines` ceiling: the report's option (ii) is APPROVED.** `GOVERNMENT_BY_ARCHETYPE` moves out of `factionCompetition.js` into `src/domain/seat/seatTable.js`, as the OLD law's competition id per archetype, read through the one table (one home). Then land the HELD step from U2's report: a NEW faction state's `governmentPreference` under the seat law takes the table's family; under the old law it takes exactly today's id; `faction.governmentPreference ||` still comes first; `pick(local, GOVERNMENT_PREFERENCES)` stays the last fallback. No size-baseline row, no reformatting to save lines, no two imports on one line.
3. **`writerReach`** is re-recorded by SEAT-2 at the merge. Not yours.

**One cure of my own (SEAT-2):** U2's report notes that under the law a HIDDEN non-criminal power's stated preference would read "criminal shadow rule", because the kind reader reads a veiled row as criminal first. That veil-first rule is the CONTEST's: it keeps a hidden power out of the field. A stated preference is not the contest, and a non-criminal power must never be worded as criminal. So the competition step reads the power's OWN kind, with craft read as craft, WITHOUT the veil-first rule: a hidden non-criminal power keeps its own kind's family, and a criminal power still reads criminal. Build it as one named read beside `contestKindOf` in the one table, without a second spelling of the kind logic. Example: an option, or a split of the veil step from the kind step. Name the choice in your report.

**Files you own:** `src/domain/seat/seatTable.js`; `src/domain/worldPulse/factionCompetition.js` (only the move and the held step); `tests/domain/seat/seatTable.test.js`; `docs/chair/2026-11-20/content/seat/briefs/U2-REPORT.md` (append a section "CURE", do not rewrite the rest). `scripts/.domain-any-baseline.json` (or wherever the any-cast baseline lives: find it) is NOT yours. SEAT-2 lowers it at the merge. Say in your report by how much, and which file.

**Red arms first** (in `seatTable.test.js`):
- (a) For EVERY archetype, the old law's id read through the one table equals the id `GOVERNMENT_BY_ARCHETYPE` held at `0ab034531`. Pin each as a literal: copy them from that commit, do not derive them.
- (b) `ensureFactionStates` (or whatever sets `governmentPreference` for a new state: read the file) under the OLD law gives today's id for every archetype. Under `_seatLawVersion: 2` it gives the table's family: craft `guild_charter`, outsider `foreign_administration`, occupation `occupation_rule`, and the born Craft Guilds (category `economy`) `guild_charter`. A stored `faction.governmentPreference` wins under both laws.
- (c) A hidden non-criminal power (`hidden: true`, a non-criminal category) under the law takes its own kind's family, never the criminal one. A criminal power takes the criminal family. Hidden-and-criminal reads criminal.
- (d) A town-size case among the born arms (COMMON).
Record red then green counts in your commit message.

**Greens:** your arms; every test file naming `rulingPower`, `factionCompetition` or `seatTable`; `tests/architecture/layerBoundaries.test.js`; `tests/architecture/engineCoreLazyEdge.test.js`; `tests/lint` whole, green but for the two census arms, `writerReach` (SEAT-2's) and the any-cast baseline if it reds on the shrink (SEAT-2's): confirm each of those by name; `npm run typecheck:ratchet`; `npm run typecheck:domain:strict`; `npm run lint`. `factionCompetition.js` must be at or under 800 lines: say its count.

**Hand back** in at most 250 words: your commit, red → green per arm, `factionCompetition.js`'s line count, the any-cast delta, the choice for (c), what you did NOT do, CONFIRMED vs PLAUSIBLE. Do NOT push.
