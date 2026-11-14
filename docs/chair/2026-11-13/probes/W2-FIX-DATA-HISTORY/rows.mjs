// W2-FIX-DATA-HISTORY row counters over a births corpus: node rows.mjs <tree> <corpus.ndjson.gz> [--list name]
// Each probe reads the FINAL record through the tree's own fact homes (factsOf) and counts the towns where the row's
// sentence prints in the record while the town's facts make it false. Record-level: a page-composed line is read on dumps.
import { loadCorpus } from './load.mjs';
const TREE = process.argv[2]; const corpus = loadCorpus(process.argv[3]); const LIST = process.argv.indexOf('--list') > 0 ? process.argv[process.argv.indexOf('--list') + 1] : null;
const { factsOf } = await import(TREE + '/src/domain/facts/factsOf.js');
const SMALL = ['thorp', 'hamlet', 'village']; const TINY = ['thorp', 'hamlet'];
const crisisKinds = (s) => { try { return [...(factsOf(s).crisis?.kinds || [])]; } catch { return []; } };
const has = (s, k) => crisisKinds(s).includes(k);
const market = (s) => { try { return !!factsOf(s).market; } catch { return null; } };
const tl = (s) => s.history?.historicalEvents || []; const tens = (s) => s.history?.currentTensions || [];
const occOnTimeline = (s) => tl(s).some((e) => e.templateType === 'occupation_legacy');
const allHistoryText = (s) => [...tl(s).flatMap((e) => [e.description, ...(e.plotHooks || []), ...(e.lastingEffects || [])]), ...tens(s).flatMap((t) => [t.description, ...(t.plotHooks || []), ...(t.factions || [])])].filter((x) => typeof x === 'string');
const inst = (s) => (s.institutions || []).map((i) => String(i.name || ''));
const probes = {
  // L4 / ww-254,724,752,754,755,756: the occupation legacy's tension where the timeline holds no occupation
  occTensionNoOccOnTimeline: (s) => tens(s).some((t) => t.type === 'occupation_legacy') && !occOnTimeline(s),
  occTensionUnderOccupation: (s) => tens(s).some((t) => t.type === 'occupation_legacy') && has(s, 'occupied'),
  occTension: (s) => tens(s).some((t) => t.type === 'occupation_legacy'),
  occFormerOfficerUnderOccupation: (s) => has(s, 'occupied') && allHistoryText(s).some((x) => /former occupier officer/i.test(x)),
  occEndedLongAgoUnderOccupation: (s) => has(s, 'occupied') && allHistoryText(s).some((x) => /occupation ended long ago/i.test(x)),
  // ww-543 / ww-572 / census economic_disparity: merchants where the market home reads none
  merchantsNoMarket: (s) => market(s) === false && allHistoryText(s).some((x) => /\bmerchants?\b|merchant class/i.test(x)),
  econDisparityMerchNoMarket: (s) => market(s) === false && [...tl(s).filter((e) => e.templateType === 'economic_disparity'), ...tens(s).filter((t) => t.type === 'economic_disparity')].some((e) => [e.description, ...(e.plotHooks || [])].some((x) => /\bmerchants?\b|merchant class/i.test(String(x)))),
  tradeDisputeMerchNoMarket: (s) => market(s) === false && tens(s).some((t) => t.type === 'trade_dispute' && /merchant/i.test(t.description)),
  warehouseHook: (s) => allHistoryText(s).some((x) => /warehouse full of the scarce goods/i.test(x)) && !inst(s).some((n) => /warehouse|storehouse|granar/i.test(n)),
  // L4 size words (culture details) in small places
  orgNeighbourhoodsSmall: (s) => TINY.includes(s.tier) && JSON.stringify(s.culturalIdentity || '').includes('organized neighborhoods'),
  stagesOfExpansionSmall: (s) => SMALL.includes(s.tier) && JSON.stringify(s.culturalIdentity || '').includes('successive stages of expansion'),
  adminPrecinctSmall: (s) => SMALL.includes(s.tier) && JSON.stringify(s.culturalIdentity || '').includes('administrative precinct'),
  // arrival
  laneTradeSmall: (s) => SMALL.includes(s.tier) && String(s.arrivalScene || '').includes('Each lane seems to keep to its own trade'),
  freshPotsNoPotter: (s) => String(s.arrivalScene || '').includes('Fresh pots stand drying') && !inst(s).some((n) => /potter/i.test(n)),
  fishmongerNoMarket: (s) => String(s.arrivalScene || '').includes('A fishmonger shouts a price') && market(s) === false,
  // the Great Construction / resource events
  greatConstruction: (s) => tl(s).some((e) => e.name === 'The Great Construction'),
  greatConstrNoCathedralNoCivic: (s) => tl(s).some((e) => e.name === 'The Great Construction') && !inst(s).some((n) => /cathedral|town hall|city hall|guildhall|civic|court/i.test(n)),
  quarrymensGuildNoGuild: (s) => allHistoryText(s).some((x) => /Quarrymen's guild/i.test(x)) && !(() => { try { return factsOf(s).guild; } catch { return false; } })(),
  harvestCompactMerchantGuildsNoGuild: (s) => allHistoryText(s).some((x) => /merchant guilds negotiated/i.test(x)) && !(() => { try { return factsOf(s).guild; } catch { return false; } })(),
  arcaneDistrictSmall: (s) => SMALL.includes(s.tier) && allHistoryText(s).some((x) => /altering a district|Affected district/i.test(x)),
  // foodways
  herdingNoLivestock: (s) => /Herding and mixed farming/.test(String(s.economicState?.foodSecurity?.foodRecord?.foodwaysLine || '')) && !(s.economicState?.foodSecurity?.foodRecord?.foodSources || []).includes('livestock'),
  denseFoodways: (s) => /support dense populations/.test(String(s.economicState?.foodSecurity?.foodRecord?.foodwaysLine || '')) && (SMALL.includes(s.tier) || has(s, 'famine')),
  // ailing ruler
  ailingRuler: (s) => allHistoryText(s).some((x) => /ailing ruler/i.test(x)),
};
const only = LIST ? { [LIST]: probes[LIST] } : probes;
for (const [name, fn] of Object.entries(only)) {
  const hit = corpus.filter(({ s }) => { try { return fn(s); } catch { return false; } }).map((x) => x.seed);
  console.log(`${name}\t${hit.length}${LIST ? '\t' + hit.join(' ') : '\t' + hit.slice(0, 4).join(' ')}`);
}
