/**
 * livingContentSeamLazy.test.js — THE CONTRACT OF THE LIVING-CONTENT LAZY SEAM.
 *
 * ⛔ WHAT THIS FILE EXISTS TO STOP, MEASURED AT `3f9201e39` RATHER THAN FEARED.
 * The inert living-content roster (ODQ §866) is built inside the SYNCHRONOUS
 * generation pipeline, and `livingContentRoster.js` imports the custom-content
 * manifest. `vite.config.js`'s `computeEngineSharedDomain()` routes into the
 * EAGER `engine-core` chunk the transitive closure, within src/domain, of every
 * domain module ANY generator statically imports — so a plain static import of
 * the roster from the pipeline does not cost the ~1.3 kB the roster weighs. It
 * cost, measured:
 *
 *     engine-core             125,141 →   185,142   (+60,001)
 *     first-paint closure   1,045,910 → 1,095,584   (RED, ceiling 1,047,000)
 *     closure gzip            331,938 →   338,709   (RED, ceiling   337,000)
 *     closure Brotli          278,594 →   283,493   (RED, ceiling   283,000)
 *
 * — because the whole content-vocabulary closure came eager with it. The BUDGETED
 * `engine` chunk barely moved (+101 B), which is exactly why a source-byte
 * estimate mispredicts this: the payload is not where the cost is.
 *
 * The cure is `livingContentSeam.js`: the pipeline imports the SEAM (a
 * zero-import leaf that answers dormant-or-lit synchronously) and the seam
 * reaches the payload through a dynamic `import(`, which neither vite derivation
 * follows. This file pins the three properties that cure depends on, so the day
 * one of them is edited away is a RED day and not a silent 48 kB regression:
 *
 *   1. the pipeline never statically imports the payload;
 *   2. the seam reaches the payload only dynamically;
 *   3. vite's OWN eager-graph derivation does not contain the payload.
 *
 * ⭐ AND THE TWO RUNTIME ARMS ARE HERE, NOT IN THE MATERIALIZATION SUITE, FOR A
 * MECHANICAL REASON: the seam's registry is module state, and
 * `livingContentMaterialization.test.js` arms it at module scope. Vitest isolates
 * modules per FILE, so the UNARMED behaviour — the dark path taking its branch
 * with no payload present, and the lit path failing LOUD instead of quietly
 * producing a v1 settlement — can only be observed from a file that never arms
 * it. This file never calls `registerLivingContentRosterBuilder`.
 */

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { EAGER_FIRST_PAINT_MODULES } from '../../vite.config.js';
// THE VOCABULARY AND THE LOADER ARE TWO FILES, and the split is the F29 cycle
// cure: the seam kept only the loader half, so the gate symbols are imported
// from the dependency-free leaf. Importing them from the seam again would need a
// re-export there, which is the byte-costed shape livingContentLaw.js measured.
import {
  DEFAULT_LIVING_CONTENT_LAW_VERSION,
  LIVING_CONTENT_LAW_CONFIG_KEY,
  ROSTER_LIVING_CONTENT_LAW_VERSION,
  materializesLivingContent,
} from '../../src/domain/content/livingContentLawVersion.js';
import {
  livingContentRosterFor,
} from '../../src/domain/content/livingContentSeam.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = join(ROOT, 'src');
const PIPELINE = join(SRC, 'generators/generateSettlementPipeline.js');
const SEAM = join(SRC, 'domain/content/livingContentSeam.js');
const PAYLOAD = join(SRC, 'domain/content/livingContentRoster.js');
const LAW = join(SRC, 'domain/content/livingContentLaw.js');

/** Source with comments blanked — a mention inside the prose above is not an
 *  import edge, and a scan that cannot tell the difference convicts its own
 *  documentation. (The estate's `codeWithoutCitations` idiom.) */
