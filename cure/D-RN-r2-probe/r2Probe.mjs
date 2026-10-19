// D-RN-r2 probe (read-only imports from the detached master worktree; writes only its own .out.json).
// (a) the lens readings under the REFINED stranger rule (act alone when lens two finds no tie) — the
//     receipt the round-1 REFINED bracket cited wrongly; (b) the TOWN lens on the axes' LANDED bands
//     (lawWord.js :: lawWordFor, conquestDoctrineStage.js :: natureWordFor; HOST-r1-7); (c) the pledge
//     reading with the fell_short clamp; (d) the npc_verdict rows by scandal class (RN-V3) and the
//     notoriety projection's moral column; (e) the party credibility holder: refold vs subtraction (A.1);
//     (f) RN-V1's timing: when a realm deed's fame ring shrinks vs a heard term's own half-life.
const M = process.argv[2];
const { lawWordFor } = await import(`${M}/src/domain/worldPulse/lawWord.js`);
const { natureWordFor } = await import(`${M}/src/domain/worldPulse/conquestDoctrineStage.js`);
const { RELATIONSHIP_DEFAULTS: D } = await import(`${M}/src/domain/worldPulse/relationshipState.js`);
const { NPC_CREDIBILITY_TUNING: T, decayedNpcCredibilityScore, npcCredibilityWeight } =
  await import(`${M}/src/domain/worldPulse/npcCredibility.js`);
const { decayTowardNeutral, halfLifeFactor, HALF_LIFE_WEEKS } = await import(`${M}/src/domain/worldPulse/bandedStock.js`);

const r4 = (x) => Math.round(x * 1e4) / 1e4;
const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
const LABEL_NET = { allied: 0.6, trade_partner: 0.3, patron: 0.2, client: 0.2, vassal: 0.2, neutral: 0,
  criminal_network: -0.2, rival: -0.4, cold_war: -0.6, hostile: -0.8 };
