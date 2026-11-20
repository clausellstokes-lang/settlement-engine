/**
 * pageLaws/law1Band.mjs — LAW 1 · rule 1c-band/quiet: THE FOUNDATIONS' LAW-AND-ORDER WORD IN A QUIET PLACE (BAR5-BAND,
 * 2026-11-16; the chair's section "BAR5-BAND" of BRIEF-BAR5, ruling LB1, vetoable by the owner). In the form of
 * `law1.mjs` (BAR5-AUDIT seat A): a pure function over one town `{ record, tabs, town }` (`tabs`: the DOSSIER tabs,
 * `page.mjs :: dossierTabs`) that returns instances `{ law, town, tab, line, against, why, ... }`.
 *
 * THE RULE. The Foundations row prints "Law & order · Critical" or "· Collapsed" (the law has failed) on a page whose
 * own words say nothing of the kind: the Overview's Safety word is Moderate or better, no crisis is in force, no crime
 * wave stands among the live tensions, and no criminal power is strong enough to rival the law (the model's own
 * `criminal_power` term). The wide read of 2026-11-16 let four such rows STAND (bar0-hamlet-calm-rand-33, -36,
 * bar0-thorp-calm-rand-32: Critical; bar0-hamlet-calm-rand-34: Collapsed).
 *
 * NAMED EXCLUSION `office` (reported, not counted as the rule): the town keeps an office of the law (a court, a watch,
 * a magistrate: `institutionIsLawOrder` over the live roster, the reading `causalState.js :: deriveLawOrder` itself
 * uses). There the band is the model's reading of a law the town does keep; the ruling leaves it to the model (the
 * guard's third control: a place that keeps a watch keeps its band).
 * Pure; no I/O.
 */
import { institutionIsLawOrder } from '../../../src/domain/institutionClassify.js';
import { liveInstitutions } from '../../../src/domain/institutions/institutionRoster.js';
import { deriveSystemVariable } from '../../../src/domain/causalState.js';

/** The row as the Foundations print it (SubstrateTab.jsx: `<label> · <Band>`). */
export const LAW_ROW = /^Law & order · (Collapsed|Critical|Strained|Adequate|Surplus)$/;
/** The bands that say the law has failed. */
const FAILED = new Set(['Collapsed', 'Critical']);
/** The Overview's Safety words that say daily life is safe enough (the ladder's top three: bandLadders.js). */
export const QUIET_SAFETY = new Set(['Very Safe', 'Safe', 'Moderate']);

const arr = (v) => (Array.isArray(v) ? v : v ? [v] : []);
const crisesOf = (record) => new Set([...arr(record?.config?.stressTypes), ...arr(record?.stress).map((s) => s?.type)].filter(Boolean));

/** The Safety word the Overview prints: the line after the tag's own label "Safety". @param {Record<string,string[]>} tabs */
export function safetyWordOnPage(tabs) {
  const ls = tabs['Summary/Overview'] || [];
  const i = ls.findIndex((l) => l.trim() === 'Safety');
  return i >= 0 && i + 1 < ls.length ? ls[i + 1].trim() : null;
}

/** The facts the rule reads, for the runner's tables too. @param {any} record */
export function quietFactsOf(record) {
  const live = (() => { try { return liveInstitutions(record); } catch { return arr(record?.institutions); } })();
  const offices = live.filter((i) => institutionIsLawOrder(i)).map((i) => String(i?.name || i?.catalogId || ''));
  const crises = [...crisesOf(record)];
  const crimeWave = arr(record?.history?.currentTensions).some((t) => t?.type === 'crime_wave');
  let criminalPower = false;
  try { criminalPower = (deriveSystemVariable('law_order', record)?.contributors || []).some((c) => c?.effect === 'criminal_power'); } catch { /* none */ }
  return { offices, crises, crimeWave, criminalPower };
}

/** 1c-band/quiet. @param {{ record: any, tabs: Record<string,string[]>, town: string }} t */
export function law1cBand({ record, tabs, town }) {
  const out = [];
  const rowAt = Object.entries(tabs).flatMap(([tab, ls]) => ls.map((line) => ({ tab, line, m: LAW_ROW.exec(line.trim()) })).filter((x) => x.m));
  const h = rowAt.find((x) => x.tab === 'Summary/Foundations') || rowAt[0];
  if (!h || !FAILED.has(h.m[1])) return out;
  const safety = safetyWordOnPage(tabs);
  const f = quietFactsOf(record);
  if (!QUIET_SAFETY.has(String(safety)) || f.crises.length || f.crimeWave || f.criminalPower) return out;
  const law = f.offices.length ? '1c-band/quiet:office' : '1c-band/quiet';
  out.push({ law, town, tab: h.tab, line: h.line.trim(), band: h.m[1], tier: record?.tier ?? null, safety, offices: f.offices,
    against: { tab: 'Summary/Overview', line: `Safety ${safety}` },
    why: `the Foundations print the law ${h.m[1].toLowerCase()} on a quiet page (Safety ${safety}; no crisis, no crime wave, no criminal power)${f.offices.length ? `; NAMED EXCLUSION office: ${f.offices.join(', ')}` : ''}` });
  return out;
}

export const LAW1_BAND = { law1cBand };
