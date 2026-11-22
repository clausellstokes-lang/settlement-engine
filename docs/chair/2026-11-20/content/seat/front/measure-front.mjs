#!/usr/bin/env node
/**
 * docs/chair/2026-11-20/content/seat/front/measure-front.mjs — FRONT-MEASURE (SEAT-1's measuring seat, 2026-11-20).
 * Measures; changes nothing under src/. Births the two pools exactly as ../measure-holder.mjs does (same seeds, same
 * configs, birthConfig: today's births) and records, per town:
 *   (1) today's hidden allegiances (allegianceOf): by via, by vector, handler set or not, and whether the card is the
 *       face (the head) of a front-class house (institutionalCatalog.js :: frontClassOfInstitution), and of those, which
 *       hold rank 1 in any power;
 *   (2) the town's crime on record: criminal powers (allegiance.js :: criminalPowersOf; any, and independent of the
 *       seat), the black market share (economicState.safetyProfile.blackMarketCapture);
 *   (3) the ELIGIBLE PRINCIPAL heads: the face of a front-class legitimate house (not a criminal institution, not on an
 *       office shelf), passing the personality gate (corruption.js :: npcCorruptibleFlaw), not a criminal face
 *       (allegiance.js :: isCriminalFace); with the vector its flaw gives (willing = greed | hunger_for_status);
 *   (4) the seat: liveSeatCandidatesOf(s)[0], and the face of representatives.js :: dualHatHouseOf's house;
 *   (5) the capture probe: for a seat-eligible head, hallCaptureOf over the cast with HIS card given the proposed
 *       principal shape (handler null, house his own, via 'front'), under TODAY's rule (no capture branch exists).
 * The draw stand-in: u = sha256(`people-allegiance::principal-front::<seed>::<card id>`) first 32 bits / 2^32 (the
 * build would draw on the card's own keyed fork `people-allegiance::<card id>`, child 'principal-front'; this hash only
 * makes the executed count reproducible without touching src/).
 *
 *   node docs/chair/2026-11-20/content/seat/front/measure-front.mjs --arm default|presets [--n N]
 * Writes front-<arm>.json beside it (per-town rows; analyse-front.mjs turns both into FRONT-MEASURE.md's figures).
 */
import { writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '../../../../../..');
const imp = (p) => import(join(ROOT, p));
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { governingFactionOf, nameOf } = await imp('src/domain/rulingPower.js');
const { ARCHETYPES, archetypePatch } = await imp('src/components/generate/characterPresets.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const AL = await imp('src/domain/people/allegiance.js');
const { hallCaptureOf } = await imp('src/domain/people/hallCapture.js');
const { npcCorruptibleFlaw, corruptionVectorForFlaw, isCriminalInstitution } = await imp('src/domain/corruption.js');
const { frontClassOfInstitution, familyOfInstitution } = await imp('src/data/institutionalCatalog.js');
const { liveSeatCandidatesOf } = await imp('src/domain/dossier/powerStrata.js');
const { dualHatHouseOf } = await imp('src/generators/people/representatives.js');
const { captureClimateOf } = await imp('src/generators/power/rulingStructure.js');
const { membershipsOf } = await imp('src/domain/people/membership.js');

const args = process.argv.slice(2);
const argOf = (flag, fallback) => { const i = args.indexOf(flag); return i >= 0 && args[i + 1] != null ? args[i + 1] : fallback; };
const ARM = argOf('--arm', 'default');
const N = Number(argOf('--n', ARM === 'presets' ? 10 : 150));
await loadGenerationLawPayloads();
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const PRESETS = ARCHETYPES.map((a) => a.key).filter((k) => k !== 'balanced');
const JOBS = ARM === 'presets'
  ? TIERS.flatMap((tier) => PRESETS.flatMap((preset) => Array.from({ length: N }, (_, i) => ({ tier, preset, seed: `seat-measure-${tier}-${preset}-${i}`, config: { settType: tier, ...archetypePatch(preset) } }))))
  : TIERS.flatMap((tier) => Array.from({ length: N }, (_, i) => ({ tier, preset: null, seed: `seat-measure-${tier}-${i}`, config: { settType: tier } })));

const WILLING = new Set(['greed', 'hunger_for_status']);
const u01 = (label) => parseInt(createHash('sha256').update(label).digest('hex').slice(0, 8), 16) / 2 ** 32;
const bump = (m, k, by = 1) => { m[k] = (m[k] || 0) + by; };

const rows = [];
let errors = 0;
const t0 = Date.now();
for (const job of JOBS) {
  let s;
  try { s = generateSettlementPipeline(birthConfig(job.config), null, { seed: job.seed, customContent: {} }); } catch { errors += 1; continue; }
  const gov = governingFactionOf(s);
  const ruler = nameOf(gov) || null;
  const insts = Array.isArray(s.institutions) ? s.institutions : [];
  const houseByName = new Map(insts.map((h) => [String(h?.name || ''), h]));
  const crimHouses = new Map(AL.criminalHousesOf(s).map((h) => [String(h.name), h]));
  const crimPowers = AL.criminalPowersOf(s);
  const crimPowerNames = new Set(crimPowers.map((p) => nameOf(p)).filter(Boolean));
  const independent = crimPowers.filter((p) => nameOf(p) !== ruler).map((p) => nameOf(p));
  const bm = Number(s.economicState?.safetyProfile?.blackMarketCapture);
  const cards = Array.isArray(s.npcs) ? s.npcs : [];
  const seatCard = liveSeatCandidatesOf(s)[0] || null;
  const hat = gov ? dualHatHouseOf(insts, gov) : null;
  const hatName = hat ? String(hat.house?.name || '') : null;
  const hatFace = hatName ? cards.find((c) => c?.institution?.kind === 'house' && c.institution.key === hatName) || null : null;

  const frontHouseOf = (card) => {
    const inst = card?.institution;
    if (!inst || inst.kind !== 'house') return null;
    const house = houseByName.get(String(inst.key)) || { name: String(inst.key) };
    const fc = frontClassOfInstitution(house);
    if (!fc) return null;
    return { house, fc, crim: isCriminalInstitution(house), office: AL.OFFICE_SHELVES.includes(familyOfInstitution(house)?.shelf) };
  };
  const rank1 = (card) => membershipsOf(card).some((m) => m.rank === 1);

  // (1) today's allegiances
  const al = { total: 0, via: {}, vector: {}, handler: 0, noHandler: 0, frontHead: 0, frontHeadRank1: 0, frontHeadWilling: 0 };
  for (const c of cards) {
    const a = AL.allegianceOf(c);
    if (!a) continue;
    al.total += 1; bump(al.via, a.via); bump(al.vector, a.vector);
    if (a.handler) al.handler += 1; else al.noHandler += 1;
    const fh = frontHouseOf(c);
    if (fh && !fh.crim) { al.frontHead += 1; if (rank1(c)) al.frontHeadRank1 += 1; if (WILLING.has(a.vector)) al.frontHeadWilling += 1; }
  }

  // (3) eligible heads (gate, not a criminal face); the record of each
  const heads = [];
  let frontHeadsAll = 0; let frontHeadsCrim = 0; let frontHeadsOffice = 0;
  for (const c of cards) {
    const fh = frontHouseOf(c);
    if (!fh) continue;
    frontHeadsAll += 1;
    if (fh.crim) { frontHeadsCrim += 1; continue; }
    if (fh.office) { frontHeadsOffice += 1; continue; }
    if (c.ousted) continue;
    const flaw = npcCorruptibleFlaw(c);
    if (!flaw) continue;
    if (AL.isCriminalFace(c, crimHouses, crimPowerNames)) continue;
    const vector = corruptionVectorForFlaw(flaw);
    const id = String(c.id);
    heads.push({ id, house: String(c.institution.key), fc: fh.fc, flaw, vector, willing: WILLING.has(vector),
      agent: !!AL.allegianceOf(c), rank1: rank1(c), seat: !!seatCard && seatCard === c, hatFace: !!hatFace && hatFace === c,
      u: u01(`people-allegiance::principal-front::${job.seed}::${id}`) });
  }

  // (5) the capture probe for a seat-eligible head (today's rule; the proposed shape on his card)
  let probe = null;
  const seatHead = heads.find((h) => h.seat && h.willing);
  if (seatHead) {
    const climate = captureClimateOf(s);
    const before = hallCaptureOf(s, { npcs: cards, climate });
    const npcs = cards.map((c) => (String(c?.id) === seatHead.id
      ? { ...c, allegiance: { power: independent[0] || nameOf(crimPowers[0]) || null, house: seatHead.house, vector: seatHead.vector, via: 'front', handler: null, share: AL.ALLEGIANCE_TUNING.share, veiled: true, covert: true } }
      : c));
    const after = hallCaptureOf(s, { npcs, climate });
    probe = { stored: s.powerStructure?.criminalCaptureState || null, before: before.state, after: after.state, afterAgentRung: after.agentRung, agentScore: after.agentScore, underworld: after.underworld, receipt: after.receipt };
  }

  rows.push({ seed: job.seed, tier: job.tier, preset: job.preset, ruler, rulerCriminal: !!gov && AL.isCriminalPower(gov),
    crimPowers: crimPowers.length, independent: independent.length, bm: Number.isFinite(bm) ? bm : null,
    stored: s.powerStructure?.criminalCaptureState || null, cast: cards.length,
    seat: seatCard ? String(seatCard.id) : null, seatIsHatFace: !!seatCard && seatCard === hatFace, hatHouse: hatName, hatFace: hatFace ? String(hatFace.id) : null,
    frontHeadsAll, frontHeadsCrim, frontHeadsOffice, al, heads, probe });
}
const out = { meta: { script: 'docs/chair/2026-11-20/content/seat/front/measure-front.mjs', arm: ARM, n: N, towns: rows.length, errors, seconds: Math.round((Date.now() - t0) / 1000),
  draw: 'u = sha256("people-allegiance::principal-front::<seed>::<card id>")[0..8 hex] / 2^32' }, rows };
writeFileSync(join(HERE, `front-${ARM}.json`), `${JSON.stringify(out)}\n`);
process.stderr.write(`wrote front-${ARM} (${rows.length} towns, ${errors} errors, ${out.meta.seconds}s)\n`);
