// RUN (from the repository root): node docs/chair/2026-11-20/content/page/measures/A/simulateA.mjs "$PWD" > docs/chair/2026-11-20/content/page/measures/A/simulateA.out.txt 2>&1
// PAGE-1 helper A, the coordinator's added work: (0) verify the chair's reading helper's leads on the 300; (V) the visitor's
// odds today and under three proposed steps, SIMULATED on the born records (no src edit): each step re-keys the printed
// tension texts / sides, then the exact P(at least two of three distinct towns share) over every triple.
// Keys, not prose: a variant or a new wording is keyed `${type}#vK` / `${type}#newK` (its {tokens} unrendered), so a step's
// sharing is an UPPER bound where a wording carries a town-specific token ({resource}, {demands}, {quarter}).
const L = process.argv[2]; const N = 50; const R = Number(process.argv[3] || 20);
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
const { HISTORICAL_EVENTS_DATA } = await import(`${L}/src/data/historyData.js`);
const { HISTORY_DESC_VARIANTS } = await import(`${L}/src/data/historyDescVariants.js`);
const { factsOf } = await import(`${L}/src/domain/facts/factsOf.js`);
const { crimeSignalOf } = await import(`${L}/src/domain/crimeSignal.js`);
const { nativeSemanticNames } = await import(`${L}/src/domain/content/customContentSemanticAuthority.js`);
await loadGenerationLawPayloads();
const towns = [];
for (const size of SIZES) for (let i = 0; i < N; i++) { const seed = `hxd-${size}-${i}`; const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} }); t.__seed = seed; t.__size = size; towns.push(t); }
const out = (...a) => console.log(...a);
const pct = (a, b) => (b ? `${(100 * a / b).toFixed(1)}%` : 'n/a');
const tally = (a) => { const m = new Map(); for (const k of a) m.set(k, (m.get(k) || 0) + 1); return [...m].sort((x, y) => y[1] - x[1]); };
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ── (0) THE LEADS ──
const H = HISTORICAL_EVENTS_DATA;
const SUBST = ['Wealthy merchants', 'Legitimate heir', 'Corrupt officials', 'Official guards', 'Criminal organisations', 'Orthodox believers', 'Power behind throne']; // historyGenerator.js:568-574
const baseSlots = H.flatMap((e) => e.factions || []);
const allSlots = H.flatMap((e) => [...(e.factions || []), ...(e.byMemory?.dated?.factions || []), ...(e.byMemory?.unanchored?.factions || [])]);
out(`(0) LEADS. kinds in HISTORICAL_EVENTS_DATA: ${H.length}; with exactly 3 base sides: ${H.filter((e) => (e.factions || []).length === 3).length}; with an unanchored form: ${H.filter((e) => e.byMemory?.unanchored).length} (of which with own unanchored description ${H.filter((e) => e.byMemory?.unanchored?.description).length}, own unanchored sides ${H.filter((e) => e.byMemory?.unanchored?.factions).length}); with a dated form: ${H.filter((e) => e.byMemory?.dated).length}; with descriptionByDirection: ${H.filter((e) => e.descriptionByDirection).length}`);
out(`HISTORY_DESC_VARIANTS: ${Object.keys(HISTORY_DESC_VARIANTS).length} kinds, sizes ${tally(Object.values(HISTORY_DESC_VARIANTS).map((v) => v.length)).map(([k, c]) => `${k}x${c}`).join(', ')}; kinds without: ${H.filter((e) => !HISTORY_DESC_VARIANTS[e.type]).map((e) => e.type).join(', ') || 'none'}`);
out(`side slots: base ${baseSlots.length}, of which substituted by substituteNames (historyGenerator.js:568-574) ${baseSlots.filter((s) => SUBST.includes(s)).length}; all side lists incl. memory forms ${allSlots.length}, substituted ${allSlots.filter((s) => SUBST.includes(s)).length}`);
const tensions = towns.flatMap((t) => (t.history?.currentTensions || []).map((x) => ({ t, x })));
const byKind = tally(tensions.map(({ x }) => x.type));
out(`kind shares on the 300 (towns carrying the kind / 300; and share of the ${tensions.length} tensions): ` + byKind.map(([k]) => { const n = new Set(tensions.filter(({ x }) => x.type === k).map(({ t }) => t.__seed)).size; return `${k} ${pct(n, towns.length)} / ${pct(tensions.filter(({ x }) => x.type === k).length, tensions.length)}`; }).join('; '));

