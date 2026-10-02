import { createHash } from 'node:crypto';

const ADDRESS_KEYS = Object.freeze(['home', 'field', 'voiceClass', 'distinctValues', 'occurrences']);
const REWRITE_KEYS = Object.freeze(['source', 'flags', 'replacement', 'distinctValues', 'occurrences']);
const INERT_KEYS = Object.freeze(['source', 'flags', 'replacement', 'reason']);
const RAW_KEYS = Object.freeze(['rootOrdinal', 'pulseIndex', 'field', 'outcomeIndex', 'headline']);
const LANES = Object.freeze({ mechanicalOutcomes: 8, selectedOutcomes: 24 });
// ── RE-RECORDED 2026-09-01 BY T8 · SHIFT (ODQ §858 + §860) — THE SECOND COPY OF THE SAME TUPLE.
// This literal and `scripts/lib/news-voice-contract.mjs`'s must agree byte for byte: the headline
// walker reconstructs through the VOICE contract's `reconstructWizardNewsIntroductions`, so a
// tuple updated in one home and not the other reds here with the other file's message. The
// provenance and the single-variable control are recorded once, at the voice contract's copy.
// ── RE-RECORDED 2026-09-01 BY THE WAR LANDING (§876) — STILL THE SECOND COPY OF THE SAME TUPLE.
// 268/28/51 → 272/32/50. The provenance, the five-arm single-variable control and the falsified
// dispatch causes are recorded once, at the voice contract's copy, exactly as before.
// ── RE-RECORDED 2026-09-24 BY FP BATCH LANDING 4 (the FP chair, session 87797a6a), IN THE SAME ACT AS THE NEWS-VOICE
// CONTRACT, THE PROSE-FAMILY CONTRACT AND THE OSR WALKER'S PINS ─────────────────────────────────────────────────────
// CORPUS 273/33/240/51 → 273/1/272/51 (retirements and finalEntries only). ADDRESS_TOTALS,
// RAW_LIVENESS and REWRITE_TOTALS HOLD: the addresses are minted at INTRODUCTION and the raw headline rows are the persisted
// pulse records, neither of which the retention window touches. ONE CAUSE: the Herald lens U2 (32315e384, FP-31 = P1), the
// 52-week window under the 240 cap; attributed by equality with the U2 seat's own measurement at its base.
// ── RE-RECORDED 2026-09-24 BY FP BATCH LANDING 3 (the FP chair, session 87797a6a), IN THE SAME ACT AS THE NEWS-VOICE
// CONTRACT, THE PROSE-FAMILY CONTRACT AND THE OSR WALKER'S PIN ───────────────────────────────────────────────
// CORPUS 272/32/240/50 → 273/33/240/51; ADDRESS_TOTALS 50/2/100/12/88/393/544 → 51/2/102/13/89/395/546;
// REWRITE_TOTALS occurrences 144 → 145 (rules 26, active 16, inert 10, distinct 63 HOLD); RAW_LIVENESS: the selectedOutcomes lane
// gains one headline occurrence and the mechanical lane holds. ONE CAUSE, ATTRIBUTED BY BISECT (the corpus builder run per
// sha over the fourteen commits since landing 2, then these walkers at the culprit): CURE-PEACE-1 U1 (c9b24fe51) — a
// peacetime suit retires when a war opens against its court, and the feed's reconcile of the superseded proposal mints
// ONE new wizard-news id with a home of its own (a new address, prospective voice, one spelling). Every figure here was
// derived by the walkers' own functions from one corpus build and cross-checked at c9b24fe51 and at the landing tip.
// ── RE-RECORDED 2026-10-01 BY THE URBAN-BAND CHAIR (session 93391427), IN THE SAME ACT AS THE NEWS-VOICE CONTRACT, THE
// PROSE-FAMILY CONTRACT AND THE OSR WALKER'S PINS: CORPUS 273/1/272/51 → 265/1/264/44 (the provenance and the named homes
// are recorded once, at the voice contract's copy); ADDRESS_TOTALS, RAW_LIVENESS and REWRITE_TOTALS below, each noted.
const CORPUS = Object.freeze({ pulseRoots: 12, introductions: 265, retirements: 1, finalEntries: 264, homes: 44 });
// ── RE-RECORDED 2026-09-01 BY T8 · SHIFT (ODQ §858 + §860) ─────────────────────────────────────
// 53/106/14/92/400/544 → 51/102/12/90/393/536. `fields` holds at 2, as it must: the address grammar
// is still headline-and-summary and nothing was added to it.
// ⭐ THE HOMES DELTA IS NOT A COUNT, IT IS TWO NAMES, AND NAMING THEM IS THE WHOLE PROVENANCE:
// `applied|cause_lifecycle` and `queued|npc_exploit` VANISH, each taking its headline row and its
// summary row (2 homes × 2 fields = the 4 identities). That is car 1's corruption-onset shift
// (§858: first corrupt NPC ~9 → ~33 ticks) read directly off the news layer — a 12-interval corpus
// no longer reaches a cause-lifecycle beat, and no NPC is corrupt enough to be queued to exploit.
// The single-variable control agrees: with car 1's two src files restored to the landing base, the
// whole tuple reads its FROZEN value, cars 2 and 3 notwithstanding.
// ── RE-RECORDED 2026-09-01 BY THE WAR LANDING (§876) ───────────────────────────────────────────
// 51/2/102/12/90/393/536 → 50/2/100/12/88/393/544. `fields` holds at 2 for the third re-record
// running, as it must, and `prospectiveIdentities` holds at 12: nothing was added to the address
// grammar and no prospective home was touched.
// ⭐⭐ `distinctValues` HOLDS AT 393 EXACTLY WHILE `occurrences` RISES 8 AND A HOME LEAVES, AND
// THAT COINCIDENCE IS THE FINDING RATHER THAN AN ACCIDENT. Decomposed row by row: ONE home
// vanishes, `applied|stressor_escalate_insurgency`, taking its headline and its summary row
// (−2 identities, −2 distinct, −4 occurrences); the surviving rows move +2 distinct / +12
// occurrences. The two sums cancel on distinct and do not on occurrences. `5a529f100` (T4
// SEAT-2b) declares its legitimacy-sensitivity table a REDISTRIBUTION and not an inflation —
// "it can only move WHICH seats are fragile WHEN" — and a vocabulary that holds its size while
// its homes are re-dealt is that claim measured from outside the car.
// THE SEVEN HOMES THAT MOVE, NAMED, because a count is not a provenance: down —
// `applied|npc_exploit` 3/3 → 2/2 and `applied|npc_suppress` 6/9 → 5/8 on both fields; up —
// `applied|stressor_aftermath` and `applied|stressor_residual` 1/1 → 2/3, the two
// `applied|stressor_birth_*` homes, and `applied|trade_pressure` +1 occurrence on both fields.
// The single-variable control and the two falsified dispatch causes are recorded once, at
// `scripts/lib/news-voice-contract.mjs`.
// 2026-10-01 (the urban band + the druid rulings): 51/2/102/13/89/395/546 → 44/2/88/14/74/385/530. `fields` holds at 2.
// Eleven homes leave with their 22 rows and four arrive with 8 (five of them prospective); no surviving row flips its voice.
// 2026-10-02 (THE VOICE PROGRAM wave 1, the owner: "Updates like these need to reflect actions not to potential"): 44/2/88/14/74/385/530 → 44/2/88/0/88/392/530.
// The corpus does not move (12/265/1/264/44); every address keeps its home and field and EVERY prospective row turns
// indicative, because each producer now writes its pending proposal UNDER WAY and its applied twin DONE (heraldDeeds.js).
const ADDRESS_TOTALS = Object.freeze({ homes: 44, fields: 2, identities: 88, prospectiveIdentities: 0, indicativeIdentities: 88, distinctValues: 392, occurrences: 530 });
const RAW_LIVENESS = Object.freeze({
  pulseRecords: 12,
  lanes: Object.freeze([
    // TE36 (ODQ §271, chair-authorized): 77/24/73/23 → 56/29/52/28. WAVE P4 retired the bare
    // `population_decline` candidate under `demographicsEnabled`, which this corpus lights
    // along with every other flag, so the MECHANICAL lane loses 21 "population may fall"
    // headlines. Its distinct-value count RISES (24 → 29) because the retired family was
    // repetitive: removing 21 occurrences of a handful of spellings leaves a shorter, more
    // varied lane. The selectedOutcomes lane is UNCHANGED — ordinary population drift was
    // already `state_only` and never a Chronicle beat.
    // T8 · SHIFT (§858 + §860): 56/29/52/28 → 54/28/50/27. TWO mechanical headlines leave, and the
    // distinct count follows them down by one — the opposite of TE36's rise, because this time the
    // departing records are NOT a repetitive family but two ordinary one-off beats.
    // WAR LANDING (§876): 54/28/50/27/4/1 → 53/28/49/27/4/1. ONE mechanical headline leaves and it
    // was prospective; both distinct counts and the whole indicative half hold, so the departing
    // record was a duplicate spelling of one already in the lane.
    // 2026-10-01 (the urban band + the druid rulings): 53/28/49/27/4/1 → 49/22/44/21/5/1, the re-dealt year's mechanical beats.
    // 2026-10-02 (THE VOICE PROGRAM wave 1): every persisted headline in this lane is now a deed; its prospective half is zero.
    Object.freeze({ field: 'mechanicalOutcomes', capPerPulse: 8, headlineOccurrences: 49, distinctValues: 22, prospectiveOccurrences: 0, prospectiveDistinctValues: 0, indicativeOccurrences: 49, indicativeDistinctValues: 22 }),
    // ⭐ THE CONTROL THAT HELD FOR TWO RE-RECORDS NOW MOVES, AND THAT IS THE POINT OF KEEPING IT.
    // T8 recorded this lane byte-identical twice running because the corruption work never authors
    // into it. WAR LANDING (§876): 151/80/95/66/56/14 → 153/78/95/63/58/15, and the shape names the
    // new cause without ambiguity. `prospectiveOccurrences` HOLDS AT 95 while prospective distinct
    // falls 66 → 63 and the indicative half rises 56/14 → 58/15: the public lane authors the same
    // number of "may" beats in FEWER spellings and two more settled ones. That is `5a529f100`'s
    // upheaval gates re-dealing which seats are fragile when — a lane the corruption work could not
    // reach, and the first cause in three re-records that does.
    // 2026-10-01 (the urban band + the druid rulings): 154/78/96/63/58/15 → 155/75/93/59/62/16.
    // 2026-10-02 (THE VOICE PROGRAM wave 1): every persisted headline in this lane is now a deed; its prospective half is zero.
    Object.freeze({ field: 'selectedOutcomes', capPerPulse: 24, headlineOccurrences: 155, distinctValues: 84, prospectiveOccurrences: 0, prospectiveDistinctValues: 0, indicativeOccurrences: 155, indicativeDistinctValues: 84 }),
  ]),
  // TE36: the union follows the mechanical lane alone — 228 → 207 (−21, the same 21),
  // 83 → 80 distinct, 168 → 147 prospective. The indicative halves do not move at all.
  // T8 · SHIFT: the union follows the mechanical lane alone AGAIN — 207 → 205 and 147 → 145, the
  // same two. `distinctValues` holds at 80 and both indicative halves hold, so the arithmetic says
  // the two departed headlines were prospective and already spelled elsewhere in the union.
  // WAR LANDING (§876): the union no longer follows one lane — BOTH move, in opposite directions
  // on occurrences (mechanical −1, selected +2), so 205 → 206 and 145 → 144 and 60 → 62.
  // ⭐ THE STRUCTURAL FACT THAT SURVIVES ALL THREE RE-RECORDS: `union.distinctValues` equals the
  // SELECTED lane's exactly — 80 = 80 before, 78 = 78 now — so the mechanical lane's 28 spellings
  // are still a strict subset of the public lane's. That is what makes the union's distinct half
  // an honest check on the lanes rather than a restatement of them.
  // FP BATCH 3 (2026-09-24): the union follows the selectedOutcomes lane — 206/144 → 207/145; the distinct and indicative halves hold.
  // 2026-10-01 (the urban band + the druid rulings): 207/78/145/63/62/15 → 204/75/137/59/67/16, and THE STRUCTURAL FACT SURVIVES:
  // union.distinctValues equals the selected lane's (75 = 75), so the mechanical spellings are still a subset of the public lane's.
  // 2026-10-02 (THE VOICE PROGRAM wave 1): the union's prospective half is zero for the first time.
  union: Object.freeze({ headlineOccurrences: 204, distinctValues: 84, prospectiveOccurrences: 0, prospectiveDistinctValues: 0, indicativeOccurrences: 204, indicativeDistinctValues: 84 }),
});
// TE36 (ODQ §271): 17/9 → 16/10 and 69/168 → 66/147. THE RULE COUNT IS UNCHANGED AT 26 —
// no rewrite rule was added or deleted; one CROSSED from active to inert because the corpus
// stopped producing its headline. That is the whole shape of this re-record.
// T8 · SHIFT (§858 + §860): 147 → 145 occurrences, and NOTHING ELSE MOVES — rules 26, active 16,
// inert 10, distinctValues 66 all hold. ⭐ No rule crossed in either direction, so
// KNOWN_INERT_HEADLINE_REWRITES needs no new row and this re-record required NO new inert-row
// authority ("New inert rows require authority" — none is claimed here). Verified by deriving the
// live zero-count identity set and comparing it to the declared one: identical, 10 of 10.
// WAR LANDING (§876): 66 → 63 distinct and 145 → 144 occurrences, and again NOTHING ELSE MOVES —
// rules 26, active 16, inert 10 all hold. ⭐ NO RULE CROSSED IN EITHER DIRECTION for the second
// re-record running, so `KNOWN_INERT_HEADLINE_REWRITES` needs no new row and NO NEW INERT-ROW
// AUTHORITY IS CLAIMED HERE. Verified the way T8 verified it, by deriving the live zero-count
// identity set and comparing it to the declared one: identical, 10 of 10.
// SIX OF THE 26 RULES MOVED, NAMED: `may emerge` 3/4 → 3/7, `may exploit` 3/6 → 2/5,
// `may intensify` 2/4 → 1/2, `may reform` 23/50 → 23/49, `may suppress` 6/12 → 5/11, `may take
// hold` 5/18 → 5/19. The three that lose a spelling are the −3 distinct; the occurrences net to
// −1. Every one of them is an upheaval-adjacent verb, which is `5a529f100` read off the registry.
// 2026-10-01 (the urban band + the druid rulings): 26/16/10/63/145 → 26/15/11/59/137. THREE RULES CROSS, NAMED, and the chair
// claims the inert-row authority ("New inert rows require authority", ODQ §271) under the owner's "I defer all judgment to
// you": `may intensify` and `may press a challenge to the government` go INERT (their homes left the re-dealt year), and
// `may fall` goes ACTIVE through a second seam, a TIER DEMOTION headline ("Llanton may fall to hamlet", tier_change), not the
// population decline WAVE P4 gated, so its known-inert row leaves the list below.
// 2026-10-02 (THE VOICE PROGRAM wave 1): 26/15/11/59/137 → 26/0/26/0/0. EVERY RULE IS INERT, and by construction rather
// than by the corpus's luck: each live producer writes its own applied twin, so the de-hedger reaches only proposals
// persisted before the program. The rules are KEPT for exactly those (THE PROMISE). The chair claims the inert-row
// authority ("New inert rows require authority", ODQ §271) under the owner's "I leave all judgment to you", and every
// row's reason below is re-written to name its producer's deed form.
const REWRITE_TOTALS = Object.freeze({ rules: 26, activeRules: 0, inertRules: 26, distinctValues: 0, occurrences: 0 });

