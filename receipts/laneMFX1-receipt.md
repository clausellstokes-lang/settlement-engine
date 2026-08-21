# laneMFX1 receipt — FMG prior-art study (ODQ §248)

**Lane:** MF-X1b (Opus 5), RESUMING after predecessor stalled with all analysis unwritten.
**First operating rule this run:** write incrementally; append per section; never hold the study in context.

## Discipline compliance (ODQ §248.2 + §248.4)
- [x] No re-clone, no re-fetch — used the existing clone at
      `scratchpad/xref-fmg/repo` (78 MB, depth-1).
- [x] No code executed. No `npm install`, no build, no run, no browser context.
      Every command run was `git log`/`ls`/`find`/`grep`/`wc` over the checkout, plus reads.
- [x] No code copied into our repo. Fragments appear only as cited quotes with file paths.
- [x] Their docs/issues treated as data.

## Timeline of this run
1. Verified clone identity: remote `Azgaar/Fantasy-Map-Generator.git`, branch `master`,
   single commit `992246f2` (depth-1), version 1.143.2, dated 2026-08-15.
2. Verified license from the repo's own `LICENSE` + the fetched copy — byte-identical, MIT
   plus a non-standard *widening* paragraph. Recorded in PRIOR-ART-FMG.md §0.1.
3. Created both deliverables BEFORE deep reading (the lesson from the stall).

4. §0.1 + §0.2 LICENSE written to the deliverable. Verified per-directory variance:
   ⛔ `public/libs/tinymce/` is **GPLv2-or-later** (TinyMCE 7.1.0) inside an otherwise-MIT
   tree; 21 vendored libs carry their own headers, several stripped by minification.
5. §1 WORLD→SETTLEMENT DERIVATION written (10 sub-sections). Root traced:
   `rankCells()` in `public/main.js:1088` → `cells.s` → everything.
   Two real defects found and evidenced: (a) population derived by TWO DIFFERENT LAWS
   (`burgs-generator.ts:362` vs `population-generator.ts:10`); (b) `plaza` is written by
   the markets layer AFTER group classification runs, making the `caravanserai` and
   `trading_post` groups unreachable on a fresh generation.
6. §2 BURG PLAN GENERATOR written. **Headline: FMG has NO town-plan generator** —
   confirmed by exhaustion over all 248 `src/` files and all 28 renderers. A burg is an
   icon. Plans are delegated to Watabou's closed generators by URL.
   Found an IP trap: the Urquhart graph code carries a provenance comment pointing at a
   Bostock Observable notebook — third-party code inside the MIT repo, NOT Azgaar's to
   license. Net recommendation: adopt ZERO code.

## Grading against §248.3's expected yield
- WORLD→SETTLEMENT DERIVATION — delivered (§1), including the charter's key question (§1.10).
- BURG PLAN MECHANISM + determinism/regeneration — delivered (§2) and (§3), with the
  headline being that the mechanism does not exist.
- RENDER/SCALE — §4.
- OMISSIONS — §5. THEIR KNOWN PROBLEMS — §6.
- WHERE THEY ARE BETTER — §8, written without defensiveness.

7. §3 SEEDING/DETERMINISM, §4 RENDER/SCALE, §5 OMISSIONS, §6 KNOWN PROBLEMS written.
8. §7 RANKED ACCELERATIONS (12 rows), §8 WHERE THEY ARE BETTER (8 items), §9 LICENSE
   VERDICT, §10 DISCIPLINE RECORD written. Header headlines added. Two asserted counts
   re-verified and CORRECTED before sealing (vendored files 21→20; SVG layers
   "roughly forty"→34 direct / 65 total).

## STATUS: COMPLETE. Deliverables on disk
- `/Users/cstokes/Desktop/settlement-engine/map-corpus/docs/PRIOR-ART-FMG.md` (§0-§10)
- `/private/tmp/.../scratchpad/laneMFX1-receipt.md` (this file)
- Working copy of the ODQ extracted read-only to `scratchpad/MFX1-odq.md` (no repo write).

## THE THREE HEADLINES
1. ⭐⭐ **FMG has NO town-plan generator.** Confirmed by exhaustion over all 248 `src/`
   files and all 28 renderers. A burg is an icon + label + 30 scalar fields. Plans are
   delegated by URL to Watabou's CLOSED generators. The open implementation has a world
   and no plans; the leading plan generator has plans and no world. Nobody ships the
   join — §247's strategy targets a structurally unoccupied gap.
