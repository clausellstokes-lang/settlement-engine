# LANE: CLAMP-W2 — migrate the six remaining movable hand-rolled clamps onto the kernel primitive, one car each
⟦Chair: Fable 5.1 · Lane: Opus 5 (`model: "opus"`) · chair-class · ⛔ the CEILING is NOT yours — it is ruled ONCE at the final wave⟧

## READ FIRST, IN THIS ORDER
1. `$SC/briefs/_PREAMBLE.md`.
2. The wave-0 ruling — `git show refs/preserve/clamp-wave0-ruling-2026-09-04:RULING-WAVE0-CALL-SITE-NEUTRALITY.md` (2.9 KB): the
   migration bar is **CALL-SITE-LEVEL byte-neutrality**, with three fences — the `num()`-style wrappers that screen the
   divergent classes MUST BE KEPT; two sites are excluded by name (`warAllianceRisk`, `conquestFeasibility`); and what is
   NOT ruled. Read the whole thing; quote the fences back in your receipt.
3. Wave 1's record — `git show refs/preserve/clamp-w1-rulings-2026-09-05:receipt-clamp-w1.md` and
   `…:RULING-W1-REFUTATIONS.md`: six migrated, two REFUSED on doctrine (`conquestIntent` — an import pin at
   `envoyK3BeliefSeam.test.js:356`; `conquestExecution` — a "NO IMPORTS AT ALL" header that an older pin rules WINS) and
   the chair ACCEPTED both refusals. ⭐ "A file can be provably safe and still not free to move." The proof method the
   chair accepted: function-level divergence CONFIRMED for every local expression (NaN, −0, ±Infinity), then call-site
   neutrality proven EXHAUSTIVELY where the argument domain is a closed vocabulary, or by ≥1001 samples plus the
   producer's finiteness guarantees where it is not; the import-pin widening documented in the test with a named revert.
4. `src/kernel/math.js` `clamp` / `clamp01` (lines ~51–65) — the sanctioned primitive and its NaN policy.
5. `tests/lint/clampPrimitiveBaseline.test.js` — the detector (`DEF_RE`), the 62-file baseline
   (`scripts/.clamp-primitive-baseline.json`), `BASELINE_CEILING = 62`. ⚠ Its equality arm is a BANKED known failure
   (6 of ceiling 17) and STAYS RED through this wave; you do not touch the baseline, the ceiling, or the census.

## YOUR DOCK
`$SC/laneCLAMPW2`, detached at the landed product tip **`df7cdd37e`** (the clamp consist, incl. the two repairs that
make two of your files eligible). Porcelain 0 at start. The chair replays your cars onto the next tip; do not rebase.

## THE SIX, MEASURED BY THE CHAIR AT 272dbd2da (re-derive every one)
73 files define a clamp (`DEF_RE`); 62 are the baseline; `src/kernel/math.js` is the primitive; the remaining 10 are
outside the baseline, and **four are spoken for** (two excluded at wave 0, two refused at wave 1). The six:
| file | definition | note |
|---|---|---|
| `src/domain/worldPulse/razing.js` | `function clamp01` :291 | the razing trio share NO NaN policy — [[a-banked-census-row]] measured THREE divergent policies, two of which ride NaN straight through |
| `src/domain/worldPulse/razingExecution.js` | `function clamp01` :234 | same trio |
| `src/domain/worldPulse/razingWitness.js` | `function clamp01` :114 | same trio |
| `src/domain/worldPulse/dispositionLedger.js` | `const clamp = (v,lo,hi)=>…` :163 | raw ternary, NaN rides through; the clamp-repair car 2 (`|| 0` falsy screen) landed in your base — read that car's diff first |
| `src/domain/townCartography/cartographyBuildings.js` | `function clamp` :134 | qualified on wave-0 fence 2 only since the `|| 1` → `Math.max(1, …)` repair landed (car 3, in your base) — verify the repair is present |
| `src/domain/townCartography/cartographyMultiplicity.js` | `function clamp01` :62 | unexamined; measure |

## THE ACT — per file, one car, in the order above (razing trio first: they must agree with each other)
1. Function-level divergence table for the local expression vs the kernel (NaN, −0, ±Infinity, out-of-range, the boundary).
2. Every call site enumerated (a denominator: grep the file AND its importers for the local name), and for each: the
   argument's producer, its domain, and the neutrality proof — exhaustive where closed, sampled+guaranteed where not.
   ⛔ If the kernel would change the OUTPUT at any reachable call site, that is a BEHAVIOUR SHIFT: do not absorb it. Either
   keep a `num()`-style screen so the call site stays byte-neutral (fence 1), or STOP on that file and report the shift
   with the inputs that produce it — the chair declares shifts, lanes do not.
3. Migrate: import the primitive, delete the local definition, keep the screens. Check every pin the file sits under:
   import pins (`git grep -n "'src/domain/worldPulse/<file>.js'" tests/`), header declarations ("NO IMPORTS"), reach
   assertions. A pin that forbids the import is a REFUSAL, exactly as wave 1's two — record it, do not overrule it.
4. Prove: the file's own tests · the importers' tests · `npx vitest run tests/lint/` WHOLE (exit + failing-arm list —
   only `clampPrimitiveBaseline` may be red, and its red must be the SAME shape before and after) · `npm run
   typecheck:domain:strict` exit 0 at its current ceiling · eslint on the file. Plant the local clamp back in and prove
   your neutrality pin catches nothing (it is neutral by construction) but your divergence table's falsifier does.
   Same-seed output: NONE, proven by construction and confirmed by one fixed-seed run of a consumer that reaches the file.
5. Receipt `$SC/receipt-clamp-w2.md`: the six rows (MIGRATED / REFUSED-with-pin / STOPPED-on-shift), the NaN-policy map of the
   razing trio before and after, the traps you surfaced (wave 1 recorded two — a `storageCapacityMonths` floor of 1.5
   undocumented; `warCoalitionDecision`'s implicit dependence on `relationshipState` COERCE semantics), the arithmetic
   (copies before/after against the 62 ceiling, and how many of the ten remain), and a RETROVALIDATION ROW.

## ⛔ FENCES
No baseline/ceiling/census edit. No new test file. No edit to the four spoken-for files. No `--amend`. Quiet-window law +
mutex before any vitest (a chair gate may be running). No `npm run build`. Trailers `Seat: Opus 5 — Fable-unvalidated`
and `Lane: CLAMP-W2`; commit per file. The shell is zsh — `${sha}:path` with braces.
