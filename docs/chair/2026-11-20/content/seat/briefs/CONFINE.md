# CONFINE — the seat lane's confinement hash (a measuring seat; nothing under `src/` or `tests/`). Read `briefs/COMMON.md` first.

**Why.** The golden is already red on the line (the names work's stored figures, the owner's to sign at the close), so a unit's own movement of a born world is masked. The chair's rule (08:21Z): every unit of the seat lane claims ZERO movement of any born world while the seat law is dark, and proves it by ONE HASH over the born documents at its base and ONE at its tip, EQUAL.

**What is born** (exactly as the suites birth them; read each to copy its call, never paraphrase it):
- the golden master's 525: `tests/helpers/goldenMasterCorpus.js :: goldenCorpus()` through `generateSettlementPipeline(cfg, null, { seed, customContent: {} })`, as `tests/property/generatorGoldenMaster.test.js` does;
- the census's 720: `censusPlan('r2')` through `configOf(row, DEFAULT_CONFIG, birthConfig)` after `loadGenerationLawPayloads()`, as `tests/lint/namesInSentences.walker.test.js` does (find the modules by reading that walker).
Each document serialized deterministically (the way the golden master serializes, or `JSON.stringify` if that is what it uses; say which) and folded in a fixed order into ONE sha256 per set and one over all 1,245.

**Deliver** under `docs/chair/2026-11-20/content/seat/confine/`:
1. `confine-hash.mjs`: run from a tree's root (`node <path>/confine-hash.mjs [--only golden|census]`), it births that tree's documents and prints `golden <sha> <n>`, `census <sha> <n>`, `all <sha> 1245`. It imports the tree it runs in (its own `src/`), so the same script run in two trees compares them.
2. `confine-two.sh <base> <tip>`: makes two `git archive` trees under a temporary directory it names (with `node_modules` symlinked from the checkout), runs the hash in each, prints both lines and `EQUAL` or `DIFFER`, removes the temporaries. It never touches the checkout's working tree, index or branches.
3. `README.md`, at most 20 lines: what it proves, how to run, how long a run took.
**Prove it once, both ways, and commit the outputs** (`confine/run-proof.txt`, `confine/run-plant.txt`, a few lines each): (a) `confine-two.sh 6ad3e03d1 <the lane tip SEAT-2 names>` (both dark; the tip adds only docs and registers) → EQUAL; (b) the plant: the same tip, but in the tip's temporary archive ONLY, one word changed in a string a birth writes in `src/generators/power/factionStanding.js` or `src/generators/people/castPowers.js` (find a reached line by reading the code; say which) → DIFFER. The script may take a `--plant <file>:<from>:<to>` option for (b), or (b) may be done by hand in the temporary tree; say which.

**Commit** on `lane/seat-2026-11-20-confine` (cut from the commit SEAT-2 names): the script, the wrapper, the README and the two run outputs. No test file, no `src/` file, no register, no census file.
