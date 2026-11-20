// CENSUS-3 phase A: the traditions and hook-table ledgers, written from the seat's reading.
// Every row of every table is emitted; a row absent from DECL declares nothing (read, neutral).
// Run: node docs/census/declarations/_build_mine.mjs  (writes beside itself; reads the tables by import)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../..');
const imp = (p) => import(path.join(root, p));
const GUARD = 'watch|garrison|militia';
const txt = (v) => (typeof v === 'function' ? v({ name: '{name}', town: '{town}', phrase: '{phrase}', ownerBit: '' }) : typeof v === 'string' ? v : JSON.stringify(v)).replace(/\s+/g, ' ');
const short = (s) => (s.length > 110 ? `${s.slice(0, 107)}...` : s);
function row(id, text, d = {}) {
  const r = { id, text: short(text), needs: d.needs || [], excludes: d.excludes || [] };
  if (d.crisis !== undefined) r.crisis = d.crisis;
  r.colour = !(r.needs.length || r.excludes.length || d.crisis !== undefined);
  if (d.notes) r.notes = d.notes;
  return r;
}
function write(id, source, drawKind, pool, rows) {
  const file = path.join(here, `${id}.json`);
  fs.writeFileSync(file, `${JSON.stringify({ id, source, drawKind, pool, rows }, null, 1)}\n`);
  return { id, rows: rows.length, declaring: rows.filter((r) => !r.colour).length, colour: !!pool.colour, crisisScoped: !!pool.crisisScoped };
}
const out = [];

// ── TRADITIONS ──
const tc = await imp('src/data/traditionCorpus.js');
const tp = await imp('src/data/traditionProse.js');
const EL = {
  'first-landing': { needs: ['water: navigable'], notes: 'Landfall / the First Landing: a landing presumes water a boat could use (CENSUS-1 weighs it 0 without water at genesis; this is the line\'s declaration)' },
  tide: { needs: ['water: coast'], notes: 'the Tide: a tide presumes a coast (the reader:traditions-water class: The Tide Fair on plains, the Fair of the Tide in mountains — base weight 1 today without coast)' },
  river: { needs: ['water: river'], notes: 'the River element presumes a river (water: river; a coast-only place has no river)' },
  harvest: { notes: 'unhomed: farming (no food-source atom is a factsOf getter; read neutral)' },
  field: { notes: 'unhomed: farming' },
  forge: { notes: 'presumes a forge only as a motif; institution: smith not declared (a custom named for the forge survives the smithy)' },
  market: { notes: 'the Market element: a fair is itself a market day; market not declared (the chair may rule needs: market)' },
  hunt: { notes: 'neutral (game presumed; no factsOf food-source getter)' },
  'long-sun': { notes: 'neutral; climate has no atom (ruling 8)' },
};
out.push(write('traditions.TRADITION_ELEMENTS', 'src/data/traditionCorpus.js :: TRADITION_ELEMENTS', 'R',
  { declares: [], crisisScoped: false, colour: false, notes: 'weighted pick in genesis.js (local forked PRNG); the element names the tradition (The Tide Fair). Phase B: the Traditions tab prints only admissible rows (R6); the weight is not moved.' },
  tc.TRADITION_ELEMENTS.map((e) => row(`traditions.TRADITION_ELEMENTS::${e.id}`, `${e.noun} / ${e.genitive}`, EL[e.id]))));
out.push(write('traditions.TRADITION_ACTS', 'src/data/traditionCorpus.js :: TRADITION_ACTS', 'R',
  { declares: [], crisisScoped: false, colour: true, notes: 'six act nouns; presume nothing' },
  tc.TRADITION_ACTS.map((a) => row(`traditions.TRADITION_ACTS::${a.id}`, a.noun))));
