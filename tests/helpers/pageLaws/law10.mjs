/**
 * pageLaws/law10.mjs — LAW 10 · STORY LINES DRAWN TOGETHER (BAR6-AUDIT, seat F; mechanism M3, kinds K6 and K8).
 * A hook, a tie, a secret, a temperament, a power's card and a history line are drawn apart and contradict.
 * Eight pair rules over one town `{ record, tabs, town }` (`tabs`: the DOSSIER tabs, tests/helpers/pageLaws/page.mjs).
 * Most pairs are read on the STORED RECORD (the two sides are record fields); the instance is then placed on the
 * printed line that carries the false side (`tab`, `line`), or on `tab: null` (record only) where nothing prints it.
 * A pair that exists only on the page (a print-time line) is read on the page.
 *
 *   10a  "answers to" one's own seat: a head (rank 1) whose hidden allegiance is the power he heads.
 *   10b  a gendered pronoun in a hook / tie / secret bound to a role the roster holds only in the other sex.
 *   10c  a title printed for a person that the roster gives ANOTHER person of the town (pin M-1b).
 *   10d  a tie that asks for a seat already held; a tie of treasury debt against the page's own purse.
 *   10e  a temperament against its own secret; a secret of drawn pay against its house card's "nobody is paid";
 *        a "well paid" claim against a line that the pay is cut.
 *   10f  a power's card against the government's kind, the town's tier, another power's weight; a house that backs
 *        both its ruler and the ruler's rival in a high quarrel.
 *   10g  one event told twice with two lengths on one tab; a legacy of rebuilding after an event that built nothing.
 *   10h  a slash roster label ("Military/Guard") used as a name beside a verb or a possessive.
 * Instances `{ law: 'L10', rule, town, tab, line, against: { tab?, line?, record? }, why }`. Pure; no I/O.
 */
import { fold } from './page.mjs';
import { PROSE_FORMS } from '../../../src/data/people/powerSentenceName.js';

const inst = (rule, town, tab, line, against, why) => ({ law: 'L10', rule, town, tab, line, against, why });
const linesOf = (tabs) => Object.entries(tabs || {}).flatMap(([tab, ls]) => ls.map((line, i) => ({ tab, i, line })));
const lc = (s) => String(s ?? '').toLowerCase();
const factionsOf = (r) => r?.powerStructure?.factions || [];
const npcsOf = (r) => r?.npcs || [];
const governingOf = (r) => factionsOf(r).find((f) => f.isGoverning) || factionsOf(r).find((f) => f.faction === r?.powerStructure?.governingName) || null;

/** Every printed line holding `text` (folded); the first eighty characters suffice for a long record string. */
function printedAt(tabs, text, { tabRe = null, max = 50 } = {}) {
  const want = fold(text).replace(/[.]+$/, '').slice(0, 90);
  if (!want) return [];
  const out = [];
  for (const x of linesOf(tabs)) {
    if (tabRe && !tabRe.test(x.tab)) continue;
    if (fold(x.line).includes(want)) { out.push(x); if (out.length >= max) break; }
  }
  return out;
}
/** Place a record-side instance on each printed line of its text, or once on the record. */
function placed(rule, town, tabs, text, against, why, opts) {
  const at = printedAt(tabs, text, opts);
  if (!at.length) return [inst(rule, town, null, String(text), against, why + ' (record only: not printed on a dossier tab)')];
  return at.map((x) => inst(rule, town, x.tab, x.line, against, why));
}

