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
import { scoreBand, scoreColor, SCORE_BAND_CUTS } from './defenseScoreBands.js';
import { STRESS_TYPE_MAP } from '../../data/stressTypes.js';
import { magicWorksAt } from '../worldPulse/magicWorksAt.js';
import { magicPractitioners } from '../magicReliance.js';
import { magicServiceMade } from './magicProvisionShown.js';
import { crimeSignalOf, criminalSeatsNotGoverning } from '../crimeSignal.js';
import { criminalStructureKeyOf, ringHousesOf, runningCriminalChains } from '../facts/criminalStructureKey.js';

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
 * @property {unknown} [_seed] the record's seed — the ring note's vantage picker reads it (`withRingVantage`, SW-B5)
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
  return typeof value === 'string' && value.trim() ? guardLineAsPrinted(value.trim(), settlement) : null; // BAR5-SAFETY: below
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
  )).map((row) => { // BAR6-CRIME (6d-paid, C203044): "forces are present and paid" reads the force that keeps order
    const reason = fundingReasonAsPrinted(String(row.reason), settlement);
    return reason === row.reason ? row : { ...row, reason };
  });
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
  // BAR6-CRIME (LAW 5 widened, office): "the law", not "the watch": a gang house stands where no watch does
  if (n.includes('gang') || n.includes('street'))
    return 'Controls specific territory through violence. Extorts local businesses. Competes with the law for street-level authority.';
  if (n.includes('gambling'))
    return 'Operates unlicensed gambling. Revenue funds broader criminal network. Attracts debt spirals and desperation crime.';
  if (n.includes('underground'))
    return 'An entire secondary economy operating below street level. Beyond enforcement reach without extraordinary effort.';
  if (n.includes('assassin'))
    return 'Professional killers for hire. That there is work for them says how politics is done here.';
  if (n.includes('fence'))
    return 'Buys stolen goods and sells them on as honest stock; without the fence, theft would not pay.';
  // TAIL-DEFECON-D (READ-ALL #B02441, 132 towns): the safety profile lists a Red light district as an operation; the house
  // is the town's pleasure quarter (Entertainment), not a criminal hold, and the note says what the house is.
  if (n.includes('red light'))
    return 'A quarter given over to pleasure: a trade that runs at the edge of the law.';
  return 'A criminal operation with a hold on part of the place or its trade.';
}

// `criminalOpEcon` LIVED HERE and was a passenger: this module never called it, while the
// economics tab imported it and nothing else from here — dragging 19.6 KB plus
// threatAssessment into that chunk for an eight-line string map. It is a CLASSIFIER, not a
// display concern, and now lives in `domain/criminalOpRole.js` as a pure leaf.

