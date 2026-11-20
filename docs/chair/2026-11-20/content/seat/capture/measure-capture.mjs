#!/usr/bin/env node
/**
 * docs/chair/2026-11-20/content/seat/capture/measure-capture.mjs — CAPTURE-MEASURE (SEAT-1, the seventh chair, 2026-11-20).
 * Measures; changes nothing under src/ or tests/. Births the proposal's two pools exactly as measure-holder.mjs births
 * them (birthConfig, the same seeds: `seat-measure-<tier>-<i>` x150 per tier; `seat-measure-<tier>-<preset>-<i>` x10)
 * and reports, per pool, the brief's seven measures (briefs/CAPTURE-MEASURE.md):
 *   (1) the capture rung at birth by tier; (2) criminal powers / houses per town and the people each power holds;
 *   (3) the crime-worded forms, their rungs, and two probes over the ONE derivation (hallCapture.js :: hallCaptureOf):
 *       the form forced ordinary (the governing row's category read as civic) and the agents removed;
 *   (4) the captured towns' black market, criminal diversity and lawful market, and the proposed two-way line;
 *   (5) the top three / top one of the criminal power's OWN open members; (6) twelve towns as text;
 *   (7) the public difference: toPublicSafe and publicVeiledRecordOf over a captured town and its writer-made twin.
 *
 *   node docs/chair/2026-11-20/content/seat/capture/measure-capture.mjs --arm default|presets [--n N]
 *   node docs/chair/2026-11-20/content/seat/capture/measure-capture.mjs --arm default --from-json   (re-reads rows)
 * Writes capture-<arm>.json / capture-<arm>.md beside itself.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '../../../../../..');
const imp = (p) => import(join(ROOT, p));
const args = process.argv.slice(2);
const argOf = (flag, fallback) => { const i = args.indexOf(flag); return i >= 0 && args[i + 1] != null ? args[i + 1] : fallback; };
const ARM = argOf('--arm', 'default');
const N = Number(argOf('--n', ARM === 'presets' ? 10 : 150));
const FROM_JSON = args.includes('--from-json');
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const LADDER = ['none', 'adversarial', 'equilibrium', 'corrupted', 'capture'];
const INFLUENCE_RANK = { high: 3, moderate: 2, low: 1 }; // the order dossierSearch.js :: INFLUENCE_RANK and warResolve.js already read
const CRIME_FORMS = ['Corrupt Council', 'Corrupt City Council', 'Shadow Senate', 'Corrupt Oligarchy', 'Shadowed Council'];

// ── THE PROPOSED LINE (measured figures, not law): see section (4) of the .md ──────────────────────────────────────────
// CRIME BOSSES where the criminal trade is SPREAD (operations: `safetyProfile.criminalInstitutions.length` >= OPS_MIN),
// spread BESIDE the lawful market (operations / the lawful income's effective sources, 1/HHI, >= OPS_PER_LAWFUL_MIN) and
// LARGE (`blackMarketCapture` >= BMC_MIN, about the pools' median among towns with a criminal power). Else ONE UNDERBOSS.
// (The json keeps every input, so another line can be re-cut with --from-json.)
const LINE = { OPS_MIN: 3, OPS_PER_LAWFUL_MIN: 0.75, BMC_MIN: 20 };

const r2 = (x) => Math.round(x * 100) / 100;
const bump = (m, k, by = 1) => { m[k] = (m[k] || 0) + by; };
const q = (xs, p) => { if (!xs.length) return null; const s = [...xs].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.max(0, Math.round(p * (s.length - 1))))]; };
const p3 = (xs) => (xs.length ? `${q(xs, 0.1)} / ${q(xs, 0.5)} / ${q(xs, 0.9)}` : '–');
const hist = (xs, edges) => { const out = {}; for (const x of xs) { const e = edges.find((b) => x <= b); bump(out, e === undefined ? `>${edges[edges.length - 1]}` : `<=${e}`); } return edges.map((e) => `<=${e}`).concat(`>${edges[edges.length - 1]}`).filter((k) => out[k]).map((k) => `${k}:${out[k]}`).join(' '); };
const str = (v) => (typeof v === 'string' ? v : '');

function diffPaths(a, b, path = '', out = []) {
  if (out.length >= 40) return out;
  if (a === b) return out;
  const ta = Array.isArray(a) ? 'array' : typeof a; const tb = Array.isArray(b) ? 'array' : typeof b;
  if (ta !== tb || ta !== 'object' && ta !== 'array' || a === null || b === null) { out.push(`${path || '(root)'}: ${JSON.stringify(a)?.slice(0, 120)} -> ${JSON.stringify(b)?.slice(0, 120)}`); return out; }
  if (ta === 'array') {
    if (a.length !== b.length) out.push(`${path}: length ${a.length} -> ${b.length}`);
    for (let i = 0; i < Math.min(a.length, b.length); i++) diffPaths(a[i], b[i], `${path}[${i}]`, out);
    return out;
  }
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of keys) {
    if (!(k in a)) out.push(`${path}.${k}: (absent) -> present`);
    else if (!(k in b)) out.push(`${path}.${k}: present -> (absent)`);
    else diffPaths(a[k], b[k], `${path}.${k}`, out);
  }
  return out;
}
const stripIdx = (p) => p.replace(/\[\d+\]/g, '[]').replace(/: .*$/, '');

let rows; let meta;
if (FROM_JSON) {
  const prev = JSON.parse(readFileSync(join(HERE, `capture-${ARM}.json`), 'utf8'));
  rows = prev.rows; meta = prev.meta;
} else {
  const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
  const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
  const { ARCHETYPES, archetypePatch } = await imp('src/components/generate/characterPresets.js');
  const { governingFactionOf, nameOf } = await imp('src/domain/rulingPower.js');
  const { hallCaptureOf, writeHallCapture } = await imp('src/domain/people/hallCapture.js');
  const { criminalPowersOf, criminalHousesOf, isCriminalPower, allegianceOf } = await imp('src/domain/people/allegiance.js');
  const { isVeiledPower } = await imp('src/domain/people/cardVeil.js');
  const { captureClimateOf } = await imp('src/generators/power/rulingStructure.js');
  const { withCaptureRelations } = await imp('src/generators/factionDynamics.js');
  const { runningCriminalChains } = await imp('src/domain/facts/criminalStructureKey.js');
  const { toPublicSafe, publicVeiledRecordOf } = await imp('src/domain/display/publicSafe.js');
  await loadGenerationLawPayloads();
  const PRESETS = ARCHETYPES.map((a) => a.key).filter((k) => k !== 'balanced');
  const JOBS = ARM === 'presets'
    ? TIERS.flatMap((tier) => PRESETS.flatMap((preset) => Array.from({ length: N }, (_, i) => ({ tier, preset, seed: `seat-measure-${tier}-${preset}-${i}`, config: { settType: tier, ...archetypePatch(preset) } }))))
    : TIERS.flatMap((tier) => Array.from({ length: N }, (_, i) => ({ tier, preset: null, seed: `seat-measure-${tier}-${i}`, config: { settType: tier } })));
  rows = []; let errors = 0; const t0 = Date.now();
  for (const job of JOBS) {
    let s;
    try { s = generateSettlementPipeline(birthConfig(job.config), null, { seed: job.seed, customContent: {} }); } catch { errors += 1; continue; }
    const ps = s.powerStructure || {};
    const gov = governingFactionOf(s);
    const form = nameOf(gov) || null;
    const npcs = Array.isArray(s.npcs) ? s.npcs : [];
    const rung = str(ps.criminalCaptureState) || '(absent)';
    // the derivation re-read over the born record (the climate re-computed over the final roster)
    const hall = hallCaptureOf(s, { climate: captureClimateOf(s) });
    // PROBE A — the form forced ordinary: the governing row read as a civic government (category only; the name, the
    // cast, the ranks and the allegiances unchanged); PROBE B — the agents removed (every card's allegiance off)
    const ordinary = { ...s, powerStructure: { ...ps, factions: (ps.factions || []).map((f) => (f && f.isGoverning ? { ...f, category: 'government' } : f)) } };
    const probeOrdinary = hallCaptureOf(ordinary, { climate: captureClimateOf(ordinary) });
    const probeNoAgents = hallCaptureOf(s, { climate: captureClimateOf(s), npcs: npcs.map((c) => { const { allegiance: _a, ...rest } = c; return rest; }) });
    // criminal powers and houses
    const crimPowers = criminalPowersOf(s).map((p) => {
      const name = nameOf(p);
      const members = npcs.map((c, at) => ({ c, at, m: (c.memberships || []).find((m) => m && m.power === name) })).filter((x) => x.m)
        .map(({ c, at, m }) => ({ id: c.id, at, name: c.name, title: c.title || null, house: c.institution?.key || null, kind: c.institution?.kind || null,
          influence: c.influence ?? null, npcPower: Number(c.power) || 0, rank: Number.isInteger(m.rank) ? m.rank : null,
          inHall: (c.memberships || []).some((x) => x && x.power === form), isLord: (c.memberships || []).some((x) => x && x.power === form && x.rank === 1),
          agent: !!allegianceOf(c) }));
      return { name, category: p.category || null, governing: name === form, power: Number(p.power) || 0, veiledPower: isVeiledPower(p), members };
    });
    const crimHouses = criminalHousesOf(s).map((h) => str(h.name));
    const facedSet = new Set(npcs.filter((c) => c.institution?.kind === 'house').map((c) => str(c.institution.key)));
    const crimHousesFaced = crimHouses.filter((h) => facedSet.has(h));
    const e = s.economicState || {};
    const sp = e.safetyProfile || {};
    const income = (Array.isArray(e.incomeSources) ? e.incomeSources : []).map((x) => Number(x?.percentage) || 0).filter((x) => x > 0);
    const tot = income.reduce((a, b) => a + b, 0) || 1;
    const hhi = income.reduce((a, b) => a + (b / tot) ** 2, 0);
    const chains = Array.isArray(e.activeChains) ? e.activeChains : [];
    const RUN = ['operational', 'running', 'entrepot'];
    const lawChains = chains.filter((c) => c && c.needKey !== 'criminal_economy' && RUN.includes(String(c.status)));
    const lord = npcs.find((c) => (c.memberships || []).some((m) => m && m.power === form && m.rank === 1)) || null;
    const row = {
      seed: job.seed, tier: job.tier, preset: job.preset, form, govCategory: gov?.category || null, govCriminal: !!gov && isCriminalPower(gov), govVeiled: !!gov && isVeiledPower(gov),
      rung, hall: { state: hall.state, agentRung: hall.agentRung, climateRung: hall.climateRung, agentScore: hall.agentScore, agentRanks: hall.agents.map((a) => a.rank), underworld: hall.underworld, rulerCriminal: hall.rulerCriminal },
      probeOrdinary: probeOrdinary.state, probeNoAgents: probeNoAgents.state,
      crimPowers, crimHouses, crimHousesFaced,
      bmc: Number(sp.blackMarketCapture) || 0, crimeTypes: (sp.crimeTypes || []).map((c) => c?.type || null), crimInst: sp.criminalInstitutions || [], crimChains: runningCriminalChains(s).map((c) => c.chainId || null),
      lawful: { sources: income.length, effSources: r2(1 / (hhi || 1)), topShare: income.length ? Math.max(...income) : 0, runningChains: lawChains.length, exports: (e.primaryExports || []).length, localProduction: (e.localProduction || []).length, prosperity: e.prosperity || null, complexity: e.economicComplexity || null },
      lord: lord ? { name: lord.name, title: lord.title || null, house: lord.institution?.key || null, agent: !!allegianceOf(lord) } : null,
      publicDiff: null,
    };
    // (7) the public difference, on every captured town: its twin is the same record through the ONE writer at a lower
    // rung (the derivation's own path: writeHallCapture then withCaptureRelations), so the twin differs in the hall only
    if (rung === 'capture') {
      const twinOf = (state) => ({ ...s, powerStructure: withCaptureRelations(writeHallCapture(ps, { state }, { rederive: true }), state) });
      const pd = {};
      for (const t of ['corrupted', 'none']) {
        const twin = twinOf(t);
        pd[t] = {
          owner: diffPaths(s.powerStructure, twin.powerStructure, 'powerStructure').map(stripIdx),
          toPublicSafe: diffPaths(toPublicSafe(s), toPublicSafe(twin)).map(stripIdx),
          publicVeiledRecordOf: diffPaths(publicVeiledRecordOf(s), publicVeiledRecordOf(twin)).map(stripIdx),
        };
      }
      const pub = toPublicSafe(s);
      const pubJson = JSON.stringify(pub);
      pd.leaks = {
        criminalCaptureStateKey: /criminalCaptureState/.test(pubJson), captureStateKey: /"captureState"/.test(pubJson), allegianceKey: /"allegiance"/.test(pubJson),
        govRowPublic: (pub.powerStructure?.factions || []).some((f) => f.faction === form), govCategory: (pub.powerStructure?.factions || []).find((f) => f.faction === form)?.category ?? null,
        underworldRowPublic: !!hall.underworld && (pub.powerStructure?.factions || []).some((f) => f.faction === hall.underworld),
        underworldNamed: !!hall.underworld && pubJson.split(hall.underworld).length - 1,
        relRowsOwner: (ps.factionRelationships || []).length, relRowsPublic: (pub.powerStructure?.factionRelationships || []).length,
        lordCardPublicKeys: lord ? Object.keys((pub.npcs || []).find((c) => c.id === lord.id) || {}).sort() : null,
        crimFacesPublicTitle: (pub.npcs || []).filter((c) => crimPowers.some((p) => p.members.some((m) => m.id === c.id && !m.inHall))).filter((c) => c.title).length,
        crimFacesOnRecord: npcs.filter((c) => crimPowers.some((p) => p.members.some((m) => m.id === c.id && !m.inHall))).length,
      };
      row.publicDiff = pd;
    }
    rows.push(row);
  }
  meta = { script: 'docs/chair/2026-11-20/content/seat/capture/measure-capture.mjs', arm: ARM, n: N, jobs: JOBS.length, towns: rows.length, errors, seconds: Math.round((Date.now() - t0) / 1000) };
}

// ── ANALYSIS ──────────────────────────────────────────────────────────────────────────────────────────────────────────
const L = [];
const A = {};
const towns = rows.length;
L.push(`# Capture at birth, arm ${ARM} (${towns} born towns through birthConfig, ${meta.errors} errors)`, '',
  `Executed: \`node ${meta.script} --arm ${ARM} --n ${meta.n}\` (${meta.seconds}s). Seeds and configs are measure-holder.mjs's own. Raw rows: \`capture-${ARM}.json\`.`, '');

// (1) rung by tier
A.rungByTier = {}; A.rungs = {};
for (const r of rows) { bump(A.rungs, r.rung); bump((A.rungByTier[r.tier] ||= {}), r.rung); }
A.rederiveMismatch = rows.filter((r) => r.hall.state !== r.rung).length;
L.push('## (1) The capture rung at birth (`powerStructure.criminalCaptureState`) by tier', '', `| tier | ${LADDER.join(' | ')} | towns |`, `|---|${LADDER.map(() => '---').join('|')}|---|`);
for (const t of TIERS) L.push(`| ${t} | ${LADDER.map((g) => A.rungByTier[t]?.[g] || 0).join(' | ')} | ${Object.values(A.rungByTier[t] || {}).reduce((a, b) => a + b, 0)} |`);
L.push(`| **all** | ${LADDER.map((g) => `**${A.rungs[g] || 0}**`).join(' | ')} | ${towns} |`, '');
L.push(`Re-derivation check: \`hallCaptureOf(record, { climate: captureClimateOf(record) })\` over the born record differs from the stored rung in **${A.rederiveMismatch}** towns${A.rederiveMismatch ? ` (${rows.filter((r) => r.hall.state !== r.rung).map((r) => `${r.seed}: stored ${r.rung}, re-read ${r.hall.state}, climate re-read ${r.hall.climateRung}`).join('; ')}; the seam reads the climate over its own roster before the later steps, so a re-read over the final roster can differ on the climate term only)` : ''}.`, '');
A.agentRungOfCapture = {}; A.climateOfCapture = {};
const agentMix = {}; for (const r of rows) bump(agentMix, `${r.rung} <- agent ${r.hall.agentRung} / climate ${r.hall.climateRung}`);
L.push('Where each stored rung comes from (agent rung / climate rung, the derivation\'s two terms):', '');
for (const [k, v] of Object.entries(agentMix).sort((a, b) => LADDER.indexOf(b[0].split(' ')[0]) - LADDER.indexOf(a[0].split(' ')[0]) || b[1] - a[1])) L.push(`- ${k}: ${v}`);
L.push('');

// (2) criminal powers and houses
const band = (n) => (n >= 2 ? '2+' : String(n));
A.powers = { all: {}, independent: {}, governing: {} }; A.houses = { roster: {}, faced: {} };
const memberCounts = []; const infl = {}; const memberCountsInd = []; let isCrimNotVeiled = 0; let veiledNotCrim = 0;
for (const r of rows) {
  bump(A.powers.all, band(r.crimPowers.length)); bump(A.powers.independent, band(r.crimPowers.filter((p) => !p.governing).length)); bump(A.powers.governing, band(r.crimPowers.filter((p) => p.governing).length));
  bump(A.houses.roster, band(r.crimHouses.length)); bump(A.houses.faced, band(r.crimHousesFaced.length));
  for (const p of r.crimPowers) {
    memberCounts.push(p.members.length); if (!p.governing) memberCountsInd.push(p.members.length);
    for (const m of p.members) bump(infl, `${p.governing ? 'governing' : 'independent'}:${m.influence}`);
    if (!p.veiledPower) isCrimNotVeiled += 1;
  }
}
L.push('## (2) Criminal powers (rows) and criminal houses (institutions) per town', '',
  'A criminal POWER is `allegiance.js :: isCriminalPower` (category criminal, or a name containing "thie"); a criminal HOUSE is `corruption.js :: isCriminalInstitution` on the roster, "faced" where a card\'s `institution` is that house.', '',
  '| count | criminal powers (all rows) | independent (not governing) | governing | criminal houses (roster) | criminal houses with a face |', '|---|---|---|---|---|---|');
for (const b of ['0', '1', '2+']) L.push(`| ${b} | ${A.powers.all[b] || 0} | ${A.powers.independent[b] || 0} | ${A.powers.governing[b] || 0} | ${A.houses.roster[b] || 0} | ${A.houses.faced[b] || 0} |`);
const nameCount = {}; for (const r of rows) for (const p of r.crimPowers) bump(nameCount, `${p.name}${p.governing ? ' (governing)' : ''} [${p.category}]`);
L.push('', `Criminal power rows by name: ${Object.entries(nameCount).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(' · ')}`, '',
  `A criminal power whose row is NOT veiled by \`cardVeil.js :: isVeiledPower\` (criminal by name only): ${isCrimNotVeiled} rows.`, '',
  `People on record per criminal power (cards whose \`memberships\` name it): all rows p10/p50/p90 ${p3(memberCounts)} (histogram ${hist(memberCounts, [0, 1, 2, 3, 4, 6, 9])}); independent powers only ${p3(memberCountsInd)} (histogram ${hist(memberCountsInd, [0, 1, 2, 3, 4, 6, 9])}).`, '',
  `Their \`influence\` values: ${Object.entries(infl).sort().map(([k, v]) => `${k} ${v}`).join(' · ')}.`, '');

// (3) crime-worded forms
const crimeForm = (r) => r.govCriminal || CRIME_FORMS.includes(r.form);
A.crimeForms = {};
const formRows = rows.filter(crimeForm);
for (const r of formRows) bump(A.crimeForms, `${r.form} [category ${r.govCategory}] -> ${r.rung}`);
const probeA = {}; const probeB = {};
for (const r of formRows) { bump(probeA, `${r.rung} -> ${r.probeOrdinary}`); bump(probeB, `${r.rung} -> ${r.probeNoAgents}`); }
const probeAAll = {}; for (const r of rows.filter((x) => !crimeForm(x))) bump(probeAAll, r.rung === r.probeOrdinary ? 'unchanged' : `${r.rung} -> ${r.probeOrdinary}`);
const captureNoAgentsAll = {}; for (const r of rows.filter((x) => x.rung === 'capture' || x.rung === 'corrupted')) bump(captureNoAgentsAll, `${r.rung} -> ${r.probeNoAgents}${crimeForm(r) ? ' (crime form)' : ''}`);
L.push('## (3) The crime-worded forms and the rung each reaches', '', `Towns born with a crime-worded form (the governing row criminal by \`isCriminalPower\`, or named ${CRIME_FORMS.join(' / ')}): **${formRows.length}** of ${towns}.`, '');
for (const [k, v] of Object.entries(A.crimeForms).sort((a, b) => b[1] - a[1])) L.push(`- ${k}: ${v}`);
const formTier = {}; for (const r of formRows) bump(formTier, r.tier);
L.push('', `By tier: ${Object.entries(formTier).map(([k, v]) => `${k} ${v}`).join(' · ') || 'none'}.`, '',
  '**Probe A — the form forced ordinary** (the same born record, the governing row\'s category read as `government`; cast, ranks, allegiances unchanged; the one derivation re-run):', '');
for (const [k, v] of Object.entries(probeA)) L.push(`- ${k}: ${v}`);
L.push('', `Control: the same probe on the ${towns - formRows.length} towns without a crime form: ${Object.entries(probeAAll).map(([k, v]) => `${k} ${v}`).join(' · ')}.`, '',
  '**Probe B — the agents removed** (every card\'s `allegiance` off, the form kept):', '');
for (const [k, v] of Object.entries(probeB)) L.push(`- crime form ${k}: ${v}`);
L.push('', `Probe B over every corrupted or captured town: ${Object.entries(captureNoAgentsAll).sort().map(([k, v]) => `${k} ${v}`).join(' · ')}.`, '');

// (4) captured towns: the distributions and the proposed line
const captured = rows.filter((r) => r.rung === 'capture');
const anyCrim = rows.filter((r) => r.crimPowers.some((p) => !p.governing));
const measures = (set) => ({
  bmc: set.map((r) => r.bmc), crimeTypes: set.map((r) => r.crimeTypes.length), crimInst: set.map((r) => r.crimInst.length), crimChains: set.map((r) => r.crimChains.length),
  crimHousesFaced: set.map((r) => r.crimHousesFaced.length), lawSources: set.map((r) => r.lawful.sources), lawEff: set.map((r) => r.lawful.effSources), lawTop: set.map((r) => r.lawful.topShare),
  lawChains: set.map((r) => r.lawful.runningChains), exports: set.map((r) => r.lawful.exports), localProduction: set.map((r) => r.lawful.localProduction),
  opsPerLawful: set.map((r) => r2(r.crimInst.length / Math.max(1, r.lawful.effSources))), bmcVsLawful: set.map((r) => r2(r.bmc / Math.max(1, 100 - r.bmc))),
});
const choose = (r) => (r.crimInst.length >= LINE.OPS_MIN && r.crimInst.length / Math.max(1, r.lawful.effSources) >= LINE.OPS_PER_LAWFUL_MIN && r.bmc >= LINE.BMC_MIN ? 'CRIME BOSSES' : 'ONE UNDERBOSS');
const table = (label, set) => {
  const m = measures(set);
  L.push(`### ${label} (${set.length} towns)`, '', '| measure | field | p10 / p50 / p90 | histogram |', '|---|---|---|---|',
    `| black market's share | \`safetyProfile.blackMarketCapture\` (%) | ${p3(m.bmc)} | ${hist(m.bmc, [0, 5, 10, 15, 20, 30])} |`,
    `| criminal diversity: rackets | \`safetyProfile.crimeTypes.length\` | ${p3(m.crimeTypes)} | ${hist(m.crimeTypes, [0, 1, 2, 3, 4, 5])} |`,
    `| criminal diversity: operations listed | \`safetyProfile.criminalInstitutions.length\` | ${p3(m.crimInst)} | ${hist(m.crimInst, [0, 1, 2, 3, 4, 5])} |`,
    `| criminal diversity: running chains | \`criminalStructureKey.js :: runningCriminalChains\` | ${p3(m.crimChains)} | ${hist(m.crimChains, [0, 1, 2, 3])} |`,
    `| criminal houses with a face | roster | ${p3(m.crimHousesFaced)} | ${hist(m.crimHousesFaced, [0, 1, 2, 3, 4])} |`,
    `| lawful market spread: income sources | \`economicState.incomeSources.length\` | ${p3(m.lawSources)} | ${hist(m.lawSources, [2, 4, 6, 8, 10, 12])} |`,
    `| lawful market spread: effective sources | 1 / HHI of \`incomeSources[].percentage\` | ${p3(m.lawEff)} | ${hist(m.lawEff, [2, 3, 4, 6, 8, 10])} |`,
    `| lawful market concentration: top source | max \`incomeSources[].percentage\` | ${p3(m.lawTop)} | ${hist(m.lawTop, [20, 30, 40, 50, 60])} |`,
    `| lawful market size: running chains | \`activeChains\` running, not criminal | ${p3(m.lawChains)} | ${hist(m.lawChains, [2, 4, 6, 8, 10, 14])} |`,
    `| lawful market size: exports | \`primaryExports.length\` | ${p3(m.exports)} | ${hist(m.exports, [2, 4, 8, 12, 16])} |`,
    `| lawful market size: local production | \`localProduction.length\` | ${p3(m.localProduction)} | ${hist(m.localProduction, [2, 4, 8, 12, 16])} |`,
    `| criminal operations per lawful effective source | criminalInstitutions.length / (1/HHI) | ${p3(m.opsPerLawful)} | ${hist(m.opsPerLawful, [0.25, 0.5, 0.75, 1, 1.25])} |`,
    `| black market beside the lawful | bmc / (100 - bmc) | ${p3(m.bmcVsLawful)} | ${hist(m.bmcVsLawful, [0.1, 0.2, 0.3, 0.4, 0.6])} |`, '');
  const split = {}; const byTier = {};
  for (const r of set) { const c = choose(r); bump(split, c); bump((byTier[c] ||= {}), r.tier); }
  L.push(`Under the proposed line: ${Object.entries(split).map(([k, v]) => `**${k} ${v}**`).join(' · ')} (${Object.entries(byTier).map(([k, t]) => `${k}: ${Object.entries(t).map(([a, b]) => `${a} ${b}`).join(', ')}`).join('; ')}).`, '');
  return { m, split };
};
L.push('## (4) The captured towns: the black market, criminal diversity, the lawful market', '');
if (captured.length < 20) L.push(`Captured towns at birth: **${captured.length}** — too few for a distribution alone; the same measures follow over every town with an independent criminal power, labelled.`, '');
A.capturedMeasures = table('CAPTURED towns (rung `capture`)', captured);
A.anyCrimMeasures = table('Every town with an independent criminal power (any rung) — LABELLED: not only captured', anyCrim);
// which diversity field is truest: the vocabularies over the towns with an independent criminal power
const vocab = (pick) => { const o = {}; for (const r of anyCrim) for (const t of pick(r)) bump(o, t); return Object.entries(o).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(' · '); };
const corr = (xs, ys) => { const n = xs.length; if (n < 3) return null; const mx = xs.reduce((a, b) => a + b, 0) / n; const my = ys.reduce((a, b) => a + b, 0) / n; let c = 0; let dx = 0; let dy = 0; for (let i = 0; i < n; i++) { c += (xs[i] - mx) * (ys[i] - my); dx += (xs[i] - mx) ** 2; dy += (ys[i] - my) ** 2; } return dx && dy ? r2(c / Math.sqrt(dx * dy)) : null; };
const mm = A.anyCrimMeasures.m;
L.push('**Which criminal diversity is truest.** The three candidates\' vocabularies over the towns with an independent criminal power:', '',
  `- \`crimeTypes\` (prose lines): ${vocab((r) => r.crimeTypes)}`,
  `- \`criminalInstitutions\` (the roster's operations): ${vocab((r) => r.crimInst)}`,
  `- running criminal chains: ${vocab((r) => r.crimChains)}`, '',
  `Correlations (same towns): operations x criminal houses with a face ${corr(mm.crimInst, mm.crimHousesFaced)}; crimeTypes x operations ${corr(mm.crimeTypes, mm.crimInst)}; crimeTypes x blackMarketCapture ${corr(mm.crimeTypes, mm.bmc)}; operations x blackMarketCapture ${corr(mm.crimInst, mm.bmc)}.`, '');
L.push('**The proposed line (figures, not law).**', '', '| side | reads | figure |', '|---|---|---|',
  `| CRIME BOSSES | the criminal trade is spread over several operations | \`criminalInstitutions.length\` >= ${LINE.OPS_MIN} |`,
  `| | spread at least ${LINE.OPS_PER_LAWFUL_MIN} as wide as the lawful market | \`criminalInstitutions.length\` / (1 / HHI of \`incomeSources[].percentage\`) >= ${LINE.OPS_PER_LAWFUL_MIN} |`,
  `| | and large | \`blackMarketCapture\` >= ${LINE.BMC_MIN} (bmc / lawful (100 - bmc) >= ${r2(LINE.BMC_MIN / (100 - LINE.BMC_MIN))}) |`,
  '| ONE UNDERBOSS | any one of the three fails: narrow, narrow beside the lawful market, or small | |', '');

// (5) the top three / top one of the criminal power's own open members
const pickOf = (r) => {
  const p = r.crimPowers.find((x) => x.name === r.hall.underworld) || r.crimPowers.find((x) => !x.governing) || null;
  if (!p) return { power: null, pool: [], top3: [], top1: null };
  const pool = p.members.filter((m) => !m.isLord && !m.inHall && !m.agent)
    .sort((a, b) => (INFLUENCE_RANK[b.influence] || 0) - (INFLUENCE_RANK[a.influence] || 0) || b.npcPower - a.npcPower || (a.rank ?? 9) - (b.rank ?? 9) || a.at - b.at);
  return { power: p.name, pool, top3: pool.slice(0, 3), top1: pool[0] || null };
};
const fewer = {}; const poolSizes = []; const top1Rank = {}; const top3Infl = {}; const excludedHall = [];
for (const r of captured) {
  const pk = pickOf(r);
  poolSizes.push(pk.pool.length); bump(fewer, pk.pool.length >= 3 ? '3+' : String(pk.pool.length));
  bump(top1Rank, pk.top1 ? `rank ${pk.top1.rank ?? 'none'} (${pk.top1.influence})` : '(none)');
  for (const m of pk.top3) bump(top3Infl, m.influence);
  const p = r.crimPowers.find((x) => x.name === pk.power);
  if (p) excludedHall.push(p.members.filter((m) => m.isLord || m.inHall).length);
}
const wide = rows.filter((r) => (r.rung === 'capture' || r.rung === 'corrupted') && r.crimPowers.some((p) => !p.governing));
const fewerWide = {}; for (const r of wide) { const n = pickOf(r).pool.length; bump(fewerWide, n >= 3 ? '3+' : String(n)); }
const fewerAny = {}; for (const r of anyCrim) { const n = pickOf(r).pool.length; bump(fewerAny, n >= 3 ? '3+' : String(n)); }
L.push('## (5) The criminal power\'s own open members, top three and top one by `influence` (captured towns)', '',
  'The power is the hall\'s `underworld` (`hallCaptureOf`: the strongest criminal power that is not the ruler). Its OWN OPEN members: cards whose `memberships` name it, never the lord (rank 1 of the governing power), never any member of the governing power (the hall), never an agent (a card holding an `allegiance`). Stable tie order: `influence` (high > moderate > low), then the card\'s numeric `power` descending, then its rank in the criminal power (1, 2, 3, unranked), then roster order.', '',
  `Pool size per captured town p10/p50/p90 ${p3(poolSizes)}; towns with 0 / 1 / 2 / 3+ such people: ${['0', '1', '2', '3+'].map((k) => fewer[k] || 0).join(' / ')} — **${(fewer['0'] || 0) + (fewer['1'] || 0) + (fewer['2'] || 0)} of ${captured.length} captured towns have fewer than three**.`, '',
  `Top one: ${Object.entries(top1Rank).map(([k, v]) => `${k} ${v}`).join(' · ') || '–'}. Top three\'s influence: ${Object.entries(top3Infl).map(([k, v]) => `${k} ${v}`).join(' · ') || '–'}. Members excluded as the lord or the hall, per town: ${p3(excludedHall)}.`, '',
  `LABELLED, wider sets (the same rule): corrupted or captured towns with an independent criminal power (${wide.length}): 0 / 1 / 2 / 3+ = ${['0', '1', '2', '3+'].map((k) => fewerWide[k] || 0).join(' / ')}; every town with an independent criminal power (${anyCrim.length}): ${['0', '1', '2', '3+'].map((k) => fewerAny[k] || 0).join(' / ')}.`, '');

// (6) twelve towns as plain text
const order = [...captured, ...rows.filter((r) => r.rung === 'corrupted' && r.crimPowers.some((p) => !p.governing)), ...rows.filter((r) => r.rung === 'corrupted')];
const twelve = [...new Map(order.map((r) => [r.seed, r])).values()].slice(0, 12);
L.push('## (6) Twelve towns (the captured first, then the nearest rung)', '');
for (const r of twelve) {
  const pk = pickOf(r); const c = choose(r);
  const who = (m) => `${m.name} (${m.house || m.kind || 'no house'}${m.title ? `, ${m.title}` : ''}; ${m.influence}, rank ${m.rank ?? '–'})`;
  L.push(`- **${r.seed}** — form ${r.form}; front's leader ${r.lord ? `${r.lord.name} (${r.lord.house || '–'}, ${r.lord.title || '–'}${r.lord.agent ? ', an agent' : ''})` : '(none on record)'}; rung **${r.rung}** (agents at ranks ${r.hall.agentRanks.join(',') || '–'}); underworld ${r.hall.underworld || '–'}; bmc ${r.bmc}, criminal operations ${r.crimInst.length} against lawful effective sources ${r.lawful.effSources}.`,
    `  Card: **${c}** — ${c === 'CRIME BOSSES' ? (pk.top3.length ? pk.top3.map(who).join('; ') : '(no open member on record)') : (pk.top1 ? who(pk.top1) : '(no open member on record)')}${c === 'CRIME BOSSES' && pk.top3.length < 3 ? ` [only ${pk.top3.length} on record]` : ''}.`);
}
L.push('');

// (7) the public difference
const capRows = captured.filter((r) => r.publicDiff);
L.push('## (7) The public difference: a captured town and the same town uncaptured', '',
  'The twin is the SAME born record with the hall re-written at a lower rung through the one writer and its relation reader (`hallCapture.js :: writeHallCapture` with `rederive`, then `factionDynamics.js :: withCaptureRelations`) — the derivation\'s own path, nothing minted. Diffed: the owner\'s `powerStructure`, then `publicSafe.js :: toPublicSafe` (the non-owner served document, default mode) and `publicVeiledRecordOf` (the audience-gated readers\' record).', '');
for (const t of ['corrupted', 'none']) {
  const agg = { owner: {}, toPublicSafe: {}, publicVeiledRecordOf: {} };
  for (const r of capRows) for (const k of Object.keys(agg)) { const seen = new Set(r.publicDiff[t][k]); for (const p of seen) bump(agg[k], p); if (!seen.size) bump(agg[k], '(identical)'); }
  L.push(`**Twin at \`${t}\`** over ${capRows.length} captured towns:`, '');
  for (const k of Object.keys(agg)) L.push(`- ${k}: ${Object.entries(agg[k]).sort((a, b) => b[1] - a[1]).map(([p, v]) => `\`${p}\` ${v}`).join(' · ') || '–'}`);
  L.push('');
}
const leaks = {}; for (const r of capRows) for (const [k, v] of Object.entries(r.publicDiff.leaks)) { if (typeof v === 'boolean') bump(leaks, `${k}=${v}`); }
const lordKeys = {}; for (const r of capRows) bump(lordKeys, (r.publicDiff.leaks.lordCardPublicKeys || ['(no lord)']).join(','));
const govCatPub = {}; for (const r of capRows) bump(govCatPub, String(r.publicDiff.leaks.govCategory));
L.push(`What the captured town's public document still carries (toPublicSafe, ${capRows.length} towns): ${Object.entries(leaks).sort().map(([k, v]) => `${k} ${v}`).join(' · ')}; the governing row's public \`category\`: ${Object.entries(govCatPub).map(([k, v]) => `${k} ${v}`).join(' · ')}; the underworld's name occurrences in the public JSON p10/p50/p90 ${p3(capRows.map((r) => r.publicDiff.leaks.underworldNamed || 0))}; relation rows owner ${p3(capRows.map((r) => r.publicDiff.leaks.relRowsOwner))} vs public ${p3(capRows.map((r) => r.publicDiff.leaks.relRowsPublic))}; the lord's public card keys: ${Object.entries(lordKeys).map(([k, v]) => `[${k}] ${v}`).join(' · ')}; criminal-power members outside the hall on record ${p3(capRows.map((r) => r.publicDiff.leaks.crimFacesOnRecord))}, of them with a public \`title\` ${p3(capRows.map((r) => r.publicDiff.leaks.crimFacesPublicTitle))}.`, '');

writeFileSync(join(HERE, `capture-${ARM}.json`), `${JSON.stringify({ meta, line: LINE, summary: { rungs: A.rungs, rungByTier: A.rungByTier, rederiveMismatch: A.rederiveMismatch, powers: A.powers, houses: A.houses, crimeForms: A.crimeForms, probeA, probeB, captured: captured.length, anyIndependentCriminal: anyCrim.length, fewerThanThree: fewer }, rows }, null, 0)}\n`);
writeFileSync(join(HERE, `capture-${ARM}.md`), `${L.join('\n')}\n`);
process.stderr.write(`wrote capture-${ARM} (${towns} towns, ${meta.errors} errors, ${meta.seconds}s, captured ${captured.length})\n`);