const TR = {
  'feast#2': { needs: ['tier: >= town'], notes: 'unhomed: guild ("the guild ovens"); a guild presumes a town at least' },
  'procession#1': { needs: ['tier: >= town'], notes: '"every quarter": quarters exist from a town up (safetyProfile.js crimeTurf ruling)' },
  'procession#3': { notes: 'bells: presumes a bell tower; institution: temple not declared (a bell can hang anywhere)' },
  'vigil#1': { needs: ['water: navigable'], notes: '"lantern-boats set adrift on the water" (Appendix C P17-10)' },
  'fair#0': { needs: ['tier: >= village'], notes: '"the high street"' },
  'fair#2': { needs: ['gate'], notes: '"the toll-gate": factsOf.defence.gate (a palisade is no gate)' },
  'offering#0': { needs: ['institution: temple'], notes: '"the altar"' },
  'offering#2': { needs: ['institution: temple'], notes: '"the temple steps"' },
  'offering#3': { needs: ['institution: temple'], notes: '"the shrine" (the temple kind matches shrine)' },
};
out.push(write('traditions.TRADITION_TRAPPINGS', 'src/data/traditionCorpus.js :: TRADITION_TRAPPINGS', 'R',
  { declares: ['act (the key)'], crisisScoped: false, colour: false, notes: 'genesis.js :: pickTrappings shuffles the act\'s list (pool length - 1 rolls on a forked PRNG): phase B must resolve after the shuffle, never filter before it (design §3.3 R)' },
  Object.entries(tc.TRADITION_TRAPPINGS).flatMap(([act, list]) => list.map((t, i) => row(`traditions.TRADITION_TRAPPINGS::${act}#${i}`, t, TR[`${act}#${i}`])))));
const EP = {
  0: { needs: ['walls'], notes: '"older than the walls": the perimeter (ruling 3)' },
  1: { needs: ['tier: >= town'], notes: '"the whole quarter"' },
  3: { notes: '"any charter the town can show": tier noun is spoken by the caller; no atom' },
};
out.push(write('traditions.TRADITION_EPITHETS', 'src/data/traditionCorpus.js :: TRADITION_EPITHETS', 'R',
  { declares: [], crisisScoped: false, colour: false, notes: 'fork(epithet).pick (fork-isolated, 1 roll)' },
  tc.TRADITION_EPITHETS.map((t, i) => row(`traditions.TRADITION_EPITHETS::${i}`, t, EP[i]))));
out.push(write('traditions.TRADITION_NAMING', 'src/data/traditionCorpus.js :: TRADITION_NAME_TEMPLATES · TRADITION_ADJECTIVES · TRADITION_CULTURE_FLAVOR · TRADITION_SEASON_LABELS · WEEK_ORDINALS', 'R',
  { declares: ['culture (the CULTURE_FLAVOR key)', 'season (the label key: no atom, ruling 8)'], crisisScoped: false, colour: true, notes: 'name grammar and adjectives; presume nothing beyond their keys' },
  [
    ...tc.TRADITION_NAME_TEMPLATES.map((t, i) => row(`traditions.TRADITION_NAME_TEMPLATES::${i}`, t)),
    ...tc.TRADITION_ADJECTIVES.map((t, i) => row(`traditions.TRADITION_ADJECTIVES::${i}`, t)),
    ...Object.entries(tc.TRADITION_CULTURE_FLAVOR).flatMap(([c, l]) => l.map((t, i) => row(`traditions.TRADITION_CULTURE_FLAVOR::${c}#${i}`, t))),
    ...Object.entries(tc.TRADITION_SEASON_LABELS).map(([s, t]) => row(`traditions.TRADITION_SEASON_LABELS::${s}`, t)),
    ...tc.WEEK_ORDINALS.map((t, i) => row(`traditions.WEEK_ORDINALS::${i}`, String(t))),
  ]));
const PR = {
  'TRAD_CANCELLED_SUMMARY': { crisis: 'any', notes: '"hardship left no room": the cancelled outcome is the key; sayable in or out of a crisis' },
};
out.push(write('traditions.TRADITION_PROSE', 'src/data/traditionProse.js :: TRAD_HELD_SUMMARY · TRAD_CANCELLED_SUMMARY · TRAD_HOOKS · TRAD_OUTCOME_PHRASE', 'H',
  { declares: ['outcome / relation (the key)'], crisisScoped: false, colour: true, notes: 'prose.js :: pickLine (fnv, 0 rolls). suppressed / restored are keyed on the occupation relation (key-guaranteed); adopted on newcomers (key).' },
  [
    ...tp.TRAD_HELD_SUMMARY.map((t, i) => row(`traditions.TRAD_HELD_SUMMARY::${i}`, txt(t))),
    ...tp.TRAD_CANCELLED_SUMMARY.map((t, i) => row(`traditions.TRAD_CANCELLED_SUMMARY::${i}`, txt(t), PR.TRAD_CANCELLED_SUMMARY)),
    ...Object.entries(tp.TRAD_HOOKS).flatMap(([k, l]) => l.map((t, i) => row(`traditions.TRAD_HOOKS::${k}#${i}`, txt(t), k === 'triumph' && i === 0 ? { notes: '"cut-purses": crime presumed loosely; not declared' } : undefined))),
    ...Object.entries(tp.TRAD_OUTCOME_PHRASE).flatMap(([k, l]) => l.map((t, i) => row(`traditions.TRAD_OUTCOME_PHRASE::${k}#${i}`, t))),
  ]));

