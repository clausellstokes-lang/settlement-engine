# LANE TE-STRIP-4 DISPATCH BRIEF — the presentation-stack deletion (legacy settlement map)

Drafted by the chair (Fable 5) 2026-08-29; **AMENDED same night per ODQ §751** (car-5 escalation + the recon
quartet). **STRIP-4 is now DOUBLE-GATED: it dispatches only after (a) the owner rules Q-STYLE (§751.3) and
(b) TE-STRIP-5 lands.** Reasons, with receipts:
- After STRIP-2 lands, `StyleOverhaulPanel.jsx` is the ONLY remaining runtime door into the 28 presentation
  files (R-STRIP4-CENSUS §B — doors 2–5 close with STRIP-2's cars). While the panel stands (Q-STYLE unruled),
  the barrel, `bespokeStyles.js`, and the whole draw stack it reaches CANNOT delete — the zero-importer
  precondition fails by construction.
- `changeView.js` + `fogGeometry.js`/`fogSessions.js` deletions are blocked on STRIP-5 (R-STRIP5-CENSUS:
  ladder import :50, illustratedLensFree :20, fogTierGate/changeViewDepthGate readFileSync targets).
- The design registries are OUT of this wave entirely (§751.2): `design/townGlyphs/**`, `design/townMapStyles.js`,
  `design/townMapStyleWall*`, `design/townMapExportPalette*` have RETAINED consumers (`surveyorWrite.js:165`
  dynamic import, `InteriorView.jsx:33`, `generate-compendium-data.mjs:56-59`, `styleOverhaulCore.ts`) and
  `aiCharter.js:42` (`buildStyleVocabulary`) rides BOTH edge bundles — deleting them breaks `build:edge-shared`
  + 5 freshness suites + the reproducibility pin. They belong to the Q-STYLE wave, ruled by the owner.

- **Seat:** Opus 5 (implementer/verifier). Charter: DESIGN_MAP_MODULE_SPLIT.md §11.2 wave 4, as corrected by
  ODQ §748.3 (ARM B) and §751.2/§751.3.
- **Base:** the post-STRIP-5 `claude/composite-r4` tip — `<CHAIR FILLS SHA AT DISPATCH>`. Own worktree, own
  `npm ci` node_modules (never symlink). `.husky/_` present ⇒ re-prove every green AT the committed tip.
- **Authoritative census:** `docs/recon/R-STRIP4-CENSUS.md` (taken at 1a2471990) + the §751 corrections above.
  Re-verify the five-doors claim at YOUR base: with Q-STYLE executed, the barrel's live src importer count must
  be ZERO (`git grep` static + dynamic-specifier sweep). If any importer remains, STOP and report.

## THE RULING THAT SCOPES YOU (ODQ §748.3 ARM B + §751.2, vetoable)
The 11 runtime-load-bearing townCartography files STAY as scene substrate (census §A's 25-file retained roster
is untouchable). The 36-file `arch/**` K-1 kernel is NOT in scope. The design registries are NOT in scope
(§751.2 — Q-STYLE wave). Only the orphaned paint trio (inside the §C orphan 16) deletes from townCartography.

## THE DELETE SET (census §B + §C, dependency-safe order §E, minus the §751 carve-outs)
1. **The 28 presentation files** (8 townMap top-level incl. the barrel + 20 fabric/) — legal only once the
   Q-STYLE act has removed/re-pointed the panel's barrel + `bespokeStyles` imports.
2. **The 16 orphans of §C** (paint trio · ageOverlay · sceneOverrideOrphans · 10 fabric orphans ·
   arch/shapeRegistry) **+ `src/lib/townScene/townCartographyBlock.js`** — severable EARLY (zero importers);
   may land as this lane's first car even before the Q-STYLE-dependent cars, or ride an earlier lane if the
   chair re-assigns.
3. **`massing.js:44` JSDoc typedef re-point** — STRIP-2's car 3 aliased the six `DrawOp` typedefs in place
   (townMapDraw re-exports); verify at your base whether the alias landed in `src/domain/drawOpsSvg.js` and
   re-point massing's typedef to the retained home before deleting `townMapDraw.js`.
4. Vetoable rider: `src/components/townMap/edgeAnnotations.js` — ⚠ R-STRIP6 found its observed-shape baseline
   write path is DEAD pre-existing (both provenance digests stale; `--write` refuses; hand-edits throw). The
   instrument migration is chair/owner work — do NOT delete this file until that lands; deliberately deferred.

## THE TEST/CENSUS BILL (census §F — read whole)
68 direct test files move on the presentation delete; **10 TRIMMED, never deleted** (census names all ten).
Orphan sweep moves 19 more. The retained set's 36 test files stay green through EVERY car. Same-act re-freezes
(removal-mirror law): lighting census re-derived WHOLE (expect.soft idiom, restore from a SAVED COPY, never
`git checkout --`) · `test:ratchet` remove-only · size-baseline deletions · typecheck floors · dist chunk
census (F9's `::town-map:v1` anti-vacuity arm should survive via retained townMapModel consumers — PLAUSIBLE
until `verify:dist`) · `surveyorPanelsLazy` posture per the Q-STYLE act · `retiredBy: "§725/§748"` packet rows
(the DEAD list never grows) · observed-shape baseline: leave deleted paths in place (landed posture, F11).

## LAWS (each has bitten)
One commit per car, explicit pathspec staging; `git rm` stages immediately — read `git diff --cached
--name-only` before EVERY commit. No seat trailers on build-branch commits; NEVER amend (§750.2). Never touch
`claude/composite-r4` (the chair CASes). Never `git stash`; a foreign stash exists — leave it. Export
`GATE_MUTEX_LOCK_DIR=/tmp/settlementforge-vitest-gate.lock` on every run. ONE landing gate: bare
`npm run check:tail`, fresh shell, log-file + `echo "TRUE_EXIT=$?"` (zsh), read both exits, POST-GATE
`git status --porcelain` block (§747.4(2)). Outlast the gate; background anything near the 10-min tool cap.
Refresh `laneSTRIP4-receipt.md` (+ `receipts/` copy) after every car (§448 mid-lane resume).

## STOP CONDITIONS
A remaining barrel importer at your base · a retained-set red you cannot attribute · any need to edit
`townScene/**`, `spatialSubstrateDerive`, the design registries, or the retained 25 beyond the typedef
re-point · any package.json change (mint trigger). STOP at a clean committed point, refresh the receipt, report.
