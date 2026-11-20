# PAGE-9's brief: THIN-MEASURE (the measure the chair's ruling 17 orders BEFORE a THIN builder is cut)

Written by PAGE-9, 2026-11-20 17:15 UTC (`date -u`). MEASURE ONLY: you write NOTHING under `src/` or `tests/`, you
commit nothing, you push nothing. Your files go under `docs/chair/2026-11-20/content/page/measures/THIN/` (scripts,
configs and outputs; a vitest config for a render harness may live there, as `measures/B/.run/` does). Base: the
checkout you are in (`lane/page-9-2026-11-20`, PAGE-4's tip `524be0147`: OUTPUT merged, SAFETY merged).

## Read first (whole): `docs/chair/2026-11-20/content/page/briefs/THIN.md` (the unit this measure gates) and the
chair's ruling 17 quoted here: "(1) nothing new computed or stored; (2) MEASURE FIRST on the 300 (`hxd-<size>-0..49`):
per slot and line, distinct texts and the largest share of one text BY SIZE; a line printing one sentence in more than
about a quarter of a size's places is NOT printed and goes to the chair with its count; (3) every audience fails closed:
list what each slot and line READS; a DM fact prints on the owner's page only; (4) the page's added words to the chair
before the merge." Also: "PROVE IT PRINTS: a field is shown rendered (the surface named, searched by CONTAINMENT,
never by equality: a label before the text defeats equality)".

## The towns
The 300 untouched towns: `{ ...DEFAULT_CONFIG, settType }`, seeds `hxd-<size>-<i>`, i = 0..49, six sizes, born by the
names walker's recipe (`tests/lint/namesInSentences.walker.test.js`: `loadGenerationLawPayloads()` then
`generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} })`). Recipe:
`git show origin/lane/chair-2026-11-08:docs/chair/2026-11-20/seventh/measures/holistic/README.md`. The SAME-1 seat's
census tool may be reused (read, not copied blind): `scripts/sameness-census.mjs` and
`docs/chair/2026-11-20/content/same/census/tools/printed.mjs`, both on `origin/lane/same-1-2026-11-20`
(`git show origin/lane/same-1-2026-11-20:<path> > measures/THIN/<name>`; fix relative imports in YOUR copy only).

## What to measure (one script that measures several things; every run's output to a file; read count lines)
A. THE CANDIDATES, at record level over all 300, BY SIZE: for each of `deriveDailyLife(record).slots`' EIGHT slots
   (`src/domain/dailyLife.js`), each `economicViability.warnings[]` and `.dependencies[]` text (title and description
   separately), `economicViability.summary`, and each `magicProfile.contributors[].reason`
   (`src/domain/magicProfile.js`): fill (towns holding it), distinct texts, and the LARGEST SHARE OF ONE TEXT among the
   size's towns that hold it. Mask nothing. Flag every slot/line whose top share exceeds 25% in ANY size, with that text
   and its count.
B. WHAT PRINTS TODAY, by CONTAINMENT: render the owner's page (and the PDF's DM document if your harness reaches it) for
   at least 10 towns a size (60), and for each candidate text say whether any surface prints it (a sentence of the text
   contained in a printed line), and on which surface. In particular: Outlook (`ViabilityTab.jsx`) and the filter in
   `viabilityFilter.js`: which warnings/dependencies are dropped, by which exclusion list, and that list's history
   (`git log -S` on it: the commit and its stated reason, if any). Is `economicViability.summary` reworded anywhere?
C. THE AUDIENCE: for each candidate, the record fields it READS (follow `deriveDailyLife` and the viability/magic
   paths to the stored fields), and for each field whether a shared, player or public read serves it
   (`src/domain/display/factLayers.js`, `publicSafe.js :: toPublicSafe`, the tabs' `publicDossier`/`playerView` props).
   A candidate that reads a DM-only field is "owner page only".
D. YOUR ESTIMATE of the THIN build (lines of code and of tests, files touched) for the candidates that pass A.

## The report (at most 350 words plus ONE table)
The table: candidate × size → fill / distinct / top share (flag >25%); prints today (Y/N, surface); audience. Then the
exclusion lists' histories in one line each, the estimate, and what you could not measure. Outputs and scripts under
`measures/THIN/` with a one-line re-run command at the head of the output file. Born documents are never written to.