export const KNOWN_INERT_HEADLINE_REWRITES = Object.freeze([
  { source: '\\bmay bargain\\b', flags: '', replacement: 'bargains', reason: "THE HERALD SPEAKS IN DEEDS (the owner, 2026-10-02; the Voice Program wave 1): npcAgency.js::candidateForAction (heraldDeeds.js UNTARGETED_NPC_DEEDS) writes its own under-way headline and its applied twin, so no new outcome reaches this rule; it is KEPT for proposals persisted before the program, whose \"may bargain\" headline still needs its applied twin (THE PROMISE: lived history is immutable)." },
  { source: '\\bmay be depleted\\b', flags: '', replacement: 'depleted', reason: "THE HERALD SPEAKS IN DEEDS (the owner, 2026-10-02; the Voice Program wave 1): tierResourceDynamics.js's resource-depletion candidate writes its own under-way headline and its applied twin, so no new outcome reaches this rule; it is KEPT for proposals persisted before the program, whose \"may be depleted\" headline still needs its applied twin (THE PROMISE: lived history is immutable)." },
  { source: '\\bmay become\\b', flags: '', replacement: 'becomes', reason: "THE HERALD SPEAKS IN DEEDS (the owner, 2026-10-02; the Voice Program wave 1): relationshipRuleHelpers.js::candidateBase (heraldDeeds.js RELATIONSHIP_TURNS) writes its own under-way headline and its applied twin, so no new outcome reaches this rule; it is KEPT for proposals persisted before the program, whose \"may become\" headline still needs its applied twin (THE PROMISE: lived history is immutable)." },
  { source: '\\bmay close its doors\\b', flags: '', replacement: 'closes its doors', reason: "THE HERALD SPEAKS IN DEEDS (the owner, 2026-10-02; the Voice Program wave 1): institutionLifecycle.js's institution-closure candidate writes its own under-way headline and its applied twin, so no new outcome reaches this rule; it is KEPT for proposals persisted before the program, whose \"may close its doors\" headline still needs its applied twin (THE PROMISE: lived history is immutable)." },
  { source: '\\bmay defect\\b', flags: '', replacement: 'defects', reason: "THE HERALD SPEAKS IN DEEDS (the owner, 2026-10-02; the Voice Program wave 1): npcAgency.js::candidateForAction (heraldDeeds.js UNTARGETED_NPC_DEEDS) writes its own under-way headline and its applied twin, so no new outcome reaches this rule; it is KEPT for proposals persisted before the program, whose \"may defect\" headline still needs its applied twin (THE PROMISE: lived history is immutable)." },
  { source: '\\bmay emerge\\b', flags: '', replacement: 'emerges', reason: "THE HERALD SPEAKS IN DEEDS (the owner, 2026-10-02; the Voice Program wave 1): stressors.js's stressor-birth candidate writes its own under-way headline and its applied twin, so no new outcome reaches this rule; it is KEPT for proposals persisted before the program, whose \"may emerge\" headline still needs its applied twin (THE PROMISE: lived history is immutable)." },
  { source: '\\bmay exploit\\b', flags: '', replacement: 'exploits', reason: "THE HERALD SPEAKS IN DEEDS (the owner, 2026-10-02; the Voice Program wave 1): npcAgency.js::candidateForAction (heraldDeeds.js UNTARGETED_NPC_DEEDS) writes its own under-way headline and its applied twin, so no new outcome reaches this rule; it is KEPT for proposals persisted before the program, whose \"may exploit\" headline still needs its applied twin (THE PROMISE: lived history is immutable)." },
  { source: '\\bmay expose\\b', flags: '', replacement: 'exposes', reason: "THE HERALD SPEAKS IN DEEDS (the owner, 2026-10-02; the Voice Program wave 1): npcAgency.js::candidateForAction (heraldDeeds.js TARGETED_NPC_DEEDS / UNTARGETED_NPC_DEEDS) writes its own under-way headline and its applied twin, so no new outcome reaches this rule; it is KEPT for proposals persisted before the program, whose \"may expose\" headline still needs its applied twin (THE PROMISE: lived history is immutable)." },
  { source: '\\bmay fall\\b', flags: '', replacement: 'falls', reason: "THE HERALD SPEAKS IN DEEDS (the owner, 2026-10-02; the Voice Program wave 1): tierResourceDynamics.js::tierCandidate and populationDynamics.js::populationCandidate writes its own under-way headline and its applied twin, so no new outcome reaches this rule; it is KEPT for proposals persisted before the program, whose \"may fall\" headline still needs its applied twin (THE PROMISE: lived history is immutable)." },
  { source: '\\bmay grow\\b', flags: '', replacement: 'grows', reason: "THE HERALD SPEAKS IN DEEDS (the owner, 2026-10-02; the Voice Program wave 1): populationDynamics.js::populationCandidate writes its own under-way headline and its applied twin, so no new outcome reaches this rule; it is KEPT for proposals persisted before the program, whose \"may grow\" headline still needs its applied twin (THE PROMISE: lived history is immutable)." },
  { source: '\\bmay hoard\\b', flags: '', replacement: 'hoards', reason: "THE HERALD SPEAKS IN DEEDS (the owner, 2026-10-02; the Voice Program wave 1): npcAgency.js::candidateForAction (heraldDeeds.js UNTARGETED_NPC_DEEDS) writes its own under-way headline and its applied twin, so no new outcome reaches this rule; it is KEPT for proposals persisted before the program, whose \"may hoard\" headline still needs its applied twin (THE PROMISE: lived history is immutable)." },
  { source: '\\bmay intensify\\b', flags: '', replacement: 'intensifies', reason: "THE HERALD SPEAKS IN DEEDS (the owner, 2026-10-02; the Voice Program wave 1): stressors.js's stressor-escalation candidate writes its own under-way headline and its applied twin, so no new outcome reaches this rule; it is KEPT for proposals persisted before the program, whose \"may intensify\" headline still needs its applied twin (THE PROMISE: lived history is immutable)." },
  { source: '\\bmay mobilize\\b', flags: '', replacement: 'mobilizes', reason: "THE HERALD SPEAKS IN DEEDS (the owner, 2026-10-02; the Voice Program wave 1): npcAgency.js::candidateForAction (heraldDeeds.js UNTARGETED_NPC_DEEDS) writes its own under-way headline and its applied twin, so no new outcome reaches this rule; it is KEPT for proposals persisted before the program, whose \"may mobilize\" headline still needs its applied twin (THE PROMISE: lived history is immutable)." },
  { source: '\\bmay press a challenge to the government\\b', flags: '', replacement: 'presses a challenge to the government', reason: "THE HERALD SPEAKS IN DEEDS (the owner, 2026-10-02; the Voice Program wave 1): factionCompetition.js FACTION_VERB_PHRASES.faction_government_challenge writes its own under-way headline and its applied twin, so no new outcome reaches this rule; it is KEPT for proposals persisted before the program, whose \"may press a challenge to the government\" headline still needs its applied twin (THE PROMISE: lived history is immutable)." },
  { source: '\\bmay protect\\b', flags: '', replacement: 'protects', reason: "THE HERALD SPEAKS IN DEEDS (the owner, 2026-10-02; the Voice Program wave 1): npcAgency.js::candidateForAction (heraldDeeds.js UNTARGETED_NPC_DEEDS) writes its own under-way headline and its applied twin, so no new outcome reaches this rule; it is KEPT for proposals persisted before the program, whose \"may protect\" headline still needs its applied twin (THE PROMISE: lived history is immutable)." },
  { source: '\\bmay raise a\\b', flags: '', replacement: 'raises a', reason: "THE HERALD SPEAKS IN DEEDS (the owner, 2026-10-02; the Voice Program wave 1): institutionLifecycle.js's institution-build candidate writes its own under-way headline and its applied twin, so no new outcome reaches this rule; it is KEPT for proposals persisted before the program, whose \"may raise a\" headline still needs its applied twin (THE PROMISE: lived history is immutable)." },
  { source: '\\bmay recover\\b', flags: '', replacement: 'recovering', reason: "THE HERALD SPEAKS IN DEEDS (the owner, 2026-10-02; the Voice Program wave 1): tierResourceDynamics.js's resource-recovery candidate writes its own under-way headline and its applied twin, so no new outcome reaches this rule; it is KEPT for proposals persisted before the program, whose \"may recover\" headline still needs its applied twin (THE PROMISE: lived history is immutable)." },
  { source: '\\bmay reform\\b', flags: '', replacement: 'reforms', reason: "THE HERALD SPEAKS IN DEEDS (the owner, 2026-10-02; the Voice Program wave 1): npcAgency.js::candidateForAction (heraldDeeds.js UNTARGETED_NPC_DEEDS) writes its own under-way headline and its applied twin, so no new outcome reaches this rule; it is KEPT for proposals persisted before the program, whose \"may reform\" headline still needs its applied twin (THE PROMISE: lived history is immutable)." },
  { source: '\\bmay rise\\b', flags: '', replacement: 'rises', reason: "THE HERALD SPEAKS IN DEEDS (the owner, 2026-10-02; the Voice Program wave 1): tierResourceDynamics.js::tierCandidate and relationshipRulesCore.js's vassal-rebellion candidate writes its own under-way headline and its applied twin, so no new outcome reaches this rule; it is KEPT for proposals persisted before the program, whose \"may rise\" headline still needs its applied twin (THE PROMISE: lived history is immutable)." },
  { source: '\\bmay sabotage\\b', flags: '', replacement: 'sabotages', reason: "THE HERALD SPEAKS IN DEEDS (the owner, 2026-10-02; the Voice Program wave 1): npcAgency.js::candidateForAction (heraldDeeds.js TARGETED_NPC_DEEDS / UNTARGETED_NPC_DEEDS) writes its own under-way headline and its applied twin, so no new outcome reaches this rule; it is KEPT for proposals persisted before the program, whose \"may sabotage\" headline still needs its applied twin (THE PROMISE: lived history is immutable)." },
  { source: '\\bmay seek promotion\\b', flags: '', replacement: 'seeks promotion', reason: "THE HERALD SPEAKS IN DEEDS (the owner, 2026-10-02; the Voice Program wave 1): npcAgency.js::candidateForAction (heraldDeeds.js UNTARGETED_NPC_DEEDS) writes its own under-way headline and its applied twin, so no new outcome reaches this rule; it is KEPT for proposals persisted before the program, whose \"may seek promotion\" headline still needs its applied twin (THE PROMISE: lived history is immutable)." },
  { source: '\\bmay shift\\b', flags: '', replacement: 'shifts', reason: "THE HERALD SPEAKS IN DEEDS (the owner, 2026-10-02; the Voice Program wave 1): relationshipRuleHelpers.js::candidateBase (heraldDeeds.js RELATIONS_MOVE) writes its own under-way headline and its applied twin, so no new outcome reaches this rule; it is KEPT for proposals persisted before the program, whose \"may shift\" headline still needs its applied twin (THE PROMISE: lived history is immutable)." },
  { source: '\\bmay spread\\b', flags: '', replacement: 'spreads', reason: "THE HERALD SPEAKS IN DEEDS (the owner, 2026-10-02; the Voice Program wave 1): stressors.js's stressor-spread candidate writes its own under-way headline and its applied twin, so no new outcome reaches this rule; it is KEPT for proposals persisted before the program, whose \"may spread\" headline still needs its applied twin (THE PROMISE: lived history is immutable)." },
  { source: '\\bmay suppress\\b', flags: '', replacement: 'suppresses', reason: "THE HERALD SPEAKS IN DEEDS (the owner, 2026-10-02; the Voice Program wave 1): npcAgency.js::candidateForAction (heraldDeeds.js TARGETED_NPC_DEEDS / UNTARGETED_NPC_DEEDS) writes its own under-way headline and its applied twin, so no new outcome reaches this rule; it is KEPT for proposals persisted before the program, whose \"may suppress\" headline still needs its applied twin (THE PROMISE: lived history is immutable)." },
  { source: '\\bmay take hold\\b', flags: '', replacement: 'takes hold', reason: "THE HERALD SPEAKS IN DEEDS (the owner, 2026-10-02; the Voice Program wave 1): candidateEvents.js::pressureConditionCandidate (heraldDeeds.js CONDITION_DEEDS) writes its own under-way headline and its applied twin, so no new outcome reaches this rule; it is KEPT for proposals persisted before the program, whose \"may take hold\" headline still needs its applied twin (THE PROMISE: lived history is immutable)." },
  { source: '\\bmay undermine\\b', flags: '', replacement: 'undermines', reason: "THE HERALD SPEAKS IN DEEDS (the owner, 2026-10-02; the Voice Program wave 1): npcAgency.js::candidateForAction (heraldDeeds.js TARGETED_NPC_DEEDS / UNTARGETED_NPC_DEEDS) writes its own under-way headline and its applied twin, so no new outcome reaches this rule; it is KEPT for proposals persisted before the program, whose \"may undermine\" headline still needs its applied twin (THE PROMISE: lived history is immutable)." },
].map((row) => Object.freeze(row)));

