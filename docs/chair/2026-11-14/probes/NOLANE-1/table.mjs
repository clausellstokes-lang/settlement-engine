// NOLANE-1 item 0: every row of the seat's, measured on the 720 census births (and the BAR-0 probe's 90 named towns)
// at the tree TREE. node table.mjs <tree> <census-out> <r90-dir> [out.json]
// Each row: prints = towns where the sentence prints on the dossier (owner's view, every tab);
//           false = towns where it prints AND the town's record makes it false (the row's own condition).
import fs from 'node:fs';
import { loadCorpus, loadDump } from './load.mjs';
const [TREE, C0, R90, OUTF] = process.argv.slice(2);
const T = `${TREE}/src`;
const { liveInstitutions } = await import(`${T}/domain/institutions/institutionRoster.js`);
const { waterAccessKind } = await import(`${T}/domain/tradeRouteSemantics.js`);

// ── towns ────────────────────────────────────────────────────────────────────────────────────────
const towns = []; // {seed, s, v (views), set}
for (const [seed, s] of loadCorpus(C0)) towns.push({ seed, s, v: loadDump(C0, seed), set: '720' });
for (const set of fs.existsSync(R90) ? fs.readdirSync(R90) : []) {
  const rd = `${R90}/${set}/records`; if (!fs.existsSync(rd)) continue;
  for (const f of fs.readdirSync(rd)) {
    const seed = f.replace(/\.json$/, '');
    towns.push({ seed, s: JSON.parse(fs.readFileSync(`${rd}/${f}`, 'utf8')), v: loadDump(`${R90}/${set}`, seed), set });
  }
}

// ── record helpers ───────────────────────────────────────────────────────────────────────────────
const lc = (x) => String(x ?? '').toLowerCase();
const roster = (s) => liveInstitutions(s).map((i) => lc(i.name));
const has = (s, re) => roster(s).some((n) => re.test(n));
const crisisTypes = (s) => [].concat(s.stress || []).map((x) => (typeof x === 'string' ? x : x?.type)).filter(Boolean);
const inCrisis = (s, t) => crisisTypes(s).includes(t);
const chains = (s) => s.economicState?.activeChains || s.resourceAnalysis?.resourceChains || [];
const factions = (s) => s.powerStructure?.factions || [];
const page = (t, view) => (view ? (t.v?.[view] || []) : Object.values(t.v || {}).flat());
const prints = (t, re, view) => page(t, view).some((l) => re.test(l));
const linesOf = (t, re, view) => page(t, view).filter((l) => re.test(l));
const npcText = (n, k) => JSON.stringify(n?.[k] ?? '');
const npcWith = (s, k, re) => (s.npcs || []).filter((n) => re.test(npcText(n, k)));
const terrain = (s) => lc(s.resourceAnalysis?.terrain);
const hasMarket = (s) => has(s, /market|fair|bazaar|exchange|trading post/);
const MIL_ROLE = /captain|commander|sergeant|marshal|garrison|watch|militia|guard|soldier|knight|warden|constable|general|sheriff|reeve|castellan|war/;

// ── rows ─────────────────────────────────────────────────────────────────────────────────────────
// Each row: { id, how, prints(t) -> bool, falseIf(t) -> bool }  (falseIf is read only where prints)
const NOTE = (re) => (t) => chains(t.s).some((c) => re.test(c.magicNote || '')) && prints(t, re, null);
const R = [];
const row = (id, how, p, f = () => true) => R.push({ id, how, p, f });

// LV-MAGICNOTES — the five grounds (record: the chain that carries the note)
const MN = [
  ['forest-on-reed', /Druidic forest management/, (c, s) => c.chainId === 'reed_marsh' || /marsh|reed|swamp|wetland/.test(terrain(s))],
  ['conjured-fish', /Conjured game produces fish/, () => true],
  ['farmland-on-salt', /Druidic cultivation supplements depleted farmland/, (c) => c.chainId === 'salt'],
  ['quickening-on-salt', /Arcane quickening of growth/, (c) => c.chainId === 'salt'],
  ['druidic-under-siege', /^Druid|Druidic|Druids/, (c, s) => inCrisis(s, 'under_siege')],
];
for (const [k, re, bad] of MN) row(`LV-MAGICNOTES:${k}`, 'chain.magicNote printed (any tab) on its chain/ground',
  (t) => chains(t.s).some((c) => re.test(c.magicNote || '') && prints(t, new RegExp(re.source.replace(/^\^/, '')))),
  (t) => chains(t.s).some((c) => re.test(c.magicNote || '') && bad(c, t.s)));
