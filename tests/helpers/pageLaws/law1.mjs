/**
 * pageLaws/law1.mjs — LAW 1 · THE PAGE NEVER CONTRADICTS ITS OWN STATE WORD (BAR5-AUDIT, seat A).
 * The page prints state words (Reliance on magic, Food Security, a power's standing, the defence roster,
 * the stability word); prose elsewhere on the page asserts a level of the same thing. A detector is a pure
 * function over one town `{ record, tabs, town }` (`tabs`: the DOSSIER tabs, `page.mjs :: dossierTabs`) and
 * returns instances `{ law, town, tab, line, against, why }`. CONSERVATIVE FIRST: each pattern is drawn from
 * a control row's own note (docs/chair/2026-11-16/review-bar-5/SECOND-CHECK.final72.json) and names the
 * state word it contradicts; a line that describes ordinary times under a marked row is not read here.
 * Pure; no I/O. Detectors find CANDIDATES the hand-back judges by sample (its precision table).
 */

/** The reliance ladder the page prints. */
const RELIANCE = /^Reliance on magic: (None|Present|Relied upon|Integral)\b/;

/** 1a · prose that ASSERTS the town leans on magic (the controls C17061 C29831 C9617 C33713 C43125). */
export const MAGIC_DEPENDS = [
  /\brelies on arcane workings\b/i,
  /\bholds up only with help beyond ordinary labour\b/i,
  /\bleans on help beyond ordinary work\b/i,
  /\bif the help beyond ordinary work failed\b/i,
  /\bmore dependent on arcane resources\b/i,
  // BAR5-MAGIC (L3, widened 2026-11-16): the siblings of the same DS-DEF-9 pool ("magicDependency true" v1 v2 v3), which make
  // the same claim in other words and were not read (the audit's patterns were drawn from the NAMED-chain pool's rows)
  /\brelies on help beyond ordinary work\b/i,
  /\bhas come to lean on it without ever deciding to\b/i,
  /\bleans on the people who give it help beyond ordinary work\b/i,
];
/** 1a · prose that DENIES it (negative controls C31972 C40444 under Present; old C36862). */
export const MAGIC_DENIES = [
  /\bnothing structural at .+ depends on arcane work\b/i,
  /\bdoes not rest on it: nothing it lives by would stop without it\b/i,
  /\bwould go on as it is if the arcane went away\b/i,
  /\bnothing it lives by waits on a spell\b/i,
  /\bwould go on making without a practitioner\b/i,
];
/** 1a · a denial of practitioners, false where an arcane house stands on the roster. */
const NO_ARCANE_PRACTITIONER = /\bNo arcane practitioners\b/i;
const ARCANE_HOUSE = /\b(?:mages?'?|wizards?'?|sorcer|arcan|enchant|magic(?:al)? (?:academy|college|school)|magister)/i;

