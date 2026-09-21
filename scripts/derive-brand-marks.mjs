#!/usr/bin/env node
/**
 * scripts/derive-brand-marks.mjs — THE BRAND DERIVATIVES, CUT FROM THE PAINTING
 * (owner order 2026-09-19, ODQ §934.17: "i leace it to your best judgement").
 *
 * THE MARK IS NOT DRAWN ANY MORE. It is the owner's own painting. The arrow header
 * (public/brand/arrow/arrow-strip.webp) carries the full logo mid-shaft: a brass
 * plaque bearing the SettlementForge wordmark, with a crimson WAX SEAL struck in
 * place of the wordmark's `o`. Every icon, every social card and every small brand
 * mark this estate ships is now a CUT of that painting rather than a geometric
 * redraw of it — so the tab icon, the unfurl card and the header are one object
 * seen at three sizes instead of three drawings that resemble each other.
 *
 * The geometric house device (src/design/organic/logo.js) was the owner-approved
 * mark of 2026-07-18 and is superseded HERE, for the shipped assets. It survives as
 * the documentation golden set (scripts/gen-organic-logo.mjs) and as the PDF's own
 * vector charter mark (src/pdf/primitives/HouseDeviceSeal.jsx), which this order
 * did not reach.
 *
 * WHAT IT WRITES
 *   public/brand/seal.png        the wax seal, transparent outside the disc, 256px
 *   public/brand/plaque.png      the whole plaque, feathered into transparency, 2x
 *   public/favicon.ico           16 + 32 PNG-in-ICO, the seal on parchment
 *   public/favicon-32.png        \
 *   public/favicon-192.png        > the declared PNG icon set, seal on parchment
 *   public/favicon-512.png       /
 *   public/apple-touch-icon.png  180, full-bleed parchment (the maskable ground)
 *   public/og-default.png        1200x630 share card, the plaque under Lora type
 *   public/og-craft.png          1200x630, the same card with its own tagline
 *
 * THE MEASURED RECTS. None of these live in src/components/nav/arrowGeometry.js —
 * that module maps the header's hit regions, not its ornament — so each was read
 * off the shipped strip's decoded pixels and is re-measured by
 * tests/build/brandDerivatives.test.js, which reds if the art is ever re-cut:
 *
 *   THE WAX SEAL   a disc at centre (387.0, 29.3), radius 21.0 strip px. Read as the
 *                  crimson/brass boundary: the wax is red-dominant with a collapsed
 *                  green channel (g <= 0.55r) while the brass field sits at g ~ 0.8r.
 *                  Square crop [365, 409) x [7, 51), 44 x 44.
 *   THE WORDMARK   lettering ink at [191, 454) x [12, 49): capitals from row 12, the
 *                  baseline at row 41, the g of "Forge" down to row 48. Measured with
 *                  a PER-ROW threshold (0.55 x the row's median luma across the
 *                  plate) because the plate's lower half is in painted shadow and a
 *                  fixed threshold calls the whole of it ink.
 *   THE PLAQUE     ornament tip to ornament tip at [128, 505] — the same span
 *                  arrowGeometry.js calls LOGO_PLATE, re-confirmed here — with the
 *                  plate body over rows 2..61. The crop takes [121, 512) x [0, 63):
 *                  seven columns of plain wood on each side, which is all there is
 *                  (the cord binding to its left ends at column 120 and the one to
 *                  its right, BINDINGS[0], starts at column 512), and it is the
 *                  feather's whole budget.
 *
 * THE LEGIBILITY CUT. The painted seal serves EVERY size, 16 px included. At 16 px
 * neither mark keeps its interior: the seal's triangle dissolves and the geometric
 * device's three concentric strokes merge. What survives is silhouette, and only the
 * seal has one a reader can name — a rimmed crimson disc on parchment, distinct in a
 * tab strip. The device at 16 px is an indistinct dark scribble. So the ICO's 16 px
 * layer is the seal too, and the device draws no shipped icon.
 *
 * DETERMINISM, AND WHY THE CARD TYPE IS OUTLINES. Every byte comes from the strip,
 * the two Lora faces under public/fonts and the constants below — no clock, no
 * randomness, no ambient font lookup. The card copy is NOT set with a text
 * rasteriser: sharp's text path goes through pango/fontconfig, and fontconfig
 * silently falls back when it has no config to load (measured 2026-09-19 on this
 * box: `font: 'Lora 40'`, `font: 'Nunito 40'` and a deliberately bogus family all
 * rendered the SAME 475 px run, and passing `fontfile` changed nothing — the cards
 * would have shipped in a substitute face with no error anywhere). So each line is
 * laid out by fontkit against the shipped TTF and emitted as GLYPH OUTLINES, which
 * need no font at raster time and cannot be substituted. Run the script twice and
 * diff — the test does exactly that.
 *
 * PROVENANCE. The strip is AI-generated art (openai:gpt-image@2026-09-16) carrying an
 * estate-written XMP credit, and a crop of it is still that art. sharp cannot carry
 * XMP into a PNG (measured: .keepMetadata() through a WebP -> PNG re-encode drops the
 * packet), so the two painted crops are stamped explicitly with the committed
 * injector's own packet builder and registered in scripts/ai-media-provenance.json.
 * The icons and cards COMPOSE those crops with estate-authored parchment and type;
 * the register's `_derived_marks` block names them and what they descend from, and
 * tests/build/brandDerivatives.test.js keeps that block honest.
 *
 * THE ENCODER IS NOT THE SAME ON EVERY PLATFORM, AND THAT IS WHY A MINT RECORD EXISTS.
 * Everything ABOVE this paragraph is about pixels, and the pixels are pure arithmetic:
 * the crops, the masks, the gradients and the glyph outlines are computed in JavaScript
 * and are identical on every host. The BYTES are not. sharp ships a different prebuilt
 * libvips per platform (`@img/sharp-darwin-arm64` here, `@img/sharp-linux-x64` on CI —
 * the same version numbers, different compiled binaries), and the palette PNG path runs
 * libimagequant plus a deflate through SIMD code chosen at build time. Measured
 * 2026-09-20: the committed art reproduces byte-for-byte on darwin/arm64 and does NOT on
 * ubuntu/x64, where `tests/build/brandDerivatives.test.js` had never run before PR #53.
 *
 * So the committed bytes are certified by a RECORD rather than by re-running the encoder
 * everywhere. `--record` writes tests/fixtures/brand-derivatives.mint.json: the signature
 * of the stack that minted them, the sha256 of every input the derivation reads, and the
 * sha256 and length of every file it wrote. The test then asserts on EVERY platform that
 * the shipped files are the minted files and the inputs are the minted inputs, and re-runs
 * the byte comparison only where the running stack equals the minting stack. A hand-edited
 * derivative, an edited script and an edited painting all red everywhere — which is
 * strictly more than the byte comparison caught, because it caught them only for whoever
 * happened to run the build tests on the minting platform.
 *
 * THE RECORD CARRIES NO TIMESTAMP, ON PURPOSE. Its provenance is the platform signature
 * and six input digests, all derived, so `--record` is byte-reproducible: re-run it and
 * `git diff` is empty unless something it certifies really moved.
 *
 * CANNOT-CATCH: the record pins the inputs this file DECLARES in DERIVATION_INPUTS. A new
 * input read by a future edit is covered only because that edit moves this file's own
 * sha256 and reds the arm until someone re-mints — at which point they must add it to
 * DERIVATION_INPUTS by hand. Adding a read without declaring it leaves that one file
 * unpinned from the next mint onward. Declare it in the same edit.
 *
 * Regenerate:  node scripts/derive-brand-marks.mjs
 * Verify:      node scripts/derive-brand-marks.mjs --out <dir>
 *   writes the same ten files under <dir>, mirroring their repo-relative paths and
 *   touching nothing in the tree. That is how the test re-runs the derivation and
 *   diffs it against the committed bytes without racing another suite reading
 *   public/ — and it is how a reviewer checks the art without a dirty worktree.
 * Re-mint:     node scripts/derive-brand-marks.mjs --record
 *   derives into a temp dir, REFUSES if what it produced is not what is on disk, and
 *   writes only tests/fixtures/brand-derivatives.mint.json. It never touches public/,
 *   and it is never a side effect of a plain run or of --out.
 *
 * @enforced-by tests/build/brandDerivatives.test.js
 */
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildXmpPacket, injectPngXmp } from './inject-ai-provenance.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = resolve(ROOT, 'public');
const FONTS = resolve(PUBLIC, 'fonts');

