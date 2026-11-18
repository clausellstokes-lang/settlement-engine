// BAR8-AUDIT-K · LAW 13 · A LINE ABOUT LAW, ORDER OR CRIME THAT THE TOWN'S OWN LEGAL STATE DENIES.
// A pure detector over one town read by `pageK.mjs :: readTownK`; returns instances
// { law: 13, rule, town, tab, line, against: { tab, line }, why, thing, writer }.
// THE LEGAL STATE the page prints is the Defense tab's Legal Infrastructure row (`defenseDisplay.js`, the court read off the
// live roster by `facts/defence.js :: courtHoldersOf`, the prison by `compound.inst.hasPrison`); a line is read against it.
//   13a.court    a line that has a court sit, a case heard or tried, where the row prints no court (C39616, C40154, C34395)
//   13b.gaol     a line that has an offender held, gaoled or locked up, where the row prints no prison (C37891)
//   13c.noCourt  a line that says no court sits (or nowhere to hold) where the row prints one
//   13d.record   "no wrong done there is written down" beside the page's own record of crimes (C16222)
//   13e.hours    "the watch on the rounds most hours of the day" where every force the town keeps walks after dark (C42053)
//   13f.rival    "no rival, and no crew is contesting" beside the structure's own "several gangs ... no single authority"
//                (C3863, C8647)
//   13g.tie      a power's card that calls its tie to the guild a war of arrests, where the Web prints a working
//                arrangement (C21547)
import { orderForceOf } from '../../../src/domain/facts/orderForce.js';
const DEF = 'Systems/Defense', POW = 'Systems/Power';
const DESK = 'src/data/dossierStateProse/defense.generated.js';

// a line that DENIES rather than asserts is not read as asserting
const NEG = /\b(no court|without courts?|nowhere to hold|no gaol|not a prison|not quite a gaol|no prison|though no court|there is no court|almost nowhere)\b/i;
const COURT_SAYS = [
  [/\bheard and held\b|\bexpect a hearing\b/i, DESK + ' (Internal Security: full legal chain: court, prison)'],
  [/\bThe court sits and the gaol holds\b/i, 'src/generators/servicesGenerator.js :: SLOW_LAW_DESC (needs court, prison)'],
  [/\bthe court sits and the cells are real\b/i, DESK],
  [/\bgo(?:es)? before the court\b/i, DESK + ' / src/generators/safetyProfile.js (the enforcement lines)'],
  [/\btried at the court\b/i, 'src/generators/safetyProfile.js (the enforcement line)'],
  [/\bArrest, trial and gaol all work here\b/i, DESK],
  [/\bkeeps its own court\b/i, 'src/data/dossierStateProse/general.generated.js'],
  [/\ba hall of justice\b/i, 'src/data/dossierStateProse/general.generated.js'],
  [/\bCases are heard here\b|\bA court exists\b/i, DESK],
];
const GAOL_SAYS = [
  [/\bheard and held\b/i, DESK + ' (Internal Security: full legal chain: court, prison)'],
  [/\bthe gaol holds\b/i, 'src/generators/servicesGenerator.js :: SLOW_LAW_DESC (needs court, prison)'],
  [/\bcells are real\b|\bcan be locked up\b|\bArrest, trial and gaol\b|\bheld in the prison\b/i, DESK],
  [/\bkeeps its own gaol\b|\ba gaol\b(?![^.]*\bthough no court\b)/i, 'src/data/dossierStateProse/general.generated.js'],
  [/\bheld by the (?:watch|garrison|militia|guard|town watch|city watch)\b|\bsafe inside\b|\bget the prisoner out\b/i, 'src/data/people/handlerTieLines.js (handler_leverage_loved / the crewmate line: "held by the {body}")'],
];

