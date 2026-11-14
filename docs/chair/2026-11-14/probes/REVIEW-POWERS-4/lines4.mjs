// REVIEW-POWERS-4 lines4.mjs — TREE=<tree> CORPUS=<corpus.ndjson.gz> DUMPS=<dumps dir> [BCORPUS=<base corpus>] OUT=<file.json> node lines4.mjs
// Every new or reworded line of 96a6ced46..3909655c3 (the lane's own commits), found where it PRINTS (the rendered dump of
// the town, every dossier view as its owner sees it) and read against the town's own record. One row per line class:
// prints, towns, sizes, crisis towns, the script's true/false, examples. A row's test is a PROXY where marked; the verdict
// in REVIEW-POWERS-4-LINES-READ.md is the reader's, read from the examples. Draws nothing; reads only.
import fs from 'node:fs'; import zlib from 'node:zlib';
const T = process.env.TREE;
const load = (f) => zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n').map((l) => JSON.parse(l));
const rows = load(process.env.CORPUS);
const BASE = process.env.BCORPUS ? new Map(load(process.env.BCORPUS).map((r) => [r.seed, r.s])) : new Map();
const dumpOf = (seed) => { if (!process.env.DUMPS) return null; try { return fs.readFileSync(`${process.env.DUMPS}/${seed}.txt`, 'utf8'); } catch { return null; } };
const { DEFENSE_BUCKET_KEYWORDS } = await import(T + '/src/domain/institutions/defenseInstitutionBuckets.js');
const { GOAL_FAMILY_LINES } = await import(T + '/src/data/people/goalFamilies.js');
const { TITLE_LINE_DECLARATIONS } = await import(T + '/src/data/people/titleSecretsPresentations.js');
const { resolveGenerationContentProfile } = await import(T + '/src/domain/generationContentProfile.js');
const { powerOrderOf, structuralStandingOf } = await import(T + '/src/domain/people/membership.js');
const { isCriminalInstitution } = await import(T + '/src/domain/corruption.js');
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const R = {}; let NEW = null;
const add = (k, seed, s, ok, note) => {
  const r = (R[k] ||= { prints: 0, towns: new Set(), true: 0, false: 0, sizes: {}, crisisTowns: new Set(), onPage: 0, newPrints: 0, newTrue: 0, newFalse: 0, examples: [], falses: [], newFalses: [], newExamples: [] });
  r.prints++; r.towns.add(seed); r.sizes[s.tier] = (r.sizes[s.tier] || 0) + 1; if (stressOf(s).length) r.crisisTowns.add(seed);
  if (NEW) { r.newPrints++; if (ok) { r.newTrue++; if (r.newExamples.length < 30) r.newExamples.push(`${seed}: ${note}`.slice(0, 600)); } else { r.newFalse++; if (r.newFalses.length < 60) r.newFalses.push(`${seed}: ${note}`.slice(0, 700)); } }
  if (ok) { r.true++; if (r.examples.length < 25) r.examples.push(`${seed}: ${note}`.slice(0, 500)); } else { r.false++; if (r.falses.length < 60) r.falses.push(`${seed}: ${note}`.slice(0, 600)); } };
const stressOf = (s) => (Array.isArray(s.stress) ? s.stress : s.stress ? [s.stress] : []).map((x) => x?.type).filter(Boolean);
const lc = (x) => String(x || '').toLowerCase();
const onPage = (d, text) => { if (!d || !text) return false; const t = String(text).replace(/\.$/, ''); return d.includes(t) || d.includes(t.charAt(0).toLowerCase() + t.slice(1)); };
// the goal templates of the stage's SUPPLY rows, as regexes over the filled text ({house} → (.+), {resource} → (.+))
const tmplRe = (t) => new RegExp('^' + t.replace(/[.*+?^$()|[\]\\]/g, '\\$&').replace(/\{house\}/g, '(.+?)').replace(/\{resource\}/g, '(.+?)').replace(/\{chain\}/g, '(.+?)') + '$');
const SUP = [];
for (const kind of ['impaired', 'dependency', 'expansion']) for (const v of ['short', 'long']) for (const l of GOAL_FAMILY_LINES.SUPPLY[kind][v]) {
  const line = typeof l === 'string' ? l : l.line; SUP.push({ kind, v, line, re: tmplRe(line), excludes: (typeof l === 'string' ? [] : l.excludes || []) }); }