function code(file) {
  return readFileSync(file, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
}

describe('living-content seam — the lazy boundary that keeps the roster out of first paint', () => {
  // ── ANTI-VACUITY FIRST. Every arm below is an ABSENCE claim, and an absence
  // claim over a file that does not exist, or a scanner that reads nothing, is
  // the vacuous green this whole tests/build/ family exists to prevent.
  it('the files this contract is about actually exist and the scanner reads them', () => {
    expect(code(PIPELINE).length).toBeGreaterThan(1000);
    expect(code(SEAM).length).toBeGreaterThan(200);
    expect(code(PAYLOAD)).toContain('export function buildLivingContentRoster');
    expect(code(LAW)).toContain('NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION');
    // The scanner must be able to SEE a static import when one is there —
    // otherwise arm 1 passes because the regex is broken, not because the edge
    // is gone. The seam import is a real static edge and must be found.
    expect(code(PIPELINE)).toMatch(/from\s*'\.\.\/domain\/content\/livingContentSeam\.js'/);
  });

  it('the pipeline reaches the roster ONLY through the seam — no static edge to the payload', () => {
    const src = code(PIPELINE);
    expect(
      /from\s*['"][^'"]*livingContentRoster\.js['"]/.test(src),
      'generateSettlementPipeline.js statically imports livingContentRoster.js. That is a '
      + 'generator→domain edge, so computeEngineSharedDomain() routes the roster AND the whole '
      + 'content-manifest closure into EAGER engine-core: measured +60,001 B of engine-core and '
      + 'a first-paint closure of 1,095,584 against a 1,047,000 ceiling. Import the seam instead.',
    ).toBe(false);
    expect(
      /from\s*['"][^'"]*livingContentLaw\.js['"]/.test(src),
      'generateSettlementPipeline.js statically imports livingContentLaw.js, which imports the '
      + 'seam and is itself lazy-side vocabulary — the same eager pull by one more hop.',
    ).toBe(false);
  });

  it('the seam reaches the payload ONLY dynamically', () => {
    const src = code(SEAM);
    expect(
      /from\s*['"]\.\/livingContentRoster\.js['"]/.test(src),
      'livingContentSeam.js statically imports the payload — the dynamic boundary is gone and '
      + 'the whole roster closure returns to eager engine-core.',
    ).toBe(false);
    // `import(` with no space: both vite derivations match `import\s+…from` for
    // static edges, so a space between `import` and `(` would be read as static.
    expect(
      src,
      'the seam must reach the payload with a dynamic import( — no space, no `from` clause',
    ).toMatch(/await import\('\.\/livingContentRoster\.js'\)/);
  });

  it("vite's OWN eager first-paint derivation contains neither the payload nor the law", () => {
    const eager = new Set([...EAGER_FIRST_PAINT_MODULES]);
    // Positive control on the derivation itself: a module that IS eager by
    // design must be present, or this arm proves nothing about anything.
    expect(eager.size, 'the eager derivation is empty — this arm would be vacuous').toBeGreaterThan(100);
    expect(eager.has(join(SRC, 'main.jsx'))).toBe(true);
    expect(
      eager.has(PAYLOAD),
      'livingContentRoster.js entered the eager first-paint module graph — the lazy seam was '
      + 'bypassed somewhere and first paint is now paying for the roster closure.',
    ).toBe(false);
    expect(eager.has(LAW)).toBe(false);
    // The SEAM is allowed to be non-eager too: it is excised from
    // ENGINE_SHARED_DOMAIN, so eager engine-core is the wrong home for it.
    // ⚠ AMENDED (FIX-B2, 2026-09-20): this note used to add "and rides the lazy
    // engine chunk with its one importer". It no longer does, and the claim was
    // wrong when it was written — the seam's version leaf had FIVE importers
    // outside the engine chunk, each of whose chunks was therefore statically
    // importing 677,935 B to read a version constant. The seam and
    // livingContentLawVersion.js are now PINNED to the small lazy
    // `living-content-seam` chunk (vite.config.js). That is a placement change
    // only: this arm asserts the seam is not EAGER, which is untouched by which
    // lazy chunk it rides, and the three source-shape contracts above are
    // untouched too (the payload edge is still a dynamic import()).
    expect(eager.has(SEAM)).toBe(false);
  });

  // ── THE TWO RUNTIME ARMS — observable ONLY from a file that never arms the
  // registry (see the header).
  it('the DARK path needs no payload at all: a dormant config returns null, unarmed', () => {
    expect(materializesLivingContent(undefined)).toBe(false);
    expect(materializesLivingContent({})).toBe(false);
    expect(materializesLivingContent({ [LIVING_CONTENT_LAW_CONFIG_KEY]: DEFAULT_LIVING_CONTENT_LAW_VERSION })).toBe(false);
    expect(materializesLivingContent({ [LIVING_CONTENT_LAW_CONFIG_KEY]: 'nonsense' })).toBe(false);
    expect(materializesLivingContent({ [LIVING_CONTENT_LAW_CONFIG_KEY]: 3 })).toBe(false);
    // …and the seam returns the SAME null a run with no pack returns, without
    // touching the registry. This is the whole dark-path cost claim.
    expect(livingContentRosterFor({ deities: [{ localUid: 'x', name: 'y' }] }, {})).toBeNull();
  });

  it('the LIT path fails LOUD when the payload was never loaded — never a quiet v1 settlement', () => {
    const litConfig = { [LIVING_CONTENT_LAW_CONFIG_KEY]: ROSTER_LIVING_CONTENT_LAW_VERSION };
    expect(materializesLivingContent(litConfig)).toBe(true);
    expect(
      () => livingContentRosterFor({}, litConfig),
      'a v2 world with no roster payload loaded returned instead of throwing. That is a '
      + 'same-seed divergence conditioned on whether a chunk happened to be fetched — the one '
      + 'failure a lazy seam must never introduce.',
    ).toThrow(/roster payload not loaded/);
  });
});
