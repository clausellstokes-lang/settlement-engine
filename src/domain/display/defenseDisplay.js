/**
 * defenseDisplay — shared derivations for the Defense + Economics surfaces:
 * criminal-operation notes, criminal-structure classification, and supporting
 * capabilities. Single source consumed by BOTH the web tabs (DefenseTab,
 * EconomicsTab) and the PDF viewModel, so the printed dossier shows the same
 * full picture as the screen instead of a sparser subset.
 *
 * Pure functions of the settlement — no rendering, no side effects. Colors are
 * returned as hex object-values (not inline JSX style literals), which the
 * no-raw-color lint permits; PDF consumers feed them to react-pdf style props
 * as variables.
 */

import { buildThreatAssessment, disasterReadinessScore, healerSubject } from './threatAssessment.js';
import { HELD_STORES_WORDS, defenseFactsOf, foodEnduranceOf } from '../defense/defenseFacts.js';
import { numberWord } from './numberWords.js';
import { scoreBand, scoreColor, SCORE_BAND_CUTS } from './defenseScoreBands.js';
import { STRESS_TYPE_MAP } from '../../data/stressTypes.js';
import { magicWorksAt } from '../worldPulse/magicWorksAt.js';
import { magicPractitioners } from '../magicReliance.js';
import { crimeSignalOf } from '../crimeSignal.js';

// The active-military-status POSTURE per stress type. This DISPLAY text lives in
// this lazy display module — NOT in data/stressTypes.js, which sits in the eager
// first-paint `data` chunk (the constitutional closure ratchet forbids growing it,
// prior art: galleryMapsFilters.js). The COLOUR stays single-sourced from the
// producer (each stress type's own `colour`). The two walkers below pin this map
// to the producer's exact stress vocabulary so it can never fall behind again.
/** @type {Readonly<Record<string, string>>} */
const MILITARY_POSTURE = Object.freeze({
  under_siege:           'ACTIVE SIEGE',
  famine:                'INTERNAL PRESSURE',
  occupied:              'UNDER OCCUPATION',
  politically_fractured: 'COMMAND SPLIT',
  indebted:              'UNDER TRIBUTE',
  recently_betrayed:     'SECURITY COMPROMISED',
  infiltrated:           'INFILTRATION ACTIVE',
  plague_onset:          'QUARANTINE ACTIVE',
  succession_void:       'SUCCESSION CONTESTED',
  monster_pressure:      'BEAST PRESSURE',
  insurgency:            'INSURGENCY ACTIVE',
  religious_conversion:  'RELIGIOUS UPHEAVAL',
  slave_revolt:          'REVOLT ACTIVE',
  wartime:               'WAR FOOTING',
  mass_migration:        'MIGRATION SURGE',
});

/**
 * The ACTIVE-MILITARY-STATUS stress set (pdf-4) — the single source of truth for
 * which stressor types raise a military-status callout, and the posture + colour
 * shown for each. Consumed by BOTH the web DefenseTab and the PDF defenseSlice so
 * the printed dossier and the screen can never drift.
 *
 * Cycle-3 H3: this used to be a hand-maintained literal covering only 6 of the 15
 * stress types the generator emits, so a settlement under insurgency/slave_revolt/
 * wartime/monster_pressure/mass_migration/religious_conversion/indebted/
 * succession_void/infiltrated raised NO callout. It is now DERIVED over the
 * producer table (data/stressTypes.js STRESS_TYPE_MAP) — one entry per registered
 * stress type, colour from the producer, posture from MILITARY_POSTURE above — so
 * it covers EVERY type. The vocabularyTotality walker
 * (tests/lint/vocabularyTotality.walker.test.js) pins the key-set correspondence
 * and non-empty postures; the stress-type registration walker asserts full
 * coverage. Keyed by the stressor TYPE the engine emits (not an icon/key sentinel).
 * @type {Readonly<Record<string, { posture: string, colour: string }>>}
 */
export const DEFENSE_STRESS_STATUS = Object.freeze(
  Object.fromEntries(
    Object.entries(STRESS_TYPE_MAP).map(([type, data]) => [
      type,
      { posture: MILITARY_POSTURE[type], colour: data.colour },
    ]),
  ),
);

/**
 * One named force entry from defenseProfile.institutions.
 * @typedef {{ name?: string, desc?: string, source?: string }} ForceEntry
 */

