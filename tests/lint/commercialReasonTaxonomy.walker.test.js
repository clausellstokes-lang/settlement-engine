/**
 * commercialReasonTaxonomy.walker.test.js — TR-1's TOTALITY + BIJECTION walker, and the
 * structural half of J-TR-2's fence.
 *
 * THE CLASS. A typed casus taxonomy is only worth what its walker enforces. War's has
 * been walker-held for totality and bijection since W-PEACE-1, and the reason is not
 * tidiness: a cause with no mirror is a ratchet — the world can acquire that grievance
 * and never shed it — and a mirror shared by two causes makes the resolution ambiguous.
 * Commerce's taxonomy earns the same guard on its first day, not on the day it breaks.
 *
 * THE SECOND CLASS, AND THE SHARPER ONE (J-TR-2). "The war taxonomy is the SHAPE
 * template, never shared code" is a sentence in a design volume, which is to say it is
 * enforced by whoever remembers it. The cheapest way for it to fail is not malice, it is
 * convenience: a later wave reaches for `REASON_MIRRORS` because it is right there and
 * already does the job, and from then on adding a war casus silently widens commerce's
 * taxonomy. So this file asserts the fence STRUCTURALLY — the taxonomy leaf imports
 * NOTHING AT ALL, no TR module imports the war reason modules, and the two type sets are
 * measured DISJOINT.
 *
 * GUARD THE GUARD. `auditCommercialTaxonomy` is a pure set function, so this file drives
 * it with synthetic taxonomies and asserts it REDS on each failure shape BEFORE asserting
 * the live taxonomy is clean. Without that step a broken auditor passes everything below
 * on empty sets — which is exactly how a walker comes to be believed.
 *
 * @enforced-by this file
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  BELIEF_SOURCED_SEVERANCE_TYPES,
  COMMERCIAL_REASON_MIRRORS,
  COMMERCIAL_REASON_TYPES,
  PARTNERSHIP_REASON_TYPES,
  SEVERANCE_REASON_TYPES,
  commercialReasonMirrorOf,
  isCommercialReasonType,
  isPartnershipReasonType,
  isSeveranceReasonType,
} from '../../src/domain/worldPulse/commercialReasonTaxonomy.js';
import {
  PEACE_REASON_TYPES,
  WAR_REASON_TYPES,
} from '../../src/domain/worldPulse/warReasonTaxonomy.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const TAXONOMY_PATH = 'src/domain/worldPulse/commercialReasonTaxonomy.js';
const ANNEX_PATH = 'docs/content/RECEIPT_POOLS_TRADE.md';

/**
 * The pure audit. Returns every way a force/mirror table can be wrong, so the tests below
 * can drive it with synthetic inputs and prove each arm reds.
 * @param {{ forces: ReadonlyArray<string>, mirrors: ReadonlyArray<string>,
 *   table: Readonly<Record<string, string>> }} input
 */
export function auditCommercialTaxonomy({ forces, mirrors, table }) {
  const sorted = (list) => [...list].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  const forceSet = new Set(forces);
  const mirrorSet = new Set(mirrors);
  const keys = Object.keys(table);
  // A force with no row in the mirror table — the ratchet direction.
  const unmirroredForces = sorted(forces.filter((type) => !(type in table)));
  // A mirror no force points at — an orphan the world can never reach.
  const unreachedMirrors = sorted(mirrors.filter((type) => !Object.values(table).includes(type)));
  // A table row naming a force or a mirror the taxonomy does not carry.
  const inventedKeys = sorted(keys.filter((type) => !forceSet.has(type)));
  const inventedValues = sorted(Object.values(table).filter((type) => !mirrorSet.has(type)));
  // Two forces sharing one mirror — the ambiguous resolution.
  const seen = new Map();
  const sharedMirrors = [];
  for (const key of sorted(keys)) {
    const mirror = table[key];
    if (seen.has(mirror)) sharedMirrors.push(`${seen.get(mirror)}+${key} -> ${mirror}`);
    else seen.set(mirror, key);
  }
  // A type living on both sides at once.
  const straddling = sorted(forces.filter((type) => mirrorSet.has(type)));
  return {
    ok: unmirroredForces.length === 0 && unreachedMirrors.length === 0
      && inventedKeys.length === 0 && inventedValues.length === 0
      && sharedMirrors.length === 0 && straddling.length === 0,
    unmirroredForces,
    unreachedMirrors,
    inventedKeys,
    inventedValues,
    sharedMirrors,
    straddling,
  };
}

/** Every non-test .js under src/domain, repo-relative. */
function domainModules() {
  /** @param {string} dir @param {string[]} out */
  const walk = (dir, out = []) => {
    for (const entry of readdirSync(dir)) {
      const p = join(dir, entry);
      if (statSync(p).isDirectory()) walk(p, out);
      else if (/\.js$/.test(p) && !/\.test\./.test(p)) out.push(p);
    }
    return out;
  };
  return walk(join(ROOT, 'src/domain'))
    .map((p) => relative(ROOT, p).replace(/\\/g, '/'))
    .sort();
}

