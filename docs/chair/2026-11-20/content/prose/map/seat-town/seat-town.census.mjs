/**
 * seat-town.census.mjs — PROSE-3's measure of SEAT-SAID and TOWN-NOUN (brief MEASURE-SEAT-TOWN, 2026-11-20).
 * MEASURE ONLY. The birth is MAP-1's (`../map-birth.shared.mjs :: birthAndCompose`, unchanged and imported, not copied):
 * DEFAULT_CONFIG at the size, `birthConfig`, `generateSettlementPipeline(..., { seed, customContent: {} })`, then
 * `composePublicProse(town)`. The ONE instrument: `composePublicProse` is wrapped to keep a reference to the record it was
 * handed (the record is read, never changed; the composed prose is returned untouched). Everything printed is read off the
 * composed `publicProse.blocks` (the shared page's stored strings); the contest is read off the OWNER's record by
 * `rulingPowerCoup.js :: coupContenders` + `coupRiskLabel` exactly as `powerDeskRead.js :: powerDeskReadings` reads it.
 * Writes one JSON line per place to `<MAP_OUT>/seat.<MAP_WORKER>.jsonl`. Run ONLY through vitest.seat-town.config.mjs.
 */
import { test, vi } from 'vitest';
import { PLAN, OUT, birthAndCompose, appendFileSync } from '../map-birth.shared.mjs';
import { coupContenders, coupRiskLabel } from '../../../../../../../src/domain/rulingPowerCoup.js';
import { governingFactionOf, nameOf } from '../../../../../../../src/domain/rulingPower.js';
import { governanceAccountOf, governanceStressTypesOf, estrangedPowersOf } from '../../../../../../../src/domain/display/governanceAccount.js';
import { rulingChainOf } from '../../../../../../../src/domain/dossier/powerStrata.js';
import { publicVeiledRecordOf } from '../../../../../../../src/domain/display/publicSafe.js';
import { resolvePrimaryStress } from '../../../../../../../src/generators/stressPriority.js';
import { stabilityPoolKey } from '../../../../../../../src/domain/display/stateProse/powerStateProse.js';
import { isHideableHouse, isVeiledPower } from '../../../../../../../src/domain/people/cardVeil.js';
import { powerSentenceName } from '../../../../../../../src/domain/display/powerSentenceName.js';
import { DOSSIER_STATE_PROSE_POWER } from '../../../../../../../src/data/dossierStateProse/power.generated.js';

const rec = vi.hoisted(() => ({ town: null }));
vi.mock('../../../../../../../src/components/new/publicProseCompose.js', async (importOriginal) => {
  const orig = await importOriginal();
  return { ...orig, composePublicProse(settlement, gate) { rec.town = settlement; return orig.composePublicProse(settlement, gate); } };
});

const WORKER = process.env.MAP_WORKER || '0';
const str = (v) => (typeof v === 'string' ? v : '');

/** A shipped rung, its `{'@': site}` alias followed (publicProse.js :: aliasRepeatedRungs). */
function rungOf(blocks, site, key) {
  const r = blocks?.[site]?.[key];
  if (r && typeof r === 'object' && typeof r['@'] === 'string') return blocks?.[r['@']]?.[key] ?? null;
  return r ?? null;
}
/** The DS-POW-2 variant a printed header sentence is (each {slot} a lazy wildcard; case-insensitive for `headed`). */
function headerVidOf(sentence, key) {
  const pool = DOSSIER_STATE_PROSE_POWER['DS-POW-2']?.pools?.[key];
  if (!Array.isArray(pool) || !sentence) return null;
  const hit = pool.filter((v) => {
    const src = String(v.text).split(/(\{[^}]+\})/).map((t) => (t.startsWith('{') && t.endsWith('}') ? '[\\s\\S]*?'
      : t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\btown\b/gi, '(?:town|thorp|hamlet|village|city|metropolis)'))).join('');
    return new RegExp(`^${src}$`, 'i').test(sentence);
  });
  return hit.length === 1 ? hit[0].vid : hit.length ? `ambiguous:${hit.map((v) => v.vid).join('/')}` : 'unmatched';
}
/** Every string under the composed blocks with its path. */
function stringsOf(blocks) {
  const out = [];
  const walk = (v, path) => {
    if (typeof v === 'string') out.push({ path, s: v });
    else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
    else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, path ? `${path}.${k}` : k);
  };
  walk(blocks, '');
  return out;
}
/** The ruler's relationship rows with one other power, as written. */
function tiesBetween(record, a, b) {
  const rels = record?.powerStructure?.factionRelationships;
  return (Array.isArray(rels) ? rels : [])
    .filter((r) => Array.isArray(r?.pair) && r.pair.map(str).includes(a) && r.pair.map(str).includes(b))
    .map((r) => ({ type: r.type ?? null, captureState: r.captureState ?? null }));
}

