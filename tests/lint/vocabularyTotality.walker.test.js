/**
 * vocabularyTotality.walker.test.js — the STANDING guard against dead-vocabulary
 * data-contract drift (cycle-3 Wave 2 prevention; extends the E-B vocabulary
 * enforcer with producer↔consumer EXACT-SET-BOTH-WAYS totality).
 *
 * THE CLASS. The cycle-3 review's deepest finding: the dead-vocabulary defect is
 * the FACTION-KEY defect recurring one level up — a per-consumer derivation that
 * hand-rolls the set of values a producer emits, hidden by a SILENT default
 * (return 0 / no callout / a neutral colour), never bound to the producer. A
 * display map carries a tier no producer emits ('embattled'), or misses one it
 * commonly does ('heartland'); a status table maps 6 of 15 stress types; a
 * classifier drops the middle safety tier. Each is invisible until a user hits
 * the un-mapped value.
 *
 * THE RULE. For each producer→consumer vocabulary contract below, the consumer's
 * recognized set must equal the producer's emitted set EXACTLY, both ways:
 *   • no consumer entry without a producer that emits it (no dead arm), and
 *   • no producer value without a consumer entry (no silent miss).
 *
 * THE HISTORICAL WAIVER (retired at T5). Three consumers were known-broken and
 * golden-bound: deriveExternalThreat's threat branch (H15) and stressor filter
 * (H16), and factionDynamics.safetyContrib (H4). THE ONE REGEN repaired all
 * three, so the former exact-gap waiver is now an exact-totality contract below.
 *
 * TO COMPLY (a new violation): bind the consumer to its producer set (import the
 * producer's keys / derive the table from it, as DEFENSE_STRESS_STATUS now does),
 * or — if the fix shifts a golden — add a DATED waiver entry with its exact gap
 * and the ONE-REGEN plan. Never delete this guard to pass.
 *
 * ACCEPTED GAPS (hand-audited 2026-07-21). The safety-token contract keys on a
 * CURATED producer-token list (safetyProfile.js composes its labels at runtime,
 * so the set cannot be imported); the list is bound to the producer by asserting
 * every token literally appears in safetyProfile.js, so a rename/removal reddens,
 * but a brand-new leading token upstream is caught only once it is curated here.
 */
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, sep } from 'node:path';
import { MONSTER_THREAT_TIERS } from '../../src/data/monsterThreat.js';
import { STRESS_TYPE_MAP } from '../../src/data/stressTypes.js';
import { DEFENSE_STRESS_STATUS } from '../../src/domain/display/defenseDisplay.js';
import { safetySeverityOf } from '../../src/domain/display/safetySeverity.js';
import { RECOGNISED_MONSTER_TIERS } from '../../src/domain/display/stateProse/defenseStateProse.js';
import { deriveEconomicComplexity } from '../../src/generators/economy/prosperity.js';
import { generateSafetyProfile } from '../../src/generators/safetyProfile.js';
import {
  COMPLEXITY_BAND_BY_LABEL, SAFETY_BANDS, STABILITY_BANDS, bandOf, complexityBandOf,
} from '../../src/domain/display/labelBands.js';
// LT39 car 3 — the incident vocabulary's consumer, its producers, and the surface
// that composes the last ten tokens. Imported, never re-spelled here (car 0e's rule).
import {
  DISPLAY_LEXICON, INCIDENT_DISCLOSURE, INCIDENT_FAMILIES, incidentDisclosure, incidentPhrase,
} from '../../src/domain/display/humanizeEngineTokens.js';
import { relationshipChronicle } from '../../src/domain/display/relationshipChronicle.js';
import { MEMORY_WEAVE_INCIDENT_TYPES } from '../../src/domain/worldPulse/relationshipEvolution.js';
import { RELIEF_INCIDENT_KINDS } from '../../src/domain/spatial/generosityReactions.js';
// EM-B1i — the pulse's fate KINDS are the producer; causeLifecycle's DESTROYED_BY_FATE_KIND
// is the consumer, and a FOURTH kind must red here rather than default to "not destroyed".
import { WORLD_PULSE_FATE_KINDS } from '../../src/domain/worldPulse/worldPulseFates.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

// ── Producer vocabularies ────────────────────────────────────────────────────
const PRODUCER_THREAT = [...MONSTER_THREAT_TIERS].sort();           // heartland/frontier/plagued
const PRODUCER_STRESS = Object.keys(STRESS_TYPE_MAP).sort();        // the 15 registered stress types
// safetyProfile.js emits these leading strain/severity tokens (composed into
// labels at runtime). Bound to the producer below by a source-presence check.
const PRODUCER_SAFETY_TOKENS = [
  'very safe', 'safe', 'moderate', 'unsafe', 'dangerous', 'controlled',
  'tense', 'strained', 'desperate', 'quarantined', 'restricted', 'volatile',
  'critical', 'suspicious',
];

// ── Source helpers ───────────────────────────────────────────────────────────
/** Brace-match a `function NAME(` body (these targets carry no braces in strings). */
export function fnBody(src, name) {
  const at = src.indexOf(`function ${name}(`);
  if (at < 0) throw new Error(`vocabularyTotality: function ${name} not found`);
  const open = src.indexOf('{', at);
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}' && --depth === 0) return src.slice(open, i + 1);
  }
  throw new Error(`vocabularyTotality: unbalanced body for ${name}`);
}

/** Top-level keys of an `NAME = Object.freeze({ … })` / `NAME = { … }` literal. */
export function objectLiteralKeys(src, name) {
  const at = src.search(new RegExp(`${name}\\s*=\\s*(?:Object\\.freeze\\(\\s*)?\\{`));
  if (at < 0) throw new Error(`vocabularyTotality: object literal ${name} not found`);
  const open = src.indexOf('{', at);
  let depth = 0; let end = open;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}' && --depth === 0) { end = i; break; }
  }
  const body = src.slice(open + 1, end);
  const keys = [];
  // Top-level keys only: split on depth-0 commas would be ideal; here every key in
  // these tables is a bare identifier at line start (`  key: {`), so anchor on that.
  for (const m of body.matchAll(/(?:^|\n)\s*([A-Za-z_]\w*)\s*:/g)) keys.push(m[1]);
  return keys;
}

