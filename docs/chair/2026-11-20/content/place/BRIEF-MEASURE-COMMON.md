# PLACE-1 — the common part of every MEASURE-AND-PROPOSE brief (one field a brief)

Written by PLACE-1 (the seventh chair's seat for the place's repeated sentences), `date -u` at writing: 2026-11-20T16:00Z.
The field brief that names this file says WHICH field; this file says HOW. Read both whole; read nothing wider than they name.

## The order you serve (verbatim)
The owner, 2026-11-20: "So do what you can to comprehensively fix the sameness fault as much as you can".
His standing rules, binding every line you propose: "Don't invent drama capitalize on what's already there if it's there. Sometimes a calm place is precisely what's needed… We are not creating the campaign."; "culture only shifts the weight of RNG, never determines it by itself."

## The cure's one pattern (the chair's ruling; what your proposal must fit)
1. SAY SOMETHING THE RECORD HOLDS: a default sentence that says nothing is replaced by one composed from THIS place's own facts, each fact read from its home under `src/domain/facts/` (`factsOf.js` names the homes; `docs/DESIGN_POOL_CENSUS.md` §1 is the vocabulary). Each wording DECLARES the facts it NEEDS. Never a new trouble; never a fact the record lacks; a calm place stays calm; the sentence keeps the WEIGHT it has today (a plain remark stays a plain remark).
2. SEVERAL WORDINGS A BRANCH, chosen by keyed hash with NO NEW DRAW: `src/kernel/proseHash.js :: pickVariant`, keyed on the birth's seed and the field. The random stream's order must not move: nothing else in a born town may change.
3. THE BAR: no sentence in more than about 15% of a size's places, by size, on 100 places (seeds `hxd-<size>-0..99`), the place's names masked exactly as the chair's census masks them (goods and houses NOT masked).
4. Every new pool lives in its OWN NEW DATA FILE, registered where the pool census wants it; the presumption walkers go green BY DECLARATION (each wording's `needs`), never by an exemption.
5. A SAVED TOWN KEEPS ITS STORED SENTENCE: nothing changes at render.
6. Files other lanes hold: `src/generators/economy/prosperity.js` may take only ONE call line (plus the new data file beside it). Never touch anything under `src/generators/power/`, nor `factionDynamics.js`, `narrativeGenerator.js`, `npcData.js`, `npcStructure.js`, `spatialGenerator.js`, `historyData.js`, `historyGenerator.js`; nothing under `supabase/`, `src/domain/veil/`, `tests/security/`.

## What a MEASURE builder does (you change NO file under `src/` or `tests/`)
Produce ONE file, `docs/chair/2026-11-20/content/place/<FIELD>-MEASURE.md`, plus the scratch scripts that made its numbers under `docs/chair/2026-11-20/content/place/tools/<field>/` (committed: every figure must be re-runnable by its script, named beside the figure). Sections, in this order:

0. **IT PRINTS (the chair's rule, 2026-11-20 16:25 UTC; amended in here by PLACE-1 at 2026-11-20T16:26Z).** Before any measure: render one place that holds the field through the page census's walker (`scripts/census/page-census.mjs :: walkDossier`, or `docs/chair/2026-11-20/content/tools/confinement/run.mjs <tree> <out> render`, the real OutputContainer) and find the stored string on a surface; NAME the surface (tab, group, view: DM and player) with the command. A field no page prints on a fresh birth is reported in one line and DROPPED: no proposal.


A. **THE BRANCHES.** The writer function(s), cited `path :: symbol` (never `path:NNN`). Every branch (each `return`, each declared twin through `resolveSibling`), its condition in one plain sentence, and its share BY SIZE on 100 places a size (thorp, hamlet, village, town, city, metropolis). Born exactly as the chair's census births them: `docs/chair/2026-11-20/seventh/measures/stored-census/census.mjs` (read it; copy its birth lines and its mask verbatim into your script).
B. **THE READERS.** Every reader of the field in `src/` and `tests/`: (i) who PRINTS it (components, summary, dossier); (ii) who MATCHES ITS WORDS (a regex or a literal that reads the sentence: coherence arms, band tables, state prose, the dossier manifest, pinned test strings); (iii) who COMPOSES FROM IT (quotes it into another string). For each: `path :: symbol` and what breaks or moves if the sentence changes. Name every test file that pins a literal of the field.
C. **THE FACTS AT HAND.** For the branch(es) above the bar: which facts the record holds that a wording could say (what it sells, what it buys and by which road, its market, its guild, its route kind, its label…). For each fact: its HOME (`src/domain/facts/…` or `canonicalAccessors.js`), whether that home reads the FINAL record, and whether the value in scope at the field's writer EQUALS the final record's (count disagreements on the 600 births: a later pass may append or drop goods). Where the birth's seed is reachable at the writer (or is not), and the key form existing `pickVariant` callers use (cite two).
D. **THE CANDIDATE WORDINGS.** For each branch above the bar: several wordings (aim for 4–8 a branch; more where the facts are few), each with its declared `needs`, each in the register of the line it replaces (same length class, same weight; no trouble, no drama, no invented fact). A wording that names a good or a road reads it from the record. Say which existing house idioms you follow (the declared-line shape in `src/domain/facts/drawDeclared.js`, `factVocabulary.js`: read, do not change).
E. **THE PROJECTION.** Simulate your candidate composer IN YOUR SCRATCH SCRIPT (not in `src/`) on the same 600 births, masked as above: the top share by size before and after, and the ten commonest after-sentences in the worst size. If any size stays above about 15%, say why and what fact would lower it.
F. **WHERE THE CHANGE WOULD LIVE.** The file(s) a builder would touch (the new data file, the one call line, any reader that must follow), the fact homes it imports, and the proofs it would owe: the red-first test, the confinement run (`docs/chair/2026-11-20/content/tools/confinement/trees.mjs <before> <after> <workdir>` must read 0 non-string differences), the pinned tests that move.
G. **OPEN QUESTIONS** for the chair, each one sentence. `src/domain/facts/factVocabulary.js` is read-only: a wording that needs a fact the record HOLDS and no atom answers lists it here as "ATOM <key> : <its home under src/domain/facts/> : <the wording>" (the chair's leave, one atom at a time); never an atom for something the record lacks (no season, no climate, no missing count): such a wording is rewritten to need none.

## Rules
- Read every source file you rule on WHOLE, once. Cite by symbol.
- Every run's output to a file; read count lines; never print a log whole. Never the whole test suite; no census of lighting, wiring or pages (those are PLACE-1's).
- `node_modules`: if your checkout lacks it, symlink the main checkout's (`ln -s /home/user/settlement-engine/node_modules node_modules`) and do NOT commit the link.
- Commit ONLY your MEASURE file and your scripts, by explicit paths, on the branch you are given; author as the repository's configured user; never push (PLACE-1 pushes); never `--no-verify`; never stage anything else.
- Your FINAL MESSAGE: at most 200 words: the commit, the before/after top share by size in one line each, and the open questions. Everything else lives in the file.