export function law13K(T, town) {
  const out = [];
  const push = (rule, at, against, why, thing, writer) => out.push({ law: 13, rule, town, tab: at.tab, i: at.i, line: at.line, s: at.s, against, why, thing, writer });
  const L = T.legal;
  const inst = T.record?.economicState?.compound?.inst || {};
  const legalAg = L ? { tab: DEF, i: L.i, line: `${L.line} / ${L.note}` } : null;

  if (L) {
    for (const x of T.sents) {
      if (x.tab === DEF && x.i === L.i) continue;
      if (NEG.test(x.s)) continue;
      if (!L.court) for (const [re, w] of COURT_SAYS) if (re.test(x.s)) { push('13a.court', x, legalAg, `the line has a court sit or a case heard; the Legal row prints "${L.status}"`, 'court', w); break; }
      if (!L.prison && !inst.hasPrison) for (const [re, w] of GAOL_SAYS) if (re.test(x.s)) { push('13b.gaol', x, legalAg, `the line has someone held; the Legal row prints "${L.status}" and the record holds no prison`, 'prison', w); break; }
    }
    if (L.court) for (const x of T.findSent(/\bno court sits\b|\bthere is no court to take it to\b|\bkeeps no court\b/i)) {
      push('13c.noCourt', x, legalAg, `the line says no court sits; the Legal row prints "${L.status}"`, 'court', DESK + ' / general.generated.js (declares no court by the town-hall name test)');
    }
    if (L.prison) for (const x of T.findSent(/\bnowhere to hold\b|\bkeeps no court and no gaol\b|\bno court and no gaol\b/i)) {
      push('13c.noCourt', x, legalAg, `the line says nowhere to hold; the Legal row prints "${L.status}"`, 'prison', DESK);
    }
  }

  // ---- 13d · nothing written down, beside a record of crimes
  const nothingWritten = T.findSent(/\bno wrong done there is written down\b/i);
  // the record of crimes only (read on the 720: "books record no gang" names no record of wrongs, and the history's "records
  // here are kept carefully" is the culture's line, not the law's)
  const written = T.findSent(/\brecord of crimes\b/i);
  if (nothingWritten.length && written.length) for (const x of nothingWritten) {
    push('13d.record', x, { tab: written[0].tab, i: written[0].i, line: written.map((w) => w.s).join(' | ') },
      'the line says no wrong is written down; the same page keeps a record of crimes', 'record', DESK + ' (Internal Security: no legal infrastructure, beside Safe/Moderate "record of crimes": guardPresence)');
  }

  // ---- 13e · the watch seen by day, where every force walks after dark
  // BAR8-K-WATCH-2 (BR29 (2)): the force as the page prints it, the one partition's houses on the live roster (the Defense tab's
  // "Standing forces"), not a name table of its own (a Warden's Lodge is no force; a Household levy is one)
  const forces = [...orderForceOf(T.record).houses];
  const nightOnly = forces.length > 0 && forces.every((f) => /after dark|\bnight\b/i.test(String(f?.desc || '')) && !/\bday\b|gate|by day|daylight/i.test(String(f?.desc || '')));
  if (nightOnly) for (const x of T.findSent(/\bon the rounds most hours of the day\b|\bat (?:all|any) hours?\b[^.]*\b(watch|patrol)|\b(watch|patrol)\b[^.]*\bby day\b/i)) {
    push('13e.hours', x, { tab: 'record', line: forces.map((f) => `${f.name}: ${String(f.desc || '').slice(0, 90)}`).join(' | ') },
      'the line has the watch on its rounds by day; every force the town keeps walks after dark', 'watch', 'src/generators/safetyProfile.js :: STANDARD_PATROL (#18: the patrol read off the standard, not the force\'s hours)');
  }

  // ---- 13f · no rival, beside several gangs
  const several = T.findSent(/\blacks a single controlling authority\b|\bSeveral gangs\b|\bRival crews\b/i, /^Systems\/Defense$/);
  if (several.length) for (const x of T.findSent(/\bhas no rival, and no crew is contesting\b/i)) {
    push('13f.rival', x, { tab: several[0].tab, i: several[0].i, line: several.map((w) => w.s).join(' | ') },
      'the line says organised crime has no rival; the same tab gives several networks with no single authority', 'rings', DESK + ' (structure semi-organized: tier ≥ village, no rival rings)');
  }

  // ---- 13g · a war of arrests, where the Web prints a working arrangement
  const pow = T.tabs[POW] || [];
  const arr = pow.findIndex((l) => /\bhave a working arrangement\b|\bhas bought key people\b|\bCertain arrests never happen\b/.test(l));
  if (arr >= 0) for (const x of T.findSent(/\bA slow war with the guild\b|\bthe guild can make every investigation costly\b|\bcan arrest their people\b|\benough to keep it down but not to stamp it out\b/i, /^Systems\/Power$/)) {
    push('13g.tie', x, { tab: POW, i: arr, line: pow[arr] }, 'the card calls the tie to the guild a contest of arrests; the Web prints a corrupt working arrangement', 'guild',
      'src/generators/power/factionStanding.js (guard–thieves note by power alone; the relationship\'s type is not read)');
  }
  return out;
}
