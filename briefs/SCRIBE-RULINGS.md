# THE SCRIBE — THE CHAIR'S RULINGS ON THE TWELVE OWNER-GATED DECISIONS (Fable 5.1 chair, 2026-09-14 06:0x)
The owner's words: "i give all permissions you need now or would need in the future and leave all decisions to you" (09-13) ·
"build it in! this will likely happen first before the handwritten prose lands" (09-14). Under that grant the chair DECIDES the
design's §12 defaults so the build is not stalled, records each vetoably, and keeps PUSH · DEPLOY · MIGRATION APPLY (`db push`) ·
DATA DELETION off the table by its own rule. A migration FILE is written; applying it is the owner's act.

1. THE PRICE ROW — `dossierProse: 4` credits in `NEW_AI_COSTS` (between narrative 5 and dailyLife 4: one settlement, six tab calls,
   mostly cached) with the server mirror and the pricing contract test; `TIER_MULTIPLIERS` untouched (all-1 is the owner-signed
   activation switch). RATIONALE: priced like the feature it most resembles; the pilot's measured COGS re-prices it before launch.
2. FREE FIRST RENDER — YES, one per ACCOUNT on the migration-118 pattern (`claim_free_scribe`), released on failure. RATIONALE: the
   same product logic as the free first narrative; unfarmable by construction.
3. THE PUBLIC PROJECTION — NOT SHOWN to gallery viewers and NOT copied on gallery import in W2 (absent from `PUBLIC_TOPLEVEL_KEYS`;
   migration 196 adds the claim RPC only). RATIONALE: fail-closed is the estate's rule; showing paid, unrefuted-by-a-human prose on
   the public gallery is a reversible LATER decision, hiding it is the safe first state. Re-open at W5.
4. LICENSED OR RENDERED — RENDERED TEXT: plain spread on import, no provenance remap. RATIONALE: the artefact is the owner's own
   world's text, not a creator's licensed content; the `customContentProvenance` shape is for the latter.
5. THE RESIDUAL ERROR RATE — the pilot's gate (design §10): ship behind the flag only at or below the corpus's audited defect rate;
   WITHHELDs ship (the corpus's own rule); FAILs never ship (the unit falls back to the corpus). No number is set by hand.
6. REFUSED UNITS — SILENTLY THE CORPUS on the player page; on the DM page the artefact's per-unit verdicts are readable in the
   notebook register as a REPORT ("the archiver's hand" vs "the survey's" is NOT printed — the reader is not told which line a model
   wrote). RATIONALE: the dossier is one archiver; two hands on the page would break the frame. Re-open at W5 if the owner wants a mark.
7. RE-SCRIBE — the growth opt-in's shape exactly: a campaign-level, versioned, explicit "re-scribe this world under Scribe vN"
   that re-renders EVERY block (never a partial mix) and keeps the prior artefact in `versionHistory` as one entry (prose stripped
   from ordinary snapshots, kept on the re-scribe entry only). Default OFF. Nothing re-renders on its own.
8. MODEL — `claude-opus-5` (the API skill's default) for the writer and the tier-1 refuter on the managed path; adaptive thinking,
   `effort: 'high'`, structured outputs, streaming, server-side `fallbacks: "default"`. A Fable selector arm runs in the PILOT only
   (design §6) and is adopted only if the blind read prefers it. The `opus-4-8` defaults elsewhere are NOT moved by the Scribe.
9. RETENTION AND CONSENT — the rendered prose is the user's world data under the existing consent v2 posture (research plane off by
   default); NO Scribe prose enters any training/research corpus without the campaign-level toggle the intent-atlas design already
   specifies. Opus 5 on the managed path (no 30-day-retention constraint); BYOK users inherit their own org's retention.
10. BYOK — a BYOK user's Scribe runs on THEIR key at THEIR model's probe tier (the ladder's no-flattening rule), the tier-0 refuter
    unchanged, the tier-1 refuter on the same model as their writer (the conflicted-witness rule).
11. THE CHECKOUT — the Scribe builds in `lane-scribe` at `7992713d0` (the consist lineage) and lands with the consist at §920; the
    stale main checkout is never built from and never touched.
12. FINITE-SEMANTICS — read as "prose is an output; the pin is that nothing under src/domain (except display/) or src/generators
    reads `settlement.prose`". The pin is a source scan in the W2 commit. If the owner reads the law otherwise, W2 is reverted by
    one commit; W0–W1 stand as instruments either way.

13. THE ADVANCE RULE (the owner, 2026-09-14 ~06:1x, verbatim): "new rule. when advance time happens, the program reads teh new town
    card, the history of town cards, and what happened last. or however we have it now. This is essentially the narrative overlay
    set as default and without prose already constructed for it to refine. so think of it like that in terms of how it reads past
    settlements data to make things remain coherent." READ AS: the artefact is write-once PER EPOCH, not per settlement. An advance
    produces a new card; the Scribe renders epoch k from (card_k, the history card_0..k-1 as deltas, the typed record of advance k)
    and never from prior prose — coherence comes from the cards and the record, not from re-reading its own text. The prior epochs'
    prose is KEPT (THE PROMISE's lived past) and the page shows the epoch the world is at. This is `requestProgression`'s diff-aware
    shape (aiSlice.js:764) made the default and stripped of its "refine what was written" step.
