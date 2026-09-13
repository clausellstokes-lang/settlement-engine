# DS-DEF-2 · `Disasters & Famine: NO reserves, hospital present` · DRAFT ROUND 1

Seat: WRITER (Opus 5 — Fable-unvalidated), for the Fable chair.
Written under **ADDENDUM 14** (the owner, 2026-09-12): a face is LAWFUL unless it CONTRADICTS the record; silence in the record is permission; "the card does not license it" names no fault.
Under **ADDENDUM 13 as re-cut** (`rewrite/recut/CONTRADICTION-TABLE.md`, the four floors and the 179 contradiction rows) and the **EXEMPLAR PACK** as aim, never as law.

**3 variants rewritten in place, one for one, same vids, same angle tags, none added, removed or merged. 12 faces (4 per variant). 0 refusals.**

---

## THE ROWS — paste under the pool's bold heading, replacing the three shipped variant rows

1. `[ledger]` Against sickness {settlement} has somebody to send for. Against a bad harvest it has nothing put by at all.
   - `[face]` The care for the sick at {settlement} is a door to knock on. The town keeps no food against a bad harvest, and hunger has no door at all.
   - `[face]` No common store of grain stands at {settlement}, and a bad year is met house by house. A sickness is answered from outside the household; a bad year is not.
   - `[face]` Help for the sick is on the record at {settlement} and stored grain is not, so a failed crop falls to private hands and nowhere else.
2. `[street]` The town is better set against the sickness than against the hunger: a house with a fever knows where to go, and a house short of grain does not.
   - `[face]` Sickness here is somebody's work. Hunger has no store to open, and what is done about it is done indoors.
   - `[face]` A sickness here can be paid for. A bad year cannot, and what meets it is whatever the house has kept back.
   - `[face]` A fever in this town gets attended to. A bad harvest is met out of what the houses hold, and what the houses hold is not counted anywhere.
3. `[unfolding]` Everything {settlement} has against a sickness comes when it is called. Everything it has against a bad year sits in the houses, and none of it is held in common.
   - `[face]` The town is arranged against the sickness and not against the hunger, and what {settlement} would open in a hungry year is a question the record leaves standing.
   - `[face]` What {settlement} has against a sickness is skill that can be fetched. What it has against a bad harvest is not kept in any one place.
   - `[face]` Provision at {settlement} runs toward the sick and no further. Grain is not laid in, and a failed crop finds the town exactly as it stands.

---

## --- NOTES

### The two card clauses every face rests on, named once

- **CLAUSE R-H** — the card's `may claim`, the `hospital` limb: *the reader `disasterRowSituation(granary, hospital, church)` selects the row `no reserves, hospital`*, so `compound.inst.hasHospital === true` — **the town holds something that answers sickness.** Its roster body is `Healer (divine, 1st level)` at village and `Hospital network` at metropolis, so every face names the answer as an *answer* and never as a building, a ward, a staff or a scale.
- **CLAUSE R-G** — the same `may claim`, the `no reserves` limb: `compound.inst.hasGranary === false` — **the town keeps no communal grain.** No village row in `institutionalCatalog.js` can set the flag, so the absence is a thing never built, never a ruin, never a loss.
- **CLAUSE B** — the card's `bag`, `{settlement: proper}` FILLED at this block's call site (`defenseStateProse.js:622`). Vid 1 and vid 3 carry `{settlement}` in every face and no face opens on it (T-F8); vid 2 carries no slot in any face, matching its parent exactly.
- **CLAUSE S** — the card's `source: (none) · SOURCE-UNRESOLVED`. **No face names a keeper of a record** (F1-24). `on the record`, `the record leaves standing`, `is not counted anywhere`, `not settled anywhere` are record VOCABULARY with no holder attached; W24's record-word bar is struck and F1-24's holder rule is what is obeyed.

### Per face: the claims, and what licenses each

**VID 1 · `[ledger]` · PRESENT → LACK (V3). Both halves of the key set down plainly, in the clerk's order, landing on the civic thing each names.**