for (const row of PLAN) {
  test(row.seed, async () => {
    rec.town = null;
    const prose = await birthAndCompose(row);
    const t = rec.town;
    if (!t) throw new Error(`no record captured for ${row.seed}`);
    const blocks = prose?.blocks || {};
    const ps = t.powerStructure || {};
    const stress = (Array.isArray(t.stress) ? t.stress : t.stress ? [t.stress] : []).map((x) => x?.type ?? String(x));
    const c = coupContenders(t);
    const label = coupRiskLabel(c);
    const first = c.challengers[0] || null;
    const veiled = publicVeiledRecordOf(t);
    const ownerChain = rulingChainOf(t);
    const veiledChain = rulingChainOf(veiled);
    const govOwner = str(ownerChain.power?.name);
    const govVeiled = str(veiledChain.power?.name);
    const account = governanceAccountOf(veiled, { primaryStress: resolvePrimaryStress(governanceStressTypesOf(veiled)) });
    const printedGov = str(blocks['power:governance']?.text);
    const header = rungOf(blocks, 'power:desk', 'stabilityHeader');
    const headerKey = stabilityPoolKey(ps.stability);
    const banner = rungOf(blocks, 'power:desk', 'legitimacyBanner');
    const risk = rungOf(blocks, 'power:desk', 'successionRisk');
    const factions = Array.isArray(ps.factions) ? ps.factions : [];
    const firstRow = first ? factions.find((f) => nameOf(f) === first.name) : null;
    const instRow = first ? (Array.isArray(t.institutions) ? t.institutions : []).find((i) => str(i?.name) === first.name) : null;
    const veiledFactions = Array.isArray(veiled?.powerStructure?.factions) ? veiled.powerStructure.factions : [];
    const lower = printedGov.toLowerCase();
    const out = {
      seed: row.seed, size: row.size, tier: t.tier ?? null, population: t.population ?? null, name: t.name ?? null,
      calm: !t.stress, stress,
      governing: governingFactionOf(t) ? nameOf(governingFactionOf(t)) : null, govOwner, govVeiled,
      legitimacy: ps.publicLegitimacy?.label ?? null, govMultiplier: ps.publicLegitimacy?.govMultiplier ?? null,
      label, gated: !!c.incumbent.gated, incWeight: c.incumbent.amplifiedWeight,
      // DARK AND LIT: the same reading over the record AFTER the public strip (what a desk on the player view would read)
      labelVeiled: coupRiskLabel(coupContenders(veiled)), firstVeiled: coupContenders(veiled).challengers[0]?.name ?? null,
      challengers: c.challengers.map((x) => ({ name: x.name, archetype: x.archetype, weight: x.weight })),
      stability: ps.stability ?? null, headerKey,
      header: header ? { glance: header.glance ?? null, sentence: header.sentence ?? null } : null,
      headerVid: header?.sentence ? headerVidOf(header.sentence, headerKey) : null,
      banner: banner ? { glance: banner.glance ?? null, sentence: banner.sentence ?? null } : null,
      risk: risk ? { glance: risk.glance ?? null, sentence: risk.sentence ?? null } : null,
      gov: printedGov || null,
      govRecomputedEqual: (account?.text ?? '') === printedGov,
      namesFirst: first ? lower.includes(first.name.toLowerCase()) : null,
      namesFirstProse: first ? lower.includes(powerSentenceName(first.name).replace(/^the /i, '').toLowerCase()) : null,
      atOdds: /\bat odds with\b/.test(printedGov),
      bargaining: /without bargaining with|bargaining with .* first|settles nothing large without bargaining/.test(printedGov),
      estrangedVeiled: account?.estranged ?? [],
      estrangedOwner: govOwner ? estrangedPowersOf(t, govOwner) : [],
      firstTieOwner: first && govOwner ? tiesBetween(t, govOwner, first.name) : [],
      firstTieVeiled: first && govVeiled ? tiesBetween(veiled, govVeiled, first.name) : [],
      firstInVeiled: first ? veiledFactions.some((f) => nameOf(f) === first.name) : null,
      firstHidden: firstRow ? firstRow.hidden === true : null,
      firstCategory: firstRow ? (firstRow.category ?? null) : null,
      firstHideableHouse: firstRow ? isHideableHouse(firstRow) : null,
      firstVeiledPower: firstRow ? isVeiledPower(firstRow) : null,
      firstInstHideable: instRow ? isHideableHouse(instRow) : null,
      townStrings: stringsOf(blocks).filter(({ s }) => /town/i.test(s)),
    };
    appendFileSync(`${OUT}/seat.${WORKER}.jsonl`, `${JSON.stringify(out)}\n`);
  }, 300000);
}