// ── seeded rng ──
const mulberry = (a) => () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const tripleOdds = (keysList) => {
  const n = keysList.length; const ks = keysList.map((k) => new Set(k));
  const share = Array.from({ length: n }, () => new Uint8Array(n));
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { let s = 0; for (const k of ks[i]) if (ks[j].has(k)) { s = 1; break; } share[i][j] = share[j][i] = s; }
  let hit = 0, tot = 0;
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const sij = share[i][j]; const ri = share[i], rj = share[j]; for (let k = j + 1; k < n; k++) { tot++; if (sij || ri[k] || rj[k]) hit++; } }
  return hit / tot;
};
const odds = (keysOf) => { const all = tripleOdds(towns.map(keysOf)); const per = Object.fromEntries(SIZES.map((s) => [s, tripleOdds(towns.filter((t) => t.__size === s).map(keysOf))])); return { all, per }; };

// ── the forms of a printed tension (to know whether today's text is a variant) ──
const formRe = (text) => new RegExp(`^${esc(text).replace(/\\\{[a-z_]+\\\}/g, '.+?').replace(/\btown\b/g, '\\w+')}$`, 'i');
const variantIndex = (type, desc) => (HISTORY_DESC_VARIANTS[type] || []).findIndex((v) => formRe(v).test(desc));

// ── step 2's side naming: the role table and the presumption table (as measureA.mjs) ──
const instNames = (t) => nativeSemanticNames(t.institutions || []).map((s) => s.toLowerCase());
const fac = (t) => t.powerStructure?.factions || [];
const ROLE = [
  [/^(Wealthy merchants|Merchants who benefit|Merchants tied|Merchants who trade|Displaced traders|Traders who fear|Creditors calling|Ruined speculators|the merchant class$)/i, (t) => fac(t).filter((f) => f.category === 'economy' && /merchant|trade|bank|guild/i.test(f.faction)).map((f) => f.faction)],
  [/^(Established guilds|Upstart guilds|Guild members)/i, (t) => fac(t).filter((f) => /guild/i.test(f.faction)).map((f) => f.faction)],
  [/^(Orthodox believers|the orthodox clergy$|Temple beneficiaries|The accusers)/i, (t) => fac(t).filter((f) => f.category === 'religious').map((f) => f.faction)],
  [/^(Official guards|Local enforcement$|Security hardliners|Quarantine hardliners|Prepare for war)/i, (t) => fac(t).filter((f) => f.category === 'military').map((f) => f.faction)],
  [/^(Criminal organisations|the criminal network$|Actual agents)/i, (t) => [...fac(t).filter((f) => f.category === 'criminal').map((f) => f.faction), ...(t.institutions || []).filter((i) => i.priorityCategory === 'criminal').map((i) => String(i.name))]],
  [/^(Corrupt officials|The sitting authority|Those in charge|Authorities caught|Authorities exploiting|Those in authority|Price regulators|Those who would fix a fair price)/i, (t) => fac(t).filter((f) => f.isGoverning).map((f) => f.faction)],
  [/^(Old families|Original claimants|Landowners|Collaborator families|Loyalist families)/i, (t) => fac(t).filter((f) => /noble|gentry|landed|lord|famil|house|clan/i.test(f.faction) && !f.isGoverning).map((f) => f.faction)],
  [/^(Healers and charlatans)/i, (t) => instNames(t).filter((n) => /healer|hospital|physician|herbal|apothec|infirm/.test(n))],
  [/^(Scholars studying|Those who would study)/i, (t) => [...fac(t).filter((f) => f.category === 'magic').map((f) => f.faction), ...instNames(t).filter((n) => /academ|universit|college|librar|mage|wizard|arcan|scriptor/.test(n))]],
  [/^(Legal class)/i, (t) => instNames(t).filter((n) => /court|scribe|notar|law|magistr|advocat/.test(n))],
  [/^(Pro-magic|Regulation advocates|The changed|Those touched by the flares)/i, (t) => fac(t).filter((f) => /arcane|mage|wizard|magic/i.test(f.faction)).map((f) => f.faction)],
];
const PRESUMED = [ // side -> the house it presumes (F2.1) -> lacks?
  [/^Legal class/i, (t, f) => !(f.legalHouse === true || f.courtSits === true)],
  [/^(Merchants who benefit|Merchants tied|Merchants who trade|the merchant class$|Displaced traders|Traders who fear|Price regulators)/i, (t, f) => f.market !== true],
  [/^Creditors calling/i, (t, f) => !(f.market === true || f.hasInstitution?.('bank') === true)],
  [/guild/i, (t, f) => f.guild !== true],
  [/^(Temple beneficiaries|the orthodox clergy$)/i, (t, f) => !(f.hasInstitution?.('temple') === true || f.sacredHouse === true)],
  [/^Healers and charlatans/i, (t, f) => !(f.defence?.healer === true || f.defence?.hospital === true)],
  [/^Scholars studying/i, (t, f) => !(f.hasInstitution?.('school') === true || instNames(t).some((n) => /academ|universit|college|librar|mage|wizard|arcan|scriptor/.test(n)))],
  [/^Local enforcement$/i, (t, f) => !(f.defence?.watch || f.defence?.garrison || f.defence?.militia)],
  [/^the criminal network$/i, (t) => !crimeSignalOf({ seats: fac(t), estate: t.institutions || [] }).present],
];
const factsC = new Map(); const factsFor = (t) => { if (!factsC.has(t)) factsC.set(t, factsOf(t)); return factsC.get(t); };
let renamed = 0, dropped = 0, sidesTotal = 0; const droppedWhat = [];
for (const { t, x } of tensions) {
  x.__sides2 = [];
  for (const s of x.factions || []) {
    sidesTotal++;
    const role = ROLE.find(([re]) => re.test(s));
    const cand = role ? role[1](t) : [];
    if (cand.length && !cand.includes(s)) { x.__sides2.push(cand[0]); renamed++; continue; }
    const pres = PRESUMED.find(([re]) => re.test(s));
    if (pres && pres[1](t, factsFor(t))) { dropped++; droppedWhat.push(s); continue; }
    x.__sides2.push(s);
  }
}
out(`\n(V) step 2's side naming on the ${sidesTotal} printed sides: renamed from the record ${renamed} (${pct(renamed, sidesTotal)}), DROPPED as a house the town lacks ${dropped} (${pct(dropped, sidesTotal)}): ${tally(droppedWhat).map(([k, c]) => `${k} ${c}`).join(', ')}; tensions left with < 2 sides: ${tensions.filter(({ x }) => x.__sides2.length < 2).length}`);

