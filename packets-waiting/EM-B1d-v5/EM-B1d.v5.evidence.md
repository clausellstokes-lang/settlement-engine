# EM-B1d version 5 — evidence

All commands run in `$SP/lane-em-b3b` at HEAD `58fcfe614` (branch `fixes-2026-09-18-consist`),
phase-1 constraints observed: **plain `node` and `git` only — no vitest, no eslint, no build**, and
**no write to the slot's tree**. Figures labelled *executed at v4* come from the version-4 build
lane's own run and are quoted in its receipt.

---

## §1 · THE PLACEMENT MEASUREMENT (the ruling's open question)

`$V5/measure-placement.mjs` walks each worker entry's static closure with `importsOf` and
`resolveRel` **copied verbatim from `vite.config.js`'s `computeEagerModuleGraph`**, and queries the
config's own exported `EAGER_FIRST_PAINT_MODULES`. It is the config's reading, not a second spelling.

```
$ node measure-placement.mjs <worktree>
closure sizes: { 'generation.worker': 220, 'advanceInterval.worker': 549, 'townScene.worker': 18 }
EAGER_FIRST_PAINT_MODULES: 268

file                                             genWorker advInterval townScene eagerFP lazyEngine
src/domain/entities/npcs.js                      no        YES         no        YES     no
src/domain/entities/status.js                    no        YES         no        YES     no
src/domain/entities/successors.js                no        no          no        YES     no
src/domain/worldPulse/envoyCasting.js            no        YES         no        no      no
src/domain/density/factionLifecycle.js           no        YES         no        YES     no
src/domain/worldPulse/magicFormsPractitioner.js  no        no          no        no      no

importers of src/domain/entities/npcs.js INSIDE the generation-worker closure: NONE
importers of src/domain/entities/status.js INSIDE the generation-worker closure: NONE
```

**Reading, budget by budget.**

| budget | ceiling | candidate `npcs.js` | candidate `status.js` | candidate new leaf |
|---|---|---|---|---|
| **generation worker** | `WORKER_BUNDLE_CEILING_BYTES = 1401208`, `<=`, **zero slack** | **NOT IN THE CLOSURE** | NOT IN THE CLOSURE | NOT IN THE CLOSURE (its importers are not either) |
| **eager first paint** | `CLOSURE_BUDGET_BYTES = 1_048_000`; measured **1,039,235** at the base ⇒ **8,770 B of margin** | in it | in it | in it (via `successors.js`) |
| **lazy engine** | `< 679_000`; measured **677,935** | not under `/src/generators/` | same | same |
| **`advanceInterval.worker`** | ⭐ **no byte ceiling exists** — `tests/domain/advanceWorkerByteIdentity.test.js` is a structured-clone DETERMINISM pin, not a bundle ceiling | in it | in it | in it (via `envoyCasting.js`) |

⭐ **THE TREE-SHAKING QUESTION IS MOOT BY PLACEMENT, AND THAT IS THE MEASUREMENT, NOT AN ASSUMPTION.**
The chair asked whether the worker's build would drop an unused export. It never gets the chance:
`npcs.js` is **absent from the generation worker's 220-module closure**, and — measured separately,
because "not in the closure" and "nothing imports it" are different claims — **no module inside that
closure imports it**. A module that is not in the chunk contributes no bytes whether rollup shakes
it or not. ⛔ The weaker, shake-dependent answer is deliberately not relied on: the ceiling is EXACT
with zero slack, so a packet that needed rollup to behave a particular way would be one refactor
from a re-mint. A1 therefore ASSERTS the home, so a later relocation re-prices §3.2 instead of
discovering the ceiling at a terminal.

**All three candidates are budget-identical ⇒ the choice is coupling, and `npcs.js` wins:**

```
$ grep -n "entities/npcs.js" src/domain/worldPulse/envoyCasting.js
50:import { importanceWeight } from '../entities/npcs.js';
```

- `envoyCasting.js` **already imports `npcs.js`** ⇒ row 4 adds **no import line and no module edge**;
  it extends an existing clause. Version 4 had to add `worldPulse → density`.
- `successors.js` is in the **same directory** and already type-imports `./npcs.js`; its one new
  runtime edge joins two modules **both already in `EAGER_FIRST_PAINT_MODULES`** (measured `YES`/`YES`
  above), and that set is a transitive-closure fixpoint ⇒ the edge adds **zero** modules to first
  paint. The `entities → density` edge version 4 was forced to add **disappears**.
- A new leaf would cost a file and a module node to buy nothing measurable.

