# D-RN-r2b — disposition lane, P3 round 2b: THE RENOWN (`docs/DESIGN_FP_ARCH_RN.md`)

Seat: D-RN-r2b (Opus 5.5), chair a73343ed, 2026-10-18, 08:29–08:4x EDT (by `date`). Read whole: the kit README, COMPILE-COMMON, DISPOSE, RULINGS-PL-MN, RULINGS-AFTER-RESEARCH, RULINGS-AFTER-COMPILE, CHAIR-NOTES-FOR-THE-FOLD, RULINGS-ROUND1 (+ ADDENDUM), RULINGS-ROUND2, RULINGS-ROUND2b, the BOARD, `skeptic/SEAMS-r2.md`, `skeptic/HOST-r2.md`, the volume (794 lines before this lane), `cure/D-RN-r2.md`. Cross-read by grep and section: CH §2.1 (P1), §2.2b, §4.1, §8, §9, §16b; PT §2.1, §3.1, the answer `later`, §10.2; PS PS13, §5.5, §14, §15; PR §8.1, §10.1(d), §13, §15.1; WC §1.7.2; the fold §3.1.22, §3.3.12, §3.4. Routes looked for in `skeptic/PS-r2.md`, `ST-r2.md`, `PR-r2.md` (none to RN) and every r2/r2b cure log (`D-CH-r2` §5.2 and `D-PT-r2` §5.1 route to RN; `D-PL-r2b` §5.3 points at RN's "opens H16"). Code of record: master `81f1cd963` (detached worktree, read-only). Pre-round volume: `cure/D-RN-r2b-probe/RN-before-r2b.md`. No git; no tests.

## 1. MEASURED FIRST (CONFIRMED by reading the symbol at `81f1cd963`, or by execution where marked)

| # | Receipt | What it settles |
|---|---|---|
| M1 | `envoyPulse.js :: advanceEnvoyDiplomacyPulse`: `if (!envoyDiplomacyActive(worldState)) { return { worldState: meetingLedgers.changed ? meetingLedgers.worldState : worldState, regionalGraph, wizardNews, settlementUpdates, …`; full path `let feed = wizardNews;` · `let updates = settlementUpdates;` → `return { worldState: state, regionalGraph: graph, wizardNews: feed, settlementUpdates: updates, …`; kernel `memoryState = envoys.worldState;` · `settlementUpdates = envoys.settlementUpdates;` · `wizardNews = envoys.wizardNews;`. EXECUTED `earlyReturn.mjs` → `earlyReturn.out`: gate shut ⇒ all three come back by reference | D-CH-r2 §5.2(a): a pre-gate pass's writes to `settlementUpdates`/`wizardNews` are lost unless the stage rebinds the parameters; the rebinding is ≈ 1 line and both returns then read it |
| M2 | `eslint.config.js`: no `no-param-reassign` (grep: 0) | the rebinding is lint-legal |
| M3 | `rumorNetwork.js :: mergeArrival`: `arrivalTick: Math.min(existing.arrivalTick, incoming.arrivalTick)`; the seed record `{ eventRef, eventTick, carrier, arrivalTick, hopCount: 0, lineageIds, corroborationRoots, provenance: { originId: sid, relayIds: [] }, completeness01: 1, … content }`; `captureContent`: "ONLY structured fields are copied"; `advanceRumorLedgers({ worldState, feedEntries, graph, tick, … })` | `heardAt` can return `heardTick` (the arrival); the telling arm can seed non-deed registered tellings in the landed record shape from `worldState` |
| M4 | `armyTransit.js :: currentRegion(record)`: "the node at its position along the path (rounded to the nearest hop)"; WC §1.7.2: the free unit's `position` is "army-style stepper (the stepArmyPosition model)"; `rg freeUnits src` = 0 (WC-10 unbuilt) | where a company stands for hearing (PLAUSIBLE until WC-10) |
| M5 | `supabase/functions/ingest-events/index.ts`: ``const rateKey = actorId ? `u:${actorId}` : …`` | `u:` is a landed prefix on ANOTHER surface (a rate-limit key) — registered homonym |
| M6 | census (`census.out`): `TELLING_SOURCES` 0/0 · `heardTick` 0/0 · `passage_kept`/`_breached`/`_trespassed` 0/0 · `atTick` 22 src files (avoided) · `corps` prose only | tokens FREE |
| M7 | CH §16b (live): "RN keys its fame and regard as `c:<unitKey>`" (also CH-10, OD-CH-36); P1 `alignment` (`NPC_ALIGNMENTS`), `character.axes`, `relations[]` on the one mark | the corps' lens and seeds exist on the mark; CH's `c:` is stale against RULINGS-ROUND2b |
| M8 | PT (live) l.126 `partySeq` deed field; l.202 the `party_event` door "for every party-caused settlement event that does NOT ripple"; l.207 the static skip; l.309 `later` reads `partyCredibilityAt`; l.362 `SEND_WORD` reads no credibility | D-PT-r2 §5.1 (a)–(c) |
| M9 | PS (live, 08:30) PS13/§14: slot row `passage`, kinds `passage_kept · passage_breached · passage_trespassed`, doer the mover court, witnesses the territories crossed, a retained corps under `u:`; but "a court's fame moves" | SEAMS-r2-13's kinds; a residual routed to PS |
| M10 | PR (live, 08:29) §10.1(d): the join's default reads the landed pair state in every arm; §8.1 cover by `fameIn`; §13 the window, not H16 | SEAMS-r2-11 and HOST-r2-5: only RN's own bracket was stale |

## 2. THE RECORD

| Id | Sev | Disposition | Where (RN) | Receipt |
|---|---|---|---|---|
| SEAMS-r2-6 | MAJOR | CURED — `u:<unitKey>` holder and subject; refused pairs bind `s:`/`c:` only; doer/target `{kind:'corps', id}`; fame by deeds; lens from the mark; hears at its unit's town; lit with CH's corps + WC-10 | RN1, RN16, §2.1, §2.2, §2.3, §2.4, §3.1, §4.1, §5.1, §5.6, §6.2, §12, §13, §14, R49, OD-RN-36 | RULINGS-ROUND2b; M4, M5, M7 |
| SEAMS-r2-11 | MAJOR | CURED (RN's half; PR's already cured) + REFINED: refused-pair reads return `null` (`pair_state`), pinned | §2.2, §3.1 bracket, §13, R51, OD-RN-35/39 | RN §2.2's own rule; M10 |
| SEAMS-r2-13 | MAJOR | CURED — slot row `passage` (PS · C14), PS's three kinds; a settlement doer's deed is a tale, no court fame | RN1, §2.1, §2.4, §3.1, R50, OD-RN-37 | M9 |
| RULINGS-ROUND2b SEAMS-r2-6 | — | CURED with SEAMS-r2-6 | as above | the ruling |
| HOST-r2-5 (echoed by RN; D-PL-r2b §5.3) | — | CURED — the window (H9), never H16 | §3.1 bracket | RULINGS-ROUND2b; M10 |
| D-CH-r2 §5.2(a) | routed | CURED — the stage rebinds three parameters | §5.1, §10, §13, R52, OD-RN-39 | M1 (EXECUTED), M2 |
| D-CH-r2 §5.2(b) `c:<unitKey>` | routed | REFUTED — `c:` is the court body; its refused pairs forbid a company's feeling for its employer; superseded by RULINGS-ROUND2b | §2.2 | RN §2.2; the ruling |
| D-CH-r2 §5.2(c) | routed | CURED — `heardAt(...).heardTick`, named the per-deed arrival read | §2.3, §2.4, R55 | M3 |
| D-CH-r2 §5.2(d) | routed | CURED — `TELLING_SOURCES` (leak; findings) | §2.4, §3.4, §13, §14, R53, OD-RN-38 | M3, M6 |
| D-PT-r2 §5.1(a) | routed | CURED — `partySeq` named | §2.1, §3.1, §13, R54 | M8 |
| D-PT-r2 §5.1(b) | routed | CURED — non-rippling events only; `sourceEventRef` narrowed | §2.1, §3.1 | M8 |
| D-PT-r2 §5.1(c) | routed | CURED — reader struck | §7 | M8 |
| HOST-r2 routes to RN | — | NOTED — none | — | HOST-r2 ROUTES "RN — —" |
| FOLD parenthetical (D-MN-r2 §4, D-PT-r2 §5.2) | — | NOTED — the fold lane's; no RN row | — | both files read |

COUNTS: disposed 14 of 14 — cured 11 · refuted 1 · stop 0 · noted 2. Volume 794 → 834 lines; tables checked (`check-tables.out`: 0 bad rows); bracket balance on changed lines checked.

## 3. STOPS
None. Every cure is buildable at `81f1cd963` with zero kernel lines (the rebinding is inside RN's own ≈ 4 stage lines; the registered tellings ride RN's existing one call).

## 4. REFINED (bracketed in place)
- A refused-pair read (`regardOf`/`courtRegardOf`, an `s:`/`c:` holder about an `s:`/`c:` subject) returns `null` with reason `pair_state`, pinned in RN-1 — the third volume to ask RN for court↔court feeling (PS-r2-17, RN-V4, SEAMS-r2-11), so the class gets a structural guard rather than a fourth prose fix.

## 5. ROUTED (each a line that now trails RN; none is RN's to write)
- **CH:** §16b l.640, CH-10 l.722, OD-CH-36 l.861 still say `c:<unitKey>` → `u:<unitKey>` (RULINGS-ROUND2b). CH-7's car-0 confirms each `TELLING_SOURCES` row's inputs stand on `worldState` at the rumor stage (the tick after CH's pass wrote them) and declares the leak's structured content fields (CH's lifecycle row).
- **PS:** PS13 and §14's RN row say "a court's fame moves" — RN keeps no court fame (RN1): the passage deed is a tale; strike the clause.
- **The fold (P4):** §3.3.12 gains `corps`; §5 rows `u:` (homonym), `TELLING_SOURCES`, `heardTick`, `passage_kept · passage_breached · passage_trespassed`, `partySeq` (PT's); §3.1.22 records the stage's three bindings; `party_voiced`'s trigger wording (below).

## 6. OPEN FOR THE CHAIR
1. The fold §3.4 `party_voiced` trigger reads "a court, or a person of `regional` fame"; RN §5.5's crossing reads the HOLDER's fame, which a court lacks (RN1). RN's reading (unchanged): a court speaks through its ruler, a `p:` holder once persons light; voices need persons (§12). If the chair wants a court voice in the dark person arm, that is a new arm, not a cure.
2. The relayed owner question (weather and the sea): unchanged for RN — the tale's BFS already walks the landed sea lanes (`D-RN-r2.md` M10); RN mints nothing for weather or sea.

## 7. CONFIRMED vs PLAUSIBLE
CONFIRMED by execution: M1's early return (`earlyReturn.out`). CONFIRMED by read: M1–M10. PLAUSIBLE, not upgraded: where a company stands (WC-10 unbuilt; `currentRegion` is the army model WC cites); that CH's registered rows' inputs are on `worldState` at the rumor stage; that no registered pass writes the envoy meeting ledgers ENC-3's drop pass reads.

## 8. PROBES (`cure/D-RN-r2b-probe/`)
`RN-before-r2b.md` · `apply_r2b.py` (39 anchored edits, each asserted unique) · `census.out` · `earlyReturn.mjs` → `earlyReturn.out` · `check_tables.py` → `check-tables.out`, `check-tables-before.out` · `volume.diff`.
