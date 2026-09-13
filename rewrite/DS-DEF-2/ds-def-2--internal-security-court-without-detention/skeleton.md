# MARKER PACKET — DS-DEF-2 · pool `Internal Security: court without detention`

Seat: opus (marker), for the Fable chair. Block `DS-DEF-2` (`Defense › Threat assessment`), row 3 of five. **Three shipped variants; three to rewrite, four faces each.**

---

## 0.1 THE LICENCE CARD, verbatim

Printed from `node scripts/prose-licence-card.mjs DS-DEF-2 'Internal Security: court without detention'` in the DEF2 dock.

```
LICENCE (block DS-DEF-2 · role spine · key `Internal Security: court without detention`)
  reads:      court   (not-produced)
              prison   (not-produced)
              (absent => no candidate; a modifier is silent, never "false")
  predicate:  court truthy (no literal)
  bag:        {band: RESERVED, route: proper, settlement: proper}
              FILLED at this block's call sites: {settlement}
  relation:   (a spine takes no relation)   <- a spine IS the seat and carries no relation
  seat/form:  (not a seat-taker) / sentence      move: (none declared)     angle: ledger street unfolding
  attach:     (empty: a spine takes no attach set)
  echo:       spine mounts 1 (tabs: defense) - modifier mounts 0 (none)
              the echo table is keyed on the PRODUCER-TOKEN ROOT `court`, which is coarser
              than this pool's own read `court`: a mount counted there may be reading a
              sibling field of the same root
  covert:     no
  source:     (none) - standing SOURCE-UNRESOLVED
              NO citation is licensed: a face naming a record holder here is refused by arm A13
  THE TEST (ADDENDUM 14, the owner 2026-09-12): a face is LAWFUL unless it CONTRADICTS the record.
              SILENCE IN THE RECORD IS PERMISSION. "The card does not license it" is NOT a finding.
              This card says what the read REACHES, never the bounds of what may be written.
  may claim:  that `court` (truthy (no literal)) holds, as a STANDING fact of the record
  may NOT:    a magnitude outside the read's own band word (floor 2a), an elapsed course, a dated
              cause or a season (floor 2b), a prediction the pulse adjudicates (floor 2b), another
              civic object of the class `law`
  audience:   player (no mark)
  REFUSED COLUMNS, always: a totality over persons; an exemption from a duty (whoIsExempt is null
              everywhere); a named character and that character's fate (product scope); a
              theological claim about a deity (the deity doctrine)
```

### ⚠ FOUR CARD LINES ARE NARROWER OR LOOSER THAN THE CODE, AND THE WRITER MUST KNOW ALL FOUR

1. **`reads: court · prison` is TWO BOOLEANS OVER SIX DIFFERENT BUILDINGS.** `hasCourtSystem` is a substring grep over the roster's native semantic names for **`courthouse` · `court buildings` · `democratic assembly` · `city hall` · `town hall`** (`src/generators/priorityHelpers.js:55`). `hasPrison` greps **`prison` · `stocks` · `large prison` · `massive prison`** (`:54`). The flag does not say which row set it, and the six rows it can fire on are not one thing — one of them (`Democratic assembly`) is not a court in any sense and carries no judicial service at all. **This is the governing fact of the whole packet.**
2. **`source: (none) · SOURCE-UNRESOLVED` — but the citation ban it cites is STRUCK.** The recut strikes **A13's citation ban entire** and **W24 the record-word bar entire**: accounts, returns, duties, ledgers, minutes, the docket, the writ, a licence are all free vocabulary, and the `[ledger]` stance may cite its own record. What survives is **F1-24** only: a record CITED to a keeper the card cannot resolve. Since this card resolves no holder, the rule for this pool is simple — **the record WORDS are free everywhere; a named keeper is not.**
3. **THE CLOCK. This pool is on the FROZEN one.** `defenseThreatProse` reads `settlement.economicState.compound.inst` (`src/domain/display/stateProse/defenseStateProse.js:620`, `:657-659`), which is a **generation-time snapshot never rebuilt** — rows 1 and 2 of this block were cured onto the LIVE roster (`standingDefenseForces`), rows 3, 4 and 5 were not (`DefenseTab.jsx:317-321`; contradiction table **W-11**). A courthouse razed by a calamity still reads `hasCourtSystem: true` here. The tab's own eyebrow says the bars are **as judged at the first survey**, and **R-2** rules that a frozen reading disagreeing with a live one is NOT a contradiction. A refuter may not fail a face on this seam; a writer should simply not reach for a live posture word.
4. **`angle: ledger street unfolding` is alphabetical; the CORPUS ORDER is ledger (vid 1), street (vid 2), unfolding (vid 3).** Rewrite one for one against the vids below.

---

## 0.2 THE BLOCK'S HEADER LINES (annex `### DS-DEF-2`, the parts that bind this pool)

- **RECEIPT:** `src/domain/display/threatAssessment.js:28-195` (`buildThreatAssessment`) · rendered `src/components/new/tabs/DefenseTab.jsx:150-183` · the pool key `src/domain/display/stateProse/defenseStateProse.js:506-510` (`internalRowPoolKey`).
- **STATE-KEY:** five fixed rows, each with a `scoreBand` badge (`STRONG` / `ADEQUATE` / `WEAK` / `CRITICAL`) rendered beside the prose. **This pool is row 3's `court && !prison` branch**, and row 3's badge is `scoreBand(scores.internal)`.
- **SLOTS:** the block declares `{settlement}` `{band}` `{route}`; only `{settlement}` is filled at the call site. **In this pool vids 1 and 3 carry `{settlement}`; vid 2 carries NO SLOT AT ALL.** A face whose `{slot}` set differs from its parent variant's is refused by the projector (ARCH §2.5, the face sub-row rule) — so **all four faces of vid 2 must be slot-free**, and all four faces of vids 1 and 3 must name `{settlement}` exactly once.
- **SECTION-TARGET:** `defense`.
- **PROVENANCE + FENCE.** The `buildThreatAssessment` lattice is dossier-native and this pool EXTENDS it; each branch holds exactly ONE string today, so every settlement in the branch says the same words. **Institution presence is a STANDING fact with no recorded history; the causal clauses here are *capability* clauses (a bench without a cell cannot confine) and never *historical* ones (the gaol fell down) unless the history surface supplies the ancestry.**
- **ROW 3 IS THE ONE ROW OF THE FIVE WITH NO KEY TABLE, DELIBERATELY** (`defenseStateProse.js:369-377`): its four pools resolve on wiring-census rung 1 with a REAL read set `["court","prison"]`, the block's only fact pair, because the key returns plain literals from guarded branches. The fact budget is therefore **k ≤ 1** on every Internal cell (ARCH §6.4) — one modifier may ever attach here, and **none is attached today** (`attach: []`, `defense.generated.js:1242-1257`).
- **PDF PARITY:** parity (`viewModel.js` defense slice), through `deriveDefenseReadiness`.

## 0.3 THE REGISTER CARD'S SIX ONE-LINE REGISTERS (the writer aims at the first)

- **The dossier:** the record itself; the clerk's third person; the six shapes of its closed set; the town's name is not the default opener.
- **The NPC ladder:** read aloud to the players; role-bound; never a named interior; the stage licenses the claim, never the shape.
- **The Herald:** the estate's one quoted in-world voice; report mode; flattest where hottest; the bill lands apart from the deed.
- **The chronicle:** a borrowed body of headlines; its own prose is frames and dressings; the quiet year is one sentence of varied shape.
- **The DM page:** candid; the why only from a typed field; second person to the referee alone; it grades, never hedges.
- **Chrome and the docent:** never the archivist; the product speaking to the person who runs it; mechanics first, one term per thing.

**THIS POOL IS DOSSIER-ARCHIVIST (R1 STATE).** The other five are named to fence it, not to license it.

## 0.4 THE WRITING LAWS THAT BITE HARDEST HERE