const codepoint = (left, right) => (left < right ? -1 : left > right ? 1 : 0);
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const exactKeys = (value, keys, label) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)
      || !same(Object.keys(value).sort(codepoint), [...keys].sort(codepoint))) throw new Error(`${label} must have exactly keys ${keys.join(', ')}`);
  return value;
};
const nonblank = (value, label, mustBeTrimmed = false) => {
  if (typeof value !== 'string' || !value.trim() || (mustBeTrimmed && value !== value.trim())) throw new Error(`${label} must be a nonblank${mustBeTrimmed ? ' trimmed' : ''} string`);
  return value;
};
const safeCount = (value, label) => {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error(`${label} must be a non-negative safe integer`);
  return value;
};
const addressIdentity = (row) => `${row.home}|${row.field}|${row.voiceClass}`;
const rewriteIdentity = (row) => `${row.source}|${row.flags}|${row.replacement}`;
const rawAddress = (row) => `${row.rootOrdinal}|${row.pulseIndex}|${row.field}|${row.outcomeIndex}`;
const compareRaw = (left, right) => left.pulseIndex - right.pulseIndex || codepoint(left.field, right.field)
  || left.outcomeIndex - right.outcomeIndex || codepoint(left.headline, right.headline);

function validateRows(rows, keys, identityOf, label, validate) {
  if (!Array.isArray(rows)) throw new Error(`${label} must be an array`);
  let previous = null;
  return rows.map((raw, index) => {
    const row = exactKeys(raw, keys, `${label}[${index}]`); validate(row, `${label}[${index}]`);
    const identity = identityOf(row);
    if (previous !== null && codepoint(previous, identity) >= 0) throw new Error(`${label} identities must be unique and codepoint-sorted: ${identity}`);
    previous = identity; return row;
  });
}
const validateAddressRows = (rows, label = 'address rows') => validateRows(rows, ADDRESS_KEYS, addressIdentity, label, (row, at) => {
  for (const key of ADDRESS_KEYS.slice(0, 3)) nonblank(row[key], `${at}.${key}`, true);
  if (!['headline', 'summary'].includes(row.field) || !['indicative', 'prospective'].includes(row.voiceClass)) throw new Error(`${at} is outside the closed address vocabulary`);
  if (safeCount(row.distinctValues, `${at}.distinctValues`) < 1 || safeCount(row.occurrences, `${at}.occurrences`) < row.distinctValues) throw new Error(`${at} carries impossible address counts`);
});
const validateRewriteRows = (rows, label = 'rewrite rows') => validateRows(rows, REWRITE_KEYS, rewriteIdentity, label, (row, at) => {
  nonblank(row.source, `${at}.source`, true); nonblank(row.replacement, `${at}.replacement`, true);
  if (row.flags !== '') throw new Error(`${at}.flags must be empty`);
  safeCount(row.distinctValues, `${at}.distinctValues`); safeCount(row.occurrences, `${at}.occurrences`);
  if ((row.distinctValues === 0) !== (row.occurrences === 0) || row.occurrences < row.distinctValues) throw new Error(`${at} carries split or impossible liveness counts`);
});
const validateInertRows = (rows, label = 'knownInert') => validateRows(rows, INERT_KEYS, rewriteIdentity, label, (row, at) => {
  nonblank(row.source, `${at}.source`, true); nonblank(row.replacement, `${at}.replacement`, true); nonblank(row.reason, `${at}.reason`, true);
  if (row.flags !== '') throw new Error(`${at}.flags must be empty`);
});