// LV-DIVINENOTE
const DIV = /Blessed stores; divine provision|Temple fishing rites|Temple stores supplement|Divine healing supplements/;
row('LV-DIVINENOTE:divine', 'divine note printed; defence holds no divine tradition',
  (t) => chains(t.s).some((c) => DIV.test(c.magicNote || '')) && prints(t, DIV), (t) => t.s.defenseProfile?.traditions?.hasDivine !== true);
row('LV-DIVINENOTE:alchemy', 'alchemy note printed; no arcane/alchemy tradition',
  (t) => prints(t, /Alchemical remedies supplement treatment/), (t) => !t.s.defenseProfile?.traditions?.hasArcane && !t.s.defenseProfile?.traditions?.hasAlchemy);
// LV-ARCANENONE (fenced: measured only)
row('LV-ARCANENONE', '"No arcane practitioners on the rolls" beside a magic power (any standing) or a mage',
  (t) => prints(t, /No arcane practitioners on the rolls/, 'Systems/Defense'),
  (t) => factions(t.s).some((f) => f.category === 'magic') || (t.s.npcs || []).some((n) => /mage|wizard|sorcer|arcan|archmage/i.test(`${n.role} ${n.title}`)));
row('LV-ARCANENONE:governing-or-mage', 'the narrower ruling: a governing magic power or a named mage',
  (t) => prints(t, /No arcane practitioners on the rolls/, 'Systems/Defense'),
  (t) => factions(t.s).some((f) => f.category === 'magic' && f.isGoverning) || (t.s.npcs || []).some((n) => /mage|wizard|sorcer|arcan|archmage/i.test(`${n.role} ${n.title}`)));
// LV-PALISADEQUARRY
row('LV-PALISADEQUARRY', 'fortification chain on Stone quarry printed; no quarry house',
  (t) => chains(t.s).some((c) => c.chainId === 'fortification' && /quarry/i.test(c.resource || '')) && prints(t, /Stone quarry/i, 'Systems/Economics'),
  (t) => !has(t.s, /quarr|stonemason|mason/));
// LV-CAPITAL
row('LV-CAPITAL', '"Capital" as an import pill (record primaryImports) printed on Economics',
  (t) => (t.s.economicState?.primaryImports || []).some((x) => /^capital$/i.test(String(x?.name ?? x))) && prints(t, /Capital/, 'Systems/Economics'));
// LV-CATHEDRAL
row('LV-CATHEDRAL', 'a cathedral need line: religious services … depend on stone', (t) => prints(t, /religious services[^.]*depend on stone/i));
// LV-MAGICSUPPLY
row('LV-MAGICSUPPLY', 'Magic tab "supplied by" naming a catalogue range', (t) => prints(t, /supplied by [^\n]*\(\d+[-–]\d+\+?\)/, 'Systems/Magic'));
// LV-PROCHOUSES
row('LV-PROCHOUSES', '"stops half-way: no … guild" naming a house with no catalogue row',
  (t) => prints(t, /stops half-way: no [^.]*(leatherworkers'|carpenters'|blacksmiths'|stonemasons') guild/i),
  (t) => has(t.s, /cobbler|blacksmith|carpent|mason|leather|tanner|joiner/));