const pairNet = (t) => clamp(LABEL_NET[t] + 0.5 * ((D[t].trust - D[t].trust) - (D[t].resentment - D[t].resentment)), -1, 1);
// DRAFT band centres for the TOWN lens (RN §6.2 r2): the axes read as their landed bands.
const NATURE_CENTRE = { benevolent: 0.17, balanced: 0.5, malicious: 0.83 };
const LAW_CENTRE = { lawless: 0.17, balanced: 0.5, lawful: 0.83 };
const townHolder = (malice01, lawfulness01) => ({
  malice01: NATURE_CENTRE[natureWordFor(malice01)], lawfulness01: LAW_CENTRE[lawWordFor(lawfulness01)],
  aggr01: 0.5, // the town's aggression is NOT read (personalityDrive; H30's chip word is the slot)
  word: natureWordFor(malice01),
});
const lensOne = ({ kind01, law01, force01 }, h, a = 1, b = 0.5, c = 0.4) => {
  const K = kind01 > 0.5 ? Math.max(0, 1 - 2 * h.malice01) : (1 - 2 * h.malice01);
  return a * (kind01 - 0.5) * K + b * (law01 - 0.5) * (2 * h.lawfulness01 - 1) + c * (force01 - 0.5) * (2 * h.aggr01 - 1);
};
const malicious = (h) => (h.word ? h.word === 'malicious' : h.malice01 >= 0.67);
const reading = (deed, h, ties, mu = 0.5) => {
  const one = lensOne(deed, h);
  const tied = ties.filter((x) => x.net !== 0);
  const two = tied.reduce((s, x) => s + x.sign * x.net * (deed.magBand / 3), 0);
  let r = tied.length ? (1 - mu) * one + mu * two : one; // REFINED r1: a stranger judges the act alone
  if (one >= 0 && !malicious(h) && r < 0) r = 0; // the owner's rule
  return { one: r4(one), two: r4(two), reading: r4(r), grudge: r < 0 };
};
const resolve = { kind01: 0.8, law01: 0.5, force01: 0.5, magBand: 3 };
const cruel = { kind01: 0.2, law01: 0.4, force01: 0.6, magBand: 3 };
const out = {};
out.a_persons_continuous = {
  goodNonRival_m02: reading(resolve, { malice01: 0.2, lawfulness01: 0.5, aggr01: 0.5 }, []),
  goodRival_m02: reading(resolve, { malice01: 0.2, lawfulness01: 0.5, aggr01: 0.5 }, [{ sign: 1, net: pairNet('rival') }]),
  maliciousRival_m09: reading(resolve, { malice01: 0.9, lawfulness01: 0.5, aggr01: 0.5 }, [{ sign: 1, net: pairNet('rival') }]),
  maliciousNoTie_m09: reading(resolve, { malice01: 0.9, lawfulness01: 0.5, aggr01: 0.5 }, []),
  cruelByGood_m02: reading(cruel, { malice01: 0.2, lawfulness01: 0.5, aggr01: 0.5 }, []),
  cruelByEvil_m09: reading(cruel, { malice01: 0.9, lawfulness01: 0.5, aggr01: 0.5 }, []),
};
out.b_towns_on_bands = {};
for (const [name, m] of [['benevolent_m020', 0.2], ['benevolent_m030', 0.3], ['balanced_m045', 0.45], ['balanced_m060', 0.6], ['malicious_m070', 0.7], ['malicious_m095', 0.95]]) {
  const h = townHolder(m, 0.5);
  out.b_towns_on_bands[name] = {
    word: h.word,
    resolve_noTie: reading(resolve, h, []),
    resolve_rival: reading(resolve, h, [{ sign: 1, net: pairNet('rival') }]),
    cruel_noTie: reading(cruel, h, []),
  };
}
// (c) the pledge: requester direct; others lens two only; fell_short clamped to <= 0; made_good under the owner's rule
const pledgeOther = (kind, holderNetToRequester, h) => {
  const sign = kind === 'made_good' ? +1 : -1; // helped vs hurt the requester
  let r = sign * holderNetToRequester * (1 / 3) * 3 / 3; // magBand 1 -> mag/3 ... DRAFT: pledges read at band 1
  if (kind === 'fell_short') r = Math.min(0, r);
  if (kind === 'made_good' && !malicious(h) && r < 0) r = 0;
  return r4(r);
};
const benevolentTown = townHolder(0.2, 0.5);
const maliciousTown = townHolder(0.9, 0.5);
out.c_pledge = {
  fell_short_ally: pledgeOther('fell_short', pairNet('allied'), benevolentTown),
  fell_short_rival_before_clamp: r4(-1 * pairNet('rival') / 3),
  fell_short_rival: pledgeOther('fell_short', pairNet('rival'), benevolentTown),
  made_good_rival_benevolent: pledgeOther('made_good', pairNet('rival'), benevolentTown),
  made_good_rival_malicious: pledgeOther('made_good', pairNet('rival'), maliciousTown),
};
// (d) npc_verdict rows (DRAFT) read by lens one alone; the projection's moral column
const VERDICT_ROWS = {
  venality: { kind01: 0.30, law01: 0.20, force01: 0.45 },
  betrayal: { kind01: 0.20, law01: 0.30, force01: 0.50 },
  brutality: { kind01: 0.10, law01: 0.30, force01: 0.80 },
  conspiracy: { kind01: 0.25, law01: 0.15, force01: 0.55 },
  heresy: { kind01: 0.50, law01: 0.30, force01: 0.50 },
  none: { kind01: 0.35, law01: 0.30, force01: 0.50 },
};
const face = (k) => (k >= 0.85 ? 'heroic' : k >= 0.62 ? 'admirable' : k > 0.38 ? 'neutral' : k > 0.15 ? 'shameful' : 'villainous');
const band = (net) => (net <= -0.65 ? 'hatred' : net <= -0.35 ? 'enmity' : net <= -0.1 ? 'mistrust' : net < 0.1 ? 'indifference' : net < 0.35 ? 'fondness' : net < 0.65 ? 'esteem' : 'adoration');
out.d_verdict = {};
for (const [cls, row] of Object.entries(VERDICT_ROWS)) {
  const per = {};
  for (const [tn, h] of [['benevolent', townHolder(0.2, 0.5)], ['balanced', townHolder(0.5, 0.5)], ['malicious', townHolder(0.9, 0.5)], ['lawful_balanced', townHolder(0.5, 0.9)]]) {
    const r = lensOne(row, h);
    const sev = Math.min(0.4, Math.abs(r));
    const net = r4(Math.sign(r) * sev);
    const reg = band(net);
    const badFace = ['shameful', 'villainous'].includes(face(row.kind01));
    const warm = net >= 0.1;
    per[tn] = { reading: r4(r), net, regard: reg, badlyByRegard: net <= -0.1, badlyByFaceUnlessWarm: net <= -0.1 || (badFace && !warm) };
  }
  out.d_verdict[cls] = { face: face(row.kind01), ...per };
}
// (e) credibility: a holder charged by the landed law (clamp ±SCORE_MAX, decay on read), struck by refold vs by subtraction
const step = (entry, tick, signed) => {
  const prev = decayedNpcCredibilityScore(entry, tick);
  return { score: clamp(prev + signed, -T.SCORE_MAX, T.SCORE_MAX), lastUpdateTick: tick };
};
const MISS_FALL = 2.0;
const charges = [
  { id: 'd1', tick: 0, signed: +T.TRUE_RISE * 1 },
  { id: 'd2', tick: 4, signed: -T.LIE_FALL * 1 },
  { id: 'd3', tick: 6, signed: -T.LIE_FALL * 1 },
  { id: 'd4', tick: 30, signed: -MISS_FALL * 1 },
];
const fold = (list) => list.reduce((e, c) => step(e, c.tick, c.signed), { score: 0, lastUpdateTick: 0 });
const full = fold(charges);
const struckRefold = fold(charges.filter((c) => c.id !== 'd2'));
// subtraction "un-charge" of d2 at tick 60: remove its decayed contribution from the running score
const at = 60;
const subtractEntry = { score: decayedNpcCredibilityScore(full, at) - (-T.LIE_FALL * halfLifeFactor(at - 4, T.HALF_LIFE_TICKS)), lastUpdateTick: at };
out.e_credibility = {
  full_at60: r4(decayedNpcCredibilityScore(full, at)),
  struck_d2_by_refold_at60: r4(decayedNpcCredibilityScore(struckRefold, at)),
  struck_d2_by_subtraction_at60: r4(decayedNpcCredibilityScore(subtractEntry, at)),
  clampCase: (() => {
    // twelve kept pledges at full magnitude saturate the clamp; striking one by subtraction overshoots
    const many = Array.from({ length: 24 }, (_, i) => ({ id: `k${i}`, tick: i, signed: +T.TRUE_RISE }));
    const lie = { id: 'L', tick: 24, signed: -T.LIE_FALL };
    const all = fold([...many, lie]);
    const refold = fold(many);
    const sub = { score: decayedNpcCredibilityScore(all, 24) + T.LIE_FALL, lastUpdateTick: 24 };
    return { all_at24: r4(decayedNpcCredibilityScore(all, 24)), struckLie_refold_at24: r4(decayedNpcCredibilityScore(refold, 24)), struckLie_subtraction_at24: r4(sub.score), weight_refold: r4(npcCredibilityWeight(decayedNpcCredibilityScore(refold, 24))), weight_sub: r4(npcCredibilityWeight(sub.score)) };
  })(),
};
// (f) RN-V1 timing
let shrinkWeek = null;
for (let w = 0; w < 2000; w += 1) {
  const v = decayTowardNeutral(3, 0, w, 'a_decade');
  if (Math.floor(v + 0.5) < 3) { shrinkWeek = w; break; }
}
out.f_timing = {
  HALF_LIFE_WEEKS,
  realmDeed_firstWeekRegional: shrinkWeek,
  heardTermFactor_atThatWeek_aFewYears: r4(halfLifeFactor(shrinkWeek, HALF_LIFE_WEEKS.a_few_years)),
};
console.log(JSON.stringify(out, null, 2));
