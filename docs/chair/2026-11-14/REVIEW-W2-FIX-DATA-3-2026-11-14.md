# REVIEW-W2-FIX-DATA-3 — HANDED BACK AT THE COUNT (no verdict yet)

Reviewer REVIEW-W2-FIX-DATA-3. The lane read: `lane/w2-fix-data-2026-11-13` at **a1481aaf7** (not moved when read), the
stage after 4114cf5a6. The count at the first wake after step 1 read **407,417** (the brief's mark: 400,000), so the seat
hands back here, by file. **No verdict is given: CLEAR / NOT CLEAR is owed by the seat after.**

## Done
- **Step 1 — every new or reworded line read where it prints, COLD** (no hand-back, statement, docs file of the lane or
  commit message of the range opened): `REVIEW-W2-FIX-DATA-3-LINES-READ.md`, commit **6dc6d84d5** (pushed, read back
  from origin), probes under `probes/REVIEW-W2-FIX-DATA-3/`. 126 lines catalogued, 123 read where they print; 344 cold
  reads (277 T / 48 F / 19 D); 42 (line, town) pairs false at high or medium.
- **Step 1's findings so far (to be ranked in the verdict; EXECUTED unless marked):**
  - MED, THE STAGE'S OWN (a draw the stage moved): r2s-infiltrated-metropolis-3 Vatantash, arrival: "The hammering
    echoes through all of Vatantash, and the place plainly lives by its forges." Iron & Metalwork 4% of income, chain
    Impaired; the same page: "Ask what Vatantash lives on and you will hear two or three trades named, not one." Base
    printed a tanning beat there. (The class, forge lines where forges are not the living, is CARRIED: 8 such towns read.)
  - LOW, the stage's own: H11 Neaddale (r2s-under_siege-village-1) Great Construction twin beside "No one here works the
    stone"; F1b Hongcheng (r2s-famine-town-1) DOUBTFUL.
  - HIGH, CARRIED: the PDF's Architecture line names a market / a palisade and river the town lacks (C02 r2r-village-12,
    C08 r2r-city-0, r2r-city-26, r2r-metropolis-41, C05, C15 in fresh births): `src/pdf/sections/IdentityDailyLife.jsx:303`
    prints `culturalIdentity.architecturalDetail` raw; `resolveConfig.js :: knownAtResolve` answers only the tier. Base
    prints the identical line in the same PDFs. A04 r2s-mass_migration-town-0 (forge line, only an idle Smelter).
  - MED, CARRIED: A06 the arms racks "waiting for the carts" under a forced siege (r2s-under_siege-city-3): the row lacks
    the siege exclusion its twins A03/A07 carry. I23 one emergent-siege toll bridge (r2r-metropolis-14). Megaikon
    (r2r-village-55) Guild War beside "No guild runs Megaikon's market"; Radhagrad (r2s-slave_revolt-hamlet-1) "the guilds
    negotiated" beside "no guild". The rest: the LINES-READ table.
  - The last read's F1–F4: F2 (24 → 0), F3 (95 → 0), F4 (11 → 0) cured; F1 cured in the forced shape (granary 4 → 0,
    charnel 3 → 0), one emergent-shape residual (I23 class).
- **Measured for step 3, not yet written up:** the stage's own field moves, isolated by a counterfactual tree (4114cf5a6
  merged with 976db5b19, registers taken from the line; its `src/` differs from the tip in exactly the stage's 19 files):
  `probes/…/out/fielddiff-line-tip.txt` (≈55 families, all institutions[].desc, history.*, culturalIdentity.*,
  culturalNotes, arrivalScene, availableServices.*.desc, stress(ors).crisisHook/viabilityNote, economicState trade
  dependencies' affectedServices, generationCoherenceReceipt; keys appearing/vanishing are existing keys in other towns,
  NOT yet checked against the schema). Not yet compared with the statement's declared families.

## WHAT IS LEFT, line by line
1. **Step 2:** read `docs/chair/2026-11-14/W2-FIX-DATA-HANDBACK-10.md` and `-9.md` (the stage's seats only); every row it
   says cured: its own town and my births (the census dumps), what prints in its place; for each removal read 30 of the
   removed lines; its headline counts by my run; the chair's rulings copied there, and where I would rule differently
   (I would: C12 'organized neighborhoods' at ≥ town, not ≥ village; C04 civic centre at ≥ town).
2. **Step 3:** the field diff against the statement's declared families; the draft shift record against
   `tests/fixtures/.golden-freeze-register.json` (measure declared-moved, sample declared-unmoved); no draw added/moved
   undeclared (the arrival re-deal that put the forge line in Vatantash is one to check against its declaration); no new
   key in the record; no new vocabulary word; no hidable name in a stored composed sentence.
3. **Step 4:** a plant per guard the stage added/changed (tests/data/w2FixData{2Culture,3Grove,3Inland,3Mine,3Round,
   4Round,5Rows,6Rows}, tests/generators/w2FixData*, institutionProseDeclared, tensionTemplateDeclaration,
   hookTablesDeclared, narrativeQualityCorpus, resolveCrisisCast, crisisTripleSync, census2dTables, textOf,
   heldKeyWriterCensus.walker); list the cures with no guard (A06's missing siege exclusion has none; the PDF door has
   none).
4. **Step 5:** the integration merge be4306956: no code file conflicted (remerge: registers, bundles,
   docs/content/wiring-census.json only, read); re-derive each register the stage touched through its own door at the tip
   (`scripts/census/pool-dominance.register.json`, `scripts/.prose-byte-baseline.json`, `tests/lint/presumedThings*.json`,
   `scripts/census/page-census.register.json`, the wiring census) and compare.
5. **Step 6:** `typecheck:domain:strict`, `typecheck:ratchet`, eslint on the touched files, the governing test files, the
   statement's named reds at tip and base (files, not the suite) — all through `sh scripts/gate-tail.sh`.
6. **Step 7:** CENSUS-2 `census2.sh` at tip and base with `--files` the stage's 19 src files.
7. **Step 8:** each reworded data row on every surface (the all-surface renders exist for 233 towns:
   `/tmp/claude-0/runs/surf-*` if the container survives, else re-made); the pool guard's three red titles (no ceiling
   raised, no row re-based); 30 of the 48 named literals' prints read.
8. The verdict file proper (CLEAR / NOT CLEAR), the chair message.

## How the instruments are re-made (the container may be gone)
- Worktrees outside the repo: tip a1481aaf7 (`npm ci`), base 4114cf5a6 (node_modules linked; lockfile identical),
  the counterfactual `line` (4114cf5a6 + `git merge --no-commit 976db5b19`, conflicts `--theirs`, node_modules linked).
- Census: `git archive origin/lane/second-wave-census-2026-11-12 docs/chair/2026-11-12/probes/SECOND-WAVE-CENSUS`;
  `sh …/census.sh <tree> <out> 4` (≈25 min per tree with nothing else running).
- Fresh births: `sh probes/REVIEW-W2-FIX-DATA-3/render.sh <tip> <out> probes/…/seeds-rv3.txt 3`, then pack the records
  into `corpus.ndjson.gz` (one `{seed,s}` per line).
- The judge: `TREE= CORPUS= DUMPS= OUT= node probes/…/judge.mjs` (with `lines.mjs`); surfaces: `surfaces.mjs`; field
  diff: `fielddiff.mjs`; history selection: `tensions.mjs`; table: `table.mjs` + `notes.json`. Run from outside every
  repository tree.
