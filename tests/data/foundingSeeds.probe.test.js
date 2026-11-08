/**
 * foundingSeeds.probe.test.js — R-2 CLAIMS-PARITY: each seed's synopsis proven.
 *
 * The editorial promise made testable. Every `receipts` line in the registry maps
 * to an assertion here: the seed is GENERATED (same seed + config ⇒ same world) and
 * the claimed dramatic elements are asserted present. If the generator drifts and a
 * claim no longer holds, THIS reds — the synopsis can never out-run what the engine
 * actually forges (the owner's claims-parity law).
 */
import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { archetypePatch, ARCHETYPES } from '../../src/components/generate/characterPresets.js';
import { FOUNDING_SEEDS, foundingSeedById } from '../../src/data/foundingSeeds.js';

/** Forge the settlement exactly as the store's basic forge does (randomSliderMode on). */
function forge(entry) {
  const cfg = { ...DEFAULT_CONFIG, settType: entry.settType, ...archetypePatch(entry.archetype), _randomizePriorities: true };
  return generateSettlementPipeline(cfg, null, { seed: entry.seed, customContent: {} });
}
const eventsOf = (t) => (Array.isArray(t.history?.historicalEvents) ? t.history.historicalEvents : []);
const goalsOf = (t) => (Array.isArray(t.npcs) ? t.npcs : []).filter((n) => n?.goal?.short).map((n) => n.goal.short);
const legitOf = (t) => t.powerStructure?.publicLegitimacy || {};
const instNamesOf = (t) => (Array.isArray(t.institutions) ? t.institutions : []).map((i) => i?.name || '');

describe('every founding seed forges deterministically', () => {
  for (const entry of FOUNDING_SEEDS) {
    it(`${entry.id} (${entry.seed}) is deterministic and valid`, () => {
      expect(archetypePatch(entry.archetype)).toBeTruthy();
      expect(ARCHETYPES.some((a) => a.key === entry.archetype)).toBe(true);
      const a = forge(entry);
      const b = forge(entry);
      expect(a.name).toBe(b.name);
      expect(a.population).toBe(b.population);
      expect(JSON.stringify(a.history)).toBe(JSON.stringify(b.history));
      expect(typeof a.name).toBe('string');
      expect(a.name.length).toBeGreaterThan(0);
    });
  }
});