/** The master. Served as painted; never re-cut by this script. */
export const STRIP = 'public/brand/arrow/arrow-strip.webp';

/** The wax seal's disc, in strip px (see THE MEASURED RECTS). */
export const SEAL = Object.freeze({ cx: 387.0, cy: 29.3, r: 21.0 });

/** The square cut around the seal: the disc plus a single column of margin. */
export const SEAL_CROP = Object.freeze({ left: 365, top: 7, width: 44, height: 44 });

/** The painted wordmark's ink, in strip px. Reported, not cut — the plaque carries it. */
export const WORDMARK = Object.freeze({ x0: 191, x1: 454, capTop: 12, baseline: 41, bottom: 49 });

/** The plaque cut: the plate plus its seven columns of plain wood on each side. */
export const PLAQUE_CROP = Object.freeze({ left: 121, top: 0, width: 391, height: 63 });

/** The plate's ornament tips inside PLAQUE_CROP, in strip px (arrowGeometry.LOGO_PLATE). */
export const PLAQUE_PLATE = Object.freeze({ x0: 128, x1: 505, rowTop: 2, rowBottom: 61 });

/**
 * The feather, in strip px, per edge of the plaque cut. The sides get the whole wood
 * margin; the bottom gets five rows of the shaft's shadow; the top gets three, which
 * is a fade through the plate's own top frame — the painting is hard-cut at row 0
 * (the owner's crop line is the top of the wooden shaft) and an unfaded edge reads as
 * a seam against parchment.
 */
