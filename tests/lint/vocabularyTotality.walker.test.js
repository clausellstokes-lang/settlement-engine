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
    ally: 'EXPECTED-DEAD, AND THE DEFECT IS THE REASON (CR-TE18-CONVERGENCEALLIED): relType here is read RAW off a regional-graph edge, which carries CANONICAL labels, so `ally` can never arrive — and `allied`, which can, is ABSENT from this set. Adding it moves generated output, so it is a chair surface. This row is the instrument pointing at that gap and must not be quietly deleted.',
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