/** All string literals captured by a regex over a source slice, lowercased+deduped. */
function tokensBy(src, re) {
  const out = new Set();
  for (const m of src.matchAll(re)) out.add(m[1].toLowerCase());
  return [...out];
}

const setDiff = (a, b) => a.filter((x) => !b.includes(x)).sort();

// ═══════════════════════════════════════════════════════════════════════════
// HARD CONTRACTS — the consumers this wave BOUND to their producer.
// ═══════════════════════════════════════════════════════════════════════════
describe('vocabularyTotality — bound consumers (exact set, both ways)', () => {
  it('THREAT_DISPLAY keys === the canonical monster-threat tiers (H1)', () => {
    const keys = objectLiteralKeys(read('src/components/map/settlementThreat.js'), 'THREAT_DISPLAY').sort();
    // Both ways: no dead arm ('embattled'), no missing tier ('heartland').
    expect(setDiff(keys, PRODUCER_THREAT), 'dead threat-display arm(s)').toEqual([]);
    expect(setDiff(PRODUCER_THREAT, keys), 'missing threat-display arm(s)').toEqual([]);
  });

  it('the defense DESK recognises exactly the canonical monster-threat tiers (H1b)', () => {
    // DS-DEF-2's Beasts & Monsters row branches on the monster-threat tier, and the CORPUS
    // names its third family `settled` where the producer says `heartland`. That name
    // difference is exactly the dead-vocabulary shape this walker exists for: a consumer
    // keyed on the corpus word would carry an arm no producer emits AND miss the tier that
    // is emitted. The desk keys on the producer token and exports what it recognises, so
    // the binding is checked here rather than trusted.
    const keys = [...RECOGNISED_MONSTER_TIERS].sort();
    expect(setDiff(keys, PRODUCER_THREAT), 'dead defense-desk tier arm(s)').toEqual([]);
    expect(setDiff(PRODUCER_THREAT, keys), 'missing defense-desk tier arm(s)').toEqual([]);
  });

  it('DEFENSE_STRESS_STATUS keys === every registered stress type (H3)', () => {
    const keys = Object.keys(DEFENSE_STRESS_STATUS).sort();
    expect(setDiff(keys, PRODUCER_STRESS), 'dead defense-status key(s)').toEqual([]);
    expect(setDiff(PRODUCER_STRESS, keys), 'missing defense-status key(s)').toEqual([]);
    // Totality is meaningless if a key maps to a blank posture.
    for (const [type, s] of Object.entries(DEFENSE_STRESS_STATUS)) {
      expect(typeof s.posture === 'string' && s.posture.length > 0, `${type} has a posture`).toBe(true);
    }
  });

  it('safetySeverity classifies every producer safety token to a KNOWN tier (M2)', () => {
    const unclassified = PRODUCER_SAFETY_TOKENS.filter((t) => safetySeverityOf(t).key === 'unknown');
    expect(unclassified, 'producer safety tokens that hit the loud unknown fallback').toEqual([]);
    // Bind the curated token list to the producer: every token must literally
    // appear in safetyProfile.js, so a rename/removal upstream reddens this guard.
    const profile = read('src/generators/safetyProfile.js');
    const capitalize = (t) => t.replace(/\b\w/g, (c) => c.toUpperCase());
    const absent = PRODUCER_SAFETY_TOKENS.filter((t) => !profile.includes(`'${capitalize(t)}`));
    expect(absent, 'curated safety tokens no longer present in safetyProfile.js').toEqual([]);
  });

  it('DESTROYED_BY_FATE_KIND covers the pulse fate KINDS exactly, both ways, with boolean verdicts (EM-B1i)', () => {
    const src = read('src/domain/worldPulse/causeLifecycle.js');
    const keys = objectLiteralKeys(src, 'DESTROYED_BY_FATE_KIND').sort();
    const values = [...((/DESTROYED_BY_FATE_KIND\s*=\s*Object\.freeze\(\{([^}]*)\}/.exec(src) || ['', ''])[1]).matchAll(/:\s*(\w+)/g)].map((m) => m[1]);
    expect(values.length, 'the verdict literal went dark: no value was read from it').toBe(keys.length);
    expect(values.filter((v) => v === 'true' || v === 'false'), 'a verdict stopped being a boolean literal').toEqual(values);
    // Both ways: no verdict for a kind the leaf does not declare, and no declared kind without
    // a verdict — a fourth kind must red here rather than fall through to "not destroyed".
    expect(setDiff(keys, WORLD_PULSE_FATE_KINDS), 'dead verdict arm(s): a kind no producer declares').toEqual([]);
    expect(setDiff(WORLD_PULSE_FATE_KINDS, keys), 'kind(s) with NO verdict row — the silent default this walker exists for').toEqual([]);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// T5 ONE-REGEN REPAIRS — the formerly waived consumers now cover their complete
// producer vocabularies. These assertions keep the repaired joins total.
// ═══════════════════════════════════════════════════════════════════════════
describe('vocabularyTotality — T5 repaired consumers', () => {
  it('H15 — deriveExternalThreat branches on exactly the produced threat tiers', () => {
    const body = fnBody(read('src/domain/state/deriveSystemState.js'), 'deriveExternalThreat');
    const consumer = tokensBy(body, /monsterThreat\s*(?:===|\|\|)\s*'([^']+)'/g).sort();
    const dead = setDiff(consumer, PRODUCER_THREAT);
    const missing = setDiff(PRODUCER_THREAT, consumer);
    expect(dead, 'deriveExternalThreat must not branch on dead threat tokens').toEqual([]);
    expect(missing, 'deriveExternalThreat must handle every produced threat token').toEqual([]);
  });

  it('H16 — deriveExternalThreat matches the produced occupied stressor token', () => {
    const body = fnBody(read('src/domain/state/deriveSystemState.js'), 'deriveExternalThreat');
    expect(body).toBeTruthy();
    expect(body).toContain("'occupied'");
    expect(body).not.toContain("'occupation'");
  });

  it('H4 — factionDynamics.safetyContrib handles every produced safety prefix', () => {
    const body = fnBody(read('src/generators/factionDynamics.js'), 'safetyContrib');
    const consumer = tokensBy(body, /l\.includes\('([^']+)'\)/g);
    const missing = setDiff(PRODUCER_SAFETY_TOKENS, consumer);
    expect(missing, 'safetyContrib must classify every safety-profile prefix').toEqual([]);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// ADVERSARIAL SELF-TESTS — prove the set-diff + extractors FIRE on a planted
// mismatch and clear on the matching shape (this guard is not vacuous).
// ═══════════════════════════════════════════════════════════════════════════
describe('vocabularyTotality — adversarial self-tests (not vacuous)', () => {
  it('setDiff detects a dead arm and a missing arm, and is empty on an exact match', () => {
    expect(setDiff(['a', 'b', 'dead'], ['a', 'b'])).toEqual(['dead']);   // dead arm
    expect(setDiff(['a', 'b'], ['a', 'b', 'c'])).toEqual([]);            // no extra
    expect(setDiff(['a', 'b', 'c'], ['a', 'b'])).toEqual(['c']);         // missing
    expect(setDiff(['a', 'b'], ['a', 'b'])).toEqual([]);                 // exact
  });

  it('objectLiteralKeys extracts top-level keys and ignores nested ones', () => {
    const src = "const T = Object.freeze({\n  alpha: { nested: 1 },\n  beta: 2,\n});";
    expect(objectLiteralKeys(src, 'T').sort()).toEqual(['alpha', 'beta']);
  });

  it('fnBody brace-matches a single function body', () => {
    const src = 'function foo(x) { return x === \'q\'; }\nfunction bar() {}';
    expect(fnBody(src, 'foo')).toBe("{ return x === 'q'; }");
  });

  it('tokensBy captures + lowercases + dedupes the matched literals', () => {
    const body = "m === 'Safe' || m === 'safe' || m === 'Frontier'";
    expect(tokensBy(body, /m\s*===\s*'([^']+)'/g).sort()).toEqual(['frontier', 'safe']);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// RN-C — THE REACHABILITY-PER-SPELLING HABITAT PIN (ODQ §64.6, the WC O-9 idiom)
// ═══════════════════════════════════════════════════════════════════════════
/**
 * THE HABITAT, not the instances. rn-1's arm C removed eight orphan members from six
 * relationship admission sets. Removing them cures the instances; this pin removes the
 * HABITAT that let them accumulate — a hand-rolled admission set drifting away from the
 * vocabulary its producers can actually emit, silently, because an unmatched member is
 * indistinguishable from a member that simply has not come up yet.
 *
 * THE RULE, and it is the same exact-set-both-ways rule as the contracts above: every
 * member of every set below is EITHER declared reachable — a producer somewhere in src/
 * writes it into a relationship-type-bearing position, or the authoring vocabulary
 * `RELATIONSHIP_SELECTIONS` offers it — OR declared EXPECTED-DEAD with a written reason.
 * A set that acquires an undeclared member REDS; a declaration for a member that has
 * left REDS too, so a later cure must delete its row and bank the win here.
 */
const RELATIONSHIP_ADMISSION_SETS = Object.freeze({
  'src/domain/roads/thirdPartyRansom.js|ALLY_LIKE': Object.freeze({
    ally: 'EXPECTED-DEAD: folds to `allied` on both planes and has zero producers; kept because `allied` is admitted beside it, so the set is still correct.',
    allied: 'REACHABLE: the authoring vocabulary (RELATIONSHIP_SELECTIONS).',
    vassal: 'REACHABLE: named producers in occupation.js and relationshipRulesAdversarial.js.',
    patron: 'REACHABLE: named producer in relationshipState.js (the patron/client orientation).',
    client: 'REACHABLE: named producer in relationshipState.js.',
    defensive_pact: 'EXPECTED-DEAD UNTIL `mutual_defense` GAINS A WRITER: the chartered orphan. peaceTermsCatalog.js carries `mutual_defense` as the writer-in-waiting and records that defensive_pact edges have had five reader families and no writer.',
  }),
  'src/domain/worldPulse/convergence.js|FRIENDLY_REL': Object.freeze({
    allied: 'REACHABLE, AND THE CURE (CS-B3 / cs-6): canonicalRelationshipLabel maps ally/alliance/allies onto `allied`, and RELATIONSHIP_SELECTIONS offers `allied` — so this is the label regional-graph edges actually carry into the motive scorer. It replaced the EXPECTED-DEAD `ally` row that CR-TE18-CONVERGENCEALLIED kept as an instrument; the instrument is retired because the gap it pointed at is closed.',
    trade_partner: 'REACHABLE: the authoring vocabulary.',
    vassal: 'REACHABLE: named producers in occupation.js and relationshipRulesAdversarial.js.',
  }),
  'src/domain/worldPulse/conquestDoctrineStage.js|COALITION_FRIENDLY_LABELS': Object.freeze({
    allied: 'REACHABLE: the authoring vocabulary.',
    vassal: 'REACHABLE: named producers.',
  }),
  'src/domain/worldPulse/conquestDoctrineStage.js|COALITION_HOSTILE_LABELS': Object.freeze({
    hostile: 'REACHABLE: six named producers.',
    cold_war: 'REACHABLE: named producer, and the authoring vocabulary.',
    rival: 'REACHABLE: the authoring vocabulary.',
  }),
  'src/domain/worldPulse/warCapacityReads.js|ALLY_SUPPORT_TYPES': Object.freeze({
    allied: 'REACHABLE: the authoring vocabulary.',
    vassal: 'REACHABLE: named producers.',
    patron: 'REACHABLE: named producer.',
    defensive_pact: 'EXPECTED-DEAD UNTIL `mutual_defense` GAINS A WRITER: the chartered orphan.',
  }),
  'src/domain/worldPulse/warHomeCosts.js|LEVY_SUPPORT_TYPES': Object.freeze({
    vassal: 'REACHABLE: named producers.',
    allied: 'REACHABLE: the authoring vocabulary.',
    defensive_pact: 'EXPECTED-DEAD UNTIL `mutual_defense` GAINS A WRITER: the chartered orphan.',
  }),
});

/** Members of a `const NAME = ... new Set([...])` declaration, lowercased + sorted. */
function admissionSetMembers(src, name) {
  const m = new RegExp(`const\\s+${name}\\s*=[^[]*\\[([^\\]]*)\\]`).exec(src);
  if (!m) return null;
  return tokensBy(m[1], /'([^']+)'/g).sort();
}

describe('RN-C — relationship admission sets: every member reachable or declared dead', () => {
  it('the extractor finds real members (guard non-vacuity)', () => {
    // Without this, a rotted regex would return [] for every set and the exact-set arms
    // below would compare [] against [] for a declaration table nobody had maintained.
    const src = "const T = new Set(['alpha', 'Beta']);";
    expect(admissionSetMembers(src, 'T')).toEqual(['alpha', 'beta']);
    expect(admissionSetMembers(src, 'MISSING')).toBe(null);
  });

  it('every set resolves, and its live membership EXACTLY equals its declaration', () => {
    for (const [key, declared] of Object.entries(RELATIONSHIP_ADMISSION_SETS)) {
      const [file, name] = key.split('|');
      const live = admissionSetMembers(read(file), name);
      expect(live, `${key} did not resolve — the set was renamed or reshaped`).not.toBe(null);
      const declaredKeys = Object.keys(declared).map((k) => k.toLowerCase()).sort();
      expect(
        setDiff(live, declaredKeys),
        `${key} gained UNDECLARED member(s). Every member must be either reachable by a`
        + ' named producer or declared EXPECTED-DEAD with a written reason — that is the'
        + ' habitat rule rn-1 arm C exists to install.',
      ).toEqual([]);
      expect(
        setDiff(declaredKeys, live),
        `${key} declares member(s) that have LEFT the set. Delete their rows here in the`
        + ' same commit that removes them, so the win is banked in the diff.',
      ).toEqual([]);
    }
  });

  it('every EXPECTED-DEAD declaration carries a real written reason', () => {
    // A bare 'EXPECTED-DEAD' would let a member be parked without anyone stating why it
    // cannot arrive — which is exactly the silence this pin exists to end.
    const dead = Object.entries(RELATIONSHIP_ADMISSION_SETS)
      .flatMap(([key, d]) => Object.entries(d).map(([m, why]) => [`${key}|${m}`, why]))
      .filter(([, why]) => why.startsWith('EXPECTED-DEAD'));
    expect(dead.length, 'the expected-dead population vanished — this pin would be vacuous').toBeGreaterThan(0);
    for (const [at, why] of dead) {
      expect(why.length, `${at} has a stub reason`).toBeGreaterThan(60);
    }
  });

  it('the chartered orphan is present in ALL FOUR of its readers', () => {
    // defensive_pact is kept deliberately. If a later sweep removed it from one reader
    // but not the others, the four would silently disagree about the same edge.
    const readers = [
      'src/domain/roads/thirdPartyRansom.js',
      'src/domain/worldPulse/warCapacityReads.js',
      'src/domain/worldPulse/warHomeCosts.js',
      'src/domain/worldPulse/warAllianceRisk.js',
    ];
    for (const f of readers) {
      expect(read(f).includes("'defensive_pact'"), `${f} dropped the chartered orphan`).toBe(true);
    }
  });
});
// ═══════════════════════════════════════════════════════════════════════════
// BAND-WORD RECOVERY (DOCKET-2 item 3). Three compact display surfaces used to
// recover a band word by splitting a generated label on a punctuation mark and
// taking [0]. src/domain/display/labelBands.js replaced that guess with the
// producer's own declared vocabulary; these arms are what make the vocabulary a
// CONTRACT rather than a copy that drifts.
//
// ⛔ WHY THIS MATTERS MORE THAN IT LOOKS: the em dash was never a field separator
// in the complexity vocabulary. Six of the producer's eleven labels carry no dash
// at all, so `split('—')[0]` returned the WHOLE STRING on 174 of 360 driven
// settlements — a live defect at 5e28d5c83, not a latent one.
// ═══════════════════════════════════════════════════════════════════════════
describe('vocabularyTotality — band-word recovery (DOCKET-2 item 3)', () => {
  /** Every string deriveEconomicComplexity can return, exhausted over its own inputs. */
  const emittedComplexity = () => {
    const out = new Set();
    for (const tier of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) {
      for (let income = 0; income <= 14; income++) {
        for (let exports = 0; exports <= 14; exports++) {
          for (const hasMarket of [true, false]) {
            out.add(deriveEconomicComplexity(tier, income, exports, hasMarket));
          }
        }
      }
    }
    return [...out].sort();
  };

  it('COMPLEXITY_BAND_BY_LABEL covers deriveEconomicComplexity EXACTLY, both ways', () => {
    const emitted = emittedComplexity();
    const declared = Object.keys(COMPLEXITY_BAND_BY_LABEL).sort();
    expect(emitted.length, 'the producer vocabulary vanished — this arm would be vacuous')
      .toBeGreaterThan(1);
    expect(setDiff(declared, emitted), 'dead complexity row(s): declared, never emitted').toEqual([]);
    expect(setDiff(emitted, declared), 'unmapped complexity label(s): emitted, never declared').toEqual([]);
  });

  it('every complexity label carries a band word — 11 of 11, the chair\'s six included', () => {
    // ⭐ THIS ARM MOVED 5 → 11 ON 2026-09-05, and the six new rows are AN ATTRIBUTED ACT.
    // Until then the map declared `null` for the six labels the producer emits with no
    // band word, and SummaryTab fell back to the whole phrase on 174 of 360 driven
    // settlements. Giving those six a band is authoring reader-facing words — the §0c-3
    // class — so the words are the FABLE 5.1 CHAIR'S, authored 2026-09-05 and replayed
    // verbatim into labelBands.js by lane DOCKET-3, which measured them but did not
    // write them. The chair's stated rule: the band is the label's OWN HEAD WORD, so no
    // word reaches the reader that the label did not already carry. That rule is what
    // the `startsWith` assertion below is able to check; a word chosen any other way
    // would have needed a human to re-read the tile instead.
    //
    // TO CHANGE ONE OF THESE SIX: ask the chair. They are content, not derivation.
    const withoutBand = Object.entries(COMPLEXITY_BAND_BY_LABEL)
      .filter(([, band]) => typeof band !== 'string' || band.length === 0)
      .map(([label]) => label).sort();
    expect(withoutBand, 'complexity label(s) with no band word — the 174/360 defect, returning')
      .toEqual([]);
    expect(Object.keys(COMPLEXITY_BAND_BY_LABEL).length, 'the map emptied — this arm would be vacuous')
      .toBe(11);

    // Every band must really open its own label, or the map is fiction. With no `null`
    // rows left this now covers 11 of 11 rather than 5 of 11.
    for (const [label, band] of Object.entries(COMPLEXITY_BAND_BY_LABEL)) {
      expect(label.startsWith(band), `${label} does not open with its declared band`).toBe(true);
    }

    // The chair's six, pinned literally and read back through the accessor, so a silent
    // re-wording by a later lane reddens here rather than changing a tile in the dark.
    expect(complexityBandOf('Diversified market economy')).toBe('Diversified');
    expect(complexityBandOf('Specialized production and trade')).toBe('Specialized');
    expect(complexityBandOf('Mixed subsistence and market')).toBe('Mixed');
    expect(complexityBandOf('Agricultural surplus with trade links')).toBe('Agricultural');
    expect(complexityBandOf('Subsistence with minor surplus')).toBe('Subsistence');
    expect(complexityBandOf('Subsistence with surplus')).toBe('Subsistence');
    // A band is a CLASS, not an identifier: three labels share `Subsistence` and two
    // share `Diversified`. Declared here so a later reader does not "fix" the collision.
    expect(Object.values(COMPLEXITY_BAND_BY_LABEL).filter((b) => b === 'Subsistence')).toHaveLength(3);
    expect(Object.values(COMPLEXITY_BAND_BY_LABEL).filter((b) => b === 'Diversified')).toHaveLength(2);

    // ⚠ AND THE REFUSAL IS STILL A REFUSAL. The map is a bare object literal, so it
    // inherits Object.prototype; a `?? null` read returned the CONSTRUCTOR FUNCTION for
    // 'constructor'/'toString'/'valueOf'/'hasOwnProperty' — a function handed to a React
    // child. Unreachable from the producer, wrong all the same, and fixed by hasOwn.
    expect(complexityBandOf('constructor')).toBe(null);
    expect(complexityBandOf('toString')).toBe(null);
    expect(complexityBandOf('__proto__')).toBe(null);
    expect(complexityBandOf('Placid market economy')).toBe(null);
  });

  it('SAFETY_BANDS is bound to safetyProfile.js, and resolves every label it composes', () => {
    const profile = read('src/generators/safetyProfile.js');
    const absent = SAFETY_BANDS.filter((b) => !profile.includes(`'${b}`));
    expect(absent, 'safety band(s) no longer present in safetyProfile.js').toEqual([]);
    // Both ways with the curated token list the M2 contract above already binds.
    const curated = PRODUCER_SAFETY_TOKENS.map((t) => t.replace(/\b\w/g, (c) => c.toUpperCase())).sort();
    expect(setDiff([...SAFETY_BANDS].sort(), curated), 'band with no curated token').toEqual([]);
    expect(setDiff(curated, [...SAFETY_BANDS].sort()), 'curated token with no band').toEqual([]);
    // A composed label — including the two-dash plague form — resolves to its band.
    expect(bandOf('Dangerous — Plague Unrest — Plague Conditions', SAFETY_BANDS)).toBe('Dangerous');
    expect(bandOf('Controlled — Occupation Curfew', SAFETY_BANDS)).toBe('Controlled');
    expect(bandOf('Moderate', SAFETY_BANDS)).toBe('Moderate');
    // The LOUD refusal: an unknown label yields null, never a slice of itself.
    expect(bandOf('Placid — nothing is happening', SAFETY_BANDS)).toBe(null);
  });

  it('STABILITY_BANDS is bound to governanceNarrative.js across all three of its separator conventions', () => {
    const gov = read('src/generators/power/governanceNarrative.js');
    const absent = STABILITY_BANDS.filter((b) => !gov.includes(`'${b}`));
    expect(absent, 'stability band(s) no longer present in governanceNarrative.js').toEqual([]);
    // The producer uses ' — ', ' (…)' and '; …' — one vocabulary must cover all three.
    expect(bandOf('Fractured — no stable governing authority', STABILITY_BANDS)).toBe('Fractured');
    expect(bandOf('Critical (active siege — survival priority)', STABILITY_BANDS)).toBe('Critical');
    expect(bandOf('Stable; monster threat active', STABILITY_BANDS)).toBe('Stable');
    // Longest-first: 'Unstable' must not resolve to 'Stable', nor 'Enforced Order' to 'Ordered'.
    expect(bandOf('Unstable — criminal governance', STABILITY_BANDS)).toBe('Unstable');
    expect(bandOf('Enforced Order (authoritarian)', STABILITY_BANDS)).toBe('Enforced Order');
  });

  // ── THE INVERSE OF THE ARMS ABOVE, and the reason it belongs beside them ──────
  // Those arms stop a CONSUMER from recovering a band by splitting a producer's
  // label. This one stops the PRODUCER from recovering a condition by splitting its
  // own. safetyProfile.js composed `"<strain> — <condition>"`, then rebuilt the
  // composite by re-parsing `l.split(' — ')[1]` — and one of its own strain values
  // is `'Dangerous — Plague Unrest'`, so that leaf emits a label with TWO em dashes
  // and `[1]` recovered the STRAIN'S TAIL, not the condition. Repaired 2026-09-05 by
  // keeping the parts typed. Unreachable in the 360-world corpus (0/360 composites),
  // which is exactly why it needs a pin: nothing else in the tree would notice its
  // return, and the habitat — a producer parsing its own output — invites it back.
  it('safetyProfile composes its label from typed parts, never by re-parsing its own output', () => {
    // The producer's complete condition vocabulary, bound to the source both ways.
    const CONDITIONS = [
      'Occupation Curfew', 'Active Siege', 'Famine Conditions', 'Plague Conditions',
      'Insurgency', 'Slave Revolt', 'Wartime', 'Political Fracture', 'Succession Crisis',
      'Aftermath of Betrayal', 'Monster Threat', 'Debt Crisis', 'Mass Migration',
      'Religious Upheaval',
    ];
    const src = read('src/generators/safetyProfile.js');
    expect(CONDITIONS.filter((c) => !src.includes(`'${c}'`)), 'condition(s) no longer in the producer')
      .toEqual([]);

    // THE HABITAT: no split of a composed safety label back into its parts.
    // ⚠ THE SCAN MUST STRIP COMMENTS FIRST. The producer's own docblock QUOTES the
    // expression it stopped using, to explain why — and a naive negative scan matched
    // that explanation and reddened on a correct file. An anchored-negative walker is
    // a two-sided trap: it must not fire on prose, and it must still see real code.
    const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
    expect(code.includes("safetyStrains.push"), 'the comment stripper ate the code too')
      .toBe(true);
    expect(code.includes("split(' — ')"), 'safetyProfile re-parses its own composed label again')
      .toBe(false);
    // And the stripper really does remove the docblock that quotes the old expression.
    expect(src.includes("split(' — ')"), 'the explanatory docblock vanished — the scan is now vacuous')
      .toBe(true);

    // THE INSTANCE: the two-em-dash plague strain, in a NON-FIRST position. A low
    // safetyRatio (no military priority, no garrison) selects it.
    const cfg = { priorityMilitary: 0, priorityCriminal: 100, stressTypes: ['occupied', 'plague_onset'] };
    const label = generateSafetyProfile(cfg, 'town', []).safetyLabel;
    expect(label, 'the fixture must actually FORM a composite, or this arm is vacuous')
      .toContain(' + ');
    expect(label).toBe('Controlled — Occupation Curfew + Plague Conditions');
    // ⚠ THE MARKER MUST BE THE LINE IMMEDIATELY ABOVE THE ASSERTION — negativeAssertionAnchor
    // reads that one line, not the paragraph. A wrapped `// anchored:` reads as un-anchored
    // and moves this file's frozen row from 1 to 2, which is an exact-equality red.
    // anchored: the `toContain(' + ')` above asserts this same `label` IS a composite, so this negative cannot pass by the subject having vanished.
    expect(label, 'the strain tail leaked into the composite again').not.toContain('+ Plague Unrest');

    // THE CLASS: every appended segment, across every multi-primary combination, must
    // be a declared CONDITION — never a fragment of some strain.
    const PRIMARY = ['occupied', 'under_siege', 'famine', 'plague_onset'];
    const subsets = PRIMARY.reduce((acc, x) => acc.concat(acc.map((a) => [...a, x])), [[]])
      .filter((a) => a.length > 1);
    expect(subsets.length, 'the combination sweep emptied').toBe(11);
    let composites = 0;
    for (const stressTypes of subsets) {
      const l = generateSafetyProfile({ ...cfg, stressTypes }, 'town', []).safetyLabel;
      const appended = l.split(' + ').slice(1);
      expect(appended.length, `${stressTypes.join('+')} formed no composite`).toBeGreaterThan(0);
      composites += appended.length;
      for (const seg of appended) {
        expect(CONDITIONS, `${stressTypes.join('+')} appended a non-condition: ${seg}`).toContain(seg);
      }
    }
    expect(composites, 'no appended segment was ever examined').toBeGreaterThan(10);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// LT39 car 3 — THE INCIDENT VOCABULARY, PRODUCER ↔ CONSUMER, EXACT BOTH WAYS.
//
// THE CLASS, and it is this file's own: the relationship chronicle
// (src/domain/display/relationshipChronicle.js) is the first surface ever to put
// a relationship incident TYPE in front of a reader, and the only humanizer that
// existed for it was relationshipMemory's `titleForType`, which swaps underscores
// for spaces — so `coalition_betrayal` reached a reader as "coalition betrayal"
// and `label_proposal_applied` as "label proposal applied", which is an engine
// token wearing a space. DISPLAY_LEXICON.incidentType is the cure; THIS is what
// stops it rotting on the next emitter, which is the exact objection the lexicon's
// own header raised against giving news `kind` a bucket.
//
// FOUR ARMS, deliberately different in kind:
//   A. SCANNED PRODUCERS — every `incidentType: '…'` / `incident: '…'` literal in
//      src/domain, exact-set-both-ways against the lexicon. A new writer with no
//      row REDS; a row whose producer left REDS.
//   B. IMPORTED PRODUCERS — MEMORY_WEAVE_INCIDENT_TYPES and RELIEF_INCIDENT_KINDS,
//      read from the modules themselves, never transcribed.
//   C. CURATED PRODUCERS — the literals the two regexes structurally cannot see
//      (a positional argument, a ternary, a template tail), each BOUND BY SOURCE
//      PRESENCE in its named producer file exactly as this file's safety-token
//      contract is, so a rename or a removal reds even though the scan is blind
//      to the call shape. Plus the chronicle's OWN composed tokens, which are not
//      transcribed at all — they are obtained by DRIVING the producer.
//   D. FAMILIES — the three shapes that compose their token at write time and can
//      never have rows. Each declares its producer and the walker checks it is
//      still there.
//
// ⛔ CANNOT-CATCH, STATED HERE RATHER THAN DISCOVERED LATER: a NEW writer that
// passes an incident type as a positional argument or builds one in a ternary is
// invisible to arm A, exactly like the four coalition literals arm C carries. What
// closes the reader-facing half of that gap is not this walker but
// `incidentPhrase`'s fallback, pinned below: an unknown token still reaches the
// reader as a sentence, and `incidentDisclosure` withholds it from a non-DM
// reader, so the failure mode of a missed producer is thin words, never a leaked
// token and never a leaked secret.
// ═══════════════════════════════════════════════════════════════════════════
describe('LT39 — the incident lexicon is TOTAL over its writers (exact set, both ways)', () => {
  const SRC_DOMAIN = join(ROOT, 'src/domain');

  /** Every .js under src/domain, repo-relative. */
  const domainFiles = (dir = SRC_DOMAIN, acc = []) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const abs = join(dir, e.name);
      if (e.isDirectory()) domainFiles(abs, acc);
      else if (/\.js$/.test(e.name)) acc.push(relative(ROOT, abs).split(sep).join('/'));
    }
    return acc;
  };

  const FILES = domainFiles();

  /**
   * ARM A — the mechanically scannable producer literals.
   *
   * COMMENTS ARE STRIPPED FIRST, and that is not tidiness: without it a
   * commented-out literal would "produce" a lexicon row, and the exact-set arm
   * would then be satisfiable by prose. It also makes the negative control mean
   * something — a planted producer has to be real code to red this.
   */
  const stripComments = (src) => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

  const scannedProducers = () => {
    const out = new Set();
    for (const f of FILES) {
      const src = stripComments(readFileSync(join(ROOT, f), 'utf8'));
      for (const m of src.matchAll(/incidentType:\s*['"]([a-z0-9_]+)['"]/g)) out.add(m[1]);
      for (const m of src.matchAll(/\bincident:\s*['"]([a-z0-9_]+)['"]/g)) out.add(m[1]);
    }
    return out;
  };

  /**
   * ARM C — the literals the regexes structurally cannot see, each with the file
   * that writes it and the CALL SHAPE that hides it from the scan.
   */
  const CURATED = Object.freeze({
    coalition_settlement_paid: ['src/domain/worldPulse/warCoalitionSettlement.js', 'a POSITIONAL argument to archiveSettlementAction'],
    coalition_settlement_unpaid: ['src/domain/worldPulse/warCoalitionSettlement.js', 'a POSITIONAL argument to archiveSettlementAction'],
    coalition_reimbursement_paid: ['src/domain/worldPulse/warCoalitionSettlement.js', 'a TERNARY on the payment status'],
    coalition_reimbursement_unpaid: ['src/domain/worldPulse/warCoalitionSettlement.js', 'a TERNARY on the payment status'],
    label_proposal_applied: ['src/domain/worldPulse/relationshipEvolution.js', 'a history-row `type:` write, not an incidentType key'],
    hierarchy_resolution: ['src/domain/worldPulse/relationshipHierarchy.js', 'a history-row `type:` write, not an incidentType key'],
    party_broker_relationship: ['src/domain/worldPulse/partyImpact.js', 'the `party_${kind}` template tail'],
    party_inflame_relationship: ['src/domain/worldPulse/partyImpact.js', 'the `party_${kind}` template tail'],
  });

  /** The tail each curated template row must be found by (the template hides the whole token). */
  const CURATED_SOURCE_TOKEN = Object.freeze({
    party_broker_relationship: 'broker_relationship',
    party_inflame_relationship: 'inflame_relationship',
  });

  /**
   * ARM C (second half) — the chronicle's OWN composed tokens, obtained by DRIVING
   * relationshipChronicle rather than transcribing its template. A transcription
   * would agree with itself forever; this cannot.
   */
  const COALITION_STATUSES = Object.freeze({
    settlement_transfer: ['paid', 'partial', 'unpaid'],
    reimbursement: ['paid', 'partial', 'unpaid'],
    forgiveness: ['forgiven'],
    separate_peace: ['recorded'],
  });

  const composedProducers = () => {
    const coalitionSettlements = [];
    for (const [action, statuses] of Object.entries(COALITION_STATUSES)) {
      for (const status of statuses) {
        coalitionSettlements.push({ actionId: `${action}.${status}`, tick: 1, action, status, toId: 'b' });
      }
    }
    const allianceCalls = ['joined', 'refused'].map((decision) => ({
      callId: `call.${decision}`, tick: 1, decision, enemyId: 'c',
    }));
    const rows = relationshipChronicle({
      worldState: { relationshipStates: { 'rel.a.b': { relationshipType: 'allied', coalitionSettlements, allianceCalls } } },
      regionalGraph: { edges: [{ from: 'a', to: 'b' }] },
      includeCovert: true,
    });
    return new Set((rows[0]?.lines || []).map((l) => l.type));
  };

  it('the extractors are not vacuous — each finds real members', () => {
    const scanned = scannedProducers();
    expect(FILES.length, 'src/domain emptied').toBeGreaterThan(200);
    expect(scanned.size, 'the incident-literal scan found nothing').toBeGreaterThan(40);
    expect(scanned.has('raid'), 'the scan missed a literal it can see').toBe(true);
    expect(composedProducers().size, 'driving the chronicle composed no types').toBe(10);
    expect(Object.keys(MEMORY_WEAVE_INCIDENT_TYPES).length).toBeGreaterThan(0);
    expect(RELIEF_INCIDENT_KINDS.length).toBeGreaterThan(0);
  });

  it('every CURATED row is still literally written by the file that claims it', () => {
    // The safety-token precedent: the regex cannot see these call shapes, so the
    // binding is source presence. A rename or a removal reds here.
    for (const [token, [file, shape]] of Object.entries(CURATED)) {
      const needle = CURATED_SOURCE_TOKEN[token] || token;
      expect(readFileSync(join(ROOT, file), 'utf8').includes(`'${needle}'`)
        || readFileSync(join(ROOT, file), 'utf8').includes(`"${needle}"`),
      `${token} is declared as ${shape} in ${file}, and that file no longer contains it`).toBe(true);
    }
  });

  it('DISPLAY_LEXICON.incidentType === the producer set, EXACTLY, in both directions', () => {
    const producers = [...new Set([
      ...scannedProducers(),
      ...Object.values(MEMORY_WEAVE_INCIDENT_TYPES),
      ...RELIEF_INCIDENT_KINDS,
      ...Object.keys(CURATED),
      ...composedProducers(),
    ])].sort();
    const consumers = Object.keys(DISPLAY_LEXICON.incidentType).sort();
    expect(
      setDiff(producers, consumers),
      'a writer emits an incident type with NO lexicon row — it would reach a reader as an '
      + 'engine token. Author its clause in DISPLAY_LEXICON.incidentType (and its row in '
      + 'INCIDENT_DISCLOSURE) rather than widening this walker.',
    ).toEqual([]);
    expect(
      setDiff(consumers, producers),
      'a lexicon row has no producer left — delete it in the same commit that removed its '
      + 'writer, so the table cannot rot into a list of words nothing can say.',
    ).toEqual([]);
  });

  it('INCIDENT_DISCLOSURE covers the lexicon EXACTLY, in both directions', () => {
    // A row with words but no disclosure class would be withheld from every reader
    // (fail-closed, so not a leak) and would silently never render — a hole that
    // looks like a quiet relationship.
    const words = Object.keys(DISPLAY_LEXICON.incidentType).sort();
    const classes = Object.keys(INCIDENT_DISCLOSURE).sort();
    expect(setDiff(words, classes), 'these types have a clause but no disclosure class').toEqual([]);
    expect(setDiff(classes, words), 'these types have a disclosure class but no clause').toEqual([]);
    for (const [k, v] of Object.entries(INCIDENT_DISCLOSURE)) {
      expect(['public', 'covert'], `${k} has an unknown disclosure class`).toContain(v);
    }
    // Non-vacuity of the secrets seam: BOTH classes must actually occur, or the
    // gate is either "show everything" or "show nothing" wearing a table.
    const values = new Set(Object.values(INCIDENT_DISCLOSURE));
    expect([...values].sort()).toEqual(['covert', 'public']);
  });

  it('ARM D — every open family still has the producer it names', () => {
    expect(INCIDENT_FAMILIES.length, 'the family register emptied').toBeGreaterThan(0);
    for (const family of INCIDENT_FAMILIES) {
      expect(readFileSync(join(ROOT, family.producer), 'utf8').includes(family.prefix),
        `the ${family.id} family declares ${family.producer} as its writer, and that file no `
        + 'longer contains the prefix').toBe(true);
      expect(family.prefix.length, `${family.id} has an empty prefix`).toBeGreaterThan(2);
    }
  });

  it('NO CLAUSE IS A TOKEN — not an authored row, not a family, not the fallback', () => {
    expect(Object.keys(DISPLAY_LEXICON.incidentType).length, 'the lexicon emptied').toBeGreaterThan(50);
    for (const [token, clause] of Object.entries(DISPLAY_LEXICON.incidentType)) {
      // anchored: the bucket is asserted non-empty one line above and each clause's word count one line below, so an emptied table cannot make this absence pass.
      expect(clause, `${token} kept an underscore`).not.toMatch(/_/);
      expect(clause.split(' ').length, `${token} is too terse to be a clause`).toBeGreaterThanOrEqual(3);
      expect(clause[0], `${token} does not open like a sentence`).toBe(clause[0].toUpperCase());
    }
    // The three answers incidentPhrase can give, each proved to be English.
    expect(incidentPhrase('raid')).toBe('A raid crossed the border');
    expect(incidentPhrase('stressor_resolved:under_siege')).toMatch(/^The pressure they shared ended/);
    const unknown = incidentPhrase('brand_new_engine_token');
    // anchored: the two assertions below sit on the value just computed from a live call, not on an absent one.
    expect(unknown).toMatch(/^Something the record types only as/);
    // anchored: the toMatch one line above proves `unknown` is the live fallback sentence, so this absence cannot be satisfied by an empty string.
    expect(unknown, 'the fallback leaked the raw token').not.toMatch(/brand_new/);
    // And an unknown token is withheld from a non-DM reader rather than guessed public.
    expect(incidentDisclosure('brand_new_engine_token')).toBe('unclassified');
    expect(incidentDisclosure('raid')).toBe('public');
    expect(incidentDisclosure('espionage')).toBe('covert');
  });
});