const CRIM_STRUCTURE_DATA = Object.freeze({
  organized: {
    key: 'organized', label: 'Organized Syndicate', color: '#8b1a1a', bg: '#fdf4f4',
    note: 'One criminal ring decides what crime is allowed here. Its rules are predictable and it can be bargained with; it puts down random violence because that brings the law, and it lives on protection money and on any official it can buy.',
  },
  'semi-organized': {
    key: 'semi-organized', label: 'Semi-Organized Networks', color: '#8a3010', bg: '#fdf0e8',
    note: 'Criminal activity is coordinated enough to maintain routes and territories but lacks a single controlling authority. Several gangs may be competing. Less predictable than a guild, more structured than street crime.',
  },
  diffuse: {
    key: 'diffuse', label: 'Diffuse Criminal Presence', color: '#7a5010', bg: '#faf8e0',
    note: 'Thieves, fences and bandits each work for themselves; there is no boss to threaten or to bribe, which makes them harder to stamp out.',
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
  const key = criminalStructureKeyOf(r); // TAIL-TIES-9 (T28): the key's ladder (and its reasons) lives in the crime fact's leaf
  return key ? ringNoteUnderStreetFighting(diffuseUnderCoordinatedWave(headedPowerAmongRivals(ringNoteAmongRivalGangs(ringWithoutSeat(withRingVantage(CRIM_STRUCTURE_DATA[key], r), r), r), r), r), r) : null; // TAIL-DEFECON-D: no ring the record names; BAR3-DEFECON-2 (T28b): nor one ring among rival gangs
}

export { runningCriminalChains } from '../facts/criminalStructureKey.js'; // TAIL-TIES-9 (T28): moved verbatim to the crime fact's leaf

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

/** The Arcane Support row's note where no practitioner stands, and its twin where a magical service is made (BAR2-LABELS C1229). */
export const ARCANE_NONE = 'No arcane practitioners on the rolls. Wards, detection and counterspell are beyond this settlement.';
export const ARCANE_NONE_WITH_SERVICE = 'No arcane practitioner stands with the defence, so wards, detection and counterspell are beyond it.';

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
  const court = courtOnRoster(r), prison = defenceOf(r).prison; // FAULTS-WATCH item 5: the prison read off the LIVE roster (the defence home), as the court is; not the stamped `compound.inst.hasPrison`
  // V6 (TAIL-DISPLAY-CIVIC-4, the chair's ruling of 2026-11-15): where no courthouse stands and a council or a town hall
  // hears the cases, the row names what stands (the council's bench), not a court.
  const bench = court ? courtBenchOf(r) : null;
  const courtWord = bench ?? 'Court';

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
        // BAR2-LABELS (C1229, LB1's one home): where a magical service is made here (`magicServiceMade`), someone works
        // magic, so the row says only what the defence lacks.
        : magicServiceMade(r) ? ARCANE_NONE_WITH_SERVICE : ARCANE_NONE,
    },
    {
      // W2-C-LEAVES-SIDE (the chair's #575): the court is read off the live roster (`courtOnRoster`, below), not the flag.
      label: 'Legal Infrastructure',
      status: court && prison ? `${courtWord} + Prison` : court ? `${courtWord} only` : prison ? 'Prison only' : 'None',
      color: court && prison ? '#1a3a5a' : court ? '#3a5a7a' : prison ? '#7a5a3a' : '#9c8068', score: null,
      note: court && prison ? 'Full enforcement chain. Arrest, prosecute, detain.' : court ? (bench ? 'Cases heard without detention. Fines and exile only.' : 'Courts without detention. Fines and exile only.') : prison ? 'Detention without process. Arbitrary enforcement.' : 'No deterrence beyond force.',
    },
    {
      label: 'Medical Readiness',
      status: facts.hasHospital ? 'Hospital present'
        : facts.hasHealer ? (healerSubject(facts.healerName) === 'A healer' ? 'Healer' : 'Infirmary')
          : clergyHere(r) ? 'Clergy care' : 'None', // W2-C-LEAVES item 3: clergy who live here, by the faith's home
      color: facts.hasHospital ? '#1a5a28' : (facts.hasHealer || clergyHere(r)) ? '#7a5010' : '#8b1a1a', score: null,
      note: facts.hasHospital ? 'Casualty treatment, outbreak containment, recovery capacity.'
        // W2-C-LEAVES-12, the chair's ruling (H): NO SURFACE PRINTS A CATALOGUE NAME'S BRACKET ("Major monasteries (5-10)."):
        // the healer is named by its display label, its count band struck (`healerLabel`)
        : facts.hasHealer ? `${healerLabel(facts.healerName)}. Wounds and fevers treated one at a time; no beds to contain an outbreak.`
          : clergyHere(r) ? 'Clerical care. Basic wound and disease management.' : sickTendedByOne(r) ? 'No healer\'s house stands here; the sick are tended by one of the place\'s own.' : 'No healer is kept here; the sick are tended by their own families.', // TAIL-DEFECON-D (#B13779)
    },
    // ⛔ THE LOGISTICS & SUPPLY ROW IS GONE FROM THE DEFENSE SURFACES (the owner's word,
    // 2026-11-03: "Do add storehouse months the economy tab."). It was the granary read; stored
    // food is printed once, in months, on the Economy tab, and no Defense surface prints it.
  ];
  if ((f.hasNavy || f.hasPort) && navalRowStandsOn(r)) { // W2-C-LEAVES-SIDE item 2: the sea route (below)
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
          ? 'The place\'s own ships hold the sea approaches; an attack by water would have to beat them first.'
          : 'Port facility but no naval force. Sea approaches are accessible to any vessel.',
    });
  }
  // The Arcane Support row is the list's one magic row.
  if (practitioners.length > 0 && !defenceHoldsArcane(r)) caps.splice(1, 1); // record 369 G5: the list's second row (below)
  // W2-C-LEAVES-SIDE item 3: "None … No arcane practitioners" is not printed beside a governing arcane power or a named
  // mage (below): the list's second row, as above (no practitioner, so nothing was taken out before it).
  if (!arcane && arcaneNamedHere(r)) caps.splice(1, 1);
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
    'Beasts & Monsters': beastsReadinessOf(r).shownScore, // P9 (G22): read against the need
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
  const magicDef = standingEntries(settlement?.defenseProfile?.institutions?.magicDef || [], settlement); // SR5 (b): a ruin fields nothing
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
  /** @param {ForceEntry[] | undefined} entries */
  const standing = (entries) => standingEntries(entries || [], settlement); // SR5 (b): a ruined house is no force the town fields
  return {
    fortifications: standing(inst.walls),
    standing: dedupByName(standing([...(inst.garrison || []), ...(inst.militia || []), ...(inst.watch || [])])),
    contracted: standing(inst.mercenary),
    charter: standing(inst.charter),
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

// ⛔ TAIL-DEFECON-D (the chair's D2, ONE HOME FOR ONE FACT; READ-ALL #09264 #09257, 70 towns): `monthsInWords` LIVED HERE and
// said the stores' span in words of its own (1.5 months "about two months") beside the Economy tab's stores row, which says
// the same months through `tonightSheet.js :: storesSpanWords` ("about a month and a half"): one fact, two spans. The food
// endurance line now reads that one writer (imported at the end of the file), for the full-ration span and the half-ration one.
// The half-ration span is the stores' months twice over (UPKEEP-8), said by the same writer.
// From a year up the stores row's writer says the months as a figure; the line keeps its year words there ("about a year",
// "more than a year", "more than two years"), which every such figure bears.
/** @param {number} months @returns {string} */
function spanInWords(months) {
  const whole = Math.round(months);
  if (whole < 12) return storesSpanWords(months);
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
  // 2 + 20 (W2-A-LEAVES, 2026-11-12; the second wave's ruling): THE SIEGE FIGURE IS A CONDITION. Only a besieged
  // place reads it in the indicative; everywhere else it is what a siege WOULD do to the stores the Economy tab's
  // row states (the census counted "under siege the outlying fields are lost" outside a siege in 689 of 720).
  // UPKEEP-8 (the chair's ruling of 2026-11-13): what a siege WOULD do is said only where none is in force, what it HAS
  // done only where one is; the months the line states add up from the record's own stored months (full rations the
  // stores, half rations twice them), and what is still harvested is said to stretch them, never counted into them.
  const would = !end.besieged;
  const opening = end.besieged ? 'the siege has taken the outlying fields' : 'under siege the outlying fields would be lost';
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
    before = `${lead}, but what the ${noun} still grows ${would ? 'would feed' : 'feeds'} it at full rations; `;
    door = end.hasGranary ? 'the granary' : 'its household stores';
    const stand = would ? 'would stand' : end.hasGranary ? 'stands' : 'stand'; // the line's verb (W2-A-LEAVES), read by this lane's `would`
    after = end.hasGranary ? ` ${stand} in reserve${held}.` : ` ${stand} in reserve.`;
  } else {
    const half = end.halfRationMonths === null
      ? `; on half rations the harvest alone ${would ? 'would be' : 'is'} enough`
      : `, ${spanInWords(2 * end.storedMonths)} on half`; // TAIL-DEFECON-D (D2): the stores row's one span writer
    const them = end.hasGranary ? 'it' : 'them';
    const stretched = end.keptShare > 0 && end.halfRationMonths !== null
      ? `, and what is still harvested ${would ? 'would stretch' : 'stretches'} ${them} further` : '';
    before = `${lead}; `;
    door = end.hasGranary ? 'the granary' : 'household stores';
    const carries = end.storesHeld || would ? 'would carry' : end.hasGranary ? 'carries' : 'carry';
    after = ` ${carries} the ${noun} for ${spanInWords(end.storedMonths)} at full rations${half}${stretched}${held}.`;
  }
  return { label: FOOD_ENDURANCE_LABEL, before, door, after, sentence: `${before}${door}${after}` };
}

