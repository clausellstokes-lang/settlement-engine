// READ ONE GENERATED PLACE WHOLE, AS A READER WOULD (the eighth chair's; the step advised before every deploy).
// HOW: set R to the src/ of a checkout of the working line, then: node read-place.mjs <town|city|...> <seed>
// (dark as the line stands; for the laws lit, run it on a lit tree such as lane/close-2-lit-scratch-2026-11-22).
// reads one generated place the way a reader of the page would: its facts, then the page's own prose
const R = '/home/user/wt/line/src/';
const { generateSettlementPipeline } = await import(R + 'generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R + 'domain/density/densityCreateBoundary.js');
const { buildPrintProse } = await import(R + 'domain/display/stateProse/printProse.js');
const dl = await import(R + 'domain/dailyLife.js');
await loadGenerationLawPayloads();
const [settType, seed] = [process.argv[2] || 'town', process.argv[3] || 'owner-read-1'];
const s = generateSettlementPipeline(birthConfig({ settType }), null, { seed, customContent: {} });
const cut = (t, n = 420) => { t = String(t ?? ''); return t.length > n ? t.slice(0, n) + '…' : t; };
console.log(`# ${s.name} (${s.tier}; population ${s.population}; seed ${seed}); ${s.institutions.length} houses; ${s.npcs.length} people; ${s.relationships.length} ties`);
console.log('prosperity:', s.economicState?.prosperity, '| government:', s.powerStructure?.government, '| governs:', s.powerStructure?.governingName, '| stability:', cut(s.powerStructure?.stability, 120), '| legitimacy:', s.powerStructure?.publicLegitimacy?.label);
console.log('arrival:', cut(s.arrivalScene, 380));
console.log('why here:', cut(JSON.stringify(s.settlementReason), 260));
console.log('trouble:', s.stress?.label, '-', cut(s.stress?.summary, 260));
console.log('trouble hook:', cut(s.stress?.crisisHook, 260));
console.log('pressure:', cut(s.pressureSentence, 260));
console.log('economy:', cut(s.economicState?.situationDesc, 320));
console.log('culture:', cut(s.culturalNotes, 240));
console.log('\n## POWERS');
for (const f of s.powerStructure?.factions || []) console.log(`- ${f.faction} (power ${f.power}${f.isGoverning ? ', governs' : ''}): ${cut(f.desc, 380)}`);
console.log('recent conflict:', cut(s.powerStructure?.recentConflict, 300));
console.log('\n## PEOPLE (first 6)');
for (const n of s.npcs.slice(0, 6)) console.log(`- ${n.name}, ${n.title || n.role} (${n.category}): wants: ${cut(n.goal?.short, 170)} / in the end: ${cut(n.goal?.long, 110)} | secret: ${cut(n.secret?.what, 150)}`);
console.log('\n## TIES (first 5)');
for (const r of s.relationships.slice(0, 5)) console.log(`- [${r.typeName}] ${cut(r.description, 200)} // ${cut(r.tension, 220)}`);
console.log('\n## HISTORY (age ' + s.history?.age + ')');
console.log('founding:', cut(typeof s.history?.founding === 'string' ? s.history.founding : JSON.stringify(s.history?.founding), 320));
console.log('character:', cut(s.history?.historicalCharacter, 240));
for (const e of (s.history?.historicalEvents || []).slice(0, 4)) console.log(`- ${e.yearsAgo} years ago, ${e.name}: ${cut(e.description, 220)}`);
for (const t of (s.history?.currentTensions || []).slice(0, 3)) console.log(`- tension (${(t.factions || []).join(' / ')}): ${cut(t.description, 200)} | hook: ${cut((t.plotHooks || [])[0], 180)}`);
console.log('\n## THE PAGE\'S OWN PROSE (tab > mount)');
const pp = buildPrintProse(s, {});
let n = 0;
for (const [tab, mounts] of Object.entries(pp)) for (const [mount, para] of Object.entries(mounts)) { n++; console.log(`[${tab} > ${mount}] ${cut(para, 460)}`); }
console.log('paragraphs:', n);
console.log('\n## DAILY LIFE');
for (const k of (dl.DAILY_LIFE_PAGE_SLOTS || [])) { let v; try { v = dl.deriveDailyLifeSlot(k, s); } catch (e) { v = 'ERR ' + e.message; } console.log(`- ${k}: ${cut(typeof v === 'string' ? v : (v?.text ?? JSON.stringify(v)), 320)}`); }
