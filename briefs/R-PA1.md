# R-PA1 — THE DOSSIER'S PAST: what each settlement already says about its past, what it implies about others, and what a past must never contradict (for the PA compile)

Read first: `briefs/PA-BRIEF.md` (the owner's words and laws, the proposals, the hazards, the paths), then `briefs/RESEARCH-COMMON.md`. Ignore README; your output follows RESEARCH-COMMON's eight-part order. The code of record is READ-ONLY; cite by `path :: symbol` and quote the line.

## The questions
1. **The history generator, read whole.** Read these files:
   - `src/generators/historyGenerator.js` (`generateHistory`);
   - `src/generators/history/historyEventStrands.js`, `historyPolicyData.js` and `historyRouteContext.js`;
   - `src/generators/historyTemplate.js`, `legacyGenerator.js` and `src/generators/steps/generateNarratives.js`;
   - `src/domain/historyBeats.js` (the reader).

   List every field of `settlement.history`, and every event TYPE with its template (`HISTORICAL_EVENTS_DATA` or its equivalent): name, type, dating, severity and lastingEffects. Cover the founding (`age`, `reason`, `foundedBy`, with their value sets), `eventsTimeline`, `legacyAnnotations` (what a "present-day link" is), `siegeNarrative`, and `currentTensions` (the stress → tension map and the neighbour-relationship → tension map).
2. **Which events imply another party.** Classify every event type and history field as one of:
   - LINKABLE: it needs a counterpart; say which kind (another settlement, a people or power, a menace, a deity);
   - LOCAL: it needs none;
   - AMBIGUOUS.

   The likely candidates: raid, siege, war, conquest, occupation, plague arrival, refugees or migration, trade boom or collapse, schism or conversion, founding by settlers (`foundedBy`), and the hostile, rival or trade-partner neighbour (`config.neighborRelationship`, `neighbourGenerator.js`). Also read `crossSettlementConflicts.js` and `src/domain/traditions/{genesis,relations,customFounding}.js`, and say whether either already relates two settlements' pasts.
3. **Dating.** Settle each of these:
   - Is every event dated against the present (`yearsAgo`) and the founding (`history.age`)?
   - Can an event predate its own founding? Are years integers, and is everything deterministic by seed?
   - What range do settlement ages take, by tier?
   - Propose how many dossiers' timelines merge into ONE realm timeline: the oldest founding as year 0; the clock starts at the second-oldest founding; each town joins at its own.
4. **The dossier's present facts a past must agree with.** Cover:
   - government and the power structure (`powerGenerator.js`, `src/generators/power/`);
   - the ruling and governing factions, their relations (`factionDynamics.js`, `factionCorrelation.js`) and institutions;
   - religion and deity, defenses (`defenseGenerator.js`: walls, garrison), economy and trade (`economicGenerator.js`, `src/generators/economy/`), isolation, and the neighbour relationship config.

   Which present facts carry political allegiance (independent, vassal, capital, free)? Which would a past contradict if it invented a conquest, a change of rulers, a population loss or a faith?
5. **User intent and edits.** Cover:
   - what a dossier is when persisted (the save record);
   - how a dossier is edited: Edit Mode in `src/domain/edit/` (`recordRegister.js`, the pending edits, the one-week directive registered as "seal"), regeneration, custom content, locks;
   - whether an edited value is distinguishable from a generated one (provenance);
   - how a test could hold every dossier BYTE-IDENTICAL before and after a replay (the canonical serialization; volatile fields).
6. **"The way our settlement generator replays a dossier's history before drawing the town."** This is the map session's claim about growth stages and buried strata. Find what it refers to (the map module, `src/foundry/`, `docs/GENERATION_TIME_SHIFT_MAP*.md`, `docs/DESIGN_SETTLEMENT_MAP.md`) and say what it reads.
7. **The token census** (RESEARCH-COMMON item 3): `past`, `history`, `prehistory`, `pre-history`, `annals`, `founding`, `founder`, `foundedBy`, `lineage`, `grudge`, `feud`, `briefing`, `proposed`, `strike`, `struck`, `settled`, `kept`, `fixed`, `canon`, `realm`, `polity`, `epoch`, `era`. Mark each LANDED, FREE or PROSE-ONLY, and recommend PA's code tokens and the words for its states. Never `seal`, `DRAFT`, `pin` or `lens`.

## The chair's proposals to grade
- (a) The realm timeline from the dossiers, oldest first, with the clock at the second-oldest founding.
- (b) The LINKABLE classes as you find them.
- (c) A byte-identity test on every dossier is feasible as stated.
- (d) The rules by which present-day ties must agree with a dossier's present facts.

## Output
Write `KIT/findings/R-PA1.md` in RESEARCH-COMMON's order, saving as you go. Final message per RESEARCH-COMMON's report diet: at most 350 words plus ONE table (event type · LINKABLE/LOCAL/AMBIGUOUS · counterpart kind · dated by · receipt).
