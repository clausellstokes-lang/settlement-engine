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

14. THE OPEN TRIGGER (the owner, 2026-09-14 ~06:3x, verbatim): "but generation happens only once a settlement's dossier is opened and frozen
    until next advance time." READ AS: nothing renders on save or on advance by itself; a render starts when a settlement's dossier is ON
    SCREEN, it has a durable home (a saveId), and no artefact exists for the current epoch; the artefact is then frozen until the next
    advance makes it stale; a settlement never opened in an epoch is never rendered or billed. Chair's addition (vetoable): the durable-home
    condition, so no credit is spent on a town that cannot keep what it paid for.

15. THE UNDONE EPOCH IS SAVED (the owner, 2026-09-14 ~06:4x, verbatim): "if advanced time is reverted back, then that past one should be
    saved." READ AS: an undo of an advance never deletes that epoch's prose; the restore chokepoint MOVES it whole into the past-epochs lane
    marked undone (with its advanceSeq and the advance's nonce, since the seq will be reused by a different future) and re-points current
    at the surviving epoch. SUPERSEDES the chair's earlier "drop epochs above the restored depth". Applies the same tier rotation as lived
    epochs (item 13 stays owner-gated).

16–19. THE PRODUCT SURFACE (the owner, 2026-09-14 ~06:5x, verbatim): "and there should be an option to redo the AI narrative, to redraw based on the
    current settlement's facts. lastly, remove the Narrative overlay option because it is now redundant. But do key in the AI instructions box in the
    dossier to be additional instructions that is actually read and used by the AI for the prose for the dossier. And lastly, with this, it is
    automatially default that the daily life tab be populated rather than on command. let's just get it all out there."
    16 REDO: a redraw of the current epoch from the current facts; the prior render moves to the past lane marked redone; billed per render.
    17 THE NARRATIVE OVERLAY IS RETIRED in W2 (toggle, requestNarrative, aiSettlement, pitch, the narrative SKU); chronicle/pins/notes/snapshots stay.
    18 `dossierNotes.aiGuidance` (the ai_notes tab) is read on every render as the game master's instructions — in the volatile turn, below the law,
       shaping words never the world; the refuter runs unchanged; editing it makes the epoch redo-eligible, never auto-renders.
    19 DAILY LIFE renders by default as the seventh tab call of every epoch render, same card, same VOICE, same refuter, same artefact, same REDO;
       its on-command button and SKU retire. Ruling 1 AMENDED: one render SKU, chair's default 5 credits (the retired narrative's), owner-signed.

