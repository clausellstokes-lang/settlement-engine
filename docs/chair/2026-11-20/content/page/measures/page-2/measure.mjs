// PAGE-2 measure: T (tension texts, kinds, repeats in three forges, sides the record lacks), S (misfit secrets), K (influence)
const [, , L, nA = '50', out = ''] = process.argv;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
const { marketOf } = await import(`${L}/src/domain/facts/market.js`);
const { legalHouseOf } = await import(`${L}/src/domain/facts/legalHouse.js`);
const { classOfRole } = await import(`${L}/src/domain/roles/roleClass.js`);
const { NPC_CRIMINAL_SECRETS_BY_HOLDER } = await import(`${L}/src/data/npcData.js`);
const { TITLE_SECRETS } = await import(`${L}/src/data/people/titleSecretsPresentations.js`);
await loadGenerationLawPayloads();
const towns = [];
for (const size of SIZES) for (let i = 0; i < +nA; i++) towns.push(generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed: `hxd-${size}-${i}`, customContent: {} }));
const pct = (a, b) => b ? (100 * a / b).toFixed(1) + '%' : '-';
const lines = [];
const log = (...a) => { const s = a.join(' '); lines.push(s); console.log(s); };
// ── T: kinds by share of towns
const kinds = new Map(); let nT = 0;
for (const t of towns) { const seen = new Set(); for (const x of t.history?.currentTensions || []) { nT++; seen.add(x.type); } for (const k of seen) kinds.set(k, (kinds.get(k) || 0) + 1); }
log(`T. ${towns.length} towns, ${nT} tensions; kinds by share of towns holding one:`);
log('  ' + [...kinds].sort((a, b) => b[1] - a[1]).map(([k, c]) => `${k} ${pct(c, towns.length)}`).join(' · '));
// distinct texts per kind
const texts = new Map();
for (const t of towns) for (const x of t.history?.currentTensions || []) { if (!texts.has(x.type)) texts.set(x.type, new Map()); const m = texts.get(x.type); m.set(x.description, (m.get(x.description) || 0) + 1); }
log('  distinct texts per kind (top 10 kinds): ' + [...texts].sort((a, b) => [...b[1].values()].reduce((x, y) => x + y) - [...a[1].values()].reduce((x, y) => x + y)).slice(0, 10).map(([k, m]) => `${k} ${m.size}/${[...m.values()].reduce((x, y) => x + y)} (top ${Math.max(...m.values())})`).join(' · '));
// commonest single sentence
const allTexts = new Map(); for (const t of towns) for (const d of new Set((t.history?.currentTensions || []).map((x) => x.description))) allTexts.set(d, (allTexts.get(d) || 0) + 1);
const topTexts = [...allTexts].sort((a, b) => b[1] - a[1]).slice(0, 5);
log('  commonest sentences by share of towns: ' + topTexts.map(([d, c]) => `${pct(c, towns.length)} "${d.slice(0, 60)}…"`).join(' | '));
// chance two of three forges in a row share a tension text word for word
const shares = (a, b) => { const s = new Set((a.history?.currentTensions || []).map((x) => x.description)); return (b.history?.currentTensions || []).some((x) => s.has(x.description)); };
const triple = (a, b, c) => shares(a, b) || shares(a, c) || shares(b, c);
let hit = 0, n = 0; const bySize = {};
for (const size of SIZES) { const g = towns.filter((t) => t.tier === size); let h = 0, m = 0; for (let i = 0; i + 2 < g.length; i++) { m++; if (triple(g[i], g[i + 1], g[i + 2])) h++; } bySize[size] = pct(h, m); hit += h; n += m; }
// across sizes: all unordered triples is heavy; sample 20000 random triples (seeded LCG)
let s = 12345; const r = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648; let hx = 0; const NX = 20000;
for (let k = 0; k < NX; k++) { const a = towns[Math.floor(r() * towns.length)], b = towns[Math.floor(r() * towns.length)], c = towns[Math.floor(r() * towns.length)]; if (a === b || b === c || a === c) { k--; continue; } if (triple(a, b, c)) hx++; }
log(`  P(two of three forges in a row share a tension text): same size, consecutive seeds ${pct(hit, n)} (${Object.entries(bySize).map(([k, v]) => `${k} ${v}`).join(' ')}); any size, random triples ${pct(hx, NX)}`);
// which authored form each tension prints (U unanchored, D canonical, V spare, A dated, W written for the town / other)
{ const { HISTORICAL_EVENTS_DATA: H } = await import(`${L}/src/data/historyData.js`); const { HISTORY_DESC_VARIANTS: V } = await import(`${L}/src/data/historyDescVariants.js`);
  const form = new Map(); const strip = (x) => String(x || '').replace(/\{[a-z_]+\}/g, '').slice(0, 25);
  for (const t of towns) for (const x of t.history?.currentTensions || []) { const e = H.find((y) => y.type === x.type) || {}; const d = x.description; let f = 'W';
    if (e.byMemory?.unanchored?.description && d.startsWith(strip(e.byMemory.unanchored.description))) f = 'U'; else if (e.byMemory?.dated?.description && d.startsWith(strip(e.byMemory.dated.description))) f = 'A'; else if (d.startsWith(strip(e.description))) f = 'D'; else if ((V[x.type] || []).some((v) => d.startsWith(strip(v)))) f = 'V';
    form.set(f, (form.get(f) || 0) + 1); }
  log('  forms printed: ' + [...form].map(([k, c]) => `${k} ${c} (${pct(c, nT)})`).join(' · ') + '  [U unanchored present, D canonical, V spare, A dated, W written for the town]'); }
