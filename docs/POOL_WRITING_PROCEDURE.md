# The procedure for writing a pool (or a table row, or a registry line) under the pool census

> The owner, 2026-11-04: "can you build a scope of procedure for new pool writing for yourself so that it works seamlessly with the system you are now building?" This is that procedure. It binds the chair and every seat that writes a DM-facing line from now on, including the FP volumes and the variety car. Its law is `docs/DESIGN_POOL_CENSUS.md` (the design) and its mechanism is what CENSUS-1 through CENSUS-4 build (`src/domain/facts/factsOf.js`, `factVocabulary.js`, `drawDeclared.js`, the self-check, the two registers, the wiring census's declaration columns). Where this procedure names a piece the census has not landed yet, the piece is named exactly as the design names it, and the procedure holds from the day it lands.

## 0. How a pool was called before, and what changed

Before the census a writer chose a pool by its KEY — the state it is about (`DS-ECO-8 MODERATE`, `UNDER SIEGE`, the institution's kind, the stress type) — and then drew a line from it. The draw itself took one of five shapes: **K** the kernel's hash argmax over the variant id (deterministic, no random roll; the only gate was the `walls` mark); **R** a seeded-stream roll (`rngContext.js :: pick`); **H** a hash modulus (`proseHash.js :: pickVariant`); **T** a table lookup with no draw; **A** a whole list printed. Three channels refused a wrong line after the fact: the kernel's mark channel (walls, F10), the twin tables (a text-keyed swap after the draw), and the drop gates (hooks removed from the record). None of them shared a declaration, and most sites asked the town nothing beyond the key. That is the one fault the ladder kept finding: a pool is chosen for what it is ABOUT, but a line also PRESUMES facts the key does not guarantee, and nobody checked those.

What changed: every line declares its presumptions as atoms; one draw function checks each atom against the record's one reader; a line the record contradicts is never drawn; at birth every drawn line's atoms are re-asserted and a false one fails certification. The pool key still says what the pool is about. The declaration says what each line needs to be true.

## 1. Before you write: the surface, the key, the draw kind

1. Name the SURFACE the line prints on (Overview, Tonight, Crisis, Economics, Resources, Power, Defense, Faith, Daily Life, the NPC sheet, the institution description, the journal, the chronicle) and the POOL KEY (the state the writer selects by). Look the key up in `docs/content/wiring-census.json`: if the pool exists, you are adding lines to it, not writing a pool.
2. Choose the DRAW KIND. New prose goes in the kernel family (K): the annex `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` (or the decree / causal / connective annexes), projected by `npm run gen:dossier-prose`. A list goes in a data table (A: filtered, never drawn). A registry entry (an NPC goal, a secret, a cast reason) goes in its registry with a `tags` field. You do NOT add a new seeded (R) or hash (H) draw site: those exist only where they already exist, and every one of them calls `drawDeclared`.
3. Decide whether the pool can print CALM under a crisis. If any line in it would read wrong under a siege, famine, plague, occupation, succession void, debt, migration, war, raiders, insurgency or schism, the pool is `{crisis-scoped}` and every line in it must say which crisis families it is sayable under (`crisis: threat | hunger | succession | unrest | any`). A pool that is not scoped is drawable under any crisis — so do not leave a calm-sounding pool unscoped.

## 2. Facts first: an atom needs a home

Every fact a line presumes must be an ATOM in `src/domain/facts/factVocabulary.js` with a READER in `src/domain/facts/factsOf.js` (the live roster, one reader per fact). The vocabulary today: walls, gate, palisade, watch, militia, garrison, soldiers, hospital, healer, temple, priest, market (permanent / periodic), water (coast, river, navigable — the reader's values; `port` from the trade-route reader; `lake` only if the record carries it), trade route kind, tier and population band, terrain class, magic (functions / level), faith presence, crisis kind and family, criminal structure, food state (band, famine, stores in months, granary), the food sources (fish, grain, game, livestock), imports / exports, migration direction, war state, institution presence (`institution: mill | smith | bathhouse | docks | quarry | mine | tavern | school | …`), ruler kind, culture, other-NPC.

- If the fact you need is on that list, declare it. If it is NOT, STOP and home it first: one reader on the record, red-first, every competing reader retired to it, the births it moves counted (`docs/CENSUS_1_LANE_2026-11-04.md` is the worked example). Never read the fact with a regex at the writer, never with a name test, never from a config list the record also carries.
- Climate and season have NO record field. A line may not presume winter, harvest time or the rains. If you need one, that is new capability (a record field), the owner's call, and the line waits — in the undeclared-lines register under "needs a field", which is the QUEUE for new facts: a field is added to the record when enough lines wait on it to be worth a home, never because a list of nice facts says so. (2026-11-05: technology level joined season and climate there — the printing house's "(if technology exists)".)
- The vocabulary is DEMAND-DRIVEN. An atom enters it when a line presumes the fact and the record has a home for it; an atom no line presumes is not added, because a record field nobody reads is a fact nobody can contradict and nobody can trust. The homed set on 2026-11-05 (CENSUS-1 through 1c, 3b, 4b): the fourteen homes (crisis kind and family, stores months, walls / gate / watch / militia / garrison / hospital, water, market, famine, magic, ruler kind, migration direction, war state, institution presence, population band, terrain class, other-NPC) plus the delegated getters (tier and population band, trade route, culture, food sources, imports / exports, crime, faith, soldiers / commander / mercenary / priest, prosperity) and two composites defined once (`guardPresence`; `guild`).
- `walls` means the town's perimeter. A building's own walls (the caravanserai's courtyard, the foundling home) declare nothing.

## 3. Write the lines

The register (the house voice, as the rung records and the chair's reads have enforced it):
- Concrete, short, in the record's own words: a thing a DM can say aloud. Not management prose ("convert governance instability into a restoration of prerogatives"); not a rule ("viable above 5,000 souls"); not the generator's self-check ("X exists but lacks access to Y"); not a count that another line can contradict.
- The tier noun through `speakTierNoun` (never "town" for a thorp); the settlement, faction and institution names through their slots; no slot that can fall back to "someone" at a sentence start (`narrativeProse.js :: fillSentenceSlots` is the sentence-case guard, not a licence).
- Nothing the record cannot hold: no walls, gate, watch, garrison, market, river, sea, mill, temple, famine, siege, winter, second person, unless the line DECLARES it.
- One claim per line where the instrument families read it: a line that says the place is safe, fed, calm or prosperous is a crisis-scoped line.
- Repetition: a pool needs enough lines that the same sentence does not print twice on one page (X-50 is a defect); the FP's variety rule (the owner's 14:12) governs how many is enough.

The declaration, per line, in the tag slot the projector already reads — `[angle · atom · atom]` — or as the sibling column on a table row (`{ text, needs: [...], excludes: [...], crisis: [...] }`), or as `tags` on a registry entry:
- `needs: X` — the record must hold X. `excludes: X` — the record must not. A band: `tier: ≥ town`, `stores: < 3 months`. The crisis dimension (the one spelling table, `docs/census/VOCABULARY_RULINGS_2026-11-04.md` §1): `crisis: any` = sayable in every condition; `crisis: siege, famine` or `crisis: hunger, threat` = sayable only when one of these is active; `needs: crisis` = presumes some crisis is active; `excludes: crisis: hunger` = calm about one family; `excludes: crisis` = calm, full stop — which is also what silence means in a `{crisis-scoped}` pool. Under several active crises the gate takes the DISJUNCTION (corrected 2026-11-05 by the chair, R-H, after CENSUS-2b caught the contradiction in the rulings' §1): a line is admitted when at least one crisis it declares is active, refused when any active crisis is one it `excludes`, and a calm line (or silence in a scoped pool) only with no crisis active — a line vouches for what it declares and for nothing else, so it never has to enumerate every co-active crisis. `crisis: K` on a line therefore already means "one of K must be active" in every pool; there is no separate `needs: crisis: K` spelling. A composite atom (`guardPresence` = watch, garrison, militia or a hired company) exists only when the vocabulary module names and defines it; a line never composes atoms itself.
- Atoms are ATOMIC: "a walled market town" is `walls`, `market`, `tier: ≥ town` — never a combined word.
- Atoms the pool KEY guarantees go on the pool heading, once (`#### pool UNDER SIEGE {crisis: siege}`), never on its lines.
- A pool whose lines presume nothing is ruled `{colour}` at pool level. "Nobody declared it" and "it presumes nothing" are different states; the undeclared-lines register tells them apart and only shrinks.

The twin rule (corrected 2026-11-04 ~23:35, `docs/census/VOCABULARY_RULINGS_2026-11-04.md` §5): write a TWIN beside a line that `needs` a fact most places lack ONLY where the gate would otherwise leave the slot empty or the pool thin for most births — the same angle and length with `excludes` of that fact ("…decided outside the hall rather than inside it"). A single rare line in a rich pool needs no twin: the gate refuses it and the other lines serve. A twin is an ADDITION and moves about 1/(n+1) of the births that can read the pool; the gate alone moves only refused winners. Every twin is quoted in the lane doc as the chair's recorded ruling (the owner's to veto after the fact), with its share.

## 4. Project, census, registers — in ONE commit

1. `npm run gen:dossier-prose` (the leaves under `src/data/dossierStateProse/*.generated.js` are NEVER edited by hand) and `npm run gen:dossier-prose -- --check`.
2. The wiring census re-taken through its own door in the same commit (the projector refuses a stale census; the scratch-projector bypass is over — if it refuses, re-take the census, do not bypass).
3. The undeclared-lines register (`tests/lint/undeclaredLines.register.json`) must not grow: a new line is declared or its pool is ruled `{colour}`. The crisis-scoped register grows only by a pool you opted in, with a note.
4. A contract test refuses an unknown atom word; if it reds, you misspelled the atom or you need to home a fact (§2).

## 5. Prove it, red-first, then the soak

1. A pool test that births the seeds where the atoms differ (one with the fact, one without; the chair's reads name seeds by number: `soak1k-24`, `-8`, `-22`) and asserts the line prints only where the record holds the facts, and the twin prints where it does not. Fixtures hand-trimmed from the births.
2. The self-check: `cert:false-presumption` is a certification failure. Run the 60 (`node scripts/audit/soak-review.mjs --count 60 --workers 4 --out artifacts/<lane>-after`): it must read 0, every `coh:*` class 0, certification 60/60; then the 1,000 once at the end of the lane. `declared-share` for your surface is reported in the lane doc.
3. A draw site you touched keeps its roll count: a seeded or hash site draws over the full pool and resolves after; prove byte-identity on sixty seeds where nothing is refused.

## 6. Records

A line that is refused by the gate, or a twin, moves births; count the golden rows by cause and list them. A lane takes no signed record; the landing writes one record per cause from a staged tree (`docs/shift-records/README.md`). Every new DM-facing sentence is quoted in the lane doc under "new lines"; the owner has delegated the veto and reads them after the fact.

## 7. Never

- Never edit a generated leaf, a register, a census or a pin by hand; never bypass a freshness check in a committed tree.
- Never gate a line with a regex at a writer, a name test, or a per-site read; the gate is `drawDeclared` and the reader is `factsOf`.
- Never declare a combination; never declare climate or season; never let a building's walls read as the perimeter.
- Never add a draw site; never change a roll count; never widen a seed pin without a measured reason.
- Never print validator text, rule text, a legend or a tag as prose on a DM surface.
- Never leave a calm-sounding pool unscoped under the crisis dimension.

## 8. The one-screen checklist

1. Surface + pool key named; the pool exists or is new; draw kind K / A / registry.
2. Every presumed fact is an atom with a home — or STOP and home it.
3. Lines in the house register; tier noun, slots, no fallback at sentence start.
4. Each line declared (needs / excludes / bands / crisis); key atoms on the heading; `{crisis-scoped}` or not, decided; `{colour}` ruled if nothing is presumed.
5. A twin only where the gate would leave the slot empty or the pool thin for most births (§3, §10); each twin quoted with its share.
6. Projected; `--check` green; the census re-taken in the same commit; the registers not grown.
7. Red-first pool test on named seeds; the 60 reads 0 `cert:false-presumption`, every `coh:*` 0.
8. Rows moved counted by cause; the lane doc lists the new lines.

## 9. A worked example

A new DS-ECO line for a river town under a trade crisis:

```
#### pool TRADE CHOKED {crisis: any}   ← key atoms on the heading; the pool is crisis-scoped
3. `[visitor · water:river · market]` The quay at {settlement} is stacked three deep with goods no barge will take, and the market stalls have stopped haggling.
3b. `[visitor · excludes:water · market]` The yard at {settlement} is stacked with goods no cart will take, and the market stalls have stopped haggling.
```

Line 3 needs a river and a market; 3b is its twin where there is no water. The pool heading says every line is sayable under any crisis (the pool exists only in a crisis). The test births a river town and a hill town under the same crisis and asserts 3 on one, 3b on the other, and neither on a town with no market. The commit carries the annex, the projected leaves, the census, the test; the lane doc quotes 3 and 3b with the twin's share.

## 10. The mute-slot census and the gap lines (added 2026-11-05, the owner's ask: "if some facts or combinations have nothing to word to, write it in")

A slot is MUTE for a birth when every line of its pool is refused by that birth's facts (or, in a `{crisis-scoped}` pool, when every calm line is refused by an active crisis and no line declares that crisis). A mute slot is the census's own creation: before the census the slot printed a false line; now it prints nothing. Nothing is better than false, and a gap line is better than nothing — but only where the gap is real and the record holds something to say.

1. MEASURE FIRST, ON THE COMPOSED TREE. Mute slots can only be counted once the surrounding lines declare, so the census runs at the compose, never per lane: for every pool and every birth of the 1,000, the drawn line or `mute`, by pool × the condition that muted it (the refused atoms, or the active crisis), with the share of births. The economy desk's scan is the pattern (`docs/census/declarations/_mute_scan.mjs` and `_mute_diff.mjs`, CENSUS-3b); the compose generalises it to every desk and every wired draw site, and the result is a table in the compose record: pool · condition · births muted of 1,000 · the surface's other lines that speak to that condition, if any.
2. THE FILL RULE, numeric. A slot mute in 1 in 100 births or more gets a line (the owner's wording bar, applied to silence); a rarer slot may stay silent ONLY where another line on the same surface already speaks to that condition (name it in the record) — the silence then reads as the page's choice, not a hole. Never a re-key to make a slot fill: a key change moves every birth.
3. WRITE THE LINE under §3 — the house register, the record's own words, one claim — and DECLARE it with exactly the atoms the condition names (`crisis: famine` + `stores: < 3 months` for a food pool's famine slot; `excludes: walls` for the walls twin). A gap line is a twin or a fallback under §3's rule and is recorded as the chair's ruling with its share (about 1/(n+1) of the births that can read the pool); the register does not grow for it.
4. A COMBINATION IS NOT A FACT. Where the scan shows a slot mute only under a PAIR of conditions (a famine under a siege; a walled thorp with no gate), the line declares both atoms atomically and nothing more; it never declares a composite word for the pair. If the pair is rare (under 1 in 100), the twin rule's silence applies.
5. NO PROSE FOR A FACT THE RECORD DOES NOT HOLD. A slot that could only be filled by presuming a season, a climate or a technology level stays mute and the pool is listed under "needs a field" with its count of mute births; that count is the queue's ranking for the owner's new-capability call (§2). A gap line is never a way around a missing field.
6. ORDER. The compose runs the census (1), fills the slots the lanes already own (2–5, one commit per pool, counted), re-takes the wiring census and the registers in the same commits, then runs the rung. A slot that reappears at a later rung is a new gap, measured again — the census is re-run at every compose, never carried forward as a list.

The worked example of §9 is also the worked example here: line 3b is the gap line for the no-water slot of TRADE CHOKED, written because the scan would show that slot mute in most inland births.

