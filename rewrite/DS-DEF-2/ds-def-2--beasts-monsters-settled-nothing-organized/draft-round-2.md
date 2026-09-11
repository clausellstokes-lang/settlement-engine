# DS-DEF-2 · pool `Beasts & Monsters: settled, nothing organized` · REWRITE draft, round 2

Writer: Opus 5 (Fable-unvalidated seat), under the Fable chair. Block DS-DEF-2, role **spine**, three variants in, three variants out, four faces each (the numbered line plus three `[face]` sub-rows).
Paste target: under the annex heading whose bold text reads **`Beasts & Monsters`: `settled`, nothing organized**.
The pool's typed lines (ROLE / READS / RELATION / ATTACH / FORM / MOVE and the block's STATE-KEY, SLOTS, SECTION-TARGET, PROVENANCE + FENCE) are untouched and are not repeated here. No variant is added, removed, merged or reordered; every vid and every angle tag stands exactly as it stands; no `[plain]` marker anywhere.

Written under the CHECKPOINT LAW: the paste block landed first, the notes after it, section by section.

**ROUND 2 CARRIES ONE CHANGE, AND IT IS THE ONE THE GATE NAMED.** The round-1 packet was REFUSED at `scripts/lib/dossier-annex-grammar.mjs assertFaces`: variant 2's three `[face]` rows named `{settlement}` where the parent numbered line named none, and a wording set must say the SAME claim with the SAME fills, so eligibility cannot differ inside it (A6; ARCH §2.5). **Variant 2 is now slot-free on ALL FOUR of its rows** — the parent and the three faces. Variants 1 and 3 are unchanged from round 1 (both already carried `{settlement}` on the parent and on every face, and the gate named no measure against them). See §N.5.1 for the cure, face by face.

---

## THE PASTE BLOCK (the complete replacement for the pool's variant rows)

1. `[ledger]` {settlement} keeps no works and no muster against the country, and the country runs low in beasts.
   - `[face]` The beasts about {settlement} are few, and the town keeps neither works nor muster.
   - `[face]` The town of {settlement} holds no works and keeps no muster, and the country about it is entered as quiet.
   - `[face]` Little comes out of the country about {settlement}. Against that country the town keeps no muster, and no works stand.
2. `[street]` The town stands without works or muster, and what is outside it is quiet.
   - `[face]` The country outside is quiet, and the town facing it has neither works nor muster.
   - `[face]` Beasts are few out in the country. The town has no works against that country and keeps no muster.
   - `[face]` What comes out of the country is little. Against that country the town holds no works and no muster.
3. `[visitor]` A stranger walks out of {settlement} past no works and no muster, and meets few creatures in the country.
   - `[face]` Coming on {settlement} out of a quiet country, a stranger passes no works and finds no muster in the town.
   - `[face]` Neither works nor muster meets a stranger at {settlement}, and beyond the town the country carries few beasts.
   - `[face]` Few creatures meet a stranger in the country about {settlement}. The town in that country shows no works, and keeps no muster.

---

## --- NOTES

### N.0 The card, and the three licensed reads every face carries

The licence card printed in `laneRW-DEF2` (`node scripts/prose-licence-card.mjs DS-DEF-2 'Beasts & Monsters: settled, nothing organized'`) gives one `may claim:` line — that the reader `beastsRowSituation(family, perimeter, force)` selects the row `settled country, neither` of `BEASTS_ROW_POOL` in `defenseStateProse.js`, **as a STANDING fact of the record**. The skeleton (§0.1) resolves that one keyed condition (R-v: the reads of a key are one keyed condition, never a second fact) into its three parts, and those three parts are the whole licensed claim set of every face below:

- **READ 1 — the tier.** `family === 'settled'`, produced by the config token `heartland` through `MONSTER_FAMILY_OF`: the LOW beast-and-raider tier of the COUNTRY (ADDENDUM 13 part A item 4; ENTAILMENT L-2). Stated over the country, never as a totality over the town (W2, C7: DS-DEF-2 carries war on the same page). LOW, never NONE: rendered as `runs low in beasts` · `are few` · `entered as quiet` · `Little comes out of` · `is quiet` · `Beasts are few` · `is little` · `few creatures` · `carries few beasts`. Never "nothing", "safe", "empty", "at peace", "heartland".
- **READ 2 — no works.** `perimeter === false`: no member of the walls bucket stands. Spelled with the class word A-7 licenses of every member (`the works`, `what the town has built`), never "the wall", "the palisade", "the line", "the gate", and never a material (W11).
- **READ 3 — no muster.** `force === false`, where `force = garrison || militia`: no garrison-bucket and no militia-bucket member stands. Spelled with the class word ADDENDUM 13 item 5 ratifies for the paid military (`the muster`), never "the garrison" (W12), never "the militia", never "the guard" (struck), never "the community".

`bag: {settlement}` is the pool's one filled slot (`{band}` is RESERVED, `{route}` has no provider on this block). **A row names it or names nothing, and a face's slot set equals its parent's, exactly** (ARCH §2.5; A6). Variants 1 and 3 name `{settlement}` on all four rows; variant 2 names no slot on any of its four rows. No face opens on the slot (T-F8), and only variant 1's numbered line opens on it at all (wall 10; R-DA-17).

**No citation and no record noun anywhere in the pool.** The card prints `source: muster · standing LICENSED` at the KIND grain, but on every town this pool fires on `force === false`, so no `Citizen militia` stands, the `Muster training` holder resolves to nothing, and the census row prints `holder: null`. Under W24 a read that resolves no holder carries no record word at all: no roll, rolls, books, register, count, accounts. `[ledger]` is a STANDPOINT and licenses no citation (W24); `entered` / `is entered as` is the office's own formula and is permitted (R-vi / W7). The provenance move is therefore a deliberate ZERO on this pool, not an omission.

**No watch word anywhere in the pool** (skeleton §0.2; W13; W20). At town tier every instance of this pool has a required `Town watch` standing, so a face that named or denied a watch would be false on the record; at hamlet/village/thorp no watch row exists at all. The same §0.2 constraint kills "nothing organized", "no organized defense", "no defense", "nobody armed", "no one under arms": the selector consults THREE buckets of seven (walls · garrison · militia), a thorp may carry a `Household levy` in no bucket, and DS-DEF-5's six-bucket key is the one licensed to say no contracted, chartered or arcane body stands (REFERENT §2.1-R). Every face states the two absences the read actually holds and no wider one. No face anywhere in the pool says "nobody" or "no one": a totality over persons is a REFUSED COLUMN on the card, and W22 bars the person referent, so the force absence is written on the class word ("no muster") and never on people.
