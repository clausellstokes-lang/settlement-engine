/**
 * npc/powerBand.js — the keyword band of a role (high / moderate / low), draw-free.
 *
 * A LEAF of npcGenerator.js (UK-CURE, SEAT-7 item 73: a line ceiling in the way is
 * cured by a leaf, never by packing). `powerBandOfRole` moved here VERBATIM in
 * behaviour, one statement per line; npcGenerator.js imports it for
 * `generateNPCPowerLevel` (which keeps the one `_rng()` draw) and re-exports it, so
 * `people/castPowers.js :: raiseToOfficeBand` and every test that imports it from
 * npcGenerator.js are untouched.
 */
import { seatsByHolder } from '../../domain/seat/seatLaw.js'; // UK (SEAT-6, a): the seat law's one reader, for powerBandOfRole's fold

export const powerBandOfRole = (role, config) => { // COHERENCE-POWERS-5 (N2): the keyword band, draw-free, read by people/castPowers.js :: raiseToOfficeBand (no config: the old law); UK (a): `config` is the born config (or a settlement carrying it)
  const HIGH_POWER = [
    'mayor',
    'lord',
    'governor',
    'bishop',
    'archmage',
    'guild_master',
    'captain',
    'commander',
    'crime lord',
  ];
  const MID_POWER = ['council_member', 'priest', 'wealthy_merchant', 'wizard', 'knight', 'magister', 'sergeant'];
  // UK (b), droppable: the stem beside 'wealthy_merchant', read ONLY under the seat law (a list of its own, so the old law's MID_POWER, and roleCategory.test.js's mirror of it, stay byte-identical)
  const MID_POWER_UNDER_LAW = ['wealthiest merchant'];
  // UK (a), PAGE-3 K1's fold (f4a434660) ONLY under the seat law: '_' and ' ' fold alike, both sides ('guild_master' meets 'Guild Master'); the old law reads as before, byte for byte
  const law = seatsByHolder(config);
  const fold = s => String(s || '').toLowerCase().replace(/_/g, ' ');
  const r = law ? fold(role) : String(role || '').toLowerCase();
  const has = kw => r.includes(law ? fold(kw) : kw);
  return HIGH_POWER.some(has) ? 'high' : MID_POWER.some(has) || (law && MID_POWER_UNDER_LAW.some(has)) ? 'moderate' : 'low';
};
