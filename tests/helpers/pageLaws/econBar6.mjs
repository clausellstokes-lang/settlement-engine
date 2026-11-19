/**
 * econBar6.mjs — BAR6-ECON's rules of LAW 8 and LAW 9 (BRIEF-BAR6), read off a BORN RECORD and the leaves the Economics
 * tab and the economy desk print through. The page form of each rule is the auditors' (`law8.mjs` 8d.export, 8d.income,
 * 8e.open, 8e.svcOutput; `law9.mjs` 9b.subsistence, 9c.carts, 9c.no-imports, 9d.no-exports, 9a.hands), read over a census
 * dump; a test corpus carries births, not dumps, so this reads the same states off the record:
 *   8d.export     under a siege (`tradeStoppedHere`), an exportable service card whose export tag is not stopped;
 *   8e.svcOutput  a service card printed operational whose output names a service row the mark leaf marks for a crisis;
 *   8d.income     under a siege, an income share titled by a chain whose card prints impaired, with no mark;
 *   8e.open       under a siege, a house whose every service row the siege stops, drawn from "open but short of supplies";
 *   9b.subsistence the survival label printed under a Prosperity word of Comfortable or better;
 *   9c.carts      the food sentence's carrier "carts" where the record's channel is a teleportation circle or airships;
 *   9c.no-imports "No recorded imports." where the food row brings food in;
 *   9d.no-exports the partial-exploitation pool ("the raw material moves") where the printed export list holds nothing;
 *   9a.hands      DS-ECO-6's "same organised hands" variant drawable below an organised structure.
 * `blind: true` reads each card, share, label and key as the record gives it, before the leaves (the positive control).
 * Pure: no draw, no clock, no write.
 */
import { tradeStoppedHere, serviceStateShown, chainAsShown } from '../../../src/domain/display/chainStateShown.js';
import { serviceCardShown, incomeKindShown, chainCardUnderCrisis } from '../../../src/domain/display/economicsCrisisMarks.js';
import { rowStoppedBy, stoppingCrisesOf } from '../../../src/domain/display/crisisStoppedRow.js';
import { serviceRowsOf } from '../../../src/domain/dossier/entityLinks.js';
import { complexityLabelShown, COMPLEXITY_LABEL } from '../../../src/domain/display/labelBands.js';
import { foodCarriersShown, importsEmptyLineShown, tradeListsAsPrinted } from '../../../src/domain/display/tradeListDisplay.js';
import { carriersOf } from '../../../src/domain/display/foodCarrier.js';
import { foodRowShown } from '../../../src/domain/display/foodRowShown.js';
import { chainPrintName } from '../../../src/domain/display/chainPrintName.js';
import { leadingExploitation, exploitationPoolKey, partialUnderNoExport, houseStoppedWhole } from '../../../src/domain/display/stateProse/economyStateProse.js';
import { exploitationForDesk } from '../../../src/domain/display/validationOnPage.js';
import { PROSPERITY_WORDS } from '../../../src/domain/facts/factVocabulary.js';

