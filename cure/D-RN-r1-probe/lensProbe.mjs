// D-RN-r1 probe: the CURED two-reading formula (RN §6.2 r1) on the owner's canonical cases,
// plus the party-credibility arithmetic on the LANDED person law (imported read-only from master).
const M = process.argv[2];
const { NPC_CREDIBILITY_TUNING: T, npcCredibilityWeight, decayedNpcCredibilityScore } =
  await import(`${M}/src/domain/worldPulse/npcCredibility.js`);
const { RELATIONSHIP_DEFAULTS: D } = await import(`${M}/src/domain/worldPulse/relationshipState.js`);
const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
// PAIR_NET (DRAFT) + live shift around the label's own defaults (kappa 0.5)
const LABEL_NET = { allied: 0.6, trade_partner: 0.3, patron: 0.2, client: 0.2, vassal: 0.2, neutral: 0,
  criminal_network: -0.2, rival: -0.4, cold_war: -0.6, hostile: -0.8 };
const pairNet = (type, trust, resentment) => {
  const d = D[type] || D.neutral;
  return clamp(LABEL_NET[type] + 0.5 * ((trust - d.trust) - (resentment - d.resentment)), -1, 1);
};
const morality = (m) => (m >= 0.67 ? 'malicious' : m <= 0.33 ? 'merciful' : 'balanced'); // warSeatBooks.js :: moralityBand
const lensOne = ({ kind01, law01, force01 }, h, a = 1, b = 0.5, c = 0.4) => {
  const kindFactor = kind01 > 0.5 ? Math.max(0, 1 - 2 * h.malice01) : (1 - 2 * h.malice01);
  return a * (kind01 - 0.5) * kindFactor + b * (law01 - 0.5) * (2 * h.lawfulness01 - 1) + c * (force01 - 0.5) * (2 * h.aggr01 - 1);
};
const reading = (deed, h, helped, mu = 0.5) => {
  const one = lensOne(deed, h);
  const two = helped.reduce((s, x) => s + x.sign * x.net * (deed.magBand / 3), 0);
  let r = (1 - mu) * one + mu * two;
  const rule = one >= 0 && morality(h.malice01) !== 'malicious';
  if (rule && r < 0) r = 0; // the owner's rule: lens two may cancel warmth, never make a grudge
  return { one: +one.toFixed(4), two: +two.toFixed(4), reading: +r.toFixed(4), band: morality(h.malice01), grudge: r < 0 };
};
const resolve = { kind01: 0.8, law01: 0.5, force01: 0.5, magBand: 3 }; // resolve_stressor, default mag 1.0 -> band 3
const rivalNet = pairNet('rival', D.rival.trust, D.rival.resentment);
const out = {
  rivalNetAtDefaults: rivalNet,
  neutralNetAtDefaults: pairNet('neutral', D.neutral.trust, D.neutral.resentment),
  alliedNetAtDefaults: pairNet('allied', D.allied.trust, D.allied.resentment),
  hostileNetAtDefaults: pairNet('hostile', D.hostile.trust, D.hostile.resentment),
  R4_goodRival: reading(resolve, { malice01: 0.2, lawfulness01: 0.5, aggr01: 0.5 }, [{ sign: +1, net: rivalNet }]),
  R4b_balancedRival: reading(resolve, { malice01: 0.5, lawfulness01: 0.5, aggr01: 0.5 }, [{ sign: +1, net: rivalNet }]),
  R5_maliciousRival: reading(resolve, { malice01: 0.9, lawfulness01: 0.5, aggr01: 0.5 }, [{ sign: +1, net: rivalNet }]),
  R26_maliciousNonRival: reading(resolve, { malice01: 0.9, lawfulness01: 0.5, aggr01: 0.5 }, [{ sign: +1, net: 0 }]),
  goodNonRival: reading(resolve, { malice01: 0.2, lawfulness01: 0.5, aggr01: 0.5 }, [{ sign: +1, net: 0 }]),
  goodAlly: reading(resolve, { malice01: 0.2, lawfulness01: 0.5, aggr01: 0.5 }, [{ sign: +1, net: pairNet('allied', D.allied.trust, D.allied.resentment) }]),
  cruelActByEvil: reading({ kind01: 0.2, law01: 0.4, force01: 0.6, magBand: 3 }, { malice01: 0.9, lawfulness01: 0.5, aggr01: 0.5 }, []),
  cruelActByGood: reading({ kind01: 0.2, law01: 0.4, force01: 0.6, magBand: 3 }, { malice01: 0.2, lawfulness01: 0.5, aggr01: 0.5 }, []),
};
// credibility: one reachable miss at mag 1 under LIE_FALL (as written) vs a DRAFT MISS_FALL 2.0
const weeksUntil = (score0, pred) => { for (let w = 0; w <= 400; w++) { const s = decayedNpcCredibilityScore({ score: score0, lastUpdateTick: 0 }, w); if (pred(npcCredibilityWeight(s))) return w; } return '>400'; };
out.credibility = {
  tuning: { TRUE_RISE: T.TRUE_RISE, LIE_FALL: T.LIE_FALL, HALF_LIFE_TICKS: T.HALF_LIFE_TICKS },
  lieFall_weight0: +npcCredibilityWeight(-T.LIE_FALL).toFixed(4),
  lieFall_weeksToOrdinary_ge090: weeksUntil(-T.LIE_FALL, (w) => w >= 0.9),
  missFall2_weight0: +npcCredibilityWeight(-2.0).toFixed(4),
  missFall2_weeksToOrdinary_ge090: weeksUntil(-2.0, (w) => w >= 0.9),
  keptOnce_weight0: +npcCredibilityWeight(T.TRUE_RISE).toFixed(4),
};
console.log(JSON.stringify(out, null, 2));
