// D-RN-r3 probe (lane D-RN-r3, Opus 5.5, 2026-10-18). READ-ONLY imports of master 81f1cd963
// (the detached worktree named in briefs/RESEARCH-COMMON.md). Never edits the worktree; never
// runs the test suite; never touches git. Output: r3Probe.out.json beside this file.
//
// A. RN-V2 — the heard pass's re-read key. Re-runs the verifier's convicting merge on the REAL
//    record shape (content.magnitude; PT-4's content.doerRef), shows the round-2 detector (the
//    parts mask `ver` alone) misses the better telling, and shows the round-3 detector (the
//    TRIPLE ver · mag · doerRef) catches it, moves a swapped doer's one term, and is idempotent.
// B. RN-V7 — the verdict deed's scope. Reads the landed verdict stamps (the floor), the hop
//    budgets, the landed belief fade against RN's one decay law on two half-life bands, and
//    the stamp clamp on the notoriety projection.
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const M = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963/src/domain';
const { mergeArrival, maxHopsFor, magnitudeBandOf } = await import(`${M}/spatial/rumorNetwork.js`);
const { RUMOR_DETAIL_THRESHOLD, RUMOR_OUTLINE_THRESHOLD, RUMOR_VAGUE_THRESHOLD } = await import(`${M}/display/settlementRumors.js`);
const { decayTowardNeutral, HALF_LIFE_WEEKS } = await import(`${M}/worldPulse/bandedStock.js`);
const { beliefFadeSteps } = await import(`${M}/worldPulse/npcCirculationBelief.js`);
const { NOTORIETY_BANDS, notorietyRank } = await import(`${M}/worldPulse/npcLedgerFacets.js`);
const { verdictReputationFacets, VERDICTS } = await import(`${M}/worldPulse/npcVerdictTable.js`);
const { NPC_CONSEQUENCES_TUNING } = await import(`${M}/worldPulse/npcConsequencesTuning.js`);

const out = {};

// ── A. RN-V2 ────────────────────────────────────────────────────────────────
// PT §11.1's part thresholds (DRAFT, PT's): backing 0.85 · reason 0.85 (spoken) · size OUTLINE ·
// doer VAGUE; act always (the "trouble near X" floor). The mask is one bit per part.
const PARTS = ['act', 'size', 'reason', 'proof', 'backing', 'doer'];
function visibleMask(c01, proof = 'spoken') {
  const reasonAt = proof === 'shown' ? RUMOR_DETAIL_THRESHOLD : proof === 'unspoken' ? Infinity : 0.85;
  const vis = {
    act: true,
    size: c01 >= RUMOR_OUTLINE_THRESHOLD,
    reason: c01 >= reasonAt,
    proof: c01 >= reasonAt,
    backing: c01 >= 0.85,
    doer: c01 >= RUMOR_VAGUE_THRESHOLD,
  };
  return PARTS.reduce((m, p, i) => (vis[p] ? m | (1 << i) : m), 0);
}
const base = {
  eventRef: 'deed:deed.0001', eventTick: 1, carrier: 'trade', lineageIds: ['deed:deed.0001', 'o@kell'],
  corroborationRoots: ['o@kell'], provenance: { originId: 'kell', relayIds: [] }, framing: ['merchant'],
  significance: 'major', score: 80, relayedTick: null,
};
const existing = {
  ...base, arrivalTick: 5, hopCount: 2, completeness01: 0.765, accuracy01: 0.7,
  content: { what: 'party_impact', whereId: 'kell', scope: 'regional', magnitude: 2, partyIds: ['kell'], doerRef: 'party' },
};
// 0.765 → 0.82: both inside [DETAIL 0.75, PT's reason/backing 0.85) — the SAME parts mask, as the
// verifier's case (it used the display band alone); the better telling still wins on completeness.
const better = {
  ...base, lineageIds: ['deed:deed.0001', 'o@tolle'], arrivalTick: 7, hopCount: 1, completeness01: 0.82, accuracy01: 1,
  content: { what: 'party_impact', whereId: 'kell', scope: 'regional', magnitude: 3, partyIds: ['kell'], doerRef: 'party' },
};
const merged = mergeArrival(existing, better);
// The stored term as round 2 wrote it (subject = the heard doer's key).
const storedTerm = { deedId: 'deed.0001', ver: visibleMask(existing.completeness01), mag: existing.content.magnitude, tick: 5 };
const versionOf = (rec) => ({ ver: visibleMask(rec.completeness01), mag: rec.content.magnitude, doerKey: (visibleMask(rec.completeness01) & (1 << 5)) ? rec.content.doerRef : null });
const v = versionOf(merged);
const round2Detects = v.ver !== storedTerm.ver;
const round3Detects = (stored, subjectKey, version) => version.ver !== stored.ver || version.mag !== stored.mag || version.doerKey !== subjectKey;
out.A1_convictingMergeRealShape = {
  mergedMagnitude: merged.content.magnitude, mergedArrivalTick: merged.arrivalTick,
  storedVer: storedTerm.ver, mergedVer: v.ver, sameMask: v.ver === storedTerm.ver,
  round2_verOnly_reRead: round2Detects, round3_triple_reRead: round3Detects(storedTerm, 'party', v),
};