export function deriveNewsAddressRows(introductions) {
  if (!Array.isArray(introductions) || introductions.length === 0) throw new Error('introduced entries must be a nonempty array');
  const buckets = new Map();
  for (const [index, entry] of introductions.entries()) {
    const fields = entry?.fields;
    if (!fields || typeof fields !== 'object') throw new Error(`introduction ${index} has no fields`);
    for (const key of ['kind', 'headline', 'summary']) nonblank(fields[key], `introduction ${index}.${key}`);
    if (!Object.hasOwn(fields, 'impactKind') || fields.impactKind === undefined) throw new Error(`introduction ${index}.impactKind must be present`);
    const impactToken = fields.impactKind === null ? 'null' : nonblank(fields.impactKind, `introduction ${index}.impactKind`);
    if (fields.kind.includes('|') || impactToken.includes('|') || fields.impactKind === 'null') throw new Error(`introduction ${index} has a colliding home token`);
    const home = `${fields.kind}|${impactToken}`;
    for (const field of ['headline', 'summary']) {
      const value = fields[field]; const voiceClass = (field === 'headline' ? /\bmay\b/ : /\bcan advance through\b/).test(value) ? 'prospective' : 'indicative'; const key = `${home}|${field}`;
      if (!buckets.has(key)) buckets.set(key, { home, field, voiceClass, values: new Set(), occurrences: 0 });
      const bucket = buckets.get(key); if (bucket.voiceClass !== voiceClass) throw new Error(`mixed voice classes at ${key}: ${bucket.voiceClass} and ${voiceClass}`);
      bucket.values.add(value); bucket.occurrences += 1;
    }
  }
  const rows = [...buckets.values()].map((bucket) => ({ home: bucket.home, field: bucket.field, voiceClass: bucket.voiceClass, distinctValues: bucket.values.size, occurrences: bucket.occurrences }))
    .sort((left, right) => codepoint(addressIdentity(left), addressIdentity(right)));
  return validateAddressRows(rows);
}