/**
 * The (legacy, generator-shaped) settlement slice these display derivations
 * read. Structural — NOT the canonical schema shape (defenseProfile /
 * economicState live outside CanonicalSettlement today).
 * @typedef {Object} DefenseDisplaySettlement
 * @property {Array<{ name?: string }>} [institutions]
 * @property {{ scores?: Record<string, number>, economicGates?: Record<string, number>, institutions?: Record<string, ForceEntry[]> }} [defenseProfile]
 * @property {{ compound?: { inst?: Record<string, boolean> }, foodSecurity?: { resilienceScore?: number, stockpile?: { blockaded?: unknown, blockadeBypass?: string | null } | null }, safetyProfile?: { guardEffectivenessDesc?: unknown, criminalInstitutions?: unknown[] }, activeChains?: Array<{ needKey?: unknown, status?: unknown, chainId?: unknown } | null> }} [economicState]
 * @property {{ tradeRouteAccess?: string }} [config]
 * @property {Array<{ reason?: unknown, severity?: unknown }>} [structuralViolations]
 * @property {{ factions?: Array<{ category?: unknown } | null | undefined> }} [powerStructure] the roster `deriveCriminalStructure` reads for a criminal faction
 */

const DEFENSE_VULNERABILITY_RE = /fort|milit|wall|garrison|defense|guard|structural|survival/i;

/**
 * The guard assessment is authored by the safety-profile generator and is the
 * same prose the Defense screen already presents. Keep the derivation here so
 * every export surface reads the real producer instead of speculative root or
 * defenseProfile aliases.
 *
 * @param {DefenseDisplaySettlement | null | undefined} settlement
 * @returns {string | null}
 */