// sides the record lacks
let lackLegal = 0, lackMerch = 0, lackAny = 0; const lackEx = [];
const legalRe = /legal class|lawyer|notar|magistrat|court/i, merchRe = /merchant|trader/i;
for (const t of towns) { const noLegal = !legalHouseOf(t), noMarket = !marketOf(t); let a = false, b = false;
  for (const x of t.history?.currentTensions || []) for (const f of x.factions || []) { if (noLegal && legalRe.test(f)) { a = true; lackEx.push(`${t.tier} ${x.type}: ${f}`); } if (noMarket && merchRe.test(f)) { b = true; lackEx.push(`${t.tier} ${x.type}: ${f}`); } }
  if (a) lackLegal++; if (b) lackMerch++; if (a || b) lackAny++; }
log(`  towns shown a side the record lacks: ${pct(lackAny, towns.length)} (legal class with no legal house ${pct(lackLegal, towns.length)}; merchants with no market ${pct(lackMerch, towns.length)}); by size: ` + SIZES.map((size) => { const g = towns.filter((t) => t.tier === size); return `${size} ${pct(g.filter((t) => (t.history?.currentTensions || []).some((x) => (x.factions || []).some((f) => (!legalHouseOf(t) && legalRe.test(f)) || (!marketOf(t) && merchRe.test(f))))).length, g.length)}`; }).join(' '));
const exT = new Map(); for (const e of lackEx) exT.set(e.replace(/^\S+ /, ''), (exT.get(e.replace(/^\S+ /, '')) || 0) + 1);
log('  lacking sides seen: ' + [...exT].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([k, c]) => `${c}× ${k}`).join(' | '));
// side slots substituted by town names: share of side strings that are not template words
const { HISTORICAL_EVENTS_DATA } = await import(`${L}/src/data/historyData.js`);
const tmplSides = new Set(HISTORICAL_EVENTS_DATA.flatMap((e) => [...(e.factions || []), ...Object.values(e.byMemory || {}).flatMap((w) => w?.factions || [])]));
let sides = 0, own = 0; for (const t of towns) for (const x of t.history?.currentTensions || []) for (const f of x.factions || []) { sides++; if (!tmplSides.has(f)) own++; }
log(`  side names that are the town's own (not a template word): ${own}/${sides} (${pct(own, sides)})`);
// ── S: misfit secrets by calling
// lines presuming another calling's office or trade (a FLOOR: hand-listed from the role-free pool)
const TRADE = ["Runs a protection scheme targeting the very merchants they're supposed to serve", 'Has been falsifying inspection records for a fee', 'Their legitimate business is a front for moving contraband', 'The goods they sell as locally produced are sourced from somewhere with exploitative labour practices', 'Has been paying a health official to suppress a finding about their product', 'Has information about a competitor that would ruin them, obtained through clearly illegal means', "Their business partner died of natural causes that weren't entirely natural", 'Has been quietly betting against the ventures they talk their neighbours into, and profiting when they fail'];
const titleOf = new Map(); for (const [k, rows] of Object.entries(TITLE_SECRETS)) for (const r of rows) { if (!titleOf.has(r.secret)) titleOf.set(r.secret, new Set()); titleOf.get(r.secret).add(k); }
const callingOf = (n) => { const c = classOfRole(n.role); const tt = String(n.title || n.role || '').toLowerCase();
  if (c === 'clergy' || n.category === 'religious' || /priest|abbot|bishop|dean|monk|nun|cleric|chaplain|friar|prior|deacon|vicar|parson|hermit|shrine/.test(tt)) return 'clergy';
  if (/judge|magistrate|justice|reeve|bailiff|sheriff|court|notary|lawspeaker|steward of law/.test(tt)) return 'justice';
  if (/watch|guard|constable|sergeant|warden/.test(tt)) return 'watch'; return null; };
