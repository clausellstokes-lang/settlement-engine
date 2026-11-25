/**
 * holderTwoTakers.test.js — TWO TAKERS ON THE SERVED RECORD: THE SHARED PAGE NAMES NO HOLDER (VEIL-53 cures UNIT D; the
 * chair's RULING V16 of 2026-11-25, route (4), FAIL CLOSED; brief docs/chair/2026-11-24/tenth/veil/briefs/V53-CURES-V3-BRIEF.md
 * "UNIT D, RULED"; the cause REDSCAUSE (5) and the STOP probe docs/chair/2026-11-24/tenth/veil/out/v53/cures/D/d5.probe.test.js).
 *
 * THE PLANT (d5's construction, on born cities): two "power behind" edges on the seat (A first, B last) and the owner's
 * `powerStructure.recentConflict` naming A. That sentence is withheld on every shared read (registry `power.recentConflict`)
 * and the page re-derives the BASELINE, which names no transfer; the served document is the same whether the owner's sentence
 * names A or B (the probe: deep-equal). Before the cure `holderOfSeat.js :: transferTakerOf` fell to the LAST edge there, so
 * the shared page named B while the owner named A, and `rulingPowerCoup.js :: coupContenders` (the owner's audience, run on
 * the shared page too) dropped B from the contest as the seat's holder.
 *
 * THE ARMS:
 *   (1) the owner's read UNCHANGED: the record names A (and the twin, whose sentence names B, names B), by R1;
 *   (2) RED FIRST: the shared page (`toPublicSafe` -> `applyVeil(resolveVeil(defaultVeilFor))` -> `rederiveForPage`) names
 *       NO holder from the transfer, for the reader and for the engine's own (owner-audience) read of the page: R1, nobody;
 *   (3) NONE ANYWHERE on the page: `derivePowerStrata` names no ruler but the seat's form and no `seatOf`, and the contest
 *       removes no holder (`coupContenders` on the page equals its old-law list, which removes none);
 *   (4) control: with ONE taker's edge served, the shared page still names that taker (the fail-closed is not wider).
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { toPublicSafe } from '../../../src/domain/display/publicSafe.js';
import { applyVeil, resolveVeil, defaultVeilFor } from '../../../src/domain/display/galleryVeil.js';
import { rederiveForPage } from '../../../src/domain/veil/pageRederive.js';
import { holderOf } from '../../../src/domain/seat/holderOfSeat.js';
import { governingFactionOf, nameOf } from '../../../src/domain/rulingPower.js';
import { coupContenders } from '../../../src/domain/rulingPowerCoup.js';
import { derivePowerStrata } from '../../../src/domain/dossier/powerStrata.js';
import { isVeiledPower } from '../../../src/domain/people/cardVeil.js';
import { SEAT_LAW_CONFIG_KEY, HOLDER_SEAT_LAW_VERSION } from '../../../src/domain/seat/seatLaw.js';

const OWNER = { audience: 'owner' };
const READER = { audience: 'reader' };
const NOBODY = { rule: 'R1', holder: null, holderName: null };

/** The shared page, as the gallery's door builds it from the owner's record. */
const sharePage = (rec) => { const pub = toPublicSafe(rec); return rederiveForPage(applyVeil(pub, resolveVeil(defaultVeilFor(pub), null))); };

/** The edge `transferRulingPower` writes between the seat and its taker. */
const edge = (form, taker) => ({ pair: [form, taker], narrative: `${taker} is the power behind the ${form.toLowerCase()}. The seat answers to them now.`, type: 'competitive' });

/** d5's two born cities (r5-city-0, r5-city-1), under the seat law, with their form and two open powers A and B. */
const towns = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (let i = 0; i < 40 && towns.length < 2; i += 1) {
    const town = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'city' }), null, { seed: `r5-city-${i}`, customContent: {} });
    const gov = governingFactionOf(town); const form = nameOf(gov);
    const others = (town.powerStructure.factions || []).filter((f) => f !== gov && !isVeiledPower(f)).map(nameOf).filter(Boolean);
    if (others.length < 2) continue;
    town.config = { ...(town.config || {}), [SEAT_LAW_CONFIG_KEY]: HOLDER_SEAT_LAW_VERSION };
    towns.push({ seed: `r5-city-${i}`, town, form, A: others[0], B: others[1] });
  }
}, 600000);

/** The plant: both takers' edges (A first, B last) and the owner's sentence naming `named`. */
const plant = ({ town, form, A, B }, named, takers = [A, B]) => {
  const rec = structuredClone(town);
  rec.powerStructure.factionRelationships = [...(rec.powerStructure.factionRelationships || []), ...takers.map((t) => edge(form, t))];
  rec.powerStructure.recentConflict = `Power passed to ${named} by coup; the government now sits as a ${form.toLowerCase()}.`;
  return rec;
};

describe('RULING V16: two takers on the served record, the shared page names no holder (UNIT D)', () => {
  it('the plant is live: two born cities, each with a form and two open powers', () => {
    expect(towns.map((t) => t.seed)).toEqual(['r5-city-0', 'r5-city-1']);
  });

  it('(1) the owner\'s read is unchanged: the record names the taker its own sentence names (A; and B on the twin)', () => {
    for (const t of towns) {
      expect(holderOf(plant(t, t.A), OWNER), t.seed).toMatchObject({ rule: 'R1', holderName: t.A });
      expect(holderOf(plant(t, t.B), OWNER), t.seed).toMatchObject({ rule: 'R1', holderName: t.B });
    }
  });

  it('(2) the shared page names NO holder from the transfer: the reader, and the engine\'s own read of the page (R1, nobody)', () => {
    for (const t of towns) {
      const page = sharePage(plant(t, t.A));
      expect((page.powerStructure.factionRelationships || []).filter((r) => /is the power behind the/.test(String(r?.narrative))).length, `${t.seed}: both edges served`).toBe(2);
      expect(holderOf(page, READER), `${t.seed} reader`).toMatchObject(NOBODY);
      expect(holderOf(page, OWNER), `${t.seed} owner-audience on the page`).toMatchObject(NOBODY);
    }
  });

  it('(3) none anywhere on the page: the strata name only the seat\'s form as ruler and no seatOf; the contest removes no holder', () => {
    for (const t of towns) {
      const page = sharePage(plant(t, t.A));
      const strata = derivePowerStrata(page, READER);
      const rulers = strata.powers.filter((p) => p.role === 'ruler');
      expect(rulers.map((p) => p.name), t.seed).toEqual([t.form]);
      expect(rulers.some((p) => 'seatOf' in p), t.seed).toBe(false);
      const oldLaw = { ...page, config: { ...page.config, [SEAT_LAW_CONFIG_KEY]: 1 } };
      expect(coupContenders(page).challengers.map((c) => c.name), t.seed).toEqual(coupContenders(oldLaw).challengers.map((c) => c.name));
    }
  });

  it('(4) control: with ONE taker\'s edge served, the shared page still names that taker', () => {
    for (const t of towns) {
      const page = sharePage(plant(t, t.A, [t.A]));
      expect(holderOf(page, READER), t.seed).toMatchObject({ rule: 'R1', holderName: t.A });
    }
  });
});
