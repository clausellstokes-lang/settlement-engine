/**
 * tests/ui/landingRealmTwins.test.js — THE REALM PHOTOGRAPH SHIPS AS A PAIR, AND
 * THE LIGHTER ONE IS SERVED FIRST.
 *
 * ── THE RULING (ODQ §934.32 addendum, the chair, 2026-09-19) ────────────────
 * The captured realm map landed at 478 kB as a palette PNG — 78 kB over target.
 * The ruling: "keep the PNG as the fallback and add a WebP twin … served
 * WebP-first the way the estate's backgrounds pair .webp with .jpg".
 *
 * ⛔ WHY THIS IS NOT A RENDER TEST. The estate picks ONE format per engine with a
 * cached canvas probe (src/config/pageBackgrounds.js) so no visitor ever fetches
 * both twins. In jsdom there is no canvas encoder, so that probe correctly
 * answers 'png' — which means a RENDERED assertion about WebP would be vacuous
 * forever, passing on a page that had never heard of the twin. So the selector is
 * exercised as a FUNCTION at both answers, and the files are read off disk, where
 * their real sizes are.
 *
 * ⚠ AND THE SIZE ARM IS THE POINT OF THE WHOLE RULING. A twin that is BIGGER than
 * its fallback is a regression, not an optimisation — it sends MORE bytes to the
 * engines that can decode it, which is the exact trap scripts/optimize-
 * backgrounds.mjs records learning at q78. Nothing here asserts a target; the
 * capture script says those out loud on every run. This asserts the INEQUALITY,
 * which is the thing that must never invert.
 */
import { describe, it, expect } from 'vitest';
import { existsSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { preferredImageExt } from '../../src/config/pageBackgrounds.js';
import {
  REALM_MAP_BASE,
  REALM_MAP_PLATE,
  realmMapPreview,
} from '../../src/components/home/LandingArtifacts.jsx';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const onDisk = (url) => join(ROOT, 'public', url.replace(/^\//, ''));

const WEBP = `${REALM_MAP_BASE}.webp`;
const PNG = `${REALM_MAP_BASE}.png`;

describe('the landing realm photograph and its WebP twin', () => {
  it('ships both files', () => {
    for (const url of [WEBP, PNG]) {
      expect(
        existsSync(onDisk(url)),
        `${url} is referenced by the landing but is not in the tree.`
        + ' Cut it with `node scripts/capture-landing-realm.mjs`.',
      ).toBe(true);
    }
    // The plate underneath is a DIFFERENT fallback — it paints when the
    // photograph has not been cut at all — and it must still be there.
    expect(existsSync(onDisk(REALM_MAP_PLATE)), 'the parchment plate beneath the photograph is gone').toBe(true);
  });

  it('the WebP is smaller than the PNG it replaces', () => {
    const webp = statSync(onDisk(WEBP)).size;
    const png = statSync(onDisk(PNG)).size;
    // ANTI-VACUITY: two empty files would satisfy an inequality of zeroes.
    expect(webp, 'the WebP twin is empty').toBeGreaterThan(10_000);
    expect(png, 'the PNG fallback is empty').toBeGreaterThan(10_000);
    expect(
      webp,
      `the WebP twin (${webp} B) is not smaller than the PNG (${png} B). Serving it first would`
      + ' send MORE bytes to every engine that can decode it — a regression wearing the name of'
      + ' an optimisation. Re-encode, or stop serving it first.',
    ).toBeLessThan(png);
  });

  it('a WebP-capable engine is served the WebP, and only the WebP', () => {
    const css = realmMapPreview('webp');
    expect(css, 'the WebP twin is not what a capable engine gets').toContain(`${WEBP}'`);
    // ⛔ ONE PHOTOGRAPH, ONE FETCH. CSS LAYERS background images rather than
    // falling back between them, so naming both twins here would make a capable
    // engine download the PNG as well — the double-download the shared probe
    // exists to prevent.
    // anchored: the same css was proven to name the WebP twin four lines above, so the PNG's absence is a real one.
    expect(css, 'both twins are named, so a capable engine fetches both').not.toContain(`${PNG}'`);
    // The plate still sits underneath, and it is not a twin.
    expect(css, 'the parchment plate is no longer beneath the photograph').toContain(REALM_MAP_PLATE);
  });

  it('an engine without WebP is served the PNG, and only the PNG', () => {
    const css = realmMapPreview('png');
    expect(css).toContain(`${PNG}'`);
    // anchored: the arm above asserts this same function DOES name the WebP when asked for it, so this exclusion is a selection and not a dead function
    expect(css, 'a non-WebP engine is offered a format it cannot decode').not.toContain(`${WEBP}'`);
  });

  it('the format is chosen by the estate\'s ONE probe, not a second copy of it', () => {
    // The landing's realm map and the page paintings must never disagree about
    // what this engine can decode. `preferredImageExt` is the paintings' own
    // cached probe with a different fallback extension — not a reimplementation.
    const chosen = preferredImageExt('png');
    expect(['webp', 'png'], `the probe answered ${chosen}`).toContain(chosen);
    expect(realmMapPreview(), 'the default disagrees with the probe').toContain(`${REALM_MAP_BASE}.${chosen}'`);
    // In this environment there is no canvas encoder, so the honest answer is the
    // fallback. If that ever changes, the arm above still holds either way.
    expect(preferredImageExt('jpg'), 'the twin selector invented its own fallback').toBe(chosen === 'webp' ? 'webp' : 'jpg');
  });
});