- **FOUR FACES PER VARIANT**, each a different vocabulary or rhythm inside the voice, never a paraphrase of a sibling. An unweighted seeded roll picks the face at render, so **every face stands alone**. NEVER TRIM (Part B §22): the variant count and face count are ratchets; a face that fails stays in the annex as a refusal row.
- **THE THREAD (MOVE-GRAMMAR §1.4.1, an owner wall).** This pool is a SPINE and sits FIRST in its unit. Every face must hand a noun forward that a later modifier could pick up — *the court, the bench, the hall, the purse, the road, the judgement, the door* — and must close on a standing fact rather than a set-up. **Zero modifiers attach here today**, so no sibling text is guaranteed to follow: the face must read as a complete unit alone AND as an opener. The composer places the spine first and modifiers by salience; write so the face survives either.
- **S2, THE CLAUSE SEAT.** One computed CONSEQUENCE of the sentence's own fact may ride as a clause, with one joint, the joint's own comma and a word from the connectives list, **never "which"**, the whole unit two sentences at most. Every other second fact takes its own sentence.
- **THE HARD WALLS:** no em dash, no exclamation, no digit or percent in a connective, no which-clause, no question, no second person, no forecast (the edge is subjunctive), no figure on an abstraction.
- **THE DENSITY LAW (Part B §21.4).** Compression and idiom that reward the reader are part of the ceiling. "Unclear" is not a finding unless a law is broken. Never trade density for plainness.
- **THE CEILING, NOT THE MIDDLE (§21.1).** The band is a licence, not a target. Aim at the sharpest licensed fact, the strongest rhythm, the widest sibling distance.
- **ORDER CONSTRAINT 10:** the `{settlement}` token opens at most ONE variant per pool and never two adjacent. Vid 1 opens on it today; vid 3 buries it. Keep that distribution or improve it.
- **A11's SPREAD:** no two variants of one pool share their first two words, and where they differed in sentence count and grammar they keep differing.

---

## 0.5 ⭐ THE READS THIS POOL REACHES — MATERIAL A WRITER MAY USE, never a bound on what may be written

The predicate is one function of two booleans, the block's only fact pair (`defenseStateProse.js:506-510`):

```
export function internalRowPoolKey(court, prison) {
  if (court && prison) return 'Internal Security: full legal chain (court AND prison)';
  if (court) return 'Internal Security: court without detention';
  return prison ? 'Internal Security: detention without process' : 'Internal Security: no legal infrastructure';
}
```

Called as `internalRowPoolKey(civicFlag(compound.hasCourtSystem), civicFlag(compound.hasPrison))` with `compound = settlement.economicState.compound.inst` (`:620`, `:657-659`); `civicFlag` is a strict `=== true` (`:309-311`).

| read | what it holds on this key | what it puts in a writer's hand | what the record can deny about it |
|---|---|---|---|
| `compound.inst.hasCourtSystem === true` | at least one roster row whose lowercased native semantic name contains `courthouse`, `court buildings`, `democratic assembly`, `city hall` or `town hall` (`priorityHelpers.js:55`) | a standing civic body that hears and decides. The WORD "court" is FREE (contradiction table **R-4**). Six different rows can set it, and their printed descriptions are the richest material in the packet — see §0.5a | **THE PROCEDURE, on a large part of the range.** **F1-12**: the flag fires on the `Town hall`, which is *a meeting place and administrative centre* (`institutionVocabulary.js:283`) whose only recorded judicial service is *commercial and civil disputes before a magistrate* (`institutionServices.js:1625`). A criminal trial, a sentence, a gaoling or a gallows off a hall-only town is the finding |
| `compound.inst.hasPrison === false` | **no** roster row containing `prison` OR **`stocks`** (`priorityHelpers.js:54`) | no cell, no gaol, no holding of any kind — **and no stocks and no pillory either**, because `Small prison/stocks` is the row that carries both (`institutionServices.js:1635-1639`) | the inverse direction only (**F1-25**): a face asserting a cell, a lock-up, a pit, a post, the stocks, a night in irons, or a public shaming apparatus is contradicted by the flag the pool key itself reads |

### 0.5a THE SIX ROWS BEHIND THE ONE FLAG — the material, with its own printed words

| row | tier | required? | what the reader is shown beside the prose | its recorded services |
|---|---|---|---|---|
| `Town hall` | town | **required: true** (`institutionalCatalog.js:1550-1556`) | *A meeting place and administrative centre where a town's civic business is done* (`institutionVocabulary.js:283`) | Permit applications · **Dispute arbitration** (commercial and civil, before a magistrate) · Tax payment · Record filing (`institutionServices.js:1622-1627`). **No criminal procedure whatever** |
| `Courthouse` | town | optional, `baseChance: 0.6` (`:1557-1563`) | *A borough court where local justice is heard and judgement handed down* (`:284`) | Civil disputes · **Criminal trials** (*Judge crimes*) · Notary services · Legal education (`institutionServices.js:89-94`) |
| `City hall` | city | **required: true** (`:2268-2273`) | *An imposing civic building that houses a city's government and announces its importance* (`:287`) | Civic licensing · **Appeals court** · Public record access · Contract witnessing (`institutionServices.js:1628-1633`) |
| `Multiple courthouses` | city | **required: true** (`:2274-2281`) | *Separate commercial, criminal, and religious courts, because one bench cannot hear a city's business* (`:288`) | the courthouse set, at scale |
| `Multiple court buildings` | metropolis | optional, `baseChance: 0.65` (`:2338-2344`) | *Separate courts, commercial, criminal, appellate, and religious, sitting at once in a great city* (`:275`) | as above |
| `Democratic assembly` | city | optional, `baseChance: 0.2`, `exclusiveGroup: 'government'` (`:1884-1891`) | *A citizen assembly holding formal authority, debating and voting on the city's major questions* (`:271`) | **none judicial.** It sets the court flag and hears nothing |

⭐ **The consequence a writer must hold in one hand:** at TOWN tier the flag is set by a REQUIRED row that hears no crime, and the criminal bench is a 60 % coin beside it. At CITY the criminal courts are REQUIRED (`Multiple courthouses`) and the flag is honest. At METROPOLIS nothing is required at all: the seat row is `Palace/government complex` (`:2331-2337`), which matches NO court keyword, so a metropolis reads this pool only where the 0.65 coin for `Multiple court buildings` fell and the 0.5 coin for `Massive prison` did not. **The pool key cannot tell the two apart**, and a face must be true of both.

### 0.5b THE READS THE DESK PERFORMS THAT THIS KEY DOES NOT REACH

- `scoreBand(scores.internal)` renders the badge beside this very prose (`DefenseTab.jsx:334-341`). It is computed from different inputs than the key — court **+20**, prison +15, garrison +15, watch +18, militia +8, charter +5, arcane and divine bonuses, then `milEffective × 0.25` where any law body stands, then the order-purse gate (floor 0.65), then **minus `crimEffective × 0.4`** (`defenseGenerator.js:230-256`). **So this pool prints beside STRONG, ADEQUATE, WEAK and CRITICAL alike.** Contradiction table **W-10** rules this an INSTRUMENT row: the card must print the band spread over the key's domain before any intensity word here is refutable either way.
- **The funding note prints in plain English directly beneath this row** when the order gate bites: `Upkeep underfunded: watch and court funding at 65%` (`defenseDisplay.js:278-284` `READINESS_GATE_FOR['Internal Security'] = ['internal', 'watch and court funding']`, rendered `DefenseTab.jsx:342-343`). The writer states no figure, but should know the page can say the court's money is short right under the sentence.
- **The engine's own assessment string for this exact branch**, inside the expandable row the reader clicks: `Internal security: <safetyLabel>. ` + (a `Dangerous` clause) + **`Courts prosecute but limited detention.`** (`threatAssessment.js:140-150`). A face that paraphrases this is DULL against a panel the reader can open on the same row.
- **DS-DEF-6's Legal Infrastructure note**, `Court only` / **`Courts without detention. Fines and exile only.`** (`defenseDisplay.js:231-233`) — rendered inside a `collapsible defaultOpen={false}` section (`DefenseTab.jsx:534`), so it is usually unseen, but it is the engine asserting the fines-and-exile reading on the same tab. The DS-DEF-6 *corpus pool* `Legal Infrastructure: Court only` is C3-BLOCKED and never speaks (`defenseStateProse.js` `DEF6_C3_BLOCKED_POOLS`), with `DEF6_FACT_SPOKEN_AT['Legal Infrastructure'] = 'defense.threatAssessment'` — **this pool is the estate's one speaking position for this fact.**
- `safetyProfile.js:327-333`'s `prisonNote` fires on this branch as **`A court exists, though the prison system is limited.`** ⚠ note the shipped vid 1 borrows *fines, exile, or summary violence* from the branch BELOW it (`:333`), which fires only where there is NEITHER court NOR prison. That is a craft observation, not a finding.
- **Unread by this key, therefore not the pool's material:** the tier, `config.monsterThreat`, `config.stressTypes`, the safety label, the criminal-capture rung, the criminal structure, the walls, any force bucket, the food surfaces, the culture profile, the terrain, the route, and **`history` — unread by every state-prose pool key in the estate** (F2-09).

