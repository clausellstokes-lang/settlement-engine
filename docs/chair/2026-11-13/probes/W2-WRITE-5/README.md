# W2-WRITE-5 — the corpus lane's instruments (for the three seats of the split)

Nothing here names a scratch path. Every script takes its places from the environment:
- `LANE` — your scratch worktree of the lane (or side) branch, with `npm ci` run in it (then unset the
  `core.hooksPath` that husky writes into the SHARED local config, and compare: see push.sh).
- `OUT` — a scratch directory OUTSIDE the repository for logs and outputs.
- `MAIN` — the primary clone (whose `.git` the worktree shares), for push.sh's before/after comparison.
- The helpers read their own siblings from the directory they live in: copy this folder anywhere
  (`git archive origin/lane/w2-write-2026-11-13 docs/chair/2026-11-13/probes/W2-WRITE-5 | tar -x -C <dir>`)
  and call them by path. `pins.py` and `lib.py` act on paths relative to the current directory: run them
  from `$LANE` (iterate.sh does).

| file | what it does | command | writes | time |
|---|---|---|---|---|
| `elig.sh` + `elig.census.jsx` | births seeds in the APP's own shape (DEFAULT_CONFIG, `selectedStressesRandom:false`, the ticked crises from the seed name, priorities randomised); draws every PUBLIC prose site; the kernel's `drawVariant` wrapped: per town and pool, eligible and drawn vids. `EXTRACT=<abs path>/ex.mjs` adds a compact read of the record (crises, defence facts, institutions, critical imports). PLAYER audience only: blind to `dm-only` pools (use render.sh). | `sh elig.sh $LANE <out> seeds-w5a.txt 4` | `<out>/elig.ndjson` | ~2 min / 762 towns |
| `q.mjs` | queries elig.ndjson: per vid of the matching pools, towns eligible / drawn, by crisis; with a vid, the seeds | `node q.mjs <out>/elig.ndjson '<pool substring>' [vid]` | stdout | s |
| `render.sh` + `render.w5.jsx` | the reviewer's owner-page render (REVIEW-W2-WRITE's, every tab, every disclosure), seed pattern widened (`<prefix>-<size>-<crises>-<i>`, `+` joins crises; `rww-`/`rw3-` seeds reproduce those reads). Also writes `<seed>.draws.json`: each pool's eligible and drawn vids AS THE OWNER'S PAGE READS THEM (dm-only pools included) | `sh render.sh $LANE <out> <seedsfile> 4` | `<out>/dumps/<seed>.txt`, `.draws.json`, `<out>/records/<seed>.json` | ~4 s a town with 4 workers; 762 towns 12 min |
| `oq.mjs` | queries the owner-page draws | `node oq.mjs <out>/dumps '<pool substring>' [vid]` | stdout | s |
| `ex.mjs` | the extractor for elig.sh | (via `EXTRACT=`) | | |
| `seeds-w5a.txt` | 732 `w5-` seeds (6 sizes x 17 crisis sets x 2) + the read's thirty `rww-` | | | |
| `doors.sh` | the annex doors in order: projection, wiring census, projection, both `--check` (the corpus is regenerated ONLY by these, never by hand) | `LANE=.. OUT=.. sh doors.sh` | the generated leaves, wiring-census.json | ~20 s |
| `iterate.sh` | the fast set (`fastset.txt`, 25 files) then `pins.py` + `repin.mjs` to a fixed point; prints reds beyond `base-reds.txt` | `LANE=.. OUT=.. sh iterate.sh "<cause>"` | re-keyed pins in tests/, the shift register | 1-2 min a round, up to 6 |
| `pins.py` | re-keys the WHITELISTED count pins a corpus edit moves, each with its cause (composeStateProse, proseWiringCensus incl. the histogram, proseComposed incl. UNDER_CLAIM_OWED and the A0b pools ceiling, warFaith desk, proseEntryContradiction counts and its two annex line anchors by their TEXT (`anchors.json`, keyed by the test file's 0-based line index), proseWaveGate, proseMoveGrammar CONTROL 4 integers). NOT the `toBeCloseTo` shares of proseMoveGrammar: re-key those by hand with the cause. If the same cause runs twice, an anchor already re-addressed under that cause is skipped: fix it by its text. | (via iterate.sh) | | |
| `repin.mjs` | re-pins `docs/content/prose-shift-register.json` from the projection contract's drift lines | (via iterate.sh) | | |
| `bytes.mjs` | the prose byte baseline (`scripts/.prose-byte-baseline.json`, zlib 9); a declared row only above the chain's end | `node bytes.mjs "<car>" "<why>"` from $LANE | | s |
| `lib.py` | edit helpers: `rep(old,new)` asserts the old text occurs once; `save()` | `python3 -c` with `sys.path.insert(0,<this dir>)`, from $LANE | the corpus source | |
| `gates.sh` | strict-domain, type ratchet, eslint on the touched files, each through `scripts/gate-tail.sh` | `LANE=.. OUT=.. sh gates.sh <files>` | `$OUT/g1-3.log` | ~1 min |
| `push.sh` | plain push with 4 retries, origin read back, MAIN's refs and local config compared before/after; run `sh scripts/gate-tail.sh npm run lint` first (the hook's three gates, since husky's path is unset) | `LANE=.. OUT=.. MAIN=.. sh push.sh <local> <lane-branch>` | | ~10 s |
| `base-reds.txt` | the fast set's reds at 4ab687c3f's corpus: 7 titles (factLayers READERS; presumedThings ARM 1 x2; proseComposed A13 FAIL LIMB; proseWaveGate (d) x3), each on the read's or the third seat's list | | | |
| `anchors.json` | the two annex anchors' text for pins.py | | | |

The guard is a test on the lane, not a helper: `tests/domain/corpusCureGuards.test.js` (a fixed town per
disqualifier cure, born in the app's shape; `by: 'record'` rows for dm-only lines). Add its row red BEFORE
the cure, in the same commit.