// ─── SW-B5 FRAMES: the criminal ring's note gets vantages ─────────────────────
// ⚠ AT THE END OF THE FILE so no line above moves (lines of this module are cited elsewhere).
import { hashKey } from './stateProse/stateProseKernel.js';

/**
 * ⭐ THE RING'S NOTE GETS VANTAGES (lane SW-B5 FRAMES, 2026-11-09; STYLE-RULINGS-2 B5, the
 * chair's widening of the lane's manifest to this one note; the owner's style law §7–§8). The
 * `organized` note printed word for word in 306 of the 1,000 towns, as two frames (#12–15 of
 * STYLE-0's twenty). Index 0 is the original; the others say the SAME facts — one ring decides
 * what crime is allowed, it is predictable and can be bargained with, it puts down random
 * violence because that brings the law, it lives on protection money and bought officials —
 * from another vantage. No new fact is read. The settlement's own seed chooses (`_seed`, the
 * birth's identity) through the kernel's avalanched `hashKey`, with no draw; a record with no seed prints the original. Only the note
 * varies: `key`, `label` and the colours are the table's, so every reader of `key` is unmoved.
 * W2-C-LEAVES-9 (the chair's ruling of 2026-11-14 05:28 (1)): the second vantage says "the streets", a size word a thorp or
 * a hamlet makes false (`registeredWords.js :: streets`), so it DECLARES the tier where it is true; `withRingVantage`
 * hands the drawn vantage to the list door and, where it is refused, prints the table's own note.
 * @type {ReadonlyArray<string | { text: string, needs: string[], excludes?: string[] }>}
 */
const ORGANIZED_RING_NOTES = Object.freeze([
  CRIM_STRUCTURE_DATA.organized.note,
  // BAR6-CRIME (9a.wave, BRIEF-BAR6 (b); C43177): "keeps the streets quiet" presumes no crime wave (`crime wave`, the one
  // reading `facts/lawBand.js :: crimeWaveStands`); refused, the table's own note prints (no roll moves)
  { text: 'Crime here answers to one ring. It keeps the streets quiet because trouble brings the law, lives on protection money and on whatever official it can pay, and anyone who needs something from it can bargain.', needs: ['tier: ≥ village'], excludes: ['crime wave'] },
  'Shopkeepers here pay one ring for protection, and the ring pays any official who will take its money. It stamps out random violence, which would bring the law, and its terms are known and can be negotiated.',
  'Ask who runs crime here and the answer is one ring. It sets the rules and keeps to them, it can be bargained with, and it puts down any violence that would bring the law; it lives on protection money and on any official it can bribe.',
]);

/**
 * W2-A-LEAVES-2 (2026-11-13; REVIEW-W2A F3, F3c). Each vantage said the ring "lives on protection money and bought
 * officials" (the officials it pays, pays officials in turn, bribed officials): FALSE in 87 of the census's 720
 * organised rings, where no official answers to a criminal house and the hall is not the criminals'. Whether one
 * does is VEILED (the cast's allegiances and the hall's rung are stripped from the public record), and this note is
 * one value printed on the DM's Defense tab and the public page alike, so it may not read it. The four vantages now
 * say what is true in every town and read nothing hidden: the ring lives on "any official it can buy" (pays "any
 * official who will take its money"), which presumes no buyer; the DM's "Who answers to whom" names those it has.
 * The pick is the settlement's seed, as before (SW-B5); for the owner's veto, as new words. The drawn vantage passes the
 * list door (`filterDeclared`, W2-C-LEAVES-9): one refused in a small place leaves the table's own note; no roll moves.
 * @param {{ key: string, label: string, color: string, bg: string, note: string }} row
 * @param {{ _seed?: unknown }} settlement
 * @returns {{ key: string, label: string, color: string, bg: string, note: string }}
 */
