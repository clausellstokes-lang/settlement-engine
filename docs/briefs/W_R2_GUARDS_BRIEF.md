# W-R2-GUARDS — the guard-lag wave (the fences move to where the doors went)
## Read docs/briefs/W_R2_COMMON_PROTOCOL.md FIRST. Branch: `claude/w-r2-guards`.
## Base symbols to verify: eslint.config.js has the no-restricted-imports data-purity block; tests/architecture/layerBoundaries.test.js exists.

**CHARGE:** every guard that lagged its moving target gets re-aimed, and the classes that
regressed for lack of a walker get their walkers. Tests/lint/scripts/CI only — plus the two
display-vocabulary files the walkers must bind (WHAT_PHRASES, newsVoice categories).

**FENCE:** tests/**, eslint.config.js, scripts/**, .github/**, package.json (script order
only), src/lib/spatialUsage.js (whitelist extension), src/domain/display/settlementRumors.js +
newsVoice.js (vocabulary additions the walkers force — display-only, byte-inert authored
strings; prove no golden shift), src/domain/worldPulse (significance-literal fixes only).

**THE FIXES:**
1. `scripts-build-ci-1` verdict REFUTED — read the verdict FIRST; whatever half survives
   (mutation-sweep plant path at minimum), apply only that; record the rest as
   verdict-refuted.
2. `scripts-build-ci-2` / `test-gate-honesty-1` — the stale-dist idiom propagated: every
   dist-READING assertion in tests/build/ gated on VERIFY_DIST (absence halves stay ungated);
   policy recorded in the vendorPdfLazy header. Do NOT reorder check (parity gates pin it) —
   unless you verify ciCheckParity is set-based and the reorder is free; if so, build-before-
   test is the bolder fix; record the JUDGMENT either way.
3. `scripts-build-ci-3` — whole-world-soak joins the weekly CI lane as a pass/fail step
   (default 30y×4); the other wave soaks as log-artifact steps; fix the stale diagnostic-only
   framing comment.
4. `tests-estate-1` — SCC-based cycle check (Tarjan) replaces back-edge enumeration; assert
   every SCC is a singleton or exactly an allowed cycle's member set; delete the dead
   existsSync line.
5. `tests-estate-2` — extract normalizeForDormancy to tests/helpers/dormancyOracle.js;
   mechanical 21-file import rewrite; the two proofs stay in the original file. Zero golden
   hash changes (assert by running the dormancy battery before/after).
6. `test-gate-honesty-2` — one committed fc seed per property suite (or one configureGlobal in
   shared setup), seed logged in failure messages; rotation policy comment (per wave,
   deliberately).
7. `code-quality-architecture-1` — per-file frozen ceilings replace 'max-lines: off'
   (JSON baseline + the house exact-set test: above fails, below demands ratchet-down,
   entries under the tree ceiling must be deleted); stressors.js's stale override dies.
8. `code-quality-architecture-3` — max-lines coverage extends to src/store, src/pdf, src/lib,
   src/hooks, src/utils, src root files with empirical grandfathers under the same baseline.
9. `code-quality-architecture-4` — the headless-spine walker goes transitive (reuse its
   resolver) OR the three lib leaves relocate to kernel (your call — record the JUDGMENT;
   relocation is cleaner if import churn is bounded).
10. `code-quality-architecture-5` verdict PARTIAL→low — read the correction; if unification
    stands, unify stableStringify with the per-site parity proof; else record.
11. `lib-infra-copy-1` — spatialUsage TRACKED_FLAGS + MOVER_PRESENCE extended for all merged
    waves; regenerate the analytics taxonomy dictionary; the walker test that diffs
    spatialLedgers keys written by domain code against MOVER_PRESENCE (exempt list explicit).
12. `content-immersion-r2-2` (PARTIAL — scope corrected to ~8 seeding kinds) + `-r2-1` —
    THE IMPACTKIND WALKERS: (a) WHAT_PHRASES phrased for every MINTED impactKind (walker
    source-scans mints; reds until phrased); (b) newsVoice: the set-but-unclassified guard
    (non-empty unmatched impactKind → null, never the channel fallback) + author the boom-bust
    VoiceCategory (the registered drama class deserves an abundance voice, not silence);
    walker over minted kinds → expected categories.
13. `content-immersion-r2-6` — the CI-6 fix (plague ≥0.55 or multi-settlement ⇒ 'major') +
    sweep the three dead-tier mints ('minor'/'moderate') to the real vocabulary + the
    significance-literal lint (only 'major'/'notable' mintable).
14. `security-privacy-r2-1` — the hard-deny census: derive WORLD_SNAPSHOT_HARD_DENY from
    CONDITIONAL_LEDGER_KEYS minus an explicit public allowlist (registration-manifest idiom);
    extend the absence-pin; write the SQL twin's regenerated migration content as migration
    136 (WRITTEN, never applied — owner deploys) keeping the client/SQL lockstep test green.
15. `domain-region-dossier-guidance-2` — the guidance walker's mounted check: source-scan each
    whisper's host for the whisper id or body copy key; widen the census from filename regex
    to content scan. (The WIRING of dead whispers is W-R2-SURFACE's; your walker will be red
    on them until that wave lands — coordinate: land the walker with `.failing` markers or a
    documented allowlist that SURFACE empties, and record it.)
16. `domain-region-dossier-guidance-5` — COMPENDIUM_TABS parity pin (import the panel's TABS
    ids); add the 'living' tab + entries (or derive from glossary entries — they carry
    tab/anchor).

**GOLDEN DISCIPLINE NOTE:** items 12-13 add authored display strings on byte-inert lazy
sidecars — run the relevant goldens and the news-voice register guards; if ANY golden shifts,
STOP that item → Track-G2 (expected: none; the sidecars are lazy and the strings are new
branches, but PROVE it).