// ── HOOK TABLES ──
const hl = await imp('src/domain/dossier/hookLines.js');
const HL = {
  'property#0': { needs: [GUARD], notes: '"has posted guards": an armed body (the reader:hook-pools [guard] word); a faction\'s hired men are not homed' },
};
out.push(write('hooks.HOOK_LINE_POOLS', 'src/domain/dossier/hookLines.js :: HOOK_LINE_POOLS (conflict · foodGap)', 'H',
  { declares: ['conflict: the issue family (key)', 'foodGap: food-band: deficit (key: drawn only on a refused famine hook with a real gap)'], crisisScoped: false, colour: false, notes: 'createConflictHookDraw (fnv, without replacement per family); foodGapHookLine (fnv). The house voice already claims no building, force or spell; one line names guards.' },
  [
    ...Object.entries(hl.HOOK_LINE_POOLS.conflict).flatMap(([fam, l]) => l.map((f, i) => row(`hooks.HOOK_LINE_POOLS::conflict.${fam}#${i}`, f('{a}', '{b}', '{issue}'), HL[`${fam}#${i}`]))),
    ...hl.HOOK_LINE_POOLS.foodGap.map((t, i) => row(`hooks.HOOK_LINE_POOLS::foodGap#${i}`, t, i === 0 || i === 4 ? { notes: '"Grain": grain presumed as the imported staple; the key (a food gap) carries it' } : undefined)),
  ]));
out.push(write('hooks.ECHO_PREFIXES', 'src/domain/dossier/plotHooks.js :: ECHO_PREFIXES · src/generators/historyGenerator.js :: ECHO_PREFIXES', 'A',
  { declares: [], crisisScoped: false, colour: true, notes: 'connective prefixes; presume nothing' },
  ['old records suggest ', 'a recently surfaced document implies ', 'family accounts passed down from the time claim ', "an archivist's notes from that period reveal ", 'evidence that survived the years indicates '].map((t, i) => row(`hooks.ECHO_PREFIXES::${i}`, t))));
const OUT = [
  ['route-cut', 'The {route} trade route is cut off by bandits, war, or weather. The settlement has {n} days of food left. Famine follows within weeks.', { notes: 'key: a trade-dependent food balance on a route; hook-truth refuses its famine words on a fed place' }],
  ['grain-price', 'A poor harvest somewhere else has spiked the price of grain. The settlement must decide what it can still afford to import...', { notes: 'key: food imports' }],
  ['starving', 'The settlement is starving. Villagers are turning to banditry, and a merchant has offered to supply food at a price...', { needs: ['food-band: deficit', 'tier: <= village'], notes: '"Villagers": a small place; hook-truth already refuses the starving words on a fed place (famine rule)' }],
  ['guild-monopoly', 'A single merchant guild controls grain imports and has raised prices 300%...', { needs: ['food-band: deficit'], notes: 'unhomed: guild (a merchant guild) — key: hasDeficit on a connected route' }],
  ['dam', 'Upstream settlement builds dam or diverts river. Threatens water access AND grain shipments. Diplomacy or war?', { needs: ['water: river'], notes: 'key: route river (guaranteed); declared because the key is the ROUTE, not the water home' }],
  ['blockade', 'An enemy fleet or a pirate squadron blockades the port. The settlement has {n} days of reserves...', { needs: ['water: coast'], notes: 'key: route port AND terrain coastal (guaranteed)' }],
  ['bandits', 'Bandits are taking the food caravans, and the settlement has posted a bounty for clearing the trade road...', { needs: ['route: road'], notes: 'key: route road (guaranteed)' }],
  ['timber', "Something is killing the forest the timber comes from, and the settlement's building and shipbuilding trades stall without it...", { needs: ['water: navigable'], notes: '"shipbuilding trades": presumes boats can be built and floated (the reader:hook-pools [sea] class on plains/desert roads). A shipyard is no institution kind (docks matches docks/harbour/wharf/quay/port), so the water home answers. TWIN OWED: the same sentence without "and shipbuilding" (excludes: water: navigable) — the chair\'s ruling, recorded in the lane doc' }],
  ['iron', 'War breaks out. Metal suppliers prioritize military contracts. Blacksmiths cannot get iron for tools/repairs...', { needs: ['institution: smith'], notes: '"Blacksmiths": key is hasImportProcessor(iron), which reads the raw roster at generation; declared so the live roster answers' }],
];
out.push(write('hooks.OUTLOOK_foodBalance', 'src/generators/economy/foodBalance.js :: (economicViability.plotHooks writers)', 'T',
  { declares: [], crisisScoped: false, colour: false, notes: 'inline T branches; stored on economicViability.plotHooks; storeTrueHooksOnly drops the false ones today (hook-truth classifier: famine, defence, crime). Phase B: the self-check re-asserts these declarations on the stored hooks (R5).' },
  OUT.map(([k, t, d]) => row(`hooks.OUTLOOK_foodBalance::${k}`, t, d))));
