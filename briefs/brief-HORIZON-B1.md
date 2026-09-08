# LANE: HORIZON-B1 — CHARSET Car 2: the wiring, the typed rejection surface, the reachability proof, the restore split — landing DARK at `report`
⟦Chair: Fable 5.1 · Lane: Opus 5 (`model: "opus"`) · chair-class since the CS-9 ruling (§897) · the `refuse` flip is NOT this car (the lighting wave's) · migration 201 is NOT this car (owner-gated)⟧

## READ FIRST
1. `$SC/briefs/_PREAMBLE.md`.
2. The design, on the LEDGER branch (the worktree is dirty with mass docs deletions — always `git show`):
   `git show review-fixes-2026-07-08:docs/DESIGN_HORIZON.md | sed -n '748,830p'` — **§8 CHARSET whole**: §8.1 the mechanism
   and the authoring-chokepoint protocol; §8.2 the file table (every row's Car-2 half is yours); §8.3 laws (THE PROMISE →
   the wall runs at AUTHORING chokepoints only; hydration / binding / restore charset-blind by law AND by build pin);
   §8.5 Car 2's definition; §8.6 the slot; §8.7 the priced risks R2–R12. Also §1.11 (the allowed-set function, ~line 122).
3. The CS-9 ruling (§897 on the ledger, `git show review-fixes-2026-07-08:docs/OWNER_DECISION_QUEUE.md | grep -n '^§897 '`):
   an import of a user's OWN export is a RESTORE path, never an authoring act; the wall refuses at AUTHORING only.
4. What Car 1 landed (measure it at your tip): `src/domain/content/customContentCharset.js` (17.7 KB) + `.generated.js` +
   the TS twin + `src/utils/jsPdfText.js` (the hoist; private `s()` copies gone) + `deriveCharsetTable` in the compiler +
   the manifest's `surfaceClasses` / `charsetPolicy` (`enforcement: "report"`) / 41 per-field `surfaces` + the
   `custom-charset` manualChunk + `tests/domain/customContentCharset.test.js` (19 KB). **NOT landed (yours):**
   `customContentCharsetRejections` (0 hits), `errors.customContentCharset.*` in `src/copy/en.js` (0), the
   `normalizeEntry` / `admissionFor` / `customContentCore.ts` wiring, the editor hint slot, the reason vocabularies in
   `aiOutputSchema.js` / `aiCharter.js`, the promotion-contract row.

## YOUR DOCK
`$SC/laneCHARSET2` at **`df7cdd37e`**. Porcelain 0. The chair replays onto the current tip.

## THE ACT (each proved before the next)
0. **Re-run Car 0's probes** (their logs died with an old scratch dir): the jsPDF runtime table reachability (R1 retired —
   confirm on the installed jspdf), the fontkit intersection the compiler derives, and the OSR probe (two content files in
   scan, 0 findings — R8). Quote the outputs.
1. **The wiring at the AUTHORING chokepoints only** (§8.2 rows): `admitCustomContentDefinition` calls the leaf after shape
   admission (`report` → a `charset` list on the result; `refuse` → also `ok:false` + errors, DORMANT at `report`);
   `normalizeEntry` calls the leaf and under `refuse` throws the TYPED error `{ code, field, char, surface }` (dormant);
   `admissionFor` adds the leaf's dynamic import to its `Promise.all` and sets transient
   `state.customContentCharsetRejections`, CLEARED wherever `customContentError` is set to `null` (R11); the TS core's
   `validValue` charset branch over the twin with the six codes; `CONTENT_UNSUPPORTED_REASONS` + the charter line gain
   the six codes; the editor's hint slot + `CUSTOM_CONTENT_CHARSET_HINTS` keyed by code; `en.js` keys per §8.2 (the copy
   scanner family will bill them — run `tests/copy/` and `tests/lint/` whole).
2. **The restore split (CS-9's plant, `LGT-P9-CS9`):** prove a legacy library with non-ASCII names still HYDRATES, BINDS,
   EXPORTS and RESTORES through the rich adapter (`parseContentPack`) with the wall never consulted — a build pin that the
   restore path does not import the leaf (a static import-graph assertion), plus the end-to-end test. This is THE PROMISE's
   arm; it is the reason the car exists.
3. **The reachability proof:** render two city dossiers (GLYPH's 120 s budget idiom; STOP if the budget is exceeded) and
   assert every free-text field's declared `surfaces` reaches what it claims — R7: a disagreement between the hand-declared
   `surfaces` and WRWALKER's `surfaceClassesOf` is a manifest edit you report, not a test you soften.
4. **R4, named and pinned:** the rich adapter may disagree with the compact wall under `refuse` by design — one plain `it`.
5. **The lighting:** stays at `report`. Prove the dormancy: under `report` no authoring path's outcome changes for any
   entry (same-seed neutral; the 525 golden + dormancy fences unchanged as a BIT claim), and the rejection list is the
   only new output. Do NOT flip `refuse`.

## PROOF
The charset test file (extend; new test files are allowed — plain `it` only, R12: the each-family park ceiling is 111 with
zero headroom — name every new file); `tests/domain/customContentAdmission.test.js`; the customContent slice tests; the
render test; `npx vitest run tests/lint/` and `tests/copy/` WHOLE with exit + failing-arm lists; `npm run typecheck:domain:strict`;
`npm run validate:edge` if present (the TS twin path); eslint. Quiet-window law + mutex before any vitest. No build (the
chair builds and proves the eight closure chunks hash-identical — R2's `__vite__mapDeps` row is the one expected delta).
Plant the wiring back out and prove the plant and the reachability arm RED.

## ⛔ FENCES
No `refuse`. No migration 201. No Car 3 (CANCELLED at §893). No edit to the generated files by hand (regenerate through
the compiler). No `--amend`; commit per step; trailers `Seat: Opus 5 — Fable-unvalidated` and `Lane: HORIZON-B1`. No
`npm run build` / `npm install` / node_modules / `git stash` / `git add -A`. zsh: `${sha}:path`. Receipt
`$SC/receipt-horizon-b1.md` (PARTIAL header first; register deltas; a RETROVALIDATION ROW).