function withRingVantage(row, settlement) {
  const seed = settlement?._seed;
  if (row.key !== 'organized' || typeof seed !== 'string' || !seed) return row;
  const drawn = ORGANIZED_RING_NOTES[hashKey(`${seed}::defenseDisplay:organizedRing`) % ORGANIZED_RING_NOTES.length];
  const [kept] = filterDeclared([drawn], { facts: () => factsOf(/** @type {Parameters<typeof factsOf>[0]} */ (/** @type {unknown} */ (settlement))),
    poolId: 'defenseDisplay:ORGANIZED_RING_NOTES', surface: 'defense', drawKind: 'H' });
  const note = kept === undefined || (drawn === ORGANIZED_RING_NOTES[1] && streetsNotQuiet(settlement)) ? row.note : lineText(kept); // TAIL-DEFECON-D (#B11428)
  return note === row.note ? row : Object.freeze({ ...row, note });
}

// ─── W2-C-LEAVES item 3: CLERICAL CARE NEEDS CLERGY (at the end of the file, so no line above moves) ───
import { faithReadingOf } from '../dossier/faithReading.js';
import { rulerKindOf } from '../facts/rulerKind.js';

/**
 * WHETHER CLERGY LIVE HERE (W2-C-LEAVES, 2026-11-13; the cold list REVIEW-W2A-3 #56, HIGH: "Clerical care. Basic wound
 * and disease management." in a thorp whose Burial ground says "No clergy lives near enough" and whose Faith reads "no
 * church of its own"). The Medical Readiness row read `compound.inst.hasChurch`, a name test that a Wayside shrine and
 * an "Access to parish church" row both pass. The faith's one home (`dossier/faithReading.js :: faithReadingOf`)
 * answers it: a church of the place's own (never a shrine, never access to a neighbour's), or a cleric on its roster;
 * and the ruler's home (`facts/rulerKind.js :: rulerKindOf`) where a priest rules (a Priestly Guidance thorp's "elder
 * priest", whose role the faith home's cleric ranks do not read: 12 of the census's 720).
 * @param {DefenseDisplaySettlement} settlement
 * @returns {boolean}
 */
function clergyHere(settlement) {
  const reading = faithReadingOf(/** @type {import('../dossier/faithReading.js').FaithReadingSettlement} */ (/** @type {unknown} */ (settlement)));
  return reading.hasChurch || reading.seniorCleric !== null
    || rulerKindOf(/** @type {Parameters<typeof rulerKindOf>[0]} */ (/** @type {unknown} */ (settlement))) === 'priest';
}

// ─── W2-C-LEAVES-3, round three: NO ONE RING WHERE RINGS RIVAL: `rivalRingsHere` and `oneOrganisationRules` moved verbatim
// to the crime fact's leaf, `facts/criminalStructureKey.js` (TAIL-TIES-9, the chair's ruling T28) ───

// ─── W2-C-LEAVES-3: THE ARCANE SUPPORT ROW IS A CLAIM ABOUT THE DEFENCE (at the end of the file, so no line above moves) ───
// The chair's ruling (record 369, G5; vetoable): "Arcane Support · Present … Detection, wards, counterspell." prints only
// where BOTH hold: the Magic tab's practitioner census holds a practitioner (`magicReliance.js :: magicPractitioners`,
// unchanged) AND the defence profile's OWN arcane tradition holds (`facts/magic.js :: defenceHoldsArcane`, the stored
// `defenseProfile.traditions.hasArcane`, read in the magic fact's home). Where a practitioner stands and the defence's
// tradition does not, deriveSupportingCapabilities takes the row out of the list (its SECOND row, by the list's own
// literal order: Economic Backing, Arcane Support, …); it is never turned to "None", which would deny the practitioner.
// Measured on the census's 720 at 5ab1d2c7c: 73 of the 230 Present rows.
import { defenceHoldsArcane } from '../facts/magic.js';

// ─── W2-C-LEAVES-SIDE: NO ONE-RING NOTE WHERE THE TAB SAYS THE STREETS ARE FOUGHT OVER (at the end of the file) ───
/**
 * The crisis lines the Defense tab prints beside the criminal structure (the safety profile's own `safetyDesc` and its
 * crime patterns, `crimeTypes[].desc`) that say the streets are fought over or the law has gone: a slave revolt's "Rebels
 * and guards are fighting in the contested districts" and "Active armed conflict … in contested districts", an
 * insurgency's "Street-level confrontations between insurgent supporters and the watch", "There is no meaningful law
 * enforcement", "the regular patrols have stopped". Matched by those words, the tab's own.
 */
/** The safety label names the crisis in force after a dash (`safetyProfile.js`: "<strain> — <condition>"). */
const CRISIS_IN_LABEL = /\s—\s\S/;
const STREETS_FOUGHT_OVER = /fighting in the contested districts|armed conflict between revolt participants|street-level confrontations|no (?:meaningful )?law enforcement|patrols have stopped|abandoned normal patrol/i;

