/**
 * faithUnseatingDormancyFence.test.js — the WF-1 faith-unseating dormancy fence
 * (LGT-P13-FENCES, the lighting wave's L-HOMES car 3).
 *
 * ⭐⭐ THE GAP THIS FILE CLOSES, named precisely, because a fence that duplicates an existing
 * proof is an elaborate way of saying nothing. `tests/domain/patronFall.test.js` and
 * `tests/domain/warTermination.test.js` already drive this flag OFF and ON through the real
 * pulse and compare `religionStates` raw, and those arms survive lighting because both rules
 * objects are literals in those files. Two things nothing carried:
 *
 *   1. A SITE CENSUS. This key is read at FOUR places in `src/`, in four different modules
 *      and three different receiver spellings, and no test ever named the set. A gate whose
 *      sites nobody enumerates is a gate one of whose sites can be deleted green.
 *   2. THE TRUTHY-NON-TRUE PROBE. Every existing arm drives `false` and `true`. The door is
 *      `=== true`, not `!!` — a rules object carrying `1`, `'true'` or `{}` under this key
 *      (a hand-edited save, a legacy normalizer, a coerced query param) must leave the layer
 *      dark, and until this file nothing asserted that it does.
 *
 * ⛔ THE DRIVEN FENCE IS THE PROJECTION, deliberately, and the reason is cost rather than
 * taste: `projectReligionStateOntoSettlement` is pure, takes the rules bag as its own
 * parameter, and carries the read at `religionState.js:649` — the one site whose dark half is
 * an ABSENT KEY on a persisted read-model rather than a value. The three heavier sites are
 * driven through the pulse by the two files named above; this fence pins the set they live in
 * and the polarity none of them tests.
 *
 * ⛔ EVERY FENCE CARRIES ITS OWN LIT-MUTANT CONTROL. "The dark projection had no patronFall"
 * is trivially true of a state that never recorded a fall, so every dark assertion sits
 * beside the SAME fixture read with the flag lit, producing a real fall on the profile. A
 * DORMANCY CLAIM IS A BIT CLAIM: the arms compare sha256 over the whole projected settlement.
 *
 * ⛔ THE FENCE IS THE FLAG AND THE RING, never the ring alone — the leaf's own law. The ring
 * is HISTORY and immutable under THE PROMISE, so a world lit once and then darkened keeps it
 * forever; gating on the ring would render a fall in a dark world. Fence 2 drives exactly
 * that world: a state whose `patronFalls` is populated, under dark rules.
 *
 * ⛔ NO 64-HEX LITERAL IS AUTHORED HERE. Both sides of every comparison are computed in-file.
 * A pinned 64-hex string under `tests/property/` is a recorded corpus constant to
 * `tests/lint/goldenFreeze.walker.test.js`, owing a row against an UNFROZEN register whose
 * measured fields must stay null until the freeze act signs them.
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

import { projectReligionStateOntoSettlement } from '../../src/domain/worldPulse/religionState.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** @param {unknown} value */
const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

/** The four modules that read this key by name with the strict idiom, measured at this tip. */
const DECLARED_GATE_SITES = Object.freeze([
  'src/domain/worldPulse/pulseKernel.js',
  'src/domain/worldPulse/religionState.js',
  'src/domain/worldPulse/religiousContest.js',
  'src/domain/worldPulse/warTermination.js',
]);

const SETTLEMENT = Object.freeze({ name: 'Ashford', tier: 'town', config: {} });

/** A live pantheon with a RECORDED FALL in its ring — the world the flag-and-ring law is about. */
const STATES = Object.freeze({
  s1: {
    patronRef: 'sun-old',
    deities: {
      'sun-old': { snapshot: { name: 'The Sun' }, niche: 'sun', share: 60, standing: 'ascendant', legitimacy: 0.7 },
      'moon-new': { snapshot: { name: 'The Moon' }, niche: 'moon', share: 40, standing: 'rising', legitimacy: 0.4 },
    },
    patronFalls: [{ deityRef: 'old-one', cause: 'discredited', tick: 12 }],
  },
});

/**
 * Every rules bag that must leave the layer dark. `null` and `{}` are the shapes a campaign
 * that never lights this key actually holds; the rest are the truthy-non-true probes.
 * @type {ReadonlyArray<readonly [string, Record<string, unknown>|null]>}
 */
const DARK_RULES = Object.freeze([
  ['null_bag', null],
  ['absent', {}],
  ['false', { faithUnseatingEnabled: false }],
  ['one', { faithUnseatingEnabled: 1 }],
  ['string_true', { faithUnseatingEnabled: 'true' }],
  ['object', { faithUnseatingEnabled: {} }],
  ['array', { faithUnseatingEnabled: [] }],
]);

/** ⚠ Spelled as a LITERAL: a computed member access attributes to no key. */
const LIT_RULES = Object.freeze({ faithUnseatingEnabled: true });

/** @param {Record<string, unknown>|null} rules */
const project = (rules) => projectReligionStateOntoSettlement(
  { ...SETTLEMENT }, STATES, 's1', null, null, rules,
);

