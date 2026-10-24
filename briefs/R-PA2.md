# R-PA2 — THE BIRTH AND THE FIRST ADVANCE: where PA runs, where its proposed past waits, what the first advance changes, and what the map needs (for the PA compile)

Read first: `briefs/PA-BRIEF.md` (the owner's words and laws, the proposals, the hazards, the paths), then `briefs/RESEARCH-COMMON.md`. Ignore README; your output follows RESEARCH-COMMON's eight-part order. The code of record is READ-ONLY; cite by `path :: symbol` and quote the line.

## The questions
1. **The instant world, read whole.** Read `src/store/instantWorldSlice.js`, `src/hooks/useInstantWorldMaterialize.js`, `src/components/instant/InstantWorldEntry.jsx`, `src/components/WorldPage.jsx` and `src/components/settlements/LivingWorldGates.jsx`. Answer:
   - How are settlements minted (the same generator as a single dossier?), placed and connected (roads and routes discovered)?
   - How is the campaign created? Which preset applies at birth, and what does it light?
   - What does the world-pulse state hold at birth (`spatialLedgers.*`, pacts, alliances, rumors, war state, the chronicle)? Confirm or refute "the realm's relationships start blank", with receipts.
   - When is "birth" for the other paths: a user adding settlements one by one to a campaign, an import, a world grown from a single dossier?
2. **The first advance.** Answer:
   - What triggers an advance, and what does it write? Read `advanceInterval.js`, `applyWorldPulse.js`, `pulseKernel.js` and the DM's advance control.
   - Does a campaign know it has never advanced (a tick counter, a history length)?
   - Find "the catch-up mechanism" and say what it does.
   - Read `docs/DESIGN_FP_ARCH_EP.md` (THE EPOCH: its recorded entropy per advance; EP-N THE LONG ADVANCE, OD-FC-51: N chained `one_year` advances). What can PA reuse from it, and what must it not (EP advances the live world; PA must not change the present)?
3. **THE BIRTH DOOR** (fold §6, THE INSTRUMENTS BEFORE C0 item (1); OD-FC-62; "+30 keys"). What is it, what are its keys, where does it sit in code, and would PA's proposed past enter through it?
4. **Where the proposed past waits before the first advance.** Weigh these candidates:
   - the proposal ring and its snapshot undo (`campaignWorldPulseSlice.js`);
   - Edit Mode's pending ledger and directives (`src/domain/edit/`; the registered word "seal" is its one-week directive);
   - the Decree Registry;
   - OD-FC-32's PERSISTED UNDO (the instruments' item (2));
   - the campaign record.

   Also say how a review screen at birth would sit in the UI flow: the instant entry, the wizard's empty state, LivingWorldGates. Which candidate carries "the user strikes, changes, keeps or re-rolls a fact, sees the knock-on, then the first advance makes it history" with the least new machinery?
5. **Determinism and seeds.** Find the world seed and the per-settlement seeds. Say how a replay would be seeded so that the same seed and the same user choices give the same past byte for byte, and list every `Date.now()`, `Math.random()` or unsorted iteration in the birth path.
6. **Cost.** Answer:
   - How many settlements does an instant world have, at what scales?
   - What is the per-tick cost budget (the instruments' item (3))?
   - What would an event-driven replay over N dossiers × M events cost?
   - Can it run in a worker (`src/workers/`)?
7. **The map side.** Read `docs/DESIGN_SETTLEMENT_MAP.md`, `docs/DESIGN_MAP_DOORS.md`, `src/components/WorldMap.jsx` and `src/components/map/*`, plus the fold §5 rows `sway`, `allegiance` and `territory` and the fold's host rows H13 (`polityOf`) and H19. Answer:
   - Where do realm and polity names come from (a naming stage)?
   - What must PA hand the map for "named polities from day one" and "borders that already moved"?
   - What does the map already derive by itself?
8. **The token census** (RESEARCH-COMMON item 3): `birth`, `born`, `first advance`, `advance`, `tick`, `week`, `epoch`, `catch-up`, `catchUp`, `handover`, `briefing`, `proposal`, `review`, `replay`, `backfill`. Mark each LANDED, FREE or PROSE-ONLY, and recommend.

## The chair's proposals to grade
- (a) PA runs once at birth, after placement and connection and before the first advance.
- (b) The proposed past waits in <your recommendation>.
- (c) At the first advance the past becomes history (what flips, where).
- (d) An event-driven replay, run in a worker, fits the budget.
- (e) The non-instant paths: settlements added later get their past linked at their joining (or not; recommend).

## Output
Write `KIT/findings/R-PA2.md` in RESEARCH-COMMON's order, saving as you go. Final message per RESEARCH-COMMON's report diet: at most 350 words plus ONE table (mechanism · `path :: symbol` · what PA uses it for · cost or hazard).