**RECOMMENDATION: `src/domain/entities/npcs.js`**, immediately above `IMPORTANCE_WEIGHT`, beside the
typedef whose projection it is.

---

## §2 · THE WALKER'S SETS, RE-DERIVED UNDER THE VERSION-5 SHAPE

`$V5/simulate-v5.mjs` reads **the base blobs at `58fcfe614`** (`git show <sha>:<path>` — never the
dirty worktree), applies the v5 edits in memory, and re-runs the walker's three derivations. Each
in-memory edit is anchored on an exact string and throws if the anchor is missing, so the simulation
cannot drift from the packet silently.

```
── foreign vocabularies per member (v5, simulated) ──
  active    11  ACTIVE_UI_STAGES, THREAT_STAGES, ACTIVE_STAGES, ACTIVE_FLOW_STAGES,
                ACTIVE_STRESSOR_STAGES, ACTIVE_SYNERGY_STAGES, STRESSOR_LIFECYCLE_STAGES
  dead       0  (none)
  exiled     0  (none)
  jailed     3  VERDICT_CAUSES, VERDICTS, AUTHORITY_VERDICTS
  missing    3  STASIS_REASONS
  removed    8  INACTIVE_STATUS, RUIN_STATUS, INACTIVE_STATUSES, NONSTANDING_STATUS,
                DEAD_ENDPOINT_STATUS, TRANSPORT_DOWN_STATUSES, RUINED_STATUS, DEAD_EDGE_STATUSES
  retired    0  (none)
TRIGGER = ["dead","exiled","retired"]

FLAGGED (6):
    src/domain/density/factionLifecycle.js           -> active,dead,exiled,removed
    src/domain/entities/npcs.js                      -> active,dead,exiled,jailed,removed
    src/domain/worldPulse/magicFormsPractitioner.js  -> active,dead,exiled,jailed,missing,removed,retired
    src/domain/worldPulse/npcLadderKernel.js         -> dead
    src/domain/worldPulse/npcLadderState.js          -> dead
    src/domain/worldPulse/warSeatBooks.js            -> dead

DISCOVERED ENUMERATORS (3):
    src/domain/density/factionLifecycle.js           -> dead,exiled,removed
    src/domain/entities/npcs.js                      -> dead,exiled,jailed,removed
    src/domain/worldPulse/magicFormsPractitioner.js  -> dead,exiled,jailed,missing,removed,retired
```

**⭐ THE TRIGGER IS UNCHANGED BY THE RULING: exactly `{dead, exiled, retired}`.** R6′ survives the
re-cut untouched, which is the result the chair needs before placing version 5.

| set | v4 (executed) | **v5 (simulated)** | note |
|---|---:|---:|---|
| FLAGGED | 6 | **6** | same six files; `npcs.js` now spells five members, not two |
| roster rows | 8 | **8** | 5 edited + 3 found, unchanged |
| roster `literals` rows | 6 | **6** | **set-equal to FLAGGED, both directions** ✓ |
| roster `union-read` rows | 2 | **2** | `successors.js`, `envoyCasting.js` |
| discovered enumerators | 2 | **3** | ⭐ `npcs.js` JOINS as the vocabulary's home |
| exemption register | 0 | **0** | empty, inline, checker proved on a planted row |

⛔ **ONE DERIVATION RULE HAD TO BE CORRECTED, AND THE CORRECTION IS PROVED BY ITS OWN FAILURE.** The
first simulation returned `missing 4 — STASIS_REASONS, UNAVAILABLE_STATUSES`: `envoyCasting.js`'s own
derived set was counting **itself** as a foreign vocabulary. The rule is now *a vocabulary declared
inside a declared consumer-roster file is this union's OWN, never foreign*, and with it the table
reproduces the original measurement exactly (11 / 8 / 3 / 3). Both runs are in
`$V5/simulation.out`'s history; the corrected rule is §6 contract text.

---

## §3 · `requiredSymbols`, VERIFIED BY EXECUTION AT `58fcfe614`

All **17** rows resolve (`grep -cF ≥ 1`); minimum count 1. Full table printed by
`$V5/build-manifest.mjs` and captured in `$V5/table-json-equality.out`. The three that are new in
version 5 and the two that are TEST anchors:

```
    1  src/domain/entities/npcs.js :: const IMPORTANCE_WEIGHT = {        (the mint anchor)
    1  src/domain/worldPulse/envoyCasting.js :: const IDENTITY_SEPARATOR (the derived-set anchor)
    1  src/domain/worldPulse/warSeatBooks.js :: function rosterNpcById
    1  tests/generators/densityLaw.test.js :: the absent-status line is EXACT in both directions
    1  tests/domain/espionageMission.test.js :: status: 'imprisoned'
```

