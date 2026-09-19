# EM FAMILY PACKET PREAMBLE — the invariants signed once for the settlement editor

**Volume:** EM — Edit Mode and the Decree Registry (ODQ §934.36–§934.42). **Signed by:** the chair (Fable 5.1, session 923472dc), 2026-09-19, at the build branch `fixes-2026-09-18-consist` base d31af2cee. **Carries no per-wave figure**: every census tuple, effective-line count, seal and denominator lives in the member packet and is re-executed there (`PACKET_STANDARD.md`, "Family packet preambles"). Each member cites this file by SHA-256; an edit here re-stamps every member.

## §P1 · Binding design-law citations

| Authority | What it binds for EM |
|---|---|
| `docs/implementation/PACKET_STANDARD.md` | the standard itself: statuses, the dispatch lifecycle, the hard scope budget, hot-file law, the edge-case budget, registration obligations priced at compile, STOP conditions, the completion receipt |
| `docs/DESIGN_EDIT_MODE_AND_DECREES.md` | the product design; **§12 GOVERNS** every earlier section and **§13 states the phantom consequence rule** (ODQ §934.43) and **§14 the source rule — edit at the source, never at the derivation** (ODQ §934.44): the real rewind (`undoLastPulse`, session-only, ten deep, later-staged decrees re-appended); canon is a save's state and the advance is a campaign act; names are join keys (`free-cascade`); neither persisted key travels; the layer is applied on write; phantoms are minimal hidden save records; pools read the generator's catalogue; guards fold and never refuse; the observed-shape door is the exemptions bundle; the gate is `TIER_GATE.premium.editMode`; an applied decree reopens read-only |
| `docs/ARCH_EDIT_MODE_AND_DECREES.md` | the module map, the JSDoc types, the persisted schema, the store slice, the guard engine, the tick, the surfaces, the eight instruments, the seed catalogues — as amended per design §12 |
| `docs/implementation/charters/EDIT-MODE-TRAIN.md` | the nineteen packets in five waves, their outcomes, files, required symbols and collision groups |
| THE PROMISE (`docs/OWNER_DECISION_QUEUE.md`, constitutional) | a seed is a STARTING world forever; lived history is immutable; the pencil never rewrites what the chronicle recorded; tuning is owner-signed |
| The deity doctrine and the product scope | faith is culture and never theological; setting-agnostic; world-only, sub-century, never a named character's fate |
| The owner's tome law (§934.25) | the dossier's chrome speaks the scribe's grammar; the editor's pop-ups wear the forge's brown-and-gold scheme (§934.36 addendum), never a dashboard's |
| `CONTRIBUTING.md`, `ARCHITECTURE.md` | system invariants and operating law |

A member packet names only its own *additional* sources. If two higher authorities disagree, the member is BLOCKED and the chair adjudicates; a lane never does.

## §P2 · The registration cost an EM packet prices at compile

Every row below is priced inside the member's own change manifest before dispatch, never discovered at the terminal.

