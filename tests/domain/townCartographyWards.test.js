/**
 * townCartographyWards.test.js — TC-3a's ward lowering, naming, and the naming-pool
 * injection (docs/DESIGN_TOWN_CARTOGRAPHY.md §3, A-5, A-10; packet TC-3A CR-TC3A-1).
 *
 * Every claim here runs against the REAL compiler: the districts are the ones a live
 * TownSceneManifest publishes and the wards are the ones the live leaf lowers. A
 * hand-written district literal would be a second settlement truth living in the test
 * suite, and the first time buildDistricts changed shape the pins would keep passing
 * against a map the product no longer produces.
 *
 *   A3 REPLAY     two compiles and a reversed input list are byte-identical; a changed
 *                 digest DOES move the names while the ward ids stay put (the
 *                 anti-vacuity half — "two runs agree" is trivially true of a stage
 *                 that emits nothing).
 *   A4 ONE LAW    the wards ARE the projected districts, the player's map is a subset
 *                 of the DM's rather than a differently-drawn town, and every premise
 *                 the lowering needs is CHECKED rather than repaired.
 *   A5 INJECTION  the pools cross the lazy boundary as an argument: lit without them
 *                 is a loud TypeError, dark ignores them entirely, both live edges
 *                 fetch them lit-gated, and nothing the synchronous compiler can
 *                 statically reach imports the table.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  compileTownSceneManifest,
  compileTownSceneManifestFromAuthorizedInput,
  prepareTownSceneCompileInput,
  stableSceneStringify,
} from '../../src/domain/townScene/index.js';
import { compileTownWardLayers } from '../../src/domain/townCartography/cartographyWards.js';
import {
  CARTOGRAPHY_TIERS,
  TOWN_CARTOGRAPHY_TUNING,
  cartographyBand,
  cartographyTierIndex,
} from '../../src/domain/townCartography/cartographyTuning.js';
import { TOWN_CARTOGRAPHY_WARD_KINDS } from '../../src/domain/townScene/cartographyContract.js';
import { NAMING_DATA } from '../../src/data/namingData.js';
import { V2_GOLDEN_CONFIGS } from '../fixtures/townMapFixtures.js';

const T = TOWN_CARTOGRAPHY_TUNING;
const LIT_RULES = { simulationRules: { townCartographyEnabled: true } };
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

/** The exact premise the compiler seam throws when a lit compile arrives poolless. */
const MISSING_POOLS_MESSAGE = 'townScene compile premise: cartography is lit but namingPools was not injected; '
  + 'the caller above the lazy boundary must supply NAMING_DATA from src/data/namingData.js';

/** The one walled+watered town every non-corpus pin runs against. */
const SUBJECT = V2_GOLDEN_CONFIGS.findIndex(
  (config) => config.spec.tier === 'city' && config.spec.walls === true,
);

/** Compile one corpus row through the ordinary domain entry point. */
function compileRow(index, audience = 'dm', lit = true) {
  return compileTownSceneManifest(
    {
      settlement: V2_GOLDEN_CONFIGS[index].settlement,
      mapEdits: V2_GOLDEN_CONFIGS[index].mapEdits ?? null,
      audience,
      ...(lit ? { worldState: LIT_RULES } : {}),
    },
    { namingPools: NAMING_DATA },
  );
}

/** The exact argument set the compiler hands the leaf, rebuilt from a real manifest. */
function leafInputFor(index, audience = 'dm') {
  const settlement = V2_GOLDEN_CONFIGS[index].settlement;
  const manifest = compileRow(index, audience);
  return {
    manifest,
    input: {
      districts: manifest.districts,
      streets: manifest.cartography.streets,
      settlement,
      digest: manifest.source.mapModelDigest,
      tier: CARTOGRAPHY_TIERS[cartographyTierIndex(settlement.tier)],
      namingPools: NAMING_DATA,
    },
  };
}

/** A convex regular-ish polygon with `count` integer vertices around a centre. */
function convexRing(count, radius = 200, centre = 500) {
  /** @type {Array<[number, number]>} */
  const polygon = [];
  // Integer lattice ring: walk a diamond so no transcendental enters a fixture.
  for (let index = 0; index < count; index++) {
    const phase = (index * 4) / count;
    const leg = phase < 2 ? 1 - phase : phase - 3;
    const other = phase < 1 || phase >= 3 ? 1 - Math.abs(leg) : Math.abs(leg) - 1;
    polygon.push([
      Math.round(centre + radius * leg),
      Math.round(centre + radius * (phase < 2 ? other : -other)),
    ]);
  }
  return polygon;
}

/** A district row shaped exactly as buildDistricts emits one. */
function districtRow(id, footprint, centroid, category = 'civic') {
  return { id, category, footprint, centroid, densityPermille: 400 };
}

