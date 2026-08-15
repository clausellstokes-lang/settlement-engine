/**
 * scripts/optimize-landing-backgrounds.mjs — derive landing-sized JPEG variants
 * of the painted scenes the scrollable Welcome page uses.
 *
 * The Welcome page (src/components/HomeLanding.jsx + home/LandingBelowFold.jsx)
 * paints five scenes as section/artifact backgrounds. The full-size originals in
 * public/backgrounds/*.jpg weigh 290–500 kB each; loading them behind the
 * legibility scrims is wasteful. This emits ≤1400px-wide, quality-70 copies to
 * public/backgrounds/landing/<name>-1400.jpg — the landing image budget is
 * ≤350 kB per file and ≤1.6 MB total (spec §8). Mirrors the house pattern in
 * scripts/optimize-backgrounds.mjs (sharp, idempotent by mtime).
 *
 * Scene mapping (spec §4/§5): hero=village, 01=thorpe, 04=city, closer=create,
 * plus world-map inside the §04 realm-map artifact card (gallery thumbs reuse
 * these same variants with varied background-position). Run via
 * `npm run optimize:landing-backgrounds`.
 */

import sharp from 'sharp';
import { readdirSync, statSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BG_DIR = join(__dirname, '..', 'public', 'backgrounds');
const OUT_DIR = join(BG_DIR, 'landing');

// The five scenes the landing paints (spec §4/§5).
const SCENES = ['village', 'thorpe', 'city', 'create', 'world-map'];

const MAX_WIDTH = 1400; // spec §8: landing scenes ≤1400px wide.
const JPEG_QUALITY = 70; // spec §8: JPEG q≈70.

function kb(bytes) {
  return `${(bytes / 1024).toFixed(1)} kB`;
}

async function main() {
  if (!existsSync(BG_DIR)) {
    console.error(`[optimize-landing-backgrounds] missing dir: ${BG_DIR}`);
    process.exit(1);
  }
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  const available = new Set(readdirSync(BG_DIR).filter((f) => f.toLowerCase().endsWith('.jpg')));

  let built = 0;
  let skipped = 0;
  let outTotal = 0;

  console.log(`[optimize-landing-backgrounds] ${SCENES.length} landing scenes → public/backgrounds/landing/\n`);
  console.log(`  ${'scene'.padEnd(14)}${'src'.padStart(10)}${'landing'.padStart(10)}${'saved'.padStart(9)}   status`);
  console.log(`  ${'─'.repeat(56)}`);

  for (const scene of SCENES) {
    const srcName = `${scene}.jpg`;
    if (!available.has(srcName)) {
      console.error(`  ${scene.padEnd(14)}  MISSING source ${srcName}`);
      process.exit(1);
    }
    const srcPath = join(BG_DIR, srcName);
    const outPath = join(OUT_DIR, `${scene}-1400.jpg`);
    const srcStat = statSync(srcPath);

    const fresh = existsSync(outPath) && statSync(outPath).mtimeMs >= srcStat.mtimeMs;
    if (fresh) {
      const outBytes = statSync(outPath).size;
      outTotal += outBytes;
      skipped += 1;
      const pct = (100 * (1 - outBytes / srcStat.size)).toFixed(0);
      console.log(`  ${scene.padEnd(14)}${kb(srcStat.size).padStart(10)}${kb(outBytes).padStart(10)}${(pct + '%').padStart(9)}   skip (fresh)`);
      continue;
    }

    await sharp(srcPath)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .toFile(outPath);

    const outBytes = statSync(outPath).size;
    outTotal += outBytes;
    built += 1;
    const pct = (100 * (1 - outBytes / srcStat.size)).toFixed(0);
    console.log(`  ${scene.padEnd(14)}${kb(srcStat.size).padStart(10)}${kb(outBytes).padStart(10)}${(pct + '%').padStart(9)}   built`);
  }

  console.log(`  ${'─'.repeat(56)}`);
  console.log(`  ${'TOTAL'.padEnd(14)}${''.padStart(10)}${kb(outTotal).padStart(10)}`);
  console.log(`\n[optimize-landing-backgrounds] ${built} built, ${skipped} skipped — landing total ${kb(outTotal)} (budget 1.6 MB).`);

  if (outTotal > 1_600_000) {
    console.error(`[optimize-landing-backgrounds] OVER the 1.6 MB total image budget (${kb(outTotal)}).`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('[optimize-landing-backgrounds] failed:', err);
  process.exit(1);
});
