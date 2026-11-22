# LEGACY-POOL (V33-LP, seated by VEIL-33): master-born places read by today's 212 and twin

## THE FINDINGS (CONFIRMED = measured here; PLAUSIBLE = a cause not yet witnessed)

1. CONFIRMED, GATES. Master-born slice, read in a universe that is also master-born (300 places, plus the gate's 140 towns re-born by master): **GATE-1 17/91, LOWER BY RULE 8, GATE-2 32 cells red**. The same slice born today and read the same way gives GATE-1 16/92, LOWER BY RULE 10, GATE-2 40 red. The lane's pool gives 4/92 and 20 red, but its universe is six times larger (1808 places). So the slice-sized universe raises both engines' figures alike, and master-born places score no worse than today-born ones at the same size.
2. CONFIRMED, GATES, MIXED UNIVERSE. Master-born towns gated against the lane's full today-born universe: **GATE-1 91/91**. Every hidden-house town fails at allOpen with Reveal DM, on `r.people.corruptKeys="n"`. At the other settings the count is 8 (Reveal off) and 16 (DM). GATE-2 has 18 cells red. The controls also fail, 23 to 26 of 49, mostly on `x.dragMarket="other:1"`. That part is the shape of the older engine, not a hidden house. The instrument checks out: the same analyzer on today-born towns re-read by this mode gives **4/92 and 20 red**, the lane's own figures exactly.
3. CONFIRMED, DIFFERENTIAL. Master-born places: 225 hiding places, 440 hiding reads, **1760/1760 engine-door reads equal**, 0 faults. Today-born places: 1732/1732 equal. But there are **1492 absence faults**: they come from places stored with `publicProse` (the lane's `saves.js` writes it). The block `publicProse.blocks.power:governance.text` holds the `recentConflict` sentence verbatim and is served. The plant does not see this because its own pool stores no `publicProse`. This is today's engine, not a legacy finding.
4. CONFIRMED, LEGACY-ONLY TELLS: 4 rows.
   - `people.card`: `npcs[].secondaryAffiliation: "Thieves' Guild"` is served at dm/own while that house is withheld (32 places).
   - `people.rosterCopy`: the same value in `factions[].members[]` (30 places).
   - Unregistered `relationships[]`: `npc2Role: "Thieves' Guild Master"` is served at **Reveal OFF**/own (12 places).
   - Unregistered `factions[]` (key tell): `members[].corruptTies = {}` at dm/allOpen (82 places).
   - Cause: master writes the house name into `secondaryAffiliation` in 66 of 440 places; today's engine does in 0. Master puts a thieves' role on a relationship in 244 places; today's in 52.
5. CONFIRMED, SERVER DIFFERS FROM TWIN ON LEGACY ONLY. In 9 of the 91 master-born hidden-house towns the server and twin disagree, at every gated setting with Reveal DM, on `k.powers.power`: the twin serves "ap", the server serves "p". On today-born towns this happens in 0 of 92.
6. CONFIRMED, READERS. `pageRederive.js` fed a nothing-hidden legacy read and compared with the stored record:
   - Defence scores equal in 35 to 109 of 417 places (one score at a time).
   - `readiness.score` 17/417, with 181 not drawn.
   - `economicGates` 100/417.
   - `rederiveCrimeTypes` 239/417.
   - `rederiveRecentConflict` 111/417.
   - `economyOutput` and `blackMarketCapture` 417/417.
   - On today-born places every reader is equal to the record (419/419), except readiness 408 (11 not drawn) and recentConflict 418/419.
   - A condition's `severity` matches in 12/329 legacy and 13/331 today. That is by design: VR37 draws it from the band default.
   - These readers draw only from the served document, so this is fidelity: the page shows other figures than the owner's record. It is not a leak.
7. CONFIRMED, WORD RULES (7). Master-born documents leave every word rule's measures where today-born ones put them:
   - `compound.inst.flags`: 0 of 880 compounds differ between master's flags and today's keyword fold.
   - The counts of documents naming a house or power are close: income.desc 7/7, criminalInstitutions 173/166, power.entry 87/87, dmNote 42/48, conflicts 44/46, pressureSentence 11/11.
   - No word row has a legacy-only tell.
   - PLAUSIBLE, about what reaches through: the legacy tells in item 4 are in fields that hold a house's WORDS while the rule covering them reads a KEY. `people.card` goes by card identity, and nothing reads the words of `secondaryAffiliation` or `npc2Role`.
8. PLAUSIBLE, CAUSE OF ITEM 2. `corruptKeys="n"`: under allOpen with DM, master-born hidden-house towns serve NPCs with no corrupt keys. Today's universe always shows some at those sizes, and the `corruptTies` key tell in item 4 has the same root.


## WHAT WAS DONE

**Piece 1, the dump** (`dump.probe.jsx`, `dump.sh`). This makes births by master's engine (`/home/user/wt/master` at db832c892, with its own `npm ci`, nothing written there outside `node_modules`), stored as master's save stores a place:
- `src/lib/saves.js :: supabaseSave` writes `data: withNeighbourNetworkFromRelationship(settlement)`. That is a no-op without a neighbour.
- `settlement` is the direct `generateSettlementPipeline` result (`workers/generationRequest.js :: runSettlementOp`, no locks).
- Master has no `publicProse` module, so master-born places carry none.
- The same probe run on the lane's tree composes `publicProse`, as `tell-common.mjs :: birth` does, for the born-today twin of the slice.

**Mapping.** None was needed:
- `birthConfig` is byte-identical.
- `DEFAULT_CONFIG` values are unchanged; only the admitted-key list `CONFIG_PATCH_EXTRA_KEYS` changed.
- The density boundary only adds a manifest entry.
- The pipeline's signature `(config, neighbour, { seed, customContent, onStep })` is the same.
- `loadGenerationLawPayloads` is awaited on both trees.
- The probe's `cfgOf` and dials are used verbatim, from each tree's own modules.

**The slice** (of `/var/tmp/v18/t2/pool-r5c-1`):
- Part A: the first 45 births per size by `k`.
- Part B: the first 30 per size.
- The towns: all 140 (`r3m-<size>-<crisis>-<k>-<idx>`, N=2).
- Total 440 per engine, in `/var/tmp/v18/lp/docs-master` and `/var/tmp/v18/lp/docs-today` (not in git).
- Routing by what each document holds (today's `isHideableHouse`): 4 master-born part-A births hold a house and are read as part B; master's towns hide in 91 places (today's: 92), with 49 controls (today's: 48).

**Piece 2, the read-stored mode** (`legacy.probe.jsx`, `RV9_MODE=stored`, a copy of `tell2.probe.jsx`; `stored.sh` runs it).
- Server: local PG16 at `/var/tmp/rv7`, template `lp_tpl` = `createdb -T v27x211` plus the lp tree's 212 (sha256 ff20ed89).
- Twin: same settings and hiding choices as the tell's own probe.
- It writes the analyzer's own format (`pool`/`poolb`/`towns-shard*.json`) plus `extra-shard*.json` (differential, tells, readers). `lp-an.mjs` makes the tables for items 3 to 7.
- Command (seat notified):
  `cd /home/user/wt/lp && env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE sh scripts/gate-mutex.sh --run -- sh docs/chair/2026-11-20/veil/out/v33/legacy/stored.sh /home/user/wt/lp <stored dir> <outdir> lp_tpl`
- Then `node docs/chair/2026-11-20/veil/out/v33/legacy/lp-an.mjs <outdir> [<baseline outdir>]`.
- Note: the master read ran before a guard for undefined leaves was added to the tells loop. That run finished, so it met no such leaf. The today-born read needed the guard and was run with the committed probe.

**Definitions.**
- (2) is the plant's DIFFERENTIAL arm restated: setting own, Reveal off and on, server page (`get_gallery_dossier`), server import (`import_gallery_dossier` as READER) and the twin. Each is read against the same place with the withheld powers and houses removed. Checks: the page sentence `rederiveForPage` / `rederiveServed`, the absence faults, and the withheld-name fold.
- (3) counts, on the twin, at every gated setting and both Reveals:
  - name: a served string the plant's `namesWithheld` fold finds;
  - kind: a served string matching `CRIME_NAME_PATTERN` at a path where the never-there read serves none;
  - key: a path the never-there read lacks.
  - Each is attributed to the registry row whose path matches the longest prefix, or to "(unregistered) <prefix>".
- (5) word rules are the rows whose rule text reads words: a keyword fold, a desc naming a house, "by name", criminal-worded, names the withheld power, holds its words. Rows withheld always (their words are never read) and `cast.stakes` (it names its power by `factionId`) are excluded.

## RECEIPTS (`receipts/`)

- `gates-master-slice.txt`, `gates-today-slice.txt`: the analyzer on each slice in its own universe.
- `gates-laneU-masterTowns.txt`, `gates-laneU-todayTowns.txt`: each engine's towns against the lane's pool.
- `lp-master-vs-today.txt`: items 2 to 7, both dumps side by side.
- `windows.txt`: the UTC windows of the runs (dumps 20:45 to 20:46; master read 20:51 to 21:04; today read (rerun) ending 21:26).