/** The empty TC-2 street container, for the synthetic-district negative controls. */
const NO_STREETS = { arterials: [], lanes: [], gateRefs: [], bridgeRefs: [] };

const readRepoFile = (path) => readFileSync(join(ROOT, path), 'utf8');
const withoutComments = (source) => source
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '');

/**
 * Every module the SYNCHRONOUS compiler can reach by a static import edge. This is
 * the exact set whose cost the bounded worker/manifest-compiler chunk pair pays, so
 * it is the honest subject for "the naming table never enters the compiler graph" —
 * a directory scan would either miss a hop or indict modules in other graphs.
 */
function staticImportClosure(entryPath) {
  /** @type {Set<string>} */
  const seen = new Set();
  const queue = [resolve(ROOT, entryPath)];
  while (queue.length > 0) {
    const file = queue.pop();
    if (seen.has(file)) continue;
    seen.add(file);
    let source;
    try {
      source = readFileSync(file, 'utf8');
    } catch {
      continue;
    }
    // `from '…'` is the STATIC edge in every form (default, named, multi-line, and
    // `export … from`). A dynamic `import('…')` carries no `from` and is deliberately
    // NOT an edge here: code-splitting it is exactly what this packet did.
    const code = withoutComments(source);
    for (const match of code.matchAll(/from\s+'(\.[^']+)'/g)) {
      queue.push(resolve(dirname(file), match[1]));
    }
  }
  return [...seen].map((file) => relative(ROOT, file)).sort();
}

describe('TC-3a A3 — replay, order independence, and the anti-vacuity half', () => {
  it('two compiles of the same settlement are byte-identical in wards and names', () => {
    const first = compileRow(SUBJECT).cartography;
    const second = compileRow(SUBJECT).cartography;
    expect(first.wards.length).toBeGreaterThan(0);
    expect(stableSceneStringify(second)).toBe(stableSceneStringify(first));
  });

  it('REVERSED leaf inputs produce the identical layers (order rides the data, not the array)', () => {
    const { input } = leafInputFor(SUBJECT);
    const forward = compileTownWardLayers(input);
    const reversed = compileTownWardLayers({
      ...input,
      districts: [...input.districts].reverse(),
      streets: {
        ...input.streets,
        arterials: [...input.streets.arterials].reverse(),
        lanes: [...input.streets.lanes].reverse(),
      },
    });
    expect(reversed.wards.length).toBeGreaterThan(0);
    expect(stableSceneStringify(reversed.wards)).toBe(stableSceneStringify(forward.wards));
    // The street ROWS are re-sorted by the compiler, so compare the name binding.
    const nameOf = (layers) => [...layers.streets.arterials, ...layers.streets.lanes]
      .map((street) => `${street.id}=${street.name}`).sort();
    expect(nameOf(reversed)).toEqual(nameOf(forward));
    expect(nameOf(forward).length).toBeGreaterThan(0);
  });

  it('a CHANGED digest moves the names while the ward ids stay put (agreement is not vacuous)', () => {
    const { input } = leafInputFor(SUBJECT);
    const base = compileTownWardLayers(input);
    const moved = compileTownWardLayers({ ...input, digest: `${input.digest}-moved` });
    const names = (layers) => layers.wards.map((ward) => ward.name).join('|');
    expect(names(moved)).not.toBe(names(base));
    // Yet the WARDS themselves are state, not entropy: the same districts, either way.
    expect(moved.wards.map((ward) => ward.id)).toEqual(base.wards.map((ward) => ward.id));
    expect(base.receipts.wardCount).toBe(base.wards.length);
    expect(base.receipts.wardNameCount).toBe(base.wards.length);
    expect(base.receipts.streetNameCount)
      .toBe(base.streets.arterials.length + base.streets.lanes.length);
  });
});