describe('WF-1 FENCE 1 — the gate-polarity census over the projection, with its lit mutant', () => {
  test('THE LIT MUTANT first: the same ring, lit, really reaches the read-model', () => {
    const profile = project({ ...LIT_RULES }).config.faithProfile;
    expect(Object.prototype.hasOwnProperty.call(profile, 'patronFall')).toBe(true);
    expect(profile.patronFall).toEqual({ deityRef: 'old-one', cause: 'discredited', tick: 12 });
  });

  test('every dark spelling leaves the key ABSENT — not null, not empty: absent', () => {
    for (const [label, rules] of DARK_RULES) {
      const profile = project(rules ? { ...rules } : rules).config.faithProfile;
      expect(
        Object.prototype.hasOwnProperty.call(profile, 'patronFall'),
        `${label}: the dark projection materialized a patronFall key`,
      ).toBe(false);
    }
  });

  test('the projected settlement is byte-identical across every dark spelling, and the lit one is not', () => {
    const baseline = hash(project(null));
    for (const [label, rules] of DARK_RULES) {
      expect(hash(project(rules ? { ...rules } : rules)), `${label} moved the projection`).toBe(baseline);
    }
    // ANTI-VACUITY: the identical comparator SEES the lit projection. Without this the
    // equality above would hold just as well over seven identical failures.
    expect(hash(project({ ...LIT_RULES })) === baseline,
      'the lit projection hashed the same as the dark one — this comparator compares nothing')
      .toBe(false);
  });
});

describe('WF-1 FENCE 2 — the fence is THE FLAG AND THE RING, never the ring alone', () => {
  test('a world whose ring is FULL still projects nothing while the flag is dark', () => {
    // THE PROMISE's consequence, driven rather than asserted: lived history is immutable, so a
    // world lit once and darkened later keeps its falls forever. A fence that gated on the ring
    // would render one in a dark world; this fixture IS that world.
    expect(STATES.s1.patronFalls.length).toBeGreaterThan(0);
    expect(Object.prototype.hasOwnProperty.call(project({ faithUnseatingEnabled: false }).config.faithProfile, 'patronFall'))
      .toBe(false);
    // And the converse half, so the pair is a fence rather than half a claim: an EMPTY ring
    // under a LIT flag also projects nothing — the flag alone never invents a fall.
    const ringless = {
      s1: { ...STATES.s1, patronFalls: [] },
    };
    const litOverEmptyRing = projectReligionStateOntoSettlement(
      { ...SETTLEMENT }, ringless, 's1', null, null, { ...LIT_RULES },
    );
    expect(Object.prototype.hasOwnProperty.call(litOverEmptyRing.config.faithProfile, 'patronFall'))
      .toBe(false);
  });

  test('the projection is an identity no-op for a settlement with no state at all', () => {
    const untouched = projectReligionStateOntoSettlement({ ...SETTLEMENT }, {}, 's1', null, null, { ...LIT_RULES });
    expect(untouched.config).toEqual({});
  });
});

// ── THE SITE CENSUS ───────────────────────────────────────────────────────────────────

/** @param {string} dir @param {string[]} out */
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (full.endsWith('.js') || full.endsWith('.jsx')) out.push(full);
  }
  return out;
}

/** Files under `src/` carrying a strict by-name read of `key`, by relative path. */
function gateSitesFor(/** @type {string} */ key) {
  const needle = new RegExp(`${key}\\s*===\\s*true`);
  return walk(join(ROOT, 'src'))
    .filter((full) => needle.test(readFileSync(full, 'utf8')))
    .map((full) => relative(ROOT, full))
    .sort();
}

describe('WF-1 FENCE 3 — the four gate sites are named, and the set is closed', () => {
  test('the scanner is live and discriminating: a sibling key resolves to a different set', () => {
    // GUARD-THE-GUARD. A mis-rooted or emptied scan would report the same answer for every key
    // and make the census below a green about nothing. The sibling is a REAL gated key, so no
    // fabricated flag name is authored anywhere in this file.
    const sibling = gateSitesFor('warMemoryEnabled');
    expect(sibling.length).toBeGreaterThan(0);
    expect(sibling).not.toEqual(DECLARED_GATE_SITES);
  });

  test('each declared site really carries the read', () => {
    const found = gateSitesFor('faithUnseatingEnabled');
    for (const site of DECLARED_GATE_SITES) {
      // The sibling-key arm above proves this scanner returns a non-empty, key-specific set,
      // so an emptied scan reds there before this membership check could pass on nothing.
      expect(found, `${site} no longer carries a strict by-name read of this key`).toContain(site);
    }
  });

  test('and NO OTHER module carries one — the set is exactly four', () => {
    // ⚠ WHAT A RED HERE MEANS, so the reader is not left guessing. A FIFTH file carrying this
    // spelling is either (a) a real new gate site, which must join DECLARED_GATE_SITES in the
    // same commit that lands it — the CQ5 one-commit law, one layer out — or (b) prose that
    // happens to quote the idiom, which should be reworded. This arm EXPOSES the change; it
    // does not decide which of the two it is.
    expect(gateSitesFor('faithUnseatingEnabled')).toEqual([...DECLARED_GATE_SITES]);
  });
});

describe('WF-1 FENCE 4 — the dark claim survives the day the default lights', () => {
  test('every rules object here is built in this file, so no arm inherits a default', () => {
    // THE POINT OF THE CAR. Once a preset carries `faithUnseatingEnabled`, a fence resting on
    // "the default is dark" would begin measuring a lit world and go on passing. These are
    // literals; the dark arms keep exercising darkness for as long as the gate exists.
    expect(DARK_RULES.map(([label]) => label))
      .toEqual(['null_bag', 'absent', 'false', 'one', 'string_true', 'object', 'array']);
    expect(LIT_RULES).toEqual({ faithUnseatingEnabled: true });
    expect(DARK_RULES.some(([, rules]) => rules && rules.faithUnseatingEnabled === true)).toBe(false);
  });
});