export function addressRowsSha256(rows) {
  return createHash('sha256').update(JSON.stringify(validateAddressRows(rows))).digest('hex');
}

function validateRawRows(rows, label = 'persisted headline rows') {
  if (!Array.isArray(rows)) throw new Error(`${label} must be an array`);
  const addresses = new Set(); let previous = null;
  return rows.map((raw, index) => {
    const row = exactKeys(raw, RAW_KEYS, `${label}[${index}]`);
    safeCount(row.rootOrdinal, `${label}[${index}].rootOrdinal`); safeCount(row.pulseIndex, `${label}[${index}].pulseIndex`); safeCount(row.outcomeIndex, `${label}[${index}].outcomeIndex`); nonblank(row.headline, `${label}[${index}].headline`);
    if (!Object.hasOwn(LANES, row.field)) throw new Error(`${label}[${index}].field is not a persisted liveness lane`);
    if (row.outcomeIndex >= LANES[row.field]) throw new Error(`${label}[${index}] breaches the ${row.field} cap ${LANES[row.field]}`);
    if (previous && compareRaw(previous, row) >= 0) throw new Error(`${label} must use numeric pulse/field/outcome/headline order`);
    const address = rawAddress(row); if (addresses.has(address)) throw new Error(`${label} repeats typed address ${address}`);
    addresses.add(address); previous = row; return row;
  });
}

