/**
 * tests/data/sampleSettlements.test.js — Tier 8.2 sample fixtures contract.
 *
 * Pins the sample shape so a future drift can't silently empty the
 * dashboard or strip required fields. Three integrity checks:
 *   1. Every sample has the fields the UI reads (name, teaser, tags, config).
 *   2. Sample configs match the live generator's config shape.
 *   3. forkSeedFor produces stable, forker-distinguished seeds.
 *
 * ⭐ AND SINCE 2026-09-20 (REVIEW-P F1 + noticed 8, ODQ §934.63) IT CARRIES THE
 * FORK-IDENTITY LAW AND ITS WALKER. Two anonymous visitors used to fork
 * byte-identical worlds, because a signed-out reader's suffix was the constant
 * 'anon'; two accounts whose ids agreed on eight hex characters collided for the
 * same reason one layer along. The suffix is now WHO IS FORKING: a short digest
 * of the whole account id, or this visitor's minted salt. Because src/data may
 * not mint one (its purity rule), the resolution lives in the two fork doors and
 * the walker at the foot of this file is what keeps both of them obeying it.
 *
 * And, since 2026-09-19 (ODQ §934.30): the trio's third card is CNOCBY, the
 * landing page's own fixture town, asserted against the fixture rather than
 * against literals — plus the one behaviour the swap changed, which is that a
 * save forked from the retired Thornwell still carries `_forkedFromSample:
 * 'sample-thornwell'` in its persisted config and must stay valid.
 */

import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { SAMPLE_SETTLEMENTS, forkConfigFor, forkSeedFor } from '../../src/data/sampleSettlements.js';
import { DEFAULT_CONFIG, isAllowedConfigKey } from '../../src/store/configSlice.js';
// The landing page's frozen town. The third curated sample IS that town (ODQ
// §934.30), so the card's dials are asserted against the fixture rather than
// against literals — a regenerated fixture that moved off village/road/mountain
// reds here instead of quietly leaving the card describing a different place.
import { fixture as landingFixture } from '../../src/components/home/landingFixture.js';