20. W2's COMMIT 6 (THE RETIREMENTS) IS DEFERRED TO W5, NOT REFUSED (chair, 2026-09-14 ~10:0x, after W2 stopped it with measured blockers): retiring
    `requestNarrative` today empties `eventNarrativeSnapshots` (:18, :50 read `aiSettlement`), leaves the chronicle with no writer (its three writers are
    all narrative-family: aiSlice.js:527/958/1123) and makes NPC pins inert; retiring the `narrative`/`dailyLife` SKUs by editing the client table reds
    the money pins over SHIPPED migrations (114's seed parsed by contracts.test.js; feeSchedule.pglite executes spend_credits per feature). THE LAWFUL
    ORDER: the Scribe's own chronicle writer lands first (owner item 13 — past epochs into `ai_data.chronicle`), the SKUs retire by a NEW migration that
    re-seeds `ai_credit_costs` (never by contradicting a shipped seed), the overlay's UI and requests retire at the FLAG FLIP (W4), all as one revertable
    commit. The owner's order stands; only its moment moves.
21. THE EPOCH RECORD IS COMPUTED AT ADVANCE TIME (chair, same hour; W2 found the transport sends `null`): the past lane is compact (units only) so a
    prior card cannot be rebuilt after the settlement moves — therefore the advance trigger itself computes `epochRecord(currentArtefact.card,
    townCard(newState), campaignState)` while both cards exist and stores it on the now-stale artefact; the render at open sends it. `current` keeps its
    card (it already does). W3's first fix.
22. W0's GATE LIST MISSED `tests/lint/composeStateProseFence.test.js` — `townCard.js` and `scribePage.js` import the composer and `faceSources.js` and are
    not in `ROUTED_COMPOSERS`/`PAGE_CALLERS`; red at the W0 tip and after. A chair car adds them (they are headless readers, the fence's own class) —
    not a re-record.
23. THE 24-WORD BAR IS MEASURED IN THE SWEEP'S CONVENTION (a slot counts as one token): the owner's six lines are counted as written; a slot's rendered
    length is the engine's. Recorded for the instrument car.
24. PRE-EXISTING DEFECTS SURFACED BY W2, THE OWNER'S: the account-import NODE BUDGET (`MAX_NODES` 20,000) refuses 4 of 7 real generated towns today,
    artefact or no artefact (security posture — owner-gated); `verify:dist`'s first-paint closure is over its 1,048,000 B ceiling at the BASE
    (1,058,427; W2 adds 162 B) and the generation worker is over its ceiling too (1,416,656 vs 1,404,493) — both pre-existing reds, neither W2's.

## Rulings 25–31 — from the simulation (chair Fable 5.1, 2026-09-14 ~12:3x; the owner: "fix them comprehensively and exhaustively")

25. **ONE PROMPT.** The product and the pilot harness build the prompt from ONE module (`src/domain/prose/scribeBrief.js`, bundled for Deno, imported by the harness from the dock). The harness's own brief builder and its flat output schema are struck: what the pilot measures must be what ships. Design §3.2's shape (`spine + faces + notebook` per pool, with `vid`) is the one output grammar.
26. **THE CARD ANSWERS WHAT THE REFUTER ASKS.** Every rule the tier-0 refuter can convict on is TOLD to the model in the card or the brief — the spine's LEVEL1 order id and its licence, the pool's field paths and values, each face position's source and roster, the fills. A refusal for a rule the model was never given is an instrument defect, not a model failure. (Measured: four of five drops on the first simulated page were the order arm.)
27. **CORPUS-DIFF ORDER LOSS STAYS FAIL, AND IS RE-MEASURED.** With the order on the card, the arm is fair. If an Opus seat on the unified prompt still loses the order on more than one pool in ten, the arm is demoted to WITHHELD for Scribe text by the chair, recorded here — because the AI unit replaces the pool per town and the census's grammar is the corpus's.
28. **THE Q ARM GETS THE CORPUS'S INPUTS.** On the card ground the second-sentence arm reads the pool's FIELD PATHS with the ratified synonym vocabulary (as the corpus's own Q arm does), not the wiring strings. A second sentence that names the field in its own word is licensed.
29. **TIER 1 IS WIRED AND ASKS SEVEN QUESTIONS.** Certainty · quantifier · scope · actor · forecast · **mechanism** (a practice, procedure, cause, custom, price, debt, fine or backlog where the card only says the thing stands) · **same page** (contradicts a machine line on this page). Any `yes` drops the unit to the corpus. A tier-1 provider failure is NOT a render failure: tier 0 is the floor, the units it kept ship, and the response says `tier1: skipped`.
30. **THE STATIC TRUTHS THE MODEL WOULD OTHERWISE RECONCILE ARE STATED IN THE BRIEF.** The two readiness ladders (the badge's six words; the band's four) are both the engine's; write to the pool key's band, never the badge word. A funding note at 97–99 % beside "Well-funded — Full pay" is two fields, both true; write to the pool key and neither number. The corpus line given with a pool is the CLAIM and the FALLBACK, never a model of the law where it breaks a bar.
31. **TWO CACHED BLOCKS.** The global brief (voice · bars · unit rules · exemplar pack) is one cache breakpoint shared by every settlement of the hour; the town block is a second, shared by a settlement's tabs. The exemplar pack rides in the product as `docs/content/scribe-exemplar-pack.md` → generated `exemplars.ts` (the voice.ts idiom), after a read for quoted copyrighted passages.

OWNER-GATED, RECORDED AS A PROPOSAL (design §12): the readiness BADGE and the readiness BAND are two ladders on one shipped page (`defenseGenerator.js:517` vs `defenseScoreBands.js`); aligning them is a display change on a shipped surface whose label `factionDynamics.js` also reads as engine state. Not touched.
DEFERRED TO THE CORPUS LANE (paused by the owner 12:05): the shipped `WALLED-STRAINED` fill "The town walls around {settlement} is sound … which is the kind of arithmetic" (number error + which-closer) and `walls PRESENT`'s colon + not-X-but-Y — chartered below.

## Rulings 32–35 — from RUN 2 (chair Fable 5.1, 2026-09-14 ~14:2x; the owner 13:2x: the Scribe is the AI narrative layer and a possible tier of its own; continue to completion)

27 (MEASURED). Over 377 units on the unified prompt `CORPUS-DIFF` never fired: the order arm is fair once the card carries the order, and it STAYS FAIL.
32. **A UNIT SHIPS WHOLE OR PATCHED, NEVER WITH A REFUSED ROW** (amending 5/6). A refused FACE draws the corpus face at its own seat and the unit ships with a `PATCHED` verdict naming the seat and the arms; a refused SPINE drops the unit (the spine is the fact). Measured cause: one invented face was taking six lawful lines with it.
33. **NULL IS UNKNOWN, NOT ABSENT.** A null field on the card is a decision the engine has not made; the writer may assert nothing that depends on it; a pool whose fields are all unknown, or which reads only world state on a town with no world, is UNWRITEABLE on that page and the card says so. Measured cause: the commonest invention was an absence asserted on a null read.
34. **A VERBATIM CORPUS ROW IS EXEMPT FROM THE SECOND READER.** A row byte-equal to the corpus spine or face at its seat already ships in the corpus; the writer is TOLD to copy the corpus face where the card gives a face nothing to stand on.
35. **THE SIX WAYS A LINE INVENTS ARE LAW FOR BOTH SEATS**: an absence on an unknown field · an origin · a contest the card does not name · a practice behind a boolean · a verdict the town's own rows deny · a neighbour or road beyond the card. The writer's brief bars them with an example each; the second reader's checklist opens with the same six; question 1 (certainty) is re-worded to "states as decided what the facts leave undecided".
CORPUS FINDING, the corpus lane's: `WALLED-STRAINED` fires at `economicGates.military = 0.98`, a two-percent shortfall read as "strained" beside "Well-funded — Full pay"; the key's threshold joins the STRAINED-on-a-wage-less-roster proposal.
36. **THE SCRIBE IS HELD TO NON-CONTRADICTION, NOT TO NON-INVENTION** (the owner, 2026-09-14 ~14:4x: "the goal is that it doesn't contradict the settlement not that it invents when it comes to prose"; the 09-12 corpus law applied to the Scribe). Ruling 35's six invention bars are SUPERSEDED. A line is refused only for: a value a card field denies · a page line or badge (the two ladders and the funding note granted as two truths each) · a role or record the town does not seat or keep (floor 1) · the engine's model denied (floor 4) · an event, a date or a number stated as record where the card holds none (floor 2, the owner's surviving floor) · a forecast. A practice, a custom, a motive, a belief, an interpretation, or an absence asserted on an UNKNOWN field is flavour and ships unless a row or page line denies it. The second reader's seven questions become SIX contradiction tests (field · page · roster · model · record · forecast); certainty, quantifier, scope and mechanism are struck. RUN 2's "70 % refused" is therefore NOT the product's number: a re-read under this standard is RUN 3's first act.
