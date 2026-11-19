// BAR7-AUDIT-H · LAW 8 WIDENED · THE PAGE'S MARK ON EVERY SURFACE (BRIEF-BAR7-AUDIT, seat H; rules 8f to 8k).
// LAW 8 (auditor D, `law8.mjs`) says a thing has one state on every surface. The round BAR6 made the page mark a house with
// nothing to work ("Short of wool.", "(short)") and a house the crisis stops or curtails ("Stopped by the siege.",
// "(stopped)"): ONE LEAF, `src/domain/display/crisisStoppedRow.js :: rowMarkText` over `src/domain/facts/houseInputAtHand.js
// :: housesShortOf`. These rules are the SURFACES THAT MARK DOES NOT REACH, each read off the page as printed:
//   8f.short   an income row of a house's trade, bare, whose every house of that trade on the page carries a mark
//   8f.chain   an income row, bare, claiming steady work, fed ("Contributes to <row>") by a chain the page prints Impaired
//              or Stopped, under a crisis
//   8g.export  a service-economy row printed Operational whose every "Via" house carries a mark (8g.service: not exportable)
//   8h.deal / 8h.secret / 8h.wants / 8h.hook   a person's own line, bare, showing the trade of a house that carries a mark
//              (a line of the person's TITLE pool, `src/data/people/titleSecretsPresentations.js`, or a Wants line of
//              the house family, `src/data/people/goalFamilies.js`); a line that opens with the mark is clear
//   8i.chainStopped  a bare house's chip (and its Services row) naming what a chain the page prints Stopped would yield
//   8i.surplus       a bare house whose own card says it needs a grain surplus, in a town whose food line is short
//   8i.resource      "✓ Fully exploited · X" under a crisis, X's every house crisis-marked and a chain on X Impaired
//   8j.outputs / 8j.exports / 8j.local   a good on a running chain's Outputs, the Exports list or Produced locally,
//              whose every maker on the page is marked short (8j.outputs is the seam's ECON item 8: counted to say so)
//   8k.market  an Overview or Daily Life line of a busy market where every market house carries a crisis mark
//   8k.trade   a scene that shows a trade at work (looms, forges, kilns, saws, tanning pits, presses) whose every house
//              carries a mark
// CONSERVATIVE FIRST: each instance names the page line it fires on and the page line of the mark it disagrees with
// (`against`); a line hedged on its own input, or carrying its own mark, is clear. `cause` splits every instance: `short`
// (every mark it reads is the short mark: a house BORN short, the born-short audit's root), `crisis` (a crisis mark),
// `mixed`. Pure: reads seat B's `readTown` (pageB.mjs) and auditor D's readers (law8.mjs), unchanged.
import { MARK_LEAD, CHIP_MARK, economicsSections, sentences } from './pageB.mjs';
import { GOODS, readIncome, readServiceEconomy } from './law8.mjs';
import { TITLE_PRESENTATIONS, TITLE_SECRETS } from '../../../src/data/people/titleSecretsPresentations.js';
import { GOAL_FAMILY_LINES } from '../../../src/data/people/goalFamilies.js';