/** 1b · food reassurance (C40276; old C19130 C20588). */
export const FOOD_REASSURES = [
  /\bwithout going hungry\b/i,
  /\bdoes not empty the [\w' ]*tables\b/i,
  /\b(?:nobody|no one) (?:here )?goes hungry\b/i, // PRECISION (720 draw, seed 516): "nobody is going without bread" in a Pressured town read WEAK; not read
  /\bfood to spare\b/i,
];
/** 1b · food alarm, false where the page prints Secure (no crisis): the town said not to feed itself. */
export const FOOD_ALARMS = [
  /\buntil the \w+ can feed itself\b/i,
  /\bwill stay poor for as long as it stays hungry\b/i,
  /\bcannot grow richer while it cannot feed itself\b/i,
  /\bhouseholds still go short\b/i,
];
const FOOD_WORD = /^Food Security · (Secure|Surplus|Pressured|Deficit|Import-[Dd]ependent)(?: — (.*))?$/;
/** PRECISION (720 draw, seed 516): a reassurance in a town with six months or more put by read EXPLAINED (a poor year is covered by the store). */
const STORE_COVERS = 6;

/** 1c · a power's stock description that asserts WEIGHT (C33631; rulingStructure.js's descriptions). */
export const POWER_WEIGHT = [
  /\bmeaningful civic influence\b/i,
  /\bsubstantial temporal power\b/i,
  /\bcarries (?:decisive|institutional) weight\b/i,
  /\bgenuine political weight\b/i,
  /\bpolitical influence disproportionate\b/i,
  /\bhold direct temporal power\b/i,
  /\bstructural influence the [\w ]+ cannot easily override\b/i,
];
/** 1c · the strongest of those, read against a Minor standing too (reported as its own sub-law). */
export const STRONG_WEIGHT = [/\bsubstantial temporal power\b/i, /\bcarries decisive weight\b/i, /\bgenuine political weight\b/i, /\bhold direct temporal power\b/i];
/** 1c · a power's description that asserts a FORCE, with the roster it needs (C39734 C43925). */
export const FORCE_CLAIMS = [
  { re: /\bArmed patrol of able-bodied residents\b/i, needs: ['militia', 'watch'] },
  { re: /\bSignificant military force\b/i, needs: ['garrison', 'militia', 'watch', 'mercenary'] },
  { re: /\bSignificant military presence\b/i, needs: ['garrison', 'militia', 'watch', 'mercenary'] },
  { re: /\bStanding army with genuine political weight\b/i, needs: ['garrison'] },
  { re: /^(?:Town|City) watch; /, needs: ['watch'] },
];
/** 1c · a person's card that asserts a secure hold (C35627), false beside its own "Standing marginal". */
const NPC_SECURE = /\bits hold is secure\b|\bits say is real\b/i;
/** 1c · the seat holds because no rival outweighs it (C38889). */
const NO_RIVAL = /^The (.+?) at .+ holds because no rival yet outweighs\b/;
const LADDER = { Dominant: 5, Strong: 4, Significant: 3, Minor: 2, Marginal: 1, Suppressed: 0 };

/** 1d · the Daily Life prosperity sentence, by its direction (C32519; negative C16520). */
export const PROSPERITY_UP = [
  /\bpays its own way and has a little in hand\b/i,
  /\btreasury takes in a little more than it pays out\b/i,
  /\bcloses every year ahead\b/i,
  /\bis rich and behaves like it\b/i,
  /\bThe wealth here is not the kind a stranger has to look for\b/i,
  /\baccounts still balance\b/i,
  /\baccounts have money in hand\b/i,
];
export const PROSPERITY_DOWN = [
  /\bnever quite makes ends meet\b/i,
  /\bis short more often than not\b/i,
  /\bwill stay poor\b/i,
];
const STABILITY_POOR = /\bunderfunded\b|\bbankrupt\b|\binsolven/i;
const STABILITY_RICH = /\bprosperous\b/i;

const first = (tabs, re, prefer = []) => {
  for (const tab of [...prefer, ...Object.keys(tabs)]) {
    for (const line of tabs[tab] || []) { const m = re.exec(line); if (m) return { tab, line, m }; }
  }
  return null;
};
const hitsOf = (tabs, res, only) => Object.entries(tabs).flatMap(([tab, ls]) => (only && !only.test(tab) ? [] : ls)
  .map((line, i) => ({ tab, i, line, re: res.find((r) => r.test(line)) })).filter((h) => h.re));
const inst = (law, town, h, against, why) => ({ law, town, tab: h.tab, line: h.line, against, why });
const rosterOf = (record) => {
  const d = record?.defenseProfile?.institutions || {};
  return Object.fromEntries(['walls', 'garrison', 'militia', 'watch', 'mercenary', 'charter'].map((k) => [k, Array.isArray(d[k]) && d[k].length > 0]));
};
const arr = (v) => (Array.isArray(v) ? v : v ? [v] : []);
const crisesOf = (record) => new Set([...arr(record?.config?.stressTypes), ...arr(record?.stress).map((s) => s?.type)].filter(Boolean));

/** 1a MAGIC. @param {{ record: any, tabs: Record<string,string[]>, town: string }} t */
export function law1a({ record, tabs, town }) {
  const out = [];
  const w = first(tabs, RELIANCE, ['Systems/Magic', 'Summary/Foundations']);
  if (!w) return out;
  const word = w.m[1];
  const against = { tab: w.tab, line: w.line.trim() };
  // PRECISION (720 draw, seed 516): under Present, a role line the page prints integral or common supports the line (WEAK)
  const roleHeld = (tabs['Systems/Magic'] || []).some((l) => /^(?:Economic|Military|Medical|Infrastructure) role: (?:integral|common)\b/.test(l));
  if (word === 'None' || (word === 'Present' && !roleHeld)) {
    for (const h of hitsOf(tabs, MAGIC_DEPENDS)) out.push(inst(word === 'None' ? '1a-depends/None' : '1a-depends/Present', town, h, against, `asserts reliance on magic; the page's word is ${word}`));
  }
  if (word === 'Relied upon' || word === 'Integral') {
    for (const h of hitsOf(tabs, MAGIC_DENIES)) out.push(inst('1a-denies/' + word, town, h, against, `denies reliance on magic; the page's word is ${word}`));
  }
  const houses = (record?.institutions || []).map((i) => String(i?.name || '')).filter((n) => ARCANE_HOUSE.test(n) && !/^access to/i.test(n));
  if (houses.length) {
    for (const h of hitsOf(tabs, [NO_ARCANE_PRACTITIONER])) out.push(inst('1a-denies/house', town, h, { record: 'institutions', line: houses.join(', ') }, 'denies arcane practitioners; an arcane house stands'));
  }
  return out;
}

/** 1b FOOD. */
export function law1b({ record, tabs, town }) {
  const out = [];
  const w = first(tabs, FOOD_WORD, ['Summary/Overview']);
  if (!w) return out;
  const word = w.m[1];
  const against = { tab: w.tab, line: w.line.trim() };
  const months = Number(record?.economicState?.foodSecurity?.foodRecord?.storageMonths ?? record?.economicState?.foodSecurity?.storageMonths);
  if (word !== 'Secure' && word !== 'Surplus' && !(months >= STORE_COVERS)) {
    for (const h of hitsOf(tabs, FOOD_REASSURES)) out.push(inst('1b-reassures/' + word, town, h, against, `a food reassurance; the page's food word is ${word}${w.m[2] ? ' — ' + w.m[2] : ''}`));
  }
  if ((word === 'Secure' || word === 'Surplus') && crisesOf(record).size === 0) {
    for (const h of hitsOf(tabs, FOOD_ALARMS)) out.push(inst('1b-alarms/' + word, town, h, against, `a food alarm; the page's food word is ${word}, no crisis`));
  }
  return out;
}

/** 1c POWER AND FORCE. */
export function law1c({ record, tabs, town }) {
  const out = [];
  const factions = Array.isArray(record?.powerStructure?.factions) ? record.powerStructure.factions : [];
  const roster = rosterOf(record);
  // a power's stock description, matched to its record row by its own text (the page prints `desc` whole)
  for (const f of factions) {
    const desc = String(f?.desc || '');
    if (!desc) continue;
    const head = desc.slice(0, 60);
    const lines = Object.entries(tabs).flatMap(([tab, ls]) => ls.filter((l) => l.startsWith(head)).map((line) => ({ tab, line })));
    if (!lines.length) continue;
    const h = lines.find((x) => x.tab === 'Systems/Power') || lines[0];
    if (f.powerLabel === 'Minor') {
      const re = STRONG_WEIGHT.find((r) => r.test(desc));
      if (re) out.push(inst('1c-weight/Minor', town, h, { record: 'powerStructure.factions[].powerLabel', line: `${f.faction} (Minor, ${f.power})` }, `a power's description asserts strong weight (${re.source}); its standing is Minor`));
    }
    if (f.powerLabel === 'Suppressed') {
      const re = POWER_WEIGHT.find((r) => r.test(desc));
      if (re) out.push(inst('1c-weight/Suppressed', town, h, { record: 'powerStructure.factions[].powerLabel', line: `${f.faction} (Suppressed, ${f.power})` }, `a power's description asserts weight (${re.source}); its standing is Suppressed`));
    }
    for (const c of FORCE_CLAIMS) {
      if (!c.re.test(desc)) continue;
      if (c.needs.every((k) => !roster[k])) out.push(inst('1c-force/roster', town, h, { record: 'defenseProfile.institutions', line: `none of ${c.needs.join(', ')}` }, `a power's description asserts a force (${c.re.source}); the defence roster has none of ${c.needs.join(', ')}`));
    }
  }
  // a person's card: a secure hold beside the card's own "Standing marginal"
  for (const [tab, ls] of Object.entries(tabs)) {
    ls.forEach((line, i) => {
      if (!NPC_SECURE.test(line)) return;
      for (let j = i + 1; j < Math.min(ls.length, i + 9); j++) {
        if (/●$/.test(ls[j])) break;
        const m = /^Standing (marginal|suppressed)\b/.exec(ls[j]);
        if (m) { out.push(inst('1c-npc/' + m[1], town, { tab, line }, { tab, line: ls[j] }, `a person's card asserts a secure hold; the same card prints "${ls[j]}"`)); break; }
      }
    });
  }
  // the seat holds because no rival outweighs it, where a power the page rates higher stands, or under an occupation
  const byName = new Map(factions.map((f) => [String(f.faction), f]));
  for (const [tab, ls] of Object.entries(tabs)) {
    for (const line of ls) {
      const m = NO_RIVAL.exec(line);
      if (!m) continue;
      const me = byName.get(m[1]);
      const higher = me ? factions.filter((f) => f !== me && (LADDER[f.powerLabel] ?? -1) > (LADDER[me.powerLabel] ?? -1)) : [];
      if (higher.length) out.push(inst('1c-norival/outranked', town, { tab, line }, { record: 'powerStructure.factions[].powerLabel', line: `${m[1]} (${me.powerLabel}) under ${higher.map((f) => `${f.faction} (${f.powerLabel})`).join(', ')}` }, 'the seat is said to hold because no rival outweighs it; the page rates a rival higher'));
      else if (crisesOf(record).has('occupied')) out.push(inst('1c-norival/occupied', town, { tab, line }, { record: 'stress', line: 'occupied' }, 'the seat is said to hold because no rival outweighs it; the occupiers decide'));
    }
  }
  return out;
}

/** 1d PROSPERITY AND STABILITY. */
export function law1d({ record, tabs, town }) {
  const out = [];
  const stab = String(record?.powerStructure?.stability || '');
  const where = (h) => (h.tab === 'World/Daily Life' ? '' : '/elsewhere');
  if (STABILITY_POOR.test(stab)) for (const h of hitsOf(tabs, PROSPERITY_UP)) out.push(inst('1d-up/underfunded' + where(h), town, h, { tab: 'Systems/Power', line: `Stability ${stab}` }, 'the prosperity sentence says the town has money; the stability word says it is underfunded'));
  if (STABILITY_RICH.test(stab)) for (const h of hitsOf(tabs, PROSPERITY_DOWN)) out.push(inst('1d-down/prosperous' + where(h), town, h, { tab: 'Systems/Power', line: `Stability ${stab}` }, 'the prosperity sentence says the town is poor; the stability word says it is prosperous'));
  return out;
}

export const LAW1 = { law1a, law1b, law1c, law1d };
