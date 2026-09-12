# SKELETON — DS-DEF-2 · pool `Invasion & War: neither walls nor force`

STATUS: IN PROGRESS (marker seat, Opus). Written section by section under the checkpoint law.

VARIANT COUNT: 3 (`[ledger]`, `[counterforce]`, `[street]`)

## THE LICENCE CARD (printed, verbatim in substance)
- reads: `invasionRowSituation(walls, garrison, militia)` via `INVASION_ROW_POOL` in `defenseStateProse.js`; absent ⇒ no candidate; a modifier is silent, never "false".
- predicate: `invasionRowSituation(...) === no walls, no force`
- bag: `{band: RESERVED, route: proper, settlement: proper}`; FILLED at this block's call sites: `{settlement}` only.
- relation: a spine takes no relation. seat/form: not a seat-taker / sentence. move: none declared. angle: counterforce · ledger · street.
- attach: empty (a spine takes no attach set).
- echo: spine mounts 1 (tab: defense); modifier mounts 0. The echo table is keyed on the WHOLE table-rung reading, so every pool selecting a row of `INVASION_ROW_POOL` shares ONE echo key.
- covert: no.
- source: **muster · standing LICENSED** — a citation of this holder is licensed where the provenance budget allows (one citation per unit, ARCH/SITTING §T.4).
- may claim: that the reader selects the row `no walls, no force` of `INVASION_ROW_POOL`, as a STANDING fact of the record.
- may NOT: a magnitude outside the read's own band word (floor 2a); an elapsed course, a dated cause or a season (floor 2b); a prediction the pulse adjudicates (floor 2b).
- audience: player (no mark).
- REFUSED COLUMNS always: a totality over persons; an exemption from a duty (`whoIsExempt` null everywhere); a named character and that character's fate; a theological claim about a deity.
- THE TEST (ADDENDUM 14, owner 2026-09-12): a face is LAWFUL unless it CONTRADICTS the record. Silence is permission. "The card does not license it" is NOT a finding.

## THE BLOCK'S HEADER LINES (annex, `RECEIPT_POOLS_DOSSIER_STATE.md:2568`)
- Block: `Defense › Threat assessment (the five readiness rows)`
- STATE-KEY: five fixed rows (`Beasts & Monsters` · `Invasion & War` · `Internal Security` · `Economic Survival` · `Disasters & Famine`), each with a `scoreBand` badge (`STRONG` / `ADEQUATE` / `WEAK` / `CRITICAL`), read against `config.monsterThreat` (`plagued` / `frontier` / `settled`), the institution presence flags, and `compound.inst`.
- SLOTS: `{settlement}` `{band}` `{route}` — only `{settlement}` is filled at this block's call sites.
- SECTION-TARGET: `defense`
- RECEIPT: `src/domain/display/threatAssessment.js:28-195` (`buildThreatAssessment`) · rendered `src/components/new/tabs/DefenseTab.jsx:150-183` · the walls predicate `src/domain/causalState.js:300-315` (`defenseProfileHasWalls`).
- COMPOSITION FENCE (the block's own, verbatim in substance): institution presence is a STANDING fact with no recorded history; the causal clauses here are **capability** clauses (walls without people cannot be held) and never **historical** ones (walls built after a siege) unless the history surface supplies the ancestry. The walls read must ride `defenseProfileHasWalls`, never a presence check on `institutions.walls`.
- PDF PARITY: parity (`viewModel.js` defense slice).

(sections below filled in order)