⛔ `NPC_UNAVAILABLE_STATUSES` is **deliberately absent**: a READY packet's `requiredSymbols` name only
what the deliverable PRESERVES, never what it creates (`PACKET_STANDARD.md`, the `requiredSymbols`
clause — naming a created symbol at promotion reds `validate:packets` on the promotion commit
itself). It is added at the flip to LANDED.

---

## §4 · THE ADDENDUM'S ARM: §7 TABLE ≡ JSON `changeManifest`, EXECUTED

`$V5/build-manifest.mjs` parses the §7 Markdown table **by its column names** (`Action`, `File` —
never by position) and compares the (action, path) pairs with the JSON's, both directions:

```
PACKET_ACTIONS (frozen): CREATE, DOC, MODIFY, REGISTER, TEST
§7 table rows parsed by column name: 16
JSON changeManifest rows:            16
rows only in the TABLE: NONE
rows only in the JSON:  NONE
actions outside PACKET_ACTIONS: NONE
bare basenames in the table:    NONE
multi-path cells in the table:  NONE
duplicate paths: NONE
lighting-baseline row present:  NONE (prose only, as §P2 row 1 requires)

SET-EQUAL BOTH DIRECTIONS: YES

handwritten rows: 9 · generated rows: 7
```

Each of the addendum's four conditions, discharged:

1. **One full repo-relative path per row, in backticks** — 16 rows, no bare basename, no cell
   carrying two paths. The seven `_shared` artifacts are **seven separate rows**; version 4 had
   appended both `*.meta.json` sidecars to a neighbour's cell.
2. **The action word is a `PACKET_ACTIONS` member and identical on both sides** — version 4's
   `REGENERATE` is gone; a regenerated artifact is `MODIFY` on both sides with *"generated by
   `npm run build:edge-shared`; never hand-edited"* in the notes column. The manifest row is
   `REGISTER` on both sides, as v4's JSON already had.
3. **No row for a path the packet does not change** — `tests/lint/.lighting-census-baseline.json` is
   gone from the table and absent from the JSON. It is stated in PROSE under §7, with the reason:
   §P2 row 1 forbids a member from editing it, so a row there would be an instruction to break the
   law it cites.
4. **Set equality printed from a scratch script**, above.

---

## §5 · THE TWO READINGS, CONFIRMED BY READING (the chair's two questions)

**(a) Is the `espionageMission` refusal still reached through `UNAVAILABLE_STATUSES`?** ⭐ **Yes.**
After the re-cut:

```js
const UNAVAILABLE_STATUSES = new Set([...NPC_UNAVAILABLE_STATUSES, 'missing']);
//                                  = {dead, exiled, jailed, removed} + missing
export function rosterPersonAvailable(npc) {
  if (isOffStage(npc)) return false;
  const status = text(npc.status).toLowerCase();     // 'jailed'
  if (UNAVAILABLE_STATUSES.has(status)) return false; // ⇒ refused
```

The fixture's re-spelled person (`status: 'jailed'`) is refused on the status arm, so
`castableRoster` skips them and the suite's `toEqual([])` holds. Its two siblings are untouched: one
is refused on `whereabouts.state === 'travelling'` (the travel arm, not the status arm) and the
other on `status: 'dead'`, still in the set. ⛔ Had the cure left `jailed` out of the availability
vocabulary, this fixture would have gone GREEN-BY-ACCIDENT on the `isOffStage` arm only for a
DM-shelved person — it does not, and the mutant M2′ is what keeps that honest.

**(b) The `densityLaw` half.** The new `it` has every helper it needs already in scope in that file
(`house`, `figure`, `v2Cfg`, `isOnRoster`, `factionLifecycleStateOf`, `readFactionLifecycle` — read
at `:37-41` and `:966`), so the row costs one `it` and no import. Its shape:

```js
it('⭐ a JAILED figure stays ON the roster — a reversible verdict never dissolves a house (EM-B1d)', () => {
  expect(isOnRoster({ status: 'jailed' }), 'a jailed figure must keep their place in the house').toBe(true);
  // anchored: the sibling arm above pins ROSTER_ABSENT_STATUSES by exact equality, which proves this array is live and correctly shaped; this line names the one word that must never join it
  expect(ROSTER_ABSENT_STATUSES, 'the absent line admits only IRREVERSIBLE causes (R18)').not.toContain('jailed');
  const s = { config: v2Cfg, powerStructure: { factions: [house('The Weavers')] },
              npcs: [figure('Ilse', 'The Weavers', 'jailed')] };
  expect(factionLifecycleStateOf(s, s.powerStructure.factions[0])).toBe('crewed');
  expect(readFactionLifecycle(s, { tick: 1 }).reactions).toEqual([]);
});
```

