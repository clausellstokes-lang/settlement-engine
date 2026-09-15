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
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
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
    // ⭐ THE PRODUCER NOW EMITS ONE CONVENTION, `<Band> (<gloss>)`, SINCE LT41b RULING 3
    // (the chair, 2026-09-15). THE VOCABULARY DID NOT MOVE BY ONE WORD — that is the
    // point of binding on the BAND rather than on the separator, and this arm is the
    // proof: not a single entry above was added, removed or re-spelled to land it.
    // The three assertions below are KEPT AS THEY WERE, because all three spellings are
    // PERSISTED on saves and keep arriving here; they are now tolerance rather than a
    // description of the producer. The live twins are pinned in the arm beneath.
    expect(bandOf('Fractured — no stable governing authority', STABILITY_BANDS)).toBe('Fractured');
    expect(bandOf('Critical (active siege — survival priority)', STABILITY_BANDS)).toBe('Critical');
    expect(bandOf('Stable; monster threat active', STABILITY_BANDS)).toBe('Stable');
    // Longest-first: 'Unstable' must not resolve to 'Stable', nor 'Enforced Order' to 'Ordered'.
    expect(bandOf('Unstable — criminal governance', STABILITY_BANDS)).toBe('Unstable');
    expect(bandOf('Enforced Order (authoritarian)', STABILITY_BANDS)).toBe('Enforced Order');
  });

  it('the NINE RETIRED stability spellings recover the same band as their live twins (persisted saves)', () => {
    // ⛔ THE LIFECYCLE ARM LT41b RULING 3 OWES. `powerStructure.stability` is PERSISTED in
    // every save ever written; the ruling collapsed the producer's three separator
    // conventions onto `<Band> (<gloss>)` with NO migration and NO save rewrite, because
    // every existing world is test data (the owner's law). So the retired spellings are
    // not history — they are live input to this recovery for as long as the product
    // exists, and the recovery must answer them IDENTICALLY, forever.
    //
    // Each row is [retired spelling, live spelling]. The arm asserts the band is the same
    // on both AND that the band is non-null, so a recovery that started returning null
    // for everything could not pass by making the two sides equally wrong.
    const gov = read('src/generators/power/governanceNarrative.js');
    const RETIRED_TO_LIVE = [
      ['Unstable — criminal governance', 'Unstable (criminal governance)'],
      ['Critical (active siege — survival priority)', 'Critical (active siege, survival priority)'],
      ['Fractured — no stable governing authority', 'Fractured (no stable governing authority)'],
      ['Shaken — institutional trust collapsed', 'Shaken (institutional trust collapsed)'],
      ['Desperate — hunger is eroding order', 'Desperate (hunger is eroding order)'],
      ['Anxious — disease is overriding normal authority', 'Anxious (disease is overriding normal authority)'],
      ['Volatile — power is available to whoever moves first', 'Volatile (power is available to whoever moves first)'],
      ['Strained — debt obligations constrain every decision', 'Strained (debt obligations constrain every decision)'],
      ['Tense — regional monster threat', 'Tense (regional monster threat)'],
    ];
    expect(RETIRED_TO_LIVE.length, 'the ruling retired exactly nine spellings').toBe(9);
    for (const [retired, live] of RETIRED_TO_LIVE) {
      const band = bandOf(live, STABILITY_BANDS);
      expect(band, `no band for the LIVE label ${live}`).not.toBeNull();
      expect(bandOf(retired, STABILITY_BANDS), `retired ${retired}`).toBe(band);
      // The two really are different strings, or this arm asserts nothing.
      expect(retired).not.toBe(live);
      // And the LIVE spelling is the one the producer actually ships today.
      expect(gov.includes(`'${live}'`), `producer no longer emits ${live}`).toBe(true);
    }
    // The retired `<Band>; <note>` annotation form, which the fold replaced, recovers too.
    expect(bandOf('Unstable (pervasive organized crime); monster threat active', STABILITY_BANDS))
      .toBe(bandOf('Unstable (pervasive organized crime, monster threat active)', STABILITY_BANDS));
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
