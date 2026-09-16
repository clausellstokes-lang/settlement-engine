/**
 * Fog reveal is spatial authorization, not a visual effect. Until the scene
 * compiler can clip every visual and semantic record before manifest creation,
 * the shared player surface must stay on the canonical player-safe 2D export.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = resolve(process.cwd());
const PLAYER_VIEW_PATH = resolve(
  ROOT,
  'src/components/townMap/fog/FogPlayerView.jsx',
);
const FOG_CHROME_PATH = resolve(
  ROOT,
  'src/components/townMap/fog/SettlementMapFogChrome.jsx',
);

function codeWithoutComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1');
}

describe('town-scene fog projection boundary', () => {
  it('keeps the live fogged player surface on the same player-safe 2D export as its handout', () => {
    const playerView = codeWithoutComments(
      readFileSync(PLAYER_VIEW_PATH, 'utf8'),
    );

    expect(playerView).toMatch(/townMapExportSvg\(settlement,\s*\{/);
    expect(playerView).toMatch(/audience:\s*['"]player['"]/);
    expect(playerView).toMatch(/fogReveal:\s*reveal/);
    expect(playerView).not.toMatch(
      /SettlementScene3D|TownSceneCanvas|createTownSceneManifest|from ['"]three['"]/,
    );
  });

  it('loads only the store-free fog player projection when a shared view opens', () => {
    const fogChrome = readFileSync(FOG_CHROME_PATH, 'utf8');

    expect(fogChrome).toMatch(
      /lazy\(\(\)\s*=>\s*import\(['"]\.\/FogPlayerView\.jsx['"]\)\)/,
    );
    expect(fogChrome).not.toMatch(
      /SettlementScene3D|TownSceneCanvas|createTownSceneManifest/,
    );
  });
});