const PERSONS = new Set([...Object.entries(TITLE_LINE_DECLARATIONS.secret), ...Object.entries(TITLE_LINE_DECLARATIONS.presentation)].filter(([, d]) => Array.isArray(d.topic)).map(([k]) => k));
const CLERGY = 'Clergy are present but operate at the margins of civic life';
const LESSER = 'Minor landed families with limited political reach';
const LOCALM = 'Merchants with local reach; a consistent civic presence without yet being the dominant commercial voice.';
const LEADM = 'Merchants with local reach; a consistent civic presence, though other powers set the course here.';
const GENTRY = 'Gentry families with local landholdings; active in civic politics but outpaced by merchant capital';
const NOBCOMP = 'Noble families with hereditary land rights and traditional privileges; active in civic politics and competitive with merchant capital.';
const WATCH1 = 'Well-funded city watch; it keeps order reliably and is growing more sure of its own authority.';
const WATCH2 = 'City watch; law enforcement and external defence, stretched between multiple responsibilities.';
const CRIMCOUNCIL = 'Organised criminal network controls the black market and several informal revenue streams; present in council discussions through intermediaries.';
const CRIMPROT = 'A local protection operation tolerated because the alternative is open conflict with people who know the terrain better.';
const CRIMSHADOW = 'Criminal network operating in shadows; controls illicit trade and profits from the gap between law and enforcement.';
const MERCHANT = /merchant|trade|commerc|consortium|mercantile/i;
const COUNCIL = /council|assembly|senate|parliament|moot/i;
const CLASS = /(Major church institutions hold structural influence|Militarised noble families|structurally embedded in governance|Standing army with genuine political weight|The ruling class and the merchant class are the same people|Dominant commercial class|direct temporal power|holds substantial temporal power|substantial political leverage|genuine political weight; their services|Underworld effectively controls|captured significant influence|International merchant houses controlling|whose hereditary rights, land rents)/;
const ARMED = /military|guard|watch|garrison|militia|army|legion|order of the/i;
for (const { seed, s } of rows) {
  const d = dumpOf(seed); const b = BASE.get(seed);
  const st = stressOf(s); const F = s.powerStructure?.factions || []; const gov = F.find((f) => f.isGoverning);
  const npcs = s.npcs || []; const PO = powerOrderOf(s); const firstOf = (c) => { const st0 = structuralStandingOf(c, PO); return { st0, mine: st0.power ? F.find((f) => f.faction === st0.power) : null }; };
  const instByName = new Map((s.institutions || []).map((i) => [lc(i.name), i])); const insts = (s.institutions || []).map((i) => lc(i.name));
  const bCard = new Map((b?.npcs || []).map((n) => [n.id, n])); const bFac = new Map((b?.powerStructure?.factions || []).map((f) => [f.faction, f]));
  const boundaries = resolveGenerationContentProfile(s.config || s._config || {}).boundaries || {};
  // ── L1-L3 the styled honorifics (faceHonorifics.js): the alewife, the midwife, the madam, the district madam
  for (const c of npcs) {
    const words = { 'the alewife': ['Brewster', 'Alewife'], 'the midwife': ['Goodman', 'Midwife', 'Goodwife'], 'the madam': ['Master', 'Madam'], 'the district madam': ['Master', 'Madam'] }[c.title];
    if (!words || !d) continue; const first = String(c.name).split(' ')[0];
    for (const w of words) for (const form of [`${w} ${c.name}`, `${w} ${first} `]) if (d.includes(form)) {
      const fem = ['Alewife', 'Midwife', 'Goodwife', 'Madam'].includes(w), masc = ['Goodman', 'Master'].includes(w);
      NEW = null; add(`L0 honorific ${c.title} · ${w}`, seed, s, fem ? c.gender === 'female' : masc ? c.gender !== 'female' : true, `${w} ${c.name} (${c.gender}, ${c.title})`); break; }
  }
  // ── L4-L6 the SUPPLY goals (goalFamilies.js): the template, its kind, the crisis it is refused under, the house it names
  const chains = [...(s.economicState?.supplyChains || s.economicState?.chains || []), ...(s.resourceAnalysis?.chains || [])];
  for (const c of npcs) for (const v of ['short', 'long']) {
    const text = c.goal?.[v]; const intent = c.goal?.intent?.[v]; if (!text || intent?.family !== 'SUPPLY') continue;
    const m = SUP.find((x) => x.v === v && x.re.test(text)); if (!m) continue;
    const bt = bCard.get(c.id)?.goal?.[v]; NEW = bt !== undefined ? bt !== text : null;
    const sieged = st.includes('under_siege'), famined = st.includes('famine');
    const bad = (m.excludes.includes('crisis: siege') && sieged) || (m.excludes.includes('crisis: famine') && famined);
    const house = (text.match(m.re) || [])[1];
    const where = onPage(d, text) ? 'onPage' : 'NOT on page';
    add(`L${m.kind === 'impaired' ? 4 : m.kind === 'dependency' ? 5 : 6} SUPPLY ${m.kind}.${v}: ${m.line.slice(0, 70)}`, seed, s, !bad,
      `${c.name} (${c.title}) [${st.join('+') || 'calm'} ${s.tier}] slot=${house} target=${JSON.stringify(intent.target)} ${where} :: ${text}`);
    add(`L4-6 SUPPLY house slot fills`, seed, s, true, `${house}`);
  }
  // ── L7 the refused charter (goals.js): no INSTITUTION charter goal on a criminal house's card or on the governing power's head
  for (const c of npcs) for (const v of ['short', 'long']) {
    const intent = c.goal?.intent?.[v]; if (!intent) continue;
    const headOfGov = !!gov && (c.memberships || []).some((m) => m.power === gov.faction && Number(m.rank) === 1);
    const bI = bCard.get(c.id)?.goal?.intent?.[v]; NEW = bI ? JSON.stringify(bI) !== JSON.stringify(intent) : null;
    const ik = c.institution?.kind === 'house' ? lc(c.institution.key) : ''; const crimHouse = !!ik && !!instByName.get(ik) && isCriminalInstitution(instByName.get(ik));
    if (intent.family === 'INSTITUTION' && intent.kind === 'charter') add('L7 charter goal printed', seed, s, !headOfGov && !crimHouse, `crimHouse=${crimHouse} ` + `${c.name} (${c.title}) headOfGov=${headOfGov} inst=${JSON.stringify(c.institution)} :: ${c.goal[v]}`);
    if (bI && bI.family === 'INSTITUTION' && bI.kind === 'charter' && !(intent.family === 'INSTITUTION' && intent.kind === 'charter')) add('L7r charter refused: what prints in its place', seed, s, true, `${c.name} (${c.title}, ${c.category}) headOfGov=${headOfGov} inst=${JSON.stringify(c.institution)} gov=${gov?.faction} :: WAS ${bCard.get(c.id).goal[v]} :: NOW [${intent.family}.${intent.kind}] ${c.goal[v]}`);
  }
  // ── L8 the persons-held lines (titleSecretsPresentations.js): only where slavery AND trafficking are both admitted
  for (const c of npcs) for (const [k, text] of [['secret', c.secret?.what], ['presentation', c.presentation?.impression]]) {
    if (!text) continue; const bt = k === 'secret' ? bCard.get(c.id)?.secret?.what : bCard.get(c.id)?.presentation?.impression; NEW = bt !== undefined ? bt !== text : null;
    if (PERSONS.has(text)) add('L8 persons-held line printed', seed, s, boundaries.slavery === true && boundaries.human_trafficking === true, `${c.name} (${c.title}) profile=${(s.config || {}).contentProfile} slavery=${boundaries.slavery} traf=${boundaries.human_trafficking} :: ${text}`);
    if (bt && PERSONS.has(bt) && !PERSONS.has(text)) add(`L8r persons-held replaced (${k})`, seed, s, true, `${c.name} (${c.title}) :: WAS ${bt} :: NOW ${text}`);
  }
  // ── L9 the armed rows (npcStructure.js UNDER_KINDS.military)
  const armed = F.filter((f) => f.category === 'military');
  for (const c of npcs) {
    const pos = String(c.structuralPosition || ''); if (!pos) continue;
    const { st0, mine } = firstOf(c);
    const headsArmedKind = st0.standing === 'head' && mine?.category === 'military' && armed.every((f) => (f.power || 0) <= (mine.power || 0));
    NEW = bCard.has(c.id) ? bCard.get(c.id).structuralPosition !== c.structuralPosition : null;
    if (/^Leads a squad/.test(pos)) add('L9a "Leads a squad…" row', seed, s, !(st0.standing === 'head' && mine?.category === 'military'), `${c.name} (${c.title}) rank=${c.structuralRank} p1=${mine?.faction}/${mine?.category}/${mine?.power} :: ${pos}`);
    if (/^Commands those under arms/.test(pos)) add('L9b "Commands those under arms…" row', seed, s, headsArmedKind || c.isHolder || (gov && mine === gov), `${c.name} (${c.title}, ${c.category}) rank=${c.structuralRank} p1=${mine?.faction}/${mine?.category}/${mine?.power} armed=${armed.map((f) => f.faction + ':' + f.power).join(',')} :: ${pos}`);
  }
  // ── L10 the body rows (npcStructure.js BODY_KINDS): a row of the card's own body only where its first-rank power is that body
  const BODY = { government: ['government'], other: ['noble'], religious: ['religious'], criminal: ['criminal'], magic: ['magic'] };
  for (const c of npcs) {
    const kinds = BODY[c.category]; const pos = String(c.structuralPosition || ''); if (!kinds) continue;
    const { st0, mine } = firstOf(c);
    const holder = /Holds the seat|keeps the seat/i.test(pos);
    const ok = !!mine && (kinds.includes(mine.category) || (c.category === 'government' && mine.isGoverning));
    const bp = bCard.get(c.id)?.structuralPosition; NEW = bp !== undefined ? bp !== c.structuralPosition : null;
    if (pos && !holder) add(`L10 body row (${c.category})`, seed, s, ok, `${c.name} (${c.title}) p1=${mine?.faction}/${mine?.category}${mine?.isGoverning ? '/GOV' : ''} :: ${pos}`);
    if (bp && !c.structuralPosition) add(`L10r body row removed (${c.category})`, seed, s, true, `${c.name} (${c.title}, ${c.gender}) rank=${c.structuralRank} p1=${mine?.faction}/${mine?.category}/${mine?.power}${mine?.isGoverning ? '/GOV' : ''} mships=${(c.memberships || []).map((x) => x.power + '#' + x.rank).join(',')} gov=${gov?.faction} :: WAS ${bp} | goal ${bCard.get(c.id)?.goal?.short} -> ${c.goal?.short}`);
  }
  // ── L11 the claim rungs (claimStanding.js), each read against the final roster
  const watchStands = insts.some((n) => DEFENSE_BUCKET_KEYWORDS.watch.some((kw) => n.includes(kw)));
  for (const f of F) {
    const desc = String(f.desc || ''); const lab = f.powerLabel; const minor = lab === 'Minor' || lab === 'Suppressed';
    const others = F.filter((x) => x !== f && MERCHANT.test(x.faction)); const roster = F.map((x) => `${x.faction}:${x.power}/${x.powerLabel}${x.isGoverning ? '/GOV' : ''}`).join(', ');
    const bd = bFac.get(f.faction)?.desc; NEW = bd !== undefined ? bd !== desc : null;
    const pg = d ? (d.includes(desc.slice(0, 60)) ? 'onPage' : 'NOT on page') : 'no dump';
    const note = `${f.faction} ${f.power}/${lab}${f.isGoverning ? '/GOV' : ''} [${s.tier} ${st.join('+') || 'calm'}] ${pg} | roster ${roster} :: ${desc.slice(0, 260)}`;
    if (desc.startsWith(LEADM)) add('L11a LEADING merchants rung "though other powers set the course here"', seed, s, !f.isGoverning && minor && others.every((m) => m.power <= f.power), note);
    if (desc.startsWith(LOCALM)) add('L11b local merchants "without yet being the dominant commercial voice"', seed, s, minor && (others.some((m) => m.power > f.power) || MERCHANT.test(gov?.faction || '')), note);
    if (desc.startsWith(CLERGY)) add('L11c clergy at the margins', seed, s, minor && !f.isGoverning, note);
    if (desc.startsWith(LESSER)) add('L11d lesser landed families', seed, s, minor && !f.isGoverning, note);
    if (desc.startsWith(GENTRY)) add('L11e gentry "outpaced by merchant capital"', seed, s, others.some((m) => m.power > f.power), note);
    if (desc.startsWith(NOBCOMP)) add('L11f nobles "competitive with merchant capital"', seed, s, others.length > 0, note);
    if (desc.startsWith(WATCH1) || desc.startsWith(WATCH2)) add('L11g city watch rungs', seed, s, watchStands && minor && ['city', 'metropolis'].includes(s.tier), `${note} | watch=${insts.filter((n) => /watch/.test(n)).join('/')}`);
    if (desc.startsWith(CRIMCOUNCIL)) add('L11h criminal "present in council discussions"', seed, s, COUNCIL.test(gov?.faction || ''), note);
    if ((desc.startsWith(CRIMPROT) || desc.startsWith(CRIMSHADOW)) && lab === 'Minor') add('L11i criminal Minor rung where no council', seed, s, !COUNCIL.test(gov?.faction || '') && (desc.startsWith(CRIMPROT) ? ['thorp', 'hamlet', 'village'].includes(s.tier) : true), note);
    if (minor && CLASS.test(desc)) add('L11z commanding claim still beside Minor/Suppressed (residue)', seed, s, false, `${desc.match(CLASS)[0]} | ${note}`);
  }
  // ── L12 the self-governing well-supplied wartime vignette (governingStressVignettes.js)
  if (d) for (const line of d.split('\n')) if (line.includes('Those under arms have doubled, and the city treasury pays their keep')) {
    NEW = null; const cs = insts.some((n) => n === 'city-state government');
    add('L12 sovereign wartime well-supplied', seed, s, st.includes('wartime') && cs, `[${s.tier} ${st.join('+')}] city-state=${cs} armed=${armed.map((f) => f.faction).join(',')} garrison=${insts.filter((n) => /garrison|barracks|militia|watch/.test(n)).join('/')} :: ${line.slice(0, 300)}`);
  }
}
const out = Object.fromEntries(Object.entries(R).sort().map(([k, r]) => [k, { prints: r.prints, towns: r.towns.size, true: r.true, false: r.false, newPrints: r.newPrints, newTrue: r.newTrue, newFalse: r.newFalse, newFalses: r.newFalses, newExamples: r.newExamples, sizes: r.sizes, crisisTowns: r.crisisTowns.size, falses: r.falses, examples: r.examples }]));
fs.writeFileSync(process.env.OUT, JSON.stringify(out, null, 1));
for (const [k, r] of Object.entries(out)) console.log(`${k} :: prints ${r.prints} in ${r.towns} towns; true ${r.true} false ${r.false}; new ${r.newPrints} (t ${r.newTrue} f ${r.newFalse}); sizes ${SIZES.filter((z) => r.sizes[z]).map((z) => z + ':' + r.sizes[z]).join(' ')}; crisis towns ${r.crisisTowns}`);