export const PLAQUE_FEATHER = Object.freeze({ left: 7, right: 7, top: 3, bottom: 5 });

/** The estate's parchment ground. Icons sit on it so one icon serves both tab schemes. */
export const PARCHMENT = '#FBF5E6';

/** The shipped sizes. */
export const SEAL_PX = 256;
export const PLAQUE_SCALE = 2;
export const ICON_SIZES = Object.freeze([32, 192, 512]);
export const ICO_SIZES = Object.freeze([16, 32]);
export const APPLE_TOUCH_PX = 180;

/**
 * The touch icon's parchment is full-bleed (iOS composites no transparency) but the
 * seal sits inside the central-80% MASKABLE SAFE ZONE, exactly as the device it
 * replaces did: a disc inscribed edge-to-edge survives the rounded-rect mask but
 * touches it, and a mark with no air around it reads as a mistake on a home screen.
 */
export const APPLE_TOUCH_SAFE = 0.8;

/**
 * The seal the PDF carries inline. 256 would put ~28 KB of base64 in the dossier
 * worker for a mark drawn at about 34 pt; 192 is 419 dpi at that size, which is
 * past what any press needs and a third of the bytes.
 */
export const PDF_SEAL_PX = 192;
export const PDF_SEAL_MODULE = 'src/pdf/assets/brandSeal.js';

export const CARD = Object.freeze({ w: 1200, h: 630 });

/** The card's furniture geometry, carried over from the cards these replace. */
const CARD_BAND_H = 150;
const CARD_RULE_TOP_H = 4;
const CARD_RULE_W = 300;
const CARD_RULE_H = 3;
const CARD_GAP_PLAQUE = 46;
const CARD_GAP_LINE = 16;
const CARD_GAP_RULE = 38;
/** A block set on a field's true centre reads low; lift it. */
const CARD_OPTICAL_LIFT = 12;

/** The two cards, each with the copy it carries today. */
export const CARDS = Object.freeze({
  'og-default.png': Object.freeze([
    'Living settlements for game masters',
    'Economies · factions · NPCs · history · simulated as a persistent world',
  ]),
  'og-craft.png': Object.freeze(['Living settlements for game masters']),
});

/** Card furniture, carried over from the cards these replace. */
const CARD_INK_TOP = '#2C2210';
const CARD_INK_BOTTOM = '#1B1408';
const CARD_GOLD_LEFT = '#D9B566';
const CARD_GOLD_RIGHT = '#C9A24C';
const CARD_HAIRLINE = '#E8D9B0';
const CARD_LINE_1 = '#4A3B22';
const CARD_LINE_2 = '#6A511F';

/* ── THE MINT RECORD ───────────────────────────────────────────────────────────
 * See "THE ENCODER IS NOT THE SAME ON EVERY PLATFORM" in the header for why these
 * exist. Everything here is pure: no I/O, no sharp, no process state except through
 * an argument — so the test can drive the decision over synthetic signatures.
 */

/** Where `--record` writes, and where the test reads. */
export const MINT_RECORD = 'tests/fixtures/brand-derivatives.mint.json';

/**
 * Every file the derivation READS, repo-relative. The record pins each one's sha256,
 * so an edit to any of them reds on every platform until it is re-minted. Measured
 * 2026-09-20 from this file's own `readFileSync`/`openSync` sites and its local import
 * closure (`inject-ai-provenance.mjs`, which imports nothing but node builtins).
 * See CANNOT-CATCH in the header before adding a read.
 */
export const DERIVATION_INPUTS = Object.freeze([
  'scripts/derive-brand-marks.mjs',
  'scripts/inject-ai-provenance.mjs',
  'scripts/ai-media-provenance.json',
  STRIP,
  'public/fonts/Lora-Bold.ttf',
  'public/fonts/Lora-Regular.ttf',
]);

