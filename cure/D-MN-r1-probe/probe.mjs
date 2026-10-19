// D-MN-r1 probe — executes the load-bearing claims of the round-1 cures against master 81f1cd963's own modules
// (imported read-only from the detached worktree; nothing there is written). Run: node probe.mjs <worktree>
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const W = process.argv[2];
const imp = (p) => import(pathToFileURL(path.join(W, p)).href);

const emb = await imp('src/domain/spatial/embattlement.js');
const { createPRNG } = await imp('src/kernel/prng.js');
const { logistic } = await imp('src/domain/region/contestMath.js');
const core = await imp('src/domain/worldPulse/stressorsCore.js');
const str = await imp('src/domain/worldPulse/stressors.js');
const promo = await imp('src/domain/conditionPromotion.js');

const out = [];
const log = (k, v) => { out.push(`${k}: ${JSON.stringify(v)}`); };

// (1) MN-r1-3 — the latch. A calm record under a raw threat of 0.60 vs 0.45 / 0.35.
for (const raw of [0.6, 0.45, 0.35]) {
  let rec = null; const trail = [];
  for (let t = 1; t <= 4; t++) { rec = emb.stepEmbattlement(rec, raw, t); trail.push(rec ? `${rec.phase}@${rec.level}` : 'pruned'); }
  log(`latch raw=${raw}`, trail);
}
// (2) MN-r1-11 — the war's siege term at a calm garrisoned town vs the menace walls term computed the same way.
const T = emb.EMBATTLEMENT_TUNING;
for (const sec of [0, 0.5, 1]) {
  const war = emb.rampThreat({ besieged: true, security01: sec });
  const menace = Math.max(0, T.W_SIEGE - Math.min(T.SECURITY_MAX_RELIEF, T.W_SEC * sec));
  log(`walls sec=${sec}`, { war, menace, equal: Math.abs(war - menace) < 1e-12 });
}

// (3) MN-r1-1 — the menace core (war constants 0.16 / 3 / 0.18) over 20 000 weeks per matchup: band shares.
const K = 0.16, HOLD = 3, MARGIN = 0.18;
const rng = createPRNG('dmn-r1');
for (const [might, hd] of [[34, 70], [51, 60], [69, 40], [89, 60]]) {
  const pFall = logistic(K * (might - hd) - HOLD);
  const n = 20000; const c = { decisive_success: 0, costly_success: 0, narrow_fail: 0, decisive_fail: 0 };
  for (let i = 0; i < n; i++) {
    const u = rng.fork(`m:${might}:${hd}:${i}`).random();
    const falls = u < pFall;
    const band = falls ? ((pFall - u) > MARGIN ? 'decisive_success' : 'costly_success') : ((u - pFall) < MARGIN ? 'narrow_fail' : 'decisive_fail');
    c[band]++;
  }
  for (const k of Object.keys(c)) c[k] = Math.round(1000 * c[k] / n) / 1000;
  log(`core might=${might} hd=${hd}`, { pFall: Math.round(pFall * 1e4) / 1e4, shares: c });
}

// (4) MN-r1-2 — a siege record released at 0.85: structural (catalog default) vs the record's own episodic policy.
const snapshot = { byId: new Map(), worldState: {} };
for (const policy of [undefined, 'episodic']) {
  let rec = core.normalizeStressor({ id: 'world_stressor.siege.kell.menace.m1', type: 'siege', originSettlementId: 'kell', severity: 0.85, age: 20,
    ...(policy ? { durationPolicy: policy, decayRate: core.STRESSOR_POLICIES.episodic.decay } : {}) });
  const r = createPRNG('dmn-r1-age');
  let week = 0; let firstUnder04 = null; let firstUnder06 = null; let resolvedAt = null;
  while (week < 80) {
    week++;
    const res = str.ageRoamingStressors([rec], snapshot, r.fork(`w${week}`), { tick: week });
    if (res.resolved.length) { resolvedAt = week; break; }
    rec = res.stressors[0];
    if (firstUnder06 === null && rec.severity < 0.6) firstUnder06 = week;
    if (firstUnder04 === null && rec.severity < 0.4) firstUnder04 = week;
  }
  log(`release policy=${policy || 'catalog(structural)'}`, { durationPolicy: core.normalizeStressor({ type: 'siege', ...(policy ? { durationPolicy: policy } : {}) }).durationPolicy, firstUnder06, firstUnder04, resolvedAt });
}

// (5) MN-r1-23 — the noun labels promote as their type alone.
for (const [type, label] of [['monster_raider_pressure', 'Pressure from outside'], ['siege', 'A siege from outside'], ['monster_raider_pressure', ''], ['siege', '']]) {
  log(`archetype ${type} / "${label}"`, promo.archetypeForStressor({ type, label }));
}
console.log(out.join('\n'));