export const LAW = 'L8H';
const lc = (s) => String(s || '').toLowerCase();
const norm = (s) => lc(s).replace(/[’']/g, "'").replace(/[^a-z0-9' ]/g, ' ').replace(/\s+/g, ' ').trim();
const CRISIS_LEAD = /^(Stopped by the [a-z ]+\.|Curtailed by the [a-z ]+\.|Scarce in the [a-z ]+\.)/;
const SHORT_IN = /(?:^|\. )Short of ([a-z ]+?)\./;
const STOPPING = new Set(['under_siege', 'famine', 'plague_onset', 'wartime']);

// ---------------------------------------------------------------- a house's mark, as the page prints it
/** { short: input|null, crisis: lead|null, chipsShort, chipsCrisis, impaired, any, line } for a card. */
export function cardMark(c) {
  const first = c.lines.find((l) => MARK_LEAD.test(l.text) || CRISIS_LEAD.test(l.text));
  const lead = first?.text || '';
  const short = (lead.match(SHORT_IN) || [])[1] || null;
  const crisis = (lead.match(CRISIS_LEAD) || [])[1] || null;
  const chipsShort = c.chips.filter((x) => /\(short\b/.test(x.raw)).length;
  const chipsCrisis = c.chips.filter((x) => /\((stopped|curtailed|scarce)\b/.test(x.raw)).length;
  const impaired = /· (Impaired|Stopped)\b/.test(c.head);
  const allChips = c.chips.length > 0 && c.chips.every((x) => x.marked);
  return { short, crisis, chipsShort, chipsCrisis, impaired, lead: !!(short || crisis), any: !!(short || crisis || allChips), line: first ? `${c.head} / ${first.text}` : c.head, idx: first ? first.i : c.headIdx };
}
const causeOf = (marks) => (marks.every((m) => m.short && !m.crisis) ? 'short' : marks.every((m) => m.crisis) ? 'crisis' : 'mixed');

// ---------------------------------------------------------------- the trades: an income row's or a scene's houses
const H = (re) => new RegExp(`\\b(${re})\\b`, 'i');
export const TRADES = {
  iron: GOODS.iron.houses,
  cloth: H("weavers?|weaving|textile(?: workers)?|fullers?|fulling mill|spinners?|cloth ?workers?|clothiers?|dyers?|dye ?works|drapers?"),
  // a line that shows cloth MADE (the loom, the fulling stocks) answers to a house that makes it; a dyer answers only dyeing
  // (the seam's SCENES item 9, its rule)
  clothMade: H("weavers?|weaving|textile(?: workers)?|fullers?|fulling mill|spinners?|cloth ?workers?"),
  remedy: H("alchemists?|alchemist shop|apothecar(?:y|ies)|herbalists?"),
  timber: H("sawmills?|woodcutters?|woodcutter's camp|lumber ?(?:yard|camp)s?|logging|foresters?"),
  stone: H("(?:stone )?quarr(?:y|ies)|stonecutters?"),
  clay: H("clay ?pits?|potters?|pottery|brick ?makers?|brickworks|kilns?|tile ?makers?"),
  coal: H("coal|colliers?|collier(?:y|ies)|charcoal burners?|peat"),
  grapes: GOODS.grapes.houses,
  hides: GOODS.hides.houses,
  salt: H("salt ?works|salt ?pans?|salterns?"),
};
// an income row's title -> its trade
export const INCOME_TRADE = [
  [/^Iron & Metalwork$/, 'iron'], [/^Wool & Textile Trade$/, 'cloth'], [/^(Apothecary & Alchemy|Herbalist & Apothecary)$/, 'remedy'],
  [/^Timber Trade$/, 'timber'], [/^(Stone Quarrying|Building Stone Sales)$/, 'stone'], [/^(Clay Sales|Pottery.*)$/, 'clay'],
  [/^Coal Sales$/, 'coal'], [/^(Wine.*|Viticulture.*)$/, 'grapes'], [/^(Leather.*|Tanning.*)$/, 'hides'], [/^Salt.*$/, 'salt'],
];
// a row whose words admit the lack, or say the good is brought in, claims no work of the house
const ROW_ADMITS = /\b(little|few|short|bought in|imported|brought in|purchased|from outside|none|not much)\b/i;
const ROW_CLAIMS = /\b(consistent|reliable|steady|dependable|sustainable|draws customers|thriv\w*|made here|made and sold|worked here|woven|smelted|finished here|sold here|landed here|is sold|production|provides)\b/i;

const tradeHouses = (T, key) => T.cards.filter((c) => TRADES[key].test(c.name) && !/\b(market|guild|merchant|exchange|warehouse)\b/i.test(c.name));

// ---------------------------------------------------------------- the people
/** Each person: { name, house, title, lines:[{ kind, i, text, body }] } read off the NPC tab. */
export function readPersons(T) {
  const L = T.tabs['World/NPCs'] || [];
  const tops = []; L.forEach((l, i) => { if (l === '▲' && i > 0) tops.push(i); });
  return tops.map((k, n) => {
    const end = n + 1 < tops.length ? tops[n + 1] - 1 : L.length;
    const role = L[k + 1] || '';
    const lines = [];
    // THE FORM PROPOSED (the chair's leaning): the house's mark as a line of its own on the card, said once; a card that
    // carries it covers every line of the person (the second check's rule 1: a card's mark covers what its rows say)
    let cardMark = null;
    for (let i = k + 2; i < end; i++) {
      const l = L[i];
      let m;
      if ((m = l.match(/^How they deal\s*(.*)$/))) lines.push({ kind: 'deal', i, text: l, body: m[1] || L[i + 1] || '' });
      else if ((m = l.match(/^Wants\s+(.*)$/))) lines.push({ kind: 'wants', i, text: l, body: m[1] });
      else if ((m = l.match(/^Secret:\s*(.*)$/))) lines.push({ kind: 'secret', i, text: l, body: m[1] });
      else if (MARK_LEAD.test(l) || CRISIS_LEAD.test(l)) cardMark = { i, text: l };
    }
    // LEFT-MARKS item 2 (2026-11-17): the card's title is the line after the house line AND after the house's mark line
    // when the card prints one (before, a marked card's `title` read its mark line)
    const titleAt = cardMark && cardMark.i === k + 2 ? k + 3 : k + 2;
    return { name: (L[k - 1] || '').replace(/●+$/, '').trim(), house: role.split(' · ')[0].trim(), title: (L[titleAt] || '').trim(), lines, k, cardMark };
  });
}
const POOL = (() => {
  const deal = new Set(), secret = new Set();
  for (const ps of Object.values(TITLE_PRESENTATIONS)) for (const p of ps) if (p?.behaviour) deal.add(norm(p.behaviour));
  for (const ss of Object.values(TITLE_SECRETS)) for (const s of ss) if (s?.secret) secret.add(norm(s.secret));
  // Wants lines that name the card's house: every template of the goal families with "{house}"
  const wants = [];
  const walk = (v) => { if (typeof v === 'string') { if (v.includes('{house}')) wants.push(v); } else if (v && typeof v === 'object') { if (typeof v.line === 'string') walk(v.line); else for (const x of Object.values(v)) walk(x); } };
  // the family written for a house at work: "the card's house processes a running or operational chain" (goalFamilies.js,
  // SUPPLY.expansion); the other "{house}" lines (its rights, its taxes, its debts) show no work (precision draw)
  walk(GOAL_FAMILY_LINES.SUPPLY.expansion);
  const wantRes = wants.map((t) => ({ t, re: new RegExp(`^${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\{house\\\}/g, '(.+?)').replace(/\\\{[a-z_]+\\\}/g, '.+?')}$`) }));
  return { deal, secret, wantRes };
})();
// a line hedged on its own input, or about stock already made, or about the crisis itself
const HEDGED = /\b(when there is|when .{1,30} to be had|what is left|what little|while it lasts|while stocks last|before the (?:siege|war|famine)|since the (?:siege|war|famine)|used to|no longer|nothing to|for want of|until the|whatever is left|on the shelves|in store)\b/i;
// a deal line about the person's manner or about others' work shows no work of the house (precision draw of the thirty)
const MANNER_ONLY = /^(Polite\b|Says nothing about\b|Tells you to see\b|Talks about who is (?:building|weaving)\b)/;
const OWN_MARK = /^(How they deal\s+)?(Stopped by|Curtailed by|Scarce in|Short of)\b/;

/**
 * LEFT-KEYS K6 (c), 2026-11-18 · RULING BR18 (the sixth chair, 19:10 UTC 2026-11-17; L6): a chain card printed "Impaired" on a
 * SPENT ground beside a trade AT WORK ON BOUGHT MATERIAL is the supply rule's second story told twice (the town's own chain is
 * impaired, its ground spent; the trade goes on with the material bought in), not a fault. Read off the page and the record:
 * the card Impaired (not Stopped), every ground its "From" names printed depleted or exhausted, the trade's material on the
 * record's import list, and a house of the trade on the page unmarked (at work).
 */
const TRADE_BOUGHT = { iron: /\b(?:iron|ore|metals?)\b/i, timber: /\btimber\b/i, stone: /\bstone\b/i, clay: /\bclay\b/i, cloth: /\b(?:wool|cloth)\b/i, hides: /\bhides?\b/i, grapes: /\b(?:grapes|must)\b/i, salt: /\bsalt\b/i, coal: /\bcoal\b/i, remedy: /\bherbs?\b/i };
function spentChainBoughtTrade(T, ch, trade) {
  if (!trade || !/^Impaired$/i.test(String(ch.state || '').trim())) return false;
  if (!ch.from.length || !ch.from.every((f) => /\((?:depleted|exhausted)\)/.test(f))) return false;
  const re = TRADE_BOUGHT[trade];
  if (!re || !(T.record?.economicState?.primaryImports || []).some((x) => re.test(String(x)))) return false;
  return tradeHouses(T, trade).some((c) => !cardMark(c).lead);
}

// ---------------------------------------------------------------- the rules
export function law8H(T, town) {
  const out = [];
  const seen = new Set();
  const push = (rule, at, against, why, extra = {}) => {
    const key = `${rule}|${at.tab}|${at.i}`; if (seen.has(key)) return; seen.add(key);
    out.push({ law: LAW, rule, town, tab: at.tab, i: at.i, line: at.line, rowLines: at.rowLines || [at.line], against, why, ...extra });
  };
  const crises = [...T.crises].filter((c) => STOPPING.has(c) || c === 'occupied' || c === 'occupation');
  const inCrisis = [...T.crises].some((c) => STOPPING.has(c));
  const ECO = 'Systems/Economics';
  const marked = new Map(T.cards.map((c) => [c.name, cardMark(c)]));
  const cardOf = (name) => T.cards.find((c) => lc(c.name) === lc(name));

  // ---- 8f · THE INCOME ROW
  const income = readIncome(T);
  const eco = T.tabs[ECO] || [];
  for (const r of income) {
    if (r.marked || MARK_LEAD.test(r.line.slice(r.name.length).trim())) continue;
    const desc = r.line.slice(r.name.length).trim();
    const trade = (INCOME_TRADE.find(([re]) => re.test(r.name)) || [])[1];
    if (trade && desc && !ROW_ADMITS.test(desc)) {
      const hs = tradeHouses(T, trade);
      const ms = hs.map((c) => marked.get(c.name));
      if (hs.length && ms.every((m) => m.lead)) {
        const share = eco[r.i - 1] && /^\d+%$/.test(eco[r.i - 1]) ? eco[r.i - 1] : null;
        push('8f.short', { tab: ECO, i: r.i, line: r.line, rowLines: [r.line, share].filter(Boolean) }, { tab: 'Systems/Institutions', i: ms[0].idx, line: ms.map((m) => m.line).join(' | ') },
          `the income row of the ${trade} trade prints bare; every house of that trade on the page (${hs.map((c) => c.name).join(', ')}) carries a mark`, { thing: r.name, cause: causeOf(ms), houses: hs.map((c) => c.name) });
      }
    }
    if (inCrisis && desc && ROW_CLAIMS.test(desc) && !ROW_ADMITS.test(desc)) {
      const ch = T.chains.find((c) => c.marked && c.lines.some((l) => l.text.startsWith(`Contributes to ${r.name} - `)));
      if (ch && !spentChainBoughtTrade(T, ch, trade)) push('8f.chain', { tab: ECO, i: r.i, line: r.line }, { tab: ECO, i: ch.headIdx, line: `${ch.head} / ${ch.lines.find((l) => l.text.startsWith('Contributes to')).text}` },
        `the income row claims its trade at work, bare, under the crisis; the chain that feeds it is printed ${ch.state || 'marked'}`, { thing: r.name, cause: 'crisis' });
    }
  }

  // ---- 8g · THE SERVICE ECONOMY'S ROW THROUGH A MARKED HOUSE
  for (const r of readServiceEconomy(T)) {
    if (!/Operational|Running/.test(r.status) || !r.via.length) continue;
    const hs = r.via.map(cardOf);
    if (hs.some((c) => !c)) continue;
    const ms = hs.map((c) => marked.get(c.name));
    if (!ms.every((m) => m.lead)) continue;
    push(r.exportable ? '8g.export' : '8g.service', { tab: ECO, i: r.i, line: r.line, rowLines: r.rowLines }, { tab: 'Systems/Institutions', i: ms[0].idx, line: ms.map((m) => m.line).join(' | ') },
      `the service economy prints ${r.name} ${r.status} through ${hs.map((c) => c.name).join(', ')}, which the page marks`, { thing: r.name, cause: causeOf(ms) });
  }

  // ---- 8h · A PERSON'S OWN LINES
  const persons = readPersons(T);
  const census = [];
  const hooks = T.tabs['Summary/Plot Hooks'] || [];
  for (const p of persons) {
    const c = cardOf(p.house); const m = c && marked.get(c.name);
    if (!m || !m.lead) continue;
    // the mark's kind: short (nothing to work) and stopped are the rule; curtailed and scarce (the trade goes on, thinly) are
    // counted apart as `.mild` (the second check's rule 1: a thin trade is not denied by an ordinary line)
    const mk = m.short ? 'short' : /^Stopped/.test(m.crisis) ? 'stopped' : /^Curtailed/.test(m.crisis) ? 'curtailed' : 'scarce';
    // the second check's rule 3: another house of the same trade that is NOT marked answers the line
    // a weaver's or a fuller's line is answered by a house that MAKES cloth, not by a dyer (the seam's SCENES item 9, its rule)
    const re = [TRADES.clothMade, ...Object.values(TRADES)].find((r) => r.test(c.name)) || Object.values(GOODS).map((g) => g.houses).find((r) => r.test(c.name));
    const peer = re ? T.cards.find((x) => x !== c && re.test(x.name) && !marked.get(x.name).lead) : null;
    for (const l of p.lines) {
      const front = OWN_MARK.test(l.text);
      const b = norm(l.body.replace(/^(Stopped by the [a-z ]+\.|Curtailed by the [a-z ]+\.|Scarce in the [a-z ]+\.|Short of [a-z ]+\.)\s*/g, '').replace(/^(Stopped by the [a-z ]+\.|Curtailed by the [a-z ]+\.|Scarce in the [a-z ]+\.|Short of [a-z ]+\.)\s*/g, ''));
      const trade = l.kind === 'deal' ? POOL.deal.has(b) : l.kind === 'secret' ? POOL.secret.has(b) : POOL.wantRes.some((w) => w.re.test(l.body.trim()));
      census.push({ kind: l.kind, front, cardMarked: !!p.cardMark, trade, cause: m.short && !m.crisis ? 'short' : 'crisis', mk, peer: !!peer, house: c.name });
      if (front || p.cardMark || !trade || HEDGED.test(l.body) || peer || (l.kind === 'deal' && MANNER_ONLY.test(l.body))) continue;
      const mild = mk === 'curtailed' || mk === 'scarce';
      push(`8h.${l.kind}${mild ? '.mild' : ''}`, { tab: 'World/NPCs', i: l.i, line: l.text }, { tab: 'Systems/Institutions', i: m.idx, line: m.line },
        `${p.name} keeps ${c.name}, which the page marks (${mk}); this ${l.kind} line of the person's own trade shows it at work with no mark`, { thing: `${p.name}|${c.name}`, cause: m.short && !m.crisis ? 'short' : 'crisis', mk, person: p.name, house: c.name });
    }
    if (p.name.split(' ').length >= 2) hooks.forEach((h, i) => {
      if (peer || !h.includes(p.name) || MARK_LEAD.test(h) || HEDGED.test(h)) return;
      // precision draw of the thirty: 0 of 7 hooks that name a marked house's keeper show it at work (each speaks of the
      // crisis itself, "The crisis turns on the fish market, run by …"): hooks are counted in the census, not as instances
      if (!new RegExp(`\\b${c.name.split(/[\s/]/)[0].replace(/[^A-Za-z]/g, '')}`, 'i').test(h) && !TRADES_ANY(h, c.name)) return;
census.push({ kind: 'hook', front: false, trade: true, cause: m.short && !m.crisis ? 'short' : 'crisis', mk, peer: false, house: c.name, line: h });
    });
  }

  // ---- 8i · A HOUSE'S ROWS AND CHIPS THE LEAF DOES NOT KNOW
  const INST = 'Systems/Institutions', SVC = 'Systems/Services';
  for (const ch of T.chains) {
    const stopLine = ch.lines.find((l) => /^Stopped by the /.test(l.text));
    if (!stopLine && !/^Stopped$/.test(ch.state)) continue;
    const outs = (ch.outputs || '').split(' · ').map(norm).filter(Boolean);
    for (const v of ch.via) {
      const c = cardOf(v); if (!c) continue;
      const m = marked.get(c.name); if (m.any || m.impaired) continue;
      const hit = c.chips.filter((x) => !x.marked && outs.includes(norm(x.name)));
      if (!hit.length) continue;
      const against = { tab: ECO, i: ch.headIdx, line: `${ch.head} / Normally yields ${ch.outputs} / ${(stopLine || {}).text || ch.state}` };
      push('8i.chainStopped', { tab: INST, i: c.chipIdx, line: c.chipLine, rowLines: [c.head, ...c.lines.map((l) => l.text), c.chipLine] }, against, `the chain ${ch.name} is printed stopped and would yield ${hit.map((x) => x.name).join(', ')}; the house ${c.name} offers it bare`, { thing: c.name, cause: 'crisis' });
      for (const e of T.services) if (e.house === c.name && !e.marked && hit.some((x) => norm(x.name) === norm(e.title))) push('8i.chainStopped', { tab: SVC, i: e.titleIdx, line: e.title, rowLines: [e.titleRaw, e.desc, e.house] }, against, `the Services row ${e.title} of ${c.name} prints bare; the chain ${ch.name} that yields it is printed stopped`, { thing: c.name, cause: 'crisis' });
    }
  }
  const foodSec = economicsSections(eco)['Food Security'] || [];
  const foodShort = foodSec.find((x) => /· Short: [\d,]+ lbs\/day/.test(x.text));
  if (foodShort) for (const c of T.cards) {
    const l = c.lines.find((x) => /\b(requires (?:a )?grain surplus|only (?:runs|works) when (?:there is )?(?:a )?grain (?:is )?in surplus|on a grain surplus)\b/i.test(x.text));
    if (!l) continue; const m = marked.get(c.name); if (m.any || m.impaired) continue;
    push('8i.surplus', { tab: INST, i: l.i, line: `${c.head} / ${l.text}`, rowLines: [c.head, ...c.lines.map((x) => x.text), c.chipLine].filter(Boolean) }, { tab: ECO, i: foodShort.i, line: foodShort.text },
      `${c.name}'s own card needs a grain surplus; the page's food line is short, and the house prints bare`, { thing: c.name, cause: inCrisis ? 'crisis' : 'calm' });
  }
  if (inCrisis) {
    const res = T.tabs['Systems/Resources'] || [];
    res.forEach((l, i) => {
      const mm = l.match(/^✓ Fully exploited · (.+?) · /); if (!mm) return;
      const word = norm(mm[1]).replace(/s$/, '');
      const chs = T.chains.filter((ch) => ch.from.some((f) => norm(f).includes(word)) || norm(ch.name).includes(word));
      const marks = chs.filter((ch) => /Impaired|Stopped|Failed/.test(ch.state));
      if (!marks.length) return;
      const hs = [...new Set(chs.flatMap((ch) => ch.via))].map(cardOf).filter(Boolean);
      if (!hs.length || !hs.every((c) => marked.get(c.name).crisis)) return;
      push('8i.resource', { tab: 'Systems/Resources', i, line: l }, { tab: ECO, i: marks[0].headIdx, line: `${marks[0].head} | ${hs.map((c) => marked.get(c.name).line).join(' | ')}` },
        `the ground ${mm[1]} prints "Fully exploited" bare; every house that works it carries the crisis's mark and a chain on it is ${marks[0].state}`, { thing: mm[1], cause: 'crisis' });
    });
  }

  // ---- 8j · A GOOD WHOSE EVERY MAKER IS MARKED SHORT
  const toks = (s) => norm(s).split(' ').map((w) => w.replace(/(ing|ed|s)$/, '')).filter((w) => w.length > 2 && !/^(and|the|for|of)$/.test(w)).sort().join(' ');
  const makersOf = (good) => {
    const g = toks(good); if (!g) return [];
    const hs = new Map();
    for (const c of T.cards) for (const x of c.chips) if (toks(x.name) === g) hs.set(c.name, { c, chip: x });
    for (const e of T.services) if (toks(e.title) === g && !hs.has(e.house)) { const c = cardOf(e.house); if (c) hs.set(c.name, { c, chip: c.chips.find((x) => toks(x.name) === g) || null }); }
    return [...hs.values()];
  };
  const shortMaker = ({ c, chip }) => { const m = marked.get(c.name); return !!(m.short || (chip && /\(short\b/.test(chip.raw))); };
  const pills = [];
  for (const ch of T.chains) if (ch.outputs && !ch.yieldsNormally && /Running|Operational/.test(ch.state)) pills.push({ rule: '8j.outputs', i: ch.outIdx, line: ch.outputs, head: ch.head });
  for (const head of ['Exports', 'Produced locally']) { const k = eco.indexOf(head); if (k >= 0 && eco[k + 1]) pills.push({ rule: head === 'Exports' ? '8j.exports' : '8j.local', i: k + 1, line: eco[k + 1], head }); }
  for (const p of pills) for (const good of p.line.split(' · ').map((s) => s.trim()).filter(Boolean)) {
    if (CHIP_MARK.test(good) || /\(.*\)/.test(good) && /short|stopped|scarce/.test(good)) continue;
    const ms = makersOf(good.replace(/\s*\(.*?\)\s*/g, ' '));
    if (!ms.length || !ms.every(shortMaker)) continue;
    push(p.rule, { tab: ECO, i: p.i, line: p.line, rowLines: [p.head, p.line] }, { tab: INST, i: ms[0].c.headIdx, line: ms.map(({ c }) => marked.get(c.name).line).join(' | ') },
      `${p.head} lists ${good}; every house that makes it (${ms.map(({ c }) => c.name).join(', ')}) is marked short`, { thing: good, cause: 'short' });
  }

  // ---- 8k · A SCENE OR AN OVERVIEW LINE OVER A MARKED TRADE OR A FAILED MARKET
  const SCENE_TABS = ['Summary/Overview', 'World/Daily Life'];
  const markets = T.cards.filter((c) => /\b(market|fair|bazaar|shambles)\b/i.test(c.name) && !/black market/i.test(c.name));
  const SCENE = [
    ['clothMade', /\b(looms?|weaving|shuttles?|tenters?|fulling stocks|bolts of (?:new )?cloth)\b/i],
    ['iron', /\b(forges?|anvils?|smithy|bellows|hammering of)\b/i],
    ['clay', /\b(kilns?|potter's wheel|wheel-thrown)\b/i],
    // not "saw" alone: the verb (precision draw of the 150, "… saw … men carrying crates")
    ['timber', /\b(sawpits?|sawdust|sawn timber|sawmill|the saws? (?:whine|scream|rasp|bite)s?)\b/i],
    ['hides', /\b(tanning pits?|tanneries|tannery|tan ?pits?|tanning)\b/i],
    ['grapes', /\b(wine ?press(?:es)?|grape harvest|vintage|treading)\b/i],
  ];
  // a scene of stock (bales stacked, "none of it is going anywhere") shows no work (precision draw of the 150)
  const QUIET = /\b(quiet|idle|silent|cold|still|for want of|nothing to|no longer|little|few|brought in|from elsewhere|used to|once|stopped|short|stacked|stock|bales)\b/i;
  for (const tab of SCENE_TABS) (T.tabs[tab] || []).forEach((para, i) => sentences(para).forEach((l) => {
    if (MARK_LEAD.test(l)) return;
    if (markets.length && markets.every((c) => marked.get(c.name).crisis) && /\b(busy|bustl\w*|crowd\w*|fills|throng\w*|lively|teem\w*|packed)\b[^.]*\bmarket|\bmarket\b[^.]*\b(busy|bustl\w*|crowd\w*|fills|throng\w*|lively|teem\w*|packed)\b/i.test(l))
      push('8k.market', { tab, i, line: l, rowLines: [l, para] }, { tab: INST, i: markets[0].headIdx, line: markets.map((c) => marked.get(c.name).line).join(' | ') }, `a busy market, bare; every market house on the page carries the crisis's mark`, { thing: 'market', cause: 'crisis' });
    if (QUIET.test(l)) return;
    for (const [key, re] of SCENE) {
      if (!re.test(l)) continue;
      const hs = tradeHouses(T, key);
      if (!hs.length) continue;
      const ms = hs.map((c) => marked.get(c.name));
      if (!ms.every((m) => m.lead)) continue;
      // a house of the trade that goes on, thinly (curtailed or scarce, not short): the scene is counted apart
      const mild = ms.some((m) => !m.short && /^(Curtailed|Scarce)/.test(m.crisis));
      push(`8k.trade${mild ? '.mild' : ''}`, { tab, i, line: l, rowLines: [l, para] }, { tab: INST, i: ms[0].idx, line: ms.map((m) => m.line).join(' | ') }, `a scene shows the ${key} trade at work; every house of it on the page carries a mark`, { thing: key, cause: causeOf(ms) });
    }
  }));
  out.census = census;
  return out;
}
// a hook that names the house's trade word (the house's own name words)
function TRADES_ANY(h, house) { return norm(house).split(' ').some((w) => w.length > 4 && norm(h).includes(w.replace(/s$/, ''))); }