/**
 * THE ORGANISED-RING NOTE IS NOT PRINTED UNDER A CRISIS WHOSE OWN LINES SAY THE STREETS ARE FOUGHT OVER (W2-C-LEAVES-SIDE,
 * 2026-11-13; the chair's ruling on the round-three increment's rww-town-slave_revolt-1: "Crime here answers to one ring.
 * It keeps the streets quiet …" printed under a slave revolt beside "Rebels and guards are fighting in the contested
 * districts"). Every vantage of the note says the ring puts down violence and keeps order of its own; beside the crisis's
 * own fighting line that is false. Where a crisis is in force (the tab's safety label names it: "Critical — Slave
 * Revolt") and one of the tab's lines says so
 * (`STREETS_FOUGHT_OVER`), the note is left out: the structure's key and label stand, every reader of `key` unmoved.
 * Measured on the census's 720 at 408c2e30c: 7 of 134 organised rings (3 insurgencies, 4 slave revolts); none without a
 * crisis in force. The record is read as stored; no fact is added.
 * @param {{ key: string, label: string, color: string, bg: string, note: string }} row
 * @param {DefenseDisplaySettlement} settlement
 * @returns {{ key: string, label: string, color: string, bg: string, note: string }}
 */
function ringNoteUnderStreetFighting(row, settlement) {
  if (row.key !== 'organized') return row;
  const sp = /** @type {{ safetyLabel?: unknown, safetyDesc?: unknown, crimeTypes?: unknown } | undefined} */ (settlement?.economicState?.safetyProfile);
  // The crisis in force, as the tab prints it: the safety label's own condition ("Critical — Slave Revolt").
  if (typeof sp?.safetyLabel !== 'string' || !CRISIS_IN_LABEL.test(sp.safetyLabel)) return row;
  const lines = [sp?.safetyDesc, ...(Array.isArray(sp?.crimeTypes) ? sp.crimeTypes : []).map((c) => /** @type {{ desc?: unknown } | null} */ (c)?.desc)];
  return lines.some((l) => typeof l === 'string' && STREETS_FOUGHT_OVER.test(l)) ? Object.freeze({ ...row, note: '' }) : row;
}

// ─── W2-C-LEAVES-SIDE item 2: THE NAVAL ROW STANDS ON THE SEA (at the end of the file) ───
import { tradeRouteOf } from '../facts/terrain.js';

/**
 * WHETHER THE NAVAL DEFENSE ROW HAS A SEA TO SPEAK OF (W2-C-LEAVES-SIDE, 2026-11-13; the cut's #961, "Port facility but no
 * naval force. Sea approaches are accessible to any vessel." in a river town in a forest). The chair's ruling (record 387,
 * the port's two homes): the trade route is the home of "this is a port" and of which water it stands on, so the row's
 * lines (every one of them speaks of the sea approaches) print only where the route is the sea (`tradeRouteOf` 'port').
 * A river town's docks get no river twin: none was read true (silence, as ruled). A live blockade (the pulse's own
 * `stockpile.blockaded`, a fleet the record names) keeps the row on any route. Measured on the census's 720 at
 * 408c2e30c: 121 rows, 48 on the sea route stand; 73 out (river 56, road 11, isolated 4, crossroads 2); none blockaded.
 * @param {DefenseDisplaySettlement} settlement
 * @returns {boolean}
 */
function navalRowStandsOn(settlement) {
  return tradeRouteOf(settlement) === 'port' || settlement?.economicState?.foodSecurity?.stockpile?.blockaded === true;
}

// ─── W2-C-LEAVES-SIDE item 3: NO "NO ARCANE PRACTITIONERS" BESIDE A MAGE THE RECORD NAMES (at the end of the file) ───
// The chair's ruling on the round-three increment's rww-town-calm-1 ("Arcane Support · None · No arcane practitioners on
// the rolls" where an Arcane Council governs and the council's archmage is named): the row is left out where the record
// holds a governing arcane power or a named mage, read in the magic fact's home (`facts/magic.js :: recordNamesAMage`).
// Record 394 stands for "Present". Measured on the census's 720 at 408c2e30c: 13 rows out.
import { recordNamesAMage as arcaneNamedHere } from '../facts/magic.js';

// ─── W2-C-LEAVES-SIDE (the chair's #575): THE LEGAL ROW NAMES A COURT ONLY WHERE A HOUSE HOLDS ONE (at the end of the file) ───
import { courtBenchOf, courtHoldersOf, defenceOf } from '../facts/defence.js'; // TAIL-CLOSE-SRC-4 (SR1): the court's holders and its bench, read in the defence home

/**
 * WHETHER A HOUSE ON THE LIVE ROSTER HOLDS A COURT (W2-C-LEAVES-SIDE, 2026-11-13; the chair's ruling on the cut's #575:
 * "Legal Infrastructure · Court only" in a town with no courthouse and no prison on its roster). The row read the flag
 * `compound.inst.hasCourtSystem` (`defenseFacts.js :: hasCourt`, a NAME test that takes every "Town hall" for a court);
 * the roster governs the page: a courthouse or court buildings stand, or a live house drew a court service
 * (`availableServices`, the services the Services tab prints for that house). Where the flag and the roster disagree
 * the record's disagreement is NAMED: on the census's 720 at 408c2e30c, 37 towns (29 "Court only" → "None", 8 "Court +
 * Prison" → "Prison only"), each a Town hall whose drawn services are permits and taxes; no town the other way.
 * @param {DefenseDisplaySettlement} settlement
 * @returns {boolean}
 */