// The doer swap (PT-4): a better telling names another doer; the one term MOVES.
function writeHeard(entries, holderSubjects, deedId, version, reading, backerKey = null) {
  // entries: { [subjectKey]: { terms: [...] } } for ONE holder. The doer term for a deed is the
  // holder's term carrying that deedId under any subject other than the deed's backer key.
  const next = JSON.parse(JSON.stringify(entries));
  for (const subj of Object.keys(next).sort()) {
    if (subj === backerKey) continue;
    next[subj].terms = next[subj].terms.filter((t) => t.deedId !== deedId);
    if (!next[subj].terms.length) delete next[subj];
  }
  if (version.doerKey) {
    const e = next[version.doerKey] || { terms: [] };
    e.terms.push({ deedId, ver: version.ver, mag: version.mag, tick: reading.tick, sev: reading.sev, sign: reading.sign });
    next[version.doerKey] = e;
  }
  return next;
}
const holderBefore = { party: { terms: [{ ...storedTerm, sev: 0.2, sign: -1 }] } };
const swapped = { ...better, content: { ...better.content, doerRef: 'p:wnpc_vey' } };
const vs = versionOf(mergeArrival(existing, swapped));
const needsReRead = round3Detects(storedTerm, 'party', vs);
const holderAfter = needsReRead ? writeHeard(holderBefore, [], 'deed.0001', vs, { tick: 7, sev: 0.3, sign: -1 }) : holderBefore;
const termsAfter = Object.values(holderAfter).reduce((n, e) => n + e.terms.filter((t) => t.deedId === 'deed.0001').length, 0);
// Idempotence: the stored term now equals the version; the detector stays quiet.
const stored2 = holderAfter['p:wnpc_vey'].terms[0];
out.A2_doerSwapMovesOneTerm = {
  swappedDoerKey: vs.doerKey, round2_verOnly_reRead: vs.ver !== storedTerm.ver, round3_triple_reRead: needsReRead,
  subjectsAfter: Object.keys(holderAfter), termsForTheDeedAfter: termsAfter,
  idempotentNextTick: !round3Detects(stored2, 'p:wnpc_vey', vs),
};
// A weathered telling below VAGUE shows no doer: no subject, no doer term.
const faint = { ...existing, completeness01: 0.25 };
out.A3_doerInvisibleBelowVague = { mask: visibleMask(0.25), doerKey: versionOf(faint).doerKey, RUMOR_VAGUE_THRESHOLD };