⚠ The `not.toContain` is a **bare negative** under `tests/lint/negativeAssertionAnchor.walker.test.js`
(`BARE_NEGATIVE_RE = /not\.(?:toContain|toMatch|toHaveProperty)\(/`), so it carries `// anchored:` on
the line immediately above, **on ONE line** — the marker rule that has cost this estate a terminal.

---

## §6 · BUDGETS AND COUNTS

**Effective lines** — the five bases were measured with eslint's own `Linter`
(`max-lines`, `skipBlankLines`, `skipComments`) at `58fcfe614` by the v4 build lane; the v5 deltas
are projected from the exact edits, since phase 1 runs no eslint.

| file | base (executed) | v5 delta (projected) | ≤3 |
|---|---:|---:|---|
| `src/domain/entities/npcs.js` | 138 | **+1** (the frozen const; the typedef is a comment) | ✓ |
| `src/domain/density/factionLifecycle.js` | 61 | **+0** (comment only) | ✓ |
| `src/domain/entities/successors.js` | 52 | **+1** (the import; the filter line is replaced) | ✓ |
| `src/domain/worldPulse/envoyCasting.js` | 92 | **+1** (the derived set; ⭐ no import line — the clause already exists) | ✓ |
| `src/domain/worldPulse/magicFormsPractitioner.js` | 70 | **+0** (one line replaced) | ✓ |
| **total production** | | **+3** of ≤15 | ✓ |
| `tests/lint/statusUnionTotality.walker.test.js` | — | **~235** projected (v4 executed **232**) of ≤250 | ✓ |

⭐ Version 5 is **one effective line cheaper** in production than version 4 (+3 vs +3 with a
different distribution: envoyCasting drops from +2 to +1 because it needs no import line).

**Handwritten files: 9 of ≤12** — 5 MODIFY + 1 CREATE + 2 TEST + 1 REGISTER. **Generated: 7.**

**The lighting delta** — v4's measured tuple with a four-title walker was
`2649 · 383 · 2266 · 25019 · 6676` (measured whole in a throwaway `git archive` probe of the staged
index, the probe deleted). Version 5 adds ONE `it` to an already-credited file:

| | files | parked | credited | titles | suiteTitles |
|---|---:|---:|---:|---:|---:|
| delta this packet declares | **+1** | **+0** | **+1** | **+5** | **+1** |
| predicted whole tuple at the live tip | **2649** | **383** | **2266** | **25020** | **6676** |

The packet quotes the DELTA and never an absolute; the chair re-derives the tuple at the terminal.

---

## §7 · WHAT VERSION 5 INHERITS AS ALREADY-EXECUTED

These were run at `58fcfe614` by the version-4 build lane and are not re-run in phase 1; the packet
cites them as measured and the phase-2 lane re-runs the ones its own edits can move.

| fact | figure |
|---|---|
| goldens | `7177cd6e…7c8e8f1e` and `921c51cf…3bb4db41`, **unmoved before and after** |
| writer-reach | byte-identical: `WRWALKER HOLD — judged 6537 · LIT 572 · LIT-NAME 4671 · DARK 1294` |
| observed-shape | `1964 finding(s), exactly matching the frozen inventory` — unmoved |
| typecheck | `ratchet` 167/167 · `domain:strict` 1113/1113 |
| `verify:dist` | `STRICT DIST OK — 59 file(s), 538 test(s)` |
| first paint | base **1,039,235** → wave **1,039,230** (**−5 B**, a shrink) against 1,048,000 |
| generation worker | **1,401,208 in both builds — byte-identical**, same emitted name |
| lazy engine | **677,935 in both builds** against `< 679_000` |
| mutation-coverage | 705 → 706, pure **+4 / −0**, anchors verified file-adjacent |
| `validate:packets` | exit 0, `valid: 188 packets (1 READY)` — the path is free |

⚠ Version 5 changes what `successors.js` and `envoyCasting.js` read (the availability vocabulary
rather than the roster constant) and adds one exported constant, so the **first-paint figure must be
re-measured** in phase 2 against the ≤60 B bound; the worker and engine memberships above are
structural and do not change.
