# MARKER PACKET — DS-DEF-2 · pool `Invasion & War: militia only`
Seat: opus (marker). Status: IN PROGRESS — the licence card and the three shipped rows are captured; sections 3 to 9 follow.

## THE LICENCE CARD (printed verbatim from `node scripts/prose-licence-card.mjs DS-DEF-2 'Invasion & War: militia only'`)
```
LICENCE (block DS-DEF-2 · role spine · key `Invasion & War: militia only`)
  reads:      invasionRowSituation(walls, garrison, militia) (via INVASION_ROW_POOL in defenseStateProse.js)
              (absent => no candidate; a modifier is silent, never "false")
  predicate:  invasionRowSituation(walls, garrison, militia) === no walls, citizen militia
  bag:        {band: RESERVED, route: proper, settlement: proper}
              FILLED at this block's call sites: {settlement}
  relation:   (a spine takes no relation)
  seat/form:  (not a seat-taker) / sentence      move: (none declared)     angle: ledger street visitor
  attach:     (empty: a spine takes no attach set)
  echo:       spine mounts 1 (tabs: defense) - modifier mounts 0 (none)
  covert:     no
  source:     muster - standing LICENSED (a citation of this holder is licensed where the provenance budget allows)
  THE TEST (ADDENDUM 14, owner 2026-09-12): a face is LAWFUL unless it CONTRADICTS the record.
              SILENCE IN THE RECORD IS PERMISSION. "The card does not license it" is NOT a finding.
  may claim:  that invasionRowSituation(walls, garrison, militia) selects the row `no walls, citizen militia`
              of INVASION_ROW_POOL in defenseStateProse.js, as a STANDING fact of the record
  may NOT:    a magnitude outside the read's own band word (floor 2a), an elapsed course, a dated cause or a
              season (floor 2b), a prediction the pulse adjudicates (floor 2b), another civic object of the class `force`
  audience:   player (no mark)
  REFUSED COLUMNS, always: a totality over persons; an exemption from a duty (whoIsExempt is null everywhere);
              a named character and that character's fate (product scope); a theological claim about a deity.
```

## THE BLOCK'S HEADER LINES (RECEIPT_POOLS_DOSSIER_STATE.md, `### DS-DEF-2`)
- **RECEIPT:** `src/domain/display/threatAssessment.js:28-195` (`buildThreatAssessment`) - rendered `src/components/new/tabs/DefenseTab.jsx:150-183` - the walls predicate `src/domain/causalState.js:300-315` (`defenseProfileHasWalls`)
- **STATE-KEY:** five fixed rows (`Beasts & Monsters` · `Invasion & War` · `Internal Security` · `Economic Survival` · `Disasters & Famine`), each with a `scoreBand` badge (`STRONG` / `ADEQUATE` / `WEAK` / `CRITICAL`), read against `config.monsterThreat` (`plagued` / `frontier` / `settled`), the institution presence flags, and `compound.inst`.
- **SLOTS:** `{settlement}` `{band}` `{route}` — FILLED at this block's call sites: `{settlement}` only.
- **SECTION-TARGET:** `defense`
- **PROVENANCE + FENCE:** the `buildThreatAssessment` lattice is dossier-native and this pool EXTENDS it; each branch today holds exactly ONE string, so every settlement in a branch says the same words. Two standing defects must not be reintroduced: the `plagued`+nothing branch's lowercase sentence lead, and the walls read must ride `defenseProfileHasWalls`, never a presence check on `institutions.walls`. **Institution presence is a STANDING fact with no recorded history; the causal clauses here are *capability* clauses (walls without people cannot be held) and never *historical* ones (walls built after a siege) unless the history surface supplies the ancestry.**
- **PDF PARITY:** parity (`viewModel.js` defense slice).

## THE REGISTER CARD'S SIX ONE-LINE REGISTERS (the writer aims at the first)
- **The dossier:** the record itself; the clerk's third person; the six shapes of its closed set; the town's name is not the default opener.
- **The NPC ladder:** read aloud to the players; role-bound; never a named interior; the stage licenses the claim, never the shape.
- **The Herald:** the estate's one quoted in-world voice; report mode; flattest where hottest; the bill lands apart from the deed.
- **The chronicle:** a borrowed body of headlines; its own prose is frames and dressings; the quiet year is one sentence of varied shape.
- **The DM page:** candid; the why only from a typed field; second person to the referee alone; it grades, never hedges.
- **Chrome and the docent:** never the archivist; the product speaking to the person who runs it; mechanics first, one term per thing.

THIS POOL IS DOSSIER-ARCHIVIST (R1 STATE). The other five are named to fence it, not to license it.

---

## THE SHIPPED ROWS, VERBATIM (three variants; the rewrite is one for one)
1. `[ledger]` {settlement} can put armed citizens on their own ground, which counts for something against a disorganized raid and for nothing at all against a disciplined force.
2. `[street]` The town knows its own country and knows that knowing it is not an answer to a professional army.
3. `[visitor]` A stranger at {settlement} meets armed townspeople who are entirely competent on their own ground and have never stood in a line with anybody.

(sections 3 to 9 in progress)