// LV-OTHERNEED
row('LV-OTHERNEED', "a chain's dependency house is not among its own houses, and that need's services line prints",
  (t) => chains(t.s).some((c) => c.dependency?.institution && !(c.processingInstitutions || []).some((p) => { const a = lc(p).replace(/\s*\(.*$/, '').trim(), b = lc(c.dependency.institution).replace(/\s*\(.*$/, '').trim(); const wa = a.split(/[\s']+/), wb = b.split(/[\s']+/); return a.startsWith(b) || b.startsWith(a) || wb.some((w) => w.length > 4 && wa.includes(w)); })
    && prints(t, new RegExp(`^${String((c.dependency.affectedServices || [])[0] || '@@none@@').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^.]*here (depend|run) on`, 'i'), 'Systems/Economics')));
// LV-CANNOTPRODUCE
row('LV-CANNOTPRODUCE', 'a necessity import printed beside the same good under Produced locally',
  (t) => { const L = page(t, 'Systems/Economics'); const i = L.indexOf('Produced locally'); const prod = new Set((t.s.economicState?.localProduction || []).map((x) => lc(x?.name ?? x?.good ?? x))); return (t.s.economicState?.necessityImports || []).some((g) => { const n = lc(g?.name ?? g); return n && prod.has(n); }) && prints(t, /Settlement necessity/, 'Systems/Economics'); });
// LV-GAMBLING
row('LV-GAMBLING', '"Semi-organized" structure where the only criminal house is a gambling house',
  (t) => prints(t, /semi-organi[sz]ed/i, 'Systems/Defense'),
  (t) => { const crim = liveInstitutions(t.s).filter((i) => /crim/i.test(i.category || '')); return crim.length > 0 && crim.every((i) => /gambl/i.test(i.name)); });
// LV-CHARCOALPILLS
row('LV-CHARCOALPILLS', 'Produced locally Timber where the only timber worker is a charcoal burner, under a siege',
  (t) => prints(t, /^Produced locally$/, 'Systems/Economics') && has(t.s, /charcoal/) && !has(t.s, /woodcutter|lumber|sawmill|logging|forester|carpenter/) && (t.s.economicState?.localProduction || []).some((x) => /timber/i.test(JSON.stringify(x))),
  (t) => inCrisis(t.s, 'under_siege'));

// ── R2A / R2B / R3C ──
row('R2A-UNDERWORLD:informant', 'informant secret; no thieves\' guild house or power',
  (t) => prints(t, /On the payroll of the thieves' guild as a silent informant/),
  (t) => !has(t.s, /thie|criminal guild/) && !factions(t.s).some((f) => /thie|criminal guild/i.test(f.faction)));
row('R2A-UNDERWORLD:protection', '"the very merchants" secret; no market',
  (t) => prints(t, /protection scheme targeting the very merchants/), (t) => !hasMarket(t.s));
row('R2A-CUSTOMS:customs', 'customs-house tie prose; no customs house',
  (t) => prints(t, /shown to the customs house|A customs officer has asked .+ for the names of every supplier/), (t) => !has(t.s, /customs|toll/));
row('R2A-CUSTOMS:magistrate', '"before a magistrate"; no court',
  (t) => prints(t, /willing to name .+ before a magistrate/), (t) => !has(t.s, /court|magistrat|justice/));
row('R2A-LEFT-GAME', '"selling the game in the market"; no market', (t) => prints(t, /selling the game in the market/), (t) => !hasMarket(t.s));
row('R2A-LEFT-FLAVOR:quiet', '"Little happened"/"No dramatic history" beside a major event',
  (t) => prints(t, /Little has happened here worth writing down|No dramatic history here/),
  (t) => (t.s.history?.historicalEvents || []).some((e) => /major|catastroph|disaster/i.test(`${e.severity} ${e.magnitude} ${e.type} ${e.scale}`)));
row('R2A-LEFT-FLAVOR:magic', '"unusual relationship to magic" with magic absent/none',
  (t) => prints(t, /unusual relationship to magic/), (t) => t.s.config?.magicExists === false || !(t.s.defenseProfile?.traditions?.hasArcane));
row('R2A-LEFT-GOVECON', 'gov_econ_dependence / wary_alliance lines (membership not read) — prints only',
  (t) => prints(t, /asked for a seat on the council as a condition of the next loan|share a council bloc and a list of enemies/), () => null);
row('R2A-LEFT-LANISTA', 'mil_crim_corruption command lines on a lanista',
  (t) => prints(t, /An honest sergeant has been transferred into .+'s command|operation runs on a schedule .+ provides: patrols/),
  (t) => linesOf(t, /transferred into (.+)'s command|schedule (.+) provides: patrols/).some((l) => { const m = l.match(/transferred into (.+?)'s command|schedule (.+?) provides/); const nm = m?.[1] || m?.[2]; const n = (t.s.npcs || []).find((x) => x.name === nm); return n && !MIL_ROLE.test(lc(`${n.role} ${n.title}`)); }));
row('R2A-LEFT-PLAINS', 'forest-founders origin on a non-forest terrain',
  (t) => prints(t, /founded by foresters managing the woodland under charter/), (t) => !/forest|wood/.test(terrain(t.s)));
row('R2A-L02', 'river-bend arrival where the one water reading says maritime (coast, no river)',
  (t) => prints(t, /around the bend before the buildings appear/),
  (t) => waterAccessKind(t.s.config?.terrainType ?? t.s._config?.terrainType ?? t.s.resourceAnalysis?.terrain, t.s.config?.tradeRouteAccess) === 'maritime');
row('R2A-LEFT-COHESION', 'unit-cohesion goal on a holder who commands no unit',
  (t) => npcWith(t.s, 'goal', /Keep unit cohesion as conscription/).length > 0 && prints(t, /Keep unit cohesion as conscription/),
  (t) => npcWith(t.s, 'goal', /Keep unit cohesion as conscription/).some((n) => !MIL_ROLE.test(lc(`${n.role} ${n.title}`))));
row('R2A-LEFT-CRISISSECRET:count', 'falsified case count on a holder who keeps no count',
  (t) => npcWith(t.s, 'secret', /Falsified the initial case count/).length > 0 && prints(t, /Falsified the initial case count/),
  (t) => npcWith(t.s, 'secret', /Falsified the initial case count/).some((n) => !/physic|healer|hospital|apothec|plague|doctor|surgeon|magistrat|council|clerk|registrar|mayor|steward|reeve/.test(lc(`${n.role} ${n.title} ${n.institution}`))));
row('R2A-LEFT-CRISISSECRET:sortie', 'illegal sortie on a holder who commands none',
  (t) => npcWith(t.s, 'secret', /Authorised an illegal sortie/).length > 0 && prints(t, /Authorised an illegal sortie/),
  (t) => npcWith(t.s, 'secret', /Authorised an illegal sortie/).some((n) => !MIL_ROLE.test(lc(`${n.role} ${n.title}`))));
row('R2A-LEFT-MILWEAVER', 'command-of-soldiers loyalty lines on a non-military card',
  (t) => npcWith(t.s, 'secret', /selling duty rosters|paying their soldiers more than their salary/).length + npcWith(t.s, 'goal', /selling duty rosters|paying their soldiers more than their salary/).length > 0 && prints(t, /selling duty rosters|paying their soldiers more than their salary/),
  (t) => [...npcWith(t.s, 'secret', /selling duty rosters|paying their soldiers more/), ...npcWith(t.s, 'goal', /selling duty rosters|paying their soldiers more/)].some((n) => !MIL_ROLE.test(lc(`${n.role} ${n.title}`))));
row('R2A-LEFT-RATION', 'siege rationing line naming the seat where the military holds it',
  (t) => prints(t, /The siege has entered its second week; .+ controls the rationing/),
  (t) => linesOf(t, /controls the rationing/).some((l) => { const nm = l.match(/second week; (.+?) controls/)?.[1]; const gov = factions(t.s).find((f) => f.isGoverning); const mil = factions(t.s).find((f) => f.category === 'military'); return mil && gov && nm === gov.faction && (mil.power ?? 0) > (gov.power ?? 0); }));
row('R2A-LEFT-TORN', 'occupied torn-official line on the occupier\'s own head',
  (t) => prints(t, /is simultaneously expected to enforce the occupiers' directives/),
  (t) => linesOf(t, /is simultaneously expected to enforce the occupiers/).some((l) => /occupying governor|occupation|occupier/i.test(l.split('is simultaneously')[0])));
row('R2B-693', 'card power line "first of A · first of B"', (t) => prints(t, /first of [^·]+ · first of /, 'World/NPCs'), () => null);
row('R2B-979', '"Disposition established" (influence folded into disposition)', (t) => prints(t, /Disposition\s*[^\n]{0,40}\bestablished\b/i, 'World/NPCs'));
row('R3C-REVOLTNOTE', 'revolt note "everyone who keeps order" where the town holds no force',
  (t) => prints(t, /everyone who keeps order is busy containing the revolt/),
  (t) => !has(t.s, /garrison|militia|levy|watch|guard|barracks|mercenar|company|castle|keep|fort/));

// ── BAR / PWR / CRP / UPK / DATA / R3T ──
row('BAR-124', 'hospital chain outputs printed in a town with no hospital or physician',
  (t) => chains(t.s).some((c) => c.chainId === 'hospital') && prints(t, /Medical treatment\s*Surgery/, 'Systems/Economics'), (t) => !has(t.s, /hospital|physician|infirmar|surgeon|healer/));
row('BAR-182', 'Foundations "Public legitimacy Critical" where the Power tab says Contested',
  (t) => prints(t, /^Public legitimacyCritical$/, 'Summary/Foundations'), (t) => t.s.powerStructure?.publicLegitimacy?.label === 'Contested');
row('BAR-198', '"The power <governing>" on the Power tab under an occupation where the occupier decides',
  (t) => prints(t, /^The power/, 'Systems/Power') && inCrisis(t.s, 'occupied'),
  (t) => { const l = linesOf(t, /^The power/, 'Systems/Power')[0] || ''; return !/occup/i.test(l); });
row('BAR-274', 'Entrepôt transit-duties income line; no warehouse',
  (t) => prints(t, /Transit duties, warehouse fees/), (t) => !has(t.s, /warehouse|entrep|depot|bonded/));
row('BAR-83', 'a refused yield printed under "Outputs" (impaired/depleted chain)',
  (t) => { const L = page(t, 'Systems/Economics'); return L.some((l, i) => /^Outputs$/.test(l) && /Grain export/.test(L[i + 1] || '')); },
  (t) => chains(t.s).some((c) => (c.outputs || []).includes('Grain export') && (c.status === 'impaired' || c.resourceDepleted || c.resourceInputCondition === 'depleted')));
row('BAR-169/170', 'a "… Fair" tradition in a town with no market or fair',
  (t) => prints(t, /^The \w+ Fair$/, 'World/Traditions'), (t) => !hasMarket(t.s));
row('BAR-293', 'Systems Health "Safety" with no value', (t) => { const L = page(t, 'Summary/Overview'); return L.some((l, i) => l === 'Safety' && /^Viability/.test(L[i + 1] || '')); });
row('BAR-294', 'Services group count (N) differing from rows shown — Lodging', (t) => prints(t, /^Lodging\(\d+\)/, 'Systems/Services'),
  (t) => { const L = page(t, 'Systems/Services'); const i = L.findIndex((l) => /^Lodging\(\d+\)/.test(l)); if (i < 0) return false; const n = +L[i].match(/\((\d+)\)/)[1]; return (t.s.availableServices?.lodging || []).length !== n; });
row('PWR-SYMB', 'symbiotic row beside a high conflict of the same pair',
  (t) => (t.s.powerStructure?.factionRelationships || []).some((r) => r.type === 'symbiotic') && prints(t, /each needs the other to stay strong/, 'Systems/Power'),
  (t) => (t.s.powerStructure?.factionRelationships || []).filter((r) => r.type === 'symbiotic').some((r) => (t.s.powerStructure?.conflicts || t.s.conflicts || []).some((c) => c.intensity === 'high' && r.pair.every((p) => (c.parties || []).includes(p)))));
row('PWR-1432', 'a "Merchant Guilds" power with no guild on the roster',
  (t) => factions(t.s).some((f) => f.faction === 'Merchant Guilds') && prints(t, /Merchant Guilds/, 'Systems/Power'), (t) => !has(t.s, /guild/));
row('CRP-IMPORTREASON', '"Required by X but not available" where X is not on the roster',
  (t) => prints(t, /Required by .+ but not available in/),
  (t) => linesOf(t, /Required by .+ but not available in/).some((l) => { const x = lc(l.match(/Required by (.+?) but not/)?.[1]); return x && !roster(t.s).some((n) => n.includes(x.replace(/\s*\(.*\)$/, ''))); }));
for (const [k, re] of [['gold/silver ore', /gold\/silver ore/], ['palisade or earthworks', /palisade or earthworks/], ['Military/Guard in prose', /[a-z,] Military\/Guard [a-z]/], ['bought its capital', /bought its capital from outside/]])
  row(`CRP-SLOTLABELS:${k}`, 'a catalogue label in a slot', (t) => prints(t, re));
row('CRP-ONESOURCE', 'DS-ECO-9 one-source line where the one ground is worked out',
  (t) => prints(t, /own food comes from its .+ and little else|has little food of its own but its/),
  (t) => Object.values(t.s.resourceAnalysis?.resourceConditions || {}).some((c) => /depleted|exhausted|worked out/i.test(JSON.stringify(c))) && (t.s.economicState?.foodSecurity?.foodSources || t.s.foodRecord?.foodSources || [1, 2]).length === 1);
row('UPK-RANGE-CHAIN', 'a catalogue range "(3-8)" as a house in chain suggestions (record + page)',
  (t) => /\b[A-Z][\w' ]+ \(\d+-\d+\+?\)/.test(JSON.stringify(t.s.economicViability || {})) && prints(t, /[A-Za-z]+ \(\d+-\d+\+?\)[^\n]*(production chain|complete|missing)|(Add|lacks|missing)[^\n]*\(\d+-\d+\+?\)/));
row('UPK-W5', 'can-pay row beside a doom line on the Defense page',
  (t) => prints(t, /had money laid by before this trouble began|can pay its way through it/, 'Systems/Defense') && prints(t, /may not come through this crisis/, 'Systems/Defense'));
row('UPK-FISHCOMM', 'Fishing community "the whole of the economy"', (t) => prints(t, /are the whole of the economy|inseparable from the water/));
row('DATA-PARISH', 'parish one-liner "Hundreds of houses of worship"', (t) => prints(t, /Hundreds of houses of worship across every district/),
  (t) => roster(t.s).some((n) => /parish churches \(50-100\+?\)/.test(n)));
row('DATA-ROW7:ww-798', 'a ring handled by the other ring\'s head', (t) => prints(t, /handled by .+, the network's head \(Smuggling network\)/, 'Systems/Power'));
row('DATA-ROW7:pf-702', 'raw catalogue "Fence (word of mouth)" as a house', (t) => prints(t, /Fence \(word of mouth\)/));
row('R3T-F9', 'a port on coastal terrain, river route: no naval line',
  (t) => !!t.s.economicState?.compound?.hasPort || has(t.s, /harbou?r|dock|port|wharf/),
  (t) => t.s.config?.tradeRouteAccess === 'river' && /coast/.test(terrain(t.s)) && !prints(t, /Naval|harbou?r and nothing to hold it|vessel/i, 'Systems/Defense'));
row('R3T-F10', 'Foundations food word "Import-dependent" under a siege',
  (t) => prints(t, /Import-dependent/i, 'Summary/Foundations'), (t) => inCrisis(t.s, 'under_siege'));

// ── run ──────────────────────────────────────────────────────────────────────────────────────────
const out = {};
for (const r of R) {
  const P = [], F = [], U = [];
  for (const t of towns) {
    let p = false; try { p = !!r.p(t); } catch (e) { p = false; }
    if (!p) continue; P.push(t.seed);
    let f; try { f = r.f(t); } catch (e) { f = 'err'; }
    if (f === true) F.push(t.seed); else if (f === null) U.push(t.seed);
  }
  const p720 = P.filter((s) => towns.find((t) => t.seed === s).set === '720').length;
  const f720 = F.filter((s) => towns.find((t) => t.seed === s).set === '720').length;
  out[r.id] = { how: r.how, prints720: p720, false720: f720, printsNamed: P.length - p720, falseNamed: F.length - f720, unjudged: U.length, falseSeeds: F.slice(0, 12), printSeeds: P.slice(0, 6) };
  console.log(`${r.id.padEnd(30)} prints ${String(p720).padStart(3)}/720 false ${String(f720).padStart(3)}  | named-90 prints ${P.length - p720} false ${F.length - f720}${U.length ? ` unjudged ${U.length}` : ''}  e.g. ${F.slice(0, 3).join(' ')}`);
}
console.log(`towns: ${towns.length} (${towns.filter((t) => t.set === '720').length} census)`);
if (OUTF) fs.writeFileSync(OUTF, JSON.stringify(out, null, 1));