1. **A new TEST file moves the sovereignty-lighting census** (`tests/lint/sovereigntyLightingContract.walker.test.js`: its `files` figure is the count of test files under `tests/`, and its title figures count literal `describe`/`it` titles — MEASURED at compile by lane P2, 2026-09-19; a new `src/` leaf moves nothing). The member names the move as an INTERIOR RED with the predicted tuple delta (files, credited, titles, suite titles); the census is re-derived whole once, at the train's terminal — BY THE CHAIR, NEVER INSIDE THE PACKET: an in-packet refreeze needs a commit, a commit drifts the sealed HEAD, and the sealed verbs then refuse (measured at EM-P0's build, 2026-09-19); a packet's §8 never schedules a refreeze and its §7 never lists the baseline as a generated artifact.
2. **A new `tests/lint/` file owes its `scripts/mutation-coverage-manifest.json` row**, added surgically beside its siblings — the manifest is never re-serialised whole.
3. **A new domain reader of a save-time key (`dmLayer`, `decrees`) owes an `EXPLAINED_WRITER_EXEMPTIONS` entry through the observed-shape migration-bundle door** with a declared mechanism. The register is content-addressed and history-bound: the mint is a CHAIR act on a branch cut at the integration tip, priced as a named REGISTER row the member does not execute.
4. **New readers of settlement fields under `src/domain/edit/**` may move the writer-reach register** (`scripts/check-writer-reach.mjs`): a shrink is the plain `--write`; growth is a mint and a chair act. The member states which.
5. **A seeded chooser or pool mint (`rollFrom`) carries its decision-fork classification row and its mechanism-coverage baseline row**, both estate-wide, both the minting member's.
6. **Both persisted keys join the three hand-mirrored denylists and their drift test**, and `publicSafe` / `worldSnapshotPublic` name them explicitly; the persisted-key instrument is named by its real path at pre-proof. This is EM-B3's cost and no later member re-owes it.
7. **A rendered figure owes prose-numerics** (`tests/lint/proseNumerics.test.js`; ceilings only fall). Wave 1 renders nothing.
8. **A surface (wave 4) owes the dialog-door, phone-floor, reachability, no-clamp and anchored-negative walkers**, extended to `src/components/edit/**` in the member that adds the surface.
9. **The tick hook (wave 3) owes the preset witness** only if it moves — re-recorded BY HAND with a stated cause, and it must not move at zero decrees (the hook consumes no PRNG and preserves the pulse record's key order).

## §P3 · The census law under EM

1. **The golden master and the prose manifest do not move on any EM packet.** `tests/property/generatorGoldenMaster.test.js` (525 rows) and `tests/property/dossierProseManifest.test.js` are UNCHANGED across the whole train; no EM member names a golden shift, and EM-B2's isolation property (regenerate with a layer; the goldens unchanged; the delta reports the DM's fields) is the standing proof. Motion is a STOP.
2. **The lighting census is re-derived whole at the terminal**, never patched; the train is the single non-terminal holder.
3. **The observed-shape register** is verified plain at every member's base; a member that adds a reader with no corpus writer names the exemptions mint (§P2.3) and is not dispatched until the chair has landed it.
4. **The runtime denominator**: a member that adds test titles predicts them by count; `.each`, looped or conditional registration and nested describes are forbidden in an EM acceptance file (the lighting walker's SUITE_CONTEXT_PARAM arm parks a `describe.each` over runtime functions — use body loops).

## §P4 · Coupling and the reader law

- No component imports `dmLayer.js` or `registry.js` directly except through `editSlice`; no store writer is reachable from `src/components/edit/**` except the op boundary; `src/domain/edit/**` is strict-typecheck clean and imports nothing from `src/components`.
- **One generic decree adapter** in the command registry dispatches by op type — never an adapter per op type.
- **The layer is applied on write**: the saved record carries the edited values and `dmLayer` records which fields are the DM's. Every reader — the PDF view model, the prose readers, the world book — sees one record. No composed-view second truth.
- **Readers forward, never derive.** A reader that derives a value for one caller moves the corpus for another (the tier-noun lesson of 2026-09-19: a derivation inside a desk reader moved 4,214 of 72,240 manifest cells). What a surface wants, it says in its bag.
- **Exactly one writer per state**: the registry's `stage / reorder / withdraw / reopen / markApplied / revertTick` and the layer's `applyEdit`. No second path writes `decrees` or `dmLayer`.

## §P5 · Standing hazard dispositions

| Hazard | Disposition every EM member inherits |
|---|---|
| HZ-TRAVEL | edits never travel: a fork, an import, the gallery projection and the anonymous-draft envelope carry neither key — proved by a RUNTIME test, not a static walker |
| HZ-JOINKEY | a field the rename cascade joins on may only be `free-cascade`; a rename is a typed op that runs `src/domain/factionRename.js`'s existing cascade |
| HZ-GOLDEN | regeneration re-applies the layer; the goldens ignore `dmLayer`; any motion of a golden is a STOP |
| HZ-PRNG | `rollFrom` draws on its own stream, keyed by the settlement seed, the entry id and the roll counter, spelled once in EM-A2; never the world's sequence; no ambient randomness, time or locale |
| HZ-PERSIST-UNGATED | an arm that normalizes or cleans persisted state runs unconditionally; a flag may gate the feature, never the normalization |
| HZ-REWIND | the rewind is `undoLastPulse`; `revertTick` re-appends every decree staged after the tick; an applied decree reopens READ-ONLY and only a rewind returns it to pending |
| HZ-PHANTOM | a phantom is a minimal save record (`kind: 'phantom'`) hidden from the shelf; no second neighbour derivation; promotion replaces the record in place. **The phantom consequence rule (design §13, ODQ §934.43):** a phantom act yields the HOME PROCEDURES (the force returns won or lost through the existing muster/casualty/upkeep mechanics; an envoy or caravan returns unchanged) and the RECORD (a chronicle line) and never world state; consequence the DM wants is a separate home decree the registry may offer but never applies; a real save routes through the campaign's machinery; promotion never rewrites the record-only past |
| HZ-OSR | a domain reader with no corpus writer is a conviction, not a warning; the door is §P2.3 and it is the chair's |
| HZ-VITEST-ENV | a `VITE_*` switch in a worktree's `.env.local` is read by vitest (DEV is true under test); dev-only features guard on `MODE !== 'test'` |
| HZ-WORKTREE | a lane writes only in its own worktree and its one scratch root; the integration worktree and the ledger checkout are forbidden paths |
| HZ-GATE-POLL | a lane at a gated run finishes its edits, stages, writes `.lane-resume.md` and STOPS (§934.33); it never polls the mutex |
| HZ-STAMP | every time stamp is read from the clock in the same command that writes it |
| HZ-DERIVED | a fact is editable only where it exists first (design §14 final): five kinds — WORLD FACTS (terrain, culture, trade access, resources, goods, services, stressors: editable on their own card; a change NEVER re-rolls — it re-derives with every chosen fact pinned; incoherence is consequence by design), ROOT (a registered decision-fork's chosen output — the editor's), DERIVED (computed; never editable; provenance instead of a pencil; moved by decrees), ANNOTATION (the layer only; zero readers), MINTED (`dm:` entities). ONE ENGINE: `rederive(record, config′, layer)` with pins — fresh generation with no pins is the golden and never moves; canon stays events at the tick |

## §P6 · Mutant hygiene (lifted verbatim from `GR-PREAMBLE.md` §P6, with one EM amendment)

Test trust on an EM wave is proved with disposable source mutants in an isolated immutable candidate. For every mutant, in this order: prove the source bytes actually changed (a no-op plant is a STOP); require a nonzero test exit and the named acceptance title red (a red under a different title is an ambiguous mutant and a STOP); restore the exact pre-mutant SHA-256; rerun focused green. Do not run the estate-wide shared-tree sweep in a checkout that carries other lanes' work. Anti-vacuity rules: a redundant second guard subsumes the first; a count mutant on a literal goes vacuous; a fixture that mirrors the deriver can never see a dead arm; a rendered-surface negative passes when the surface never rendered; a self-referential pin proves nothing; a multi-line `// anchored:` marker counts only if its LAST line carries it, on the line immediately above the negative; a new negative assertion is not proved until the anchor walker is green. **EM amendment:** unlike GR, an EM acceptance file under `tests/lint/` DOES owe its mutation-coverage manifest row (§P2.2).

## §P7 · Gate-reading law (lifted verbatim from `GR-PREAMBLE.md` §P7, with the estate's pause-and-resume)

Never read a gate through a shell pipe; use `npm run check:tail` or `sh scripts/gate-tail.sh <command...>`. Trust no exit status you did not capture in-shell. `npm run check` is a 17-step `&&` chain; a red step blacks out every later step and the receipt says which steps actually ran. Report both TypeScript configurations by name (`typecheck:ratchet` over `tsconfig.full.json`; `typecheck:domain:strict` over `tsconfig.domain-strict.json`); a ratchet being green is evidence only about that ratchet. A failing enforcement walker is a disabled guard, never test debt. If a full gate is red, compare failure identities against a committed-base run; never land past unexplained red. Never raise a baseline, budget, timeout or ceiling to finish a packet. Focused runs hold the slot for the whole process: `GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run <files from ONE test directory> --maxWorkers=2`; a lane never runs `npm run check` (its steps wrap themselves), and at a held gate it pauses per HZ-GATE-POLL. The final full gate is a bare run with a true exit plus a separate boot smoke; under a train both move to the terminal.

## §P8 · Standing STOP conditions

In addition to `PACKET_STANDARD.md`'s list, an EM member stops when: a golden or the prose manifest moves; a second writer of `decrees` or `dmLayer` appears necessary; either key would enter the anonymous envelope, a fork, an import or the gallery projection; a component would import a domain edit module directly; a guard would refuse rather than offer `proceed`; a field the cascade joins on is typed `free`; a phantom would be modelled as anything but a save record; the Change Dock would be merged rather than retired; an adapter per op type appears necessary; the tick hook would consume a PRNG draw; an applied decree would be edited in place; a phantom-side world state (a war state, a treaty, a route) would appear necessary; a DERIVED field would be declared editable, or a world-fact edit would RE-ROLL the city instead of re-deriving it with pins; or the tier gate would be spelled anywhere but `TIER_GATE.premium.editMode`.

## §P9 · What every EM member packet still carries itself

Its scope and boundary; its behaviour and identity contract; its exact change manifest with budgets; its acceptance matrix (eight cases or fewer); its wave-specific mutants and hazards; its census figures re-executed at its own base; the header line citing this preamble by SHA-256.