## 0.6 THE PROVENANCE MOVE, PRICED FOR THIS POOL

The card resolves **no holder** and prints SOURCE-UNRESOLVED. The provenance ceiling is ONE citation per unit and only for one of S3's three reasons (two accounts that disagree; a count from an interested party; a record whose keeper is a power). **None obtains here**, and a cited keeper would land squarely on **F1-24** (a record cited to a keeper the card cannot resolve). The exemplar registers with raw text cite at zero per 786 sentences. **Recommendation: zero citations in this pool.**

But the RECORD VOCABULARY is free and this is the pool it was made for: **W24 is struck entire**, so the docket, the roll, the entry, the minutes, the writ, the licence, the register, the copy, the hand that writes it are all available words — **that is vocabulary, not a citation, and it costs nothing.** The `[ledger]` face in particular may cite its own record freely. What is barred is naming a KEEPER (*the magistrate's own book*, *the assembly's clerk keeps*) as the authority for the claim.

---

## VARIANT 1 · vid 1 · `[ledger]` · slots `{settlement}` · opens on the settlement token

### 1.1 The shipped sentence, verbatim

> {settlement} tries offences it cannot hold anyone for; the sentences available here are money and exile, and both of them fall unevenly.

### 1.2 Every claim it makes, on the new test

- **A standing civic body exists that hears and decides.** — **SAFE.** `hasCourtSystem === true` is the predicate, and **R-4** settles the word outright: *the WORD "court" is free; the criminal PROCEDURE is the finding.* The engine's own reading of this flag is a court system.
- **That body TRIES OFFENCES — a criminal trial, on a criminal charge.** — **CONTRADICTED on a large part of the key's range, and this is the variant's central fault. Row F1-12.** The flag fires on the `Town hall`, which is `required: true` at town tier (`institutionalCatalog.js:1550-1556`) and is printed to the reader as *a meeting place and administrative centre* (`institutionVocabulary.js:283`); its only recorded judicial service is *commercial and civil disputes before a magistrate* (`institutionServices.js:1625`). The criminal bench, `Courthouse`, is a separate `baseChance: 0.6` row, and `Democratic assembly` hears nothing at all. **The record is the roster row plus its service table**, both of which the reader can open on the same dossier. At city the claim is true (`Multiple courthouses`, required, explicitly criminal); the pool key cannot tell, so **a face must be true on the hall-only town.** The safe direction is what the body DOES do on every row: it hears, it names, it decides, it hands down a judgement.
- **It CANNOT HOLD ANYONE.** — **SAFE, and it is the pool's whole discriminating claim.** `hasPrison === false` by the predicate; DS-DEF-6 prints `Courts without detention` beside it (`defenseDisplay.js:233`); `threatAssessment.js:147` prints *Courts prosecute but limited detention* in the expandable row. ⚠ The absence is **wider than a prison**: `hasPrison` greps `stocks` too (`priorityHelpers.js:54`), so this town has no cell, no lock-up, no post, no pillory and no public-shaming apparatus of any kind (`institutionServices.js:1635-1639` — `Small prison/stocks` is the single row carrying *Holding cells*, *Public punishment* and *Fine payment*). **Not even for an afternoon, and not even the cheap public kind.**
- **THE SENTENCES AVAILABLE ARE MONEY AND EXILE.** — **SAFE as two named sentences.** Nothing in the record denies either, and the engine asserts the same two words on the same tab (`defenseDisplay.js:233`). Exile is additionally MODELLED: the world pulse carries a banishment door (`npcLedger.js:756` `addExclusionEdge`, *the banishment door*; `warAuthorityVerdict.js:23` `'banished'` among the authority verdicts) and the projector's own comment warns against inventing *a banishment that no court ever pronounced* (`npcLedgerProjection.js:116`) — which is the warning against narrating a PARTICULAR exile (**F2-04**), not against naming exile as an available sentence. ⚠ Note for the record: the shipped row borrows *fines, exile, or summary violence* from `safetyProfile.js:333`, which fires only where there is NEITHER court NOR prison. The phrasing is imported from the wrong branch. That is craft, not a finding.
- **THOSE TWO ARE THE ONLY SENTENCES AVAILABLE — an exhaustive set.** — **CONTRADICTED on the city slice, and this is the finding nobody has named.** At city the roster can seat a **`Workhouse`** (`institutionalCatalog.js:2289-2295`, `baseChance: 0.25`), printed to the reader as *a house where the able-bodied poor are given shelter and food in return for hard, compulsory labour, kept deliberately harsh* (`institutionVocabulary.js:290`) — and **it matches none of `hasPrison`'s four keywords**, so a city may carry compulsory labour and still read `court without detention`. A face that closes the list at money and the road is false on that town. The exhaustive shape is also **F1-34**'s totality shape by family. **Write the two as what the bench reaches for, never as the whole of what the town can do.**
- **BOTH OF THEM FALL UNEVENLY — a distributive claim about who is hurt.** — **SAFE, and it is the best thing in the shipped row.** Nothing in the record touches the incidence of a fine or a banishment; the silence is total and therefore the writer's. ⚠ Keep it clear of a magnitude (**F2-01**) and of a totality over persons (a REFUSED COLUMN in terms).
- **The semicolon joint and the trailing "and" clause.** — craft, not claims. The unit is one sentence carrying three beats; **S2 allows exactly one computed consequence to ride as a clause**, and this row spends its joint on a second independent fact (what the sentences ARE) rather than on a consequence of the first. The lawful rewrite either splits it into two sentences or makes the rider a genuine consequence of the inability to hold.

### 1.3 The reads this pool reaches (material for the rewrite of vid 1)

- `hasCourtSystem`: a bench, a hall, a chamber, an assembly, a hearing, a judgement handed down — **and the six printed descriptions at §0.5a, which are the richest unused material in the packet.** The `Town hall`'s own four services (permits, arbitration, taxes, record filing) put the wrong in a queue among deeds and licences. The `Courthouse`'s own words are *local justice heard and judgement handed down*.
- `hasPrison === false`: no cell, no gaol, no stocks, no pillory, no holding for any length of time, no fine-payment desk, no place to put a person between the naming and the leaving.
- The whole RECORD VOCABULARY, struck free by the recut (W24 entire): the entry, the docket, the roll, the minutes, the copy, the writ, a licence, the register, an account. **The `[ledger]` stance may cite its own record.**
- **The order purse, in the engine's own English:** one gate over *watch wages, court and gaol funding* (`defenseGenerator.js:246`), floor 0.65, and the row prints `Upkeep underfunded: watch and court funding at 65%` directly beneath this prose (`defenseDisplay.js:281`, `:319-321`). The purse has a gaol in its name and this town has none.
- **The engine's positive model that the bench WORKS:** court `+20` to internal order (`defenseGenerator.js:232`) and `courtOrderFloor` lifts a criminal-org town to a Moderate floor at town and city, on the comment *a court system actively suppresses crime even if not eliminating it* (`safetyProfile.js:62-71`); `:283` prints *A functioning court system means organized crime operates with greater caution.* **Futility is not the record's reading.**
- **An unnamed person may act.** W22's person bar is struck by name: a clerk, a collector, an overseer, a reeve, a bystander, a plural of any of them may appear, act, keep a key, refuse, be avoided, be resented. ⚠ The one bar that survives is **F3-06** — see §1.4.
- NOT reached and deliberately unread: the tier, the monster country, the stress roster, the safety label, the criminal structure, the walls, any force, the food, the culture profile, the terrain, the route, the history.

### 1.4 ⭐ WHAT WOULD BE FALSE HERE

**Contradiction-table rows this pool's key can actually walk into:**