export function selectPersistedHeadlineRows(scalarRows) {
  if (!Array.isArray(scalarRows)) throw new Error('scalar observations must be an array');
  const selected = scalarRows.filter((row) => row?.root === 'worldState' && row.path?.length === 5
    && row.path[0]?.kind === 'field' && row.path[0].value === 'pulseHistory' && row.path[1]?.kind === 'index'
    && row.path[2]?.kind === 'field' && Object.hasOwn(LANES, row.path[2].value) && row.path[3]?.kind === 'index'
    && row.path[4]?.kind === 'field' && row.path[4].value === 'headline');
  if (selected.length === 0) throw new Error('persisted headline scalar set is empty');
  const rows = selected.map((row, index) => {
    if (!Number.isSafeInteger(row.rootOrdinal) || row.rootOrdinal < 0 || !Number.isSafeInteger(row.path[1].value) || row.path[1].value < 0 || !Number.isSafeInteger(row.path[3].value) || row.path[3].value < 0) throw new Error(`malformed persisted headline row ${index}: ${JSON.stringify(row)}`);
    nonblank(row.value, `persisted headline row ${index}.value`);
    return { rootOrdinal: row.rootOrdinal, pulseIndex: row.path[1].value, field: row.path[2].value, outcomeIndex: row.path[3].value, headline: row.value };
  }).sort(compareRaw);
  const roots = [...new Set(rows.map((row) => row.rootOrdinal))]; const pulses = [...new Set(rows.map((row) => row.pulseIndex))].sort((a, b) => a - b);
  if (roots.length !== 1 || !same(pulses, [...Array(CORPUS.pulseRoots).keys()])) throw new Error(`persisted headline roots/pulses drifted: roots=${JSON.stringify(roots)} pulses=${JSON.stringify(pulses)}`);
  for (const field of Object.keys(LANES)) for (const pulse of pulses) {
    const indexes = rows.filter((row) => row.field === field && row.pulseIndex === pulse).map((row) => row.outcomeIndex);
    if (indexes.length > LANES[field] || !same(indexes, [...Array(indexes.length).keys()])) throw new Error(`${field} pulse ${pulse} violates contiguity or cap ${LANES[field]}`);
  }
  return validateRawRows(rows);
}