/* ───────────────────────── 10a · "answers to" one's own seat ───────────────────────── */
/** C179090, C179117, C179288. A head whose allegiance names the power he heads: every line that prints it. */
export function law10a({ record, tabs, town }) {
  const out = [];
  for (const n of npcsOf(record)) {
    const a = n?.allegiance; if (!a?.power) continue;
    const head = (n.memberships || []).find((m) => m.power === a.power && m.rank === 1);
    if (!head) continue;
    const P = a.power; const against = { record: `npcs[${n.id}].memberships: ${P} rank 1 (head) · allegiance.power ${P}` };
    const why = `${n.name} heads ${P} and is printed as answering to ${P}, his or her own seat`;
    let any = false;
    for (const x of linesOf(tabs)) {
      const L = x.line;
      const own = (L.includes(`Head · ${n.name}`) && L.includes(`answers to ${P}`))
        || new RegExp(`The head of ${esc(P)} answers to ${esc(P)}\\b`).test(L);
      if (own) { out.push(inst('10a', town, x.tab, L, against, why)); any = true; }
    }
    // the person's own card: the allegiance line under the card that opens with the person's name
    for (const [tab, ls] of Object.entries(tabs || {})) {
      if (!/NPCs$/.test(tab)) continue;
      let inCard = false;
      for (const L of ls) {
        if (/●*$/.test(L) && L.replace(/●+$/, '') === n.name) { inCard = true; continue; }
        if (inCard && /●+$/.test(L) && L.replace(/●+$/, '') !== n.name) inCard = false;
        if (inCard && /^Hidden allegiance answers to /.test(L) && L.includes(`answers to ${P}`)) { out.push(inst('10a', town, tab, L, against, why + ' (on the person\'s own card)')); any = true; }
      }
    }
    if (!any) out.push(inst('10a', town, null, `${n.name} · allegiance ${P} · via ${a.handler || '-'}`, against, why + ' (record only)'));
  }
  return out;
}
const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** A person's own card on the NPCs tab: from the line "<name>●…" to the next card or group heading. */
export function cardOf(tabs, name) {
  const out = [];
  for (const [tab, ls] of Object.entries(tabs || {})) {
    if (!/NPCs$/.test(tab)) continue;
    for (let i = 0; i < ls.length; i++) {
      if (ls[i].replace(/●+$/, '') !== name || !/●$/.test(ls[i])) continue;
      for (let j = i + 1; j < ls.length && !/●$/.test(ls[j]) && !/\(\d+\)▲$/.test(ls[j]); j++) out.push({ tab, i: j, line: ls[j] });
    }
  }
  return out;
}