// ── the steps ──
const top8 = byKind.slice(0, 8).map(([k]) => k);
out(`the eight commonest kinds (by tensions): ${top8.join(', ')}`);
const keyToday = (x) => x.description;
const options = (x, extra) => {
  const vi = variantIndex(x.type, x.description);
  const own = vi >= 0 ? `${x.type}#base-or-memory` : x.description;
  const opts = [own, ...(HISTORY_DESC_VARIANTS[x.type] || []).map((_, k) => `${x.type}#v${k + 1}`)];
  if (extra && top8.includes(x.type)) for (let k = 0; k < extra; k++) opts.push(`${x.type}#new${k + 1}`);
  return opts;
};
const sideKey = (sides) => sides.join(' | ');
const fmt = (o) => `${(100 * o.all).toFixed(1)}% | ${SIZES.map((s) => `${s} ${(100 * o.per[s]).toFixed(1)}%`).join(', ')}`;
const meanOf = (runs) => ({ all: runs.reduce((a, r) => a + r.all, 0) / runs.length, per: Object.fromEntries(SIZES.map((s) => [s, runs.reduce((a, r) => a + r.per[s], 0) / runs.length])), lo: Math.min(...runs.map((r) => r.all)), hi: Math.max(...runs.map((r) => r.all)) });
const tOf = (t) => (t.history?.currentTensions || []);
out('\nP(at least two of three distinct towns share ... word for word), exact over every triple; a step is the mean of R seeded draws (min-max beside)');
out(`TODAY  tension text:            ${fmt(odds((t) => tOf(t).map(keyToday)))}`);
out(`TODAY  side set:                ${fmt(odds((t) => tOf(t).map((x) => sideKey(x.factions || []))))}`);
out(`TODAY  card (text AND sides):   ${fmt(odds((t) => tOf(t).map((x) => `${keyToday(x)} || ${sideKey(x.factions || [])}`)))}`);
for (const [label, extra, named] of [['STEP 1 (base + 2 variants, uniform)', 0, false], ['STEP 2 (1 + sides named / dropped)', 0, true], ['STEP 3 N=3 (2 + 3 new wordings, top 8 kinds)', 3, true], ['STEP 3 N=6 (2 + 6 new wordings, top 8 kinds)', 6, true]]) {
  const runs = { text: [], card: [], sides: [] };
  for (let r = 0; r < R; r++) {
    const rnd = mulberry(1000 + r);
    for (const { x } of tensions) { const o = options(x, extra); x.__k = o[Math.floor(rnd() * o.length)]; }
    runs.text.push(odds((t) => tOf(t).map((x) => x.__k)));
    runs.card.push(odds((t) => tOf(t).map((x) => `${x.__k} || ${sideKey(named ? x.__sides2 : x.factions || [])}`)));
    if (r === 0) runs.sides.push(odds((t) => tOf(t).map((x) => sideKey(named ? x.__sides2 : x.factions || []))));
  }
  const m = meanOf(runs.text), c = meanOf(runs.card);
  out(`${label.padEnd(46)} text: ${fmt(m)} (min-max ${(100 * m.lo).toFixed(1)}-${(100 * m.hi).toFixed(1)}%)`);
  out(`${''.padEnd(46)} side set: ${fmt(runs.sides[0])}`);
  out(`${''.padEnd(46)} card: ${fmt(c)}`);
}
