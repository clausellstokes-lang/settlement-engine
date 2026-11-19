// Base against tip over the dumps: node measures.mjs <base-dir> <tip-dir> <out.json>
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
const [baseDir, tipDir, outPath] = process.argv.slice(2);
const load = (dir, corpus) => {
  const m = new Map();
  for (const f of readdirSync(dir).filter((f) => f.startsWith(`${corpus}.summary.`))) {
    for (const line of readFileSync(`${dir}/${f}`, 'utf8').split('\n')) if (line) { const o = JSON.parse(line); m.set(o.key, o); }
  }
  return m;
};
const R = ['Undefended', 'Vulnerable', 'Lightly Defended', 'Defensible', 'Well-Defended', 'Fortress'];
const TOP = new Set(['Well-Defended', 'Fortress']);
const BANDS = ['Struggling', 'Poor', 'Moderate', 'Comfortable', 'Prosperous', 'Wealthy'];
const inc = (o, k, n = 1) => { o[k] = (o[k] || 0) + n; };
const noteClass = (n) => { const t = String(n || '').toLowerCase(); if (/strategic/.test(t)) return 'strategic'; if (/seasonal/.test(t)) return 'seasonal'; if (/minimal|no reserve|none/.test(t)) return 'minimal'; if (/buffer/.test(t)) return 'buffer'; return t ? `other:${t.slice(0, 30)}` : 'none'; };
const NOTE_RANK = { minimal: 0, seasonal: 1, buffer: 2, strategic: 3 };
const PL_FLAGS = ['isEndorsed', 'isApproved', 'isTolerated', 'isContested', 'isLegitimacyCrisis', 'governanceFractured'];
const DANGER_FLAGS = new Set(['isContested', 'isLegitimacyCrisis', 'governanceFractured']);
const CAPTURE = ['none', 'adversarial', 'equilibrium', 'corrupted', 'capture'];
const captureOf = (c) => (typeof c === 'string' ? c : c?.state ?? c?.level ?? c?.label ?? JSON.stringify(c));
const stabilityOf = (s) => (typeof s === 'string' ? s : s?.label ?? JSON.stringify(s));

