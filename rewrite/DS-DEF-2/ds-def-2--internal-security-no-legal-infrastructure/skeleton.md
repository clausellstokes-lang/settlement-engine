Seat: MARKER (opus), DS-DEF-2 · pool `Internal Security: no legal infrastructure` · the skeleton the writer drafts from; nothing here is a face.

# DS-DEF-2 · `Internal Security: no legal infrastructure` · SKELETON

Three shipped variants, vids 1 to 3, angles `[ledger]` `[street]` `[visitor]` in that order. The rows below are the annex's (`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` lines 2675 to 2678) and the generated leaf carries the same three texts with the same vids, angles and slot sets (`src/data/dossierStateProse/defense.generated.js:774-797`; the pool's manifest row at `:1274-1288` reads `role: spine`, `variantCount: 3`, `faceCounts: [1,1,1]`, `vids: [1,2,3]`, `readsCount: 2`, `attach: []`). The writer rewrites these three, one for one, and gives each its four `[face]` sub-rows.

⚠ **THE SLOT SETS ARE NOT UNIFORM ACROSS THIS POOL, and that is a wall.** Vid 1 and vid 3 carry `{settlement}`; **vid 2 carries NO SLOT AT ALL** (`"slots": []` at `defense.generated.js:788`). A face's slot set must equal its parent's (ARCH §2.5's face-row refusals), so **vid 2's four faces never name the town**, and vid 1's and vid 3's four faces each carry `{settlement}` exactly once. A face that adds the town's name to vid 2, or drops it from vid 1 or vid 3, is refused by the projector before any reader sees it.

**THE TEST THIS PACKET IS MARKED UNDER (ADDENDUM 14, the owner 2026-09-12).** A face is LAWFUL unless it CONTRADICTS the record. Silence is permission. "The card does not license it" is not a finding and the tag `unlicensed` does not appear anywhere below. Claims are tagged SAFE, CONTRADICTED (with the field, file and line, and which of the two is the record) or FLOOR-2.

---

## 0. What the writer reads before the first word

### 0.1 The licence card, printed this session in the dock (`node scripts/prose-licence-card.mjs DS-DEF-2 'Internal Security: no legal infrastructure'`)

```
LICENCE (block DS-DEF-2 · role spine · key `Internal Security: no legal infrastructure`)
  reads:      court   (not-produced)
              prison   (not-produced)
              (absent ⇒ no candidate; a modifier is silent, never "false")
  predicate:  (none recovered: the pool has no key-function branch)
  bag:        {band: RESERVED, route: proper, settlement: proper}
              FILLED at this block's call sites: {settlement}
  relation:   (a spine takes no relation)   ← a spine IS the seat and carries no relation
  seat/form:  (not a seat-taker) / sentence      move: (none declared)     angle: ledger street visitor
  attach:     (empty: a spine takes no attach set)
  echo:       spine mounts 1 (tabs: defense) · modifier mounts 0 (none)
              the echo table is keyed on the PRODUCER-TOKEN ROOT `court`, which is coarser
              than this pool's own read `court`: a mount counted there may be reading a
              sibling field of the same root
  covert:     no
  source:     (none) · standing SOURCE-UNRESOLVED
              NO citation is licensed: a face naming a record holder here is refused by arm A13
  THE TEST (ADDENDUM 14, the owner 2026-09-12): a face is LAWFUL unless it CONTRADICTS the record.
              SILENCE IN THE RECORD IS PERMISSION. "The card does not license it" is NOT a finding.
              This card says what the read REACHES, never the bounds of what may be written.
  may claim:  that `court` holds, as a STANDING fact of the record
  may NOT:    a magnitude outside the read's own band word (floor 2a), an elapsed course, a
              dated cause or a season (floor 2b), a prediction the pulse adjudicates (floor 2b)
  audience:   player (no mark)
  REFUSED COLUMNS, always: a totality over persons; an exemption from a duty (whoIsExempt is
              null everywhere); a named character and that character's fate (product scope);
              a theological claim about a deity (the deity doctrine)
```

⚠⚠ **THREE CARD LINES ARE NARROWER OR LOOSER THAN THE CODE, and the writer must know all three before the first word.**

1. **`predicate: (none recovered)` is a census artefact, not a gap in the world.** Row 3 of this block is the ONE row of five that is deliberately not tabled (`defenseStateProse.js:369-377`), so the census recovers it on rung 1 from the branch's own fields instead of from a table label. The predicate is exact and it is a CONJUNCTION OF TWO NEGATIVES: `internalRowPoolKey(court, prison)` returns this key only on its final `return prison ? … : 'Internal Security: no legal infrastructure'` (`:506-510`), i.e. **`court === false` AND `prison === false`**. Both reads are consulted; neither is a silence.

2. **`may claim: that `court` holds` is the card's generic phrasing and is the wrong polarity here.** What this key holds is that `court` does NOT hold and `prison` does NOT hold — two measured negatives over two CLOSED KEYWORD SETS, not an absence of information. See §0.5.

3. **`source: (none) · SOURCE-UNRESOLVED` is accurate and it is a real bar.** Both `court` and `prison` are marked `not-produced` on this card: the holder table mints `court` as a producer token for the SEAT's records (`holderTable.js:214-223, 325-329` — the govMultiplier, the blocs, the treaty terms, the courthouse service row), and the census does not resolve either of this pool's two reads to a holder for this town. **No citation is licensed in any face of this pool.** A face that writes "the roll shows", "by the reeve's account", "on the parish register" is naming a holder and is refused by arm A13. Record VOCABULARY is not a citation and is free: what is on a list, what is written down, what nobody wrote down.

### 0.2 The block's header lines (annex lines 2568 to 2593, the parts that bind this pool)

- **STATE-KEY:** five fixed rows (`Beasts & Monsters` · `Invasion & War` · `Internal Security` · `Economic Survival` · `Disasters & Famine`), each with a `scoreBand` badge (`STRONG` / `ADEQUATE` / `WEAK` / `CRITICAL`) rendered beside the prose, read against `config.monsterThreat`, the institution presence flags and `compound.inst`. **This pool is row 3's fourth branch.**
- **SLOTS:** the block declares `{settlement}` `{band}` `{route}`. See the wall above: this pool's three parents are NOT uniform and each face inherits its own parent's set. `{band}` and `{route}` are unfilled at this block's call sites.
- **SECTION-TARGET:** `defense`.
- **PROVENANCE + FENCE (the block's own, quoted in substance):** the `buildThreatAssessment` lattice is dossier-native and this shape EXTENDS it rather than replacing it; the corpus's job is that each branch currently holds exactly ONE string, so every settlement in a branch says the same words. **Institution presence is a STANDING fact with no recorded history; the causal clauses here are CAPABILITY clauses (what the arrangement cannot do) and never HISTORICAL ones (what the town abolished, lost, never built or was refused)** unless the history surface supplies the ancestry. It does not here. The two named standing defects (the `plagued`+nothing lowercase lead; the walls presence check) belong to row 1 and do not reach this pool.
- **Composition fences:** a SPINE, sentence form, no relation and no attach set, ONE spine mount on the defense tab and ZERO modifier mounts today. The spine is therefore FIRST in its composed unit and chooses nothing that follows it. The echo key is the producer-token root `court`, which is coarser than this pool's read, so a mount counted against it may be a sibling field of the same root and never a second print of this sentence.

### 0.3 The register card's six one-line registers (the dossier line is this pool's)

- The dossier: the record itself; the clerk's third person; the six shapes of its closed set; the town's name is not the default opener.
- The NPC ladder: read aloud to the players; role-bound; never a named interior; the stage licenses the claim, never the shape.
- The Herald: the estate's one quoted in-world voice; report mode; flattest where hottest; the bill lands apart from the deed.
- The chronicle: a borrowed body of headlines; its own prose is frames and dressings; the quiet year is one sentence of varied shape.
- The DM page: candid; the why only from a typed field; second person to the referee alone; it grades, never hedges.
- Chrome and the docent: never the archivist; the product speaking to the person who runs it; mechanics first, one term per thing, the label as the only emphasis.

### 0.4 The owner's rules that bind every face, restated once

Four wording faces per semantic variant, each a different vocabulary or rhythm inside the voice, never a paraphrase of its sibling. Never trim (Part B §22: the counts only rise; a face that fails the gate stays in the annex as a refusal row with its measurement). An unweighted seeded roll picks the face at render, so every face must stand alone. The exemplar, not the practical. No em dash, no exclamation mark, no digit or percent in a connective, no which-clause. The clerk who was there, compiling from records, citing a holder only where the card licenses a source — **and here it licenses none**.

**THE THREAD (MOVE-GRAMMAR §1.4.1).** This pool is a SPINE and sits first. Every face must hand a noun forward that a later modifier could pick up (the wrong, the dispute, the roll, the hall, the elder, the town's own settlement of things) and must close on a standing fact rather than a set-up. There are zero modifier mounts on this pool today, so no sibling text is guaranteed to follow; the face must read as a complete unit alone AND as an opener.

**THE DENSITY LAW (Part B §21.4).** Compression and idiom that reward the reader are part of the ceiling. "Unclear" is not a finding unless a law is broken. Do not trade density for plainness.

### 0.5 The reads this pool reaches, resolved — MATERIAL A WRITER MAY USE, never a bound on what may be written

The key function is four lines and this pool is its last (`src/domain/display/stateProse/defenseStateProse.js:506-510`):

```
export function internalRowPoolKey(court, prison) {
  if (court && prison) return 'Internal Security: full legal chain (court AND prison)';
  if (court) return 'Internal Security: court without detention';
  return prison ? 'Internal Security: detention without process' : 'Internal Security: no legal infrastructure';
}
```

The caller fixes the two arguments (`defenseStateProse.js:620, 657-659`):

```
const compound = settlement?.economicState?.compound?.inst || {};
…
internal: rung(internalRowPoolKey(
  civicFlag(compound.hasCourtSystem), civicFlag(compound.hasPrison),
)),
```

and `civicFlag(v)` is `v === true` (`:309-311`) — strict, never coercive.

| read | what it holds on this key | where it comes from | what it puts in a writer's hand | what the record can deny about it |
|---|---|---|---|---|
| `compound.inst.hasCourtSystem` === **false** | no member of a CLOSED FIVE-WORD SET is on the roster: `courthouse` · `court buildings` · `democratic assembly` · `city hall` · `town hall`, matched as SUBSTRINGS over the institution's native semantic name (`priorityHelpers.js:55`, via `getInstitutionNames` at `:41-55` and `hasAny` at `:25-26`) | the roster at GENERATION (`safetyProfile.js:26` `getInstFlags(config, institutions)`, stored as `compound: flags` at `:688`) | **the absence is of a BUILDING and a MEETING PLACE, not of judgment.** No courthouse, no borough court, no assembly of citizens, no hall the town meets in. The block's own contradiction set says the flag's positive form "is every town and city from a meeting hall (a civil arbitration is recorded, a criminal trial is not)" — so its negative form is the absence of that hall, and nothing more | **it is NOT "no law", "no judge", "no authority" and not "nothing written down".** **Six** governance rows at the small tiers carry exactly the function and are invisible to this flag: `Informal elder consensus`, `Lord's reeve`, `Household elder` (thorp/hamlet, `institutionalCatalog.js:8, 24, 32, 266, 274`), `Lord's steward` and `Village reeve` and `Village elder` (village, `:794-817`). **The roster is the record.** See §1.2 |
| `compound.inst.hasPrison` === **false** | no member of a CLOSED FOUR-WORD SET: `prison` · `stocks` · `large prison` · `massive prison` (`priorityHelpers.js:54`) | as above | **there is nowhere to put a person and nothing to fasten one to.** The block's own set records that `Small prison/stocks` DOES hold cells (`institutionalCatalog.js:1564-1569`, "Holding cells and public punishment"), so its absence is genuinely the absence of a night's custody and of the public punishment that goes with it. This is the pool's single most concrete, most usable, least contested fact | nothing in the record denies it. It is a clean measured negative over a closed set and it is the writer's safest ground |

**The reads the desk performs and this key does NOT reach, listed so the writer knows the page around the sentence:**

- **`scores.internal` renders the badge and the bar beside this very prose** (`DefenseTab.jsx:324, :338`; the ladder at `defenseScoreBands.js`, `STRONG` ≥ 65, `ADEQUATE` ≥ 40, `WEAK` ≥ 20, else `CRITICAL`). On this key the two flags the badge would have paid for are unearned (`defenseGenerator.js:232-233`: court +20, prison +15). **What is left is everything the key cannot see:** the small-tier community baseline `communityIntBase` (thorp 18, hamlet 14, village 10 at `:147`), +8 for a church as social authority (`:149`), +6 for a reeve, steward, elder, household council or free elder (`:151-152`), +6 where no criminal organisation is on the roster (`:155`), then +15 garrison, +18 watch, +8 militia, +5 charter hall (`:234-237`), the arcane and divine bonuses (`:239-242`), and finally a crime subtraction (`:255`). **So the badge printed beside this sentence is frequently ADEQUATE and can reach STRONG, and every point of it comes from something this key never consulted.**
- **The engine's own prose for this branch is still on the page, one click away.** `buildThreatAssessment` builds `'Internal security: ' + safetyLabel + '. '` and appends, for this exact branch, `'No legal infrastructure: order relies on force alone.'` (`threatAssessment.js:140-157`), and `DefenseTab.jsx:342` renders that string inside the expanded row under the same label. **Vid 1's second clause is claim-identical to it.** A face that repeats it makes the panel say one thing twice.
- **The safety label is printed at the head of that same string and this key never reads it.** `safetyProfile.js:227-304` produces `Very Safe` · `Safe` · `Moderate` · `Unsafe` · `Dangerous` · `Controlled — Authoritarian` · `Dangerous — Criminal Governance`, and the small-tier community-order bonus pushes the preimage's typical member toward the SAFE end (`:495` names it in terms: "No crime type for clean small communities"). **A face asserting disorder can print directly above the words "Internal security: Very Safe."**
- **`config.stressTypes` is read by NO key function of this block.** This sentence prints under `occupied`, `under_siege`, `wartime`, `famine`, `plague_onset` and `monster_pressure` banners.
- The seven defence buckets — `walls`, `garrison`, `militia`, `watch`, `mercenary`, `charter`, `magicDef` (`domain/institutions/defenseInstitutionBuckets.js:84-107`) — are read by rows 1 and 2 of this block and by NOTHING in row 3. **This key cannot tell whether a single armed body stands in the town.**

### 0.6 The provenance move, priced for this pool

Zero. The card resolves no holder for either read and prints `SOURCE-UNRESOLVED`, so arm A13 refuses any face that names a record keeper. The ceiling would have been one per unit (Part B §24) and only for one of S3's three reasons; none obtains and the door is shut besides. The exemplar registers with raw text cite at zero per 786 sentences, so this costs the pool nothing. **Record vocabulary remains free** — a list, an entry, a thing written down, a thing nobody wrote down — because that is lexicon and not attribution.

---

## VARIANT 1 · vid 1 · `[ledger]` · slots `{settlement}`

### 1.1 The shipped sentence, verbatim

> There is no legal machinery at {settlement}; order here rests on force alone, and force alone deters only while it is present.

### 1.2 Every claim it makes, on the new test

- **There is NO LEGAL MACHINERY at the town.** — **CONTRADICTED** on the dominant part of this key's range. "Legal machinery" is a totality over every apparatus by which a wrong is heard and answered. What the key holds is the absence of two closed keyword sets: a hall of a named kind, and a cell. The roster carries, at exactly the tiers this pool selects, a governance row whose own printed description is the function: `Village elder` — "The oldest or most respected resident guides village decisions in the absence of formal authority. Less official than a reeve, more stable than nothing." (`institutionalCatalog.js:810-817`); `Informal elder consensus` — "Communal elder consensus governs shared affairs." (`:274-281`); `Village reeve`, `Lord's reeve`, `Lord's steward` — "collects rents and enforces manor authority over a bound village" (`:794-801`, `:24-31`). The engine reads those rows as order and pays for them: `defenseGenerator.js:151-152` adds six to the internal score for a reeve, steward, elder, household council or free elder, and its comment at `:146` says in terms "tight community self-policing (strangers noticed, **disputes mediated by elders**)". **The record is the roster and the generator's own model; the face is the thing that must move.** The safe form is the one the key actually holds: no hall of that kind, and nowhere to hold anyone. Rows **L-01 / L-02** in the table at §1.4.
- **ORDER HERE RESTS ON FORCE ALONE.** — **CONTRADICTED, and this is the sharpest row in the packet, on two independent grounds.** First: the engine models order at these tiers as UNPAID COMMUNITY SELF-POLICING, and says so — `communityIntBase` is eighteen at thorp, fourteen at hamlet, ten at village (`defenseGenerator.js:147`), plus eight where a church stands as social authority (`:149`), plus six for a governance row (`:151`), plus six where no criminal organisation is on the roster (`:155`), and the upkeep gate at `:246-253` exempts it by name: "Community self-policing (the small-tier baseline) is **unpaid and exempt**." That is order that is not force and is not bought. Second: **this key reads no force bucket at all.** `garrison`, `militia`, `watch`, `mercenary`, `charter` and `magicDef` (`domain/institutions/defenseInstitutionBuckets.js:88-107`) are arguments to rows 1 and 2 and to nothing in row 3, so on a settlement this pool selects there may be no armed body whatever — in which case order rests on force that does not exist. The clause is wrong when a force is there and wrong when it is not. Row **L-03**.
- **FORCE ALONE DETERS ONLY WHILE IT IS PRESENT.** — **FLOOR-2 (a dependence on an unobserved field).** It is a proposition about how deterrence behaves over time and distance, and no field models deterrence, presence or decay. It is also the gnomic closer R-DA-12 measures before it caps and the MEANING move MOVE-GRAMMAR §1.3 says does not exist — a second sentence that glosses the first rather than stating a second fact. ⚠ And it has a second life: the desk's own C3 docblock quotes this row beside DS-DEF-6's blocked twin, "Deterrence extends exactly as far as force does and stops there." (`defenseStateProse.js:1461-1470`), as the proof that the two collide on the nose. The twin is blocked from rendering (`DEF6_C3_BLOCKED_POOLS`, `:1496-1509`), so there is no live double-print — but a rewrite that keeps the shape keeps the citation true.
- **The town HAS order.** — **SAFE**, and better founded than the shipped row allows. The internal score on this key is nonzero by construction at every small tier (`communityIntBase` before any institution is counted) and the safety label printed on the same panel is frequently `Safe` or `Very Safe`. A face may state that things are settled here; what it may not do is name force as the thing that settles them.
- **The town is named, once, not first.** — **SAFE**, and required: the slot set is `{settlement}` and T-F8 refuses a sentence face that OPENS on a `proper`-typed slot.
- **Implicitly: the town once had a court, or lost one, or refused one.** — the face does not assert it and no face may. Institution presence is a STANDING fact with no recorded history (the block's own fence). ABOLISHED, NEVER BUILT, LOST, GAVE UP, COULD NOT AFFORD are all event-provenance the record does not hold — **FLOOR-2b** if written. ⚠ "Could not afford" is the specific trap here, because the block DOES carry a pay gate and it is the wrong one: `defenseGenerator.js:246-253` gates "watch wages, court and gaol funding" on `econOutput`, but that gate SCALES a score, it never removes a row. The flags are presence, not affordability, and the engine plants no court by policy at these tiers at all.

### 1.3 The reads this pool reaches (material for the rewrite of vid 1)

- `hasCourtSystem === false`: no courthouse, no borough court, no court buildings, no citizen assembly, no town hall or city hall — a closed set of five names, measured over the roster's native semantic names. The absence is of a BUILDING and a MEETING PLACE.
- `hasPrison === false`: no prison, no large or massive prison, and **no stocks** — a closed set of four. The absence is of a night's custody and of the public punishment that goes with it.
- Both are measured negatives over closed sets, not silences: the branch consults `court`, then `prison`, before it returns.
- The key's own comparison, which is the pool: a town that can neither convene nor confine. Its three siblings hold one half or both (`internalRowPoolKey:507-509`), so the discriminating claim here is that BOTH are missing together.
- REACHED BY THE ENGINE AND NOT BY THE KEY, and therefore the writer's boundary: the elder, the reeve, the steward, every governance row; the watch, the garrison, the militia, the charter hall; the badge and its bar; the safety label; every stress on the page.

### 1.4 ⭐ WHAT WOULD BE FALSE HERE

**Contradiction-table rows this pool's key can actually walk into** (the block's own set is `rewrite/rulings-DEF2-v14.txt`; the rows below are the ones THIS key can reach):

| row | the claim that would be false | the field that denies it |
|---|---|---|
| **L-01** | "no legal machinery", "no law", "nothing that answers a wrong", "nobody decides anything here" as a TOTALITY | `priorityHelpers.js:55` (the flag is a five-word building list); `institutionalCatalog.js:8, 24, 32, 266, 274, 794, 802, 810` (six governance rows across the three small tiers, each of which hears disputes); `defenseGenerator.js:146, 151-152` (the generator's own model: elders mediate, and it pays six points for the row). **The roster is the record** |
| **L-02** | "no judge", "no magistrate", "no one to hear it", "no authority" — the flag read as an office rather than a hall | the block's own set: `hasCourtSystem` positive "is every town and city from a meeting hall (a civil arbitration is recorded, a criminal trial is not)". The negative is the absence of the hall. **And custom content cuts the other way:** a materialised custom institution named `Magistrate's bench` or `Moot hall` carries none of the five keywords, so a town with a named judging body still lands in this pool |
| **L-03** | "order rests on force", "force is all there is", "the strong decide", "whoever is armed decides" | `defenseGenerator.js:147-155` (the unpaid community baseline, +8 church, +6 governance row, +6 no criminal organisation) and `:246-253` ("Community self-policing … is unpaid and exempt"); and the key reads no force bucket at all (`domain/institutions/defenseInstitutionBuckets.js:88-107`), so the force may not exist either |
| **L-04 (the alias trap, three ways)** | naming "the watch", "the guard", "the garrison" or "the militia" as a body that IS or IS NOT here | the block's alias rule: "the garrison" only where a `Garrison` or `Multiple garrisons` row resolves (city tier); "the watch" as a NAME only on a resolved watch row (town-plus); "the militia" only where the militia row resolves; and **"the guard" is the power generator's FALLBACK label** on a town whose safety profile prints "no meaningful guard presence" (`safetyProfile.js:495`). This key resolves NONE of them, so all four are traps from four directions |
| **L-05** | explaining or outrunning the readiness BADGE and bar printed beside the prose | `defenseGenerator.js:147-255`; `defenseScoreBands.js`. The badge moves on the community baseline, the church, the governance row, the watch, the garrison, the militia, the charter hall, the arcane and divine bonuses and the crime subtraction — **none of which the key reads.** It is frequently ADEQUATE and can reach STRONG |
| **L-06** | disorder, danger, violence, fear, "nobody is safe", "a bad place to be wronged" | `safetyProfile.js:227-304` and `threatAssessment.js:140` — the SAFETY LABEL prints at the head of the engine string under this same row, and the small-tier community-order bonus pushes the typical member of this preimage toward `Safe` and `Very Safe` (`:495`, "No crime type for clean small communities"). **A face about a dangerous town can print directly above the words "Internal security: Very Safe."** |
| **L-07 (the pay gate, F4 family)** | the town cannot AFFORD a court or a gaol; the purse explains the absence; a total collapse of pay | the flags are PRESENCE over a name list (`priorityHelpers.js:54-55`) and carry no cost. The internal purse at `defenseGenerator.js:246-253` gates "watch wages, court and gaol funding" with a FLOOR of 0.65 and identity at `econOutput ≥ 50`: it scales a score and never removes a row, and the community baseline is exempt from it outright |
| **L-08 (the DS-DEF-5 collision)** | a HEADCOUNT, a roster size, a number of anybody | a count of the town's people or forces is DS-DEF-5's cell; stating one here collides with that surface (the block's own set, ruling R-9) |
| **F2 family** | any magnitude, date, season, duration, founding, elapsed course, rate, trend, prediction, or dependency on a field the key cannot see — "since the founding", "for as long as anyone", "will not last", "is getting worse" | the flags are birth-time booleans; `history.age` is frozen at birth and rerollable; NO state-prose pool key reads a history field; A2 and THE PROMISE refuse the future indicative |
| **F1-126** | a minted PROPER NAME borne by the face (a person, an inn, a lane, a family, a road) | a pooled face is authored once and drawn by every settlement whose key matches, so the name prints identically across a region. The NPC roster and the `{npc}` slots are the name authority; this pool has neither |
| **the stress corner** | anything a siege, an occupation or a famine on the same page would make absurd | no key function of this block reads `config.stressTypes`. **Under `occupied` the question of who answers a wrong has an occupier in it**, and the block's own set says that where an occupation is on the page the face says whose. It cannot, so it must not raise the question in a form the occupation answers |
| **the engine string one click down** | "order relies on force alone" in any vocabulary | `threatAssessment.js:151` renders exactly that sentence under this row's expander (`DefenseTab.jsx:342`). Repeating it is the panel saying one thing twice |

**THE CLOSED ROSTERS THIS POOL TOUCHES (floor 1).** A body, building, record-keeper, force or faith-house the rosters do not carry may not be asserted: the **institution roster** per tier (`institutionalCatalog.js`) plus materialised custom content; **this key's own two closed keyword sets** — court `{courthouse · court buildings · democratic assembly · city hall · town hall}` and prison `{prison · stocks · large prison · massive prison}` (`priorityHelpers.js:54-55`), which are the exact and only things this key asserts are absent; the **seven defence buckets** (`domain/institutions/defenseInstitutionBuckets.js:84-107`), unread here but binding on what may be NAMED; the faction list; the faith entries; the NPC office roster. Everything else is silence, and silence is permission.

**Not a faith pool.** The deity's four axes, the derived temper (`deityTemper()`, never the inert stored `temperamentAxis`), the pantheon rank, the settlement standing and the suppressed flag do not arise here and no face may reach for them. ⚠ One brush with faith exists and must be handled as CULTURE and never as theology: `hasChurch` adds eight to this row's score as "Church/shrine as **social authority** and emergency coordination" (`defenseGenerator.js:149`). A face may not assert a church is here (the key does not read it); it may not say a god does anything.

### 1.5 ⭐ THE PREIMAGE — the range of towns this key selects

`internalRowPoolKey(false, false)` fires on **every settlement whose stored `economicState.compound.inst` reports neither a court-keyword row nor a prison-keyword row**, and on NOTHING ELSE about the settlement. That is:

- **Essentially every generated THORP, HAMLET and VILLAGE in the product.** The catalog carries no `Town hall`, no `Courthouse`, no `Small prison/stocks` and no `Democratic assembly` anywhere in the thorp, hamlet or village tiers (`institutionalCatalog.js:6-922`, scanned whole). The first court-keyword row in the catalog is town-tier `Town hall`, `required: true`, `baseChance: 1` (`:1550-1556`); the first prison row is town-tier `Small prison/stocks` at `0.7` (`:1564-1569`). **So this is the small-settlement pool, and its preimage is the largest of the four Internal Security branches by a wide margin.**
- **And NOT a generated town, city or metropolis.** `Town hall` is required at town, `City hall` and `Multiple courthouses` are both `required: true` at city (`:2268-2281`). A generated settlement at those tiers carries `hasCourtSystem === true` at birth and cannot reach this key.
- **Except through three real corners, and a face must survive all three.**
  1. **CUSTOM CONTENT.** The flag is a substring match over native semantic names. A custom institution called `Magistrate's bench`, `Moot hall`, `Assize`, `Elders' court` or `The Gaol` matches none of the nine keywords, so **a settlement with a named judging body and a named lock-up can print this sentence.** Conversely a custom row whose name happens to contain `town hall` flips the flag at a hamlet.
  2. **AN UNMEASURED CIVIC ROSTER.** `civicFlag` is strict `=== true` and `compound` defaults to `{}` (`defenseStateProse.js:620, 309-311`). **This branch has no absence guard.** Row 1 of this block returns `null` on an unmeasured country and renders nothing (`:313-334`); row 3 renders THIS POOL. A hand-built fixture or a malformed import with no safety profile lands here at any tier, including a metropolis.
  3. **A RUIN, ONE-WAY.** These flags are computed at GENERATION over the full institutions array with no ruin filter (`safetyProfile.js:26`, `priorityHelpers.js:41-55`, stored at `:688`), while rows 1 and 2 on the same panel read the LIVE, ruin-filtered roster (`defenseStateProse.js:623`, `domain/institutions/defenseInstitutionBuckets.js:162-170`). **After a ruin those rows move and this one does not.** The two clocks on one panel disagree by construction.
- **Every stress state, every route, culture, prosperity rung and population band**, and **every safety label from `Very Safe` to `Dangerous — Criminal Governance`**, none of which the key reads.
- **With bodies the key cannot see:** a reeve, a steward, a village elder, an informal elder consensus, a church or shrine, a town watch, a citizen militia, a charter hall, a veteran's lodge, a mercenary company. **Any of these may stand on a settlement this pool selects.**

A face must contradict no state in that range, not merely the town on this skeleton.

### 1.6 The angle's stance in one sentence

`[ledger]` is the compiled entry: the office setting down what its own records hold, in the order a clerk would, so here it may state the two things the roster does not carry — a hall of that kind, and a cell — flatly and as standing facts, without naming what DOES hear a wrong, without explaining either absence by the other, and without reaching for a body, a count, a course, a cause or a purse the roster does not carry.

### 1.7 The turns worth keeping

- *at {settlement}* placed after the opening noun rather than in front of it. The slot must not open the face (T-F8) and this is the cleanest way to carry it.
- The SEMICOLON JOINT between a standing fact and its consequence is lawful and rationed (R-DA-06 caps it at roughly one in eight per variant across R2; here the pool has three variants and may spend it once). Keep at most one face of the pool on it.
- *no legal machinery* — the SHAPE is right and the noun is too wide. The move to carry is a single flat absence stated first and without a completing "but" (R-DA-02's LACK limb). Narrow the noun to what the flag holds: the hall, the cells, the stocks.
- Nothing else. The second clause is named in §1.2 on two counts and the third is the register's own worst habit.

### 1.8 What would make the rewrite of vid 1 a regression

Vid 1 not first, or not `[ledger]`, or its slot set not `{settlement}` alone, or fewer than four faces, or no longer the pool's canonical index-zero line. Any face carrying "force alone" in a new vocabulary, or a totality over every apparatus of law, or a verdict on the badge, a headcount, a purse, a date, a course, or a named record holder (the card licenses none). ⚠ **Any face that opens `There is` or `There are`** — the existential opener is R-DA-07's floor, `check-pair.mjs`'s `EXISTENTIAL OPENER ADDED` arm fires on it, and the shipped row is one of the R1 rows that put the register over its ceiling. A face that opens on the `{settlement}` proper slot (T-F8). A face that closes on a maxim rather than a standing fact.

### 1.9 ⭐ WHERE THE FLAVOUR IS (vid 1)

- **The absence is of a ROOM, and a room is a concrete thing.** The court flag is five building names and nothing else; what this town has not got is a hall it meets in. So there is no bench, no dais, no door that is open on one day of the week and shut the rest, no place a thing is heard that is not somebody's house or the open air. **A matter here is heard wherever the people who hear it happen to be standing** — a doorway, a field edge, a threshing floor, the space in front of a shrine. The record says the room is missing; where the hearing then happens is silence, and silence is the writer's. No shipped row in any of the four Internal Security pools has ever reached for the room.
- **And the absence of a cell is sharper still, because the stocks are in the same set.** `Small prison/stocks` is one row and it holds both (`institutionalCatalog.js:1564-1569`, "Holding cells and public punishment"), so this key denies the lock-up AND the frame in the square. **There is nowhere to put a man overnight and nothing to fasten him to in the morning.** That is the pool's single cleanest fact: not a claim about justice, a claim about custody, and it is entirely licensed. Everything that follows from it in the world — that a matter cannot be adjourned, that nothing can wait, that a decision has to be reached while everyone is still there — is a standing condition and not a course.
- **Whatever answers a wrong here is a PERSON with other work.** The roster's governance rows at these tiers are an elder, a reeve, a steward, a consensus of the old — offices that are somebody's second occupation and that the engine pays six points for (`defenseGenerator.js:151`). ⚠ **The key cannot see which of them is here**, so a face may not name one. What it may do is write the SHAPE the record leaves: the answer does not come from a building, it comes from whoever the town already listens to, and it comes at whatever hour the town is not working. An arrangement with no premises and no opening times is a genuinely dossier-shaped particular.
- **The two absences are not the same absence and the sentence has never separated them.** One is the hearing and one is the holding. A town that can hear a matter and not hold anybody is the sibling pool one row up; a town that can hold and not hear is the one below. **This pool is the only one of the four where the two gaps meet**, and what meets them is not "force" — it is that the answer and the enforcement have to be the same act, arrived at in one sitting, by people who will still be neighbours afterwards. The record holds both gaps as measured negatives and holds nothing about how the town feels about it, which is exactly the register's preferred ground.

---

## VARIANT 2 · vid 2 · `[street]` · slots **NONE**

⛔ **This variant names no town.** Its slot set is `[]` (`defense.generated.js:784-790`) and its four faces must each carry no slot at all. It is the one row of the pool a reader meets with the town's name nowhere in it, which is also the register's own preference (R-DA-17: the town's name is not the default opener) and which keeps the pool's opener histogram healthy. **Keep it slotless.**

### 2.1 The shipped sentence, verbatim

> The town settles things itself, quickly, and does not always settle them well.

### 2.2 Every claim it makes, on the new test

- **The town SETTLES THINGS ITSELF.** — **SAFE, and positively founded rather than merely unopposed.** The engine's model of order at the tiers this pool selects is exactly this: `communityIntBase` is "tight community self-policing (strangers noticed, disputes mediated by elders)" (`defenseGenerator.js:146-147`), it is the FIRST term of the internal score, and the upkeep gate exempts it by name as unpaid (`:246-253`). This is the strongest clause in the shipped pool and it should survive into the rewrite in some form.
- **It settles them QUICKLY.** — **FLOOR-2 (a dependence on an unobserved field).** No field holds the speed at which a dispute is answered; there is no elapsed-time model of anything here. The idea underneath it IS licensed and is worth converting rather than losing: what the record actually holds is that **there is nowhere to hold anybody** (`hasPrison === false` over `{prison · stocks · large prison · massive prison}`), so nothing can be adjourned to a cell and no matter can be left standing while somebody is kept. That is a STANDING CONDITION with the same shape and none of the rate. Row **S-01**.
- **Does NOT ALWAYS settle them WELL.** — **FLOOR-2 twice over, and it brushes a refused column.** First, "well" is a RATING and the estate holds exactly one rating for this row — `defenseProfile.scores.internal` with its four band words, printed as a badge beside this very sentence — and **this key never reads it.** On this key that badge is frequently ADEQUATE and can reach STRONG (`defenseGenerator.js:147-255`; §0.5), so the face can contradict the bar an inch above it. Second, "not always" quantifies over a series of past settlements that no field records: an elapsed course. And a verdict on outcomes across every resident's dealings is a totality over persons, which the card refuses always. Rows **S-02 / S-03**.
- **"The town" acts as one body.** — **SAFE as an ARRANGEMENT, and the distinction is the whole of this variant's craft.** What a town DOES is a standing civic fact and the register writes it freely. What a town THINKS, ASSUMES, PREFERS, PUTS UP WITH or HAS GOT USED TO is not a field, carries a totality over persons, and is the FEELING move MOVE-GRAMMAR §1.3 says does not exist. The shipped clause stays on the right side of that line; a rewrite must too.
- **The elided repetition (*settles … settle*) and the three-beat comma rhythm.** — **SAFE as form**, and it is the pool's only SHORT line. R-DA-05: rhythm follows load and the short line exists. **Keep at least one face of this variant under a dozen words.**
- **No town name anywhere.** — **SAFE and required.** See the fence at the head of this section.

### 2.3 The reads this pool reaches (material for the rewrite of vid 2)

The same two as §1.3, met at ground level rather than on the roll: there is no hall of the five named kinds for a matter to be taken into, and there is no cell and no stocks for anybody to be put in. From the street both are visible as ABSENT PREMISES — a thing everyone knows the location of, in a town that has no such location. The elder, the reeve, the steward, the watch, the militia, the church, the badge, the safety label and every stress remain outside the key and are this face's boundary.

### 2.4 ⭐ WHAT WOULD BE FALSE HERE

Every row of the table at §1.4 applies. The rows this variant walks into by its own shape:

| row | the claim that would be false | the field that denies it |
|---|---|---|
| **S-01** | "quickly", "on the spot", "before nightfall", "in an afternoon", "while the matter is fresh" — any RATE or elapsed span | no field holds the duration of anything here; the flags are birth-time booleans. The lawful conversion is the standing one: nothing can be held, so nothing can wait |
| **S-02** | "not always well", "badly", "roughly", "as often wrong as right", "nobody is satisfied" — a RATING or a frequency of outcomes | `defenseProfile.scores.internal` is the estate's one rating for this row, it is printed as a badge and a bar beside this sentence (`DefenseTab.jsx:324, :338`), and the key never reads it. On this key it is frequently ADEQUATE and can reach STRONG (`defenseGenerator.js:147-255`) |
| **S-03** | a state of mind, an assumption, a habit of thought, a resignation, a preference, an expectation, held by "the town" as one body | no field; a totality over persons is refused on the card always; MOVE-GRAMMAR §1.3 holds no FEELING and no MEANING move; R-DA-01 and R-DA-14 assign no reaction |
| **S-04** | "everyone knows", "nobody complains", "people here accept", "the town has learned" | the same refused column, plus an elapsed course in the last of them |
| **L-03** | "the strongest wins", "it comes down to who is stronger", "whoever is armed settles it" | `defenseGenerator.js:147-155` and `:246-253` (the unpaid community baseline IS the model of order here); and the key reads no force bucket, so the strong party may not exist either |
| **L-06** | disorder, feud, grudge, violence, fear, a bad place to fall out with anyone | `safetyProfile.js:227-304`, `:495`; the label printed at the head of the engine string under this row is frequently `Safe` or `Very Safe` on this preimage |
| **A2 / THE PROMISE** | "will go wrong", "cannot last", "one day", "sooner or later", "it works until it does not" as a FATE rather than a subjunctive edge | no move has a future indicative; the edge is subjunctive and the pulse adjudicates predictions |
| **the slotless corner** | anything true only of a small place — "everyone here knows everyone", "there are not enough people for it" | this row prints identically in every settlement the key selects **and has no name in it to blame**, including the unmeasured-roster corner at any tier and the custom-content corner where a judging body is on the roster. See §2.5 |

The closed rosters and the not-a-faith-pool line at §1.4 bind here unchanged.

### 2.5 ⭐ THE PREIMAGE

As §1.5, with one emphasis this variant makes acute. **The slotless row prints identically in every settlement the key selects, and it carries no name, no tier word and no band word to anchor it.** The dominant range is thorp, hamlet and village, and the temptation is to write the small place. But the same bytes print on the three corners of §1.5: a settlement whose judging body is a custom row the flag cannot see; a hand-built or malformed world at ANY tier, metropolis included, whose `compound.inst` is absent and whose civic roster was never measured; and a town whose flags were frozen at birth while the panel's other rows read a ruined live roster. **A clause that fits a hamlet of forty and reads absurd in a city has nothing in the sentence to excuse it.**

### 2.6 The angle's stance in one sentence

`[street]` is the town's own ordinary practice seen at ground level: what is done and not done here as a matter of course, stated flatly as a standing arrangement that everybody in it lives inside — never as what anybody thinks, feels, assumes, resents or has got used to; never as a rate, a record of outcomes or a verdict on them; and never as a history of how it came to be that way.

### 2.7 The turns worth keeping

- **The SHORTNESS.** It is the pool's only short line and the register's own rule is that the short line exists. At least one face of this variant stays under a dozen words.
- **The verb carried forward across the joint** (*settles … settle*). A deliberate repetition for the thread is lawful — A11's echo bound counts FACTS, not nouns (MOVE-GRAMMAR §1.4.1) — and it is a plain, unmannered joint that spends rhythm and buys no claim. The move is reusable even where the words are not.
- **The refusal to name the town.** Keep it, in every face.
- **The reflexive *itself*.** It is the licensed heart of the variant: the town is the body that answers, because the record holds no other body that does. Vary the noun, keep the reflexive move.

### 2.8 What would make the rewrite of vid 2 a regression

Vid 2 not second, or not `[street]`, or gaining a slot, or fewer than four faces. Any face carrying a rate, a frequency, a rating of outcomes, a town-wide interior, a "never", a future, or "whoever is strongest". Any face in which all four wordings are long — the variant's one structural asset is that it is the short one. Any face that reads as a hamlet's alone, since the same bytes print in an unmeasured metropolis. Any face that names what DOES hear the matter (an elder, a reeve, a priest, the watch) — the key resolves none of them.

### 2.9 ⭐ WHERE THE FLAVOUR IS (vid 2)

- **Nothing here can be adjourned, and that is the street-level shape of the cell's absence.** With no lock-up and no stocks, a matter cannot be parked until morning, a party cannot be kept apart from the other overnight, and nobody can be set aside to cool off. **Everything has to finish in one sitting, in front of whoever came.** That is a standing condition, it is the honest and fully licensed form of the shipped "quickly", and it is far more particular: an arrangement in which the answer and the end of the argument have to be the same moment.
- **The stocks are missing as well as the gaol, so there is no public half of it either.** `Small prison/stocks` is one catalog row and it holds both (`institutionalCatalog.js:1564-1569`). So there is no frame in the square, nothing anyone is made to stand in, no punishment the town watches. Whatever is done is done between the people it concerns and is over when they walk away. **A town where a wrong leaves no visible mark on the day** is a concrete, licensed, wholly unused picture.
- **There are no premises, so there is no threshold, no queue and no opening day.** A matter is not "brought" anywhere. Nobody waits outside a door. There is no week-day on which such things are heard and no other week-day on which they are not. From the street the absence looks like the absence of an APPOINTMENT — what would elsewhere be a fixed place and a fixed hour is here whoever is about and whenever they are about. That is what a stranger would notice, and it needs no name, no count and no cause.
- **What is done is done by people who will still be neighbours tomorrow.** The record holds no separate body, no premises and no custody; what it holds instead is that every part of the arrangement is somebody's ordinary life. Write the ARRANGEMENT — that the parties, the hearers and the people who have to live with the answer are the same small set — not what any of them makes of it. The register's own preference is exactly this: an act, an arrangement, or an absence of one, never an interior.

---

## VARIANT 3 · vid 3 · `[visitor]` · slots `{settlement}`

### 3.1 The shipped sentence, verbatim

> A stranger wronged at {settlement} discovers there is nowhere to take it, and that the discovery surprises nobody local.

### 3.2 Every claim it makes, on the new test

- **A stranger may be WRONGED here.** — **SAFE.** It is a conditional occasion, not an event, and it names no person, office or fate. Product scope and F1-126 are untouched.
- **There is NOWHERE TO TAKE IT.** — **CONTRADICTED**, on the same ground as vid 1's first clause and harder, because "nowhere" is a totality over destinations rather than over apparatus. The roster at the tiers this pool selects carries a governance row whose printed function is to hear the town's disputes — `Village elder`, `Informal elder consensus`, `Village reeve`, `Lord's reeve`, `Lord's steward`, `Household elder` (`institutionalCatalog.js:8, 24, 32, 266, 274, 794, 802, 810`) — and the generator credits it (`defenseGenerator.js:151-152`) beside a community baseline whose own comment is "disputes mediated by elders" (`:146`). **And the key cannot see a watch at all**: `hasWatch` is worth eighteen points on this very row (`:235`) and is no argument to this key, so a settlement this pool selects may carry a rostered watch while the sentence says the stranger has nowhere to go. **The record is the roster; the face is the thing that must move.** The licensed form is narrow and still sharp: there is no HALL to take it to and no CELL at the end of it. Rows **V-01 / L-01 / L-04**.
- **THE DISCOVERY SURPRISES NOBODY LOCAL.** — **FLOOR-2 (a dependence on an unobserved field), and it stands on a refused column.** No field carries what any resident knows, expects or is surprised by, and a clause that puts one state of mind behind every local is a totality over persons, refused on the card always. It is also the MEANING move: a second clause that tells the reader what the first one signifies rather than stating a second fact (MOVE-GRAMMAR §1.3; R-DA-03's summarising-second-clause floor, measured at zero). Row **V-02**.
- **A STRANGER is the subject, and he acts once.** — **SAFE.** He bears no proper name, no office and no fate, and takes at most one act, which is exactly what R-DA-14's PERSON move admits. A visitor-angle face may put a person on the page on those terms.
- **The stranger's position differs from a local's.** — **not asserted by the shipped row, and it must not be.** No field holds a different treatment for outsiders; the flags are two building lists. A face that says a stranger fares worse, is believed less, or has no standing is asserting a rule of procedure the record does not hold — **FLOOR-2**. What IS licensed is positional and physical: the stranger does not know where anything is heard **because there is no where**, and that is a fact about the town, not about him.
- **Implicitly: what the stranger finds is what is the case.** — **SAFE** as long as the face lands on a standing condition. A visitor face that reports an IMPRESSION ("seems", "feels", "has the look of a place where", "you would not know") is hedging on a person's behalf, which the register refuses outright: the vague-authority floor of R-DA-13 is EXECUTABLE now and stands at zero. **Say what is there.**

### 3.3 The reads this pool reaches (material for the rewrite of vid 3)

The same two as §1.3, met by somebody who did not grow up knowing where things are done: no hall of the five named kinds, and no cell and no stocks. What is NOT reached, and is this face's boundary in particular: **the watch** (eighteen points on this row and invisible to the key), the elder, the reeve, the steward, the church, the garrison, the militia, the charter hall, the badge and its bar, the safety label, every stress on the page.

### 3.4 ⭐ WHAT WOULD BE FALSE HERE

Every row of the table at §1.4 applies. The rows this variant walks into by its own shape:

| row | the claim that would be false | the field that denies it |
|---|---|---|
| **V-01** | "nowhere to take it", "no one to tell", "nothing to be done", "no recourse", "no remedy" as a TOTALITY | `institutionalCatalog.js:8, 24, 32, 266, 274, 794, 802, 810` (six governance rows across the three small tiers); `defenseGenerator.js:146, 151-152`; and `hasWatch` (`:235`, +18) is no argument to this key. **This is the shipped clause that must not be carried forward** |
| **V-02** | what a local knows, expects, is or is not surprised by; what "nobody here" thinks | no field carries it; a totality over persons is refused on the card always; R-DA-13's vague-authority floor is at zero and R-DA-03's summarising second clause is at zero |
| **V-03** | a rule that treats the stranger differently — believed less, owed less, without standing, fair game | no field holds a procedure of any kind here; the flags are two building lists. The licensed difference is positional: he does not know the town, and there is no premises to be shown to |
| **L-04** | naming "the watch", "the guard", "the garrison" or "the militia" — asserting one, denying one, or saying there is none to go to | the block's alias rule; `domain/institutions/defenseInstitutionBuckets.js:95-107`; `defenseGenerator.js:235`. The key resolves none of the four and **a watch may be standing on the settlement while this prints** |
| **L-02** | "no judge", "no magistrate", "no court" as offices rather than as the hall the flag actually names | `priorityHelpers.js:55` (five building keywords); and a custom `Magistrate's bench` or `Moot hall` leaves the flag false |
| **R-DA-13** | "seems", "feels", "has the look of", "you would not know", "it is said", "apparently" | the vague-authority floor is EXECUTABLE now and stands at zero; the register hedges by distance and by a named roll, never by an impression — and here it may not name a roll either (`SOURCE-UNRESOLVED`) |
| **A5 / R-DA-01** | addressing the reader as the stranger ("you arrive", "you find"), or assigning him a reaction, a feeling or a lesson | no "you" in this register; the compiler shows only through what the record holds |
| **F1-126** | naming the road he came by, the inn he is staying at, the person who wronged him, the house he knocks at | no `{npc}` slot and no name authority on this pool; the same bytes print in every matching settlement |
| **the stress corner** | a stranger moving freely to look for somewhere to take a matter | `config.stressTypes` is unread by every key of this block. Under `occupied` or `under_siege` a stranger's movement and standing are the occupier's business, and the block's own set says a face may not raise what an occupation on the page would answer |

The closed rosters and the not-a-faith-pool line at §1.4 bind here unchanged.

### 3.5 ⭐ THE PREIMAGE

As §1.5. The corners this variant must survive: **a settlement carrying a rostered `Town watch` or a named judging body the flag cannot see** (the sentence's own subject is where a wrong goes, and the key cannot tell); **the unmeasured-roster corner at any tier**, where a stranger wronged in what may be a metropolis reads this line; and **a settlement under an `occupied` or `under_siege` banner**, where the question of whose law answers a stranger has an occupier's answer printed elsewhere on the same dossier. A face that is true in a heartland village and false in those three has not cleared the preimage.

### 3.6 The angle's stance in one sentence

`[visitor]` is the outside eye on a standing arrangement: what a person arriving actually encounters, reported as fact and never as impression, landing on the civic thing that is or is not there — so here it may put the reader at the point where a matter would be taken somewhere and find no somewhere to take it TO, and must not name who does hear it, nor total the town's recourse, nor hedge, nor address anyone, nor read a local's mind.

### 3.7 The turns worth keeping

- ***A stranger … at {settlement}*** — the subject is the angle's own and it is correctly placed: the slot rides after the noun, so the face does not open on the proper slot (T-F8).
- **The two-part shape** — a person does a plain thing; the plain thing meets a standing condition. That is the visitor angle's grammar and it is reusable across four faces with different nouns and different plain things.
- ***wronged*** — a clean, flat, unhedged word for the occasion, with no crime class, no magnitude and no actor in it. Worth carrying.
- Nothing else. The first clause is named in §1.4 and §3.4 as a clause that must not be carried forward, and the second is a verdict on what everybody in the town already knows.

### 3.8 What would make the rewrite of vid 3 a regression

Vid 3 not third, or not `[visitor]`, or its slot set not `{settlement}` alone, or fewer than four faces. Any face that keeps "nowhere to take it" in a new vocabulary ("no one to tell", "nothing to be done", "no remedy"), or that names a watch, a guard, a garrison, a militia, a judge or an elder. Any face that reads a local's mind, hedges on the stranger's behalf, addresses the reader, names a road, a house or a person, or gives the stranger a fate. Any face that asserts a procedure treating him differently. A face that opens on the `{settlement}` proper slot (T-F8).

### 3.9 ⭐ WHERE THE FLAVOUR IS (vid 3)

- **He cannot be DIRECTED anywhere, and that is the licensed, particular form of the shipped clause.** The flag denies the hall: there is no building to point at, no door to be sent to, no square where such things are done. So the honest picture is not that a wrong goes unanswered — it is that **there is no address for it.** A stranger who asks where a thing like this is taken gets people rather than a place: a direction toward whoever is about. The record holds the missing premises exactly; who he is pointed at is silence, and silence is the writer's.
- **Nothing can be held while he waits, so nothing keeps him there.** With no cell and no stocks, nobody can be detained pending anything, which means there is no reason for the stranger to stay a second night and no mechanism that would make anybody else stay either. **A matter here cannot outlast the traveller's stop.** That follows from a measured negative over a closed set, it is a standing condition rather than a course, and it is the sharpest thing this angle can say.
- **And nothing is on show, so he sees no evidence either way.** The stocks are in the same catalog row as the cells, so there is no frame in the square, nobody standing in one, no visible mark that the town answers anything at all. A stranger walking through finds **a town with no legal furniture in it** — no bench, no frame, no hall, no door with a day on it. That is entirely concrete, entirely licensed, and no shipped row in the four Internal Security pools has touched it.
- **What he does find is people already arranged around the problem.** At the tiers this pool selects the roster carries an elder, a reeve, a steward, a consensus of the old, and the engine treats them as the town's order and pays for them. ⚠ The key cannot see WHICH, so a face may not name one. What it may write is the SHAPE: the thing that would elsewhere be an institution is here a set of people the town already listens to, with no premises, no hours and nothing to detain anybody with. **An arrangement whose whole apparatus is who is standing there** — that is the picture the record leaves open, and it opens a matter rather than closing one, which is the register's own preferred close.

---

## 4. WHAT THE POOL OWES ACROSS ITS THREE VARIANTS

- **Twelve faces, four per variant**, each a different vocabulary or rhythm inside the voice and never a paraphrase of its sibling. The counts only rise (Part B §22); a face that fails the gate stays in the annex as a refusal row with its measurement.
- **Slot sets per parent, not per pool:** `{settlement}` · none · `{settlement}`. See the wall at the head of this file.
- **Distinct level-1 grammars.** A pool of three carries three distinct members of MOVE-GRAMMAR §2.1's V1–V8, filtered to what this block licenses. V1 (`PRESENT` alone), V2 (`PRESENT → CONSEQUENCE(structural)`) and V3 (`PRESENT → LACK`) are all drawable here; V7 is not (no event provenance), V8 is not (no typed `not-held` field carrying provenance), V5 is not (no institution-table row resolves on this key) and V6 is not (no state field whose value is unresolved). ⚠ **V3's LACK may not open a sentence and may not sit beside another ABSENCE** (order wall 3), which bites hard in a pool whose whole subject is two absences: **at most one variant may lead with the lack**, and the other two must open on what the town DOES, on the person, or on the thing that is there.
- **A11's spread:** no two variants of this pool share their first two words. The shipped three already differ (`There is` · `The town` · `A stranger`), and the first of those is the existential opener R-DA-07 caps — so the rewrite gains a slot there rather than losing one. The spread is measured over all twelve faces, not three.
- **The settlement token opens at most one variant per pool** (R-DA-17), and T-F8 refuses a sentence face opening on a `proper`-typed slot outright, so **no face of vid 1 or vid 3 may begin on the town's name** and vid 2 has no name to begin on. The pool therefore opens on the town's name zero times, which is the register's preference and costs nothing.
- **The pool's discriminating claim is that BOTH gaps meet here.** Its three siblings hold one half or both (`internalRowPoolKey:507-509`), and the sibling one row up already spends its whole text on a court that cannot hold anyone. **A face that writes only the missing cell is claim-identical to `detention without process` inverted, and a face that writes only the missing hall is the sibling above it.** Every face must carry the CONJUNCTION: nothing to convene in and nothing to confine with.
- **Zero citations.** The card prints `SOURCE-UNRESOLVED` for both reads (§0.6). Record vocabulary is free; a named holder is refused by arm A13 in every one of the twelve.
- **Zero uses of "force alone" in any vocabulary**, and zero repetitions of the engine string one click below (`threatAssessment.js:151`).
- **Leave one matter standing open.** The register's own constraint (fault 7's licence; the OPEN QUESTION move as a declarative) is easy to honour here and is the pool's natural close: the record holds a town with no hall to convene in and nowhere to hold anybody, and says nothing whatever about what happens instead. A face that declines to supply the answer — that states the two absences and stops on the arrangement rather than on a verdict about it — is doing the register's own work.

---

END OF PACKET. Three variants marked; nothing above is a face.