describe('claims-parity — each synopsis is proven by the forged world', () => {
  it('THE CROWN THAT WILL NOT HOLD — a brewing coup in a legitimacy crisis', () => {
    const t = forge(foundingSeedById('the-contested-crown'));
    const legit = legitOf(t);
    // Receipt 1: Legitimacy Crisis, governance fractured.
    expect(legit.label).toBe('Legitimacy Crisis');
    expect(legit.governanceFractured).toBe(true);
    // Receipt 2: plague at its onset, a quarantine council among the factions. Re-stated 2026-11-06 with the
    // re-chosen seed (LANDING-7 G2, ruling R-G2): it replaces "a catastrophic siege within the last fifteen
    // years", crown-8826's incidental specific, which crown-3 does not forge (its siege is major, 28 years back).
    const stressTypes = (Array.isArray(t.stress) ? t.stress : [t.stress]).filter(Boolean).map((e) => e.type);
    expect(stressTypes).toContain('plague_onset');
    expect((t.powerStructure?.factions || []).map((f) => f.faction)).toContain('Quarantine Council');
    // Receipt 3: a figure formalising the independent authority the collapse created.
    // R11 unit 3 (73fa1a1e7, the 76 registry goals rewritten in the house register) re-worded the two rows this
    // receipt reads, same registry rows (npcStructure.js): 'Formalize the independent operational authority ...' ->
    // "Get their trade's new freedoms written down ..." and '... identify an exit before the gap between title and
    // authority ...' -> '... or find a quiet way out of it.'
    expect(goalsOf(t).some((g) => /new freedoms written down|find a quiet way out of it/i.test(g))).toBe(true);
    // THE SPECIFICS THE SYNOPSIS QUOTES, re-pinned 2026-11-06 (LANDING-7 G2, the chair's ruling R-G2: crown-3, the
    // first crown seed forging the essential story; the specifics follow its world). The mining town and the
    // siege ten years past were crown-8826's; crown-3's two are the plague (receipt 2 above) and the thieves' guild.
    // "A town of poor harvests": the food record reads short (past Secure).
    expect(['Pressured', 'Import-Dependent', 'Deficit', 'Deficit — Active Famine']).toContain(t.economicState?.foodSecurity?.label);
    // "Its guild council holds a title the streets no longer honour" (was a merchant oligarchy, crown-8826's).
    expect(t.powerStructure?.government).toBe('Guild Council');
    // "... and the thieves' guild already outweighs it": the Thieves' Guild outranks the governing faction on power.
    const governing = (t.powerStructure?.factions || []).find((f) => f.isGoverning);
    expect((t.powerStructure?.factions || []).find((f) => f.faction === "Thieves' Guild")?.power).toBeGreaterThan(governing?.power);
    // "that guild's master has begun, quietly, to write the authority ... into permanent ink": the coup is the
    // thieves' guild master's.
    // Re-keyed by identity with its cause (PEOPLE-2 CAST-DERIVED, 2026-11-07): the people car's cast has no
    // "Thieves Guild Master" role (M-1b: a role is its house's title; the guild's master is the face its powers
    // rank FIRST), so the master is the Thieves' Guild's rank-1 face, carrying the dominant fractured template.
    expect(Boolean(masterOf(t))).toBe(true);
  });

  it('THE MILL THAT OUTLIVED ITS WARS — a scarred survivor', () => {
    const t = forge(foundingSeedById('the-enduring-mill'));
    // Receipt 1: five or more MAJOR upheavals.
    expect(eventsOf(t).filter((e) => e.severity === 'major').length).toBeGreaterThanOrEqual(5);
    // Receipt 2: a major siege in its history.
    expect(eventsOf(t).some((e) => /siege/i.test(e.name) && e.severity === 'major')).toBe(true);
    // Receipt 3: grew from a single logging operation whose owner refused to leave.
    //
    // RE-VERIFIED 2026-09-30 (the urban band, ODQ §934.86). Same mechanism as the note below:
    // the founding reason is one draw from a pool the settlement's exports widen, and the
    // urban band gave this town new trades and so new exports, so the SAME draw now lands on
    // "grew from a single logging operation whose owner refused to leave when the contract
    // ended". Every other receipt is byte-identical: the six major upheavals (economic rift
    // to the siege 25 years ago), the mills (governance re-verified to 'Tolerated' 2026-10-01, below), and a riverside town on a river route,
    // so "this river town" still holds. The seed is kept and the founding clause re-verified, in
    // the synopsis and here. No besi- seed in 0-2999 forges all five original receipts.
    //
    // (The 2026-07-26 note, for the record:)
    // RE-VERIFIED 2026-07-26 (generation remediation). This receipt previously read
    // "founded on mill rights granted by an absent lord" and matched /mill/. The
    // founding reason moved, and the cause is UPSTREAM of the narrative lane:
    // the economy now derives its exports from availableNativeResourceKeys(config)
    // — the condition-filtered native roster (docs/GENERATION_CONTRACTS.md,
    // "Resource truth") — instead of the full display roster. This seed's
    // river_clay seam is depleted, so "Pottery and ceramics" no longer leads its
    // primaryExports; "River fish" does. deriveTradeCommodity therefore resolves
    // 'fish' where it resolved null at the committed base, which appends the
    // commodity founding hooks in genArrivalDetail and widens the reason pool from
    // 6 to 8 — so the SAME rng draw lands on a different, terrain-coherent hook.
    // Everything else this seed forges (name, population, every historical event,
    // foundedBy, initialChallenge, overcoming, legitimacy) is byte-identical to the
    // committed base, which is why only this one assertion moved. The new reason is
    // the truer one: the old roster's lead export came from an exhausted seam.
    expect(/single logging operation whose owner refused to leave/i.test(t.history?.founding?.reason || '')).toBe(true);
    // Receipt 4: the mills the title names are still standing. Added with the
    // re-verification above so the seed's title and synopsis keep a proven anchor
    // once the founding clause stopped carrying one (the claims-parity law).
    expect(instNamesOf(t).some((n) => /mill/i.test(n))).toBe(true);
    // Receipt 5: governance its people tolerate today. RE-VERIFIED 2026-10-01: the urban band's
    // final source moved besi-1's legitimacy from 'Approved' to 'Tolerated'; every other receipt
    // still holds, so the claim was re-verified to the forged world (synopsis line and receipt
    // with it) rather than the seed re-chosen.
    expect(legitOf(t).label).toBe('Tolerated');
  });

  it('THE ROT BENEATH THE ORE — contested authority, a recent uprising, criminal arrangements', () => {
    const t = forge(foundingSeedById('the-rot-beneath-the-ore'));
    // Receipt 1: contested legitimacy.
    expect(legitOf(t).label).toBe('Contested');
    // Receipt 2: an uprising of the first rank within the last fifteen years.
    expect(eventsOf(t).some((e) => /uprising/i.test(e.name) && e.severity === 'major' && e.yearsAgo <= 15)).toBe(true);
    // Receipt 3: a figure holding the line around criminal/informal arrangements.
    // R11 unit 3 (73fa1a1e7) re-worded the three rows this receipt reads, same registry rows (npcStructure.js):
    // '... the informal arrangements it depends on' -> 'Keep the seat running without crossing the people whose
    // payments keep it running.'; '... the criminal arrangements ...' -> 'Keep trading without paying the gangs ...';
    // '... the corrupt interests ...' -> '... the bribers or the inquiry.'
    expect(goalsOf(t).some((g) => /people whose payments keep it running|without paying the gangs|the bribers or the inquiry/i.test(g))).toBe(true);
  });
});