function courtOnRoster(settlement) {
  return courtHoldersOf(settlement).length > 0;
}

// ─── W2-C-LEAVES-9: THE RING'S VANTAGES PASS THE LIST DOOR (at the end of the file, so no line above moves) ───
import { filterDeclared, lineText } from '../facts/drawDeclared.js';
import { factsOf } from '../facts/factsOf.js';

import { institutionDisplayName } from './institutionDisplayName.js';
/**
 * A house as the Medical Readiness line names it (W2-C-LEAVES-12, ruling (H)): its display label (`institutionDisplayName`,
 * the label seam), a catalogue count band struck ("Major monasteries (5-10)" -> "Major monasteries"); a note that says what
 * the house is stays ("Healer (divine, 1st level)", pinned by tests/domain/defenseWordsFindings.test.js).
 * @param {string | null | undefined} name the roster name
 * @returns {string}
 */
function healerLabel(name) {
  return String(institutionDisplayName(name) || name || '').replace(/\s*\(\d+\s*[-\u2013]\s*\d+\)/g, '').replace(/\s+/g, ' ').trim();
}

// ─── TAIL-DEFECON-D (D2): THE STORES' SPAN HAS ONE WRITER (at the end of the file, so no line above moves) ───
import { storesSpanWords } from '../summary/storesSpanWords.js'; // TAIL-TIES-6 (T23): the pure leaf, so this file reaches no tonight sheet

// ─── TAIL-DEFECON-D: THE ONE-RING NOTE NEEDS A RING THE RECORD NAMES (at the end of the file) ───
/**
 * The safety label's own word for a place whose streets are not quiet (`safetyProfile.js`: "<strain> — <condition>"). The
 * second vantage of the ring's note says the ring "keeps the streets quiet": beside one of these it is false (READ-ALL
 * #B11428, 48 towns: "Dangerous — Plague Unrest", "Desperate — Active Siege", "Unsafe"), and the table's own note prints.
 */
const UNQUIET_SAFETY = Object.freeze(['Dangerous', 'Desperate', 'Unsafe', 'Critical', 'Volatile']);
/** @param {DefenseDisplaySettlement} settlement @returns {boolean} */
function streetsNotQuiet(settlement) {
  const label = /** @type {{ safetyLabel?: unknown } | undefined} */ (settlement?.economicState?.safetyProfile)?.safetyLabel;
  return typeof label === 'string' && UNQUIET_SAFETY.includes(label.split(/\s\u2014\s/)[0].trim());
}

/**
 * THE ORGANISED STRUCTURE WITH NO RING ON THE RECORD (TAIL-DEFECON-D, 2026-11-15; READ-ALL #B00162 #B11531 #18046: "One
 * criminal ring decides what crime is allowed here" where no criminal power sits on the roster and no thieves' guild
 * stands). The name ladder makes the structure ORGANIZED from a "Front businesses" or an "Underground city" house alone;
 * every vantage of the note then names ONE RING that the record does not hold. Where no criminal seat (`crimeSignalOf`'s
 * factions) and no thieves' guild house stand, the note says what those houses show and no more: the key, the label and
 * the colours stand (every reader of `key` unmoved); no roll is added.
 */
const NO_SEAT_RING_NOTE = Object.freeze({
  front: 'Crime here is run as a business: its money passes through shops that look honest, and whoever runs it keeps out of sight.',
  under: 'Crime here runs through a second economy underground, and whoever runs it keeps out of sight.',
});
/**
 * @param {{ key: string, label: string, color: string, bg: string, note: string }} row
 * @param {DefenseDisplaySettlement} settlement
 * @returns {{ key: string, label: string, color: string, bg: string, note: string }}
 */
function ringWithoutSeat(row, settlement) {
  if (row.key !== 'organized') return row;
  const houses = ringHousesOf(settlement); // the crime fact's leaf reads the roster the key reads (TAIL-CLOSE-SRC-5, SR5 (a))
  if (houses.guild) return row;
  if (crimeSignalOf({ seats: settlement?.powerStructure?.factions, estate: [] }).powerNames.length) return row;
  if (!houses.front && !houses.under) return row;
  return Object.freeze({ ...row, note: houses.front ? NO_SEAT_RING_NOTE.front : NO_SEAT_RING_NOTE.under });
}

// ─── TAIL-DEFECON-D: THE SICK ARE NOT TENDED "BY THEIR OWN FAMILIES" BESIDE ONE WHO TENDS THEM (at the end of the file) ───
/** A person's role that is the tending of the sick (a plague's crisis cast: "Tends the sick"; a healer, a physician …). */
const TENDS_THE_SICK = /\b(?:tends the sick|healer|physician|midwife|herbalist|apothecary|surgeon)\b/i;
/**
 * WHETHER ONE OF THE PLACE'S OWN TENDS THE SICK (TAIL-DEFECON-D, 2026-11-15; READ-ALL #B13779: "No healer is kept here; the
 * sick are tended by their own families." where the People tab names a person who "Tends the sick": 7 of the census's 720,
 * every one a plague's crisis cast in a thorp or a hamlet). The roster's people are read by their role, as the People tab
 * prints it; where one tends the sick, the note says so and no more (no house is named: none stands).
 * @param {DefenseDisplaySettlement} settlement
 * @returns {boolean}
 */