describe('TC-3a A4 — the wards ARE the projected districts (the ONE LAW), across audiences', () => {
  it('ward id, kind, polygon, tone and district ref all trace to the same manifest', () => {
    const manifest = compileRow(SUBJECT);
    const wards = manifest.cartography.wards;
    expect(manifest.districts.length).toBeGreaterThan(0);
    expect(wards.length).toBe(manifest.districts.length);
    for (let index = 0; index < wards.length; index++) {
      const ward = wards[index];
      const district = manifest.districts[index];
      expect(ward.id).toBe(`ward:${district.id}`);
      expect(ward.districtId).toBe(district.id);
      expect(ward.polygon).toEqual(district.footprint);
      expect(ward.tonePermille).toBe(district.densityPermille);
      expect(ward.kind).toBe(
        TOWN_CARTOGRAPHY_WARD_KINDS.includes(district.category) ? district.category : 'other',
      );
      expect(TOWN_CARTOGRAPHY_WARD_KINDS).toContain(ward.kind);
      expect(ward.provenance).toEqual({ kind: 'generated', ref: null });
      expect(ward.name.endsWith(' Ward') || / Ward \d+$/.test(ward.name), ward.id).toBe(true);
    }
    // A-10.3: exactly one node, and only when arterials exist to converge.
    const nodes = wards.filter((ward) => ward.lynchElement === 'node');
    expect(manifest.cartography.streets.arterials.length).toBeGreaterThan(0);
    expect(nodes.length).toBe(1);
    expect(nodes[0].decidedBy).toBe('lynch');
    for (const ward of wards) {
      if (ward.lynchElement === 'node') continue;
      expect(ward.lynchElement).toBe('district');
      expect(ward.decidedBy).toBe('state');
    }
  });

  it("the player's wards are a SUBSET of the DM's, never a different town", () => {
    const dm = compileRow(SUBJECT, 'dm').cartography;
    const player = compileRow(SUBJECT, 'player').cartography;
    const dmWards = new Set(dm.wards.map((ward) => ward.id));
    expect(player.wards.length).toBeGreaterThan(0);
    for (const ward of player.wards) expect(dmWards.has(ward.id), ward.id).toBe(true);
    expect(player.wards.length).toBeLessThanOrEqual(dm.wards.length);
  });

  it('NEGATIVE CONTROL: a concave source, an outside centroid, and an over-cap source all throw the premise error', () => {
    const { input } = leafInputFor(SUBJECT);
    const square = [[100, 100], [300, 100], [300, 300], [100, 300]];
    /** @type {Array<[string, unknown[], string]>} */
    const breaks = [
      ['concave', [districtRow(
        'district.concave',
        [[0, 0], [400, 0], [200, 200], [400, 400], [0, 400]],
        [100, 200],
      )], 'is not convex'],
      ['outside centroid', [districtRow('district.adrift', square, [900, 900])], 'centroid outside'],
      ['over the vertex cap', [districtRow(
        'district.crowded',
        convexRing(T.MAXIMUM_WARD_VERTICES + 1),
        [500, 500],
      )], 'over the 8 cap'],
    ];
    for (const [label, districts, expected] of breaks) {
      expect(() => compileTownWardLayers({ ...input, streets: NO_STREETS, districts }), label)
        .toThrow(new RegExp(`townCartography TC-3 premise:.*${expected}`));
      expect(() => compileTownWardLayers({ ...input, streets: NO_STREETS, districts }), label)
        .toThrow(RangeError);
    }
    // RESTORE: the same call with a well-formed convex source succeeds, so the throws
    // above measured the broken premise rather than a broken call.
    const healthy = compileTownWardLayers({
      ...input,
      streets: NO_STREETS,
      districts: [districtRow('district.sound', square, [200, 200])],
    });
    expect(healthy.wards.length).toBe(1);
    expect(healthy.wards[0].name.length).toBeGreaterThan(0);
  });

  it('NEGATIVE CONTROL: more canonical districts than the tier ward cap is a premise error, never a truncation', () => {
    const { input } = leafInputFor(SUBJECT);
    const cap = cartographyBand(T.MAXIMUM_WARDS, 'thorp');
    const districts = [];
    for (let index = 0; index <= cap; index++) {
      districts.push(districtRow(
        `district.pad${String(index).padStart(2, '0')}`,
        [[100, 100], [300, 100], [300, 300], [100, 300]],
        [200, 200],
      ));
    }
    expect(() => compileTownWardLayers({
      ...input, streets: NO_STREETS, tier: 'thorp', districts,
    })).toThrow(/townCartography TC-3 premise: \d+ canonical districts exceed the thorp ward cap/);
    // RESTORE: exactly at the cap it compiles, so the red above measured the overflow.
    const atCap = compileTownWardLayers({
      ...input,
      streets: NO_STREETS,
      tier: 'thorp',
      districts: districts.slice(0, cap),
    });
    expect(atCap.wards.length).toBe(cap);
  });
});