const fold = (/** @type {unknown} */ x) => String(x ?? '').toLowerCase().replace(/[^a-z' ]+/g, ' ').replace(/\s+/g, ' ').trim();
const IMPAIRED_POOL = 'A CATEGORY PRESENT BUT ITS CHAIN IMPAIRED';
const PARTIAL_POOL = 'EXPLOITATION: partiallyExploited';

/**
 * @param {any} town a born settlement
 * @param {{ blind?: boolean }} [opt]
 * @returns {Array<{ rule: string, row: string }>}
 */
export function econBar6Instances(town, { blind = false } = {}) {
  /** @type {Array<{ rule: string, row: string }>} */
  const out = [];
  const eco = town?.economicState || {};
  const siege = tradeStoppedHere(town);
  const crises = stoppingCrisesOf(town);
  const rows = serviceRowsOf(town?.availableServices).map(({ svc }) => svc);
  // 8d.export, 8e.svcOutput: the service economy's cards
  for (const svc of eco.institutionalServices || []) {
    const card = blind ? { state: serviceStateShown(svc.institutions, new Set()), exportStopped: false } : serviceCardShown(town, svc, serviceStateShown(svc.institutions, new Set()));
    if (siege && svc.exportable === true && !card.exportStopped) out.push({ rule: '8d.export', row: String(svc.label) });
    const output = fold(svc.output);
    const stops = rows.some((row) => {
      const name = fold(row.name);
      return name.length >= 6 && ` ${output} `.includes(` ${name} `) && crises.some((c) => rowStoppedBy(town, 'service', row, [c]) !== null);
    });
    if (stops && card.state === 'operational') out.push({ rule: '8e.svcOutput', row: String(svc.label) });
  }
  // 8d.income: a share titled by a chain whose card prints impaired, under a siege
  if (siege) for (const src of eco.incomeSources || []) {
    const title = fold(src?.source);
    const impaired = (eco.activeChains || []).some((/** @type {any} */ c) => fold(chainPrintName(c, town)?.label) === title
      && String(chainCardUnderCrisis(town, c, chainAsShown(c, town))?.status ?? '') === 'impaired'
      && (['running', 'operational', 'entrepot', 'vulnerable'].includes(String(c.status)) || c.resourceDepleted === true)); // impaired by the siege, not by a cause of its own
    const kind = blind ? rowStoppedBy(town, 'income', src, crises) : incomeKindShown(town, src, crises);
    if (title && impaired && kind === null) out.push({ rule: '8d.income', row: String(src.source) });
  }
  // 8e.open: a house whose every service row the siege stops
  if (siege) {
    const houses = new Set(rows.map((r) => String(r.institution || '')).filter(Boolean));
    for (const house of houses) {
      const own = rows.filter((r) => r.institution === house);
      if (!own.every((r) => rowStoppedBy(town, 'service', r) === 'under_siege')) continue;
      const key = blind ? IMPAIRED_POOL : houseStoppedWhole(IMPAIRED_POOL, town, house);
      if (key === IMPAIRED_POOL) out.push({ rule: '8e.open', row: house });
    }
  }
  // 9b.subsistence
  const rank = PROSPERITY_WORDS.indexOf(String(eco.prosperity || '').trim().toLowerCase());
  const label = blind ? eco.economicComplexity : complexityLabelShown(eco);
  if (label === COMPLEXITY_LABEL.SUBSISTENCE && rank >= PROSPERITY_WORDS.indexOf('comfortable')) out.push({ rule: '9b.subsistence', row: String(label) });
  // 9c.carts
  const channel = town?.economicViability?.metrics?.foodBalance?.importChannel;
  const route = carriersOf(town, eco);
  const carriers = blind ? route : foodCarriersShown(route, channel);
  if (typeof channel === 'string' && /teleport|airship/i.test(channel) && /\bcarts\b/.test(carriers)) out.push({ rule: '9c.carts', row: channel });
  // 9c.no-imports
  const trade = tradeListsAsPrinted(town);
  const fb = foodRowShown(town, !!route)?.fb;
  if (!siege && trade.arriving.length === 0 && Number(fb?.importCoverage) > 0) {
    const line = blind ? 'No recorded imports.' : importsEmptyLineShown(fb);
    if (line === 'No recorded imports.') out.push({ rule: '9c.no-imports', row: line });
  }
  // 9d.no-exports
  const lead = leadingExploitation(/** @type {any} */ (exploitationForDesk(town)));
  if (lead && !siege && trade.exports.length === 0) {
    const key0 = exploitationPoolKey(lead.row, lead.bucket);
    const key = blind ? key0 : partialUnderNoExport(key0, town);
    if (key === PARTIAL_POOL) out.push({ rule: '9d.no-exports', row: String(lead.row?.rawResource) });
  }
  return out;
}
