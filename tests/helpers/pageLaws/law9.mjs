// BAR6-AUDIT-E · LAW 9 · A STATE WORD HAS ONE READING (mechanism M1; kinds K3, K5, K7).
// For each state the page prints (the law band, the crime structure, the watch's own row, the crime wave, the purse,
// the economy's label, the food word and the stores, trade access, the exports, magic's rows, legitimacy) a line
// elsewhere that asserts a contrary level of the SAME thing is an instance. Every rule names the page line (or the
// record field) it reads as the state (`against`) and the line that disagrees (`line`).
// A detector is a pure function over one town read by `pageB.mjs :: readTown` (the dossier tabs as printed and the
// stored record); it returns instances `{ law, rule, town, tab, line, sentence, against: { tab, line }, why, held,
// status }`. CONSERVATIVE FIRST: each pattern is drawn from the second check's own control rows (STANDS rows are the
// positive controls, EXPLAINED rows the negative). `held` names the BAR5 seat whose section already names the line or
// the fact (that round's); `status` is 'apart' for a rule the checkers ruled WEAK or ruled both ways (reported, not
// counted as standing). Pure; no I/O. Nothing here changes anything.
import { sentences } from './pageB.mjs';
import { MIXED_FORCE } from '../../../src/data/safetyDescLines.js';

const LAW = 'L9';

/** A working watch on the page: the safety line's Moderate watch rows (`src/data/safetyDescLines.js :: MIXED_FORCE.watch`, each
 *  whole, never a copied literal; PLACE-1, 2026-11-20) or the Safe line's "The watch is present and responsive". */
const WORKING_WATCH = new RegExp(`(${[...MIXED_FORCE.watch.map((r) => r.text.trim()), 'The watch is present and responsive']
  .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`);

// ---------------------------------------------------------------- reading the page's state words
const tabLines = (T, tab) => (T.tabs[tab] || []).map((text, i) => ({ tab, i, text }));
/** the first line (and its sentence) of the page matching re, optionally in the given tabs */
function find(T, re, tabs) {
  for (const x of T.all) {
    if (tabs && !tabs.some((t) => (t instanceof RegExp ? t.test(x.tab) : t === x.tab))) continue;
    if (!re.test(x.text)) continue;
    const sen = sentences(x.text).find((s) => re.test(s)) || x.text;
    return { ...x, sentence: sen };
  }
  return null;
}
/** every sentence of the page matching re: [{ tab, i, text, sentence, m }] */
function findAll(T, re, tabs) {
  const out = [];
  for (const x of T.all) {
    if (tabs && !tabs.some((t) => (t instanceof RegExp ? t.test(x.tab) : t === x.tab))) continue;
    if (!re.test(x.text)) continue;
    for (const s of sentences(x.text)) { const m = s.match(re); if (m) out.push({ ...x, sentence: s, m }); }
  }
  return out;
}
/** a value printed on the line after its label ("Safety" / "Moderate") on a tab */
function labelled(T, tab, label) {
  const ls = T.tabs[tab] || [];
  const i = ls.findIndex((l) => l === label);
  return i >= 0 && i + 1 < ls.length ? { tab, i: i + 1, text: ls[i + 1] } : null;
}
const foundation = (T, row) => {
  const x = find(T, new RegExp(`^${row.replace(/[&]/g, '&')} · (.+)$`), ['Summary/Foundations']);
  return x ? { ...x, word: x.text.split(' · ')[1].trim() } : null;
};
export function stateWords(T) {
  const band = foundation(T, 'Law & order');
  const safety = labelled(T, 'Summary/Overview', 'Safety');
  const prosperity = labelled(T, 'Summary/Overview', 'Prosperity');
  const stability = labelled(T, 'Systems/Power', 'Stability');
  const food = foundation(T, 'Food');
  const legit = foundation(T, 'Public legitimacy');
  const structure = find(T, /^Criminal structure: (.+)$/, ['Systems/Defense']);
  const wave = find(T, /\bCrime is rising faster than those in charge can answer it\b/) || find(T, /^Crime Wave$/, ['Summary/Plot Hooks']);
  const waveHook = find(T, /\bThe crime wave is coordinated\b/);
  const reliance = find(T, /^Reliance on magic: (None|Present|Relied upon|Integral)\b/, ['Systems/Magic']);
  const role = (r) => { const x = find(T, new RegExp(`^${r} role: (\\w+)`), ['Systems/Magic']); return x ? { ...x, word: x.text.split(': ')[1].trim() } : null; };
  return {
    band, bandWord: band?.word || null, safety, safetyWord: safety?.text || null, prosperity, prosperityWord: prosperity?.text || null,
    stability, food, foodWord: food?.word || null, legit, structure, structureWord: structure ? structure.text.replace(/^Criminal structure: /, '') : null,
    wave, waveHook, reliance, relianceWord: reliance ? reliance.text.match(/: (None|Present|Relied upon|Integral)/)[1] : null,
    relianceFor: reliance ? (reliance.text.match(/· for (.+?)(?: · supplied by |$)/)?.[1] || '') : '',
    roles: { military: role('Military'), medical: role('Medical'), economic: role('Economic'), infrastructure: role('Infrastructure') },
    crisis: T.crises.size > 0,
  };
}