// ── LINK CLAIMS (LANDING-7 G3, the chair's ruling R-G3, 2026-11-06) ─────────────────────────────────────────
// A synopsis may join two facts with a causal word ONLY where the forged record holds the link: a record field
// that names one fact as the cause, trigger, consequence or reason of the other. The links are DATA beside the
// claims (`links` on the registry entry: cause fact, effect fact, the record field, the synopsis words that
// state it); each row is proven here by the forged world, like the facts. A row names a field from LINK_FIELDS
// below, and each field proves exactly one (cause → effect) pair, so a row cannot borrow another link's proof.

// The thieves' guild's master: the Thieves' Guild's rank-1 face (the people car: a role is its house's title, the
// master is the face the guild ranks first — re-keyed from the old "Guild Master" role, PEOPLE-2 CAST-DERIVED,
// 2026-11-07), whose goal is a power head's formalising template under fractured governance (the criminal or
// commercial dominant row of npcStructure.js). MERGE-CAR, re-keyed by identity with its cause: the rows' WORDING is the
// rung-2 landing's (R11, 73fa1a1e7: the formalising rows re-worded — the criminal "Take over whatever the seat has
// stopped watching, and dig in …", the commercial "Get their trade's new freedoms written down …"), the IDENTITY the car's.
const masterOf = (t) => (Array.isArray(t.npcs) ? t.npcs : []).find((n) => (n?.memberships || []).some((m) => m.power === "Thieves' Guild" && m.rank === 1)
  && /stopped watching, and dig in before it recovers|new freedoms written down/i.test(n?.goal?.short || ''));
const governingOf = (t) => (t.powerStructure?.factions || []).find((f) => f.isGoverning);
const thievesOf = (t) => (t.powerStructure?.factions || []).find((f) => f.faction === "Thieves' Guild");
/** The showcase story's six facts, each a predicate on the forged world (the same truths the claims above pin). */
const FACTS = {
  'poor harvests': (t) => ['Pressured', 'Import-Dependent', 'Deficit', 'Deficit — Active Famine'].includes(t.economicState?.foodSecurity?.label),
  plague: (t) => (Array.isArray(t.stress) ? t.stress : [t.stress]).filter(Boolean).some((e) => e.type === 'plague_onset'),
  'quarantine council': (t) => (t.powerStructure?.factions || []).some((f) => f.faction === 'Quarantine Council'),
  'title unhonoured': (t) => legitOf(t).label === 'Legitimacy Crisis' && legitOf(t).governanceFractured === true
    && t.powerStructure?.government === 'Guild Council' && governingOf(t)?.faction === 'Guild Council',
  'thieves outweigh': (t) => (thievesOf(t)?.power ?? -1) > (governingOf(t)?.power ?? Infinity),
  'master formalising': (t) => Boolean(masterOf(t)),
};

/**
 * The record fields that can hold a link, each proving ONE (cause → effect) pair on the forged world. A field
 * whose `holds` answers false is a link the town does not have; a synopsis row citing it reds.
 */
