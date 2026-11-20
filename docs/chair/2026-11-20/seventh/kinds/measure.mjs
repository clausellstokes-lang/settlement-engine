// measure.mjs — READ-ONLY measure of the pool's live troubles (history.currentTensions) and the facts that admit them.
// node measure.mjs <poolDir> <tree>   -> writes measure.json beside this script, prints tables
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const [poolDir, tree] = process.argv.slice(2);
const { isCriminalInstitution } = await import(join(tree, 'src/domain/corruption.js'));
const { HISTORICAL_EVENTS_DATA } = await import(join(tree, 'src/data/historyData.js'));
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const out = { templateCount: HISTORICAL_EVENTS_DATA.length, templateTypes: HISTORICAL_EVENTS_DATA.map((e) => e.type), bySize: {} };
const pct = (n, d) => (d ? Math.round((1000 * n) / d) / 10 : 0);
const stats = (xs) => {
  const v = xs.filter((x) => typeof x === 'number' && Number.isFinite(x)).sort((a, b) => a - b);
  if (!v.length) return null;
  const m = v.reduce((a, b) => a + b, 0) / v.length;
  const sd = Math.sqrt(v.reduce((a, b) => a + (b - m) ** 2, 0) / v.length);
  const q = (p) => v[Math.floor(p * (v.length - 1))];
  return { n: v.length, min: v[0], p25: q(0.25), median: q(0.5), p75: q(0.75), max: v[v.length - 1], mean: +m.toFixed(2), sd: +sd.toFixed(2) };
};
const modal = (xs) => {
  const c = {}; xs.forEach((x) => { const k = JSON.stringify(x ?? null); c[k] = (c[k] || 0) + 1; });
  const e = Object.entries(c).sort((a, b) => b[1] - a[1]);
  return { distinct: e.length, modal: e[0][0], modalShare: pct(e[0][1], xs.length), top: e.slice(0, 4).map(([k, n]) => `${k}:${n}`) };
};
for (const size of SIZES) {
  const files = readdirSync(poolDir).filter((f) => f.startsWith(`${size}-`) && f.endsWith('.json'));
  const recs = files.map((f) => JSON.parse(readFileSync(join(poolDir, f), 'utf8')));
  const n = recs.length;
  const count = { 0: 0, 1: 0, 2: 0, '3+': 0 };
  const any = {}; const first = {}; const second = {};
  const adm = { hasGuild: 0, hasCriminalInst: 0, crimeSignal: 0, viabilityIssues: 0, stressed: 0, neighborHostile: 0, neighborTrade: 0, smallCrimName: 0, market: 0, temple: 0, stabilityUnstableOnViability: 0 };
  // joint: kinds conditional on admission
  const cw = { admitted: 0, admittedAndCarry: 0, notAdmittedCarry: 0, firstWhenAdmitted: 0, firstAfterScarcity: 0 };
  const gc = { admitted: 0, admittedAndCarry: 0, notAdmittedCarry: 0, firstWhenAdmitted: 0 };
  const firstByPath = {};
  const facts = {};
  const pushF = (k, v) => { (facts[k] ||= []).push(v); };
  for (const r of recs) {
    const ts = Array.isArray(r.history?.currentTensions) ? r.history.currentTensions : [];
    const types = ts.map((t) => t?.type);
    count[types.length >= 3 ? '3+' : types.length] += 1;
    new Set(types).forEach((t) => { any[t] = (any[t] || 0) + 1; });
    if (types[0]) first[types[0]] = (first[types[0]] || 0) + 1;
    if (types[1]) second[types[1]] = (second[types[1]] || 0) + 1;
    const inst = Array.isArray(r.institutions) ? r.institutions : [];
    const hasGuild = inst.some((i) => (i.tags || []).includes('guild'));
    const hasCrimInst = inst.some((i) => i.priorityCategory === 'criminal');
    const signal = (r.powerStructure?.factions || []).some((f) => f?.category === 'criminal') || inst.some((i) => { try { return isCriminalInstitution(i); } catch { return false; } });
    const issues = (r.economicViability?.issues || []).length > 0;
    const stressTypes = r.config?.stressTypes || [];
    const nrel = String(r.config?.neighborRelationship?.relationshipType || '').toLowerCase();
    const smallCrim = ['thorp', 'hamlet', 'village'].includes(size) && inst.some((i) => /fence|smuggl|bandit|outlaw/i.test(i.name || ''));
    if (hasGuild) adm.hasGuild++; if (hasCrimInst) adm.hasCriminalInst++; if (signal) adm.crimeSignal++; if (issues) adm.viabilityIssues++;
    if (stressTypes.length) adm.stressed++; if (/hostile|rival|cold_war/.test(nrel)) adm.neighborHostile++; if (/trade_partner/.test(nrel)) adm.neighborTrade++;
    if (smallCrim) adm.smallCrimName++; if (inst.some((i) => (i.tags || []).includes('market'))) adm.market++;
    if (inst.some((i) => /temple|church|shrine|chapel/i.test(`${i.name} ${(i.tags || []).join(' ')}`))) adm.temple++;
    if (r.economicViability?.stability === 'Unstable') adm.stabilityUnstableOnViability++;
    const crimeAdmitted = hasCrimInst || signal || smallCrim;
    if (crimeAdmitted) { cw.admitted++; if (types.includes('crime_wave')) cw.admittedAndCarry++; if (types[0] === 'crime_wave') cw.firstWhenAdmitted++; }
    else if (types.includes('crime_wave')) cw.notAdmittedCarry++;
    if (types[0] === 'resource_scarcity' && types[1] === 'crime_wave') cw.firstAfterScarcity++;
    if (hasGuild) { gc.admitted++; if (types.includes('guild_conflict')) gc.admittedAndCarry++; if (types[0] === 'guild_conflict') gc.firstWhenAdmitted++; }
    else if (types.includes('guild_conflict')) gc.notAdmittedCarry++;
    // the first trouble's likely path
    const t0 = types[0];
    const path = !t0 ? 'none'
      : t0 === 'resource_scarcity' && issues ? 'priority:viability-issue'
      : t0 === 'crime_wave' && (hasCrimInst || smallCrim) ? 'priority:criminal-house'
      : (t0 === 'external_threat' && /hostile|rival|cold_war/.test(nrel)) || (t0 === 'trade_dispute' && /trade_partner/.test(nrel)) ? 'priority:neighbour'
      : stressTypes.length ? 'priority:stress(or fill)' : 'fill';
    firstByPath[path] = (firstByPath[path] || 0) + 1;
    // candidate stored facts
    const es = r.economicState || {}; const pr = es.priorities || {}; const cp = es.compound || {}; const sp = es.safetyProfile || {};
    pushF('economicState.priorities.economy', pr.economy); pushF('economicState.priorities.criminal', pr.criminal);
    pushF('economicState.priorities.military', pr.military); pushF('economicState.priorities.religion', pr.religion); pushF('economicState.priorities.magic', pr.magic);
    pushF('economicState.compound.criminalEffective', cp.criminalEffective); pushF('economicState.compound.economyOutput', cp.economyOutput);
    pushF('economicState.compound.militaryEffective', cp.militaryEffective);
    pushF('economicState.safetyProfile.safetyRatio', sp.safetyRatio); pushF('economicState.safetyProfile.blackMarketCapture', sp.blackMarketCapture);
    pushF('#criminal institutions (priorityCategory criminal)', inst.filter((i) => i.priorityCategory === 'criminal').length);
    pushF('#guild-tagged institutions', inst.filter((i) => (i.tags || []).includes('guild')).length);
    pushF('#criminal factions (powerStructure.factions category criminal)', (r.powerStructure?.factions || []).filter((f) => f.category === 'criminal').length);
    pushF('#economy factions', (r.powerStructure?.factions || []).filter((f) => f.category === 'economy').length);
    pushF('powerStructure.publicLegitimacy.score', r.powerStructure?.publicLegitimacy?.score);
    pushF('economicState.foodSecurity.foodRatio', es.foodSecurity?.foodRatio);
    pushF('#economicViability.warnings', (r.economicViability?.warnings || []).length);
    pushF('#conflicts (faction quarrels)', (r.conflicts || []).length);
    pushF('CAT safetyProfile.safetyLabel', sp.safetyLabel); pushF('CAT economicState.prosperity', es.prosperity);
    pushF('CAT economicState.prosperityStanding', es.prosperityStanding);
    pushF('CAT powerStructure.stability', r.powerStructure?.stability); pushF('CAT powerStructure.criminalCaptureState', r.powerStructure?.criminalCaptureState);
    pushF('CAT powerStructure.publicLegitimacy.label', r.powerStructure?.publicLegitimacy?.label);
    pushF('CAT governing faction category', (r.powerStructure?.factions || []).find((f) => f.isGoverning)?.category);
    pushF('CAT economicState.foodSecurity.label', es.foodSecurity?.label); pushF('CAT economicState.tradeAccess', es.tradeAccess);
    pushF('CAT culturalIdentity.key', r.culturalIdentity?.key); pushF('CAT config.stressTypes', stressTypes.join(',') || '(none)');
    pushF('CAT stress (crisis) present', r.stress ? 'yes' : 'no'); pushF('CAT config.monsterThreat', r.config?.monsterThreat);
    pushF('CAT config.neighborRelationship type', nrel || '(none)');
    pushF('CAT history.historicalEvents has guild_conflict', (r.history?.historicalEvents || []).some((e) => e.templateType === 'guild_conflict') ? 'yes' : 'no');
    pushF('CAT history.historicalEvents has crime/safety event', (r.history?.historicalEvents || []).some((e) => /crime/.test(e.templateType || '') || e.type === 'safety') ? 'yes' : 'no');
    pushF('CAT history.historicalCharacter', r.history?.historicalCharacter);
  }
  const factTable = {};
  for (const [k, v] of Object.entries(facts)) factTable[k] = k.startsWith('CAT ') ? modal(v) : stats(v);
  const sortObj = (o) => Object.fromEntries(Object.entries(o).sort((a, b) => b[1] - a[1]).map(([k, c]) => [k, `${c} (${pct(c, n)}%)`]));
  out.bySize[size] = {
    n, counts: Object.fromEntries(Object.entries(count).map(([k, c]) => [k, `${c} (${pct(c, n)}%)`])),
    distinctKinds: Object.keys(any).length, anyShare: sortObj(any), firstShare: sortObj(first), secondShare: sortObj(second),
    admission: Object.fromEntries(Object.entries(adm).map(([k, c]) => [k, `${c} (${pct(c, n)}%)`])),
    crimeWave: { ...cw, carryShareWhenAdmitted: pct(cw.admittedAndCarry, cw.admitted), firstShareWhenAdmitted: pct(cw.firstWhenAdmitted, cw.admitted) },
    guildConflict: { ...gc, carryShareWhenAdmitted: pct(gc.admittedAndCarry, gc.admitted), firstShareWhenAdmitted: pct(gc.firstWhenAdmitted, gc.admitted) },
    firstByPath: sortObj(firstByPath), facts: factTable,
  };
}
writeFileSync(join(dirname(fileURLToPath(import.meta.url)), 'measure.json'), JSON.stringify(out, null, 1));
for (const s of SIZES) {
  const b = out.bySize[s];
  console.log(`\n== ${s} n=${b.n} counts ${JSON.stringify(b.counts)} distinct=${b.distinctKinds}`);
  console.log('any  ', JSON.stringify(b.anyShare));
  console.log('first', JSON.stringify(b.firstShare));
  console.log('adm  ', JSON.stringify(b.admission));
  console.log('cw   ', JSON.stringify(b.crimeWave)); console.log('gc   ', JSON.stringify(b.guildConflict));
  console.log('path ', JSON.stringify(b.firstByPath));
}
