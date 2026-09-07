/**
 * terrainReadSingleSource.test.js — R-4 lane P-6: domain/resolveTerrain.js is THE
 * ONE terrain read on every routed display surface.
 *
 * WHY THIS ENFORCER EXISTS
 * `config.terrain` was never written by any generator path (resolveTerrain.js's own
 * header). Reading it FIRST is therefore a dead leg that silently swallows the real,
 * engine-written `config.terrainType` — the exact defect that "silently no-oped for
 * every wizard-generated settlement" in the simulation layer, and that survived on
 * four DISPLAY readers until Wave R-4 routed them. Wave R-3 then dropped `terrain`
 * from updateConfig's key allowlist, so the leg is dead going forward too.
 *
 * WHAT THIS SCAN HOLDS (the habitat removal, per structural-prevention)
 *   1. Each routed file imports domain/resolveTerrain.js.
 *   2. No routed file reads `config.terrain` or `geography.terrain` again.
 *   3. The only `.terrain` receivers left in each routed file are the enumerated
 *      non-config legs (the two SERVER facet columns, already coalesced
 *      terrainType-first by migrations 063/071/147 and guarded at the call site by
 *      terrainOrNull; plus shareImage's own already-resolved summary object). A new
 *      raw read grows the receiver set and reds here.
 *   4. NOTHING ELSE under src/ reads `config.terrain` — the census denominator, so
 *      a fifth reader cannot appear anywhere in the tree without reddening.
 *
 * Behavior for these four sites is pinned in tests/lib/terrainReaderRouting.test.jsx.
 *
 * DELIBERATE NON-SUBJECTS (dispositioned, not gaps): the PDF/Foundry lane reads
 * `resourceAnalysis.terrain`, the town-scene lane reads `manifest.terrain`, and the
 * road-scene brief reads a per-hop biome texture. Those are different records,
 * generator-written, and untouched by the config-key shift.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** The dead first leg, in every spelling: `x.config.terrain` / `x?.config?.terrain`. */
const CONFIG_TERRAIN_READ = /config\s*\??\.\s*terrain\b/;

const ROUTED = Object.freeze([
  { rel: 'src/lib/gallery.js', allowedReceivers: ['row'] },
  { rel: 'src/lib/shareImage.js', allowedReceivers: ['p'] },
  { rel: 'src/lib/seoDossier.js', allowedReceivers: ['dossier'] },
  { rel: 'src/components/gallery/GalleryDetail.jsx', allowedReceivers: [] },
  // The crawler-head twin of seoDossier.js (R-4 verify finding: it served the
  // dead chain, un-'auto'-guarded, to every scraper). Same routed expression;
  // twin parity is additionally pinned in tests/build/injectGalleryMeta.test.js.
  { rel: 'api/_galleryMeta.js', allowedReceivers: ['dossier'] },
]);

