// Who sits in the seat, by form of rule: a keeper of some other place (a dual hat) or a person of the seat's own house?
const [, , L, nA = '50', nB = '25'] = process.argv;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES, DIALS } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
const { faceOfInstitution } = await import(`${L}/src/data/institutionalCatalog.js`);
const { APPOINTED_GOVERNMENTS, officeTitleFor } = await import(`${L}/src/generators/people/representatives.js`);
await loadGenerationLawPayloads();
const rows = [];
const add = (cfg, seed) => { const t = generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
  const gov = t.powerStructure.government; const office = officeTitleFor(gov, t.tier);
  // the seat's person: the one whose ROLE is the office's word (the dual hat keeps the keeper's title beside it), else the face of the seat's own row
  const holder = (t.npcs || []).find((n) => String(n.role).toLowerCase() === String(office).toLowerCase())
    || (t.npcs || []).find((n) => faceOfInstitution({ name: n.institution?.key }) === 'seat')
    || null;
  const place = holder?.institution?.key || null; const face = place ? faceOfInstitution({ name: place }) : null;
  const kind = !holder ? 'no person found' : (face === 'seat' || /hall|palace|council|mayor|headman|elder|reeve|administration|government|assembly|oligarchy|governance|consortium|authority|steward/i.test(String(place)) ? 'the seat\'s own house' : 'a keeper of another place');
  rows.push({ tier: t.tier, gov, office, kind, place, title: holder?.title, appointed: APPOINTED_GOVERNMENTS.includes(gov) }); };
for (const size of SIZES) { for (let i = 0; i < +nA; i++) add({ ...DEFAULT_CONFIG, settType: size }, `hxd-${size}-${i}`); for (let i = 0; i < +nB; i++) add({ ...DEFAULT_CONFIG, ...DIALS, settType: size }, `hxr-${size}-${i}`); }
const by = new Map(); for (const r of rows) { const o = by.get(r.gov) || { n: 0, own: 0, keeper: 0, none: 0, ex: new Map(), appointed: r.appointed, office: r.office }; o.n++; if (r.kind.startsWith('the seat')) o.own++; else if (r.kind.startsWith('a keeper')) { o.keeper++; const k = `${r.title} at ${r.place}`; o.ex.set(k, (o.ex.get(k) || 0) + 1); } else o.none++; by.set(r.gov, o); }
console.log(`towns ${rows.length}. form of rule · towns · seat held by a person of the seat's own house · by a KEEPER of another place (dual hat) · no person found · [on the code's appointed list]`);
for (const [g, o] of [...by].sort((a, b) => b[1].n - a[1].n)) console.log(`${g.padEnd(30)} ${String(o.n).padStart(4)}  own ${String(o.own).padStart(3)}  keeper ${String(o.keeper).padStart(3)}  none ${String(o.none).padStart(3)} ${o.appointed ? ' [appointed]' : ''}  office "${o.office}"${o.keeper ? '  e.g. ' + [...o.ex].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([k]) => k).join('; ') : ''}`);