// ── B. RN-V7 ────────────────────────────────────────────────────────────────
// B1. The landed stamps: the verdict table never mints `whispered`.
const npc = { personality: { dominant: 'fair-minded', flaw: 'proud' }, importance: 'minor' };
out.B1_landedVerdictStamps = Object.fromEntries(VERDICTS.map((verdict) => [verdict, {
  firstOffence: verdictReputationFacets({ verdict, compromiseSource: 'none', npc, timesExposed: 0 }).notorietyBand,
  repeat: verdictReputationFacets({ verdict, compromiseSource: 'none', npc, timesExposed: 99 }).notorietyBand,
}]));
out.B1_notorietyBands = NOTORIETY_BANDS;
// B2. The hop budgets the significance buys; the magnitude bands RN §3.1 maps the stamp to.
out.B2_hopBudgets = { major: maxHopsFor({ significance: 'major', score: 80 }), majorRealmShaking: maxHopsFor({ significance: 'major', score: 95 }), notable: maxHopsFor({ significance: 'notable', score: 80 }) };
out.B2_gate = { REJECTION_NOTORIETY_RANK: NPC_CONSEQUENCES_TUNING.REJECTION_NOTORIETY_RANK, infamousRank: notorietyRank('infamous'), knownRank: notorietyRank('known') };
// B3. The pace: weeks a projected scope ordinal (settlement 1 · regional 2 · realm 3) holds each
// rounded step under RN's one decay law, on `a_decade` (the volume's fame band) and `a_year`
// (the ladder's own "a reputation"), against the landed belief fade at the origin.
function stepWeeks(ordinal, band) {
  const steps = [];
  let prev = ordinal;
  for (let w = 0; w <= 3000; w += 1) {
    const r = Math.floor(decayTowardNeutral(ordinal, 0, w, band) + 0.5);
    if (r !== prev) { steps.push({ week: w, to: r }); prev = r; }
    if (r === 0) break;
  }
  return steps;
}
out.B3_halfLifeWeeks = { a_year: HALF_LIFE_WEEKS.a_year, a_decade: HALF_LIFE_WEEKS.a_decade };
out.B3_rnPace = {
  a_decade: { settlement: stepWeeks(1, 'a_decade'), regional: stepWeeks(2, 'a_decade'), realm: stepWeeks(3, 'a_decade') },
  a_year: { settlement: stepWeeks(1, 'a_year'), regional: stepWeeks(2, 'a_year'), realm: stepWeeks(3, 'a_year') },
};
function landedSteps(stamp, delay = 0) {
  const steps = [];
  let prev = notorietyRank(stamp);
  for (let w = 0; w <= 400; w += 1) {
    const { fadeSteps } = beliefFadeSteps({ infoMode: 'perfect_delayed', hopDelayTicks: delay, elapsedTicks: w, observerId: 'o', roamerId: 'r' });
    const rank = Math.max(0, notorietyRank(stamp) - fadeSteps);
    if (rank !== prev) { steps.push({ week: w, to: NOTORIETY_BANDS[rank] }); prev = rank; }
    if (rank === 0) break;
  }
  return steps;
}
out.B3_landedFadeAtOrigin = { known: landedSteps('known'), notorious: landedSteps('notorious'), infamous: landedSteps('infamous') };
out.B3_landedFadeAtDelay6 = { known: landedSteps('known', 6), notorious: landedSteps('notorious', 6) };
// B4. The projection (RN §4.4) and the stamp clamp (RN-V7: the deed may never out-shout the stamp).
const PROJ = { unknown: ['unknown', 'unknown'], settlement: ['whispered', 'whispered'], regional: ['notorious', 'known'], realm: ['infamous', 'known'] };
const project = (scope, bad) => PROJ[scope][bad ? 0 : 1];
const clamp = (band, stamp) => NOTORIETY_BANDS[Math.min(notorietyRank(band), notorietyRank(stamp))];
const CAP = { whispered: 'settlement', known: 'regional', notorious: 'walk', infamous: 'walk' };
out.B4_projection = ['known', 'notorious', 'infamous'].map((stamp) => {
  const walkScopes = ['regional', 'realm'];
  const scopes = CAP[stamp] === 'walk' ? walkScopes : [CAP[stamp]];
  return { stamp, cap: CAP[stamp], cases: scopes.map((scope) => ({ scope, badFace: project(scope, true), clamped: clamp(project(scope, true), stamp), warmTown: clamp(project(scope, false), stamp), strictArmed: notorietyRank(clamp(project(scope, true), stamp)) >= NPC_CONSEQUENCES_TUNING.REJECTION_NOTORIETY_RANK })) };
});
// The round-2 chain the verifier convicted: a `known` jailing (magnitude band 2 ⇒ §3.2 `major`) walking 4 hops.
out.B4_round2Chain = { stamp: 'known', magnitude: 2, significance: 'major (magnitude >= 2; target a court)', hops: maxHopsFor({ significance: 'major', score: 80 }), projectionAtHop4BadFace: project('regional', true), projectionAtRealmBadFace: project('realm', true) };

const here = dirname(fileURLToPath(import.meta.url));
writeFileSync(join(here, 'r3Probe.out.json'), `${JSON.stringify(out, null, 1)}\n`);
console.log(JSON.stringify(out, null, 1));