/** the record's chain whose first output is the {good} a magic line names, and whether the reliance row names it */
function chainOfGood(T, W, goodRaw) {
  const good = goodRaw.trim().toLowerCase();
  const ch = (T.record?.economicState?.activeChains || []).find((c) => c?.magicNote && String((c.outputs || [])[0] || '').toLowerCase() === good);
  const label = ch?.label || ch?.name || '';
  return { good, label, named: !!label && W.relianceFor.toLowerCase().includes(label.toLowerCase()) };
}

const FOOD_GOOD = /\b(baked goods|bread|preserved foods|river fish|salted fish|fish|game meat|meat|grain|flour|dairy|cheese|honey|fruit|vegetables|ale|beer)\b/;
const UP_PROSPERITY = /^(Comfortable|Prosperous|Wealthy|Rich|Affluent|Thriving)$/;
const SAFE_WORD = /^(Safe|Very Safe|Moderate)$/;

// ---------------------------------------------------------------- the rules
// Each rule: { rule, held?, status?, run(T, W) -> [{ at, against, why }] } where `at` is a findAll/find hit.

/** pair helper: every sentence matching `claim` where `state(T,W)` returns an against */
const pair = (rule, claim, state, why, opts = {}) => ({
  rule, held: opts.held || null, status: opts.status || 'count', tabs: opts.tabs,
  run(T, W) {
    const ag = state(T, W);
    if (!ag) return [];
    return findAll(T, claim, opts.tabs).filter((h) => !(opts.skip && opts.skip(h, T, W))).map((h) => ({ at: h, against: ag, why: typeof why === 'function' ? why(h, ag, W) : why }));
  },
});

