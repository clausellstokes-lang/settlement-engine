/**
 * scripts/optimize-backgrounds.mjs — derive shippable WebP twins of the
 * per-view page paintings.
 *
 * The paintings in public/backgrounds/*.jpg weigh 200–500 kB each (~4 MB
 * across the set) and are the perf tail of first paint: every top-level
 * view swaps in one as a fixed CSS background. WebP at quality ~78 cuts
 * each by roughly half at no visible cost behind the cream legibility
 * overlay (see src/index.css .page-bg).
 *
 * For every public/backgrounds/<name>.jpg this emits a sibling
 * public/backgrounds/<name>.webp:
 *   - quality 72, effort 6 (VIS-tuned). These paintings are detailed and
 *     already tightly JPEG-compressed, so the nominal ~78 the perf brief
 *     suggested actually left one twin LARGER than its JPEG and saved <10%
 *     overall — shipping a bigger file to modern browsers is a regression.
 *     Behind the 50–72% cream legibility overlay (src/index.css .page-bg)
 *     WebP's smooth-region softening is invisible, so dropping to q72 is
 *     indistinguishable while every twin now undercuts its JPEG (~23% off
 *     the 4 MB set). effort 6 squeezes the encoder for the smallest file.
 *   - width capped at 1920 (withoutEnlargement — only ever downsizes an
 *     oversized future source; today's sources are ≤1672w so this is a
 *     no-op that protects the byte budget if someone drops in a 4K export)
 *
 * The .webp twins are COMMITTED to the tree and ship as static assets
 * alongside the JPEG fallbacks — the runtime (config/pageBackgrounds.js)
 * serves WebP to engines that decode it and the JPEG to those that don't.
 *
 * Idempotent: a twin is rebuilt only when the source JPEG is newer than
 * the existing .webp (or the .webp is missing), so re-running is cheap and
 * safe. Run via `npm run optimize:backgrounds`.
 */

import sharp from 'sharp';
import { readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BG_DIR = join(__dirname, '..', 'public', 'backgrounds');

const WEBP_QUALITY = 72; // VIS-tuned; see header.
const WEBP_EFFORT = 6; // 0–6; max encoder effort for the smallest file.
const MAX_WIDTH = 1920; // downsize oversized sources only (withoutEnlargement).

function kb(bytes) {
  return `${(bytes / 1024).toFixed(1)} kB`;
}

async function main() {
  if (!existsSync(BG_DIR)) {
    console.error(`[optimize-backgrounds] missing dir: ${BG_DIR}`);
    process.exit(1);
  }

  const sources = readdirSync(BG_DIR)
    .filter((f) => f.toLowerCase().endsWith('.jpg'))
    .sort();

  if (sources.length === 0) {
    console.error(`[optimize-backgrounds] no *.jpg found in ${BG_DIR}`);
    process.exit(1);
  }

  let builtCount = 0;
  let skipped = 0;
  let srcTotal = 0;
  let outTotal = 0;

  console.log(`[optimize-backgrounds] ${sources.length} source paintings in public/backgrounds/\n`);
  console.log(
    `  ${'file'.padEnd(20)}${'jpg'.padStart(10)}${'webp'.padStart(10)}${'saved'.padStart(9)}   status`,
  );
  console.log(`  ${'─'.repeat(58)}`);

  for (const file of sources) {
    const srcPath = join(BG_DIR, file);
    const outName = file.replace(/\.jpg$/i, '.webp');
    const outPath = join(BG_DIR, outName);

    const srcStat = statSync(srcPath);
    const srcBytes = srcStat.size;
    srcTotal += srcBytes;

    // Idempotent: skip when an existing twin is at least as new as its source.
    const fresh = existsSync(outPath) && statSync(outPath).mtimeMs >= srcStat.mtimeMs;

    if (fresh) {
      const outBytes = statSync(outPath).size;
      outTotal += outBytes;
      skipped += 1;
      const pct = (100 * (1 - outBytes / srcBytes)).toFixed(0);
      console.log(
        `  ${file.padEnd(20)}${kb(srcBytes).padStart(10)}${kb(outBytes).padStart(10)}${(pct + '%').padStart(9)}   skip (fresh)`,
      );
      continue;
    }

    await sharp(srcPath)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY, effort: WEBP_EFFORT })
      .toFile(outPath);

    const outBytes = statSync(outPath).size;
    outTotal += outBytes;
    builtCount += 1;
    const pct = (100 * (1 - outBytes / srcBytes)).toFixed(0);
    console.log(
      `  ${file.padEnd(20)}${kb(srcBytes).padStart(10)}${kb(outBytes).padStart(10)}${(pct + '%').padStart(9)}   built`,
    );
  }

  const savedPct = srcTotal > 0 ? (100 * (1 - outTotal / srcTotal)).toFixed(1) : '0';
  console.log(`  ${'─'.repeat(58)}`);
  console.log(
    `  ${'TOTAL'.padEnd(20)}${kb(srcTotal).padStart(10)}${kb(outTotal).padStart(10)}${(savedPct + '%').padStart(9)}`,
  );
  console.log(
    `\n[optimize-backgrounds] ${builtCount} built, ${skipped} skipped — ` +
      `${kb(srcTotal)} jpg → ${kb(outTotal)} webp (saved ${kb(srcTotal - outTotal)}, ${savedPct}%).`,
  );
}

main().catch((err) => {
  console.error('[optimize-backgrounds] failed:', err);
  process.exit(1);
});