| row | the claim that would be false | the field that denies it |
|---|---|---|
| **F1-12** ⭐ | a criminal TRIAL, a criminal SENTENCE, a gaoling, a gallows, a courthouse BUILDING — where the flag was set by a `Town hall`, a `City hall` or a `Democratic assembly` | `priorityHelpers.js:55`; `institutionVocabulary.js:283`, `:271`, `:287`; `institutionServices.js:1622-1633` (the only recorded procedure is civil/commercial). **The WORD "court" is free (R-4); the criminal procedure is the finding.** THE row of this packet |
| **F1-13** ⭐ | a prison, a gaol, a cell, a lock-up, **the stocks, the pillory, a night in irons, a post in the square, a public shaming** | `inst.hasPrison` false, `priorityHelpers.js:54` — the grep includes `stocks`; `institutionServices.js:1635-1639` puts *Holding cells*, *Public punishment* and *Fine payment* on the one denied row. The pool key reads this flag itself |
| **F1-25** | the NEGATION direction — "no law here", "nowhere to take a complaint", "no authority hears anything" | the same flag read the other way; the sibling pool `Internal Security: no legal infrastructure` is where that sentence lives. At town `Town hall` is `required: true` and at city `City hall` and `Multiple courthouses` are both required |
| **F1-24** | a record cited to a NAMED KEEPER — *the magistrate's own book*, *the assembly's clerk keeps the roll* | the card prints SOURCE-UNRESOLVED; `holderTable.js:243-247`; `composedWalker.js:1071-1073`. **The record WORDS are free (W24 struck); the CITATION needs a holder this card cannot resolve** |
| **F1-30** | denying anything a CUSTOM roster row supplies — a DM's gaol, a DM's assize | `customContentSemanticAuthority.js:22-32`; FOLD 59's custom-content parity. **Write around an absence rather than asserting a global one** |
| **F1-31** | naming a TIER the identity strip does not print | `{r.tier}` prints verbatim beside the name, `OverviewTab.jsx:247`. ⚠ **This pool is in practice a TOWN-AND-UP pool** (see §1.5), which makes a tier word tempting and no less barred. Write around it |
| **F1-34** | a TOTALITY — "nothing is ever punished here", "no one has ever answered for anything", "everyone gets away with it"; and the exhaustive-sentence-list shape | the model runs the other way (court +20; `courtOrderFloor`); `threatAssessment.js:140-150` builds this row for EVERY town. **Ease and reach at the town's own grain are free** |
| **F1-40 / F1-107 / W-10** | outrunning the `scoreBand(scores.internal)` BADGE printed beside this prose, or borrowing another arm's | `defenseGenerator.js:230-256`, `:487-522`; `defenseScoreBands.js:37-39`. ⚠ **W-10**: the key is two booleans and the badge is a continuous score minus crime pressure, so an intensity word here is INSTRUMENT-HELD and not refutable either way. Prefer an intensity that comes from the ARRANGEMENT — one instrument missing from a working bench — rather than from a grade |
| **F1-35 / F1-37 / F1-38** | reading a label at its English sense on the same page — `Controlled — Authoritarian` as "well-policed", the capture rungs as English, "no organized crime here" off a `null` structure | `safetyProfile.js:103-108`, `:240-246`; `PowerTab.jsx:163-169`; `defenseDisplay.js:142-195`. **The key reads none of these and they all print on the same dossier** |
| **F1-111 / F4-14** | clean hands or an unbought bench where the roster MANDATES a `'Corrupt Official'` (under `occupied` / `insurgency`) or a revealed impairment prints | `npcGenerator.js:1511-1532`; `corruption.js:654-658`. The key never reads stress |
| **F1-126** | a minted PROPER NAME borne by the face — a magistrate, a street, a family, a case | a pooled face is authored once and drawn by every matching town, so the name prints identically across a region. `{settlement}` is this pool's only slot |
| **F2-01** ⭐ | ANY magnitude, digit or word — a count of cases, a sum of a fine, a share of offenders, a number of benches, a headcount of the exiled, "a handful", "most" | the band vocabularies are closed; `demographicsHerald.js:70-80` is the trap in miniature. *More of them than the bench can settle* is the hook |
| **F2-02 / F2-03 / F2-04 / F2-05 / F2-07 / F2-08** ⭐ | a date, a season, a duration, a founding of the hall, an event the record did not run (*the gaol burned*, *the last man exiled*), an ELAPSED COURSE (*has been*, *still*, *no longer*, *again*, *since*, *thinner than it was*), an age of fabric against the printed age, a TREND | `ageBands.js`'s `HISTORICIZE_BAND`; `institutionFounding.js` (*absence is the typed value*); `OverviewTab.jsx:251`. ⚠ age-FLAVOUR is free where the printed age does not deny it — *a room older than the business done in it* is lawful |
| **F2-06** | a RATE — "most weeks", "seldom", "more often than not", "every quarter-day" | nothing bands a rate anywhere in the engine. *The door stands open* is lawful; the rate form is not |
| **F2-09** | a dependency on a field the key cannot see — the walls, the watch, the criminal structure, the safety label, the stress banner, the food, **the history** | no key function of this block reads any of them; `historyPreservation.js:1-30` (a reroll replaces history wholesale) |
| **F3-05** ⭐ | cultural furniture the culture profile denies — a churchyard, a market green, a thatched lane, a pillory on a village green, snow on the road — on an `arabic`, `east_asian`, `mesoamerican`, `south_asian` or `steppe` profile | `cultureProfiles.js:50-600`, rendered `dailyLifeLogic.js:14`. **No defense pool reads the profile.** The recut names this the finding most likely to recur in every block |
| **F3-06** ⭐ | an UNNAMED person's act on an office the tier or the stress emits as a NAMED NPC — **"the magistrate", singular** | `TIER_MANDATORY_ROLES` seats a **Mayor** and a **Guard Captain** at village-plus and a **Governor** / **City Watch Chief** at metropolis; `STRESS_MANDATORY_ROLES` seats a **Chief Magistrate** under `recently_betrayed`, `succession_void` and `insurgency` (`npcGenerator.js:1511-1532`), each with a generated personality, disposition and secret. **The key never reads stress, so the magistrate trap is live across the preimage.** Use a plural (*the magistrates*, *those who hear it*), a trade, a clerk, a bystander, or an office the roster does not seat |
| **F4-02 / F4-03** ⭐ | SPLITTING THE PURSE or the gates' direction — the bench funded while the watch starves, the court kept and the order money gone elsewhere | `defenseGenerator.js:246-256` — ONE multiplier `min(1, 0.65 + econOutput/50 × 0.35)` over *watch wages, court and gaol funding* together; all four gates move on ONE input and differ in degree only. **F4-19 in terms: the watch arms BOTH purses.** What IS licensed: that the charge is ONE charge, and that its printed name carries a gaol this town has not got |
| **F4-04** | a TOTAL collapse — "nothing is funded", "the bench has stopped sitting" | every gate has a floor (0.65 here) and the community baseline is exempt (`defenseGenerator.js:250-256`). The licensed extreme is short, late, thin — never none |
| **F4-13** | a PLAYER face naming a fact the engine flags COVERT — a covert impairment, a covert bloc, the unexposed stooge | `corruption.js:670-689`; `settlementPolitics.js:423-436`. **The positive move nobody used: the player face may say the town DOES NOT KNOW, and the not-knowing is the hook** |
| **W-11 / R-2** | a LIVE posture word on this row | rows 3 to 5 read the frozen `compound.inst` snapshot (`DefenseTab.jsx:317-321`). **A refuter may NOT fail a face for disagreeing with a live band** (R-2), but a writer should not reach for one either |

**THE CLOSED ROSTERS THIS POOL TOUCHES (floor 1).** A body, building, record-keeper, force or faith-house the roster does not carry may not be asserted. The two that bind here are grep sets, not lists, and they are worth memorising:
- **the court set** — a roster name containing `courthouse` · `court buildings` · `democratic assembly` · `city hall` · `town hall` (`priorityHelpers.js:55`). **An assize, a moot, a tribunal, a chancery, a bench of elders is NOT in the set** and may not be asserted as this town's institution — though `entities.js:175` tags `court|town hall|council|magistrate|chancery|moot|tribunal` as CIVIC/LEGAL, so those words exist in the estate's vocabulary and are free as *description of what the rostered room does*, never as a second building.
- **the detention set** — `prison` · `stocks` · `large prison` · `massive prison` (`priorityHelpers.js:54`). **All four are false here.**
- Also closed and touched in passing: the NPC office roster (F3-06), the faction list, the live institution roster over the frozen snapshot.

**Not a faith pool.** The deity's four axes, the DERIVED temper (`deityTemper()`, never the inert stored `temperamentAxis`), the PANTHEON rank, the SETTLEMENT standing and the `suppressed` flag do not arise here, and no face may reach for any of them.

