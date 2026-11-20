# confine — the seat lane's confinement hash (brief `../briefs/CONFINE.md`)

**What it proves.** While the seat law is dark, a unit moves no born world: ONE sha256 over the 1,245 born documents (the golden master's 525, `tests/helpers/goldenMasterCorpus.js :: goldenCorpus` born as `tests/property/generatorGoldenMaster.test.js :: hashFor` births them; the census's 720, `censusPlan('r2')` born as `tests/lint/namesInSentences.walker.test.js` births them, after `loadGenerationLawPayloads()`) reads EQUAL at the unit's base and tip. Each document is `JSON.stringify(town)` (the golden master's own serialization), hashed; a set's sha folds its documents' hashes (hex + "\n") in the suite's row order; `all` folds golden then census. Each set is born in its own node process.

**Run.**
- One tree, from its root: `node docs/chair/2026-11-20/content/seat/confine/confine-hash.mjs [--only golden|census]` → `golden <sha> 525`, `census <sha> 720`, `all <sha> 1245`.
- Two commits: `sh docs/chair/2026-11-20/content/seat/confine/confine-two.sh <base> <tip>` (from this checkout, after `npm ci`) → both trees' lines, then `EQUAL` (exit 0) or `DIFFER` (exit 1). It `git archive`s each commit under a temporary directory it prints, symlinks the checkout's `node_modules`, runs this checkout's `confine-hash.mjs` from each tree's root (each tree births with its own `src/`), and removes the temporaries. It never touches the checkout's working tree, index or branches, and sets no GIT_* variable.
- The control: `--plant <file>:<from>:<to>` changes the first `<from>` in `<file>` in the TIP's temporary tree only.

**The proof, both ways (2026-11-20, node v22.23.5).**
- (a) `run-proof.txt`: base `6ad3e03d1`, tip `268f73378` → `all 36ee5bb0…d8ce89 1245` on both: **EQUAL**.
- (b) `run-plant.txt`: the same pair, the plant in the tip tree only: `src/generators/power/factionStanding.js`, the rank-1 standing line (`annotateFactionStanding`'s `topTwoGap <= 6` arm, "The gap between them and … is narrow. A single shift in patronage…") "is narrow." → "is slim." → tip `all ccb351cf…0c5d1`, golden and census both moved: **DIFFER**.

**How long.** One tree: about 2 min 30 s (both sets, serial; measured 2m30.6s). `confine-two.sh`: about 5 min 15 s to 5 min 45 s.

**Same serialization as the suite.** At 268f73378 the golden set's per-document hashes equal the stored manifest (`tests/fixtures/generator-golden-master.json`) on exactly the 4 rows the red golden still reproduces (521 of 525 drift), so a document hash here IS the golden master's hash.