describe('SAMPLE_SETTLEMENTS shape contract', () => {
  it('ships three samples (matches Tier 8.2 spec)', () => {
    expect(SAMPLE_SETTLEMENTS).toHaveLength(3);
  });

  it('every sample has the fields the dashboard renders', () => {
    for (const sample of SAMPLE_SETTLEMENTS) {
      expect(sample.id).toMatch(/^sample-/);
      expect(typeof sample.name).toBe('string');
      expect(sample.name.length).toBeGreaterThan(0);
      expect(['hamlet', 'village', 'town', 'city', 'capital']).toContain(sample.tier);
      expect(typeof sample.terrain).toBe('string');
      expect(typeof sample.teaser).toBe('string');
      expect(sample.teaser.length).toBeGreaterThan(40); // not a stub
      expect(Array.isArray(sample.tags)).toBe(true);
      expect(sample.tags.length).toBeGreaterThanOrEqual(2);
      expect(sample.tags.length).toBeLessThanOrEqual(4);
    }
  });

  it('every sample config matches the live generator config shape', () => {
    // The keys resolveConfig() actually reads. A sample that ships a
    // nested `sliders` object or a `nearbyTerrain` key looks plausible
    // but forks into a generic town — every priority stays at the
    // default 50 — because the engine never reads those keys. This test
    // pins the real shape so that regression can't ship again.
    const PRIORITY_KEYS = [
      'priorityMilitary', 'priorityReligion', 'priorityEconomy',
      'priorityCriminal', 'priorityMagic',
    ];
    // resolveConfig terrain pool + monsterThreat tiers (see
    // src/generators/steps/resolveConfig.js).
    const VALID_TERRAINS = ['plains', 'hills', 'forest', 'riverside', 'coastal', 'mountain', 'desert'];
    const VALID_THREATS  = ['heartland', 'frontier', 'plagued'];

    for (const sample of SAMPLE_SETTLEMENTS) {
      expect(sample.config).toBeDefined();
      expect(sample.config.settType).toBe(sample.tier);
      expect(sample.config.tradeRouteAccess).toBeDefined();

      // Terrain is pinned via terrainOverride (the key resolveConfig
      // reads), not the dead `nearbyTerrain` key.
      expect(sample.config.nearbyTerrain).toBeUndefined();
      expect(VALID_TERRAINS).toContain(sample.config.terrainOverride);

      // Monster threat must be a real tier — a free-text value like
      // 'occasional' falls through resolveConfig's normalisation.
      expect(VALID_THREATS).toContain(sample.config.monsterThreat);

      // Priority weights are flat priority* fields (DEFAULT_CONFIG
      // shape), each a 0-100 int — not a nested `sliders` object.
      expect(sample.config.sliders).toBeUndefined();
      for (const key of PRIORITY_KEYS) {
        expect(DEFAULT_CONFIG).toHaveProperty(key); // key name is real
        expect(typeof sample.config[key]).toBe('number');
        expect(sample.config[key]).toBeGreaterThanOrEqual(0);
        expect(sample.config[key]).toBeLessThanOrEqual(100);
      }

      expect(typeof sample.config.seed).toBe('string');
      expect(sample.config.seed.length).toBeGreaterThan(8);
    }
  });

  // ── ODQ §934.30 item 5 — CNOCBY IS THE THIRD CARD, AND THORNWELL IS GONE ───
  // The owner: "Have Cnocby replace Thornwell in the create page and the
  // library as well." Both surfaces (FoundingWorlds on /create, SampleDashboard
  // in the Library) map this array, so the swap is a data change and this is
  // where it is pinned.
  it('the curated trio offers the landing page its own town, not a stranger', () => {
    const byId = new Map(SAMPLE_SETTLEMENTS.map((s) => [s.id, s]));
    const cnocby = byId.get('sample-cnocby');
    expect(cnocby, 'the landing fixture town is not offered as a curated sample').toBeTruthy();
    // The card names the same place the landing's four artifacts are about.
    expect(cnocby.name).toBe(landingFixture.town.name);
    // …and its dials are that town's RESOLVED config, not a lookalike: the
    // fixture is generated at settType village from a road-reached mountain
    // site, and the card must not drift off it.
    expect(cnocby.tier).toBe(landingFixture.town.tier);
    expect(cnocby.config.settType).toBe(landingFixture.forge.config.settType);
    expect(cnocby.config.customName).toBe(landingFixture.town.name);
    // The eyebrow the landing prints is "<route> <tier> · <terrain>", derived
    // from the same dials — so it anchors all three of them at once.
    expect(cnocby.config.terrainOverride).toBe(cnocby.terrain);
    expect(landingFixture.town.eyebrow)
      .toBe(`${cnocby.config.tradeRouteAccess} ${cnocby.tier} · ${cnocby.terrain}`);

    // THE REMOVAL, anchored on a sibling that travels the same array: Mossgate
    // proves the trio is live and correctly keyed, so "no Thornwell" cannot
    // pass because the array emptied.
    expectAbsentWithAnchor([...byId.keys()], 'sample-thornwell', 'sample-mossgate', 'curated sample ids');
    expectAbsentWithAnchor(SAMPLE_SETTLEMENTS.map((s) => s.name), 'Thornwell', 'Mossgate', 'curated sample names');
  });

  // ⚠ THE BEHAVIOUR CHANGE, STATED AND TRACED. Every fork stamps
  // `_forkedFromSample: <sample id>` into the PERSISTED store config
  // (FoundingWorlds.jsx / SettlementsPanel.jsx), so saves made before today
  // carry `'sample-thornwell'` for a sample that no longer exists. That stamp is
  // WRITE-ONLY in this codebase — traced 2026-09-19: two writers, zero readers;
  // nothing looks it up in SAMPLE_SETTLEMENTS, branches on it, or displays it.
  // It survives an updateConfig patch only because `isAllowedConfigKey` admits
  // the whole underscore rider family, which is a shape rule and not a registry
  // of ids. So a Thornwell fork in an existing save stays valid, and this arm is
  // what would red if someone later made the stamp load-bearing without noticing
  // that a retired id is still out there in people's browsers.
  it('a legacy fork stamp for a retired sample stays admissible (existing saves keep working)', () => {
    expect(isAllowedConfigKey('_forkedFromSample'), 'the fork stamp stopped being an admitted config key').toBe(true);
    // The retired id is not resolvable, and nothing may require that it is.
    expect(SAMPLE_SETTLEMENTS.find((s) => s.id === 'sample-thornwell')).toBeUndefined();
    // forkConfigFor is the one function that reads a sample's config on the fork
    // path; handed a shape it cannot resolve it answers an empty bag rather than
    // throwing, which is what keeps a stale stamp inert rather than fatal.
    expect(forkConfigFor({ id: 'sample-thornwell' })).toEqual({});
  });

  it('sample ids are unique', () => {
    const ids = SAMPLE_SETTLEMENTS.map(s => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('sample seeds are unique (two forks of different samples diverge)', () => {
    const seeds = SAMPLE_SETTLEMENTS.map(s => s.config.seed);
    expect(new Set(seeds).size).toBe(seeds.length);
  });
});

describe('forkSeedFor()', () => {
  const sample = SAMPLE_SETTLEMENTS[0];

  it('returns a seed string when given a valid sample', () => {
    const seed = forkSeedFor(sample, 'user-abc12345');
    expect(typeof seed).toBe('string');
    expect(seed).toContain(sample.config.seed);
  });

  it('appends the forker suffix so different forkers get different forks', () => {
    const a = forkSeedFor(sample, 'aaaaaaaa-1111');
    const b = forkSeedFor(sample, 'bbbbbbbb-2222');
    expect(a).not.toBe(b);
  });

  // ⭐ THE LAW THIS TEST USED TO DENY (REVIEW-P noticed 8, cured 2026-09-20).
  // It read "truncates the user-id suffix to keep seeds short and stable" and
  // asserted these two seeds were EQUAL, with a comment calling the collision
  // deliberate. It is not deliberate to anyone it happens to: Supabase ids are
  // UUIDs, so any two accounts agreeing on eight hex characters forked the same
  // world, and at 32 bits of suffix that is an even-odds collision somewhere in
  // the first ~77,000 accounts.
  //
  // ⚠ THE CURE MOVED ONE LAYER UP, AND THIS ARM MOVED WITH IT. Distinguishing two
  // accounts is now `forkIdentity`'s job (it digests the WHOLE id); what belongs
  // to THIS function is that it never truncates what it is handed, so two
  // different suffixes can never arrive at one seed. Pinned on suffixes that share
  // their first eight characters, which is the shape the old truncation ate.
  it('never truncates its suffix, so two that share eight characters diverge', () => {
    const a = forkSeedFor(sample, 'aaaaaaaa-different-tail-1');
    const b = forkSeedFor(sample, 'aaaaaaaa-different-tail-2');
    expect(a).not.toBe(b);
    expect(a).toBe(`${sample.config.seed}-aaaaaaaa-different-tail-1`);
  });

  it('passes a long suffix through verbatim rather than shortening it', () => {
    // The DOORS keep the address short by handing over a digest (FIX-P1b); this
    // function does not second-guess them, so the two concerns stay separable.
    const id = '7c9e6679-7425-40de-944b-e07fc1f90ae7';
    expect(forkSeedFor(sample, id)).toBe(`${sample.config.seed}-${id}`);
  });

  it('is a pure function of its two arguments', () => {
    // The suffix arrives ALREADY RESOLVED (see forkIdentity), because src/data
    // may not mint or read one — the purity rule this directory is held to by
    // eslint + tests/domain/dataPurity.test.js. Two calls, one answer, no IO.
    expect(forkSeedFor(sample, 'steady')).toBe(forkSeedFor(sample, 'steady'));
  });

  it('falls back to the bare constant only when handed no forker at all', () => {
    // This is what a fork door that FORGOT forkIdentity would produce, and the
    // walker below is what stops one existing. Kept total rather than throwing:
    // a null seed here would fail a fork silently at the generate call.
    const seed = forkSeedFor(sample, null);
    expect(seed).toBe(`${sample.config.seed}-anon`);
  });

  it('returns null for a malformed sample', () => {
    expect(forkSeedFor(null, 'x')).toBeNull();
    expect(forkSeedFor({}, 'x')).toBeNull();
    expect(forkSeedFor({ config: {} }, 'x')).toBeNull();
  });
});

/**
 * ⛔ THE WALKER — every fork door resolves WHO IS FORKING, and none passes a bare id.
 *
 * `forkSeedFor` is pure and cannot defend itself: handed nothing it yields the
 * constant `-anon`, which is the same constant in every browser and is exactly
 * the defect REVIEW-P walked (two anonymous contexts, one Cnocby, id
 * `s_01773858621d9a94` on both). The cure lives one layer up, in the two doors,
 * and a rule that lives in two places needs something checking that both obey
 * it — this estate has already shipped the failure of that exact shape, when the
 * sample-fork INTENT was passed on the create landing and silently not in the
 * Library (ODQ §934.24(b)).
 *
 * A source scan rather than a render: it costs nothing, it cannot be satisfied
 * by a mock, and it reds for a THIRD door added tomorrow that nobody thought to
 * write a component test for.
 */
describe('the fork doors — the forker is resolved, never assumed', () => {
  const SRC = resolve(process.cwd(), 'src');

  /** Every .js/.jsx file under src/ that mentions forkSeedFor. */
  function forkCallSites(dir = SRC, out = []) {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) forkCallSites(full, out);
      else if (/\.(js|jsx)$/.test(entry)) {
        const text = readFileSync(full, 'utf-8');
        if (text.includes('forkSeedFor(')) out.push([relative(process.cwd(), full), text]);
      }
    }
    return out;
  }

  const sites = forkCallSites();

  /** Source with comment spans removed, so a guard judges code and not prose. */
  function stripComments(src) {
    let out = '';
    let inBlock = false;
    for (const line of src.split('\n')) {
      let i = 0;
      while (i < line.length) {
        if (inBlock) {
          const end = line.indexOf('*/', i);
          if (end === -1) { i = line.length; } else { i = end + 2; inBlock = false; }
        } else {
          const b = line.indexOf('/*', i);
          const l = line.indexOf('//', i);
          if (l !== -1 && (b === -1 || l < b)) { out += line.slice(i, l); i = line.length; }
          else if (b !== -1) { out += line.slice(i, b); i = b + 2; inBlock = true; }
          else { out += line.slice(i); i = line.length; }
        }
      }
      out += '\n';
    }
    return out;
  }

  it('guard-the-guard: the scan actually finds the fork doors', () => {
    // A walk that found nothing would pass every assertion below forever.
    const files = sites.map(([f]) => f);
    expect(files).toContain('src/data/sampleSettlements.js');           // the definition
    expect(files).toContain('src/components/generate/FoundingWorlds.jsx'); // door 1
    expect(files).toContain('src/components/SettlementsPanel.jsx');        // door 2
    expect(files.length).toBeGreaterThanOrEqual(3);
  });

  /**
   * The argument list of every `forkSeedFor(` in `text`, read by BALANCING
   * parentheses rather than by a regex. `forkSeedFor(sample, forkIdentity(id))`
   * nests, and a `[^)]*` pattern either stops at the inner `)` or runs past the
   * outer one into whatever follows — which is how a walker comes to read the
   * next line's text as part of the call it is judging.
   */
  function forkSeedForArgs(text) {
    const out = [];
    const NEEDLE = 'forkSeedFor(';
    for (let i = text.indexOf(NEEDLE); i !== -1; i = text.indexOf(NEEDLE, i + 1)) {
      let depth = 0;
      for (let j = i + NEEDLE.length - 1; j < text.length; j++) {
        if (text[j] === '(') depth++;
        else if (text[j] === ')') {
          depth--;
          if (depth === 0) { out.push(text.slice(i, j + 1)); break; }
        }
      }
    }
    return out;
  }

  it('guard-the-guard: the argument reader balances nested calls', () => {
    expect(forkSeedForArgs('const s = forkSeedFor(a, forkIdentity(b)); next(c);'))
      .toEqual(['forkSeedFor(a, forkIdentity(b))']);
    expect(forkSeedForArgs('forkSeedFor(a, b);\nlater(forkIdentity(c));'))
      .toEqual(['forkSeedFor(a, b)']);
  });

  it('every CALL of forkSeedFor passes an identity resolved by forkIdentity', () => {
    const offenders = [];
    for (const [file, text] of sites) {
      if (file === 'src/data/sampleSettlements.js') continue; // the definition, not a call
      for (const call of forkSeedForArgs(text)) {
        if (!call.includes('forkIdentity(')) offenders.push(`${file}: ${call.trim()}`);
      }
    }
    expect(
      offenders,
      'a fork door passed a bare id: a signed-out reader then falls back to the '
      + "constant 'anon' and shares one world with every other visitor (REVIEW-P F1). "
      + 'Wrap it: forkSeedFor(sample, forkIdentity(authUserId)) — lib/anonForkSalt.js',
    ).toEqual([]);
  });

  it('every door that calls forkSeedFor imports forkIdentity', () => {
    const offenders = sites
      .filter(([file]) => file !== 'src/data/sampleSettlements.js')
      .filter(([, text]) => !/import\s*\{[^}]*\bforkIdentity\b[^}]*\}\s*from\s*['"][^'"]*anonForkSalt\.js['"]/.test(text))
      .map(([file]) => file);
    expect(offenders).toEqual([]);
  });

  it('src/data stays pure: the definition never reaches for the salt itself', () => {
    // The temptation is to cure this INSIDE forkSeedFor, which would be one
    // writer instead of two doors. It is forbidden: src/data/** may not import
    // lib (eslint no-restricted-imports + tests/domain/dataPurity.test.js),
    // because a data table that reads storage is no longer data.
    //
    // ⚠ SCANNED OVER CODE, NOT OVER PROSE, and the first cut of this arm got it
    // wrong: it matched the bare word `localStorage` and so reddened on the
    // DOCSTRING that explains why the salt is not read here. A guard that a file
    // trips by describing itself accurately teaches the next author to delete the
    // explanation. Comments are stripped first — the same reasoning
    // tests/domain/dataPurity.test.js records for restricting itself to import
    // specifiers rather than to any occurrence of a substring.
    const [, text] = sites.find(([f]) => f === 'src/data/sampleSettlements.js');
    const code = stripComments(text);
    // THE LIVENESS ANCHOR, and it is not a formality: a stripper that returned ''
    // would make both negatives below pass forever, and this guard would go on
    // reporting purity about a file it had stopped reading.
    expect(code, 'comment-stripping gutted the file it is meant to judge')
      .toMatch(/export function forkSeedFor/);
    // anchored: the assertion above proves `code` still holds the definition this judges
    expect(code, 'the pure-data layer imported the salt').not.toMatch(/from\s*['"][^'"]*anonForkSalt/);
    // anchored: same live `code`, proven to still carry forkSeedFor two lines above
    expect(code, 'the pure-data layer reached for storage').not.toMatch(/localStorage/);
    // …and the prose that explains the rule is still there to be read.
    expect(text).toMatch(/localStorage/);
  });
});

describe('forkConfigFor()', () => {
  it('is the sample config minus its seed, for every sample', () => {
    for (const sample of SAMPLE_SETTLEMENTS) {
      const config = forkConfigFor(sample);
      expect(Object.hasOwn(config, 'seed'), sample.id).toBe(false);
      const { seed: _seed, ...rest } = sample.config;
      expect(config, sample.id).toEqual(rest);
    }
  });

  it('never mutates the frozen sample it reads', () => {
    const sample = SAMPLE_SETTLEMENTS[0];
    const before = JSON.stringify(sample.config);
    forkConfigFor(sample);
    expect(JSON.stringify(sample.config)).toBe(before);
    expect(typeof sample.config.seed).toBe('string');
  });

  it('answers an empty bag for a malformed sample', () => {
    expect(forkConfigFor(null)).toEqual({});
    expect(forkConfigFor({})).toEqual({});
  });
});