- **1.1** *Against sickness {settlement} has somebody to send for. Against a bad harvest it has nothing put by at all.* — (a) *somebody to send for* ← CLAUSE R-H, the answer stated as a person who can be called, which is true of a divine healer at village and of a hospital network at metropolis alike; no building, no count, no scale, so F1-14 and F2-01 are both clear. (b) *nothing put by at all* ← CLAUSE R-G. (c) *at all* is the licensed extreme of an ABSENCE the roster carries, not of a pay gate, so F4-04's *short, late, thin, never none* is not engaged. Slot mid-sentence (CLAUSE B). 19 words; the short line, carried deliberately as the canonical face at index zero.
- **1.2** *The care for the sick at {settlement} is a door to knock on. The town keeps no food against a bad harvest, and hunger has no door at all.* — (a) *a door to knock on* ← CLAUSE R-H, the answer as an address rather than an institution. (b) *keeps no food against a bad harvest* ← CLAUSE R-G, carried VERBATIM from the shipped `[ledger]` row as the skeleton §1.7 directs. (c) *hunger has no door* ← CLAUSE R-G again, as the passage's thread: the noun *door* is carried forward from sentence one (THE THREAD, MOVE-GRAMMAR §1.4.1; A11's echo bound counts facts, not nouns).
- **1.3** *No common store of grain stands at {settlement}, and a bad year is met house by house. A sickness is answered from outside the household; a bad year is not.* — (a) *no common store of grain* ← CLAUSE R-G. (b) *met house by house* ← silence (floor 1: the record holds no field about where private grain sits, and denies nothing); it asserts no second civic object of class `store`, which the card's `may NOT` bars. (c) *answered from outside the household* ← CLAUSE R-H, the relation stated as a direction rather than a capacity. The ABSENCE opener is lawful: the absence-opener cap (R-ii / W10) is STRUCK by the re-cut's header list.
- **1.4** *Help for the sick is on the record at {settlement} and stored grain is not, so a failed crop falls to private hands and nowhere else.* — (a) *help for the sick is on the record* ← CLAUSE R-H stated in the register of an entry; no holder named (CLAUSE S). (b) *stored grain is not* ← CLAUSE R-G. (c) *a failed crop falls to private hands* ← the consequence the missing buffer IS (`foodGenerator.js:163`), written as a standing capability clause and not as an event (the block's PROVENANCE FENCE); the joint is S2's one computed consequence riding on its own fact.

**VID 2 · `[street]` · PRESENT → CONSEQUENCE landed on a household (V2). Owns the RELATION, and carries no slot.**

- **2.1** *The town is better set against the sickness than against the hunger: a house with a fever knows where to go, and a house short of grain does not.* — (a) the comparison ← CLAUSES R-H and R-G together, and the engine agrees with its direction as a matter of what the town HAS (`stressGenerator.js:174` the healer's ×0.6; `:134` the forgone ×0.5), never of what it has seen. (b) *a house with a fever knows where to go* ← R-H, the great fact landed on a household (EXEMPLAR §6). (c) *a house short of grain does not* ← R-G. The shipped row's `which`-tail, its cross-settlement verdict (*an unusual way round*) and its totality-plus-feeling close (*does not comfort anyone*) are all dropped; nothing replaces them, because each was a claim and not a wording.
- **2.2** *Sickness here is somebody's work. Hunger has no store to open, and what is done about it is done indoors.* — (a) *somebody's work* ← CLAUSE R-H; an UNNAMED person may act (floor 3 as ADDENDUM 14 relaxes it, W22a/W22b struck), and this is not the singular office the tier emits, so F3-06 is clear. (b) *no store to open* ← CLAUSE R-G. (c) *done indoors* ← silence; a place-of-doing, not a civic object.
- **2.3** *A sickness here can be paid for. A bad year cannot, and what meets it is whatever the house has kept back.* — (a) *can be paid for* ← CLAUSE R-H read at the roster row's own description, which prices the service; no figure, so A4 and F2-01 are clear. (b) *a bad year cannot* ← CLAUSE R-G, the reversal that earns the second clause (EXEMPLAR §4.5). (c) *whatever the house has kept back* ← silence; indefinite, so no magnitude.
- **2.4** *A fever in this town gets attended to. A bad harvest is met out of what the houses hold, and what the houses hold is not counted anywhere.* — (a) *gets attended to* ← CLAUSE R-H. (b) *met out of what the houses hold* ← CLAUSE R-G. (c) *not counted anywhere* ← CLAUSE S, the pool's own SOURCE-UNRESOLVED standing written as an honest gap in the record rather than a citation; it is the ABSENCE move's GAP class and the entry's one matter left standing.

**VID 3 · `[unfolding]` · PRESENT → OPEN (V6) and PRESENT → LACK. Owns the SHAPE, with both of the shipped row's histories and its trend clause removed.**

- **3.1** *Everything {settlement} has against a sickness comes when it is called. Everything it has against a bad year sits in the houses, and none of it is held in common.* — (a) *comes when it is called* ← CLAUSE R-H; habitual present, no rate welded to it (F2-06 clear). (b) *sits in the houses* ← silence. (c) *none of it is held in common* ← CLAUSE R-G, the discriminating fact of the pool stated as its sharpest form.
- **3.2** *The town is arranged against the sickness and not against the hunger, and what {settlement} would open in a hungry year is a question the record leaves standing.* — (a) *is arranged against* ← CLAUSES R-H and R-G, the verb carried VERBATIM from the shipped row as skeleton §3.7 directs; it is precisely what a boolean institution presence means and carries no agent and no history. (b) *would open* ← the subjunctive edge (A2, state never fate); no forecast the pulse adjudicates. (c) *a question the record leaves standing* ← CLAUSE S; the OPEN QUESTION move, declarative, never an interrogative.
- **3.3** *What {settlement} has against a sickness is skill that can be fetched. What it has against a bad harvest is not kept in any one place.* — (a) *skill that can be fetched* ← CLAUSE R-H; deliberately neutral between spellcraft and physic, because `magicLicense: 'low'` makes the village row arcane (`arcaneInstitutionIdentity.js:218-219`) while the metropolis row in this pool's preimage is a hospital network; a mundane framing would be false on the one and an arcane framing on the other. No god is named or predicated of (floor 3 / the deity doctrine). (b) *not kept in any one place* ← CLAUSE R-G; the absence of a COMMON store, asserting no second store-class object.
- **3.4** *Provision at {settlement} runs toward the sick and no further. Grain is not laid in, and a failed crop finds the town exactly as it stands.* — (a) *runs toward the sick and no further* ← CLAUSES R-H and R-G as one direction. (b) *grain is not laid in* ← CLAUSE R-G. (c) *finds the town exactly as it stands* ← the capability clause the block's fence licenses, with no elapsed course, no direction of travel and no reading of the situation, so the badge beside it may fall to nothing in play without contradicting the sentence (skeleton §0.7.2, the two-clock hazard).

### The claims DROPPED from the shipped rows, and why each is a claim and not a wording

| dropped | from | ground |
|---|---|---|
| *contain an outbreak* | vid 1 | contradicted by the block's own `Internal Security` row, `no legal infrastructure` on 100.00 % of this pool's towns: nothing here can shut a house or close a road. Floor 1 |
| *can treat* an outbreak | vid 1 | a magnitude outside the read's own band word; the read is a boolean presence. Floor 2, F2-01 |
| *the same season it happens* | vid 1 | a season, named on the card's `may NOT`. Floor 2, F2-02 |
| *which is an unusual way round* | vid 2 | a cross-settlement frequency no field holds, and the `which`-tail is a hard wall besides. Floor 2, F2-09 |
| *does not comfort anyone* | vid 2 | a totality over persons (the card's REFUSED COLUMNS) and a mood (no morale field on `defenseProfile`) |
| *the sickness it has seen* | vid 3 | the block's PROVENANCE FENCE: the clauses here are capability clauses, never historical ones. Floor 2, F2-05. And inverted in fact — the healer LOWERS the plague roll (`stressGenerator.js:174`) |
| *the hunger it has not [seen]* | vid 3 | the same fence, and flatly false under an `Active Famine` banner printed on the same dossier; a village with no granary is the engine's own famine-prone shape (`stressGenerator.js:131`, `:134`). Floor 1 and Floor 2 |
| *nothing in hand is correcting the imbalance* | vid 3 | a direction of travel on the one row of the five whose badge is re-judged every pulse (`foodStockpile.js:389-402`), and *the imbalance* is a gloss naming what the two facts amount to. Floor 2 |

### The vocabulary this pool's neighbours own, and which no face touches

*somewhere to put the sick* and *the sick-house* (the `granary AND hospital` and `NO reserves, NO medical provision` siblings, one echo key away) · *clergy who tend the sick* (the `granary AND parish care only` sibling, and one of the four clauses this block's contradiction set still names as false) · *the two buildings* · *pray and nurse* · *a modest infirmary* · *endure it and count afterwards*. The church is an argument `disasterRowSituation` does not consult on this branch, so no face asserts a church, a priest or prayer in either direction.

### The DULL check, at the pool grain

Twelve renderings, twelve distinct first-four-words (`Against sickness {settlement} has` · `The care for the` · `No common store of` · `Help for the sick` · `The town is better` · `Sickness here is somebody's` · `A sickness here can` · `A fever in this` · `Everything {settlement} has against` · `The town is arranged` · `What {settlement} has against` · `Provision at {settlement} runs`). Lengths 19 to 30 words, sd well clear of a metronome. Three distinct level-1 grammars across the three variants where the census records two, which mends the A11 finding the skeleton names. The care half is met by eight different constructions (*somebody to send for* · *a door to knock on* · *answered from outside the household* · *on the record* · *knows where to go* · *somebody's work* · *can be paid for* · *skill that can be fetched* · *comes when it is called* · *arranged against* · *runs toward*); the grain half by nine (*nothing put by at all* · *keeps no food against a bad harvest* · *no common store of grain* · *stored grain is not* · *a house short of grain* · *no store to open* · *whatever the house has kept back* · *what the houses hold* · *none of it is held in common* · *not kept in any one place* · *grain is not laid in*). No face is a permutation of a sibling and none swaps the halves of one join.

### REFUSALS

**None.** All three variants are written lawfully at four faces each. No variant is banked as a refusal row.

### Mechanical ratchets, checked on the twelve faces

No digit · no em dash · no exclamation · no `which`-clause · no second person · no totality word (`nobody`, `everyone`, `anyone`, `every household`) · no face opens on a `proper`-typed slot · slot sets equal to each parent's (vid 1 and vid 3 one `{settlement}` per face, vid 2 none) · one or two sentences per face · one bracketed angle tag per numbered row, unchanged from the shipped rows, and no `[plain]` marker anywhere.
