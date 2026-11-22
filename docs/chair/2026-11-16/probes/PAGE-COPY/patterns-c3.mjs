// CENSUS-3 patterns: the chair's laws of 2026-11-13/14 that a script can check against the record or against another
// line of the same page, one kind id a law (L1..L16). Each returns [{ pattern, sub, why }] for one rendered line, as
// patterns.mjs and patterns-dh.mjs do; a hit is a CANDIDATE until read. Laws (or arms of laws) a script cannot check, or
// that an existing kind already counts, are named in LAW_NOT_CHECKED below and in the report.
import { A_VOCAB, guarded, maskResources } from './patterns.mjs';
const SKIP_VIEW = /^Notes\//;
const NEG = /\b(no|not|never|nor|cannot|can't|couldn't|could not|would not|wouldn't|without|none|neither|lacks?|no longer|unable)\b[^.;:!?]{0,40}$/i;
const PROSE = (l) => (l.match(/\b[a-z][a-z'’-]{2,}\b/g) || []).length >= 4;
const esc = (t) => String(t).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const PAST = /\b(?:once|used to|before the (?:siege|famine|occupation|war|blockade|plague)|until the|in (?:better|easier|the old) (?:times|days|years)|in the old days|formerly|would|could|might|if the|when the (?:siege|roads|famine) (?:end|lift|break)|no longer|nothing|none|not\b|hardly|stopped|halted|cut off|closed|stuck)\b/i;

// ---------- L1: a line claims no verdict that a band on its own page can deny ----------
// The Defense tab's threat bars ("Invasion & War" then "Weak▼") read once a town; a line that says the town would hold,
// see off, or is well defended against a threat whose bar is Weak or Critical. And "Strong" beside "Desperate" in one row.
const L1_THREAT = [
  { bar: 'Invasion & War', t: /\b(?:raid(?:ers|s)?|invasion|invaders?|army|armies|war-?bands?|attackers?|assault|besiegers?|enemy|enemies|siege)\b/i },
  { bar: 'Beasts & Monsters', t: /\b(?:beasts?|monsters?|wolves|creatures?|predators?)\b/i },
  { bar: 'Internal Security', t: /\b(?:thie(?:f|ves)|crime|criminals?|brawls?|riots?|unrest|disorder|bandits?)\b/i },
];
const L1_VERDICT = /\b(?:(?:could|would|can|will|should) (?:easily |readily |comfortably )?(?:hold off|see off|fight off|beat off|drive off|turn back|repel|withstand|hold out against|hold against|weather|survive|handle|deal with)|well[- ](?:defended|protected|guarded|garrisoned)|(?:is|stands|remains) (?:safe|secure) from|in no danger from|has little to fear from)\b/i;
function bars(ctx) { return ctx._bars ??= (() => { const out = {}; const d = ctx.V['Systems/Defense'] || []; for (let i = 0; i < d.length - 1; i++) { for (const b of ['Beasts & Monsters', 'Invasion & War', 'Internal Security', 'Economic Survival', 'Disasters & Famine'])
    if (d[i] === b) { const m = (d[i + 1] || '').match(/^(Critical|Weak|Poor|Fragile|Adequate|Fair|Good|Strong|Excellent|Robust)\b/); if (m) out[b] = m[1]; } } return out; })(); }
export function testL1(line, view, ctx) {
  if (SKIP_VIEW.test(view)) return []; const res = [];
  if (/\bStrong\b/.test(line) && /\bDesperate\b/.test(line) && line.length < 160) res.push({ pattern: 'L1', sub: 'strong-desperate', why: '"Strong" beside "Desperate" in one row' });
  const m = line.match(L1_VERDICT); if (!m) return res; if (NEG.test(line.slice(Math.max(0, m.index - 45), m.index))) return res;
  const B = bars(ctx); const after = line.slice(m.index, m.index + m[0].length + 60); const around = line.slice(Math.max(0, m.index - 60), m.index + m[0].length + 60);
  for (const th of L1_THREAT) { if (!th.t.test(after) && !(th.t.test(around) && /well[- ]/.test(m[0]))) continue; const r = B[th.bar]; if (r && /^(?:Critical|Weak)$/.test(r)) { res.push({ pattern: 'L1', sub: th.bar, why: `"${m[0]}" (${th.bar}) beside its bar "${r}"` }); break; } }
  return res;
}

// ---------- L2: no catalogue bracket, no stored key, no slash label inside a sentence ----------
// (the machinery of a rating is kind g; a count range or condition in a house's NAME is kind f: L2's arms here are the
// rest: a catalogue bracket inside a sentence, a stored key, a key in brackets, a slash label in a sentence)
const SLASH = /\b([A-Za-z][a-z]+(?: [a-z]+)?)\/([A-Za-z][a-z]+)\b/g;
const SLASH_OK = /^(?:and\/or|his\/her|he\/she|him\/her|s\/he|either\/or|w\/o|n\/a|lbs\/\w+|\w+\/(?:day|week|month|year|head|person|household|acre|lb|lbs))$/i;
const CAMEL = /\b[a-z]{2,}[A-Z][a-z]{2,}[A-Za-z]*\b/;
const SNAKE = /\b[a-z]+_[a-z][a-z_]*\b/;
function keySet(ctx) { return ctx._keys ??= (() => { const out = new Set(); const walk = (o, d) => { if (d > 6 || o == null) return; if (typeof o === 'string') { if (/^[a-z]+(?:_[a-z]+)*$/.test(o) && o.length >= 5) out.add(o); return; } if (typeof o !== 'object') return; for (const v of Object.values(o)) walk(v, d + 1); };
  const s = ctx.s; walk(s.economicState?.activeChains, 0); walk(s.stress, 0); walk((s.institutions || []).map((i) => ({ c: i.category, k: i.catalogId, st: i.status })), 0); walk(s.powerStructure?.factions?.map((f) => ({ c: f.category, m: f.modifiers })), 0); walk(s.config, 0); return out; })(); }
function catParens(ctx) { return ctx._cp ??= (() => { const out = new Map(); for (const c of ctx.catalog?.values() || []) { const m = c.name.match(/\(([^)]+)\)/); if (m && !/^\d|households|only/.test(m[1])) out.set(m[1].toLowerCase(), c.name); } return out; })(); }
export function testL2(line, view, ctx) {
  if (SKIP_VIEW.test(view)) return []; const res = []; let m;
  if ((ctx.surface === 'pdf' || ctx.surface === 'journal') && (m = line.match(CAMEL)) && !/\b(?:McA|Mac|iP|eB)|SettlementForge/.test(m[0])) res.push({ pattern: 'L2', sub: 'stored-key:camel', why: `"${m[0]}"` });
  if ((m = line.match(SNAKE))) res.push({ pattern: 'L2', sub: 'stored-key:snake', why: `"${m[0]}"` });
  const keys = keySet(ctx); for (const mm of line.matchAll(/\(([a-z]+(?:_[a-z]+)*)\)/g)) { if (keys.has(mm[1]) || keys.has(mm[1].replace(/ /g, '_'))) { res.push({ pattern: 'L2', sub: 'key-in-brackets', why: `"${mm[0]}" (a stored key of this record)` }); break; } }
  if (PROSE(line)) { const cp = catParens(ctx); for (const mm of line.matchAll(/\(([^)]{3,30})\)/g)) { const k = mm[1].toLowerCase(); if (!cp.has(k)) continue;
      const own = (ctx.s.institutions || []).some((i) => String(i.name).toLowerCase().includes(`(${k})`) && line.includes(ctx.displayName ? ctx.displayName(i.name) : i.name) && (ctx.displayName ? ctx.displayName(i.name) : i.name).includes(mm[0]));
      if (!own) { res.push({ pattern: 'L2', sub: 'catalogue-bracket', why: `"${mm[0]}" (the catalogue's bracket, ${cp.get(k)})` }); break; } } }
  return res;
}
// ---------- L12: a faction or a good named in a sentence takes its prose form (L2's slash labels, by label) ----------
export function testL12(line, view, ctx) {
  if (SKIP_VIEW.test(view) || !PROSE(line)) return []; const res = [];
  for (const m of line.matchAll(SLASH)) { const w = m[0]; if (SLASH_OK.test(w) || /\d/.test(line.slice(m.index - 1, m.index))) continue; res.push({ pattern: 'L12', sub: w.toLowerCase(), why: `"${w}" (a slash label in a sentence)` }); break; }
  return res;
}

// ---------- L3: two things a page says are set apart ----------
// On the PDF's text and the journal only: the tab's dump joins inline elements without the gap CSS gives them, so a
// tab line cannot tell a glued chip from a laid-out one (stated in the report). A lower-case letter or a full stop
// followed at once by a capital.
export function testL3(line, view, ctx) {
  if (ctx.surface !== 'pdf' && ctx.surface !== 'journal') return []; let m;
  if ((m = line.match(/[a-z]{2}[.!?:;,][A-Z][a-z]/)) && !/\b(?:St|Dr|Mr|Mrs|Ms)\.[A-Z]/.test(m[0])) return [{ pattern: 'L3', sub: 'stop-capital', why: `"${m[0]}" (no space after the stop)` }];
  if ((m = line.replace(/SettlementForge/g, '').match(/(?<![A-Z])[a-z]{3}[A-Z][a-z]{2}/)) && !/(?:Mc|Mac|Fitz|De|Van|Von|La|Le|Di|Da)[A-Z]/.test(line.slice(Math.max(0, m.index - 1), m.index + 6))) return [{ pattern: 'L3', sub: 'run-together', why: `"${m[0]}" (a lower-case letter, then a capital, no space)` }];
  return [];
}

// ---------- L4: under a siege nothing comes in or goes out by road, gate or water ----------
// The arms kind b does not hold (fairs, imports arriving, exports leaving, a market heard trading, a walk to the next
// village); a magic channel the record holds may be said.
const L4 = [
  { id: 'fair', t: /\b(?:the |a |its |annual |yearly |seasonal |hiring |trade )fairs? (?:comes?|is held|draws?|brings?|opens?|fills?|runs?)\b|\bon fair days?\b|\bfair[- ]?days? (?:bring|draw|fill)/i },
  { id: 'imports-arrive', t: /\b(?:imports?|goods|grain|supplies|wares|cloth|salt|timber|ore|wine|ale) (?:arrives?|come in|comes in|are brought in|is brought in|are carted in|flows? in)\b|\bbrought in (?:from|by)\b|\b(?:comes?|arrives?) (?:in )?from (?:the )?(?:neighbou?ring|nearby|downriver|upriver|coast|city|capital)\b/i },
  { id: 'exports-leave', t: /\b(?:exports?|goods|grain|wool|ore|timber|cloth|wares) (?:leaves?|goes out|go out|are sent|is sent|are shipped|is shipped|are carted|travels?|reach(?:es)?) (?:out|to|downriver|abroad|south|north|east|west)\b|\b(?:sold|sent|carted|shipped) (?:on )?to (?:the )?(?:neighbou?ring|nearby|other|regional|city|capital)\b/i },
  { id: 'market-heard', t: /\bmarket (?:hums|bustles|is busy|is loud|rings|trades|thrives|teems)\b|\bstalls? (?:trade|are busy|do a brisk|bustle)\b|\bhaggling\b|\bbrisk trade\b|\bdoes a (?:brisk|steady|good) trade\b/i },
  { id: 'walk-out', t: /\b(?:walks?|rides?|goes|travels?|trips?|journeys?) (?:over |out |down |up )?to (?:the )?(?:next|neighbou?ring|nearby|other) (?:village|town|hamlet|farm|market|settlement)s?\b|\ba day's (?:walk|ride|journey) (?:away|to)\b/i },
];
const MAGIC = /\b(?:teleport\w*|portal|by spell|by magic|summoned|conjured|divine provision|by prayer|planar)\b/i;
export function testL4(line, view, ctx) {
  if (SKIP_VIEW.test(view) || !ctx.crisis.siege) return []; if (MAGIC.test(line)) return [];
  for (const v of L4) { const m = line.match(v.t); if (!m) continue; if (PAST.test(line.replace(m[0], ' ')) || /\bsiege|besieg|blockade/i.test(line)) continue; if (NEG.test(line.slice(Math.max(0, m.index - 50), m.index))) continue;
    return [{ pattern: 'L4', sub: v.id, why: `"${m[0]}" under a siege` }]; }
  return [];
}

// ---------- L5: under a famine no line offers the food that failed ----------
const L5 = [
  { id: 'fresh-produce', t: /\bfresh (?:fruit|vegetables|produce|greens|bread|milk|eggs|meat|cheese|butter)\b/i },
  { id: 'full-granary', t: /\b(?:full|overflowing|well[- ]stocked|bulging|brimming) (?:granar(?:y|ies)|barns?|storehouses?|larders?|stores)\b|\bgranar(?:y|ies) (?:is|are|stands?|sit) (?:full|well stocked|brimming)\b/i },
  { id: 'plenty', t: /\b(?:plenty|abundan(?:t|ce)|bountiful|bounty|feasts?|feasting|well[- ]fed|eats well|food to spare|plentiful)\b/i },
  { id: 'second-harvest', t: /\bsecond harvest\b/i, needNoGrain: true },
];
const FAM_EXCUSE = /famine|hunger|hungry|ration|starv|short|failed|fail|lost|before|used to|once|memory|remember|no longer|gone|would|could|might|if |when the|scarce|lean|dear|price|sold dear|black market|hoard/i;
export function testL5(line, view, ctx) {
  if (SKIP_VIEW.test(view) || !ctx.crisis.famine) return [];
  for (const v of L5) { const m = line.match(v.t); if (!m) continue; if (FAM_EXCUSE.test(line.replace(m[0], ' '))) continue; if (NEG.test(line.slice(Math.max(0, m.index - 50), m.index))) continue;
    if (v.needNoGrain) { const res = (ctx.s.config?.nearbyResources || []).join(' '); const mill = (ctx.roster || []).some((n) => /\bmill/i.test(n)); if (/grain|farm|arable|fertile/i.test(res) || mill) continue; }
    return [{ pattern: 'L5', sub: v.id, why: `"${m[0]}" under a famine` }]; }
  return [];
}

// ---------- L6: under an occupation no line says the hall decides for itself; the posture row is silent ----------
const L6 = /\b(?:decides? for itself|decides? its own|governs? itself|self-govern\w*|answers? to no(?: one|body)|free to (?:decide|choose|govern|rule)|makes? its own decisions|its own master|rules? (?:itself|alone|freely)|sets? its own (?:laws|rules|taxes))\b/i;
export function testL6(line, view, ctx) {
  if (SKIP_VIEW.test(view) || !ctx.crisis.occupied) return []; const res = [];
  const m = line.match(L6); if (m && !NEG.test(line.slice(Math.max(0, m.index - 50), m.index)) && !/\b(?:once|used to|before the occupation|until|occup)/i.test(line)) res.push({ pattern: 'L6', sub: 'decides-itself', why: `"${m[0]}" under an occupation` });
  if (ctx.prev === 'Defensive posture' && /^Systems\/Defense$/.test(view)) res.push({ pattern: 'L6', sub: 'posture-row', why: `the posture row prints "${line}" under an occupation` });
  return res;
}

// ---------- L7: a size word (the vote arm; the quarters/streets arms are kind c) ----------
const L7 = /\b(?:votes?|voted|voting|majority|outvoted?|ballot|must (?:all )?agree|agree among themselves|carried by|a quorum|by consensus of the (?:council|powers))\b/i;
export function testL7(line, view, ctx) {
  if (SKIP_VIEW.test(view)) return []; const m = line.match(L7); if (!m) return []; if (NEG.test(line.slice(Math.max(0, m.index - 40), m.index))) return [];
  const powers = (ctx.s.powerStructure?.factions || []).length; const gov = (ctx.s.npcs || []).filter((n) => n.category === 'government').length;
  if (powers < 2 && /between|powers|factions|camps/i.test(line)) return [{ pattern: 'L7', sub: 'vote-between-powers', why: `"${m[0]}" with ${powers} power on the record` }];
  if (powers < 2 && gov < 2) return [{ pattern: 'L7', sub: 'vote-of-one', why: `"${m[0]}" with ${powers} power and ${gov} governing person on the record` }];
  return [];
}

// ---------- L8: a count word reads the roster ----------
const NUM = { two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, both: 2, twin: 2 };
const COUNT_NOUN = /\b(two|three|four|five|six|seven|eight|both|twin) (?:of (?:the|its) )?(?:[a-z]+ )?(guilds|churches|chapels|temples|shrines|mills|inns|taverns|markets|burial grounds|graveyards|cemeteries|smithies|forges|wells|gates|bridges|granaries|docks|wharves|monasteries|watches|garrisons|bakeries|breweries|tanneries|healers|courts)\b/i;
const NOUN_R = { guilds: /guild/i, churches: /church|cathedral|parish/i, chapels: /chapel|church|shrine/i, temples: /temple/i, shrines: /shrine|chapel/i, mills: /^mills?\b|\bmill\b|windmill|watermill/i, inns: /\binns?\b|caravanserai/i, taverns: /tavern|ale ?house/i, markets: /market|fair\b/i, 'burial grounds': /burial|cemetery|graveyard|crypt|catacomb|ossuary/i, graveyards: /burial|cemetery|graveyard/i, cemeteries: /burial|cemetery|graveyard/i, smithies: /smith|forge/i, forges: /smith|forge/i, wells: /well\b|wells|water/i, gates: /gate/i, bridges: /bridge/i, granaries: /granar|grain/i, docks: /dock|wharf|harbou?r|pier|quay/i, wharves: /dock|wharf|harbou?r|pier|quay/i, monasteries: /monaster|friary|abbey|priory/i, watches: /watch/i, garrisons: /garrison|barracks/i, bakeries: /baker/i, breweries: /brew/i, tanneries: /tann/i, healers: /healer|physician|hospital|apothecar|herbal|midwife/i, courts: /court|magistrat/i };
export function testL8(line, view, ctx) {
  if (SKIP_VIEW.test(view)) return []; const res = []; let m;
  if ((m = line.match(/^Institutions behind this power \((\d+)\)$/))) { const n = +m[1]; const ls = ctx.lines || []; let k = 0;
    const names = ctx._allNames ??= new Set((ctx.s.institutions || []).flatMap((i) => [String(i.name), ctx.displayName ? ctx.displayName(String(i.name)) : String(i.name)]).map((x) => x.toLowerCase()));
    for (let j = ctx.index + 1; j < ls.length; j++) { const l = ls[j]; if (/^Institutions behind|(?:Dominant|Strong|Moderate|Weak|Minor|Marginal|Negligible|Contested)[▲▼]$/.test(l)) break; if (names.has(l.toLowerCase())) k++; }
    if (k && k !== n) res.push({ pattern: 'L8', sub: 'institutions-behind', why: `"(${n})" above ${k} rows that name houses of the roster` }); }
  if ((m = line.match(COUNT_NOUN))) { const n = NUM[m[1].toLowerCase()]; const noun = m[2].toLowerCase(); const r = NOUN_R[noun]; if (r && !NEG.test(line.slice(Math.max(0, m.index - 40), m.index)) && !/\b(?:between|neighbou?ring|nearby|other towns?|elsewhere|region)\b/i.test(line)) {
      const have = (ctx.s.institutions || []).filter((i) => r.test(String(i.name)) && !/^access to/i.test(i.name)).length; if (have < n) res.push({ pattern: 'L8', sub: noun, why: `"${m[0]}" with ${have} on the roster` }); } }
  return res;
}

// ---------- L9: a line that names a house reads the roster (the words kind a does not yet reach) ----------
const L9_VOCAB = [
  { id: 'granary', t: /\bgranar(?:y|ies)\b|\bgrain[- ]?stores?\b|\bgrain[- ]?houses?\b/i, r: /granar|grain|storehouse|warehouse|store/i },
  { id: 'bridge', t: /\bbridges?\b/i, r: /bridge|ferry|crossing/i, x: /\bbridge (?:the|a|that|this|gap|between)|bridges? (?:the|between)|to bridge\b/i },
  { id: 'smelter', t: /\bsmelt(?:er|ers|ery|ing|works)\b|\bfoundr(?:y|ies)\b|\bbloomer(?:y|ies)\b/i, r: /smelt|foundry|bloomer|forge|smith|metalwork|mine/i },
  { id: 'court-hearings', t: /\bhearings?\b|\bsits? in judg(?:e)?ment\b|\b(?:tried|heard) before the\b|\bcourt (?:sits|hears|rules|meets)\b/i, r: /court|magistrat|justice|law|judge|reeve|moot|council/i },
  { id: 'guild-dealings', t: /\bguilds? (?:(?:is|are) )?(?:at war|feuding|negotiating|bargaining|on strike|striking|in dispute)\b|\bguilds? (?:negotiates?|bargains?|strikes?|feuds?)\b/i, r: /guild/i },
  { id: 'forge-running', t: /\b(?:the |a |its )?forges? (?:runs?|is running|burns?|rings?|glows?|roars?|works?)\b|\bthe hammers? (?:ring|rings|sound)\b/i, r: /smith|forge|metalwork|smelt/i },
  { id: 'wharf', t: /\bwharf\b|\bwharves\b|\bwharfingers?\b|\blanding stages?\b/i, r: /dock|harbou?r|wharf|landing|port|pier|quay|ferry|boat/i },
];
export function testL9(line0, view, ctx) {
  if (SKIP_VIEW.test(view) || /^(?:Needs|Draws on|Requires|Unexploited|Opportunity|Origin|Founded by|How survived|Early trial):/i.test(line0) || /\b(?:grew up|founded|first settled|beside a strategic)\b/i.test(line0) || line0.includes('✓')) return [];
  const line = maskResources(line0, ctx.s).replace(/_/g, ' '); const res = [];
  for (const v of L9_VOCAB) { const re = new RegExp(v.t.source, 'gi'); let m;
    while ((m = re.exec(line))) { if (v.x && v.x.test(line.slice(Math.max(0, m.index - 20), m.index + m[0].length + 25))) continue; if (guarded(line, m.index, m[0].length)) continue;
      const w = m[0].toLowerCase().split(' ')[0].replace(/s$/, ''); if (ctx.npcRoles.some((r) => r.includes(w))) break; if (ctx.roster.some((n) => v.r.test(n))) break;
      res.push({ pattern: 'L9', sub: v.id, why: `"${m[0]}" with no ${v.id} on the roster` }); break; } }
  return res;
}

// ---------- L10: a line names no sex the record does not hold ----------
const FEM = /^(?:alewife|madam|mother|abbess|lady|queen|matriarch|goodwife|mistress|priestess|duchess|baroness|countess|empress|princess|widow|dame|sister|wife|daughter|grandmother|aunt|nun|prioress|hostess|landlady|seamstress|actress|heiress|enchantress|sorceress|huntress|songstress|laundress|fishwife|milkmaid|maid)$/i;
const MASC = /^(?:lord|king|father|abbot|patriarch|goodman|duke|baron|count|prince|emperor|sir|brother|husband|son|grandfather|uncle|monk|prior|host|landlord|master|alderman|fisherman|ferryman|headman|watchman|nobleman|horseman|ploughman|swordsman|boatman|journeyman|kinsman|chairman)$/i;
export function testL10(line, view, ctx) {
  if (SKIP_VIEW.test(view)) return []; const res = [];
  for (const n of ctx.s.npcs || []) { const name = String(n.name || ''); if (!name || !line.includes(name)) continue; const g = String(n.gender || '').toLowerCase(); if (g !== 'male' && g !== 'female') continue;
    const i = line.indexOf(name); const before = line.slice(Math.max(0, i - 30), i); const after = line.slice(i + name.length, i + name.length + 40);
    const cand = [...(before.match(/\b([A-Za-z]+) $/) || []).slice(1), ...(after.match(/^,? (?:the |a |an )?([a-z]+)\b/) || []).slice(1), ...(after.match(/^ \((?:the )?([a-z]+)\)/) || []).slice(1)];
    for (const w of cand) { if (g === 'male' && FEM.test(w)) { res.push({ pattern: 'L10', sub: 'female-word', why: `"${w}" for ${name}, recorded ${g}` }); break; } if (g === 'female' && MASC.test(w)) { res.push({ pattern: 'L10', sub: 'male-word', why: `"${w}" for ${name}, recorded ${g}` }); break; } }
    if (res.length) break; }
  return res;
}

// ---------- L11: one founder on a page, and one founding ----------
// Every "Founded by" a town prints, on every surface, against the first the History tab prints; the record's own
// history.foundedBy is the fact.
function founders(ctx) { return ctx._fd ??= (() => { const out = []; for (const [v, ls] of Object.entries(ctx.V)) { if (v === '_' || /^Notes\//.test(v)) continue; for (const l of ls) { const m = l.match(/^Founded by:?\s*(.+)$/i) || l.match(/\bfounded by ([^.;]+)/i); if (m) out.push({ v, l, who: m[1].toLowerCase().replace(/^(?:a |an |the )/, '').replace(/[,.]$/, '').trim() }); } } return out; })(); }
export function testL11(line, view, ctx) {
  if (SKIP_VIEW.test(view)) return []; const m = line.match(/^Founded by:?\s*(.+)$/i) || line.match(/\bfounded by ([^.;]+)/i); if (!m) return [];
  const rec = String(ctx.s.history?.foundedBy || '').toLowerCase(); const who = m[1].toLowerCase().replace(/^(?:a |an |the )/, '').replace(/[,.]$/, '').trim(); if (!rec) return [];
  const key = (t) => (t.match(/[a-z]{4,}/g) || []).slice(0, 3).join(' ');
  const recK = key(rec.replace(/^(?:a |an |the )/, '')); if (!recK || key(who).includes(recK) || recK.includes(key(who)) || who.includes(recK.split(' ')[0])) return [];
  return [{ pattern: 'L11', sub: 'second-founder', why: `"founded by ${who.slice(0, 60)}" against the record's "${rec.slice(0, 60)}"` }];
}

// ---------- L13: a slot is not made the subject of a verb it does not agree with ----------
const L13 = /\b(?:The|the|Its|its|Their|their|This|this) ((?:[a-z]+ )?(?:years|days|months|seasons|families|guilds|merchants|traders|farmers|elders|people|folk|rights|laws|walls|gates|stores|fields|mines|woods|forests|roads|routes|wars|raids|riots|troubles|plagues|fevers|floods|fires|bandits|monsters|wolves|fisheries|markets|quarries|crafts|trades|goods|wares|imports|exports|reserves|accounts|debts|taxes|tithes|rites|festivals|feasts|customs)) (is|was|has|does|stands|lies|remains|keeps|holds|runs|feeds|makes)\b/;
export function testL13(line, view) {
  if (SKIP_VIEW.test(view) || !PROSE(line)) return []; const m = line.match(L13); if (!m) return [];
  if (/\b(?:of|for|in|on|at|from|between|among|with|whose|that|which)\s*$/i.test(line.slice(0, m.index))) return [];   // "the price of the goods is" reads as its head noun
  return [{ pattern: 'L13', sub: 'plural-singular', why: `"${m[0]}" (a plural subject, a singular verb)` }];
}

// ---------- L15: a line about money laid by or owed reads the prosperity and the crisis ----------
const L15_RICH = /\benough (?:laid by |put by |set aside |in reserve |in the coffers )?(?:for|to (?:last|see (?:it|the town) through)) (?:a |any )?(?:long|lengthy|years|several years|a long)\b|\b(?:deep|full|healthy|ample|comfortable|fat|well-filled) (?:reserves|coffers|treasury|purse|war chest)\b|\b(?:reserves?|coffers?|treasury) (?:are|is|stand|stands) (?:deep|full|healthy|ample|comfortable)\b/i;
export function testL15(line, view, ctx) {
  if (SKIP_VIEW.test(view)) return []; const p = String(ctx.s.economicState?.prosperity || ''); if (!/^(?:Poor|Struggling|Destitute|Impoverished|Failing)$/i.test(p)) return [];
  const m = line.match(L15_RICH); if (!m || NEG.test(line.slice(Math.max(0, m.index - 40), m.index)) || /\b(?:would|could|if|once|before|used to)\b/i.test(line.slice(Math.max(0, m.index - 40), m.index))) return [];
  return [{ pattern: 'L15', sub: 'rich-reserves', why: `"${m[0].slice(0, 70)}" in a ${p} town` }];
}

// ---------- L16: the cast of a crisis ----------
// the collaborator is never the occupier or the crisis's own face (stress.cast.roles); a minted stand-in's role claims
// no office the page denies ("Healer" beside "No healer is kept here").
function denials(ctx) { return ctx._den ??= (() => { const out = []; for (const [v, ls] of Object.entries(ctx.V)) { if (v === '_' || /^Notes\//.test(v)) continue; for (const l of ls) { const m = l.match(/^(?:there is )?no ([a-z]+(?: [a-z]+)?) (?:is kept|is here|stands|serves|works|in [A-Z]|here)\b|^no ([a-z]+)\b/i); if (m) out.push((m[1] || m[2]).toLowerCase()); } } return out; })(); }
export function testL16(line, view, ctx) {
  if (SKIP_VIEW.test(view)) return []; const res = [];
  for (const st of [].concat(ctx.s.stress || [])) { const roles = st?.cast?.roles || []; const col = roles.find((r) => r.role === 'collaborator'); const face = roles.find((r) => r.role === 'face');
    if (col && col.name && line.includes(col.name) && /collaborat/i.test(line)) { const occ = (ctx.s.npcs || []).find((n) => n.id === col.id && /occupy|occupation|governor|commander|besieg/i.test(`${n.role} ${n.title}`));
      if ((face && face.id === col.id) || occ) res.push({ pattern: 'L16', sub: 'collaborator-is-face', why: `${col.name} is the crisis's collaborator and its ${face && face.id === col.id ? 'face' : 'occupier'}` }); } }
  if (!res.length) { const den = denials(ctx); if (den.length) for (const n of ctx.s.npcs || []) { const role = `${n.role || ''} ${n.title || ''}`.toLowerCase(); if (!line.includes(n.name || '\u0000')) continue;
      for (const d of den) { const w = d.split(' ').pop().replace(/s$/, ''); if (w.length >= 4 && role.includes(w) && /^(?:healer|granary|grain|priest|smith|miller|mill|watch|guard|court|magistrate|physician|steward|reeve|garrison|temple|church)/.test(w)) { res.push({ pattern: 'L16', sub: 'stand-in-office', why: `${n.name}'s role "${role.trim()}" beside the page's "no ${d}"` }); break; } }
      if (res.length) break; } }
  return res;
}

export const LAW_TESTS = [['L1', testL1], ['L2', testL2], ['L3', testL3], ['L4', testL4], ['L5', testL5], ['L6', testL6], ['L7', testL7], ['L8', testL8], ['L9', testL9], ['L10', testL10], ['L11', testL11], ['L12', testL12], ['L13', testL13], ['L15', testL15], ['L16', testL16]];
// L14 (the page's food word has one home) is kind i's food-word fact taken between two tabs (surfaces-i.mjs).
export const LAW_NOT_CHECKED = {
  L2: 'the machinery of a rating is kind g; a count range, gate or condition in a house name is kind f (both counted on every surface)',
  L3: 'on the tabs: the dump joins inline elements without the gap the stylesheet lays out, so a glued chip cannot be told from a spaced one by text; checked on the PDF and the journal',
  L7: 'quarters, districts, wards and plural streets are kind c (thorp, hamlet, village); only the vote arm is new',
  L16: 'the lever arm ("the one who holds the lever does not bear the brunt") needs the holder\'s power, which the record does not join to the levers: not checked',
};