describe('TC-3a A5 — CR-TC3A-1: the naming pools are injected, never imported', () => {
  it('a LIT compile with no pools throws the exact caller-contract TypeError, at both entries', () => {
    const settlement = V2_GOLDEN_CONFIGS[SUBJECT].settlement;
    const litInput = {
      settlement,
      mapEdits: V2_GOLDEN_CONFIGS[SUBJECT].mapEdits ?? null,
      audience: 'dm',
      worldState: LIT_RULES,
    };
    for (const missing of [undefined, {}, { namingPools: null }, { namingPools: undefined }]) {
      const label = JSON.stringify(missing) ?? 'absent';
      expect(() => compileTownSceneManifest(litInput, missing), label).toThrow(TypeError);
      expect(() => compileTownSceneManifest(litInput, missing), label)
        .toThrow(MISSING_POOLS_MESSAGE);
    }
    const envelope = prepareTownSceneCompileInput(litInput);
    expect(envelope.cartography).toEqual({ enabled: true });
    expect(() => compileTownSceneManifestFromAuthorizedInput(envelope)).toThrow(TypeError);
    expect(() => compileTownSceneManifestFromAuthorizedInput(envelope))
      .toThrow(MISSING_POOLS_MESSAGE);
    // RESTORE: the identical calls WITH the pools compile a fully named block, so the
    // throws above measured the missing injection rather than a broken call.
    const named = compileTownSceneManifestFromAuthorizedInput(
      envelope,
      { namingPools: NAMING_DATA },
    ).cartography;
    const rows = [...named.streets.arterials, ...named.streets.lanes, ...named.wards];
    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      expect(typeof row.name, row.id).toBe('string');
      expect(row.name.trim(), row.id).toBe(row.name);
      expect(row.name.length, row.id).toBeGreaterThan(0);
    }
  });

  it('EMPTY injected pools are a named premise error, not a nameless stem', () => {
    const { input } = leafInputFor(SUBJECT);
    for (const empty of [{}, { germanic: {} }, { germanic: { settlementPrefixes: ['Stein'] } }]) {
      expect(() => compileTownWardLayers({ ...input, namingPools: empty }), JSON.stringify(empty))
        .toThrow(/townCartography TC-3 premise: the injected naming pools carry no usable prefixes or suffixes/);
    }
    // RESTORE: the real pools name the same town, so the reds measured the pools.
    expect(compileTownWardLayers(input).wards[0].name.length).toBeGreaterThan(0);
  });

  it('the DARK path ignores the pools entirely — passing them changes nothing, omitting them throws nothing', () => {
    const darkInput = {
      settlement: V2_GOLDEN_CONFIGS[SUBJECT].settlement,
      mapEdits: V2_GOLDEN_CONFIGS[SUBJECT].mapEdits ?? null,
      audience: 'dm',
    };
    const bare = compileTownSceneManifest(darkInput);
    const withPools = compileTownSceneManifest(darkInput, { namingPools: NAMING_DATA });
    const withJunk = compileTownSceneManifest(darkInput, { namingPools: 'not a pool' });
    expect(Object.prototype.hasOwnProperty.call(bare, 'cartography')).toBe(false);
    expect(stableSceneStringify(withPools)).toBe(stableSceneStringify(bare));
    expect(stableSceneStringify(withJunk)).toBe(stableSceneStringify(bare));
    // Anti-vacuity: the same settlement LIT does emit a block, so "identical" above is
    // a statement about the flag rather than about a compiler that emits nothing.
    expect(compileRow(SUBJECT).cartography.wards.length).toBeGreaterThan(0);
  });

  it('both live async edges fetch the pools with a lit-gated dynamic import', () => {
    const worker = withoutComments(readRepoFile('src/workers/townScene.worker.js'));
    expect(worker).toMatch(/import\s*\(\s*'\.\.\/data\/namingData\.js'\s*\)/);
    expect(worker).toContain('NAMING_DATA');
    expect(worker).toMatch(/cartography\?\.enabled === true/);
    // The anchor: the compiler import the whole worker exists to make lazy travels the
    // same read, so a file that stopped being the worker reds here rather than passing.
    expect(worker).toMatch(/import\s*\(\s*\n?\s*'\.\.\/domain\/townScene\/compileTownSceneManifest\.js'/);

    const exportPath = withoutComments(readRepoFile('src/lib/townScene/townSceneExport.js'));
    expect(exportPath).toMatch(/import\s*\(\s*'\.\.\/\.\.\/data\/namingData\.js'\s*\)/);
    expect(exportPath).toContain('NAMING_DATA');
    expect(exportPath).toMatch(/townCartographyActive\(worldState\?\.simulationRules\)/);
    expect(exportPath).toContain('compileTownSceneManifest(');
  });

  it('nothing the synchronous compiler statically reaches imports the naming table', () => {
    const closure = staticImportClosure('src/domain/townScene/compileTownSceneManifest.js');
    // Anti-vacuity: the walk is real, and the cartography leaves are inside it — a
    // resolver that silently returned the entry alone would pass the absence below.
    expect(closure.length).toBeGreaterThan(20);
    expect(closure).toContain('src/domain/townCartography/cartographyWards.js');
    expect(closure).toContain('src/domain/townCartography/cartographyPlan.js');
    expect(closure).not.toContain('src/data/namingData.js');
    const importers = closure.filter((path) => (
      /from\s+'[^']*namingData\.js'/.test(withoutComments(readRepoFile(path)))
    ));
    expect(importers).toEqual([]);
  });
});
