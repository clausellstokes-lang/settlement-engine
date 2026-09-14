# LANE: THE SCRIBE — W2, IN THE PRODUCT, DARK (behind a flag, default OFF) — DRAFT 2026-09-14 06:5x; ⟦…⟧ filled from W0/W1 before dispatch

DOCK: `$SC/kit/lane-scribe` at W1's tip ⟦sha⟧. The same laws as W0/W1 (read both briefs). THIS WAVE TOUCHES PRODUCT BYTES and grazes two
owner-gated classes the owner has opened ("build it in"; "let's just get it all out there"): the paid surface and the persistence shape. The
migration FILE is written; `db push` is the OWNER'S act — never run it. Never push. Everything lands behind `FLAGS.scribe` (default false) except
the retirements, which the owner ordered outright (rules 17, 19) and which land as their own commit with the pricing contract test moved.
READ FIRST: the design at the ledger ⟦sha of the latest design commit⟧ (§3, §5, §5b, §5c, §6, §7, §8, §12) · SCRIBE-RULINGS 1–19 · W0's and W1's
reports · `src/lib/ai.js` (generateNarrative) · `supabase/functions/generate-narrative/index.ts` (the credit sequence :1160-1380; `fetchAiWithRetry`
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