function validateRegistry(registry) {
  if (!Array.isArray(registry) || registry.length === 0) throw new Error('headline rewrite registry must be a nonempty array');
  const seen = new Map();
  return registry.map((entry, index) => {
    if (!Array.isArray(entry) || entry.length !== 2 || !(entry[0] instanceof RegExp)) throw new Error(`headline rewrite ${index} must be [RegExp, string]`);
    const [pattern, replacement] = entry; nonblank(replacement, `headline rewrite ${index} replacement`, true);
    if (pattern.flags !== '') throw new Error(`headline rewrite ${index} flags must be empty`);
    const sourceKey = `${pattern.source}|${pattern.flags}`; if (seen.has(sourceKey)) throw new Error(`duplicate or conflicting headline rewrite source ${sourceKey}: ${seen.get(sourceKey)} / ${replacement}`);
    seen.set(sourceKey, replacement); return { pattern, source: pattern.source, flags: pattern.flags, replacement, values: new Set(), occurrences: 0 };
  });
}

export function rawHeadlineLivenessOf(rawRows) {
  const rows = validateRawRows(rawRows); const metrics = (subset) => {
    const prospective = subset.filter((row) => /\bmay\b/.test(row.headline)); const indicative = subset.filter((row) => !/\bmay\b/.test(row.headline));
    return { headlineOccurrences: subset.length, distinctValues: new Set(subset.map((row) => row.headline)).size, prospectiveOccurrences: prospective.length, prospectiveDistinctValues: new Set(prospective.map((row) => row.headline)).size, indicativeOccurrences: indicative.length, indicativeDistinctValues: new Set(indicative.map((row) => row.headline)).size };
  };
  return { pulseRecords: new Set(rows.map((row) => row.pulseIndex)).size, lanes: Object.keys(LANES).map((field) => ({ field, capPerPulse: LANES[field], ...metrics(rows.filter((row) => row.field === field)) })), union: metrics(rows) };
}