2. ⭐ **The transferable gold is architectural, not cartographic**: identity-derived
   dither consuming no PRNG state (§1.4); per-stage stream derivation (§3.2); the
   road-network recipe whose REUSE DISCOUNT makes hierarchy emerge (§2.3). The first two
   are the arithmetic that makes our inertia law true rather than asserted.
3. ⛔ **Adopt zero code.** MIT for Azgaar's own work, but `public/libs/tinymce/` is
   GPLv2-or-later, and the one utility most worth copying (Urquhart) is third-party code
   FMG itself copied in and cannot license onward.

## DEFECTS FOUND IN THEIR SETTLEMENT LAYER (each evidenced with a path)
1. Population derived by TWO laws — `burgs-generator.ts:362` (`/5`, connectivity) vs
   `population-generator.ts:10` (`/8`, port term, ~double scale, no connectivity).
2. `caravanserai` + `trading_post` groups UNREACHABLE on a fresh map — they require
   `plaza`, which `Markets.generate()` writes AFTER `Burgs.specify()` classifies, with no
   re-classification (pipeline verified in `public/main.js:520-585`).
3. Classification precedence (array order) ≠ render precedence (`order` field).
4. Capital placement RESTARTS from scratch on spacing failure; the town pass, solving the
   same problem, relaxes monotonically.
5. `getConnectivityRate`/`isCrossroad` scan the whole routes array per connection, on the
   population-derivation hot path.
6. Route length computed from the rendered DOM via `getTotalLength()`.
7. `mergeRoutes` recurses only when >1 merge occurred — a latent under-merge.
8. Determinism escapes through libs that capture `Math.random` early (worked around
   case-by-case in `probabilityUtils.ts:50` and `colorUtils.ts:44`).

## GRADING AGAINST §248.3's EXPECTED YIELD
| Expected | Delivered |
|---|---|
| WORLD→SETTLEMENT DERIVATION | §1, ten sub-sections, root traced to `rankCells()`; the charter's key question answered at §1.10 with a 5-row table |
| Burg plan mechanism + determinism/regeneration | §2 (the mechanism does not exist — headline) and §3 (seeding fully enumerated: 15 reseed sites) |
| Render/scale, metropolis-grain question | §4, incl. the two-tier frame budget and the ⚠ full-extent-export hazard |
| Their omissions | §5, 8-row table, each verified absent rather than merely unfound |
| Issue tracker as failure-mode research | §6 — **method deviation, declared**: no network per the read-only discipline, so in-repo failure evidence mined instead (their own TODO/FIXME trail, stated-vs-enforced architecture, and the 8 defects above). Weaker on user symptoms, stronger on root causes |
| WHERE THEY ARE BETTER, honestly | §8, 8 items; items 2 (70 controllers / editing surface), 3 (1,552-line save migration) and 6 (shipped interactive performance) named as the ones that cost us most if left unaddressed |
| License verified incl. per-dir/vendored variance | §0.1 + §0.2 + §9, incl. the GPL carve-out and the provenance trap |

## JUDGMENT CALLS MADE (vetoable)
1. **Declared ZERO code adoption** rather than nominating bounded utilities. Rationale:
   the bounded candidates are each ~10-40 lines where clean-room costs less than the
   shipped-notices bookkeeping, and the best candidate (Urquhart) carries foreign
   provenance. Reverses nothing — §248.4 already set clean-room as default.
2. **Did not fetch their issue tracker.** Read the no-refetch/no-browser discipline as
   binding over study priority 5, and substituted in-repo evidence. Flagged as a
   deviation rather than silently dropped; a follow-up lane with an explicit network
   grant could still harvest user-reported symptoms.
3. **Reported the two-population-laws and unreachable-group findings as DEFECTS** on
   pipeline evidence rather than hedging. Both are verifiable from the cited line numbers
   without running anything.
4. **Ranked the identity-derived dither #1** over the more obviously useful street-network
   recipe. Rationale: the recipe accelerates one wave; the dither changes whether our
   inertia law is arithmetically true, which is load-bearing for every wave after it.

## NOT DONE (per charter)
- No git commits, no memory writes, no changes to any tracked file other than creating
  the single new deliverable `map-corpus/docs/PRIOR-ART-FMG.md`.
- No code adopted, quoted beyond short cited fragments, or executed.