/** The fields that decide whether comparing encoder BYTES means anything. */
export const SIGNATURE_FIELDS = Object.freeze(['platform', 'arch', 'sharp', 'vips']);

/**
 * BYTES where the running stack is the minting stack; DIMENSIONS anywhere else;
 * INVALID for a record that cannot be read, which is a hard failure and never a
 * silently skipped arm.
 */
export const MINT_MODES = Object.freeze({
  BYTES: 'bytes',
  DIMENSIONS: 'dimensions',
  INVALID: 'invalid',
});

/** This host's encoder signature. `sharp.versions` is passed in so this stays pure. */
export function runningSignature(versions) {
  return {
    platform: process.platform,
    arch: process.arch,
    sharp: versions?.sharp ?? null,
    vips: versions?.vips ?? null,
  };
}

/** A signature is four non-blank strings, or it is not a signature. */
function signatureProblem(label, signature) {
  if (!signature || typeof signature !== 'object' || Array.isArray(signature)) {
    return `the ${label} platform signature is not an object`;
  }
  const bad = SIGNATURE_FIELDS.filter(
    (field) => typeof signature[field] !== 'string' || signature[field].trim() === '',
  );
  return bad.length > 0
    ? `the ${label} platform signature is missing or malformed: ${bad.join(', ')}`
    : null;
}

/**
 * THE PLATFORM DECISION, as a pure function of two signatures.
 *
 * A byte comparison against a FRESH run can only hold where the encoder stack equals
 * the stack the committed bytes were minted on. Equal on all four fields → compare
 * bytes. Any field differing → compare decoded pixel DIMENSIONS instead, and say so.
 * Either signature unreadable → INVALID, so a missing or truncated record fails the
 * suite rather than quietly choosing the weaker arm.
 *
 * @param {unknown} running - this host's signature
 * @param {unknown} minted - the signature the record carries
 * @returns {{mode: string, differing: string[], problem: string|null}}
 */
export function mintComparisonMode(running, minted) {
  const problem = signatureProblem('running', running) ?? signatureProblem('minted', minted);
  if (problem) return { mode: MINT_MODES.INVALID, differing: [], problem };
  const differing = SIGNATURE_FIELDS.filter((field) => running[field] !== minted[field]);
  return {
    mode: differing.length === 0 ? MINT_MODES.BYTES : MINT_MODES.DIMENSIONS,
    differing,
    problem: null,
  };
}

/** One human line naming a foreign stack, for the CI log to carry. */
export function foreignStackLine(running, minted, differing) {
  const side = (s) => `${s.platform}/${s.arch} sharp ${s.sharp} vips ${s.vips}`;
  return `running ${side(running)} against a record minted on ${side(minted)}`
    + ` (differs on ${differing.join(', ')})`;
}

/**
 * A minimal ICO container embedding PNG images (the modern-browser-accepted
 * PNG-in-ICO form). ICONDIR (6B) + one ICONDIRENTRY (16B) per image + PNG blobs.
 * Carried over verbatim from scripts/gen-organic-logo.mjs, which no longer packs one.
 * @param {{size:number, png:Buffer}[]} images
 */
export function packIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);            // reserved
  header.writeUInt16LE(1, 2);            // type: icon
  header.writeUInt16LE(images.length, 4);
  const entries = [];
  const blobs = [];
  let offset = 6 + 16 * images.length;
  for (const { size, png } of images) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);  // width (0 = 256)
    e.writeUInt8(size >= 256 ? 0 : size, 1);  // height
    e.writeUInt8(0, 2);                        // palette
    e.writeUInt8(0, 3);                        // reserved
    e.writeUInt16LE(1, 4);                     // planes
    e.writeUInt16LE(32, 6);                    // bpp
    e.writeUInt32LE(png.length, 8);            // bytes
    e.writeUInt32LE(offset, 12);               // offset
    entries.push(e);
    blobs.push(png);
    offset += png.length;
  }
  return Buffer.concat([header, ...entries, ...blobs]);
}

/**
 * An RGBA buffer whose alpha is 255 inside a circle and 0 outside, with one
 * output pixel of anti-aliasing on the rim. Built here rather than handed to an
 * SVG rasteriser so the edge is the same on every host.
 * @param {number} n - the square's side in output px
 * @param {number} r - the circle's radius in output px
 */
export function discMask(n, r) {
  const buf = Buffer.alloc(n * n * 4);
  const c = n / 2;
  for (let y = 0; y < n; y += 1) {
    for (let x = 0; x < n; x += 1) {
      const d = Math.hypot(x + 0.5 - c, y + 0.5 - c);
      // A linear ramp across the last output pixel: 1 inside r - 0.5, 0 beyond r + 0.5.
      const a = Math.round(255 * Math.min(1, Math.max(0, r + 0.5 - d)));
      const i = (y * n + x) * 4;
      buf[i] = 255; buf[i + 1] = 255; buf[i + 2] = 255; buf[i + 3] = a;
    }
  }
  return buf;
}