### 1.5 ⭐ THE PREIMAGE — the range of towns this key selects

`court && !prison` fires on **every settlement whose FROZEN `economicState.compound.inst` snapshot carries a court-keyword roster row and no detention-keyword row**, and on nothing else about the town. That is:

- **TOWN AND UP, in practice — and this pool is alone in the block in that.** No default catalogue row below town matches either keyword: the court rows seat at town (`Town hall`, required; `Courthouse`, 0.6), city (`City hall` and `Multiple courthouses`, both required; `Democratic assembly`, 0.2) and metropolis (`Multiple court buildings`, 0.65, with the seat row `Palace/government complex` matching nothing). **Below town only a CUSTOM roster row reaches it** — and it does, at any tier, because the test is the FLAG on THIS town, never the tier (**F1-30**, **R-6**). So a thorp with a DM-added town hall reads this same pool.
- **With a criminal bench and without one.** At town the flag is set by a required administrative room and the criminal court is a 0.6 coin beside it; at city the criminal courts are required. **The same sentence prints on both.**
- **With a `Workhouse` standing and without one.** At city, 0.25, compulsory labour, invisible to `hasPrison`.
- **Every monster country, every stress state.** `config.monsterThreat` and `config.stressTypes` are unread. This pool prints under `under_siege`, `occupied`, `insurgency`, `famine`, `plague_onset`, `succession_void`, `recently_betrayed` and the rest, each of which renders its own banner on the same dossier — and three of them seat a **Chief Magistrate** on the NPC tab.
- **Every safety label, from `Very Safe` to `Dangerous — Criminal Governance` and `Controlled — Authoritarian`** (`safetyProfile.js:240-315`), and every criminal-capture rung. The panel beside this prose can read *A functioning court system means organized crime operates with greater caution* or *Violence and theft are routine.*
- **Every internal band.** The badge is `scoreBand(scores.internal)` and the court contributes only +20 of it before the crime subtraction, so **STRONG, ADEQUATE, WEAK and CRITICAL all print beside this sentence.**
- **Every walls state, every force, every route, terrain, culture profile, prosperity rung and population band** — none of which the key reads.
- **The FROZEN clock.** A court razed by a calamity after the first survey still reads present here (W-11).

**A face must contradict no state in that range, not merely the town on this skeleton.**

### 1.6 The angle's stance in one sentence

`[ledger]` is the clerk's view — what the books, entries, dockets and duties show — so here it may enter the hearing and the missing cell as two standing facts of one office, in the office's own record vocabulary, and it may NOT count the cases, price the fine, date the entry, name the keeper, assert a criminal trial where the rostered room hears only civil business, rate the bench against a badge computed from other inputs, or close the list of what the town can do.

### 1.7 The turns worth keeping

- *it cannot hold anyone for* — the inability to HOLD, stated as a capability rather than a failure, is the pool's discriminating claim and the shipped row's best asset. Keep the inability in every face; it is what separates this pool from `full legal chain` and from `detention without process`.
- *money and exile* / *the purse or the road* — the two named sentences are lawful, concrete and free. **Keep the pair; drop the exhaustiveness.**
- *both of them fall unevenly* — a distributive observation on total record silence. This is the model of what floor-2's own conversion note asks for: not a count, a condition. Worth carrying into at least one face, in different words.
- ⛔ *tries offences* — the criminal-procedure claim. It must go in every face, replaced by what the body does on every row of the range: hears, names, decides, hands down.
- ⛔ The semicolon is the shipped joint; keep at most one face on it so the pool does not collapse onto one punctuation.

### 1.8 ⭐ WHERE THE FLAVOUR IS (vid 1)

- **THE COURT IS A ROOM WHERE THE TOWN'S BUSINESS IS DONE, AND THE WRONG ARRIVES IN IT AMONG THE DEEDS.** On the whole town-tier slice the flag's only guaranteed row is the `Town hall`, whose four recorded services are permits, arbitration, taxes and record filing (`institutionServices.js:1622-1627`); the city hall's are licensing, appeals, the archive and contract witnessing (`:1628-1633`). So the place where a wrong is named is the same table where a deed is registered and a levy is paid, on the same days, with the same queue. **Nothing in the record denies a docket, a bell, a lamp lit late, a clerk who writes the complaint between two licences, a man who comes back a third time and is told to wait again.** The `[ledger]` angle owns this outright, because the ledger is exactly where a grievance and a building permit meet on one page. It is also the licensed cure for `tries offences`: the body does not try, it **enters**.
- **THERE ARE NO STOCKS, AND THAT IS A SHARPER ABSENCE THAN NO PRISON.** `hasPrison` greps `stocks` as well as `prison`, so this key denies the post and the pillory by name — the cheap, public, half-day punishment that every reader assumes a town of this size has. `Small prison/stocks` is one row carrying *Holding cells*, *Public punishment* and *Fine payment* together (`institutionServices.js:1635-1639`), and all three go at once. **What that looks like on the ground: a judgement is handed down and the person it fell on walks out of the same door as the people who came to watch, at the same hour, into the same street.** There is nowhere to put a man for an afternoon and no crowd to put him in front of. That is the concrete, particular thing the shipped rows never reached for.
- **THE LINE ITEM HAS A GAOL IN ITS NAME AND THE TOWN HAS NONE.** The order gate's own English is *watch wages, court and gaol funding* (`defenseGenerator.js:246`), and the row prints `Upkeep underfunded: watch and court funding at 65%` beneath this very prose when it bites (`defenseDisplay.js:281`). So the standing charge that pays for this town's order is written for a chain of three links and the town keeps two. ⚠ **F4-02/F4-03 bar SPLITTING the purse** — the wages and the court money move together, always. What is licensed and unused is that the charge is ONE charge with a third head on it that this town never spends against.
- **THE BENCH IS WORKING. THE RECORD SAYS SO TWICE.** Court `+20` to internal order (`defenseGenerator.js:232`), and `courtOrderFloor` lifts a town carrying organised crime to a Moderate floor on the comment that a court system actively suppresses crime (`safetyProfile.js:62-71`, `:283`). **So futility is the one reading the engine forbids.** The licensed and much better story is a working instrument with one arm missing: everything the bench can do, it does, and it stops at the door.

### 1.9 What would make the rewrite of vid 1 a regression