function sickTendedByOne(settlement) {
  const people = /** @type {{ npcs?: unknown }} */ (/** @type {unknown} */ (settlement))?.npcs;
  return (Array.isArray(people) ? people : []).some((p) => TENDS_THE_SICK.test(String(/** @type {{ role?: unknown } | null} */ (p)?.role ?? '')));
}

// ─── TAIL-DISPLAY-CIVIC-4 (V8): ONE HEADED POWER AMONG RIVAL GANGS (at the end of the file, so no line above moves) ───
/**
 * THE STRUCTURE WORD READS THE POWERS (V8, the chair's ruling of 2026-11-15: "lacks a single controlling authority" printed
 * beside a criminal power whose first seat is a person of the roster, 26 of its 168 towns on the census's 720 at 6cf555801,
 * each a Thieves' Guild keyed semi-organized by the roster's "Multiple criminal factions"). Where exactly one criminal power
 * that does not govern stands, and a person of the roster holds its first seat, the note says the power answers to one head
 * and the rival gangs contest its ground (the row's key and label stand: no single authority rules ALL crime here).
 * @param {{ key: string, label: string, color: string, bg: string, note: string }} row
 * @param {DefenseDisplaySettlement} settlement
 * @returns {{ key: string, label: string, color: string, bg: string, note: string }}
 */
function headedPowerAmongRivals(row, settlement) {
  if (row.key !== 'semi-organized') return row;
  const rings = criminalSeatsNotGoverning(/** @type {ReadonlyArray<{ category?: unknown, isGoverning?: unknown, faction?: unknown } | null | undefined>} */ (
    settlement?.powerStructure?.factions || [])); // the crime home's reader (TAIL-CLOSE-SRC-4)
  if (rings.length !== 1) return row;
  const name = String(rings[0]?.faction ?? '');
  const people = /** @type {{ npcs?: unknown }} */ (/** @type {unknown} */ (settlement))?.npcs;
  const headed = (Array.isArray(people) ? people : []).some((p) => (Array.isArray(p?.memberships) ? p.memberships : [])
    .some((/** @type {{ power?: unknown, rank?: unknown } | null} */ m) => m?.power === name && m?.rank === 1));
  if (!name || !headed) return row;
  const held = /** @type {{ powerLabel?: unknown } | null | undefined} */ (rings[0])?.powerLabel === 'Suppressed' ? 'is held down, keeping what routes it can' : 'holds routes and territories';
  return Object.freeze({ ...row, note: `The ${powerNameAfterArticle(name)} answers to one head and ${held}, but rival gangs contest its ground: no single authority rules all crime here. Less predictable than an unchallenged guild, more structured than street crime.` });
}
import { powerNameAfterArticle } from './powerSentenceName.js';

// ─── TAIL-CLOSE-SRC-5 (SR5 (b)): A RUINED HOUSE IS NO FORCE THE TOWN FIELDS (at the end of the file, so no line above moves) ───
/**
 * THE BUCKETS' ENTRIES THAT STILL STAND (the chair's ruling SR5 of 2026-11-15, vetoable by the owner: a read that decides
 * what stands in a town goes through the roster that leaves ruined houses out). `defenseProfile.institutions` is the
 * generation-time snapshot: its entries are the roster's rows as they were born, and a ruin REPLACES its roster row
 * (`{ ...inst, status: 'ruined', _worldPulseInactive: true }`), so the stamp never reaches the bucket. These entries are
 * counted (the Defense tab's "N arcane", and whether any force stands at all) and listed as the town's armed forces (the
 * PDF's defence chapter, the Foundry journal), so the read decides what stands. An entry is dropped where it is itself not
 * live, or where the current roster holds its name only on rows that are not live (`isLiveInstitution`, the roster's one
 * predicate). An entry whose name the roster does not hold at all (a later rename) is kept: the snapshot is not re-derived
 * here, and a ruin is the only cause this reads. Where nothing falls, the same array is returned.
 * @param {ForceEntry[]} entries
 * @param {DefenseDisplaySettlement | null | undefined} settlement
 * @returns {ForceEntry[]}
 */
function standingEntries(entries, settlement) {
  const rows = Array.isArray(settlement?.institutions) ? settlement.institutions : [];
  /** @param {unknown} i @returns {string} */
  const nameOf = (i) => String(/** @type {{ name?: unknown } | null} */ (i)?.name ?? '');
  const live = new Set(liveInstitutions(settlement).map(nameOf));
  const fallen = new Set(rows.filter((i) => !isLiveInstitution(i)).map(nameOf));
  const kept = entries.filter((e) => (e === null || typeof e !== 'object' || isLiveInstitution(e))
    && (live.has(nameOf(e)) || !fallen.has(nameOf(e))));
  return kept.length === entries.length ? entries : kept;
}
import { isLiveInstitution, liveInstitutions } from '../institutions/institutionRoster.js';