const LINK_FIELDS = {
  // foodBalance's plague branch cuts local production (×0.75) and writes the stress's consequence for food.
  'economicViability.issues[stress_consequence]': { cause: 'plague', effect: 'poor harvests',
    holds: (t) => (t.economicViability?.issues || []).some((i) => i?.type === 'stress_consequence'
      && i?.category === 'Food Supply' && /^The plague has killed or sickened many who work the fields\./.test(i?.message || '')) }, // re-keyed with the note's rewrite (W1 ECO second seat, 2026-11-07)
  // computePublicLegitimacy's safety term reads the safety label, whose strain is the plague's own.
  'powerStructure.publicLegitimacy.breakdown.safety': { cause: 'plague', effect: 'title unhonoured',
    holds: (t) => (legitOf(t).breakdown?.safety ?? 0) < 0
      && /Plague Conditions/.test(t.economicState?.safetyProfile?.safetyLabel || '') },
  // computePublicLegitimacy's food term reads the food label.
  'powerStructure.publicLegitimacy.breakdown.food': { cause: 'poor harvests', effect: 'title unhonoured',
    holds: (t) => (legitOf(t).breakdown?.food ?? 0) < 0 },
  // applyLegitimacyMultipliers: the crisis band's multipliers turn the raw order (the council ahead) into the
  // effective one (the guild ahead); the record keeps both.
  'factions[].rawPower→power × publicLegitimacy multipliers': { cause: 'title unhonoured', effect: 'thieves outweigh',
    holds: (t) => legitOf(t).govMultiplier < 1 && legitOf(t).crimMultiplier > 1
      && (governingOf(t)?.rawPower ?? -1) > (thievesOf(t)?.rawPower ?? Infinity)
      && (thievesOf(t)?.power ?? -1) > (governingOf(t)?.power ?? Infinity) },
  // npcStructure: the master's goal is the template of the settlement condition the record stamps on her.
  'npcs[].settlementCondition': { cause: 'title unhonoured', effect: 'master formalising',
    holds: (t) => masterOf(t)?.settlementCondition === 'governance_fractured' },
  // npcStructure: the master's standing, `head` (rank 1 of her first-rank power), with her power leading its category
  // within reach of the governing power, selects the formalising goal (the subordinate one only advances standing).
  'npcs[].structuralRank': { cause: 'thieves outweigh', effect: 'master formalising',
    holds: (t) => masterOf(t)?.structuralRank === 'head' },
  // The stressor's own trace: would hold "harvests → plague" if a cause named the food record. resolveStress runs
  // before the economy, so its causes name tier, threat and the stress generator.
  'simulationTrace[stressor.plague_onset].causes': { cause: 'poor harvests', effect: 'plague',
    holds: (t) => (Array.isArray(t.simulationTrace) ? t.simulationTrace : Object.values(t.simulationTrace || {}))
      .filter((e) => e?.targetId === 'stressor.plague_onset')
      .some((e) => (e.causes || []).some((c) => /food|harvest|grain/i.test(`${c?.source} ${c?.effect || ''}`))) },
  // The faction's own trace: would hold "plague → quarantine council" if a cause named the stressor.
  'simulationTrace[faction.quarantine_council].causes': { cause: 'plague', effect: 'quarantine council',
    holds: (t) => (Array.isArray(t.simulationTrace) ? t.simulationTrace : Object.values(t.simulationTrace || {}))
      .filter((e) => e?.targetId === 'faction.quarantine_council')
      .some((e) => (e.causes || []).some((c) => /stress|plague/i.test(`${c?.source} ${c?.reason || ''}`))) },
};

/** Words that make a causal or sequential claim; in a synopsis with links each must sit inside a link's words. */
const CAUSAL_WORDS = /\b(because|so|which|therefore|thus|since|hence|and now|newly|followed|between|lifted|handed)\b/gi;

describe('link claims — each connective in the synopsis is a link the forged record holds', () => {
  const entry = foundingSeedById('the-contested-crown');
  let world = null;
  const forged = () => (world ??= forge(entry));
  const links = Array.isArray(entry.links) ? entry.links : [];

  it('the entry declares its links', () => {
    expect(links.length).toBeGreaterThan(0);
  });

  for (const fact of Object.keys(FACTS)) {
    it(`fact: ${fact}`, () => {
      expect(FACTS[fact](forged())).toBe(true);
    });
  }

  for (const link of links) {
    it(`link: ${link.cause} → ${link.effect} (${link.field})`, () => {
      const t = forged();
      expect(entry.synopsis).toContain(link.words);
      expect(FACTS[link.cause]?.(t)).toBe(true);
      expect(FACTS[link.effect]?.(t)).toBe(true);
      const field = LINK_FIELDS[link.field];
      expect(field, `no record field "${link.field}"`).toBeTruthy();
      expect([field.cause, field.effect]).toEqual([link.cause, link.effect]);
      expect(field.holds(t), `the record does not hold ${link.cause} → ${link.effect}`).toBe(true);
    });
  }

  it('every causal word in the synopsis sits inside a declared link', () => {
    const spans = links.map((l) => [entry.synopsis.indexOf(l.words), entry.synopsis.indexOf(l.words) + l.words.length]);
    const loose = [...entry.synopsis.matchAll(CAUSAL_WORDS)]
      .filter((m) => !spans.some(([a, b]) => a >= 0 && m.index >= a && m.index < b))
      .map((m) => m[0]);
    expect(loose).toEqual([]);
  });
});
