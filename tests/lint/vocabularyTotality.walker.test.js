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