describe('TR-1 commercial reason taxonomy — guard the guard', () => {
  test('the auditor reds on every failure shape', () => {
    const clean = {
      forces: ['a_cut', 'b_cut'],
      mirrors: ['a_kept', 'b_kept'],
      table: { a_cut: 'a_kept', b_cut: 'b_kept' },
    };
    expect(auditCommercialTaxonomy(clean).ok, 'a clean taxonomy must audit clean, or every red below is meaningless').toBe(true);

    // 1. THE MUTANT THE ARCHITECTURE NAMES: a ninth severance type with no mirror.
    const unmirrored = auditCommercialTaxonomy({
      ...clean, forces: [...clean.forces, 'c_cut'],
    });
    expect(unmirrored.ok).toBe(false);
    expect(unmirrored.unmirroredForces).toEqual(['c_cut']);

    // 2. An orphan mirror nothing can reach.
    const orphan = auditCommercialTaxonomy({ ...clean, mirrors: [...clean.mirrors, 'c_kept'] });
    expect(orphan.ok).toBe(false);
    expect(orphan.unreachedMirrors).toEqual(['c_kept']);

    // 3. A table row naming a type the taxonomy does not carry, both sides.
    const inventedKey = auditCommercialTaxonomy({
      ...clean, table: { ...clean.table, ghost_cut: 'a_kept' },
    });
    expect(inventedKey.inventedKeys).toEqual(['ghost_cut']);
    const inventedValue = auditCommercialTaxonomy({
      ...clean, table: { ...clean.table, b_cut: 'ghost_kept' },
    });
    expect(inventedValue.inventedValues).toEqual(['ghost_kept']);

    // 4. Two forces sharing one mirror — the ambiguous resolution.
    const shared = auditCommercialTaxonomy({ ...clean, table: { a_cut: 'a_kept', b_cut: 'a_kept' } });
    expect(shared.ok).toBe(false);
    expect(shared.sharedMirrors).toEqual(['a_cut+b_cut -> a_kept']);

    // 5. A type on both sides at once.
    const straddle = auditCommercialTaxonomy({
      forces: ['a_cut', 'shared'],
      mirrors: ['a_kept', 'shared'],
      table: { a_cut: 'a_kept', shared: 'shared' },
    });
    expect(straddle.ok).toBe(false);
    expect(straddle.straddling).toEqual(['shared']);
  });
});

describe('TR-1 commercial reason taxonomy — the live taxonomy', () => {
  test('eight forces, eight mirrors, and a total bijection with no exemptions', () => {
    expect(SEVERANCE_REASON_TYPES).toHaveLength(8);
    expect(PARTNERSHIP_REASON_TYPES).toHaveLength(8);
    expect(COMMERCIAL_REASON_TYPES).toHaveLength(16);
    expect(new Set(COMMERCIAL_REASON_TYPES).size).toBe(16);
    const audit = auditCommercialTaxonomy({
      forces: SEVERANCE_REASON_TYPES,
      mirrors: PARTNERSHIP_REASON_TYPES,
      table: COMMERCIAL_REASON_MIRRORS,
    });
    expect(audit).toMatchObject({
      ok: true,
      unmirroredForces: [],
      unreachedMirrors: [],
      inventedKeys: [],
      inventedValues: [],
      sharedMirrors: [],
      straddling: [],
    });
  });

  test('the mirror lookup is total in BOTH directions', () => {
    // The reverse index is derived from the forward table, so this cannot pass by a
    // hand-maintained second map agreeing with the first by luck.
    for (const type of SEVERANCE_REASON_TYPES) {
      expect(commercialReasonMirrorOf(type), type).toBe(COMMERCIAL_REASON_MIRRORS[type]);
      expect(commercialReasonMirrorOf(COMMERCIAL_REASON_MIRRORS[type]), type).toBe(type);
      expect(isSeveranceReasonType(type)).toBe(true);
      expect(isPartnershipReasonType(type)).toBe(false);
    }
    for (const type of PARTNERSHIP_REASON_TYPES) {
      expect(isPartnershipReasonType(type), type).toBe(true);
      expect(isCommercialReasonType(type), type).toBe(true);
    }
    // anchored: the sixteen live types all resolve one line above, so a lookup that had
    // started answering for everything reds here rather than passing silently.
    expect(commercialReasonMirrorOf('not_a_commercial_reason')).toBeNull();
    expect(isCommercialReasonType('grievance')).toBe(false);
  });

  test('the belief-sourced pair is named as data and is a real subset', () => {
    expect(BELIEF_SOURCED_SEVERANCE_TYPES).toEqual(['famine_profiteering', 'contraband_injury']);
    for (const type of BELIEF_SOURCED_SEVERANCE_TYPES) {
      expect(SEVERANCE_REASON_TYPES, type).toContain(type);
    }
    // Non-vacuity: it is a PROPER subset, so "belief-sourced" still means something.
    expect(BELIEF_SOURCED_SEVERANCE_TYPES.length).toBeLessThan(SEVERANCE_REASON_TYPES.length);
  });

  test('every constant is frozen, so a consumer cannot widen the taxonomy at runtime', () => {
    for (const frozen of [
      SEVERANCE_REASON_TYPES, PARTNERSHIP_REASON_TYPES, COMMERCIAL_REASON_TYPES,
      COMMERCIAL_REASON_MIRRORS, BELIEF_SOURCED_SEVERANCE_TYPES,
    ]) {
      expect(Object.isFrozen(frozen)).toBe(true);
    }
    expect(() => {
      /** @type {any} */ (SEVERANCE_REASON_TYPES).push('mutation_probe');
    }).toThrow();
  });
});

