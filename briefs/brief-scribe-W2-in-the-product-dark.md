# LANE: THE SCRIBE — W2, IN THE PRODUCT, DARK (behind a flag, default OFF) — filled 2026-09-14 09:5x from W0's and W1's reports; ready

DOCK: `$SC/kit/lane-scribe` at W1's tip `b63ef5ee4` (W0: 1bd614ec9 · 3acf8cab8 · fa71589a3 · f4827c247; W1: e43d28b32 refuteUnit · f522485bc epochRecord · b63ef5ee4 the bundle; the harness is sealed at `refs/preserve/scribe-w1-harness-2026-09-14` and lives in `$SC/kit/scribe-harness/`). The same laws as W0/W1 (read both briefs). THIS WAVE TOUCHES PRODUCT BYTES and grazes two
owner-gated classes the owner has opened ("build it in"; "let's just get it all out there"): the paid surface and the persistence shape. The
migration FILE is written; `db push` is the OWNER'S act — never run it. Never push. Everything lands behind `FLAGS.scribe` (default false) except
the retirements, which the owner ordered outright (rules 17, 19) and which land as their own commit with the pricing contract test moved.
READ FIRST: the design at the ledger `78941b538` (`git -C /Users/cstokes/Desktop/settlement-engine show 78941b538:docs/DESIGN_SCRIBE_GENERATION_TIME_PROSE.md`) (§3, §5, §5b, §5c, §6, §7, §8, §12) · SCRIBE-RULINGS 1–19 · W0's and W1's reports (restated below) · `src/lib/ai.js` (generateNarrative) · `supabase/functions/generate-narrative/index.ts` (the credit sequence :1160-1380; `fetchAiWithRetry`
:579; the caching :655; the refund policy `refundPolicy.ts`) · `supabase/functions/ai-analyst/creditFlow.ts:64` (runCreditedCall, the seven
invariants) · migration 118 (claim_free_narrative) · `src/store/aiSlice.js` (requestNarrative :276 · requestDailyLife :556 · requestProgression :764 ·
hydrateAiFromSave :1020 · the F19 gate :401 · dispositions :433) · `src/store/aiPersistenceEnvelope.js` · `src/store/settlementSliceHelpers.js:108`
(snapshotSettlement) · `src/lib/pendingDossier.js` · `src/lib/accountImport.js:54` · `src/domain/display/publicSafe.js:52,101` ·
`src/store/campaignWorldPulseDeferred.js:448-470` (the counter, the shared restore chokepoint) · `src/components/dossier/DossierActionBand.jsx` ·
`src/components/OutputContainer.jsx:355,740` (aiGuidance) · `src/config/pricing.js` · `src/domain/modelRegistry.js`.

## COMMITS, IN ORDER (each gated; each declared)
1. THE ARTEFACT + THE FIVE LIFECYCLE CURES (design §5): `settlement.prose` (`{version, seed, current:{advanceSeq,…}, epochs:[]}`) written ONLY by the
   Scribe module; `delete clone.prose` in `snapshotSettlement`; the pending-dossier stash strips it; `MAX_IMPORT_BYTES` → 64 MB under the version
   guard with a 1,000-town round-trip test; locked sections carry their units through `carryLockedSections`; `PUBLIC_TOPLEVEL_KEYS` UNCHANGED
   (ruling 3: hidden from the gallery) with a test asserting prose never reaches a public projection; THE FINITE-SEMANTICS PIN: a source scan that
   nothing under `src/domain/` (except `display/`) or `src/generators/` reads `prose`; the golden master byte-identical both ways (no Scribe = no key).