const S = {}; const sEx = new Map();
for (const t of towns) for (const nn of t.npcs || []) { const cal = callingOf(nn); if (!cal) continue; const key = `${cal}|${t.tier}`; S[key] ??= [0, 0]; S[key][1]++;
  const w = nn.secret?.what || ''; const titles = titleOf.get(w); const own = titles && [...titles].some((k) => String(nn.title || '').toLowerCase().includes(k.replace(/^the /, '')));
  const mis = TRADE.includes(w) || (titles && !own && ![...titles].some((k) => callingOf({ role: k, title: k }) === cal));
  if (mis) { S[key][0]++; const e = `${cal}: ${w.slice(0, 70)}`; sEx.set(e, (sEx.get(e) || 0) + 1); } }
log(`S. misfit secrets (another calling's wrong), by calling and size (misfit/cards):`);
for (const cal of ['clergy', 'justice', 'watch']) log(`  ${cal.padEnd(8)} ` + SIZES.map((size) => { const v = S[`${cal}|${size}`] || [0, 0]; return `${size} ${v[0]}/${v[1]}`; }).join(' · ') + `  all ${pct(SIZES.reduce((a, z) => a + (S[`${cal}|${z}`]?.[0] || 0), 0), SIZES.reduce((a, z) => a + (S[`${cal}|${z}`]?.[1] || 0), 0))}`);
log('  misfits seen: ' + [...sEx].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([k, c]) => `${c}× ${k}`).join(' | '));
// titles carried by clergy cards without a TITLE_SECRETS row
const noRow = new Map(); for (const t of towns) for (const nn of t.npcs || []) if (callingOf(nn) === 'clergy' && !Object.prototype.hasOwnProperty.call(TITLE_SECRETS, nn.title)) noRow.set(nn.title, (noRow.get(nn.title) || 0) + 1);
log('  clergy titles with no title row: ' + [...noRow].sort((a, b) => b[1] - a[1]).slice(0, 15).map(([k, c]) => `${k} ${c}`).join(' · '));
// ── K: influence
const inf = new Map(); let cards = 0; for (const t of towns) for (const nn of t.npcs || []) { cards++; inf.set(nn.influence, (inf.get(nn.influence) || 0) + 1); }
log(`K. influence over ${cards} cards: ` + [...inf].map(([k, c]) => `${k} ${pct(c, cards)}`).join(' · '));
const gm = new Map(); for (const t of towns) for (const nn of t.npcs || []) if (/guild ?master/i.test(nn.role || '')) gm.set(nn.influence, (gm.get(nn.influence) || 0) + 1);
log('  guild masters by influence: ' + [...gm].map(([k, c]) => `${k} ${c}`).join(' · '));
const roleInf = new Map(); for (const t of towns) for (const nn of t.npcs || []) { const k = nn.role; roleInf.set(k, roleInf.get(k) || {}); roleInf.get(k)[nn.influence] = (roleInf.get(k)[nn.influence] || 0) + 1; }
if (out) { const fs = await import('node:fs'); fs.writeFileSync(out, lines.join('\n') + '\n'); fs.writeFileSync(out + '.roles.json', JSON.stringify([...roleInf], null, 0)); }