/**
 * An RGBA buffer whose alpha ramps in from each edge — the plaque's feather.
 * @param {number} w
 * @param {number} h
 * @param {{left:number, right:number, top:number, bottom:number}} ramp - output px
 */
export function featherMask(w, h, ramp) {
  const buf = Buffer.alloc(w * h * 4);
  const edge = (d, n) => (n <= 0 ? 1 : Math.min(1, (d + 0.5) / n));
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const a = Math.round(255 * Math.min(
        edge(x, ramp.left),
        edge(w - 1 - x, ramp.right),
        edge(y, ramp.top),
        edge(h - 1 - y, ramp.bottom),
      ));
      const i = (y * w + x) * 4;
      buf[i] = 255; buf[i + 1] = 255; buf[i + 2] = 255; buf[i + 3] = a;
    }
  }
  return buf;
}

/** A vertical two-stop gradient as a raw RGBA buffer (the card's ink band). */
function verticalGradient(w, h, from, to) {
  const hex = (s) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const [r0, g0, b0] = hex(from);
  const [r1, g1, b1] = hex(to);
  const buf = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y += 1) {
    const t = h === 1 ? 0 : y / (h - 1);
    const r = Math.round(r0 + (r1 - r0) * t);
    const g = Math.round(g0 + (g1 - g0) * t);
    const b = Math.round(b0 + (b1 - b0) * t);
    for (let x = 0; x < w; x += 1) {
      const i = (y * w + x) * 4;
      buf[i] = r; buf[i + 1] = g; buf[i + 2] = b; buf[i + 3] = 255;
    }
  }
  return buf;
}

/** A horizontal two-stop gradient as a raw RGBA buffer (the card's gold rules). */
function horizontalGradient(w, h, from, to) {
  const hex = (s) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const [r0, g0, b0] = hex(from);
  const [r1, g1, b1] = hex(to);
  const buf = Buffer.alloc(w * h * 4);
  for (let x = 0; x < w; x += 1) {
    const t = w === 1 ? 0 : x / (w - 1);
    const r = Math.round(r0 + (r1 - r0) * t);
    const g = Math.round(g0 + (g1 - g0) * t);
    const b = Math.round(b0 + (b1 - b0) * t);
    for (let y = 0; y < h; y += 1) {
      const i = (y * w + x) * 4;
      buf[i] = r; buf[i + 1] = g; buf[i + 2] = b; buf[i + 3] = 255;
    }
  }
  return buf;
}

/**
 * One line of copy as an SVG of GLYPH OUTLINES, laid out by the font's own tables
 * (fontkit applies the face's kerning and ligatures, so this is the typography Lora
 * was drawn for, not a naive advance sum).
 *
 * @param {import('fontkit').Font} font
 * @param {string} text
 * @param {number} size - em size in px
 * @param {string} color
 * @returns {{ svg: string, width: number, height: number }}
 */
export function outlineLine(font, text, size, color) {
  const run = font.layout(text);
  const scale = size / font.unitsPerEm;
  const parts = [];
  let pen = 0;
  run.glyphs.forEach((glyph, i) => {
    const pos = run.positions[i];
    const d = glyph.path.toSVG();
    // A space has no contours; it moves the pen and draws nothing.
    if (d) {
      const x = (pen + (pos.xOffset || 0)) * scale;
      const y = -(pos.yOffset || 0) * scale;
      parts.push(`<path transform="translate(${x} ${y}) scale(${scale} ${-scale})" d="${d}"/>`);
    }
    pen += pos.xAdvance;
  });
  const width = Math.ceil(pen * scale);
  const ascent = font.ascent * scale;
  const height = Math.ceil(ascent - font.descent * scale);
  return {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">`
      + `<g fill="${color}" transform="translate(0 ${ascent})">${parts.join('')}</g></svg>`,
    width,
    height,
  };
}