describe('TR-1 / J-TR-2 — the war taxonomy is a SHAPE template, structurally', () => {
  test('the taxonomy leaf imports nothing at all', () => {
    const source = readFileSync(join(ROOT, TAXONOMY_PATH), 'utf8');
    const imports = [...source.matchAll(/^\s*(?:import|export)\b[^;'"]*?from\s*['"]([^'"]+)['"]/gm)]
      .map((match) => match[1]);
    expect(imports, `${TAXONOMY_PATH} acquired an import — it is the dependency-free authority`)
      .toEqual([]);
    // anchored: the same regex finds war's own imports in its own writer, so an empty
    // result here cannot be an extractor that stopped matching.
    const warWriter = readFileSync(join(ROOT, 'src/domain/worldPulse/warReasons.js'), 'utf8');
    expect([...warWriter.matchAll(/^\s*(?:import|export)\b[^;'"]*?from\s*['"]([^'"]+)['"]/gm)].length)
      .toBeGreaterThan(5);
  });

  test('no TR module imports the war reason modules, and the type sets are disjoint', () => {
    const trModules = domainModules().filter((rel) => /\/commercial[A-Z]/.test(rel));
    expect(trModules.length, 'the TR module family emptied — re-aim this scan').toBeGreaterThanOrEqual(4);
    /** @type {string[]} */
    const offenders = [];
    for (const rel of trModules) {
      const source = readFileSync(join(ROOT, rel), 'utf8');
      if (/from\s*['"][^'"]*war(?:Reasons|ReasonTaxonomy|Reason)/.test(source)) offenders.push(rel);
    }
    expect(offenders, 'a TR module imports war\'s reasons — J-TR-2 forbids shared code').toEqual([]);
    // DISJOINT SETS. Two taxonomies that shared even one spelling would be one taxonomy
    // wearing two names, and the first wave to add a war casus would widen commerce's.
    const warSide = new Set([...WAR_REASON_TYPES, ...PEACE_REASON_TYPES]);
    const overlap = COMMERCIAL_REASON_TYPES.filter((type) => warSide.has(type));
    expect(overlap).toEqual([]);
    // anchored: the war sets are non-empty, so the disjointness above is a real
    // measurement rather than a comparison against nothing.
    expect(warSide.size).toBeGreaterThanOrEqual(32);
  });

  test('NO TR PIN HARD-CODES WAR\'S COUNT (the S37 correction, made structural)', () => {
    // The TR architecture measured war's taxonomy at 16 pairs where its source volume
    // said 13, and ruled that no TR pin may hard-code the number. This test is the
    // enforcement: it reads war's live length rather than asserting one, and only
    // asserts the relationship that actually matters — the two are independent.
    expect(WAR_REASON_TYPES.length).toBe(PEACE_REASON_TYPES.length);
    expect(SEVERANCE_REASON_TYPES.length).toBe(PARTNERSHIP_REASON_TYPES.length);
    expect(SEVERANCE_REASON_TYPES.length).not.toBe(WAR_REASON_TYPES.length);
  });
});

describe('TR-1 taxonomy — the code order IS the annex order', () => {
  test('the sixteen types appear in the content annex in taxonomy order', () => {
    const annex = readFileSync(join(ROOT, ANNEX_PATH), 'utf8');
    const open = annex.indexOf('\n# TR-1 — THE CASUS COMMERCII');
    const close = annex.indexOf('\n# TR-2 — THE HOUSE');
    expect(open, 'the TR-1 annex section vanished — re-aim this pin').toBeGreaterThan(0);
    expect(close).toBeGreaterThan(open);
    const slice = annex.slice(open, close);
    const authored = [...slice.matchAll(/^### cc\.(\w+) \(TR-1\)/gm)].map((match) => match[1]);
    // The annex authors force, mirror, force, mirror … so the interleave IS the pairing,
    // and a reorder in either place reds here. The four non-taxonomy pools follow.
    const expected = SEVERANCE_REASON_TYPES.flatMap((type) => [type, COMMERCIAL_REASON_MIRRORS[type]]);
    expect(authored.slice(0, 16)).toEqual(expected);
    expect(authored.slice(16)).toEqual(['suppressed', 'severance_crossing', 'partnership_crossing']);
  });
});