Vid 1 not first, or not `[ledger]`, or its slot set not `{settlement}` exactly once, or fewer than four faces, or no longer the pool's canonical index-zero line. Any face that loses the INABILITY TO HOLD, because without it the face is claim-identical to `full legal chain`'s. Any face carrying a criminal trial, a criminal sentence, a gaoling, a gallows or a courthouse building in any spelling. Any face naming a cell, the stocks, the pillory, a post or a public shaming. Any face closing the list of what the town can do. A face carrying a which-clause, an em dash, a digit, a count, a rate, a date, an elapsed course or a named keeper. A face that splits the purse or asserts a total failure of funding. A face that mints a proper name, or puts an act on a singular magistrate. A face that furnishes the scene from the north-European exemplar pack. A face that spells the tier, or that opens on `{settlement}` while a sibling also does (order constraint 10 — vid 1 is the pool's one licensed settlement-opener).

---

## VARIANT 2 · vid 2 · `[street]` · ⛔ **NO SLOT** — the pool's one slot-free variant

### 2.1 The shipped sentence, verbatim

> The town's law can name a wrong and cannot keep the person who did it, so it reaches for the purse or the road.

### 2.2 Every claim it makes, on the new test

- **The town has a LAW — a standing civic thing that decides.** — **SAFE**, and this is the most robust formulation in the whole shipped set. "The town's law" names no building, no bench, no procedure and no office, so it survives every one of the six rows behind the flag, including the `Democratic assembly` that hears nothing judicial. **R-4** makes the court word free; this phrasing does not even need it.
- **That law CAN NAME A WRONG.** — **SAFE across the whole range, and it is the licensed form of vid 1's contradicted claim.** *Naming a wrong* is exactly what the `Town hall`'s `Dispute arbitration` does (*commercial and civil disputes before a magistrate*, `institutionServices.js:1625`), what the `Courthouse`'s `Criminal trials` does (*Judge crimes*, `:91`), and what the `City hall`'s `Appeals court` does (`:1631`). **The rewrite should treat this clause as the packet's discovered cure for F1-12 and reach for its shape, not its words.**
- **It CANNOT KEEP the person who did it.** — **SAFE.** `hasPrison === false` by the predicate. ⚠ *Keep* is the right verb and *hold* is its sibling; both are capability words and neither asserts an apparatus. A face that instead says *there is no cell*, *no stocks*, *nowhere to lock a man* asserts the absence of specific things — which is still lawful here (the flag denies them) but is a narrower and more brittle sentence than the capability form.
- **THERE IS A PERSON WHO DID IT.** — **SAFE.** W22's person bar is struck by name: an UNNAMED person may appear, act, be chased, refuse, be avoided. ⚠ **F3-06** only bars an act placed on the tier's or the stress's SINGULAR office — the Mayor, the Guard Captain, the Governor, the City Watch Chief, the Chief Magistrate. The offender is none of those and is free.
- **THEREFORE it reaches for the purse or the road.** — **SAFE as the two named sentences, and the "so" is lawful.** This is a computed consequence of the sentence's own fact, which **S2** licenses to ride as one clause on one joint with a connectives-list word — the row spends its joint correctly, and it is the only one of the three shipped variants that does.
- **THOSE TWO ARE WHAT IT REACHES FOR — read as exhaustive.** — **⚠ the same exposure as vid 1, but MUCH weaker here.** *Reaches for* is a statement about the bench's habit rather than a closed list of what exists, so the `Workhouse` town (city, `baseChance: 0.25`, compulsory labour, invisible to `hasPrison` — `institutionalCatalog.js:2289-2295`, `institutionVocabulary.js:290`) does not falsify it outright. **This is a craft difference worth preserving: write the reach, never the inventory.**
- **"the town's law" as a possessor construction.** — craft, and free. **W1 possessor binding is struck entire**: *the town's law*, *its bench*, *the hall's business* are flavour, not claims.

### 2.3 The reads this pool reaches (material for the rewrite of vid 2)

- `hasCourtSystem`, at its most portable: a thing that decides, names, finds against, settles, records the finding. **The `[street]` angle wants what a person in the town would actually say about it**, and the record leaves that entirely open: what people bring, what they do not bother bringing, what they agree between themselves rather than take in, who is told to come back.
- `hasPrison === false`, felt at street level: nobody is kept. A matter is heard and the person walks. There is no night to be spent anywhere, no post in the square, no crowd.
- **The two sentences the bench reaches for**, free and concrete: money, and the road. Exile is modelled (`npcLedger.js:756`, the banishment door; `warAuthorityVerdict.js:23`), so the road is not a metaphor.
- **The silence that is this angle's whole estate.** The record says nothing about: what a fine is paid in, who pays it for whom, who cannot pay, where a person put out on the road goes, whether anybody follows them past the last house, what the town says about the ones who paid and stayed, who stops bringing matters in at all. All of it is the writer's.
- Free to the `[street]` stance and not reached by the key: **W27's stance rules are struck entire.** The street may reach for its own nouns and rhythm.
- NOT reached: the tier, the badge, the safety label, the criminal structure, the walls, any force, the stress banner, the history, the culture profile.

### 2.4 ⭐ WHAT WOULD BE FALSE HERE

The table at §1.4 binds this variant unchanged. The rows a `[street]` face walks into HARDEST, because street-level prose reaches for a scene and a body:

| row | the trap this variant specifically invites |
|---|---|
| **F1-13** ⭐ | the street's furniture of punishment — **the stocks, the pillory, a post in the square, a night in the cells, irons**. Every one is denied by the flag the key itself reads (`priorityHelpers.js:54` greps `stocks`; `institutionServices.js:1637`). This is the single likeliest FAIL on this variant, because a street face wants the public, physical thing and the public, physical thing is precisely what is absent |
| **F1-12** | a criminal scene off a hall-only town — a man in the dock, a charge read out, a verdict on a crime. *Naming a wrong* survives; *trying a criminal* does not |
| **F3-05** ⭐ | the street furnished from the exemplar pack — a market green, a churchyard, thatch, a tavern's talk, snow, a north-European lane — on an `arabic`, `east_asian`, `mesoamerican`, `south_asian` or `steppe` profile (`cultureProfiles.js:50-600`). **No defense pool reads the profile, and a `[street]` face is the most exposed face in the block to this row.** Reach for the civic thing the roster names, or for a shape (a queue, a door, a wait) that carries no material |
| **F3-06** ⭐ | the person the street MEETS or complains to — **"the magistrate"**, "the one who hears it", "whoever sits". The tier seats a Mayor and a Guard Captain at village-plus and the stress list seats a **Chief Magistrate** under three stresses (`npcGenerator.js:1511-1532`), each with a generated disposition and a secret. A plural, a trade, a clerk or a bystander is safe; the singular office is not |
| **F1-126** | a minted proper name — a family that paid, a lane the exiled take, a tavern where it is discussed. The face is authored once and printed across a region |
| **F1-25** | the street's cynicism tipped into denial — "there is no law here", "nobody hears anything", "you take it to nobody". At town the hall is `required: true` |
| **F1-34 / F4-13** | the street's reading widened into a totality — "nothing is ever punished", "everyone gets away with it". The engine's model runs the other way (court +20; `courtOrderFloor`). ⚠ **The licensed and better move is not-knowing**: the face may say the town cannot say what became of someone, and the not-knowing is the hook |
| **F2-01 / F2-06** ⭐ | the street's instinct for quantity and frequency — "half the town", "a few coins", "most weeks", "seldom", "three of them last quarter". Both are grammar-decidable and both are the commonest street-register failure |
| **F2-04 / F2-05** | an event the record did not run (*the last man they put out*, *the one who came back*) and the perfect tense that carries it (*has been*, *since*, *no longer*, *again*) |
| **F1-35 / F1-37 / F1-38** | the street reading a label at its English sense — the town described as well-policed where the panel prints `Controlled — Authoritarian`, or as free of organised crime off a `null` structure |

**THE CLOSED ROSTERS**, as at §1.4: the **court grep set** (`courthouse` · `court buildings` · `democratic assembly` · `city hall` · `town hall`) and the **detention grep set** (`prison` · `stocks` · `large prison` · `massive prison`), all four of the second set false; the live institution roster over the frozen snapshot; the NPC office roster; the faction list. **Not a faith pool:** no deity axis, no derived temper, no pantheon rank, no settlement standing, no `suppressed` flag arises.

### 2.5 ⭐ THE PREIMAGE

As §1.5, unchanged, with the three lines that bite this variant restated. **The key never reads the safety label**, so this face prints on a `Very Safe` town where the panel says organised crime operates with greater caution, and on a `Dangerous` one where violence and theft are routine — the street's mood is fixed by the face and the town's is not. **The key never reads the criminal structure or the capture rung**, so the same sentence prints where the panel reads `Organized Syndicate` and where it reads nothing at all. **The key never reads the tier below the custom door**, so a DM's thorp with a town hall meets this sentence as squarely as a metropolis with six benches. A `[street]` face is the most exposed of the three, because street prose implies a place with a size, a look and a temperature, and the only thing the key guarantees is this: something here decides, and nobody here is kept.

### 2.6 The angle's stance in one sentence

`[street]` is what the town knows about itself without being asked — so here it may say plainly what happens to a matter brought in and what happens to the person it was brought against, in the town's own flat idiom, and it may NOT count, date, rate, stage a scene from furniture the culture profile denies, address a singular office the NPC roster seats, name a punishment apparatus the flag denies, or widen its cynicism into a totality the engine's own model refuses.

### 2.7 The turns worth keeping

- *can name a wrong and cannot keep the person who did it* — **the best clause in the pool.** It is true on every row of the range, it carries the discriminating claim, it names no building and no procedure, and it is the direct cure for vid 1's F1-12. Carry its SHAPE into the other variants; do not carry its words, or the pool collapses (A11).
- *so it reaches for the purse or the road* — the joint is a lawful S2 consequence and the two nouns are concrete, short and free. Keep the reach; keep the pair; vary the nouns across the four faces so they are not four spellings of one line.
- *the town's law* as a subject — portable, possessive (W1 struck), and it names nothing the roster could deny. A strong default for at least one face.
- ⛔ The row carries NO `{settlement}` slot and **all four faces must carry none**. It is also the one variant that can open on a noun other than the town's name without competing with vid 1 (order constraint 10).

### 2.8 ⭐ WHERE THE FLAVOUR IS (vid 2)

- **THE PERSON WALKS OUT PAST THE PEOPLE WHO CAME TO WATCH.** No cell, no stocks, no post, no crowd (`priorityHelpers.js:54`; `institutionServices.js:1635-1639`). So the whole physical vocabulary of small-town punishment is missing and the record is silent about what stands in its place — which means the writer owns it entirely. **What a stranger would notice:** the matter is heard and then simply ends; there is no interval, no place to look, nothing to point at afterwards. **What someone would complain about:** that the thing they brought in was settled and the person it was about is in the same street by evening.
- **WHAT PEOPLE STOP BRINGING IN.** The record says the bench works (court +20; `courtOrderFloor`; `safetyProfile.js:283`) and says nothing whatever about what the town declines to take there. A `[street]` face may say that some matters go in and some are settled between houses, and **that is a standing condition, not a course** — it opens a question instead of closing one, which is exactly what floor 2's own conversion note asks for. This is the licensed shape for the thread of futility that vid 3 reaches for illegally.
- **A FINE IS PAID BY SOMEBODY, AND THE ROAD IS WALKED BY SOMEBODY.** Exile is genuinely modelled as a door shut against a person (`npcLedger.js:756`, and a second banishment EXTENDS the sentence rather than replacing it), and nothing in the record says who pays a fine for whom, who cannot pay, or who goes with the person put out. **The unevenness the shipped vid 1 asserts abstractly has a concrete street form nobody has written:** the sentence that costs money is a different sentence depending on whose money it is, and the sentence that is the road is a different sentence depending on who is left behind.
- **THE ROOM IS BUSY WITH OTHER THINGS.** Permits, taxes, deeds, contracts, licences (`institutionServices.js:1622-1633`). The street's version of that is a queue in which a grievance and a cart licence wait the same length of time, and a clerk who has both in the same hand. **Unnamed people are free now** (W22 struck): they may wait, refuse, be sent back, come again, be avoided, be resented.

### 2.9 What would make the rewrite of vid 2 a regression

Vid 2 not second, or not `[street]`, **or any face carrying a slot** — the row is slot-free and the projector refuses a face whose slot set differs from its parent's. Fewer than four faces. Any face that loses either half of the pair (it names, it cannot keep), because the pair is the pool's discriminating claim. Any face naming the stocks, a pillory, a post, a cell or a night held. Any face asserting a criminal trial. Any face that furnishes its street from the exemplar pack's north-European kit, or stages an exchange with a singular magistrate. Any face carrying a count, a share, a rate, a date, a perfect tense, or an event the record did not run. A face that denies the law outright, or widens into "nothing is ever punished". A face that shares its first two words with a sibling (A11), or that merely re-spells the shipped clause four times.

---

## VARIANT 3 · vid 3 · `[unfolding]` · slots `{settlement}` (mid-sentence, not the opener)

### 3.1 The shipped sentence, verbatim

> Each judgment {settlement} cannot enforce costs the next one a little of its weight, and the town's courts are spending down a reputation they cannot replace.

### 3.2 Every claim it makes, on the new test

- **There are JUDGMENTS — the body decides.** — **SAFE** in itself (the predicate), **CONTRADICTED where *judgment* is read as a criminal verdict** on the hall-only slice, exactly as vid 1's *tries offences*. **Row F1-12.** The `Courthouse`'s own printed words are *judgement handed down* (`institutionVocabulary.js:284`), so the noun is the engine's own where that row stands; the `Town hall` hands down an arbitration and the `Democratic assembly` hands down nothing.
- **EACH judgment CANNOT BE ENFORCED.** — ⭐ **CONTRADICTED by floor 4, and this is the variant's central and most serious fault.** The engine models the court as WORKING: `hasCourtSystem` adds **+20** to internal order (`defenseGenerator.js:232`), and `courtOrderFloor` raises a settlement carrying organised crime to a Moderate safety floor at town (1.20) and city (1.25) on the code's own comment — *A court system actively suppresses crime even if not eliminating it* (`safetyProfile.js:62-71`) — while `:283` prints *A functioning court system means organized crime operates with greater caution* on the same dossier. **The record is the score and the printed panel.** A blanket non-enforcement claim is denied by the engine's positive model (floor 4) as well as being the exact inverse of what the badge beside the prose is computed from.
- **EACH ONE COSTS THE NEXT ONE — an accumulating series over time.** — ⭐ **FLOOR-2. Rows F2-05 and F2-08.** *Each … the next* is an elapsed course and a trend in one clause; it asserts a sequence of past judgements the engine does not hold and will later compute differently. The card prints `may NOT: an elapsed course` in terms. `ageBands.js`'s `HISTORICIZE_BAND` pin is the constitution's own: a birth-time STATE carries no origin stamp at all, so it can bear no temporal register whatever.
- **A LITTLE OF ITS WEIGHT — a quantified decrement.** — **FLOOR-2 (F2-01).** A magnitude the read does not hand the writer, in a word rather than a digit. The band vocabularies are closed.
- **THE TOWN'S COURTS, plural.** — **CONTRADICTED on the town slice (F1-12's family).** At town the guaranteed row is one `Town hall`; the plural is the city's own reading (`Multiple courthouses`, `Multiple court buildings`). The pool key cannot tell.
- **THEY ARE SPENDING DOWN A REPUTATION.** — **FLOOR-2 twice over.** It is a trend (F2-08), and *spending down* presupposes a higher past state the record does not hold (F2-05). It is additionally a figure on an abstraction, which the register card bars outright: a comparison is a measurement in words, and reputation is not a stock the engine banks.
- **THEY CANNOT REPLACE IT — a prediction about what will not happen.** — **FLOOR-2 (F2-05, the modal future; and the card's `a prediction the pulse adjudicates`).** Nothing takes the future; the edge is subjunctive, never a fate.
- **⛔ THE VARIANT'S STRUCTURAL PROBLEM, stated once.** Four of its seven claims are floor-2 and one is floor-4. The `[unfolding]` angle wants motion and **floor 2 forbids elapsed motion outright**, so this variant cannot be rewritten by patching its words. **It must find its motion in a STANDING TENSION rather than in a course** — what the arrangement IS doing to the town as a present condition, what the arrangement leaves permanently open, what it makes true every time rather than more true each time. See §3.6 and §3.8.

### 3.3 The reads this pool reaches (material for the rewrite of vid 3)

- `hasCourtSystem` and `hasPrison === false`, taken **as a shape rather than as a history**: a chain with a link out of it. The decision is complete; the thing that would follow it is not there. That is a standing structural fact and it is the whole licensed content of an unfolding reading here.
- **The engine's own asymmetry, which is structural and not temporal:** the bench's contribution to order is real and bounded (+20), the crime pressure subtracts against it (`crimEffective × 0.4`, `defenseGenerator.js:256`), and the order purse funds *watch wages, court and gaol funding* as one charge with a floor (`:246-251`). **Every one of those is a present balance, not a slope.**
- **The two sentences, as the only instruments in reach:** money, and the road. What a bench does when the third instrument is missing is reach further with the two it has — a present fact about how the two get used, never a claim that they are used more each season.
- **The open matter.** The register card requires every town to leave one civic matter standing open, stated and never asked. **This variant is the pool's natural home for it**, and the record supplies one without any invention: a town that can decide and cannot detain has no settled answer to the person who will neither pay nor go, and the record holds no answer either. That is a STANDING gap, not an elapsed one.
- NOT reached: the badge, the safety label, the criminal structure, the capture rung, the stress banner, the walls, any force, the tier, **the history**.

### 3.4 ⭐ WHAT WOULD BE FALSE HERE

The table at §1.4 binds this variant unchanged. The rows this `[unfolding]` variant walks into HARDEST — and unlike its siblings, most of them are floor 2, which is decidable from the face's grammar alone:

| row | the trap this variant specifically invites |
|---|---|
| **F2-05** ⭐⭐ | **the elapsed course, in every disguise** — the perfect (*has lost*, *has become*), the durative (*keeps losing*), the comparative-against-a-past (*less than it was*, *thinner*), the ordinal over events (*each*, *the next*, *again*, *the second time*), the modal future (*will*, *would not last*), and the bare adverbs *still*, *no longer*, *since*, *as ever*. **An unfolding face is one careless auxiliary from this row.** |
| **F2-08** ⭐ | **the trend** — anything charted: worse, growing, mounting, accumulating, wearing away, spending down. A trend asserts past states the engine does not hold |
| **F2-01** | a quantified decrement — *a little of its weight*, *some of it*, *half as much*, *most of the time*. The shipped row commits this |
| **F4** (the model) ⭐ | **futility** — that judgements go unenforced, that the bench is disregarded, that decisions mean nothing. `defenseGenerator.js:232` (+20) and `safetyProfile.js:62-71`/`:283` (the court actively suppresses crime, and lifts the safety floor). **This is the one thematic direction the engine positively forbids** |
| **F1-12** | *judgment* / *courts* read criminally or plurally on a hall-only town |
| **F1-40 / W-10** | an unfolding face implying a DECLINING band beside a badge that can read STRONG. The badge is `scoreBand(scores.internal)` and the court is +20 of it |
| **F2-04** | an event the record did not run, smuggled in as the start of the course — *the gaol fell out of use*, *they stopped building it*, *the last time anyone was held* |
| **F2-03 / F2-07** | a founding or an age — *the hall was raised before the town needed a gaol*. ⚠ age-FLAVOUR is free where the printed age (`OverviewTab.jsx:251`) does not deny it: *a room older than the business now done in it* is lawful; a date is not |
| **F2-09** | the allusion to a past that no key function of this block can see. `historyPreservation.js:1-30`: a reroll replaces `settlement.history` wholesale, so a historical allusion desyncs on a button press |
| **F3-06** | the singular office carrying the decline — *the magistrate who has stopped bothering*. `npcGenerator.js:1527`, `:1530`, `:1532` seat a **Chief Magistrate** under three stresses the key never reads |
| **F1-34** | the decline widened into a totality — *nothing binds here any more*, *no judgement is worth anything* |
| **F3-05** | the unfolding scene furnished against the culture profile |

**THE CLOSED ROSTERS**, as at §1.4: the **court grep set**, the **detention grep set** (all four false), the live roster over the frozen snapshot, the NPC office roster, the faction list. **Not a faith pool:** no deity axis, derived temper, pantheon rank, settlement standing or `suppressed` flag arises.

### 3.5 ⭐ THE PREIMAGE

As §1.5, unchanged, with the line that bites this variant hardest restated: **the key reads no clock at all.** Every settlement it selects is at the same point in its own life — the first survey — and the pool fires identically on a four-hundred-year metropolis and on a town founded in the same breath as the seed. `history.age` is frozen at birth, user-settable and rerollable (`ConfigurationPanel.jsx:419-431`), and **no state-prose pool key in the estate reads a history field** (F2-09). So an unfolding face has **no time axis available to it whatever**: whatever it says must be true of a town on its first recorded day, and must stay true after the owner rerolls the history behind it. That is not a narrow constraint on this variant; it is the constraint that defines it.

### 3.6 The angle's stance in one sentence

`[unfolding]` is the record noticing that an arrangement has a shape with a consequence in it — so here it may state the standing tension between a body that can decide and a town that cannot hold, and may leave the matter that arrangement never settles standing open; and it may NOT date it, chart it, accumulate it, quantify its decrement, predict its end, or say that the deciding is futile, because the engine models the deciding as working.

### 3.7 The turns worth keeping

- The IDEA of the shipped row — that the missing link has a cost — is the right idea and the only one of the three variants that reaches for a consequence at all. **Keep the idea; discard every word that makes it a course.**
- *cannot enforce* — the verb is salvageable if what cannot be enforced is narrowed from *each judgment* (false: judgements are enforced by fine and by the road) to the specific thing the record denies: **a judgement whose answer would have been keeping the person.** That is exact, licensed, and sharper than the shipped claim.
- ⛔ *Each … the next one*, *a little of its weight*, *spending down*, *cannot replace* — all four go. Nothing in that clause survives floor 2.
- ⛔ *the town's courts* plural — goes, or becomes singular, or becomes the law / the bench / the hall.
- The `{settlement}` slot sits mid-sentence here and vid 1 opens on it. **Keep that distribution** (order constraint 10) — all four faces of vid 3 should carry `{settlement}` somewhere other than the first word.

### 3.8 ⭐ WHERE THE FLAVOUR IS (vid 3)

- ⭐ **THE PERSON WHO WILL NEITHER PAY NOR GO.** The record gives this town two sentences and takes away the only instrument that compels either. **Nothing in the record says what happens to the person who declines both** — and nothing denies it either, which makes it the pool's one perfect standing-open matter: stated, never asked, never resolved. It is a present condition rather than a course, so it is floor-2 clean; it is a plot hook of exactly the kind the dossier exists to hand a game master; and it is the licensed form of the futility the shipped row reaches for illegally. **This is the single best thing available to the rewrite of vid 3.**
- **THE TOWN CAN DECIDE FASTER THAN IT CAN DO ANYTHING ABOUT IT.** Two of the three recorded court procedures are administrative — permits, taxes, contracts, licences, record filing (`institutionServices.js:1622-1633`) — and those the town CAN complete, on the spot, with a stamp and an entry. The one thing that would need holding is the one thing that stops at the door. **So the same room finishes some of its business entirely and none of the rest**, and a reader can see that shape on the page without being told a story about it. A standing asymmetry, no clock required.
- **THE LINE ITEM CARRIES A HEAD THE TOWN NEVER SPENDS AGAINST.** *Watch wages, court and gaol funding* is one charge (`defenseGenerator.js:246`) and this town has no gaol. ⚠ F4-02/F4-03 bar splitting the purse, so the licensed reading is not that the gaol money goes elsewhere; it is that **the charge is written for a chain the town does not complete** — which is a fact about the arrangement's shape, exactly what this angle is for.
- **THE WORKHOUSE, WHERE ONE STANDS.** At city, `baseChance: 0.25`, *the able-bodied poor given shelter and food in return for hard, compulsory labour, kept deliberately harsh* (`institutionVocabulary.js:290`; `institutionalCatalog.js:2289-2295`) — **and invisible to `hasPrison`.** A city that can decide and cannot detain may still hold people by another name for another reason, and the record keeps the two apart. Nothing licenses a face that says the bench sends anyone there; everything licenses a face that notices both standing in one town. **What someone would avoid; what the absence looks like on the ground.**

### 3.9 What would make the rewrite of vid 3 a regression

Vid 3 not third, or not `[unfolding]`, or its slot set not `{settlement}` exactly once, or `{settlement}` moved to the opener (vid 1 holds that position), or fewer than four faces. **Any face carrying an elapsed course, a trend, a perfect tense, a durative, a comparative against a past, an ordinal over events, a modal future, or *still* / *no longer* / *since* / *again*** — this is the variant where floor 2 does the killing and it is decidable from the grammar alone. Any face asserting that judgements go unenforced or that the bench is disregarded, because the engine models the court as suppressing crime and lifting the safety floor. Any face quantifying a decrement. Any face with plural courts or a criminal trial. Any face that resolves the standing-open matter instead of leaving it open. Any face that reads as a paraphrase of a sibling, or that shares its first two words with one (A11).

---

## CLOSING NOTES FOR THE WRITER

1. **The one row that governs this packet is F1-12.** Two booleans stand in front of six different buildings, and one of those buildings hears no crime at all while another hears nothing whatever. Every face must be true of the `Town hall` town and of the six-bench city at once. **The cure the shipped set already found is vid 2's *can name a wrong*** — reach for that shape, in four different vocabularies.
2. **The absence is wider than the reader will assume.** `hasPrison` greps `stocks`, so this town has no cell, no lock-up, no post, no pillory and no public punishment of any kind. The physical furniture of small-town justice is entirely gone, and that is a concrete, particular, unused fact.
3. **The engine says the bench works.** Futility is the one theme floor 4 forbids. The licensed and better story is a working instrument with one arm missing.
4. **Floor 2 is the killer on vid 3 and the sleeper on the other two.** No count, no date, no rate, no perfect tense, no trend, no prediction. The conversion is always the same: turn the history you wanted into a standing condition.
5. **Zero citations; free record vocabulary.** The card resolves no holder, so name no keeper — but the docket, the entry, the roll, the minutes, the writ, the register and the licence are all free words.
6. **Slot discipline:** vid 1 `{settlement}` as the opener · vid 2 **no slot at all** · vid 3 `{settlement}` mid-sentence. Every face inherits its parent's slot set exactly.