async function main() {
  const { default: sharp } = await import('sharp');
  const fontkit = await import('fontkit');

  // --out <dir> mirrors the repo-relative paths under <dir> and leaves the tree alone.
  const outAt = process.argv.indexOf('--out');
  const outGiven = outAt >= 0 && process.argv[outAt + 1] ? resolve(process.argv[outAt + 1]) : null;
  // --record is its own mode, never a side effect of a plain run or of --out.
  const recording = process.argv.includes('--record');
  if (recording && outGiven) {
    console.error('[derive-brand-marks] --record and --out are different jobs: --record derives'
      + ' into a temp dir and writes only the mint record. Run them separately.');
    process.exit(2);
  }
  const scratch = recording ? mkdtempSync(join(tmpdir(), 'sf-brand-mint-')) : null;
  const OUT_ROOT = scratch ?? outGiven ?? ROOT;
  mkdirSync(resolve(OUT_ROOT, 'public', 'brand'), { recursive: true });
  mkdirSync(resolve(OUT_ROOT, dirname(PDF_SEAL_MODULE)), { recursive: true });

  const strip = readFileSync(resolve(ROOT, STRIP));
  const register = JSON.parse(readFileSync(resolve(ROOT, 'scripts', 'ai-media-provenance.json'), 'utf8'));
  const wrote = [];
  /** Every file this run produced, as the mint record measures them. */
  const produced = [];
  const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');

  /**
   * Quantise to a 256-entry palette. MEASURED on the plaque cut (2026-09-19):
   * 248,686 B at 8 bits per channel, 43,806 B at 256 colours with the seal's
   * modelling intact, 17,652 B at 128 where the wax posterises into bands and the
   * plate's shadow steps. 256 is the floor that keeps the painting.
   */
  const PALETTE = Object.freeze({ palette: true, colours: 256, compressionLevel: 9, effort: 10 });

  /** Write a file, stamping the painted crops with the committed injector's credit. */
  const emit = (rel, buf) => {
    const row = register.assets[rel];
    const out = row ? injectPngXmp(buf, buildXmpPacket(rel, row)) : buf;
    writeFileSync(resolve(OUT_ROOT, rel), out);
    wrote.push(`${rel} ${out.length}`);
    produced.push({ rel, sha256: sha256(out), bytes: out.length });
    return out;
  };

  /* ── 1. the wax seal, transparent outside the disc ─────────────────────────── */
  const sealCut = await sharp(strip)
    .extract({ left: SEAL_CROP.left, top: SEAL_CROP.top, width: SEAL_CROP.width, height: SEAL_CROP.height })
    .png()
    .keepMetadata()
    .toBuffer();

  /** The seal at n px, disc-masked. `ground` lays it on parchment (the icon form). */
  const sealAt = async (n, ground) => {
    const r = (SEAL.r / SEAL_CROP.width) * n;
    const disc = await sharp(sealCut)
      .resize(n, n, { kernel: 'lanczos3' })
      .composite([{ input: discMask(n, r), raw: { width: n, height: n, channels: 4 }, blend: 'dest-in' }])
      .png(PALETTE)
      .keepMetadata()
      .toBuffer();
    if (!ground) return disc;
    return sharp({ create: { width: n, height: n, channels: 4, background: PARCHMENT } })
      .composite([{ input: disc }])
      .png(PALETTE)
      .keepMetadata()
      .toBuffer();
  };

  const seal = emit('public/brand/seal.png', await sealAt(SEAL_PX, false));

  /* ── 2. the plaque, feathered into transparency ────────────────────────────── */
  const pw = PLAQUE_CROP.width * PLAQUE_SCALE;
  const ph = PLAQUE_CROP.height * PLAQUE_SCALE;
  const plaqueRgba = await sharp(strip)
    .extract({ left: PLAQUE_CROP.left, top: PLAQUE_CROP.top, width: PLAQUE_CROP.width, height: PLAQUE_CROP.height })
    .resize(pw, ph, { kernel: 'lanczos3' })
    .composite([{
      input: featherMask(pw, ph, {
        left: PLAQUE_FEATHER.left * PLAQUE_SCALE,
        right: PLAQUE_FEATHER.right * PLAQUE_SCALE,
        top: PLAQUE_FEATHER.top * PLAQUE_SCALE,
        bottom: PLAQUE_FEATHER.bottom * PLAQUE_SCALE,
      }),
      raw: { width: pw, height: ph, channels: 4 },
      blend: 'dest-in',
    }])
    .png({ compressionLevel: 9 })
    .keepMetadata()
    .toBuffer();
  emit('public/brand/plaque.png', await sharp(plaqueRgba).png(PALETTE).keepMetadata().toBuffer());

  /* ── 3. the icon set: the seal on parchment ────────────────────────────────── */
  for (const n of ICON_SIZES) emit(`public/favicon-${n}.png`, await sealAt(n, true));
  const inner = Math.round(APPLE_TOUCH_PX * APPLE_TOUCH_SAFE);
  emit('public/apple-touch-icon.png', await sharp({
    create: { width: APPLE_TOUCH_PX, height: APPLE_TOUCH_PX, channels: 4, background: PARCHMENT },
  })
    .composite([{ input: await sealAt(inner, false), top: (APPLE_TOUCH_PX - inner) / 2, left: (APPLE_TOUCH_PX - inner) / 2 }])
    .png(PALETTE)
    .keepMetadata()
    .toBuffer());
  const ico = [];
  for (const n of ICO_SIZES) ico.push({ size: n, png: await sealAt(n, true) });
  emit('public/favicon.ico', packIco(ico));

  /* ── 4. the PDF's copy of the seal ─────────────────────────────────────────── */
  // @react-pdf resolves an <Image src> string through the filesystem in node and
  // through fetch in the worker, and swallows the failure either way (it warns and
  // draws nothing). A data URI is the one shape that is byte-identical in the
  // worker, in the main-thread fallback and under vitest's node environment — so
  // the seal travels WITH the module instead of being fetched from /public.
  const pdfSeal = await sealAt(PDF_SEAL_PX, false);
  const pdfModule = `/**\n`
    + ` * pdf/assets/brandSeal — THE WAX SEAL, as bytes the dossier carries.\n`
    + ` *\n`
    + ` * GENERATED by scripts/derive-brand-marks.mjs from public/brand/arrow/arrow-strip.webp.\n`
    + ` * Do not edit by hand; re-run the script. It is a data URI rather than a public/ URL\n`
    + ` * because @react-pdf reads an <Image src> string off the filesystem under node and\n`
    + ` * over fetch in the worker, warns on failure and draws nothing — a seal that silently\n`
    + ` * vanishes from the paid surface is exactly the failure this estate refuses.\n`
    + ` *\n`
    + ` * @enforced-by tests/build/brandDerivatives.test.js\n`
    + ` */\n`
    + `/** The seal at ${PDF_SEAL_PX}px, disc-masked, as an inline PNG data URI. */\n`
    + `export const BRAND_SEAL_PNG = 'data:image/png;base64,${pdfSeal.toString('base64')}';\n`;
  writeFileSync(resolve(OUT_ROOT, PDF_SEAL_MODULE), pdfModule);
  wrote.push(`${PDF_SEAL_MODULE} ${Buffer.byteLength(pdfModule)}`);
  produced.push({
    rel: PDF_SEAL_MODULE,
    sha256: sha256(Buffer.from(pdfModule)),
    bytes: Buffer.byteLength(pdfModule),
  });

  /* ── 5. the share cards: the plaque under Lora type ────────────────────────── */
  const faces = {
    bold: fontkit.openSync(resolve(FONTS, 'Lora-Bold.ttf')),
    regular: fontkit.openSync(resolve(FONTS, 'Lora-Regular.ttf')),
  };
  const LINE_SPECS = [
    { face: faces.bold, size: 38, color: CARD_LINE_1 },
    { face: faces.regular, size: 26, color: CARD_LINE_2 },
  ];

  for (const [name, lines] of Object.entries(CARDS)) {
    const plaqueW = 900;
    const plaqueH = Math.round((plaqueW * PLAQUE_CROP.height) / PLAQUE_CROP.width);

    // Lay the copy out first: the whole stack is then centred as one object, so a
    // one-line card and a two-line card are both balanced rather than both
    // hand-nudged.
    const set = lines.map((text, i) => outlineLine(...(([spec]) => [spec.face, text, spec.size, spec.color])(
      [LINE_SPECS[Math.min(i, LINE_SPECS.length - 1)]],
    )));
    const stackH = plaqueH + CARD_GAP_PLAQUE
      + set.reduce((sum, l, i) => sum + l.height + (i > 0 ? CARD_GAP_LINE : 0), 0)
      + CARD_GAP_RULE + CARD_RULE_H;
    // Centred in the parchment below the band, lifted by CARD_OPTICAL_LIFT: a block
    // set on the true centre of a field reads low.
    const top0 = Math.round(CARD_BAND_H + CARD_RULE_TOP_H
      + ((CARD.h - CARD_BAND_H - CARD_RULE_TOP_H) - stackH) / 2 - CARD_OPTICAL_LIFT);

    const layers = [
      { input: verticalGradient(CARD.w, CARD_BAND_H, CARD_INK_TOP, CARD_INK_BOTTOM), raw: { width: CARD.w, height: CARD_BAND_H, channels: 4 }, top: 0, left: 0 },
      { input: horizontalGradient(CARD.w, CARD_RULE_TOP_H, CARD_GOLD_LEFT, CARD_GOLD_RIGHT), raw: { width: CARD.w, height: CARD_RULE_TOP_H, channels: 4 }, top: CARD_BAND_H, left: 0 },
      {
        input: await sharp(plaqueRgba).resize(plaqueW, plaqueH, { kernel: 'lanczos3' }).png().keepMetadata().toBuffer(),
        top: top0,
        left: Math.round((CARD.w - plaqueW) / 2),
      },
    ];

    let y = top0 + plaqueH + CARD_GAP_PLAQUE;
    for (const [i, laid] of set.entries()) {
      if (i > 0) y += CARD_GAP_LINE;
      layers.push({
        input: await sharp(Buffer.from(laid.svg)).png().keepMetadata().toBuffer(),
        top: y,
        left: Math.round((CARD.w - laid.width) / 2),
      });
      y += laid.height;
    }
    y += CARD_GAP_RULE;
    layers.push({ input: horizontalGradient(CARD_RULE_W, CARD_RULE_H, CARD_GOLD_LEFT, CARD_GOLD_RIGHT), raw: { width: CARD_RULE_W, height: CARD_RULE_H, channels: 4 }, top: y, left: Math.round((CARD.w - CARD_RULE_W) / 2) });
    // The parchment's own hairline frame, as the cards these replace carried.
    layers.push({ input: horizontalGradient(CARD.w, 2, CARD_HAIRLINE, CARD_HAIRLINE), raw: { width: CARD.w, height: 2, channels: 4 }, top: CARD.h - 2, left: 0 });

    const card = await sharp({ create: { width: CARD.w, height: CARD.h, channels: 4, background: PARCHMENT } })
      .composite(layers)
      .png(PALETTE)
      .keepMetadata()
      .toBuffer();
    emit(`public/${name}`, card);
  }

  if (recording) {
    // The record certifies the SHIPPED bytes. If what this run produced is not what is
    // on disk, the tree is mid-edit and a record cut now would certify bytes nobody
    // shipped — the one failure this mode can have. Refuse, naming the files.
    const drift = produced.filter(({ rel, sha256: fresh }) => {
      try {
        return sha256(readFileSync(resolve(ROOT, rel))) !== fresh;
      } catch {
        return true;
      }
    });
    rmSync(scratch, { recursive: true, force: true });
    if (drift.length > 0) {
      console.error('[derive-brand-marks] REFUSING TO MINT: these shipped files are not what the'
        + ' script produces on this host, so a record cut now would certify bytes nobody ships.'
        + ' Run the script plainly, commit the result, then re-mint:'
        + `\n  ${drift.map((d) => d.rel).join('\n  ')}`);
      process.exit(1);
    }
    const record = {
      _doc: [
        'GENERATED by `node scripts/derive-brand-marks.mjs --record`. NEVER HAND-EDIT.',
        'It certifies that the brand derivatives committed under public/ (and the PDF seal',
        'module under src/) are the output of the committed script over the committed',
        'inputs, measured on the stack named in mintedOn.',
        'WHY IT EXISTS: sharp ships a different prebuilt libvips per platform, so the PNG',
        'palette and deflate encoders do not emit identical bytes on darwin/arm64 and',
        'linux/x64 for identical input pixels. A byte comparison against a fresh run is',
        'therefore only meaningful on the minting stack; everywhere else the test compares',
        'decoded pixel dimensions and leans on the two digest arms below.',
        'It carries no timestamp on purpose: every field is derived, so --record is',
        'byte-reproducible and a re-run leaves an empty git diff unless something moved.',
        'TO RE-MINT: re-run the derivation plainly, commit the art, then --record. The mode',
        'refuses to write while any shipped file differs from what the script produces.',
      ],
      mintedOn: runningSignature(sharp.versions),
      inputs: Object.fromEntries(
        DERIVATION_INPUTS.map((rel) => [rel, sha256(readFileSync(resolve(ROOT, rel)))]),
      ),
      outputs: Object.fromEntries(
        produced.map(({ rel, sha256: hash, bytes }) => [rel, { sha256: hash, bytes }]),
      ),
    };
    writeFileSync(resolve(ROOT, MINT_RECORD), `${JSON.stringify(record, null, 2)}\n`);
    console.log(`[derive-brand-marks] minted ${MINT_RECORD} on ${record.mintedOn.platform}/`
      + `${record.mintedOn.arch} (sharp ${record.mintedOn.sharp}, vips ${record.mintedOn.vips}):`
      + ` ${Object.keys(record.inputs).length} inputs, ${Object.keys(record.outputs).length} outputs`);
    return;
  }

  console.log(`[derive-brand-marks] ${wrote.length} files from ${STRIP}, seal ${seal.length} B\n  ${wrote.join('\n  ')}`);
}

if (import.meta.url === `file://${process.argv[1]}`) main().catch((e) => { console.error(e); process.exit(1); });
