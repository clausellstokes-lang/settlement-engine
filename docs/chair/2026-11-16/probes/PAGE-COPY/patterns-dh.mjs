// CENSUS-2 patterns d to h (the brief's order). Each returns [{ pattern, sub, why }] for one rendered line; a hit is a
// CANDIDATE until read. Shared guards come from patterns.mjs.
import { A_VOCAB } from './patterns.mjs';
const SKIP_VIEW = /^Notes\//;

// ---------- kind d: BROKEN TEXT ----------
const STOP = new Set(['the', 'a', 'an', 'of', 'to', 'in', 'and', 'or', 'it', 'is', 'that', 'on', 'at', 'for', 'by', 'as', 'with', 'its', 'be', 'was', 'are', 'he', 'she', 'they', 'his', 'her', 'their']);
const OK_DOUBLE = /\b(?:that that|had had|is is|very very|far far|ha ha|bye bye|so so|tut tut|knock knock)\b/i;
const CHIPS = '(?:minor|major|catastrophic|moderate|severe|critical|crisis|low|high|medium)';
const RUNON = new RegExp(`\\b${CHIPS}${CHIPS}(?:${CHIPS})*\\b`, 'i');
const PLURAL_POSS = /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)*?(?:Guilds|Families|Councils|Orders|Houses|Circles|Companies|Rights|Elders|Merchants|Brothers|Lords|Nobles|Clans|Bands|Blades|Hands|Keepers|Wardens|Authorities|Interests|Assemblies))'s\b/;
export function testD(line, view) {
  if (SKIP_VIEW.test(view)) return []; const res = [];
  const push = (sub, why) => res.push({ pattern: 'd', sub, why });
  let m;
  if ((m = line.match(/\b([A-Za-z]{2,})\s+\1\b/)) && !OK_DOUBLE.test(m[0]) && !/^[A-Z]/.test(m[1])) push('doubled-word', `"${m[0]}"`);
  // a capitalized word twice ("Chan Chan", "Tithes Tithes") is NOT counted: read, it is a person's recorded name or a
  // label beside its own description in the dump's joining, not a doubled label on the page
  // a phrase said twice in one sentence is NOT counted (read: almost always rhetoric or a name repeated); only a role
  // printed twice in one row: "Name (the warehouse factor), the warehouse factor"
  if ((m = line.match(/\(the ([^)]{3,40})\), the \1\b/))) push('doubled-label', `"${m[0]}"`);
  if ((m = line.match(PLURAL_POSS))) push('possessive', `"${m[0]}" (a hand-formed possessive)`);
  if ((m = line.match(RUNON))) push('run-together', `"${m[0]}" (a list printed run together)`);
  if ((m = line.match(/\{[A-Za-z_][\w.]*\}|\$\{|%s\b|\[\[|\]\]/))) push('unfilled-slot', `"${m[0]}"`);
  if ((m = line.match(/\bundefined\b|\bNaN\b|\[object\b|\bnull\b(?! and void)/))) push('undefined', `"${m[0]}"`);
  if ((m = line.match(/\b[a-z]+_[a-z][a-z_]*\b/))) push('raw-key', `"${m[0]}"`);
  if ((m = line.match(/\b\d-order chain\b|· covers \w|\bFORCED\b|\bdays of legal\b|\blegal reserves\b|\bhoarded legal\b|\b(?:Import|Needs imported): [A-Z]\w+ Processing\b/))) push('engine-word', `"${m[0]}"`);
  return res;
}

// ---------- kind e: DENIES WHAT THE TOWN HAS ----------
// A denial (its own phrase list, or a kind-a word right after "no"/"without"/"lacks") beside a roster that holds it.
// A household levy or a citizen militia is a militia; a contracted company (mercenaries, hired blades, a free company)
// is a force; a paid force is a watch, a garrison or a contracted company (a levy is unpaid).
const FORCE = /watch|guard|garrison|militia|levy|mercenar|company|blades|barracks|citadel|knight|sellsword|hireling|warden|soldier|army/i;
const PAID = /watch|garrison|mercenar|company|blades|barracks|sellsword|hireling|professional|citadel/i;
const WALLS = /wall|palisade|fortification|citadel|earthwork/i;
const E_PHRASES = [
  { id: 'force', t: /\bno organi[sz]ed force\b|\bno standing force\b|\bno (?:armed )?force\b|\bno militia\b|\bno defenders\b|\bno line and no force\b|\bno one under (?:arms|command)\b/i, r: FORCE },
  { id: 'paid-force', t: /\b(?:nobody|no one) (?:here )?is paid to keep order\b|\bno paid (?:defenders|guards|force)\b/i, r: PAID },
  { id: 'walls', t: /\bno (?:perimeter )?walls?\b|\bunfortified\b|\bunwalled\b|\bno wall marks\b|\bno palisade\b|\bno fortifications?\b/i, r: WALLS },
  { id: 'watch', t: /\bthere is no watch\b|\bno (?:town |city |village )?watch\b(?! (?:over|for))/i, r: /watch/i },
  { id: 'market', t: /\bno market(?: or fair)?\b|\bno fair\b|\bno market or fair stands\b/i, r: /(?<!black )(?<!whisper )market|fair\b|bazaar/i },
  { id: 'church', t: /\bno church\b|\bhas no church of its own\b|\bno house of worship\b|\bno clergy\b|\bno priests?\b|\bno temple\b/i, r: /church|house of worship|houses of worship|cathedral|monaster|priest|friary|temple|abbey|chapel/i },
  { id: 'carpenters', t: /\bno (?:sawmill or )?carpenters?'? guild\b|\bno carpenters?\b/i, r: /carpent|craft guild/i },
  { id: 'healer', t: /\bno healers?\b|\bno one to tend\b|\bno physicians?\b/i, r: /healer|midwife|apothecar|hospital|physician|herbal/i },
  { id: 'court', t: /\bno court\b|\bkeeps no court\b|\bnowhere to take\b|\bno courthouse\b/i, r: /court|magistrat/i },
  { id: 'prison', t: /\bno gaol\b|\bno prison\b|\bnowhere to hold (?:the guilty|anyone)\b|\bno jail\b/i, r: /prison|stocks|gaol|jail/i },
  { id: 'arcane', t: /\bno arcane practitioners\b|\bno mages?\b|\bno wizards?\b/i, r: /wizard|mage|magic|enchant|sorcer|witch|warlock|teleport|planar/i },
];
const E_NEXT = /^(?:[.,;:)]|$|\s+(?:or|and|between|above|runs|finishes|keeps|here|in|at|to|stands|of its own|for)\b)/i;
export function testE(line0, view, ctx) {
  if (SKIP_VIEW.test(view) || view === 'Systems/Institutions') return [];   // a house's own description speaks of the house
  if (/\b(?:were there|if there were|would be|could handle|could ever)\b/i.test(line0)) return []; const line = line0.replace(/_/g, ' '); const res = []; const names = ctx.roster;
  for (const v of E_PHRASES) { const m = line.match(v.t); if (!m) continue; if (!E_NEXT.test(line.slice(m.index + m[0].length))) continue; const has = names.filter((n) => v.r.test(n));
    if (has.length) { res.push({ pattern: 'e', sub: v.id, why: `"${m[0]}" beside ${has.slice(0, 3).join(', ')}` }); } }
  if (!res.length) for (const v of A_VOCAB) { if (v.cat || v.id === 'ships' || v.id === 'merchants') continue; const rr = v.id === 'mason' ? /mason/i : v.r; const re = new RegExp(`\\b(?:no|without|lacks?(?: an?)?|has no|have no|not a single|there is no|there are no)\\s+(?:${v.t.source.replace(/^\\b/, '')})`, 'gi'); let m;
    while ((m = re.exec(line))) { if (/\bof its own\b/i.test(line.slice(m.index, m.index + m[0].length + 14))) continue; if (!E_NEXT.test(line.slice(m.index + m[0].length).replace(/^['’]s?\b/, ''))) continue; const has = names.filter((n) => rr.test(n));
      if (has.length) { res.push({ pattern: 'e', sub: v.id, why: `"${m[0]}" beside ${has.slice(0, 3).join(', ')}` }); break; } } }
  return res;
}

// ---------- kind f: THE HOUSE'S LABEL ----------
// A count range, a household range, a population gate or a condition printed in a house's name.
const F_LABEL = /\b([A-Z][\w'’&/ -]{1,40}?)\s?\((?:[\d,]+\s?[-–]\s?[\d,]+\+?(?: households)?|[\d,]+\+(?: households| only)?|if walled|high magic|multiple|district|guild)\)/;
export function testF(line, view) {
  if (SKIP_VIEW.test(view)) return []; const m = line.match(F_LABEL); if (!m) return [];
  if (/\b(?:aged|age|ages|years?|days?|weeks?|months?|lbs?|miles?|feet|pop\.?)\s*\(/i.test(m[0])) return [];
  const sub = /households/.test(m[0]) ? 'household-range' : /only\)/.test(m[0]) ? 'population-gate' : /if walled|high magic/.test(m[0]) ? 'condition' : /multiple|district|guild/.test(m[0]) ? 'tag' : 'count-range';
  return [{ pattern: 'f', sub, why: `"${m[0].trim()}" printed as a house's name` }];
}

// ---------- kind g: MACHINERY ON THE PAGE ----------
// A weight, a multiplier, a breakdown of a score, a percentage of recovery, a priority's (slider's) figure. A rating's
// own figure out of 100 is NOT machinery.
const G_FORMS = [
  { id: 'breakdown-row', t: /^(?:Prosperity|Safety|Defen[cs]e|Defense|Food|Crime|Order|Wealth|Stability|Legitimacy|Magic|Faith|Trade|Military|Economy|Religion|Law|Security|Unrest|Viability)\s*[+−-]\s?\d+$/ },
  { id: 'breakdown-label', t: /^Breakdown$/ },
  { id: 'multiplier', t: /×\s?\d|\bx\s?\d+\.\d+\b|\bmultiplier\b|\bpenalty:\s*[×x]?\d/i },
  { id: 'modifier-pct', t: /\b(?:Agriculture|Agricultural|Stress|Trade|Terrain|Climate|Season) (?:modifier|penalty|bonus):\s*[×x]?\d+%?/i },
  { id: 'weight', t: /\bINCOME WEIGHT\b|\b[Ww]eight(?:ed|ing)? (?:of|at|is) [×x]?\d/ },
  { id: 'gap-cover', t: /\bcovers \d+% of (?:the )?gap\b/i },
  { id: 'recovery-pct', t: /\b\d+% (?:recovery|recovered|of (?:its )?recovery)\b|\brecovery (?:of|at|is) \d+%/i },
  { id: 'slider', t: /\b(?:Military|Economic|Religious|Magic|Trade|Defen[cs]e|Social|Criminal|Arcane) slider\b|\bslider (?:is|at|value)\b/i },
  { id: 'priority-figure', t: /\bpriority (?:is|at|of) \d+(?:\/100)?\b|\b(?:Military|Economic|Religious|Magic|Trade|Defense|Social) priority\b[^.]{0,20}\d+/i },
  { id: 'points', t: /\b[+−-]\d+ (?:points?|pts)\b|\bscores? (?:of|at) \d+ points\b/i },
];
export function testG(line, view) {
  if (SKIP_VIEW.test(view)) return [];
  for (const v of G_FORMS) { const m = line.match(v.t); if (m) return [{ pattern: 'g', sub: v.id, why: `"${m[0]}"` }]; }
  return [];
}

// ---------- kind h: AN EMPTY SEAT'S KEEPER NAMED BY THE BARE TITLE ----------
// A power whose record marks its seat vacant (`powerStructure.factions[].modifiers` holds 'vacant'), and a page line
// that says "Acting <Title> <Name>, …, keeps the seat": any other line giving that person the bare title, or saying
// the person holds the seat, or printing the bare title as a role label (" · <Title>" on a relationship row).
export function testH(line, view, ctx) {
  if (SKIP_VIEW.test(view)) return [];
  const vacant = (ctx.s.powerStructure?.factions || []).filter((f) => (f.modifiers || []).includes('vacant')); if (!vacant.length) return [];
  const keepers = ctx._keepers ??= (() => { const out = []; const names = (ctx.s.npcs || []).map((n) => String(n.name || '')).filter(Boolean);
    for (const ls of Object.values(ctx.V)) for (const l of ls) { if (!/keeps the seat/.test(l)) continue;
      for (const nm of names) { const m = l.match(new RegExp(`Acting ([A-Z][^.,]*?) ${nm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}, [^.]*?keeps the seat`)); if (m && !out.some((o) => o.name === nm)) out.push({ title: m[1], name: nm }); } } return out; })();
  const res = [];
  for (const k of keepers) { const T = k.title; const esc = T.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const bare = new RegExp(`(?<!Acting )\\b${esc}\\b(?! [A-Z])`); if (!bare.test(line)) continue;   // not the power's own name ("Elder Council")
    const named = line.includes(k.name); const seat = /\bholds (?:its|the) seat\b/.test(line);
    const label = new RegExp(`· ${esc}(?:$| ·|,)`).test(line) || new RegExp(`^${esc} ·`).test(line);
    if ((named && !new RegExp(`Acting ${esc}`).test(line)) || (seat && named) || label) { res.push({ pattern: 'h', sub: named ? (seat ? 'holds-the-seat' : 'bare-title') : 'role-label', why: `"${T}" for ${k.name}, who keeps the empty seat as "Acting ${T}"` }); break; }
  }
  return res;
}
export const EXTRA_TESTS = [['d', testD], ['e', testE], ['f', testF], ['g', testG], ['h', testH]];