// 9a · THE LAW AND CRIME --------------------------------------------------------------------------------------------
// calm-times law prose (the controls C8611 C14349 C26333 C28848 C26311 C219464; bar read C42116)
// PROSE-E (CHAIR-2026-11-23-N70): DS-DEF-2 full legal chain v1 re-worded in place, "people expect a hearing, not a beating" ->
// "the accused can expect a hearing, not a beating"; the same calm-law claim, so the pin reads both words.
const CALM_LAW = /\b((?:people|the accused can) expect a hearing, not a beating|A functioning court and prison mean crimes carry real consequences|The old families keep the peace|A thief is known by name within a day|Thieves here know that the court sits and the cells are real|With a working court, organised crime treads carefully)\b/;
// the line that says crime is kept down / quiet (C143088 C43177)
const CRIME_KEPT_DOWN = /\b(enforcement keeps it down and keeps it from growing|keeps the streets quiet because trouble brings the law|Crime exists but is well-managed)\b/;
// the diffuse claims, strong (no organisation at all) and limited
const NO_ORG = /\b(organized crime has found no foothold|comes from lone thieves, not a gang|there is no boss to threaten or to bribe|with no gang behind it|with nothing to threaten and nobody to buy|either nobody does, or the \w+ hides it very well)\b/;
const LIMITED_ORG = /\borganized crime has a limited foothold\b/;
const ORG_STRUCT = /^(Organized syndicate|Semi-organized networks)$/;
const EMBEDDED = /\b(Deeply embedded in civic life|One criminal ring decides what crime is allowed here|theirs to say first, and the law's after)\b/;

export const RULES = [
  // (held by BAR5-SAFETY) the law's calm prose under a band the page prints Collapsed, where a crisis, a crime wave or an
  // unsafe word stands behind the band (a calm small place's Collapsed is BAR5-BAND's: 9a.band-quiet)
  pair('9a.collapsed', CALM_LAW, (T, W) => (W.bandWord === 'Collapsed' && (W.crisis || W.wave || (W.safetyWord && !SAFE_WORD.test(W.safetyWord))) ? W.band : null),
    'the page prints Law & order · Collapsed (under a crisis, a crime wave or an unsafe word); this unmarked line says crime is answered', { held: 'BAR5-SAFETY' }),

  // (held by BAR5-BAND) the band itself on a quiet small place: LB1's four conditions
  {
    rule: '9a.band-quiet', held: 'BAR5-BAND', status: 'count',
    run(T, W) {
      if (!W.band || !/^(Critical|Collapsed)$/.test(W.bandWord)) return [];
      if (W.crisis || W.wave || !W.safetyWord || !SAFE_WORD.test(W.safetyWord)) return [];
      const lawHouse = (T.record?.institutions || []).some((x) => /\b(court|courthouse|justice|magistrat|watch|constab|sheriff|guardhouse|gaol|jail|prison)\b/i.test(x?.name || ''));
      if (lawHouse) return [];
      return [{ at: { ...W.band, sentence: W.band.text }, against: W.safety, why: `Law & order · ${W.bandWord} on a quiet place with no office of the law, no crisis, no crime wave, Safety ${W.safetyWord}` }];
    },
  },

  // the crime structure: the panel's own safety line says organised crime has no or a limited foothold, the structure
  // (or a criminal power) says one ring runs it (C131929 C143085)
  pair('9a.structure', NO_ORG, (T, W) => (W.structureWord && ORG_STRUCT.test(W.structureWord) ? W.structure : null),
    (h, ag) => `the Defense tab prints "${ag.text}"; this line says no organisation stands behind the crime`),
  pair('9a.structure', LIMITED_ORG, (T, W) => (W.structureWord === 'Organized syndicate' ? W.structure : find(T, EMBEDDED, ['Systems/Defense', 'Systems/Power'])),
    (h, ag) => `the page prints "${ag.sentence || ag.text}"; this line says organised crime has a limited foothold`),

  // crime kept down, against a crime wave that stands (the tension, printed) (C143088 C43177)
  pair('9a.wave', CRIME_KEPT_DOWN, (T, W) => W.wave,
    'the page prints the crime-wave tension ("Crime is rising faster than those in charge can answer it"); this line says crime is kept down'),
  pair('9a.wave', CRIME_KEPT_DOWN, (T, W) => find(T, /\bCrime is on the rise\b/, ['Systems/Defense']),
    'the same panel prints "Crime is on the rise"; this line says crime is kept down'),

  // the curfew's two lines: theft rising, theft dropped (C183057 C194447 C198660)
  {
    rule: '9a.curfew', status: 'count',
    run(T) {
      const up = find(T, /\bTheft is rising even under the curfew\b/);
      const down = findAll(T, /\b(ordinary theft has dropped|Thieves are scarce now)\b/);
      return up ? down.map((h) => ({ at: h, against: up, why: 'the page says theft is rising under the curfew; this line says it has dropped' })) : [];
    },
  },

  // the watch's own row: "exists on paper" beside a watch the page prints working (C187260 C200637; bar read WEAK C36857)
  // PRECISION (720, seed 616: 3 of 5): "It keeps a watch, which is a matter of order rather than of war" is the defence
  // roster's word, not a working watch; under an occupation the occupiers keep order (bar read WEAK C36857), so there the
  // line is counted only beside a page line that prints the watch at work.
  {
    rule: '9a.watch', status: 'count',
    run(T) {
      const hits = findAll(T, /\bwatch exists on paper\b/);
      if (!hits.length) return [];
      const working = find(T, WORKING_WATCH); // PLACE-1 (2026-11-20): the Moderate line's watch rows, read by their pool
      const rounds = find(T, /\b(walking the night rounds|walking the lanes after dark)\b/);
      const occupied = T.crises.has('occupied');
      const ag = working || (!occupied ? rounds : null);
      if (ag) return hits.map((h) => ({ at: h, against: ag, why: `the page prints a working watch ("${ag.sentence}"); this line says it exists on paper` }));
      const weak = rounds || find(T, /\bIt keeps a watch, which is a matter of order\b/);
      return weak ? hits.map((h) => ({ at: h, against: weak, status: 'apart', rule: '9a.watch-weak', why: `the page prints "${weak.sentence}"${occupied ? ' under an occupation (the occupiers keep order)' : ''}; "exists on paper" overstates it: WEAK, apart` })) : [];
    },
  },

  // the militia's own row (C199950)
  pair('9a.militia', /\bThe militia is present and responsive\b/,
    (T) => find(T, /\b(absent during routine crime|cannot maintain consistent patrol)\b/)
      || (() => { const c = T.cards.find((c) => /militia/i.test(c.name) && c.marked); return c ? { tab: 'Systems/Institutions', i: c.headIdx, text: c.head } : null; })(),
    (h, ag) => `the page prints the militia absent from routine crime ("${ag.sentence || ag.text}"); this line says it is present and responsive`),
  pair('9a.militia', /\bThe watch is present and responsive\b/,
    (T) => find(T, /\bThere is no watch\b/),
    (h, ag) => `the page prints "${ag.sentence}"; this line says the watch is present and responsive`),

  // the law "present" where the page says there is none (C157107; WEAK C162769 where a law house stands)
  pair('9a.balance', /\bkeeps a working balance: the law is present\b/,
    (T) => { const w = find(T, /\bThere is no watch\b/); const c = find(T, /\bkeeps no court and no gaol\b/); return w && c ? c : null; },
    'the page says the place keeps no watch and no court; this line says the law is present'),

  // the lawless service line where the page keeps a court and a gaol (C172465)
  pair('9a.lawless', /\bThe law here is slow and easily outbid\b/,
    (T, W) => (W.bandWord && /^(Adequate|Strong|Secure|Robust)$/.test(W.bandWord) ? find(T, /\b(keeps its own court and its own gaol|A functioning court and prison mean)\b/) : null),
    (h, ag) => `the page prints "${ag.sentence}" and Law & order Adequate or better; this service line says the law is easily outbid`),

  // walls too thinly manned against forces in good order (C80552)
  pair('9a.manned', /\btoo few people man them\b/,
    (T) => find(T, /\b(people under arms and its works are both in good order|the soldiers who belong on them)\b/),
    (h, ag) => `the page prints "${ag.sentence}"; this line says too few people man the walls`),

  // the shadow economy's "same organised hands" against the Defense tab's diffuse structure (C213284)
  pair('9a.hands', /\bgoes through the same organised hands each time\b/,
    (T, W) => (W.structureWord && !ORG_STRUCT.test(W.structureWord) ? W.structure : find(T, /\b(No single dominant organisation|Several gangs may be competing)\b/)),
    (h, ag) => `the Defense tab prints "${ag.sentence || ag.text}"; this line says one organised hand takes the off-book trade`),

  // the forces "well paid" against the page's own cut pay (C51048)
  pair('9a.pay', /\b(are well paid, well equipped|watch are well paid)\b/,
    (T) => find(T, /\b(cuts the pay of those sent to stop it|the pay for stopping it shrinks|Chronically underpaid)\b/),
    (h, ag) => `the page prints "${ag.sentence}"; this line says the forces are well paid`),

  // CONTESTED (ruled both ways): no organisation, against the hook "The crime wave is coordinated" (C154050 C155339 STANDS;
  // C81673 C82881 C207455 C151604 EXPLAINED). Reported apart with both readings.
  pair('9a.contested', NO_ORG, (T, W) => W.waveHook,
    'the plot hook says the crime wave is coordinated; this line says no one runs the crime (a hook states its own fact: ruled both ways)', { status: 'apart' }),

  // 9b · PROSPERITY, THE PURSE, THE ECONOMY'S LABEL -----------------------------------------------------------------
  {
    rule: '9b.subsistence', status: 'count',
    run(T, W) {
      const lab = find(T, /^Subsistence — survival economy$/, ['Systems/Economics']);
      if (!lab || !W.prosperityWord || !UP_PROSPERITY.test(W.prosperityWord)) return [];
      const own = find(T, /\bgets by on a subsistence living\b/);
      return [{ at: lab, against: W.prosperity, why: `the page prints Prosperity ${W.prosperityWord}; the economy's label reads a survival economy${own ? ' (the page itself says "a subsistence living": WEAK, only "survival" is off)' : ''}`, status: own ? 'apart' : 'count' }];
    },
  },
  // the purse: "a little in hand" / "money to spare" against the stability word's "chronically underfunded" (bar read
  // C32519) or a borrowing line about a PUBLIC purse (C66113: the mint master's treasury). PRECISION (720, seed 616): the
  // same relationship line names a HOUSE's treasury (an arena master's, a granary reeve's) in 8 of 9 draws, which does not
  // deny the town's own purse: those are reported apart (9b.purse-house).
  {
    rule: '9b.purse', status: 'count',
    run(T) {
      const UP = /\b(pays its own way and has a little in hand|treasury takes in a little more than it pays out|With a little left over each year|closes every year ahead|ends each year with money to spare)\b/;
      const claims = findAll(T, UP).filter((h) => !/^Embattled region/.test(h.sentence));
      if (!claims.length) return [];
      const under = find(T, /\bchronically underfunded\)/, [/^(Summary|Systems|World)\//]);
      const borrow = find(T, /\b(\S.*?)'s treasury borrowed from .+ has borrowed every year since\b/, [/^(Summary|Systems|World)\//]);
      let ag = under, status = 'count', who = '';
      if (!ag && borrow) {
        const name = borrow.sentence.split("'s treasury")[0].trim();
        const npc = (T.record?.npcs || []).find((n) => n?.name === name);
        const key = String((npc?.institution && typeof npc.institution === 'object' ? npc.institution.key : npc?.institution) || '');
        const pub = /mint|treasur|exchequer|counting|tax|toll|customs|council|hall|seat/i.test(key) || /treasurer|steward|reeve of the town|mayor|chancellor/i.test(String(npc?.role || ''));
        ag = borrow; status = pub ? 'count' : 'apart'; who = `${name} (${npc?.role || '?'} · ${key || '?'})`;
      }
      if (!ag) return [];
      return claims.map((h) => ({ at: h, against: ag, status, rule: status === 'apart' ? '9b.purse-house' : '9b.purse',
        why: `the page prints "${ag.sentence}"${who ? ` — the treasury of ${who}` : ''}; this line says the town's purse has something over${status === 'apart' ? ' (a house\'s treasury, not the town\'s: apart)' : ''}` }));
    },
  },
  // WEAK, apart: the shadow economy's sentences against the share its heading prints (C89075 C83868 C216091 C216874)
  pair('9b.shadow', /\b(What passes for a shadow economy here has never grown into one|A little changes hands here quietly, between neighbours)\b/,
    (T) => { const x = find(T, /^Shadow Economy: (\d+)% of trade unrecorded/, ['Systems/Economics']); return x && Number(x.text.match(/(\d+)%/)[1]) >= 10 ? x : null; },
    (h, ag) => `the heading prints "${ag.text}"; this line says the off-book trade is next to nothing`, { status: 'apart' }),

  // 9c · FOOD -----------------------------------------------------------------------------------------------------------
  pair('9c.putby', /\bless is being put by against .+ than ought to be\b/,
    (T) => find(T, /\b(for more than a year at full rations|more than two years on half)\b/),
    (h, ag) => `the same panel prints "${ag.sentence}"; this line says less is put by than ought to be`),
  pair('9c.nothing-over', /\bleaves nothing over in an ordinary year\b/,
    (T) => find(T, /\bgrows (a little |much )?more than it eats\b/),
    (h, ag) => `the page prints "${ag.sentence}"; this line says nothing is left over`),
  pair('9c.reassure', /\b(a poor year in one does not empty the \w+'s tables|can take a bad season in one source without going hungry)\b/,
    (T, W) => (W.foodWord && !/^(Secure|Surplus|Abundant|Plentiful)$/.test(W.foodWord) ? W.food : find(T, /\b(Some households still go short|Portions have got smaller)\b/)),
    (h, ag) => `the page prints "${ag.sentence || ag.text}"; this line says a poor year does not leave the tables empty`),
  // (held by BAR5-FOOD (b)) the table's fish where the page marks the fishing stopped (C90582; bar read C17290)
  pair('9c.fish-stopped', /\b(food is fish from the local waters|is the day's catch|salted fish beside it)\b/,
    (T) => { const c = T.cards.find((c) => /fish/i.test(c.name) && c.marked); if (c) return { tab: 'Systems/Institutions', i: c.headIdx, text: c.head, sentence: c.head + ' (marked)' }; return find(T, /^Fish & Maritime Produce Stopped by the\b/, ['Systems/Economics']); },
    (h, ag) => `the page marks the fishing stopped ("${ag.sentence || ag.text}"); this food line puts the catch on the table unmarked`, { held: 'BAR5-FOOD' }),
  // carts bring in what the record (and the page) says comes by magic (C177322)
  pair('9c.carts', /\bcarts bring in\b/,
    (T) => { const ch = T.record?.economicViability?.metrics?.foodBalance?.importChannel; if (!ch || /airship/i.test(ch) || (/road|river|sea|caravan|trade/i.test(ch) && !/circle|magic|teleport|planar/i.test(ch))) return null; return find(T, /\b(by magic: no trade road reaches|comes in through the teleportation circle|arrives by magic)\b/) || { tab: 'record', i: -1, text: `foodBalance.importChannel: ${ch}`, sentence: `foodBalance.importChannel: ${ch}` }; },
    (h, ag) => `the import comes another way ("${ag.sentence || ag.text}"); this line says carts bring it`),
  // "No recorded imports" beside food the same tab says is brought in (C154358)
  pair('9c.no-imports', /^No recorded imports\.$/,
    (T) => find(T, /\b(\+ ?[1-9][\d,]* imported|carts bring in|is brought in by road)\b/, ['Systems/Economics']),
    (h, ag) => `the same tab prints "${ag.sentence}"; this line says nothing is imported`),

  // 9d · TRADE ACCESS -------------------------------------------------------------------------------------------------
  pair('9d.isolated', /(\bNo trade access: running on existing stockpiles only|run on stored [a-z ]+: no trade road reaches|operating on stockpiles only \(isolated trade\))/,
    (T) => { const ch = T.record?.economicViability?.metrics?.foodBalance?.importChannel || ''; const im = T.record?.economicState?.foodSecurity?.importCoverage || 0; if (/circle|magic|teleport|planar|airship/i.test(ch) || im <= 0) return null; return find(T, /\b(carts bring in|\+ ?[1-9][\d,]* imported|brought in by road)\b/, ['Systems/Economics']); },
    (h, ag) => `the page prints "${ag.sentence}" (food brought in by road); this line says no trade reaches the place`),
  pair('9d.no-exports', /^No significant exports\.$/,
    (T) => (T.crises.has('under_siege') || T.crises.has('siege') ? null : find(T, /\b(the raw material moves|is sold on raw|leaves as it comes out of the ground)\b/, ['Systems/Resources'])),
    (h, ag) => `the Resources tab prints "${ag.sentence}" (an export that moves); this line says there are none`),

  // 9e · MAGIC'S OWN ROWS ---------------------------------------------------------------------------------------------
  // the NAMED-dependent-chain pool (src/data/dossierStateProse/defense.generated.js, "magicDependency true, with a NAMED
  // dependent chain"): {good} is outputs[0] of the record's first chain with a magicNote
  // (defenseStateProse.js :: namedMagicChainGood). The line stands where the reliance row the page prints does not name
  // that chain (C14460 C128358 C158346). Under "Reliance on magic: None" it is LAW 1 · 1a's (9e.none), not counted here.
  {
    rule: '9e.leans', status: 'count',
    run(T, W) {
      if (!W.reliance || W.relianceWord === 'None') return [];
      return findAll(T, /\bno longer yields enough ([^,]+), and the trade that makes it now leans on help beyond ordinary work\b/, ['Systems/Magic']).flatMap((h) => {
        const v = chainOfGood(T, W, h.m[1]);
        if (v.named) return [];
        // PRECISION (720, seed 616): a food good under a row that names "food (arcane/druidic provision)" is backed by it
        if (FOOD_GOOD.test(v.good) && /\bfood \(/.test(W.relianceFor)) return [];
        const medicalAbsent = /medic|heal|treatment/.test(v.good) && W.roles.medical?.word === 'absent';
        return [{ at: h, against: medicalAbsent ? { ...W.roles.medical, sentence: `${W.reliance.text} / ${W.roles.medical.text}` } : W.reliance, why: `the reliance row names ${W.relianceFor || 'nothing'}${medicalAbsent ? ' and Medical role: absent' : ''}; this line says the trade making ${v.good} (${v.label || 'no chain found'}) leans on magic` }];
      });
    },
  },
  // WEAK, apart: the "unfolding" twin of the same pool, where the row omits the chain (C110376 C117636; EXPLAINED C78252)
  {
    rule: '9e.if-help', status: 'apart',
    run(T, W) {
      if (!W.reliance || W.relianceWord === 'None') return [];
      return findAll(T, /\bIf the help beyond ordinary work failed at .+?, the trade that makes its (.+?) would yield less\b/, ['Systems/Magic']).flatMap((h) => {
        const v = chainOfGood(T, W, h.m[1]);
        if (v.named) return [];
        return [{ at: h, against: W.reliance, why: `the reliance row names ${W.relianceFor || 'nothing'}; this line names the trade making ${v.good} (${v.label || 'no chain found'}; the record's chain note backs it: WEAK)` }];
      });
    },
  },
  pair('9e.military', /\b(The soldiers at .+ command its magic|Arcane work at .+ answers to its military)\b/,
    (T, W) => {
      if (W.roles.military?.word === 'absent') return W.roles.military;
      // every arcane house backs a power that is not a military one
      const arcane = T.cards.filter((c) => /arcane|magic/i.test(c.cat) || /wizard|mage|arcan|teleport|enchant|alchem|sorcer/i.test(c.name));
      const backs = arcane.map((c) => { const ls = T.tabs['Systems/Institutions'] || []; for (let i = c.headIdx + 1; i < ls.length && !(T.cards.some((d) => d.headIdx === i)); i++) { const m = ls[i].match(/^Backs · (.+)$/); if (m) return { tab: 'Systems/Institutions', i, text: ls[i], power: m[1] }; } return null; }).filter(Boolean);
      if (backs.length && backs.length === arcane.length && backs.every((b) => !/milit|guard|garrison|warlord|martial|army|soldier/i.test(b.power))) return { ...backs[0], sentence: `${backs.map((b) => b.text).join('; ')} (every arcane house)` };
      return null;
    },
    (h, ag) => `the page prints "${ag.sentence || ag.text}"; this line puts the town's magic under its soldiers`),
  pair('9e.quietly', /\bNobody in .+ sells enchanting by the hour, and what magic is done here is done quietly\b/,
    (T, W) => {
      const ch = T.chains.find((c) => /Spellcasting|Enchant/i.test(c.name) && /Operational|Running/.test(c.state) && /enchant/i.test(c.outputs || ''));
      if (ch) return { tab: 'Systems/Economics', i: ch.headIdx, text: ch.head, sentence: `${ch.head} / Outputs ${ch.outputs}` };
      return W.relianceWord === 'Integral' ? W.reliance : null;
    },
    (h, ag) => `the page prints "${ag.sentence || ag.text}"; this line says nobody sells enchanting and magic is done quietly`),
  pair('9e.heresy', /\b(treat magic as heresy and hunt it as such|preaches that magic is heresy)\b/,
    (T) => find(T, /^Religious acceptance · (indifferent|tolerant|accepting|accepted|embraced|welcoming|sanctioned|integrated)\b/, ['Systems/Magic']),
    (h, ag) => `the Magic tab prints "${ag.text}"; this Faith line says the faithful hunt magic as heresy`),

  // 9f · LEGITIMACY ---------------------------------------------------------------------------------------------------
  pair('9f.loyal', /\bThe settlement is loyal\b/,
    (T, W) => (W.legit && /crisis/i.test(W.legit.word) ? W.legit : null),
    (h, ag) => `the page prints "${ag.text}"; this line says the settlement is loyal`),
  // apart: the same line under a legitimacy the page prints Contested (no control of the checkers)
  pair('9f.loyal-contested', /\bThe settlement is loyal\b/,
    (T, W) => (W.legit && /^Contested$/i.test(W.legit.word) ? W.legit : null),
    (h, ag) => `the page prints "${ag.text}"; this line says the settlement is loyal (Contested, not a crisis: apart)`, { status: 'apart' }),
];

/** LAW 9 over one town read by pageB.readTown. */
export function law9(T, town) {
  const W = stateWords(T);
  const out = [];
  const seen = new Set();
  for (const r of RULES) {
    for (const x of r.run(T, W)) {
      const k = `${x.rule || r.rule}#${x.at.tab}#${x.at.i}#${x.at.sentence}`;
      if (seen.has(k)) continue; seen.add(k);
      out.push({ law: LAW, rule: x.rule || r.rule, town, tab: x.at.tab, line: x.at.text, sentence: x.at.sentence || x.at.text,
        against: { tab: x.against.tab, line: x.against.sentence || x.against.text }, why: x.why, held: r.held || null, status: x.status || r.status || 'count' });
    }
  }
  return out;
}