// ─── BAR3-DEFECON-2 (ruling T28b): NO "ONE RING" BESIDE RIVAL GANGS (at the end of the file, so no line above moves) ───
import { gangHousesOf } from '../crimeSignal.js';
/**
 * THE RING'S NOTE AMONG RIVAL GANGS (BAR3-DEFECON-2, the chair's ruling T28b of 2026-11-15 20:58 UTC, vetoable by the owner;
 * REVIEW-BAR-3 C30870: "Ask who runs crime here and the answer is one ring." beside the roster's "Multiple criminal
 * factions", whose row reads "Rival gangs, forever disputing their turf."). THE KEY STAYS AS T28 RULED IT (organized: one
 * organisation governs or dominates); THE NOTE DECLARES: no vantage that says "one ring" prints where the live houses hold
 * several gangs (the crime home's own count, `crimeSignal.js :: gangHousesOf`: a several-gangs house, or two street gangs);
 * there the twin says what is true: the answer depends on the street. Measured on the census's 720 at 7a4b48a84: 6 of the
 * 149 organised towns (each a several-gangs house; none with two street gangs). The other criminal houses (a fence, a
 * front, a black market) are the ring's own trade and leave the note as drawn. No draw; only the note.
 */
export const RING_AMONG_RIVAL_GANGS_NOTE = 'Ask who runs crime here and the answer depends on the street: rival gangs dispute the turf, and whoever holds a street lives on the protection money it pays and on any official it can buy.';
/**
 * @param {{ key: string, label: string, color: string, bg: string, note: string }} row
 * @param {DefenseDisplaySettlement} settlement
 * @returns {{ key: string, label: string, color: string, bg: string, note: string }}
 */
function ringNoteAmongRivalGangs(row, settlement) {
  if (row.key !== 'organized' || gangHousesOf(liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (/** @type {unknown} */ (settlement)))) < 2) return row;
  return Object.freeze({ ...row, note: RING_AMONG_RIVAL_GANGS_NOTE });
}

// ── BAR5-SAFETY (LAW 2's L2.law.collapsed, the audit's C42116; vetoable by the owner) ── at the END: no line above moves.
import { diffuseNoteAsPrinted, fundingReasonAsPrinted, guardLineUnderTheForce, guardLineUnderTheLaw, safetyLineAsPrinted } from './guardLineUnderTheLaw.js'; // BAR6-CRIME: the four readers after the first
import { isEdited } from '../userEdits.js';
/**
 * The guard assessment as printed: a line that says how a wrong is answered reads the law's band the page prints
 * (`guardLineUnderTheLaw.js`); a DM's own line (an edited field, `userEdits.js`) is returned as written.
 * @param {string} text @param {unknown} settlement @returns {string}
 */
function guardLineAsPrinted(text, settlement) {
  return isEdited(/** @type {never} */ (settlement), 'economicState.safetyProfile.guardEffectivenessDesc') ? text : guardLineUnderTheForce(guardLineUnderTheLaw(text, settlement), settlement); // BAR6-CRIME (d) (h): the force that keeps order
}

// ── BAR6-CRIME (BRIEF-BAR6 (a) (c) (d); vetoable by the owner) ── at the END: no line above moves.
/**
 * THE SAFETY LINE AS PRINTED (the Defense tab's public-order paragraph, `safetyProfile.safetyDesc`): its foothold clause and
 * its force read the finished record (`guardLineUnderTheLaw.js :: safetyLineAsPrinted`); a DM's own line is returned as written.
 * @param {DefenseDisplaySettlement | null | undefined} settlement @returns {string | null}
 */
export function deriveSafetyLine(settlement) {
  const value = /** @type {{ safetyDesc?: unknown } | undefined} */ (settlement?.economicState?.safetyProfile)?.safetyDesc;
  if (typeof value !== 'string' || !value) return null;
  return isEdited(/** @type {never} */ (settlement), 'economicState.safetyProfile.safetyDesc') ? value : safetyLineAsPrinted(value, settlement);
}
/**
 * (f) LAW 8's 8e.crime (C8633): AN OPERATION THE DEFENSE BLOCK LISTS READS ITS HOUSE'S MARK. The block lists the safety
 * profile's operations by name (`safetyProfile.criminalInstitutions`); the same house's card on the Institutions tab prints
 * "Stopped by the siege." The mark is the card's own (`crisisStoppedRow.js :: rowMarkText`, the one reading of a house's
 * marks), read off the operation's house on the live roster by name; null where the house takes none or none stands.
 * Read by the Defense tab; the printed export's list (`pdf/sections`) is named to read it too.
 * @param {DefenseDisplaySettlement | null | undefined} settlement @param {unknown} name the operation as listed
 * @returns {string | null}
 */
export function criminalOpMark(settlement, name) {
  const key = String(name ?? '').trim().toLowerCase();
  if (!key) return null;
  const house = /** @type {Array<Record<string, unknown>>} */ (liveInstitutions(/** @type {never} */ (settlement)) || [])
    .find((h) => String(h?.name ?? '').trim().toLowerCase() === key);
  return house ? rowMarkText(/** @type {never} */ (settlement), 'house', /** @type {never} */ (house)) : null;
}
import { rowMarkText } from './crisisStoppedRow.js';

/**
 * (c) the chair's HK1: the diffuse note beside the hook "The crime wave is coordinated" speaks of appearances.
 * @param {{ key: string, label: string, color: string, bg: string, note: string }} row @param {DefenseDisplaySettlement} settlement
 * @returns {{ key: string, label: string, color: string, bg: string, note: string }}
 */
function diffuseUnderCoordinatedWave(row, settlement) {
  if (row.key !== 'diffuse') return row;
  const note = diffuseNoteAsPrinted(row.note, settlement);
  return note === row.note ? row : Object.freeze({ ...row, note });
}
import { beastsReadinessOf } from '../domain/facts/beastsReadiness.js'; // P9 (RULING G22): the beasts grade read against the need; at the file's end, so no cited line moves