const SAF = [
  ['stateCrime', 'A local family wants evidence of tax extortion gathered quietly, but the extorter wears an official badge.', { needs: ['crime'] }],
  ['crimeIsGovt', 'Someone approached the party seeking legitimate authority to settle a dispute. The only "authority" here is {ref}.', { needs: ['crime'], notes: 'the ref is already tier-keyed (quarter from a town up)' }],
  ['arcaneBlackMarket', "A wizard's tower component went missing. The black market has it...", { needs: ['magic', 'crime'] }],
  ['religiousFraud', 'A pilgrim paid a fortune for a holy relic that is obviously fake...', {}],
  ['merchantCriminalBlur', 'A guild merchant hired the party, then asked them to do something the guild officially forbids...', { notes: 'unhomed: guild' }],
  ['hasSmuggling', 'The smuggling network is moving something unusual this week...', { needs: ['crime'] }],
  ['crusaderSynthesis', 'The garrison chaplain and the commander are the same man...', { needs: ['garrison'] }],
  ['merchantArmy', "The merchant guild's private security force just detained someone... The watch is looking the other way.", { needs: ['watch'], notes: 'unhomed: guild' }],
];
out.push(write('hooks.SAFETY_safetyProfile', 'src/generators/safetyProfile.js :: generateSafetyProfile (plotHooks)', 'T',
  { declares: ['the stress flag of each branch (key)'], crisisScoped: false, colour: false, notes: 'Defense-surface table (Safety & Crime hooks on the Plot Hooks tab); declared here because reader:hook-pools reads the whole tab. Its flags read priorityHelpers (CENSUS-1 left them, militia measured moving births).' },
  SAF.map(([k, t, d]) => row(`hooks.SAFETY_safetyProfile::${k}`, t, d))));
const hd = await imp('src/data/historyData.js');
const HH = {
  'succession_crisis#1': { excludes: ['ruler: council'], notes: '"the ailing ruler ... naming a successor": a personal seat' },
  'succession_crisis#2': { excludes: ['ruler: council'], notes: '"poisoning the ruler"' },
  'economic_disparity#1': { needs: ['tier: >= town'], notes: '"the workers\' quarter"' },
  'religious_tension#0': { notes: 'relic: neutral' },
  'guild_conflict#0': { notes: 'unhomed: guild (the template presumes a guild; hasGuild only biases the draw, Appendix C P20-10..12)' },
  'guild_conflict#1': { notes: 'unhomed: guild' },
  'guild_conflict#2': { needs: ['market'], notes: 'unhomed: guild; "destabilize the market"' },
  'resource_scarcity#0': { needs: ['market'], notes: '"held off the market"' },
  'crime_wave#1': { needs: [GUARD], notes: '"A guard captain" (reader:hook-pools [guard], soak1k-32/42/54)' },
  'magical_controversy#0': { needs: ['magic'] }, 'magical_controversy#1': { needs: ['magic'] }, 'magical_controversy#2': { needs: ['magic'] },
  'generational_divide#1': { notes: '"the old guard" is figurative; it declares nothing, but GUARD_WORDS reads it (an instrument false positive, open question)' },
  'population_friction#0': { needs: ['migration: in'] }, 'population_friction#1': { needs: ['migration: in'] }, 'population_friction#2': { needs: ['migration: in'] },
  'market_crash#0': { needs: ['market'] },
  'plague_years#0': { notes: 'a healer person; institution not presumed' },
  'great_flood#1': { needs: ['water: navigable'], notes: '"a structure meant to hold back the water"' },
  'great_flood#2': { needs: ['water: navigable'], notes: '"a wreck": submerged' },
  'heresy_trial#2': { needs: ['institution: temple'], notes: '"the temple vault"' },
  'pilgrimage_surge#1': { needs: ['institution: temple'] },
  'pilgrimage_surge#2': { needs: ['institution: temple'], notes: '"a rival shrine"' },
  'wild_magic#0': { needs: ['magic'] }, 'wild_magic#1': { needs: ['magic'] }, 'wild_magic#2': { needs: ['magic'] },
  'demographic_pressure#0': { needs: ['migration: in'], notes: '"the newcomers"' },
  'demographic_pressure#1': { needs: ['migration: out'], notes: '"the properties the departed left behind": the template holds BOTH directions (in on #0/#2, out on #1) — one is false wherever a migration runs one way' },
  'demographic_pressure#2': { needs: ['migration: in'] },
};
out.push(write('hooks.HISTORY_EVENT_HOOKS', 'src/data/historyData.js :: HISTORICAL_EVENTS_DATA[].plotHooks', 'R',
  { declares: ['the event type (key)'], crisisScoped: false, colour: false, notes: 'drawn by historyGenerator fill/timeline loops (content-dependent roll counts, §2.2): phase B resolves after the draw. The events hooks print on Plot Hooks (History Event) and are stored (record hooks).' },
  Object.values(hd.HISTORICAL_EVENTS_DATA).flatMap((v) => (v.plotHooks || []).map((h, i) => row(`hooks.HISTORY_EVENT_HOOKS::${v.type}#${i}`, txt(h), HH[`${v.type}#${i}`])))));