export function analyzeHeadlineRewriteLiveness(rawRows, registry) {
  const rows = validateRawRows(rawRows); const rules = validateRegistry(registry); const gaps = []; const overlaps = []; const indicativeMatches = [];
  for (const row of rows) {
    const matches = rules.filter((rule) => rule.pattern.test(row.headline)); const location = `${row.pulseIndex}/${row.field}/${row.outcomeIndex}`;
    if (!/\bmay\b/.test(row.headline)) { if (matches.length) indicativeMatches.push({ location, headline: row.headline, matches: matches.map(rewriteIdentity) }); continue; }
    if (matches.length === 0) gaps.push({ location, headline: row.headline }); if (matches.length > 1) overlaps.push({ location, headline: row.headline, matches: matches.map(rewriteIdentity) });
    if (matches.length === 1) { matches[0].values.add(row.headline); matches[0].occurrences += 1; }
  }
  const measured = rules.map((rule) => ({ source: rule.source, flags: rule.flags, replacement: rule.replacement, distinctValues: rule.values.size, occurrences: rule.occurrences }))
    .sort((left, right) => codepoint(rewriteIdentity(left), rewriteIdentity(right))); const activeRules = measured.filter((row) => row.occurrences > 0).length;
  return { rows: validateRewriteRows(measured), totals: { rules: measured.length, activeRules, inertRules: measured.length - activeRules, distinctValues: measured.reduce((sum, row) => sum + row.distinctValues, 0), occurrences: measured.reduce((sum, row) => sum + row.occurrences, 0) }, gaps, overlaps, indicativeMatches };
}

export function measureHeadlineRewriteLiveness(rawRows, registry) {
  const result = analyzeHeadlineRewriteLiveness(rawRows, registry); const failures = [...result.gaps.map((row) => `uncovered ${row.location}: ${row.headline}`), ...result.overlaps.map((row) => `overlap ${row.location}: ${row.headline}`), ...result.indicativeMatches.map((row) => `indicative match ${row.location}: ${row.headline}`)];
  if (failures.length) throw new Error(`headline rewrite liveness failed:\n${failures.join('\n')}`); return result;
}

const addressTotalsOf = (rows) => ({ homes: new Set(rows.map((row) => row.home)).size, fields: new Set(rows.map((row) => row.field)).size, identities: rows.length, prospectiveIdentities: rows.filter((row) => row.voiceClass === 'prospective').length, indicativeIdentities: rows.filter((row) => row.voiceClass === 'indicative').length, distinctValues: rows.reduce((sum, row) => sum + row.distinctValues, 0), occurrences: rows.reduce((sum, row) => sum + row.occurrences, 0) });
export function validateNewsHeadlineBaseline(value) {
  exactKeys(value, ['schemaVersion', 'corpus', 'addressTotality', 'rewriteLiveness'], 'baseline'); if (value.schemaVersion !== 1) throw new Error('baseline.schemaVersion must equal 1');
  exactKeys(value.corpus, Object.keys(CORPUS), 'baseline.corpus'); if (!same(value.corpus, CORPUS) || value.corpus.introductions - value.corpus.retirements !== value.corpus.finalEntries) throw new Error('baseline corpus drifted or failed conservation');
  exactKeys(value.addressTotality, ['rows', 'rowsSha256', 'totals'], 'baseline.addressTotality'); const addresses = validateAddressRows(value.addressTotality.rows, 'baseline.addressTotality.rows'); nonblank(value.addressTotality.rowsSha256, 'baseline.addressTotality.rowsSha256', true);
  if (value.addressTotality.rowsSha256 !== addressRowsSha256(addresses) || !same(value.addressTotality.totals, ADDRESS_TOTALS) || !same(addressTotalsOf(addresses), ADDRESS_TOTALS)) throw new Error('baseline address digest or totals drifted');
  exactKeys(value.rewriteLiveness, ['raw', 'rows', 'totals', 'knownInert'], 'baseline.rewriteLiveness'); if (!same(value.rewriteLiveness.raw, RAW_LIVENESS)) throw new Error('baseline raw liveness denominator drifted');
  const rewrites = validateRewriteRows(value.rewriteLiveness.rows, 'baseline.rewriteLiveness.rows'); const activeRules = rewrites.filter((row) => row.occurrences > 0).length; const totals = { rules: rewrites.length, activeRules, inertRules: rewrites.length - activeRules, distinctValues: rewrites.reduce((sum, row) => sum + row.distinctValues, 0), occurrences: rewrites.reduce((sum, row) => sum + row.occurrences, 0) };
  if (!same(value.rewriteLiveness.totals, REWRITE_TOTALS) || !same(totals, REWRITE_TOTALS)) throw new Error('baseline rewrite totals drifted'); const inert = validateInertRows(value.rewriteLiveness.knownInert, 'baseline.rewriteLiveness.knownInert');
  if (!same(inert, KNOWN_INERT_HEADLINE_REWRITES) || !same(inert.map(rewriteIdentity), rewrites.filter((row) => row.occurrences === 0).map(rewriteIdentity))) throw new Error('known-inert reasons disagree with zero-count rewrite identities'); return value;
}

function compareRows(liveRows, frozenRows, validate, identityOf, label) {
  const live = validate(liveRows, `live ${label}`); const frozen = validate(frozenRows, `frozen ${label}`); const left = new Map(live.map((row) => [identityOf(row), row])); const right = new Map(frozen.map((row) => [identityOf(row), row])); const failures = [];
  for (const id of new Set([...left.keys(), ...right.keys()])) if (!right.has(id)) failures.push(`new ${label} ${id}: ${JSON.stringify(left.get(id))}`); else if (!left.has(id)) failures.push(`vanished ${label} ${id}: ${JSON.stringify(right.get(id))}`); else if (!same(left.get(id), right.get(id))) failures.push(`changed ${label} ${id}: live=${JSON.stringify(left.get(id))} frozen=${JSON.stringify(right.get(id))}`);
  if (failures.length) throw new Error(`${label} moved:\n${failures.sort(codepoint).join('\n')}`); return true;
}
export const compareNewsAddressRows = (live, frozen) => compareRows(live, frozen, validateAddressRows, addressIdentity, 'address row');
export const compareHeadlineRewriteRows = (live, frozen) => compareRows(live, frozen, validateRewriteRows, rewriteIdentity, 'rewrite row');