/* ───────────────────────── 10b · a pronoun against the roster's sex ───────────────────────── */
const MALE = /\b(he|him|his|himself|the same man)\b/i;
const FEMALE = /\b(she|her|hers|herself|the same woman)\b/i;
/** Story strings of the record that may carry a pronoun: hooks, ties, secrets, crisis hooks. */
function storyStrings(r) {
  const out = [];
  const push = (path, s, owner) => { if (typeof s === 'string' && s) out.push({ path, s, owner }); };
  for (const n of npcsOf(r)) { for (const h of n.plotHooks || []) push(`npcs[${n.id}].plotHooks`, h, n); if (n.secret?.what) push(`npcs[${n.id}].secret`, [n.secret.what, n.secret.stakes].filter(Boolean).join('. '), n); }
  for (const h of r?.economicState?.safetyProfile?.plotHooks || []) push('economicState.safetyProfile.plotHooks', h);
  for (const h of r?.defenseProfile?.safetyProfile?.plotHooks || []) push('defenseProfile.safetyProfile.plotHooks', h);
  for (const c of r?.powerStructure?.conflicts || []) for (const h of c.plotHooks || []) push('powerStructure.conflicts.plotHooks', h);
  for (const e of r?.history?.historicalEvents || []) for (const h of e.plotHooks || []) push('history.historicalEvents.plotHooks', h);
  for (const e of r?.history?.currentTensions || []) for (const h of e.plotHooks || []) push('history.currentTensions.plotHooks', h);
  for (const x of r?.economicViability?.plotHooks || []) push('economicViability.plotHooks', x?.hook);
  for (const k of ['stress', 'stressors']) { const v = r?.[k]; for (const x of Array.isArray(v) ? v : [v]) push(`${k}.crisisHook`, x?.crisisHook); }
  for (const t of r?.relationships || []) { push(`relationships[${t.id}].description`, t.description); push(`relationships[${t.id}].tension`, t.tension); }
  return out;
}
/** A role noun of the roster: the last word of a title ("the garrison commander" → commander). */
const roleHead = (title) => lc(title).replace(/^(the|a|an) /, '').replace(/[^a-z' -]/g, '').trim().split(/\s+/).pop() || '';
/** C130353, C130354 (NEGATIVE C75413: the pronoun is another's). A DEFINITE role ("the commander") that the roster
 * fills, every holder of the other sex, in a hook whose pronouns are all of one sex and name no other sexed person. */
export function law10b({ record, tabs, town }) {
  const out = []; if (!record) return out;
  const holders = new Map();
  for (const n of npcsOf(record)) { const h = roleHead(n.title || n.role); if (h.length > 3) { if (!holders.has(h)) holders.set(h, []); holders.get(h).push(n); } }
  const OTHER_SEXED = /\b(man|woman|men|women|son|daughter|boy|girl|widow|widower|husband|wife|brother|sister|father|mother|bride|groom|lover)\b/i;
  const seen = new Set();
  // a roster name is no pronoun: "Fujio He" (the fresh 300, bar0-metropolis-calm-rand-118) — names are struck before reading
  const names = npcsOf(record).map((n) => String(n.name || '')).filter(Boolean).sort((x, y) => y.length - x.length);
  for (const { path, s: raw, owner } of storyStrings(record)) {
    let s = raw; for (const nm of names) s = s.split(nm).join('{person}');
    const m = MALE.test(s), f = FEMALE.test(s); if (m === f) continue;
    const sex = m ? 'male' : 'female';
    const stripped = s.replace(/\bthe same (man|woman)\b/gi, '');
    if (OTHER_SEXED.test(stripped)) continue;
    // a definite noun phrase: the one or two words after "the" ("the commander", "the garrison chaplain")
    const roles = [...s.matchAll(/\bthe ([a-z]+)(?: ([a-z]+))?/gi)].flatMap((x) => [x[1], x[2]]).filter(Boolean).map(lc).filter((h) => holders.has(h));
    if (!roles.length) continue;
    for (const h of new Set(roles)) {
      // a qualifier of the hook that names one holder's office ("garrison" for the garrison commander) narrows the holders
      // a person's own secret or hook speaks of its owner as "they": the owner is never the pronoun's antecedent (C75413)
      const all = holders.get(h).filter((n) => n !== owner); if (!all.length) continue; const words = new Set(lc(s).match(/[a-z]+/g));
      const narrowed = all.filter((n) => lc(n.title).replace(/^the /, '').split(/\s+/).slice(0, -1).some((q) => q.length > 3 && words.has(q)));
      const hs = narrowed.length ? narrowed : all; if (!hs.every((n) => n.gender && n.gender !== sex)) continue;
      const key = `${h}|${s}`; if (seen.has(key)) continue; seen.add(key);
      const against = { record: `${path} ↔ npcs: ${hs.map((n) => `${n.name} (${n.gender}), ${n.title}`).join('; ')}` };
      out.push(...placed('10b', town, tabs, raw.split(/(?<=\.)\s/)[0], against, `the hook's "${m ? 'he/the same man' : 'she/the same woman'}" is "the ${h}", and the roster's ${h} is ${hs.map((n) => n.gender).join('/')}`));
    }
  }
  return out;
}

/* ───────────────────────── 10c · a person given another's title ───────────────────────── */
const tnorm = (t) => lc(t).replace(/^(the|a|an) /, '').trim();
const squash = (t) => tnorm(t).replace(/[^a-z]/g, '');
/** C196525. The card's title for a person is the roster title of ANOTHER person of the town, and not a looser name for
 * the person's own (the hypernym "Innkeeper" of a coaching-inn keeper is spared). Read on the Institutions card's
 * "Connection: <Title> <Name>" and the person's own NPC card title line. */
export function law10c({ record, tabs, town }) {
  const out = []; if (!record) return out;
  const byName = new Map(npcsOf(record).map((n) => [n.name, n]));
  const byTitle = new Map(); for (const n of npcsOf(record)) { const t = tnorm(n.title); if (!byTitle.has(t)) byTitle.set(t, []); byTitle.get(t).push(n); }
  const judge = (tab, line, name, T) => {
    const n = byName.get(name); if (!n) return;
    const own = tnorm(n.title); const t = tnorm(T);
    if (t === own || squash(own).includes(squash(T)) || squash(T).includes(squash(own))) return;
    const others = (byTitle.get(t) || []).filter((o) => o.name !== name); if (!others.length) return;
    out.push(inst('10c', town, tab, line, { record: `npcs[${n.id}].title "${n.title}"; ${others.map((o) => `${o.name}: "${o.title}"`).join('; ')}` }, `the page calls ${name} "${T}", the roster's title of ${others.map((o) => o.name).join(', ')}; ${name} is ${n.title}`));
  };
  for (const [tab, ls] of Object.entries(tabs || {})) {
    ls.forEach((L, i) => {
      const m = /^Connection: (.+)$/.exec(L.trim());
      if (m) { const nm = [...byName.keys()].find((k) => m[1].endsWith(' ' + k)); if (nm) judge(tab, L, nm, m[1].slice(0, -nm.length - 1)); }
      if (/NPCs$/.test(tab) && /●+$/.test(L)) {
        const nm = L.replace(/●+$/, '');
        if (!byName.has(nm)) return;
        // the card: name●, ▲, "<house> · first of …", then the title line (no "·", short)
        for (let j = i + 1; j < Math.min(i + 4, ls.length); j++) { if (/ · | of /.test(ls[j]) || ls[j] === '▲') continue; if (ls[j].length < 40 && !/[:.]/.test(ls[j])) { judge(tab, ls[j], nm, ls[j]); } break; }
      }
    });
  }
  return out;
}

/* ───────────────────────── 10d · a tie against the seat and the purse ───────────────────────── */
const SEAT_ASKED = /\bhas asked for a seat on the council\b/i;
/** PRECISION (720, seed 1016): only YEARLY borrowing against a YEARLY surplus stands; "the treasury will not cover" an
 * interest bill, a debt "more than two years of taxes" and "money in hand" at a crisis's start read WEAK (13 of 13). */
const DEBT_YEARLY = /\btreasury borrowed\b.*\bevery year since\b/i;
const PURSE_UP = /\btreasury takes in (?:a little )?more than it pays out each year\b|\bwith a little left over each year\b/i;
/** C66115 (a seat asked for and held), C66113 (yearly borrowing against a page that says the treasury runs ahead). */
export function law10d({ record, tabs, town }) {
  const out = []; if (!record) return out;
  const gov = governingOf(record); const byId = new Map(npcsOf(record).map((n) => [n.id, n]));
  for (const t of record.relationships || []) {
    const tx = t.tension || '';
    if (SEAT_ASKED.test(tx) && gov) {
      const asker = tx.startsWith(t.npc1Name) ? byId.get(t.from) : tx.startsWith(t.npc2Name) ? byId.get(t.to) : null;
      const sits = asker && (asker.memberships || []).find((m) => m.power === gov.faction && !m.veiled);
      if (sits) out.push(...placed('10d-seat', town, tabs, tx, { record: `npcs[${asker.id}].memberships: ${gov.faction} (${sits.rank == null ? 'a member' : 'rank ' + sits.rank}, not veiled)` }, `${asker.name} asks for a seat on the council and already sits on ${gov.faction}, the governing power`));
    }
    for (const k of ['description', 'tension']) {
      const s = t[k] || ''; if (!DEBT_YEARLY.test(s)) continue;
      const up = linesOf(tabs).find((x) => PURSE_UP.test(x.line));
      if (up) out.push(...placed('10d-purse', town, tabs, s, { tab: up.tab, line: up.line }, 'the tie says the treasury borrows every year or cannot meet its interest; the page says it runs a little ahead'));
    }
  }
  return out;
}

/* ───────────────────────── 10e · temperament, secret, house card, pay ───────────────────────── */
/** A secret of taking money to betray a duty. */
const CORRUPT_SECRET = /\bpaid to (?:lose|keep|look|report)\b|\bbeen paid\b|\bis paid by\b|\bfor a (?:share|fee|price)\b|\bin return for a share\b|\bfor a share of\b|\btakes a (?:monthly )?payment\b|\btakes a bribe\b|\bbribe\b|\bskim(?:s|ming)?\b|\bembezzl|\bpocketed\b|\bon the payroll of\b|\bkeeping the difference\b|\bkeeps the extra\b|\bkeeps back a share\b|\bfor whoever pays\b|\bbecause someone paid\b|\bsomeone paid them\b/i;
/** A secret of deceit: a lie told, a record forged. */
const DECEIT_SECRET = /\blies\b|\blied\b|\bforged\b|\bforging\b|\bfalsif|\bfraudulent|\bmade up\b|\bmaking up\b|\bfabricat/i;
const TEMPER_INCORRUPT = new Set(['incorruptible']);
/** PRECISION (720, seed 1016): "honest" and "plain-dealing" against a deceit stand (8 of 8); "candid" and "forthright" are
 * words of manner, not of truth, and read WEAK (0 of 12): counted apart as 10e-temper-manner, never as law. */
const TEMPER_HONEST = new Set(['honest', 'plain-dealing']);
const TEMPER_MANNER = new Set(['candid', 'forthright']);
const DRAWS_PAY = /\bdraws pay\b|\bnames that never\b|\bon the roster\b.*\bpay\b/i;
const NOBODY_PAID = /\bNobody is paid\b|\bno one is paid\b|\bunpaid\b|\bserve without pay\b/i;
const WELL_PAID = /\bwell paid\b/i;
/** PRECISION (720, seed 1016): "unpaid wages" of an old commission is no pay of the watch (EXPLAINED): only the forces' own pay. */
const PAY_CUT = /\bcuts the pay of those sent to stop it\b|\bthe pay for stopping it shrinks\b|\b(?:watch|guards?|garrison|soldiers)(?:'s|’s)? pay (?:is|has been) cut\b/i;
/** C31450 (temperament against its own secret), C200774 (secret against its house card), C51048 (pay claim). */
export function law10e({ record, tabs, town }) {
  const out = []; if (!record) return out;
  for (const n of npcsOf(record)) {
    const d = lc(n.personality?.dominant); const w = n.secret?.what || '';
    if (!w) continue;
    // a secret the person only KNOWS of ("Knows the … document was fraudulently created") is not a deceit of theirs
    const theirs = !/^Knows\b/i.test(w) || /\bhelped\b|\band has\b/i.test(w);
    const kind = TEMPER_INCORRUPT.has(d) && CORRUPT_SECRET.test(w) ? '10e-temper' : TEMPER_HONEST.has(d) && theirs && DECEIT_SECRET.test(w) ? '10e-temper-honest' : TEMPER_MANNER.has(d) && theirs && DECEIT_SECRET.test(w) ? '10e-temper-manner' : null;
    if (kind) {
      const card = cardOf(tabs, n.name);
      const temper = card.filter((x) => new RegExp(`Temperament: ${esc(d)}\\b`).test(x.line));
      const sec = card.filter((x) => fold(x.line).includes(fold(`Secret: ${w}`).slice(0, 60)));
      const against = { record: `npcs[${n.id}].personality.dominant "${d}" ↔ secret.what` };
      // the pair is one fault on the card: placed on the temperament line (the reader's flag), against the secret
      if (temper.length) for (const x of temper) out.push(inst(kind, town, x.tab, x.line, { ...against, tab: sec[0]?.tab || null, line: sec[0]?.line || null }, `${n.name}'s card prints temperament "${d}" and a secret that denies it: "${w.slice(0, 80)}"`));
      else out.push(inst(kind, town, null, `Temperament: ${d} · Secret: ${w}`, against, `${n.name}: temperament "${d}" against the secret (record only)`));
    }
    if (DRAWS_PAY.test(w)) {
      const house = n.institution?.key; const card = house && linesOf(tabs).find((x) => /Institutions$|Defense$|NPCs$/.test(x.tab) && NOBODY_PAID.test(x.line));
      if (card) out.push(...placed('10e-house', town, tabs, `Secret: ${w}`, { tab: card.tab, line: card.line, record: `npcs[${n.id}].institution ${house}` }, `${n.name}'s secret draws pay; the house card says nobody is paid`, { tabRe: /NPCs$/ }));
    }
  }
  const cut = linesOf(tabs).find((x) => PAY_CUT.test(x.line));
  if (cut) for (const x of linesOf(tabs)) if (WELL_PAID.test(x.line) && /\b(watch|garrison|guard|soldiers|militia)\b/i.test(x.line) && !PAY_CUT.test(x.line)) out.push(inst('10e-pay', town, x.tab, x.line, { tab: cut.tab, line: cut.line }, 'the forces are printed well paid; another line says their pay is cut'));
  return out;
}

/* ───────────────────────── 10f · a power's card ───────────────────────── */
const KIND_WORDS = {
  religious: /\b(clergy|priests?|church|faith|doctrine|temple|theocra\w*|religious|holy|god|gods|divine|tithes?)\b/i,
  secular_council: /\b(guild masters|magnates|aldermen|merchants?, guilds|city-state council|elected or appointed council)\b/i,
};
const TIER_WORD = /\b(hamlet|village|town|city|metropolis)\b/i;
const TIER_RANK = { thorp: 0, hamlet: 1, village: 2, town: 3, city: 4, metropolis: 5 };
const SMALL_TRADERS = /\bA small group of traders who come on market days\b/i;
const MORE_SAY = /\b(The merchant guilds|The clergy|[A-Z][A-Za-z' ]+?) (?:now )?have more say\b/;
const SAY_KIND = { 'the merchant guilds': 'economy', 'the clergy': 'religious' };
/** C121364 (a theocracy given a council's description), C128237 (a village blurb in a metropolis), C110252 (a card
 * says another power has more say than the page's own weights allow), C102099 (a house backs its ruler and the
 * ruler's high rival). */
export function law10f({ record, tabs, town }) {
  const out = []; if (!record) return out;
  const tier = record.tier || record.config?.settType; const F = factionsOf(record);
  for (const f of F) {
    const desc = f.desc || ''; if (!desc) continue;
    const against = { record: `powerStructure.factions[${f.faction}] category ${f.category}${f.isGoverning ? ' (governing)' : ''} · power ${f.power} ${f.powerLabel || ''} · tier ${tier}` };
    if (f.isGoverning && f.category === 'religious' && KIND_WORDS.secular_council.test(desc) && !KIND_WORDS.religious.test(desc)) out.push(...placed('10f-kind', town, tabs, desc, against, `the governing ${f.faction} is a religious power; its card gives it a secular council's description`, { tabRe: /Power$/ }));
    const tw = TIER_WORD.exec(desc.replace(/\btown watch\b|\bcity watch\b/gi, ''));
    if (tw && tier in TIER_RANK && Math.abs(TIER_RANK[lc(tw[1])] - TIER_RANK[tier]) >= 2) out.push(...placed('10f-tier', town, tabs, desc, against, `the card names a ${lc(tw[1])} in a ${tier}`, { tabRe: /Power$/ }));
    if (SMALL_TRADERS.test(desc) && TIER_RANK[tier] >= 4) out.push(...placed('10f-tier', town, tabs, desc, against, `a market-day traders' blurb for a power of a ${tier}`, { tabRe: /Power$/ }));
    const ms = MORE_SAY.exec(desc);
    if (ms) {
      const who = lc(ms[1]).replace(/^the /, ''); const other = F.find((g) => lc(g.faction).replace(/^the /, '') === who && g !== f) || (SAY_KIND['the ' + who] ? F.find((g) => g.category === SAY_KIND['the ' + who] && g !== f) : null);
      // PRECISION (720, seed 1016): a "Suppressed" label on the power named is no proof it weighs less (4 of 5 EXPLAINED): weights only
      if (other && Number(other.power) <= Number(f.power)) out.push(...placed('10f-weight', town, tabs, desc.slice(ms.index), { record: `${f.faction} power ${f.power} (${f.powerLabel}) > ${other.faction} power ${other.power} (${other.powerLabel})` }, `the card says ${ms[1]} have more say; the page's own weights put ${other.faction} below ${f.faction}`, { tabRe: /Power$/ }));
    }
  }
  // a house that backs both the governing power and that power's rival in a HIGH quarrel
  const gov = governingOf(record);
  const high = new Set((record.powerStructure?.conflicts || []).filter((c) => lc(c.intensity) === 'high').map((c) => (c.parties || []).slice().sort().join('|')));
  // STRICT (C102099): the house is the RULER'S OWN SEAT: its card's category is Government, or its connection heads the
  // ruling power. A trade house that backs both sides of a high quarrel is counted apart (10f-backs-wide), not as law.
  const heads = new Set(npcsOf(record).filter((n) => (n.memberships || []).some((m) => m.power === gov?.faction && m.rank === 1)).map((n) => n.name));
  if (gov) for (const [tab, ls] of Object.entries(tabs || {})) {
    if (!/Institutions$/.test(tab)) continue;
    ls.forEach((L, i) => {
      if (!/^Backs · /.test(L)) return;
      const backs = L.replace(/^Backs · /, '').split(' · ');
      if (!backs.includes(gov.faction)) return;
      let head = null, conn = null;
      for (let j = i - 1; j >= Math.max(0, i - 8); j--) { if (!conn && /^Connection: /.test(ls[j])) conn = ls[j]; if (/^[^·]+ · [A-Z][a-z]+(?: · [A-Z][a-z]+)?$/.test(ls[j]) && !/^(Backs|Services|Connection)/.test(ls[j])) { head = ls[j]; break; } }
      const seat = (head && / · Government\b/.test(head)) || (conn && [...heads].some((h) => conn.endsWith(' ' + h)));
      for (const p of backs) if (p !== gov.faction && high.has([p, gov.faction].sort().join('|'))) out.push(inst(seat ? '10f-backs' : '10f-backs-wide', town, tab, L, { record: `powerStructure.conflicts: ${gov.faction} vs ${p} · high`, line: head }, `the house${seat ? ', the ruler\'s own seat,' : ''} backs ${gov.faction}, the ruler, and ${p}, the ruler's high rival`));
    });
  }
  return out;
}

/* ───────────────────────── 10g · numbers, dates and legacies ───────────────────────── */
const NUMW = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, twelve: 12 };
const spanOf = (s) => { const m = /\bfor (\d+|one|two|three|four|five|six|seven|eight|nine|ten|twelve) (seasons?|years?|months?|weeks?|days?|winters?|summers?)\b/i.exec(s || ''); return m ? `${NUMW[lc(m[1])] ?? Number(m[1])} ${lc(m[2]).replace(/s$/, '')}` : null; };
const PHYSICAL = /great_fire|fire|flood|earthquake|storm|raid|siege|external_threat|war|sack|occupation|collapse_disaster|landslide|plague/;
const BUILT_AFTER = /\bwas built after the ([a-z' -]+?), and\b|\bcame through the ([a-z' -]+?), and what the town built in answer still stands\b/i;
/** C133674 (one event, two lengths), C55011 (a rebuilding after an event that destroyed nothing).
 * NEGATIVES C24588, C181033, C184829: a past event dated as past is no fault and is not read here. */
export function law10g({ record, tabs, town }) {
  const out = []; if (!record) return out;
  const H = record.history || {};
  const entries = [
    ...(H.historicalEvents || []).map((e) => ({ key: e.templateType || lc(e.name), name: e.name, text: e.description, where: 'history.historicalEvents' })),
    ...(H.currentTensions || []).map((e) => ({ key: e.type, name: e.type, text: e.description, where: 'history.currentTensions' })),
  ];
  const byKey = new Map(); for (const e of entries) { if (!e.key) continue; if (!byKey.has(e.key)) byKey.set(e.key, []); byKey.get(e.key).push(e); }
  for (const [k, es] of byKey) {
    const spans = es.map((e) => ({ e, sp: spanOf(e.text) })).filter((x) => x.sp);
    if (new Set(spans.map((x) => x.sp)).size < 2) continue;
    const [a, b] = spans;
    const pa = printedAt(tabs, a.e.text, { tabRe: /History$/ }), pb = printedAt(tabs, b.e.text, { tabRe: /History$/ });
    // placed on the dated event's own line (the first entry: a historical event before a current tension), against the other
    if (pa.length && pb.length) out.push(inst('10g-span', town, pa[0].tab, pa[0].line, { tab: pb[0].tab, line: pb[0].line, record: `${a.e.where} / ${b.e.where} · ${k}: ${a.sp} vs ${b.sp}` }, `the same ${k} is told twice on one tab, lasting ${a.sp} and ${b.sp}`));
  }
  const evs = H.historicalEvents || [];
  for (const x of linesOf(tabs)) {
    const m = BUILT_AFTER.exec(x.line); if (!m) continue;
    const cal = lc(m[1] || m[2]).trim();
    const named = evs.filter((e) => lc(e.name).replace(/^the /, '') === cal);
    if (!named.length) continue;
    if (named.some((e) => PHYSICAL.test(lc(`${e.type} ${e.templateType}`)))) continue;
    // PRECISION (720, seed 1016): a crash or a trade collapse is economic ruin after which rebuilding is plausible (WEAK, 4 of 4)
    const ruin = named.some((e) => /market_crash|trade_collapse/.test(lc(e.templateType)));
    out.push(inst(!m[1] ? '10g-legacy-answer' : ruin ? '10g-legacy-ruin' : '10g-legacy', town, x.tab, x.line, { record: `history.historicalEvents: ${named.map((e) => `${e.name} (${e.type}, ${e.templateType}, ${e.severity}, ${e.yearsAgo}y)`).join('; ')}` }, `the line has the town built after "${cal}", an event that destroyed nothing`));
  }
  return out;
}

/* ───────────────────────── 10h · a slash roster label used as a name ───────────────────────── */
const VERBISH = /^(?:'s|’s|\s+(?:has|have|is|was|says|said|holds|held|keeps|kept|wants|controls|posted|went|leads|led|runs|ran|backs|refuses|demands|claims|took|takes|sent|sends|gets|got|cannot|can|will|would|must|answers|carries|insists|thinks|knows|knew|wins|won|lost|loses|asked|asks|seized|seizes|calls|called|accuses|blames|has been)\b)/;
/** C1980, C76763. A power whose roster label holds a slash, printed inside a sentence beside a verb or a possessive. */
export function law10h({ record, tabs, town }) {
  const out = []; if (!record) return out;
  // every roster label the estate writes with a slash or a bracket (PROSE_FORMS: the one table of their prose forms)
  const labels = factionsOf(record).map((f) => f.faction).filter((n) => /\/|\(/.test(n) || Object.hasOwn(PROSE_FORMS, n));
  if (!labels.length) return out;
  for (const x of linesOf(tabs)) {
    for (const L of labels) {
      let idx = x.line.indexOf(L);
      while (idx >= 0) {
        const after = x.line.slice(idx + L.length);
        // a name beside a verb or a possessive, or any use inside a prose sentence (a line ending in a stop, eight words or
        // more, not a "label · value" row): "Military/Guard and its rivals agreed …" (720: r2r-*, Summary/Plot Hooks)
        const prose = /[.!?]$/.test(x.line.trim()) && x.line.trim().split(/\s+/).length >= 8 && !/^[^.]*· /.test(x.line);
        if (VERBISH.test(after) || prose) { out.push(inst('10h', town, x.tab, x.line, { record: `powerStructure.factions["${L}"] (the roster label)` }, `the roster label "${L}" is used as a name ("${(L + after).slice(0, 40)}…"); its prose form is "${PROSE_FORMS[L] || L.split('/')[0]}"`)); break; }
        idx = x.line.indexOf(L, idx + 1);
      }
    }
  }
  return out;
}

export const LAW10 = { law10a, law10b, law10c, law10d, law10e, law10f, law10g, law10h };