/** Strip block + line comments so prose ABOUT `config.terrain` never trips the scan. */
function codeOf(abs) {
  return readFileSync(abs, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');
}

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const SRC_FILES = walk(join(ROOT, 'src'))
  .filter((p) => /\.(js|jsx)$/.test(p) && !/\.test\./.test(p))
  .map((p) => relative(ROOT, p).replace(/\\/g, '/'))
  .sort();

describe('P-6 — resolveTerrain is the ONE terrain read on the display surfaces', () => {
  test('guard-the-guard: the walk, the stripper and the pattern are not vacuous', () => {
    // A broken walk, an over-greedy stripper, or a pattern that matches nothing
    // would pass every assertion below on an empty set.
    expect(SRC_FILES.length).toBeGreaterThan(500);
    // The pattern catches the real spellings and does NOT catch terrainType.
    expect(CONFIG_TERRAIN_READ.test('d?.config?.terrain || x')).toBe(true);
    expect(CONFIG_TERRAIN_READ.test('settlement.config.terrain')).toBe(true);
    expect(CONFIG_TERRAIN_READ.test('cfg.terrainType || cfg.terrainOverride')).toBe(false);
    // The stripper leaves code alone and removes prose.
    expect(codeOf(join(ROOT, 'src/domain/resolveTerrain.js'))).toMatch(/terrainOrNull\(cfg\.terrain\)/);
    // An empty read would red on the live-code pin above before reaching this one.
    // anchored: the same file's live code is pinned two lines up
    expect(codeOf(join(ROOT, 'src/domain/resolveTerrain.js'))).not.toMatch(/never written by any generator path/);
  });

  test('resolveTerrain.js still owns the legacy leg (the chain was routed, not deleted)', () => {
    const chain = codeOf(join(ROOT, 'src/domain/resolveTerrain.js'));
    expect(chain).toMatch(/terrainOrNull\(cfg\.terrainType\)/);
    expect(chain).toMatch(/terrainOrNull\(cfg\.terrainOverride\)/);
    expect(chain).toMatch(/terrainOrNull\(cfg\.terrain\)/);
  });

  test.each(ROUTED)('$rel imports domain/resolveTerrain.js', ({ rel }) => {
    // src files reach it as ../domain/…; api/ files as ../src/domain/….
    expect(codeOf(join(ROOT, rel))).toMatch(/from '(\.\.\/)+(src\/)?domain\/resolveTerrain\.js'/);
  });

  test.each(ROUTED)('$rel reads neither config.terrain nor geography.terrain', ({ rel }) => {
    const code = codeOf(join(ROOT, rel));
    // LIVENESS ANCHOR: a moved/renamed file (or an over-greedy stripper) would leave
    // `code` empty, and both exclusions below would pass for that wrong reason. Every
    // ROUTED file reaches terrain through the resolver, so its import is the anchor.
    expect(code, `${rel} read as empty — the exclusions below would be vacuous`)
      .toMatch(/domain\/resolveTerrain\.js'/);
    expect(code, `${rel} reads config.terrain again — route it through resolveTerrain (the ONE terrain read)`)
      // anchored: the resolveTerrain import above proves `code` is the live file
      .not.toMatch(CONFIG_TERRAIN_READ);
    expect(code, `${rel} reads geography.terrain again — resolveSettlementTerrain owns that leg`)
      // anchored: same import liveness anchor
      .not.toMatch(/geography\s*\??\.\s*terrain\b/);
  });

  test.each(ROUTED)('$rel has only its enumerated non-config .terrain receivers', ({ rel, allowedReceivers }) => {
    const found = [...codeOf(join(ROOT, rel)).matchAll(/([A-Za-z_$][\w$]*)\s*\??\.\s*terrain\b/g)].map((m) => m[1]);
    const unexpected = [...new Set(found)].filter((name) => !allowedReceivers.includes(name));
    expect(unexpected, `${rel} grew a raw terrain read on: ${unexpected.join(', ')}`).toEqual([]);
  });

  test('THE DENOMINATOR: nothing under src/ OR api/ reads config.terrain any more', () => {
    // ZERO, not one: resolveTerrain.js holds the legacy leg under the parameter
    // name `cfg`, so even THE one terrain read does not spell it `config.terrain`.
    // The census that opened this lane found exactly five matches under src/ —
    // the four routed readers plus a comment in ShareToGallery.jsx, which the
    // comment stripper removes — and the R-4 verify pass then found the SIXTH
    // reader outside src/: api/_galleryMeta.js, the crawler meta shell (now
    // routed). The walk covers api/ too so a seventh cannot appear off-scan.
    const apiFiles = walk(join(ROOT, 'api'))
      .filter((p) => /\.(js|jsx)$/.test(p) && !/\.test\./.test(p))
      .map((p) => relative(ROOT, p).replace(/\\/g, '/'))
      .sort();
    const readers = [...SRC_FILES, ...apiFiles]
      .filter((rel) => new RegExp(CONFIG_TERRAIN_READ.source).test(codeOf(join(ROOT, rel))));
    expect(
      readers,
      'a config.terrain reader appeared under src/ or api/. That key is never written by any generator '
      + 'path and no longer survives updateConfig, so reading it first silently swallows config.terrainType. '
      + 'Call resolveTerrain / resolveSettlementTerrain instead:\n' + readers.join('\n'),
    ).toEqual([]);
  });
});
