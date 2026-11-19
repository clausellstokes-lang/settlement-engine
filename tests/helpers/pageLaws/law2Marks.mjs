// BAR5-MARKS · LAW 2'S ROWS OF A HOUSE OR A SERVICE, ON THE RECORD (BRIEF-BAR5 Amendment L, L4: the detector kept as a guard).
// The page form (`law2.mjs`) reads a census dump; a test corpus carries births, not dumps. This is the same six rules read
// off a born record and the one mark leaf the tabs print through (`display/crisisStoppedRow.js :: rowMarkText`; a service
// row is marked where it or its house is): the reach each rule names, read from the record's own fact (never the words of a
// flagged line), and the claim each rule names (`law2.mjs :: RULES`, the same expressions), on a house's description, a
// service's name or description, or an income share's description, printed bare.
//   L2.siege.abroad   a siege in force; a line that offers what comes from outside
//   L2.siege.cutgood  a siege, and the page's own "… depend on medicinal herbs from outside, which the siege has cut off"
//                     (`chainNeedShown.js :: chainNeedLine`, the line's own writer); a row that offers medicines
//   L2.famine.meat    a famine whose herds failed, or no pastoral chain with no import cover under a siege; a row of meat
//   L2.famine.work    a famine; a line that promises steady work
//   L2.war.iron       the war's iron (`facts/warReach.js :: warTakesOf`); a smith's forge row
//   L2.war.animals    the war's working animals (the same); horse or cart hire
// `{ blind: true }` reads every row as bare (the positive control: the detector must find its rows with the marks hidden).
// NAMED EXCLUSIONS: none at the time of writing; each is a row of EXCLUDED below with its reason.
import { RULES, SELF_AWARE, CUT_GOODS } from './law2.mjs';
import { sentences, MARK_LEAD } from './pageB.mjs';
import { rowMarkText, stoppingCrisesOf, rowStoppedBy } from '../../../src/domain/display/crisisStoppedRow.js';
import { chainNeedLine } from '../../../src/domain/display/chainNeedShown.js';
import { warTakesOf, WAR_TAKES_IRON, WAR_TAKES_ANIMALS } from '../../../src/domain/facts/warReach.js';
import { liveInstitutions } from '../../../src/domain/institutions/institutionRoster.js';
import { serviceRowsOf } from '../../../src/domain/dossier/entityLinks.js';
import { crisisOf } from '../../../src/domain/facts/crisisKind.js';

const RULE = Object.fromEntries(RULES.map((r) => [r.id, r]));

/** A named exclusion: { rule, text (a RegExp over the line), why }. */
export const EXCLUDED = Object.freeze([]);

/** @param {any} s @returns {string | null} the medicinal good the page says the siege cut off */
function cutGoodOf(s) {
  const chains = Array.isArray(s?.economicState?.activeChains) ? s.economicState.activeChains : [];
  for (const c of chains) {
    const m = /depend on (medicinal herbs) from outside, which the siege has cut off/.exec(chainNeedLine(c, s, true));
    if (m) return m[1];
  }
  return null;
}

/** @param {any} s @returns {boolean} the meat rule's reach, by the record (`law2.mjs` L2.famine.meat's own reading) */
function meatReach(s) {
  const fr = s?.economicState?.foodSecurity;
  const failed = fr?.foodRecord?.failedSource;
  if (failed && /livestock|herd/i.test(String(failed))) return true;
  return !!(fr && fr.chains && fr.chains['Pastoral & livestock'] === false && (fr.importCoverage || 0) === 0 && crisisOf(s).has('under_siege'));
}

/**
 * Every instance of the six rules in one born record.
 * @param {any} s @param {{ blind?: boolean }} [opts]
 * @returns {Array<{ rule: string, kind: 'house' | 'service' | 'income', row: string, house: string, line: string, excluded: string | null }>}
 */
export function law2MarksInstances(s, opts = {}) {
  const blind = !!opts.blind;
  const kinds = crisisOf(s);
  const takes = warTakesOf(s);
  const crises = stoppingCrisesOf(s);
  /** @type {Array<{ id: string, claim: RegExp, chip?: RegExp, chipHouse?: RegExp, rowsOnly?: boolean }>} */
  const live = [];
  if (kinds.has('under_siege')) live.push({ id: 'L2.siege.abroad', claim: RULE['L2.siege.abroad'].claim });
  const cut = kinds.has('under_siege') ? cutGoodOf(s) : null;
  if (cut) live.push({ id: 'L2.siege.cutgood', claim: CUT_GOODS[cut], rowsOnly: true });
  if (kinds.has('famine') && meatReach(s)) live.push({ id: 'L2.famine.meat', claim: RULE['L2.famine.meat'].claim, rowsOnly: true });
  if (kinds.has('famine')) live.push({ id: 'L2.famine.work', claim: RULE['L2.famine.work'].claim });
  if (takes.includes(WAR_TAKES_IRON)) live.push({ id: 'L2.war.iron', claim: RULE['L2.war.iron'].claim, chip: RULE['L2.war.iron'].chip, chipHouse: RULE['L2.war.iron'].chipHouse, rowsOnly: true });
  if (takes.includes(WAR_TAKES_ANIMALS)) live.push({ id: 'L2.war.animals', claim: RULE['L2.war.animals'].claim, chip: RULE['L2.war.animals'].chip });
  if (!live.length) return [];
  const houses = liveInstitutions(s).filter((h) => h && typeof h.name === 'string');
  const byName = new Map(houses.map((h) => [h.name, h]));
  const markOf = (/** @type {'house'|'service'} */ k, /** @type {any} */ row) => (blind ? null : rowMarkText(s, k, row, crises));
  /** @type {ReturnType<typeof law2MarksInstances>} */
  const out = [];
  const said = (/** @type {RegExp} */ claim, /** @type {unknown} */ text) => sentences(String(text || '')).find((x) => claim.test(x) && !SELF_AWARE.test(x) && !MARK_LEAD.test(x)) || null;
  const push = (/** @type {string} */ rule, /** @type {'house'|'service'|'income'} */ kind, /** @type {string} */ row, /** @type {string} */ house, /** @type {string} */ line) => {
    const ex = EXCLUDED.find((e) => e.rule === rule && e.text.test(line));
    out.push({ rule, kind, row, house, line, excluded: ex ? ex.why : null });
  };
  for (const r of live) {
    for (const h of houses) {
      if (markOf('house', h)) continue;
      if (r.chipHouse && !r.chipHouse.test(h.name)) continue;
      const line = said(r.claim, h.desc);
      if (line) push(r.id, 'house', h.name, h.name, line);
    }
    for (const { svc } of serviceRowsOf(s.availableServices)) {
      if (!svc || typeof svc.name !== 'string') continue;
      const house = byName.get(String(svc.institution || ''));
      if (markOf('service', svc) || (house && markOf('house', house))) continue;
      if (r.chipHouse && !r.chipHouse.test(String(svc.institution || ''))) continue;
      const line = (r.chip && r.chip.test(svc.name) ? svc.name : null) || (r.claim.test(svc.name) ? svc.name : null) || said(r.claim, svc.desc);
      if (line) push(r.id, 'service', svc.name, String(svc.institution || ''), line);
    }
    for (const src of Array.isArray(s?.economicState?.incomeSources) ? s.economicState.incomeSources : []) {
      if (!blind && rowStoppedBy(s, 'income', src, crises)) continue;
      const line = said(r.claim, src?.desc);
      if (line) push(r.id, 'income', String(src?.source || ''), '', line);
    }
  }
  return out;
}