export function deriveGuardAssessment(settlement) {
  const value = settlement?.economicState?.safetyProfile?.guardEffectivenessDesc;
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

/**
 * First-survey defense vulnerabilities are the defense-related subset of the
 * structural validator's root receipt. Preserve each receipt row for screen
 * severity styling; export view models can project its `reason` to prose.
 *
 * @param {DefenseDisplaySettlement | null | undefined} settlement
 * @returns {Array<{ reason?: unknown, severity?: unknown }>}
 */
export function deriveDefenseVulnerabilities(settlement) {
  const rows = Array.isArray(settlement?.structuralViolations)
    ? settlement.structuralViolations
    : [];
  return rows.filter((row) => (
    typeof row?.reason === 'string'
    && DEFENSE_VULNERABILITY_RE.test(row.reason)
  ));
}

// scoreColor + scoreBand moved to display/defenseScoreBands.js (R-5b item #20)
// so OverviewTab / SummaryTab can read the SAME ladder without importing this
// module (and its threatAssessment dependency) into their chunks.

/**
 * Per-criminal-operation enforcement note (Defense-tab voice), keyed off the
 * institution name.
 *
 * @param {string | null | undefined} name
 * @returns {string}
 */
export function criminalOpNote(name) {
  const n = String(name || '').toLowerCase();
  if (n.includes("thieves' guild") || n.includes('thieves guild'))
    return 'Controls the criminal hierarchy. Suppresses random crime in exchange for predictable extraction. Deeply embedded in civic life.';
  if (n.includes('black market'))
    return 'Operates a parallel marketplace for contraband, stolen goods, and unlicensed services. Competes directly with legitimate merchants.';
  if (n.includes('smuggling'))
    return 'Moves goods around customs and guild charters. Corrupt officials, unofficial landing points, and false manifests.';
  if (n.includes('front business'))
    return 'Legitimate-looking operations used to launder criminal revenue and provide cover for illegal activities.';
  if (n.includes('gang') || n.includes('street'))
    return 'Controls specific territory through violence. Extorts local businesses. Competes with the watch for street-level authority.';
  if (n.includes('gambling'))
    return 'Operates unlicensed gambling. Revenue funds broader criminal network. Attracts debt spirals and desperation crime.';
  if (n.includes('underground'))
    return 'An entire secondary economy operating below street level. Beyond enforcement reach without extraordinary effort.';
  if (n.includes('assassin'))
    return 'Professional killing for hire. The existence of this market reflects deeply embedded political violence.';
  if (n.includes('fence'))
    return 'Moves stolen goods into legitimate circulation. The fence is the clearinghouse that makes theft economically viable.';
  return 'Criminal infrastructure with local territorial or economic influence.';
}

// `criminalOpEcon` LIVED HERE and was a passenger: this module never called it, while the
// economics tab imported it and nothing else from here — dragging 19.6 KB plus
// threatAssessment into that chunk for an eight-line string map. It is a CLASSIFIER, not a
// display concern, and now lives in `domain/criminalOpRole.js` as a pure leaf.

const CRIM_STRUCTURE_DATA = Object.freeze({
  organized: {
    key: 'organized', label: 'Organized Syndicate', color: '#8b1a1a', bg: '#fdf4f4',
    note: 'A structured criminal hierarchy controls what crime is permitted. Predictable rules, a hierarchy to negotiate with. Or cross. Random violence is suppressed because it draws enforcement. The real danger is systematic: protection, extortion, corruption of officials.',
  },
  'semi-organized': {
    key: 'semi-organized', label: 'Semi-Organized Networks', color: '#8a3010', bg: '#fdf0e8',
    note: 'Criminal activity is coordinated enough to maintain routes and territories but lacks a single controlling authority. Multiple factions may be competing. Less predictable than a guild, more structured than street crime.',
  },
  diffuse: {
    key: 'diffuse', label: 'Diffuse Criminal Presence', color: '#7a5010', bg: '#faf8e0',
    note: 'Opportunistic crime without organizational infrastructure. Fences, bandits, and minor operators work independently. Less politically dangerous but harder to suppress. No single node to threaten or buy off.',
  },
});

/**
 * Classify the settlement's criminal structure from its institution names.
 * Returns { key, label, color, bg, note } or null when there is no organized
 * criminal infrastructure.
 *
 * @param {DefenseDisplaySettlement | null | undefined} settlement
 * @returns {{ key: string, label: string, color: string, bg: string, note: string } | null}
 */
export function deriveCriminalStructure(settlement) {
  const r = settlement || {};
  const names = (r.institutions || []).map((i) => (i?.name || '').toLowerCase());
  const hasGuild = names.some((n) => n.includes("thieves' guild") || n.includes('thieves guild'));
  const hasSyndicate = names.some((n) => n.includes('multiple criminal') || n.includes('underground city') || n.includes('front business'));
  const hasSemiOrg = names.some((n) => n.includes('smuggling') || n.includes('black market') || n.includes('gambling'));
  const hasDiffuse = names.some((n) => n.includes('fence') || n.includes('bandit') || n.includes('outlaw'));
  // ⛔ "NOTHING ORGANIZED" IS A FINDING, SO IT IS NEVER READ BESIDE A NETWORK (lane RUNG1-TRUTH unit
  // E2, 2026-11-04; docs/SOAK_1000_RUNG1_2026-11-04.md §2 row 16, A-06; the chair's ruling 2). The
  // name ladder above knows neither "Street gang" nor "Underground network" and never reads the
  // power roster, so a town with a street gang (soak1k-759) and a place whose Thieves' Guild holds
  // power with no premises (soak1k-393) both read null, and DS-DEF-4 printed "No criminal
  // infrastructure has been identified". Where the ladder finds nothing, the roster's criminal
  // faction makes the structure ORGANIZED (a guild is a hierarchy, the pool's own reading of one),
  // and a house the estate's ONE criminal detector names (`corruption.js :: isCriminalInstitution`)
  // makes it SEMI-ORGANIZED (routes and territories, no single authority). Only the null answer
  // moves; no pool text changes.
  const ladder = hasGuild || hasSyndicate ? 'organized'
    : hasSemiOrg ? 'semi-organized'
      : hasDiffuse ? 'diffuse'
        : null;
  // (Lane RUNG1B-F4 unit 3: both facts are read from the crime signal's one home, `crimeSignal.js`.)
  const signal = crimeSignalOf({ seats: r.powerStructure?.factions, estate: r.institutions });
  // ⛔ NOR BESIDE ITS OWN LIST (lane RUNG1B-F9 unit 3, 2026-11-04; A-06 in reverse: soak1k-28
  // Innissike listed "Active criminal operations: Red Light District" and the Economics tab's
  // "Slave trade · Operational", then printed "No criminal infrastructure has been identified").
  // The block's operations list is the safety profile's `criminalInstitutions` (a label table the
  // one detector does not share), and a criminal supply chain that runs is routes and territory.
  // Either makes the null answer SEMI-ORGANIZED, the same reading a criminal house gets above.
  const listed = (r.economicState?.safetyProfile?.criminalInstitutions || []).length > 0
    || runningCriminalChains(r).length > 0;
  const key = ladder
    ?? (signal.factions.length ? 'organized'
      : signal.houses.length || listed ? 'semi-organized'
        : null);
  return key ? CRIM_STRUCTURE_DATA[key] : null;
}

/** The supply-chain statuses that mean a chain runs (`supplyChainStatus`, less vulnerable/impaired). */
const RUNNING_CHAIN_STATUS = Object.freeze(['operational', 'running', 'entrepot']);

/**
 * The criminal supply chains that run: the Economics tab's "Criminal supply chains" chips
 * (`needKey === 'criminal_economy'`) whose status is a working one.
 * @param {DefenseDisplaySettlement | null | undefined} settlement
 * @returns {Array<{ needKey?: unknown, status?: unknown, chainId?: unknown } | null>}
 */
export function runningCriminalChains(settlement) {
  const chains = settlement?.economicState?.activeChains;
  return (Array.isArray(chains) ? chains : [])
    .filter((c) => c?.needKey === 'criminal_economy' && RUNNING_CHAIN_STATUS.includes(String(c?.status ?? '')));
}

/**
 * DOES THE BLOCK LIST CRIME (RUNG-2 LANDING phase D, R-D2; F9's law extended)? The Defense
 * block's own lists: the operations (`safetyProfile.criminalInstitutions`), the running criminal
 * supply chains (`runningCriminalChains`) — F9's two — and the block's "Active crime patterns"
 * (`safetyProfile.crimeTypes`), which a crisis fills with its own operations (a religious
 * conversion's religious fraud and informant networks, soak1k-1801). The denial that nothing
 * criminal is organised here (DS-DEF-4's `structure null` pool, the tab's static line) prints only
 * where this is false: beside a listed pattern it is the contradiction F9 cured for the operations.
 * A pattern whose own text denies organisation (`patternDeniesOrganisation`, phase E) lists no
 * crime the denial contradicts, so it is not counted (R-E1).
 * @param {DefenseDisplaySettlement | null | undefined} settlement
 * @returns {boolean}
 */
export function blockListsCrime(settlement) {
  const sp = /** @type {{ crimeTypes?: unknown[], criminalInstitutions?: unknown[] } | undefined} */ (settlement?.economicState?.safetyProfile);
  return (sp?.criminalInstitutions || []).length > 0
    || (sp?.crimeTypes || []).some((pattern) => !patternDeniesOrganisation(pattern))
    || runningCriminalChains(settlement).length > 0;
}

/**
 * A CRIME PATTERN WHOSE OWN TEXT DENIES ORGANISATION (RUNG-2 LANDING phase E, R-E1). The denial
 * ("No criminal infrastructure has been identified") means no ORGANISED structure; beside such a
 * pattern it is true, and phase D's silence there (soak1k-362, -452, -572, -686, -740, -800,
 * -848, -884: "Background crime" alone) hid a true sentence. The pattern catalogue
 * (`generators/safetyProfile.js`, its crime types and every stress addition), read whole, holds
 * two texts that deny organisation in their own words, matched here by those words:
 *   - "Background crime": "… No single dominant organisation: just the steady pressure …";
 *   - "Survival crime" where no network exists: "Theft driven by economic desperation rather than
 *     organization. No criminal infrastructure: …" (beside a network the same type prints the
 *     desperation-theft line, which denies nothing, so the TEXT decides, not the type).
 * Every other pattern (a crisis's fraud, networks, black markets; lawlessness; smuggling) is crime
 * the denial would contradict.
 */
export const PATTERN_DENIES_ORGANISATION = /No single dominant organisation|No criminal infrastructure:/;

/**
 * @param {unknown} pattern one `safetyProfile.crimeTypes` entry, `{ type, desc }`
 * @returns {boolean}
 */
export function patternDeniesOrganisation(pattern) {
  const desc = /** @type {{ desc?: unknown } | null | undefined} */ (pattern)?.desc;
  return typeof desc === 'string' && PATTERN_DENIES_ORGANISATION.test(desc);
}

/**
 * Supporting-capabilities cards (economic backing, arcane support, legal, medical,
 * logistics, and naval when coastal). Computed from defense scores + institution
 * presence flags (economicState.compound.inst). Returns an array of
 * { label, status, color, score|null, note }.
 *
 * @param {DefenseDisplaySettlement | null | undefined} settlement
 * @returns {Array<{ label: string, status: string, color: string, score: number | null, note: string }>}
 */
export function deriveSupportingCapabilities(settlement) {
  const r = settlement || {};
  const d = r.defenseProfile || {};
  const scores = d.scores || {};
  const f = r.economicState?.compound?.inst || {};
  const econScore = Math.round(scores.economic || 0);
  // ⛔ T2-24 (UX consolidation 2026-10-30, red-first): IN A WORLD WHERE MAGIC DOES NOT
  // FUNCTION THERE IS NO ARCANE PROVISION TO HAVE. `hasMagicInst` is a roster regex, and an
  // alchemist matches it, so 84 of the 250 no-magic worlds in the corrected sample read
  // "Arcane Support: Present ... Detection, wards, counterspell." beside a Magic tab saying
  // magic does not function. The dial is asked of the estate's one accessor (wrapped as
  // `{ settlement }`, the call shape every caller uses; see defenseStateProse.js).
  //
  // ⛔ ONE PRACTITIONER CENSUS (lane DEFENSE-2, 2026-11-03, lane MAGIC's request). Presence is
  // `magicReliance.js :: magicPractitioners`, the census the Magic tab's reading counts: houses the
  // catalogue says practise, and people whose role says they practise (a Hedge Witch counts). The
  // roster regex `hasMagicInst` printed "No arcane practitioners on the rolls" in a village the
  // Magic tab read as integral. The row itself is dropped where magic does not work, by the same
  // predicate the dossier's gate (`dossierViewModel.js :: magicRowsGated`) asks, `magicWorksAt`.
  // The gate is not imported: dossierViewModel's closure would add ~826 KB to the Defense desk's,
  // past ARCH §5.3's refusal precedent; lifting the gate into a light leaf is a request.
  const practitioners = magicPractitioners(
    /** @type {import('../magicReliance.js').MagicRelianceSource} */ (/** @type {unknown} */ (r)),
  );
  const arcane = practitioners.length > 0;
  // The one set of defence facts (lane DEFENSE): a hospital only where one stands, and a
  // healer named as a healer.
  const facts = defenseFactsOf(r);

  const caps = [
    {
      // ⛔⛔ ONE NUMBER, ONE SET OF CUT POINTS (ODQ §934.14, the owner's ruling on the two
      // ladders). This row grades `scores.economic` in its own four words, and the shared
      // band ladder grades the SAME number in the four readiness words — so the two are one
      // ladder wearing two vocabularies, and they must cut in the same places or the tab
      // contradicts itself. They did not: this row turned Critical below 25 and the band
      // ladder turns Critical below 20, so at econScore 20-24 the capability row printed
      // "Critical" while the Threat Assessment and the Overview printed "Weak" off the same
      // score. DefenseTab's `STATUS_IS_THE_GRADE` fold hid the pair on THIS row by dropping
      // its band, but the disagreement was never local to the row — the other two surfaces
      // went on reading the other verdict.
      //
      // THE BAND LADDER IS CANONICAL, so the cut points come from it and the WORDS stay
      // this row's own: Well-funded ⇔ Strong, Adequate ⇔ Adequate, Underfunded ⇔ Weak,
      // Critical ⇔ Critical, at every integer 0-100. `SCORE_BAND_CUTS` is READ rather than
      // restated, which is the whole point of the fix: a future move of the band ladder
      // carries this row with it instead of leaving it behind a second time.
      //
      // ⚠ THE NOTE FOLLOWS THE SAME CUT, deliberately. It is a fourth place the grade
      // lands (DefenseTab stands the status pill down when the note opens on the grade), so
      // a note that changed at a different score would re-open the defect one line lower.
      label: 'Economic Backing',
      status: econScore >= SCORE_BAND_CUTS.strong ? 'Well-funded'
        : econScore >= SCORE_BAND_CUTS.adequate ? 'Adequate'
          : econScore >= SCORE_BAND_CUTS.weak ? 'Underfunded' : 'Critical',
      color: scoreColor(econScore), score: econScore,
      note: econScore >= SCORE_BAND_CUTS.strong ? 'Full pay, maintained equipment, reserve capacity.'
        : econScore >= SCORE_BAND_CUTS.adequate ? 'Adequate upkeep, some shortfalls.'
          : econScore >= SCORE_BAND_CUTS.weak ? 'Irregular pay, worn equipment, morale risk.'
            : 'Cannot sustain forces. Systemic breakdown.',
    },
    {
      // ⛔⛔ THE LABEL IS THE QUESTION THIS ROW ASKS, AND IT IS NOT THE OVERVIEW'S QUESTION
      // (review 10, 2026-09-18). It was called `Magical Capability`, which is also the name
      // of the Overview's Systems Health row — and the two read different facts. THIS row
      // is a NARROW presence read: is anyone practising? (Since lane DEFENSE-2 it asks the
      // practitioner census, `magicReliance.js :: magicPractitioners`; it used to ask the roster
      // regex `compound.inst.hasMagicInst`.) The Overview's row bands `scores.magical`, which
      // `defenseGenerator` drives from the WORLD MAGIC SLIDER over a much wider presence
      // (healer, monastery, cathedral, druid, divine, healing all count), so a town with no
      // arcane institution at all can score 49 there. One name over two facts produced the
      // defect the review measured: "None" printed in amber beside a half-full bar on 27 of
      // 144 large settlements. Two facts, two names — this one is ARCANE SUPPORT, which is
      // the only thing a presence read can answer, and the Overview keeps the other name.
      //
      // ⛔ AND THE STATUS SAYS SOMETHING THE LABEL DOES NOT (the owner's fold of lane 6's
      // capability row). After the rename the row printed "Arcane Support · Arcane support ·
      // <band>" — the status word had become the LABEL, differing only in a capital, which is
      // the same row saying one thing twice that the Economic Backing fold exists to stop. The
      // presence vocabulary is therefore `Present` / `None`: the label names the FACT the row
      // reads and the status answers WHETHER it is here, so the two words carry two readings
      // and the band beside them carries the third. The note text is untouched.
      label: 'Arcane Support',
      status: arcane ? 'Present' : 'None',
      // A PRESENCE READ HAS NO MAGNITUDE, which is the shape THIS LIST ALREADY USES for
      // every other one. Legal Infrastructure, Medical Readiness and Logistics & Supply all
      // carry `score: null` and render no bar, because "is there a court" has no size. So
      // does this row when the answer is no, and `scores.magical` is untouched either way —
      // the Overview's Systems Health row still bands it, because THAT row is labelled by
      // the score and not by the institution.
      color: arcane ? '#5a2a8a' : '#9c8068', score: arcane ? (scores.magical || 0) : null,
      // ⚠ THE NOTE ANSWERS THE SAME NARROW QUESTION THE LABEL DOES. It used to say
      // "Conventional defense only. Invisible threats go undetected and unanswered." — a
      // claim about the settlement's WHOLE magical posture, which this flag cannot make: a
      // cathedral is not arcane, and a town with a cathedral, a healer and no wizard reads
      // `hasMagicInst === false` while being anything but conventional. The note now says
      // what is missing (arcane practitioners) and what follows from that specifically.
      note: arcane
        ? `${practitioners.slice(0, 2).join(', ')}. Detection, wards, counterspell.`
        : 'No arcane practitioners on the rolls. Wards, detection and counterspell are beyond this settlement.',
    },
    {
      label: 'Legal Infrastructure',
      status: f.hasCourtSystem && f.hasPrison ? 'Court + Prison' : f.hasCourtSystem ? 'Court only' : f.hasPrison ? 'Prison only' : 'None',
      color: f.hasCourtSystem && f.hasPrison ? '#1a3a5a' : f.hasCourtSystem ? '#3a5a7a' : f.hasPrison ? '#7a5a3a' : '#9c8068', score: null,
      note: f.hasCourtSystem && f.hasPrison ? 'Full enforcement chain. Arrest, prosecute, detain.' : f.hasCourtSystem ? 'Courts without detention. Fines and exile only.' : f.hasPrison ? 'Detention without process. Arbitrary enforcement.' : 'No deterrence beyond force.',
    },
    {
      label: 'Medical Readiness',
      status: facts.hasHospital ? 'Hospital present'
        : facts.hasHealer ? (healerSubject(facts.healerName) === 'A healer' ? 'Healer' : 'Infirmary')
          : f.hasChurch ? 'Clergy care' : 'None',
      color: facts.hasHospital ? '#1a5a28' : (facts.hasHealer || f.hasChurch) ? '#7a5010' : '#8b1a1a', score: null,
      note: facts.hasHospital ? 'Casualty treatment, outbreak containment, recovery capacity.'
        : facts.hasHealer ? `${facts.healerName}. Wounds and fevers treated one at a time; no beds to contain an outbreak.`
          : f.hasChurch ? 'Clerical care. Basic wound and disease management.' : 'No dedicated healers. Plague burns unchecked.',
    },
    // ⛔ THE LOGISTICS & SUPPLY ROW IS GONE FROM THE DEFENSE SURFACES (the owner's word,
    // 2026-11-03: "Do add storehouse months the economy tab."). It was the granary read; stored
    // food is printed once, in months, on the Economy tab, and no Defense surface prints it.
  ];
  if (f.hasNavy || f.hasPort) {
    // experience-product-fit-5: the STANDING naval reality, not just the static
    // institution boolean — when a hostile fleet blockades the port RIGHT NOW,
    // the note reflects it (the live `blockaded` flag is written each pulse and
    // is only set while the naval layer is lit, so this is dormant-off-safe). This
    // reuses the food-stockpile blockade-relief plumbing (deriveBlockadeRelief).
    const sp = r.economicState?.foodSecurity?.stockpile || null;
    const blockaded = !!(sp && sp.blockaded);
    const bypass = (sp && sp.blockadeBypass) || null;
    caps.push({
      label: 'Naval Defense',
      status: blockaded ? 'Under blockade' : f.hasNavy ? 'Naval force' : 'Port only',
      color: blockaded ? '#8b1a1a' : f.hasNavy ? '#1a3a6a' : '#3a5a7a', score: null,
      note: blockaded
        ? (bypass === 'teleport'
            ? 'A hostile fleet blockades the sea approaches. Only a teleportation circle still runs supply past it.'
            : bypass === 'airship'
              ? 'A hostile fleet blockades the sea approaches. Airships run the blockade, impaired by siege countermeasures.'
              : 'A hostile fleet blockades the sea approaches. The port is choked, and no magical channel runs the line.')
        : f.hasNavy
          ? 'Naval force controls sea approaches. Amphibious assault requires fleet superiority.'
          : 'Port facility but no naval force. Sea approaches are accessible to any vessel.',
    });
  }
  // The Arcane Support row is the list's one magic row.
  return magicWorksAt({ settlement: r }) === false ? caps.filter((c) => c.label !== 'Arcane Support') : caps;
}

/**
 * "the palisade", "the citizen militia and the adventurers' charter hall" — the roster names of
 * what the defence purse pays for, in running prose.
 * @param {ReadonlyArray<string>} names
 * @returns {string}
 */
function namedForUpkeep(names) {
  const items = names.map((n) => `the ${n.charAt(0).toLowerCase()}${n.slice(1)}`);
  if (items.length <= 1) return items[0] || '';
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

// Which defenseProfile.economicGates key funds each readiness row, and what
// the underfunded expense is called in the funding note. ⚠ THE MILITARY GATE IS RECORDED
// FOR ANY DEFENCE AT ALL (walls, militia, watch, hired swords, a charter hall —
// `defenseGenerator.js :: computeDefenseScores`, `hasAnyDefense`), so its expense is
// "defence upkeep", and `deriveDefenseReadiness` names the things upkept from the roster;
// "garrison pay" for a palisade was the contradiction this replaced (lane DEFENSE).
/** @type {Readonly<Record<string, [string, string]>>} */
const READINESS_GATE_FOR = Object.freeze({
  'Beasts & Monsters': ['monster', 'patrol provisioning'],
  'Invasion & War': ['military', 'defence upkeep'],
  'Internal Security': ['internal', 'watch and court funding'],
  'Economic Survival': ['economic', 'crisis logistics'],
  'Disasters & Famine': ['disaster', 'relief funding'],
});

/**
 * Defense-readiness rows — the threat assessment reframed as "how ready is the
 * settlement against each pressure" (higher = better defended). Wraps the
 * generator's buildThreatAssessment (the assessment prose) with the readiness
 * score + STRONG/ADEQUATE/WEAK/CRITICAL badge, exactly as the web Defense tab.
 * When the row's economic-upkeep gate (defenseProfile.economicGates) sits
 * below ×1.0, fundingNote attributes the shortfall ("Upkeep underfunded: defence
 * upkeep for the palisade at 60%") instead of leaving a silently lower bar.
 * Returns [{ label, score, status, statusColor, barColor, assess, fundingNote }].
 *
 * @param {DefenseDisplaySettlement | null | undefined} settlement
 * @returns {Array<{ label: string, score: number, status: string, statusColor: string, barColor: string, assess: string, fundingNote: string | null }>}
 */
export function deriveDefenseReadiness(settlement) {
  const r = settlement || {};
  const scores = r.defenseProfile?.scores || {};
  const gates = r.defenseProfile?.economicGates || {};
  /** @type {Record<string, number>} */
  const scoreFor = {
    'Beasts & Monsters': scores.monster || 0,
    'Invasion & War': scores.military || 0,
    'Internal Security': scores.internal || 0,
    'Economic Survival': scores.economic || 0,
    // F9 unit 1: the row's one score, held to Weak under an active famine (threatAssessment.js).
    'Disasters & Famine': disasterReadinessScore(r),
  };
  const upkept = namedForUpkeep(defenseFactsOf(r).defenceNames);
  return buildThreatAssessment(r).map((row) => {
    const score = scoreFor[row.label] ?? 0;
    const [gateKey, baseExpense] = READINESS_GATE_FOR[row.label] || [];
    const expense = gateKey === 'military' && upkept ? `${baseExpense} for ${upkept}` : baseExpense;
    const gate = gateKey ? gates[gateKey] : undefined;
    const fundingNote = Number.isFinite(gate) && /** @type {number} */ (gate) < 1
      ? `Upkeep underfunded: ${expense} at ${Math.round(/** @type {number} */ (gate) * 100)}%`
      : null;
    return {
      label: row.label,
      score,
      status: scoreBand(score),
      statusColor: scoreColor(score),
      barColor: row.color,
      assess: row.assess,
      fundingNote,
    };
  });
}

/** @type {(arr: ForceEntry[] | null | undefined) => ForceEntry[]} */
const dedupByName = (arr) => [...new Map((arr || []).map((m) => [m?.name, m])).values()];

/**
 * The arcane-defense force group, gated on the world's magic dial (VERIFIER STOP-2, T2-24's
 * second reader). `magicDef` is filed by the same roster regex as `hasMagicInst`, so an
 * alchemist shop or quarter lands in it; where magic does not function there is no arcane
 * defense to field, and the group is empty on the screen, in print and in the Foundry journal.
 *
 * @param {DefenseDisplaySettlement | null | undefined} settlement
 * @returns {ForceEntry[]}
 */
export function arcaneDefenseOf(settlement) {
  const magicDef = settlement?.defenseProfile?.institutions?.magicDef || [];
  if (!magicDef.length) return magicDef;
  return magicWorksAt({ settlement: settlement || {} }) === false ? [] : magicDef;
}

/**
 * Armed forces grouped the way the web Defense tab presents them: fortifications,
 * standing forces (garrison + militia + watch, de-duplicated by name),
 * contracted (mercenary), monster-response charter, and arcane defense. Each
 * entry is a force object { name, desc, source } from defenseProfile.institutions.
 *
 * @param {DefenseDisplaySettlement | null | undefined} settlement
 * @returns {{ fortifications: ForceEntry[], standing: ForceEntry[], contracted: ForceEntry[], charter: ForceEntry[], arcane: ForceEntry[] }}
 */
export function deriveArmedForces(settlement) {
  const inst = settlement?.defenseProfile?.institutions || {};
  return {
    fortifications: inst.walls || [],
    standing: dedupByName([...(inst.garrison || []), ...(inst.militia || []), ...(inst.watch || [])]),
    contracted: inst.mercenary || [],
    charter: inst.charter || [],
    arcane: arcaneDefenseOf(settlement),
  };
}

// ── FOOD ENDURANCE, THE LINE (lane DEFENSE-3, X-52, 2026-11-03) ─────────────────────────
// The owner: "call it food endurance rather than siege endurance". ONE sentence, read by the
// Defense tab and by the PDF's defence chapter alike, from `defenseFacts.js :: foodEnduranceOf`
// (which reads the one food record). The figures are said in words; no digit is minted.

/** The line's label, one spelling for both readers. */
export const FOOD_ENDURANCE_LABEL = 'Food endurance';

/**
 * The door from the line to the Economy tab's stores row, where the months in store are
 * printed once. `anchor` is `entityLinks.js :: entityAnchor('stores', { id })`, spelled as a
 * literal so this display leaf takes no import for it (the test holds the two equal); the
 * Economy tab's stores row carries it as its element id.
 */
export const FOOD_STORES_DOOR = Object.freeze({
  id: 'economy.food-stores',
  type: 'stores',
  anchor: 'dossier-stores-economy-food-stores',
});

const TIER_NOUNS = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);

/** A length of time in plain words, never a decimal. Under seven weeks it is said in weeks.
 * @param {number} months @returns {string} */
function monthsInWords(months) {
  const weeks = Math.round((months * 52) / 12);
  if (weeks <= 3) return 'a few weeks';
  if (weeks <= 6) return 'about a month';
  const whole = Math.round(months);
  if (whole < 12) return `about ${numberWord(whole)} months`;
  if (whole === 12) return 'about a year';
  return whole < 24 ? 'more than a year' : 'more than two years';
}

/**
 * THE FOOD ENDURANCE LINE: what the stores mean under siege, in words. `door` is the words
 * that name the stores (the granary, or household stores where none stands); the tab makes
 * them the door to the Economy tab's stores row, the PDF prints `sentence` whole.
 *
 * @param {{ tier?: unknown, economicState?: unknown } | null | undefined} settlement
 * @returns {{ label: string, before: string, door: string, after: string, sentence: string } | null}
 */
export function foodEnduranceLine(settlement) {
  const end = foodEnduranceOf(settlement);
  if (!end) return null;
  const tier = typeof settlement?.tier === 'string' ? settlement.tier : '';
  const noun = TIER_NOUNS.includes(tier) ? tier : 'place';
  const opening = end.besieged ? 'the siege has taken the outlying fields' : 'under siege the outlying fields are lost';
  const lead = end.hasGranary
    ? `${opening.charAt(0).toUpperCase()}${opening.slice(1)}`
    : `No granary: ${opening}`;
  /** @type {string} */
  let before;
  /** @type {string} */
  let door;
  /** @type {string} */
  let after;
  // The rung-2 window (F13 FAMINE-STORES): where an active famine holds the granary shut
  // (`storesHeld`), the line says so in the stores words' one home and never says the held
  // granary simply carries the place.
  const held = end.storesHeld ? `, but ${HELD_STORES_WORDS} it` : '';
  if (end.fullRationMonths === null) {
    before = `${lead}, but what the ${noun} still grows feeds it at full rations; `;
    door = end.hasGranary ? 'the granary' : 'its household stores';
    after = end.hasGranary ? ` stands in reserve${held}.` : ' stand in reserve.';
  } else {
    const stretched = end.keptShare > 0 ? 'with what is still harvested, ' : '';
    const half = end.halfRationMonths === null
      ? '; on half rations the harvest alone is enough'
      : `, ${monthsInWords(end.halfRationMonths)} on half`;
    before = `${lead}; ${stretched}`;
    door = end.hasGranary ? 'the granary' : 'household stores';
    const carries = end.storesHeld ? 'would carry' : end.hasGranary ? 'carries' : 'carry';
    after = ` ${carries} the ${noun} for ${monthsInWords(end.fullRationMonths)} at full rations${half}${held}.`;
  }
  return { label: FOOD_ENDURANCE_LABEL, before, door, after, sentence: `${before}${door}${after}` };
}