2. THE UNDO / REDO / PAST LANE (§5b, §5c rule 1, rulings 15–16): the shared restore chokepoint MOVES epochs above the restored depth to the past lane
   marked undone (seq+nonce); REDO moves the current render to the past lane marked redone; the past lane rotates into `ai_data.chronicle` by tier
   (owner-gated item 13 — implement the compact move, leave the rotation cap at the chronicle's existing CHRONICLE_LIMITS).
3. THE TRIGGER (§5, rule 14): a lazy-loaded helper module (never a static import from the store; `settlementSlice.js` is size-baselined at 0) that,
   when a dossier is on screen with a saveId and `prose.current.advanceSeq !== advanceSeq` (or no artefact), enqueues one render; the tabs draw
   corpus → swap per block as the outbox lands `data`; a stale artefact shows as "the prior survey" until then; never per tick; never on save alone.
4. THE COMPOSER SWITCH (§5 READ): `eligibleVariants`/`drawVariant` over `prose.current.blocks[block][pool]` when present and version-matched, else the
   corpus; the `read` literal's BOTH copies; the vid identity pin (the artefact's vid == the corpus draw's vid for the seed); a seven-tab render
   includes DAILY-LIFE (rule 19) with its own mount.
5. THE EDGE: `type:'dossierProse'` on `generate-narrative` (or its own function on the same `_shared` — judge by the 55 s budget: one invocation per
   TAB), spending through `runCreditedCall` with ONE render SKU (ruling 1 amended: 5), the migration-118-shaped `claim_free_scribe` RPC in
   `supabase/migrations/196_scribe_claim.sql` (FILE ONLY), the block brief cached (`cache_control`, the 4096 floor padded as today), the town card +
   epoch record + `dossierNotes.aiGuidance` (rule 18: the GM's instructions, in the volatile turn, below the law — one sentence in the system block
   says the law outranks them) as the user turn, structured outputs, `claude-opus-5` from `modelRegistry.js` (the registry's first reader), the
   server-side fallbacks, the tier-0 refuter from the bundle on EVERY unit, the tier-1 same-model checklist within the repair-loop budget, a FAIL
   → the corpus draw, the metering row with cache reads. The BYOK path per ruling 10.
6. THE RETIREMENTS (rules 17, 19; owner-ordered, NOT behind the flag): the raw/narrated toggle, `requestNarrative`, `aiSettlement`, `isNarrativeStale`,
   the narrative pitch/buttons, `requestDailyLife`'s button, the `narrative` and `dailyLife` SKUs (the pricing contract test moved; `TIER_MULTIPLIERS`
   untouched); the chronicle, pins, notes, `eventNarrativeSnapshots` and `requestProgression`'s shape KEPT; old `ai_data.aiSettlement` left inert.
   The REDO button and the epoch badge take the band's place. `docs/AI_LAYER_OWNER_RUNSHEET.md` and the capability ladder doc get a dated note.
GATES: W1's list + `tests/security/gallerySanitizeAllowlist.contract.test.js` + `gallerySanitize.pglite` + `tests/security/clientAiBoundary.contract.test.js`
+ `tests/security/byokNeverLogged.test.js` + the pricing contract + `validate:migration-head` + the contiguity tests + `verify:dist` (first paint) +
the deno edge tests if runnable locally (`deno task test:edge`; say so if not). REPORT: shas · every declared shift · what the owner must do (db push
196; the pricing seed; the key) · what stays dark until W4.

## WHAT W0 AND W1 LANDED THAT YOU BUILD ON (their reports, condensed)
- `townCard(settlement, {tab, audience, staticCard, world?})` (`src/domain/prose/townCard.js`): key-sorted plain data — `epoch{advanced,tick,calendar,renderYear,renderYearIsFrozen,…}`, `lastAdvance` (only through `world`), `town{sources,roles,compromised,institutions,armedForces,forceBuckets,hasWorld}`, `pools[]` in page order (each with `vid` = the annex row, `pieces`, `faceSources`, `slots`, `compromised`, `unit{rendered,spine,faces}`, `static`, `fields`), `page[]`, `mounts[]`. The static card is an INPUT (`docs/content/scribe-static-card.json`, 413 KB). `renderTabPage` in `scribePage.js` covers 13 tabs.
- `refuteUnit(unit, card, {corpusUnit?, settlement?, options?}) → {verdict, findings[], report{}}` and `refuteTab(units, card)` (`src/domain/prose/refuteUnit.js`): 42 arms — 18 text-only, 15 card-grounded, 5 NOT-EXECUTABLE without an input (A2, A3, C6, W, CORPUS-DIFF without the corpus unit; A13's INTERESTED limb without `options.settlement`). ⛔ MEASURED: of 50 moved-claim fixtures, 9 FAIL, 14 WITHHELD, **27 caught by NO tier-0 arm** — the certainty, quantifier and scope classes; that is the case for tier 1 and the pilot sizes it. `ORDER` is WITHHELD not FAIL (only 83.7% of shipped defense rows realise a LEVEL1 order). A6 may not see role slots (30 lawful landed units would convict).
- `cardDelta(prev, next)` and `epochRecord(prevCard, nextCard, campaignState) → {advanceSeq, delta, events, pulse}` (`src/domain/prose/epochRecord.js`), a two-epoch golden.
- `supabase/functions/_shared/proseKernel.bundle.js` (163,497 B, esbuild via vite, no package.json change; two entry points; `deno check --no-lock` rc=0; byte-identical findings through the bundle and the source; `tests/lint/scribeBundle.walker.test.js` rebuilds and diffs). ⚠ A bare `deno check` REWRITES `deno.lock` — always `--no-lock`, and assert the lock byte-identical.
- The harness (`$SC/kit/scribe-harness/render-town.mjs`, `pilot.mjs`): `--dry` executed; the LIVE model path is written to the skill's spec and UNEXECUTED (no key) — W3's first job. `--dry` figures, median town: the block brief ≈ 28.5k tokens cached once per settlement; per-tab volatile turns defense ~10.0k · overview ~6.7k · plot_hooks/power/economics ~3.5k · the rest 0.2–2.3k; `town` hoisted once (96 KB off the volatile side). `war` and `relationships` fire zero pools headless.
- Chair rulings on W1's open items: the A6 role-slot gap, `armC2` over-reach on "counted going", `NON_MOVES.FEELING` on the noun "fear" are the CORPUS gate's arms and are NOT moved in W2 (a separate instrument car); `town.holders` (A13's INTERESTED limb) is ADDED to the card in W2 commit 1 with the golden re-recorded under a written cause; the bundle builders are NOT merged in W2.