const result = {};
for (const corpus of ['660', 'golden']) {
  const B = load(baseDir, corpus), T = load(tipDir, corpus);
  const r = { births: T.size, baseBirths: B.size };
  const oneBand = { over: [], byStressDistance: {} };
  const top = { entries: [], exits: [], shareBase: 0, shareTip: 0, n360: 0 };
  const labelMoves = { prosperity: 0, food: 0, safety: 0, readiness: 0 };
  const svc = { rowsAdded: 0, rowsRemoved: 0, birthsMoved: 0, newlyEmpty: [], emptyBase: 0, emptyTip: 0, roster: 0, healing: {}, criminal: {} };
  const magic = { moved: 0, byBandStep: {} };
  const stores = { fall: 0, rise: 0, crossings: 0, towardMore: 0, byDirection: {}, byCohortStress: {}, byTier: {}, famine: [] };
  const hired = [];
  const chain = { plScoreMoves: 0, defTermMoves: 0, multMoves: 0, labelMoves: {}, flagMoves: {}, signExceptions: [], whoGoverns: [], dangerFlagNoFall: [], captureMoves: [], stabilityMoves: [], stabilityDangerNoFall: [], npcSetChanged: [], personality: [], goalsMoved: 0, factionPowerMoved: 0, rosterChanged: [], receiptStatus: [], receiptTextMoved: 0 };
  for (const [key, t] of T) {
    const b = B.get(key); if (!b) { (r.missingInBase ||= []).push(key); continue; }
    const tag = `${t.cohort}|${t.stress}`;
    // readiness
    const d = R.indexOf(t.readiness) - R.indexOf(b.readiness);
    if (d !== 0) { labelMoves.readiness++; inc(oneBand.byStressDistance, `${tag}|${d > 0 ? '+' : ''}${d}`); }
    if (Math.abs(d) > 1) oneBand.over.push(`${key} ${b.readiness} -> ${t.readiness}`);
    if (t.cohort === '360') {
      top.n360++; if (TOP.has(b.readiness)) top.shareBase++; if (TOP.has(t.readiness)) top.shareTip++;
      if (!TOP.has(b.readiness) && TOP.has(t.readiness)) top.entries.push(`${key} ${b.readiness} -> ${t.readiness} (${t.prosperity})`);
      if (TOP.has(b.readiness) && !TOP.has(t.readiness)) top.exits.push(`${key} ${b.readiness} -> ${t.readiness} (${t.prosperity})`);
    }
    for (const f of ['prosperity', 'food', 'safety']) if (b[f] !== t[f]) { labelMoves[f]++; (r[`${f}Moves`] ||= []).push(`${key} ${b[f]} -> ${t[f]}`); }
    // services
    const bag = (rows) => { const m = new Map(); for (const x of rows) { const k = JSON.stringify(x); m.set(k, (m.get(k) || 0) + 1); } return m; };
    const bb = bag(b.svcRows), tb = bag(t.svcRows);
    let added = 0, removed = 0;
    for (const [k, n] of tb) added += Math.max(0, n - (bb.get(k) || 0));
    for (const [k, n] of bb) removed += Math.max(0, n - (tb.get(k) || 0));
    svc.rowsAdded += added; svc.rowsRemoved += removed; if (added || removed) svc.birthsMoved++;
    if (added) (svc.addedIn ||= []).push(key);
    const emptyOf = (s) => { const withRows = new Set(s.svcRows.map((x) => x[2])); return new Set(s.institutions.filter((n) => !withRows.has(n))); };
    const eb = emptyOf(b), et = emptyOf(t);
    svc.emptyBase += eb.size; svc.emptyTip += et.size; svc.roster += t.institutions.length;
    for (const n of et) if (!eb.has(n) && b.institutions.includes(n)) svc.newlyEmpty.push(`${key}: ${n}`);
    const hb = b.svcRows.filter((x) => x[0] === 'healing').length, ht = t.svcRows.filter((x) => x[0] === 'healing').length;
    const cb = b.svcRows.filter((x) => x[0] === 'criminal').length, ct = t.svcRows.filter((x) => x[0] === 'criminal').length;
    const band = t.prosperity;
    svc.healing[band] ||= [0, 0]; svc.healing[band][0] += hb; svc.healing[band][1] += ht;
    svc.criminal[band] ||= [0, 0]; svc.criminal[band][0] += cb; svc.criminal[band][1] += ct;
    // magic
    if (b.magic !== t.magic) { magic.moved++; inc(magic.byBandStep, `${band}|${b.magic}->${t.magic}`); }
    // stores
    if (t.storageMonths < b.storageMonths) stores.fall++; if (t.storageMonths > b.storageMonths) stores.rise++;
    const nb = noteClass(b.storageNote), nt = noteClass(t.storageNote);
    if (nb !== nt) {
      stores.crossings++; if ((NOTE_RANK[nt] ?? -1) > (NOTE_RANK[nb] ?? -1)) stores.towardMore++;
      inc(stores.byDirection, `${nb}->${nt}`); inc(stores.byCohortStress, tag); inc(stores.byTier, t.tier);
    }
    if (t.stress === 'famine' || /famine/i.test(t.safety || '')) stores.famine.push([key, b.storageMonths, t.storageMonths, nb, nt, b.food, t.food]);
    // hired
    if (t.hired) hired.push([key, t.tier, t.prosperity, t.hired.hired, t.hired.watch, t.hired.hired <= t.hired.watch]);
    // legitimacy chain
    const pb = b.pl || {}, pt = t.pl || {};
    if (pb.score !== pt.score) {
      chain.plScoreMoves++;
      const dd = (t.readinessScore ?? 0) - (b.readinessScore ?? 0), dl = pt.score - pb.score;
      if (Math.sign(dd) !== Math.sign(dl)) chain.signExceptions.push(`${key}: legitimacy ${pb.score}->${pt.score}, readiness ${b.readinessScore}->${t.readinessScore}`);
    }
    if (pb.breakdown?.defense !== pt.breakdown?.defense) chain.defTermMoves++;
    if (pb.govMultiplier !== pt.govMultiplier || pb.crimMultiplier !== pt.crimMultiplier) chain.multMoves++;
    if (pb.label !== pt.label) inc(chain.labelMoves, `${pb.label} -> ${pt.label}`);
    const readinessFell = R.indexOf(t.readiness) < R.indexOf(b.readiness) || (t.readinessScore < b.readinessScore);
    for (const f of PL_FLAGS) if (!!pb[f] !== !!pt[f]) {
      inc(chain.flagMoves, f);
      if (DANGER_FLAGS.has(f) && pt[f] && !readinessFell) chain.dangerFlagNoFall.push(`${key}: ${f}`);
    }
    const gov = (s) => JSON.stringify([s.governingName, s.government, (s.factions || []).find((f) => f.isGoverning)?.name ?? null]);
    if (gov(b) !== gov(t)) chain.whoGoverns.push(`${key}: ${gov(b)} -> ${gov(t)}`);
    const cpb = captureOf(b.capture), cpt = captureOf(t.capture);
    if (cpb !== cpt) chain.captureMoves.push(`${key}: ${cpb} -> ${cpt} (readiness ${b.readinessScore}->${t.readinessScore})`);
    const stb = stabilityOf(b.stability), stt = stabilityOf(t.stability);
    if (stb !== stt) chain.stabilityMoves.push(`${key}: ${stb} -> ${stt} (readiness ${b.readinessScore}->${t.readinessScore})`);
    const ids = (s) => JSON.stringify(s.npcs.map((p) => `${p.id}|${p.name}`).sort());
    if (ids(b) !== ids(t)) chain.npcSetChanged.push(key);
    const pers = new Map(b.npcs.map((p) => [p.id, JSON.stringify(p.personality)]));
    for (const p of t.npcs) if (pers.has(p.id) && pers.get(p.id) !== JSON.stringify(p.personality)) chain.personality.push(`${key}: ${p.id}`);
    const goals = new Map(b.npcs.map((p) => [p.id, JSON.stringify(p.goals)]));
    for (const p of t.npcs) if (goals.has(p.id) && goals.get(p.id) !== JSON.stringify(p.goals)) chain.goalsMoved++;
    const fp = (s) => JSON.stringify(s.factions.map((f) => [f.name, f.power]));
    if (fp(b) !== fp(t)) chain.factionPowerMoved++;
    const fr = (s) => JSON.stringify(s.factions.map((f) => f.name).sort());
    if (fr(b) !== fr(t)) chain.rosterChanged.push(key);
    if (JSON.stringify(b.receipt) !== JSON.stringify(t.receipt) || b.receiptStatus !== t.receiptStatus) chain.receiptStatus.push(`${key}: ${JSON.stringify(b.receiptStatus)} -> ${JSON.stringify(t.receiptStatus)}`);
  }
  top.shareBase = +(100 * top.shareBase / Math.max(1, top.n360)).toFixed(1); top.shareTip = +(100 * top.shareTip / Math.max(1, top.n360)).toFixed(1);
  oneBand.overCount = oneBand.over.length;
  Object.assign(r, { oneBand, top, labelMoves, svc: { ...svc, newlyEmptyCount: svc.newlyEmpty.length }, magic, stores, hired, chain });
  result[corpus] = r;
}
writeFileSync(outPath, JSON.stringify(result, null, 1));
const brief = (c) => { const r = result[c]; return { births: r.births, over: r.oneBand.overCount, byStressDistance: r.oneBand.byStressDistance, entries: r.top.entries.length, exits: r.top.exits.length, share: [r.top.shareBase, r.top.shareTip], labelMoves: r.labelMoves, svcAdded: r.svc.rowsAdded, svcRemoved: r.svc.rowsRemoved, newlyEmpty: r.svc.newlyEmptyCount, magic: r.magic.moved, storesFall: r.stores.fall, storesRise: r.stores.rise, crossings: r.stores.crossings, towardMore: r.stores.towardMore, hired: r.hired.length, hiredOver: r.hired.filter((h) => !h[5]).length, sign: r.chain.signExceptions.length, whoGoverns: r.chain.whoGoverns.length, dangerNoFall: r.chain.dangerFlagNoFall.length, flags: r.chain.flagMoves, npcSet: r.chain.npcSetChanged.length, personality: r.chain.personality.length, receipt: r.chain.receiptStatus.length, capture: r.chain.captureMoves.length, stability: r.chain.stabilityMoves.length }; };
console.log(JSON.stringify({ '660': brief('660'), golden: brief('golden') }, null, 1));