const nd = await imp('src/data/npcData.js');
const NH = {
  'government#5': { needs: [GUARD], notes: '"the guard is currently investigating"' },
  'military#0': { needs: [GUARD], notes: '"Three guards ... on night patrol" (soak1k-1, soak1k-14)' },
  'military#1': { needs: ['garrison|militia'], notes: '"the armoury"' },
  'military#3': { needs: [GUARD], notes: '"a prisoner in their custody"' },
  'military#5': { needs: ['garrison|militia'], notes: '"their soldiers" (F10 defenceTwinLine already rewrites soldiers words post-draw)' },
  'military#7': { needs: [GUARD], notes: '"the patrol route"' },
  'military#10': { needs: ['garrison|militia'], notes: '"a weapons cache they were responsible for"' },
  'religious#2': { needs: ['institution: temple'], notes: '"the shrine"' },
  'economy#3': { needs: ['market'], notes: '"price-fixing across the whole market"' },
  'economy#6': { notes: '"lost at sea": the cargo may sail elsewhere; reader:hook-pools [sea] reads "the sea" — declared nothing (the merchant ships through others), open question' },
  'criminal#0': { needs: [GUARD], notes: '"talking to the guard" (soak1k-13)' },
  'criminal#2': { notes: '"the legitimate government": neutral' },
  'criminal#6': { needs: [GUARD], notes: '"The guard captain has a file"' },
  'magic#2': { needs: ['magic'] }, 'magic#5': { needs: ['magic'] }, 'magic#6': { needs: ['magic'] },
};
const loy = nd.NPC_FACTION_LOYALTY;
out.push(write('hooks.NPC_FACTION_LOYALTY', 'src/data/npcData.js :: NPC_FACTION_LOYALTY (NPC plot-hook titles)', 'R',
  { declares: ['the NPC category (key)'], crisisScoped: false, colour: false, notes: 'SHARED WITH CENSUS-4 (NPCs): declared here only because reader:hook-pools reads the Plot Hooks tab whole; CENSUS-4 owns the table and its application. drawLoyalty -> drawUnique (always 1 roll, safe for a gate); inlandHookLine F5 post-draw.' },
  Object.entries(loy).flatMap(([k, v]) => (Array.isArray(v) ? v : Object.values(v).flat()).map((h, i) => row(`hooks.NPC_FACTION_LOYALTY::${k}#${i}`, txt(h), NH[`${k}#${i}`])))));

fs.writeFileSync(path.join(here, '_mine_summary.json'), `${JSON.stringify({ tables: out.length, rows: out.reduce((a, t) => a + t.rows, 0), rowsDeclaring: out.reduce((a, t) => a + t.declaring, 0), colourTables: out.filter((t) => t.colour).map((t) => t.id), crisisScoped: out.filter((t) => t.crisisScoped).map((t) => t.id), perTable: out }, null, 1)}\n`);
console.log(JSON.stringify(out.map((t) => `${t.id} ${t.declaring}/${t.rows}`)));
