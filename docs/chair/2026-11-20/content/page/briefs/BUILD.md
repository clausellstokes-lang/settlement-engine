# PAGE-1's build brief: the display half (four units: CARD, OUTPUT, SAFETY, MAGIC)

Written by PAGE-1 (a seat of the seventh chair) for its own builders, 2026-11-20, on the chair's order of 11:15 UTC. The
owner's order, verbatim: "Do all of these, every last one predeploy". Your unit is ONE section below, named in your
prompt. Read this whole file first, then `CLAUDE.md`, then `docs/chair/2026-11-20/content/page/PAGE-1-PROPOSAL.md`
and the measure outputs your section cites (`docs/chair/2026-11-20/content/page/measures/{B,C}/*.out.txt`).

## The common law of every unit

- YOU WORK IN YOUR OWN WORKTREE (the Agent harness made it from PAGE-1's branch). Run `npm ci` there if
  `node_modules` is missing. ONE COMMIT on your worktree's branch, by plain `git commit` with the hooks: never
  `--no-verify`, never `core.hooksPath` overrides, never amend another's commit. DO NOT PUSH, never a pull request.
  PAGE-1 merges your commit. Author: leave git's configured author as it is.
- RENDER ONLY. NO stored field of a born town moves. PROVE IT: hash the born documents at base and at your tip
  (the 300 towns `hxd-<size>-<i>` of `measures/A/measureA.mjs`'s recipe AND the census's 720, `censusPlan('r2')` +
  `configOf`, as `docs/chair/2026-11-20/content/tools/confinement/born.census.js` on `origin/lane/names-3-2026-11-20`
  does): `JSON.stringify` of each document, sha256, the two lists equal. Write the script and its output under
  `docs/chair/2026-11-20/content/page/build/<UNIT>/`. A difference stops you: report it, do not explain it away.
- YOUR FILES: `src/components/`, `src/domain/display/`, `src/pdf/`, `src/foundry/` and their tests, only as your unit
  needs. NOT YOURS, NEVER EDIT: `src/data/historyData.js`, `src/generators/` (all of it), `src/data/npcData.js`,
  `supabase/`, `src/domain/veil/`, `tests/security/`, `src/domain/display/gallery*.js`, `publicSafe.js`,
  `src/domain/summary/`, `src/domain/crisis/`, `src/domain/tension/`, `src/domain/traditions/`, `src/domain/seat/`,
  `src/domain/rulingPower*.js`, the generated state-prose pools (`src/data/dossierStateProse/`) and their kernel. If
  your cure needs one of them, STOP and report.
- RED FIRST: write the test, run it against the untouched tree and record it red (to a file), then build and record
  it green. A test that needs a pool's sentence COMPUTES it (`tests/helpers/drawnProse.js`), never quotes it.
- AUTHORED LINES (any new words a DM reads) go in your report verbatim, listed, BEFORE PAGE-1 merges: the chair
  reads them first. Plain words a DM would say at the table; no figure out of 100, no word of the model's working
  (no "band", "score", "ratio", "tier", "influence"). Never a new fact: every clause is read from the record.
- PINNED RENDERS: the page census (`node scripts/census/page-census.mjs --grid`, and the full banked corpus if your
  change can touch any page-census pattern), every snapshot or pinned render your change moves: re-record each by
  its OWN door (the script's own `--shrink`/`--update`/`-u`, never a hand edit), and write the cause in the commit
  message. A count that ROSE is a stop: report it.
- GATES, each to a file and read by its count lines, never through a pipe (`sh scripts/gate-tail.sh <command>` prints
  the tail and keeps the exit status): your own tests; `npx vitest run tests/lint` WHOLE; `npm run typecheck:ratchet`;
  `npm run typecheck:domain:strict`; `npm run lint`. NEVER the whole suite. Reds known on the line that are not
  yours: the stored fingerprints of generated towns, the server bundles' freshness, five size ceilings (name any
  red you see and whether it is red at base too). No test run with any of GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE,
  GIT_COMMON_DIR, GIT_OBJECT_DIRECTORY or GIT_PREFIX in the environment.
- YOUR REPORT (your final message, at most 600 words): the commit sha and branch; the surfaces you changed (file:line);
  the authored lines verbatim; red-then-green receipts (file paths); the hash proof's two counts; each gate's count
  line; anything you could not do.

## CARD (F4: the machine's words on a people card)

Today 88.6% of cards print one dot and "Standing marginal" (`src/components/new/npcComponents.jsx:294` dots, :570 word,
from `src/domain/display/npcInteriorityRead.js:45` INFLUENCE_WORD on `n.influence`). The stored `influence` is
misread at birth (a keyword fault, PAGE-2's, NOT yours), so the word and the dots carry a machine's error.
1. MEASURE: every surface that prints `n.influence` as a word or a mark to a DM or a player (the card's dots and
   "Standing", the PDF (`src/pdf/`), the Foundry export (`src/foundry/`), any sorter that only orders is NOT a print):
   list them with file:line.
2. CURE: the card stops printing the inner word and the dots from `influence`. Where the line says anything it says
   the FACT: first of a power ("first of <power>", already printed? read the card) and that power's weight HERE,
   read from the record's own power figure for that faction (find it: `powerStructure.factions[].power` or the
   faction's own label; say what you read). A keeper in no power: nothing. The same on each print surface you list.
3. "CALLED BY <name> · <kind>" (`npcComponents.jsx:539`, `src/domain/display/cardTies.js:42`): becomes plain words
   for a tie another person holds toward this one (e.g. "<name> holds a tie to them: <kind in plain words>"; the
   archetype labels such as "Outstanding Debt" may stay as the kind's name if they read as plain English). Do not
   edit the ties' own prose (generators); only the header your component prints.

## OUTPUT (F3b: "Output n/100" beside the prosperity word)

Today Economics prints `economicState.compound.economyOutput` as n/100 (`src/components/new/tabs/EconomicsTab.jsx:363`),
the economy dial after its drags (`src/generators/priorityHelpers.js:416-434`, read only), at most 50 in all 300
towns, beside a prosperity word made by another model: 36% of towns sit two steps apart (B's f3.out.txt §b).
1. MEASURE: every surface printing that figure or a grade of it (screen, PDF, Foundry, summary): file:line. The
   record's own multipliers that make it (no market ×0.75; crime; a crisis; a neighbour; any other): where each is
   stored on the record, so the page READS them and recomputes nothing the generator decided.
2. CURE: no grade out of 100 on any surface. In words: how much of what the town's own dial and market could make it
   is making (a plain fraction in words: "nearly all", "about three parts in four", "about half"; you author the
   ladder) and which drag holds it back most (crime; no market; a crisis; a neighbour), read from the record. Where
   nothing drags: one plain line. ONE pure reader in `src/domain/display/` that every surface calls.

## SAFETY (F3a: Overview "Safety" beside Foundations "Law & order")

Both measures STAY as computed (`src/generators/safetyProfile.js`, `src/domain/causalState.js :: deriveLawOrder`: read
only). Today they sit two steps apart in 18% of towns (city 42%, metropolis 52%; B's f3.out.txt §a, its ordinal
scale at the top of that file). SAFETY PRINTS ON PLAYER AND PUBLIC PAGES TODAY (`OverviewTab.jsx:396`, no audience
gate; the veil keeps `safetyLabel`).
1. MEASURE: every surface that prints the Safety label (the Overview, the Defense tab, the Open Tonight sheet if it
   prints it (`src/domain/summary/tonightSheet.js`: read, never edit), the PDF, the Foundry export, generated prose is
   NOT a surface you touch): file:line, and for each, which audience reaches it (owner's own page; a shared or
   public page; the gallery). How the page knows its audience today (find the prop or store field).
2. CURE: ONE pure leaf in `src/domain/display/` taking the record and an AUDIENCE ('owner' | 'reader'; missing or
   unknown = 'reader': FAIL CLOSED). For 'owner': the born label and, where the record holds what that label could
   not see (the hall in criminal hands: `criminalCaptureState` rung; a live crime wave tension; Law & order two or
   more steps below), the qualifier in words, in the shape of `src/domain/display/prosperityInCrisis.js`
   ("Prosperous before the famine; Struggling while it lasts"). For 'reader': the born label ALONE, byte for byte as
   today. Every surface you listed calls it; a shared, public or gallery path passes 'reader' (or nothing).
3. THE GUARD (a test over born pools: the 300 and the census grid): the owner's page never shows the Safety label two
   steps or more from Foundations' law-and-order band with no qualifier between them. AND a test that every
   reader/shared/public path prints today's bytes (hash before and after for the rendered reader view).
4. In your report: "THIS IS A NEW SURFACE THAT READS CAPTURE", with the proof of (3) for the security reader.

## MAGIC (F3c: "Reliance on magic: Relied upon" beside "Magical Capability: Weak")

B measured 26 of 300 towns two steps apart (village 20%, town 18%); 18 of them "Relied upon" from the "Divine &
Magical Healing" chain (`src/domain/magicReliance.js:80` counts any chain whose label holds "magic") beside an
ARCANE capability (`src/generators/defenseGenerator.js:279-282`). Also the Magic tab's headline "Medium" in 300/300
is the world dial (`src/domain/display/magicProvisionShown.js:325`).
1. MEASURE (confirm): are they two honest measures (reliance on any magic, divine included; capability = arcane
   presence)? Where each prints (file:line, every surface).
2. CURE if honest: ONE line in the page's own words where the two disagree, saying what each counts (e.g. that the
   town leans on its temple's healing while its arcane strength is weak); and the Magic headline says it is the
   world's measure, not the town's. If NOT honest (one input read wrong), STOP and report: do not re-derive.
