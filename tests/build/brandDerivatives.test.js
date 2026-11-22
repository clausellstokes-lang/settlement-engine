/**
 * tests/build/brandDerivatives.test.js — THE BRAND DERIVATIVES ARE THE PAINTING.
 *
 * The owner's order of 2026-09-19 (ODQ §934.17) took the brand off a drawing and
 * put it on his own arrow-header painting: every icon, every share card and the
 * eager mark are now CUTS of public/brand/arrow/arrow-strip.webp, made by
 * scripts/derive-brand-marks.mjs. This file is what stops that from rotting.
 *
 * ⛔ WHY A "THE FILES EXIST" TEST WOULD BE WORTHLESS HERE. Every failure this
 * family actually produces is silent:
 *   - a card rendered in a SUBSTITUTE FACE. sharp's text path goes through
 *     pango/fontconfig and falls back without a word when it has no config to
 *     load — measured on the build box, `Lora 40`, `Nunito 40` and a bogus family
 *     all produced the same 475 px run. Nothing threw. The cards would simply have
 *     been wrong.
 *   - an <Image src> the PDF cannot resolve. @react-pdf warns to the console and
 *     draws NOTHING, and no PDF test in this estate reads console.warn, so the
 *     seal would vanish from the paid surface with the suite green.
 *   - an icon link pointing at a size the file is not, which no browser reports.
 *   - a re-cut of the art that moves the seal under a crop that is still hard-coded
 *     where it used to be — the crop would silently take brass and wood.
 * So the arms below re-MEASURE the painting, re-RUN the derivation and diff its
 * bytes, and read the actual pixels behind every declared size.
 *
 * ⚠ THE DERIVATION RUNS OUT OF TREE. `--out <dir>` mirrors the repo-relative paths
 * under a temp dir, so this file never writes into public/ and can never race
 * another suite reading it — and a non-deterministic script reds here instead of
 * quietly leaving a dirty worktree behind as its "fix".
 *
 * ⚠ DETERMINISM IS PROVED TWICE, ON PURPOSE. Comparing one run against the
 * committed bytes proves the commit matches THIS host; comparing two fresh runs
 * against each other proves the script has no ambient input at all. Either alone
 * would pass for a script that had, say, baked a timestamp into a PNG chunk.
 *
 * ⛔ THE ENCODER IS NOT THE SAME ON EVERY PLATFORM, AND THAT IS WHY THE BYTE ARM WAS
 * RE-CUT INTO THREE (2026-09-20, PR #53's first CI run). The arm below used to compare
 * the committed bytes against a fresh run, full stop. It was green on the owner's Mac
 * and had never run in CI; the first time it did, it failed on ubuntu x64 — because
 * sharp ships a different prebuilt libvips per platform (@img/sharp-darwin-arm64 vs
 * @img/sharp-linux-x64, the same version numbers, different compiled binaries) and the
 * palette-PNG quantiser and deflate do not emit identical bytes for identical input
 * pixels. The sibling "two fresh runs agree" arm PASSED there, which is the measurement
 * that localises it: the derivation is deterministic on each platform and differs only
 * BETWEEN them. The PIXELS never differ — the crops, masks, gradients and glyph
 * outlines are computed in JavaScript.
 *
 * So the claim is made TRUE EVERYWHERE rather than skipped anywhere:
 *   ARM A  the shipped files are the files tests/fixtures/brand-derivatives.mint.json
 *          certifies                                        — runs on every platform
 *   ARM B  the painting, the provenance register, the two Lora faces and the script's
 *          own import closure are the inputs that record was minted over
 *                                                            — runs on every platform
 *   ARM C  a fresh run is byte-identical to the record ON THE MINTING STACK; on any
 *          other stack it must still produce all ten paths, each DECODING to the same
 *          pixel size as its committed twin, and it prints one line to the CI log
 *          naming the foreign stack and what it did instead.
 *
 * ⭐ THIS IS STRICTLY STRONGER THAN WHAT IT REPLACED, not a weakening. An edit to the
 * script or to the painting without a re-mint now reds on EVERY platform (ARM B);
 * before, that drift surfaced only as an output byte difference, which only whoever ran
 * the build tests on the minting platform could ever see. What is given up is narrow and
 * named: off the minting stack, a change that altered the ENCODED bytes while leaving
 * the inputs, the shipped files and the pixel geometry all identical would not be seen —
 * and no such change exists that is not already an input change.
 *
 * ⛔ THE RECORD IS GENERATED, NEVER HAND-WRITTEN, AND IT IS NOT TRUSTED FOR BEING
 * GENERATED. `node scripts/derive-brand-marks.mjs --record` derives into a temp dir,
 * refuses to write while any shipped file differs from what it just produced, and
 * touches nothing under public/. A doctored row in it reds ARM A all the same.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

import HouseDevice, { HOUSE_SEAL_SRC } from '../../src/components/brand/HouseDevice.jsx';
import { BRAND_SEAL_PNG } from '../../src/pdf/assets/brandSeal.js';
import {
  CARD, DERIVATION_INPUTS, MINT_MODES, MINT_RECORD, PDF_SEAL_MODULE, PLAQUE_CROP, PLAQUE_PLATE,
  SEAL, SEAL_CROP, SIGNATURE_FIELDS, STRIP, WORDMARK,
  foreignStackLine, mintComparisonMode, runningSignature,
} from '../../scripts/derive-brand-marks.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const DERIVE = join(ROOT, 'scripts', 'derive-brand-marks.mjs');
const INDEX_HTML = readFileSync(join(ROOT, 'index.html'), 'utf8');
const register = JSON.parse(readFileSync(join(ROOT, 'scripts', 'ai-media-provenance.json'), 'utf8'));

/**
 * The shipped strip's digest, the SAME pin tests/build/arrowHeaderAssets.test.js
 * holds. It is repeated here rather than imported because this file's whole claim
 * is "these crops came out of THAT painting": if the art is re-cut, every rect
 * below is a guess about pixels that no longer exist, and this is the arm that
 * says so first.
 */
const STRIP_SHA256 = '427f9d98fb9a714c443f074b233ab9ec9cf494e2bd6f096b67d2691c08502dd2';

/** Every file the derivation writes, repo-relative, in the script's own order. */
const DERIVED = Object.freeze([
  'public/brand/seal.png',
  'public/brand/plaque.png',
  'public/favicon-32.png',
  'public/favicon-192.png',
  'public/favicon-512.png',
  'public/apple-touch-icon.png',
  'public/favicon.ico',
  PDF_SEAL_MODULE,
  'public/og-default.png',
  'public/og-craft.png',
]);

const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const isPng = (buf) => buf.subarray(0, 8).equals(PNG_MAGIC);
const pngDims = (buf) => ({ w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) });

/** The PNG layers packed into an ICO, as {size, png}. */
function icoLayers(buf) {
  expect(buf.readUInt16LE(0), 'ICO reserved field').toBe(0);
  expect(buf.readUInt16LE(2), 'ICO type is icon').toBe(1);
  const count = buf.readUInt16LE(4);
  const out = [];
  for (let i = 0; i < count; i += 1) {
    const entry = 6 + 16 * i;
    out.push({
      size: buf.readUInt8(entry) || 256,
      png: buf.subarray(buf.readUInt32LE(entry + 12), buf.readUInt32LE(entry + 12) + buf.readUInt32LE(entry + 8)),
    });
  }
  return out;
}

/** A public/ asset by its root-absolute URL. */
const publicFile = (url) => join(ROOT, 'public', url.replace(/^\//, ''));

/** Every declared icon link in index.html, as {rel, href, sizes, type}. */
function iconLinks(html) {
  const out = [];
  for (const tag of html.match(/<link\b[^>]*>/g) || []) {
    const rel = (tag.match(/\brel="([^"]+)"/) || [])[1];
    if (rel !== 'icon' && rel !== 'apple-touch-icon') continue;
    out.push({
      rel,
      href: (tag.match(/\bhref="([^"]+)"/) || [])[1],
      sizes: (tag.match(/\bsizes="([^"]+)"/) || [])[1] || null,
      type: (tag.match(/\btype="([^"]+)"/) || [])[1] || null,
    });
  }
  return out;
}

const metaContent = (html, attr, name) =>
  (html.match(new RegExp(`<meta[^>]*\\b${attr}="${name}"[^>]*\\bcontent="([^"]*)"`)) || [])[1];

/** Every node in a react-pdf element tree, function components executed. */
function pdfNodes(node, out = []) {
  if (node === null || node === undefined || typeof node === 'boolean') return out;
  if (Array.isArray(node)) {
    for (const child of node) pdfNodes(child, out);
    return out;
  }
  if (typeof node !== 'object') return out;
  if (typeof node.type === 'function') return pdfNodes(node.type(node.props || {}), out);
  out.push(node);
  return pdfNodes(node.props ? node.props.children : null, out);
}

/* ── THE MINT RECORD, AND THE TWO PURE COMPARATORS THE PLANTS DRIVE ──────────────
 * See the ⚠ THE ENCODER IS NOT THE SAME ON EVERY PLATFORM note in the header. Both
 * comparators take their byte READER as a parameter, so every plant below runs this
 * exact live code over a doctored in-memory COPY and the repository is never touched.
 */
let MINT = null;
let MINT_PROBLEM = null;
try {
  MINT = JSON.parse(readFileSync(join(ROOT, MINT_RECORD), 'utf8'));
} catch (error) {
  MINT_PROBLEM = error.message;
}

/** This host's encoder signature, and what it means for the byte comparison. */
const RUNNING = runningSignature(sharp.versions);
const VERDICT = mintComparisonMode(RUNNING, MINT === null ? null : MINT.mintedOn);

/** Which recorded OUTPUTS a tree does not match. */
function staleAgainst(outputs, read) {
  const stale = [];
  for (const [rel, row] of Object.entries(outputs ?? {})) {
    let bytes;
    try {
      bytes = read(rel);
    } catch {
      stale.push(`${rel}: not on disk at all`);
      continue;
    }
    const actual = sha256(bytes);
    if (actual !== row.sha256) stale.push(`${rel}: minted ${row.sha256.slice(0, 12)}, tree ${actual.slice(0, 12)}`);
    else if (bytes.length !== row.bytes) stale.push(`${rel}: minted ${row.bytes} B, tree ${bytes.length} B`);
  }
  return stale;
}

/** Which recorded INPUTS a tree does not match. */
function driftedInputs(inputs, read) {
  const drift = [];
  for (const [rel, minted] of Object.entries(inputs ?? {})) {
    let actual;
    try {
      actual = sha256(read(rel));
    } catch {
      drift.push(`${rel}: not on disk at all`);
      continue;
    }
    if (actual !== minted) drift.push(`${rel}: minted ${minted.slice(0, 12)}, tree ${actual.slice(0, 12)}`);
  }
  return drift;
}

/**
 * The DECODED shape of a derivative, whatever container it ships in: a bare PNG, the
 * ICO's packed layers, or the base64 PNG inside the PDF's seal module.
 *
 * ⚠ IT DECODES, IT DOES NOT READ A HEADER. Measured 2026-09-20: `sharp(buf).metadata()`
 * RESOLVES on a PNG truncated to half its length, so a header read would call a mangled
 * file the right size. `.raw().toBuffer()` decodes the pixels and rejects it.
 *
 * Width and height are the comparison; CHANNELS are reported but not asserted, because a
 * foreign quantiser may legitimately drop an all-opaque alpha plane and that is not the
 * failure this arm is looking for.
 */
async function decodedShapeOf(rel, bytes) {
  const decode = async (buf) => {
    const { info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
    return { size: `${info.width}x${info.height}`, channels: info.channels };
  };
  if (rel === PDF_SEAL_MODULE) {
    const body = (bytes.toString('utf8').match(/data:image\/png;base64,([A-Za-z0-9+/=]+)/) || [])[1];
    if (!body) throw new Error(`${rel} carries no PNG data URI`);
    const one = await decode(Buffer.from(body, 'base64'));
    return { size: `module ${one.size}`, channels: one.channels };
  }
  if (rel.endsWith('.ico')) {
    const sizes = [];
    const channels = [];
    for (const layer of icoLayers(bytes)) {
      const one = await decode(layer.png);
      sizes.push(`${layer.size}:${one.size}`);
      channels.push(one.channels);
    }
    return { size: `ico [${sizes.join(', ')}]`, channels: channels.join('/') };
  }
  return decode(bytes);
}

let outA;
let outB;
let strip;
let stripPixels;

beforeAll(async () => {
  outA = mkdtempSync(join(tmpdir(), 'sf-brand-a-'));
  outB = mkdtempSync(join(tmpdir(), 'sf-brand-b-'));
  for (const dir of [outA, outB]) {
    execFileSync(process.execPath, [DERIVE, '--out', dir], { cwd: ROOT, stdio: 'pipe' });
  }
  strip = readFileSync(join(ROOT, STRIP));
  const raw = await sharp(strip).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  stripPixels = raw;
}, 180_000);

afterAll(() => {
  for (const dir of [outA, outB]) if (dir) rmSync(dir, { recursive: true, force: true });
});

describe('the master painting is the one these crops were measured on', () => {
  it('arrow-strip.webp is byte-for-byte the strip the rects were read off', () => {
    expect(
      sha256(strip),
      'the painted header was re-cut. Every rect in scripts/derive-brand-marks.mjs was'
      + ' measured on the OLD pixels, so re-measure the seal, the wordmark and the plaque'
      + ' before trusting a single crop — and re-run the script.',
    ).toBe(STRIP_SHA256);
  });

  it('the strip decodes to the canvas the geometry module declares', () => {
    expect({ w: stripPixels.info.width, h: stripPixels.info.height }).toEqual({ w: 2133, h: 182 });
  });
});

describe('the measured rects still describe the painting', () => {
  /** Wax: red-dominant with a collapsed green channel. Brass sits near g = 0.8r. */
  const isWax = (x, y) => {
    const i = (y * stripPixels.info.width + x) * stripPixels.info.channels;
    const [r, g, b] = [stripPixels.data[i], stripPixels.data[i + 1], stripPixels.data[i + 2]];
    if (g > 0.55 * r) return false;
    if (b > 0.62 * r) return false;
    return g < 95;
  };

  it('CONTROL: the wax detector fires on the seal and clears the plate it sits in', () => {
    // Without this the outward scan below could agree with the circle by seeing
    // nothing. The clearing control is the plate's FLAT FIELD, not the space beside
    // the seal: the wordmark's serifs are dark warm ink and read red-dominant too,
    // which is exactly why the scan walks outward from the centre and stops at the
    // first non-wax pixel instead of taking a window's extremes.
    expect(isWax(Math.round(SEAL.cx), Math.round(SEAL.cy)), 'the seal centre is not wax').toBe(true);
    expect(isWax(300, 10), 'the plate\'s bright brass field reads as wax').toBe(false);
    expect(isWax(Math.round(SEAL.cx), 4), 'the brass above the seal reads as wax').toBe(false);
  });

  it('the wax disc still sits at the measured centre and radius', () => {
    // Walk OUTWARD from the centre rather than taking the extremes of a window:
    // the plate's lower half is painted in deep shadow that also reads red-dominant,
    // so a min/max scan silently annexes it and the chord comes back too long.
    // Rows are limited to the disc's middle third, where the chord is long enough
    // that a one-pixel rim error cannot dominate it and the top highlight (which is
    // too bright to read as wax) is out of frame.
    const cx = Math.round(SEAL.cx);
    const off = [];
    for (let y = Math.round(SEAL.cy - SEAL.r / 3); y <= Math.round(SEAL.cy + SEAL.r / 3); y += 1) {
      let x0 = cx;
      let x1 = cx;
      while (x0 > cx - 40 && isWax(x0 - 1, y)) x0 -= 1;
      while (x1 < cx + 40 && isWax(x1 + 1, y)) x1 += 1;
      const half = Math.sqrt(Math.max(0, SEAL.r * SEAL.r - (y - SEAL.cy) ** 2));
      if (Math.abs((x0 + x1) / 2 - SEAL.cx) > 1.5) off.push(`row ${y}: centre ${(x0 + x1) / 2}`);
      if (Math.abs((x1 - x0 + 1) / 2 - half) > 2.5) off.push(`row ${y}: half-chord ${(x1 - x0 + 1) / 2} vs ${half.toFixed(2)}`);
    }
    expect(
      off,
      'the wax seal moved or changed size under the crop. SEAL in'
      + ` scripts/derive-brand-marks.mjs is stale:\n  ${off.join('\n  ')}`,
    ).toEqual([]);
  });

  it('the plaque cut sits strictly between the two cord bindings', () => {
    // A cord binding is crimson down ESSENTIALLY THE WHOLE shaft; the plate's own
    // engraved frame and its shadowed lower half are red-dominant too but never
    // near-total, so the discriminator is the run length, not the hue. Measured:
    // the bindings hold 50-58 of the 58 rows, the plate's margins 24-45.
    const SHAFT_ROWS = 58;
    const crimsonRows = (x) => {
      let n = 0;
      for (let y = 4; y < 62; y += 1) if (isWax(x, y)) n += 1;
      return n;
    };
    const bindings = [];
    for (let x = 60; x <= 600; x += 1) {
      if (crimsonRows(x) < 50) continue;
      const last = bindings[bindings.length - 1];
      if (last && last.x1 === x - 1) last.x1 = x;
      else bindings.push({ x0: x, x1: x });
    }
    const wide = bindings.filter((b) => b.x1 - b.x0 >= 8);
    expect(wide.length, 'no cord binding was found at all — the detector is looking at nothing').toBeGreaterThanOrEqual(2);
    expect(crimsonRows(wide[0].x0 + 2), 'the binding detector found a run that is not crimson').toBeGreaterThan(SHAFT_ROWS * 0.8);

    const left = wide[0];
    const right = wide.find((b) => b.x0 > PLAQUE_PLATE.x1);
    expect(right, 'the binding to the right of the plate is gone').toBeTruthy();
    const cut = { x0: PLAQUE_CROP.left, x1: PLAQUE_CROP.left + PLAQUE_CROP.width };
    expect(
      { leftClear: cut.x0 > left.x1, rightClear: cut.x1 <= right.x0 },
      `the plaque cut [${cut.x0}, ${cut.x1}) runs into a cord binding`
      + ` (left ends ${left.x1}, right starts ${right.x0}) — the crop or the painting moved`,
    ).toEqual({ leftClear: true, rightClear: true });
    // ...and it really is a TIGHT cut: all the wood there is, not an arbitrary window.
    expect(cut.x0 - left.x1, 'the cut left more wood than the painting has').toBeLessThanOrEqual(2);
    expect(right.x0 - cut.x1, 'the cut left more wood than the painting has').toBeLessThanOrEqual(2);
  });

  it('the wordmark ink still lies inside the plate the plaque cut takes', () => {
    // The reported rect is not used as a crop, so this asks only that it stays
    // truthful: the lettering must sit inside the plate, inside the cut.
    expect(WORDMARK.x0).toBeGreaterThan(PLAQUE_PLATE.x0);
    expect(WORDMARK.x1).toBeLessThan(PLAQUE_PLATE.x1);
    expect(WORDMARK.capTop).toBeGreaterThanOrEqual(PLAQUE_PLATE.rowTop);
    expect(WORDMARK.bottom).toBeLessThan(PLAQUE_CROP.height);
    // ...and the seal really is struck INTO the wordmark, not beside the plate.
    expect(SEAL.cx).toBeGreaterThan(WORDMARK.x0);
    expect(SEAL.cx).toBeLessThan(WORDMARK.x1);
  });
});

describe('the derivation is deterministic and the committed bytes are its output', () => {
  it('the two out-of-tree runs agree byte-for-byte (no ambient input)', () => {
    const drift = DERIVED.filter((rel) => sha256(readFileSync(join(outA, rel))) !== sha256(readFileSync(join(outB, rel))));
    expect(
      drift,
      'two runs of scripts/derive-brand-marks.mjs produced different bytes. Something'
      + ' ambient reached the render — a clock, a locale, a host font lookup — and the'
      + ` committed art can no longer be reproduced:\n  ${drift.join('\n  ')}`,
    ).toEqual([]);
  });

  it('the mint record is readable and certifies exactly the ten files the script writes', () => {
    // NON-VACUITY FIRST. Every arm below is a statement about this record's contents, so
    // a record that is missing, truncated or certifying nothing must red HERE, loudly,
    // rather than letting the three arms pass over an empty object.
    expect(MINT_PROBLEM, `${MINT_RECORD} could not be read — re-mint with`
      + ` \`node scripts/derive-brand-marks.mjs --record\`: ${MINT_PROBLEM}`).toBe(null);
    expect(Object.keys(MINT.outputs), 'the record certifies a different file set than the script writes')
      .toEqual([...DERIVED]);
    expect(Object.keys(MINT.inputs), 'the record pins a different input set than the script declares')
      .toEqual([...DERIVATION_INPUTS]);
    expect(VERDICT.problem, 'the record carries no usable platform signature').toBe(null);
    expect(VERDICT.mode, 'the platform decision could not be made at all').not.toBe(MINT_MODES.INVALID);
  });

  it('ARM A — every shipped derivative is byte-for-byte the file the record certifies', () => {
    // Runs on EVERY platform. A hand-edited icon, a half-committed re-cut or a file that
    // never landed reds here wherever the suite is run, which the old byte comparison
    // could only do for whoever happened to be on the minting stack.
    const stale = staleAgainst(MINT.outputs, (rel) => readFileSync(join(ROOT, rel)));
    expect(
      stale,
      'a shipped brand derivative is not the file the mint record certifies. Either it was'
      + ' hand-edited (restore it), or the art was legitimately re-cut and never re-minted:'
      + ' re-run `node scripts/derive-brand-marks.mjs`, commit the art, then'
      + ` \`--record\`:\n  ${stale.join('\n  ')}`,
    ).toEqual([]);
  });

  it('ARM B — every input the derivation reads is the input the record was minted over', () => {
    // Runs on EVERY platform, and this is the arm that is strictly STRONGER than what it
    // replaced: an edit to the script, to its import closure, to the provenance register
    // or to the painting now reds everywhere the moment it lands without a re-mint.
    // Before, that drift was visible only to whoever ran the build tests on the minting
    // platform, because it was caught as a byte difference in the output rather than as a
    // change to the input.
    const drift = driftedInputs(MINT.inputs, (rel) => readFileSync(join(ROOT, rel)));
    expect(
      drift,
      'the derivation\'s inputs moved without a re-mint, so the record no longer certifies'
      + ' anything about what the script would produce today. Re-run the derivation, commit'
      + ` the art, then \`node scripts/derive-brand-marks.mjs --record\`:\n  ${drift.join('\n  ')}`,
    ).toEqual([]);
  });

  it('ARM B — the record was minted over the same painting this file pins by hand', () => {
    // Two pins for one fact is a drift waiting to happen; this is the arm that binds them.
    expect(MINT.inputs[STRIP], 'the mint record and STRIP_SHA256 name different paintings')
      .toBe(STRIP_SHA256);
  });

  it('ARM C — on the minting stack the fresh run is byte-identical; elsewhere it matches dimensions', async () => {
    // ⛔ WHY THIS ARM IS CONDITIONAL AND THE TWO ABOVE ARE NOT. sharp ships a different
    // prebuilt libvips per platform, so the palette-PNG and deflate encoders do not emit
    // identical bytes on darwin/arm64 and linux/x64 for identical input pixels. Comparing
    // encoder BYTES against a fresh run is therefore only a true statement on the stack
    // the committed art was minted on. Nothing is lost off it: arms A and B still bind
    // every shipped byte and every input, on every platform.
    const missing = DERIVED.filter((rel) => !existsSync(join(outA, rel)));
    expect(missing, `the fresh run did not produce every declared path:\n  ${missing.join('\n  ')}`)
      .toEqual([]);

    if (VERDICT.mode === MINT_MODES.BYTES) {
      const stale = staleAgainst(MINT.outputs, (rel) => readFileSync(join(outA, rel)));
      expect(
        stale,
        'on the MINTING stack a fresh derivation must reproduce the certified bytes exactly.'
        + ' Something ambient reached the render, or the encoder moved under the same version'
        + ` numbers:\n  ${stale.join('\n  ')}`,
      ).toEqual([]);
      return;
    }

    const rows = [];
    let identical = 0;
    for (const rel of DERIVED) {
      const fresh = readFileSync(join(outA, rel));
      const committed = readFileSync(join(ROOT, rel));
      if (sha256(fresh) === sha256(committed)) identical += 1;
      rows.push({
        rel,
        fresh: await decodedShapeOf(rel, fresh),
        committed: await decodedShapeOf(rel, committed),
      });
    }
    const off = rows
      .filter((row) => row.fresh.size !== row.committed.size)
      .map((row) => `${row.rel}: fresh ${row.fresh.size}, shipped ${row.committed.size}`);
    const channelDrift = rows
      .filter((row) => String(row.fresh.channels) !== String(row.committed.channels))
      .map((row) => `${row.rel} ${row.committed.channels}->${row.fresh.channels}`);
    // A report-only line written with process.stdout.write: vitest's DEFAULT reporter drops
    // a PASSING test's console.log, and CI's log is the only place this is ever read.
    process.stdout.write(
      `\n[brandDerivatives] ARM C compared DIMENSIONS, not bytes: ${foreignStackLine(RUNNING, MINT.mintedOn, VERDICT.differing)}.`
      + ` ${identical}/${DERIVED.length} derivatives were byte-identical anyway; all ${DERIVED.length}`
      + ' were decoded and compared by pixel size.'
      + (channelDrift.length > 0 ? ` Channel counts moved (reported, not asserted): ${channelDrift.join(', ')}.` : '')
      + ' Arms A and B bound every shipped byte and every input on this platform.\n',
    );
    expect(
      off,
      'a fresh derivation on a FOREIGN encoder stack produced a different pixel size. That is'
      + ' not an encoder difference — the geometry is pure arithmetic and must be identical'
      + ` everywhere:\n  ${off.join('\n  ')}`,
    ).toEqual([]);
  });

  it('the run really produced files (the comparison is not comparing nothing)', () => {
    expect(DERIVED.length).toBe(10);
    for (const rel of DERIVED) {
      expect(readFileSync(join(outA, rel)).length, `${rel} is empty`).toBeGreaterThan(1000);
    }
  });
});

describe('the platform decision is pure, and every arm is proven able to see', () => {
  // ⭐ ALL PLANTS ARE IN-MEMORY, over COPIES. The repository is never mutated: each plant
  // hands the LIVE comparator a reader that doctors one buffer on its way out, exactly as
  // tests/lint/goldenFreeze.walker.test.js does. A plant that re-implemented the detector
  // would prove nothing about the detector.
  const HERE = Object.freeze({ platform: 'darwin', arch: 'arm64', sharp: '0.35.3', vips: '8.18.3' });
  const PROBE = 'public/favicon-192.png';

  it('an identical signature chooses the byte comparison', () => {
    expect(mintComparisonMode(HERE, { ...HERE }))
      .toEqual({ mode: MINT_MODES.BYTES, differing: [], problem: null });
  });

  it('ANY one differing field chooses the dimension comparison and names that field', () => {
    const verdicts = SIGNATURE_FIELDS.map((field) => {
      const foreign = { ...HERE, [field]: `${HERE[field]}-elsewhere` };
      const seen = mintComparisonMode(HERE, foreign);
      return `${field}: ${seen.mode} [${seen.differing.join(',')}]`;
    });
    expect(verdicts).toEqual(SIGNATURE_FIELDS.map((f) => `${f}: ${MINT_MODES.DIMENSIONS} [${f}]`));
  });

  it("CI's own stack against this record chooses dimensions, not a silent pass", () => {
    // The literal case this cure exists for: ubuntu x64 reading a record minted on a Mac.
    const ci = { platform: 'linux', arch: 'x64', sharp: '0.35.3', vips: '8.18.3' };
    const seen = mintComparisonMode(ci, HERE);
    expect(seen.mode).toBe(MINT_MODES.DIMENSIONS);
    expect(seen.differing).toEqual(['platform', 'arch']);
    expect(seen.problem).toBe(null);
  });

  it('a MISSING record is a hard failure, never a quietly weaker arm', () => {
    const modes = [undefined, null, 'a string', [], 42].map((bad) => mintComparisonMode(HERE, bad).mode);
    expect(modes).toEqual(Array(5).fill(MINT_MODES.INVALID));
  });

  it('a MALFORMED signature is a hard failure, and the problem names every bad field', () => {
    const seen = mintComparisonMode(HERE, { platform: 'linux', arch: '   ', sharp: null });
    expect(seen.mode).toBe(MINT_MODES.INVALID);
    const named = ['arch', 'sharp', 'vips'].filter((field) => seen.problem.includes(field));
    expect(named).toEqual(['arch', 'sharp', 'vips']);
  });

  it('a malformed RUNNING signature fails closed too — the check is not one-sided', () => {
    expect(mintComparisonMode({}, HERE).mode).toBe(MINT_MODES.INVALID);
  });

  it('this host reports a well-formed signature, so the live decision is a real one', () => {
    expect(mintComparisonMode(RUNNING, { ...RUNNING }).mode).toBe(MINT_MODES.BYTES);
  });

  it('PLANT: one flipped byte in a shipped derivative reds ARM A, by name', () => {
    const doctored = (rel) => {
      const bytes = Buffer.from(readFileSync(join(ROOT, rel)));
      if (rel === PROBE) bytes[bytes.length - 1] ^= 0x01;
      return bytes;
    };
    const stale = staleAgainst(MINT.outputs, doctored);
    expect(stale.length, 'the comparator did not see a flipped byte at all').toBe(1);
    expect(stale[0].startsWith(`${PROBE}:`), `the comparator named the wrong file: ${stale[0]}`).toBe(true);
    // ...and the tree really is untouched, so the plant proved the arm and not a dirty worktree.
    expect(staleAgainst(MINT.outputs, (rel) => readFileSync(join(ROOT, rel)))).toEqual([]);
  });

  it('PLANT: a derivative that is not on disk reds ARM A rather than being skipped', () => {
    const stale = staleAgainst(MINT.outputs, (rel) => {
      if (rel === 'public/og-craft.png') throw new Error('ENOENT (planted)');
      return readFileSync(join(ROOT, rel));
    });
    expect(stale).toEqual(['public/og-craft.png: not on disk at all']);
  });

  it('PLANT: a doctored record row reds ARM A even when the file is untouched', () => {
    // The record is not trusted just because it is generated: a hand-edit to it convicts.
    const doctored = { ...MINT.outputs, [PROBE]: { ...MINT.outputs[PROBE], bytes: 1 } };
    expect(staleAgainst(doctored, (rel) => readFileSync(join(ROOT, rel))))
      .toEqual([`${PROBE}: minted 1 B, tree ${MINT.outputs[PROBE].bytes} B`]);
  });

  it('PLANT: an edited script closure reds ARM B — the drift the byte arm could never see off-platform', () => {
    const drift = driftedInputs(MINT.inputs, (rel) => (
      rel === 'scripts/derive-brand-marks.mjs'
        ? Buffer.concat([readFileSync(join(ROOT, rel)), Buffer.from('\n// a later edit\n')])
        : readFileSync(join(ROOT, rel))
    ));
    expect(drift.length, 'an edited script was treated as the minted script').toBe(1);
    expect(drift[0].startsWith('scripts/derive-brand-marks.mjs:')).toBe(true);
  });

  it('PLANT: a re-cut painting reds ARM B on every platform', () => {
    const drift = driftedInputs(MINT.inputs, (rel) => (
      rel === STRIP ? Buffer.from('not the painting') : readFileSync(join(ROOT, rel))
    ));
    expect(drift.length).toBe(1);
    expect(drift[0].startsWith(`${STRIP}:`)).toBe(true);
  });

  it('PLANT: the dimension comparison is not a byte comparison wearing a hat', async () => {
    // ⭐ THE CONTROL THAT MAKES ARM C WORTH ITS LINES. Re-encode the same pixels with
    // different encoder settings — precisely the shape of the cross-platform difference —
    // and the bytes must move while the decoded size does not. Without this, ARM C's
    // dimension branch could be an arm that only ever sees identical files.
    const committed = readFileSync(join(ROOT, PROBE));
    const reEncoded = await sharp(committed).png({ compressionLevel: 1 }).toBuffer();
    expect(sha256(reEncoded), 'the re-encode produced identical bytes, so this plant proves nothing')
      .not.toBe(sha256(committed));
    expect((await decodedShapeOf(PROBE, reEncoded)).size)
      .toBe((await decodedShapeOf(PROBE, committed)).size);
  });

  it('PLANT: a resized derivative REDS the dimension comparison', async () => {
    const committed = readFileSync(join(ROOT, PROBE));
    const resized = await sharp(committed).resize(191, 191).png().toBuffer();
    expect((await decodedShapeOf(PROBE, resized)).size)
      .not.toBe((await decodedShapeOf(PROBE, committed)).size);
  });

  it('PLANT: a truncated derivative REDS — the shape reader decodes, it does not read a header', async () => {
    // Measured 2026-09-20: sharp's metadata() RESOLVES on a PNG cut in half, so a header
    // read would call a mangled file the right size. This is why ARM C decodes.
    const committed = readFileSync(join(ROOT, PROBE));
    await expect(decodedShapeOf(PROBE, committed.subarray(0, Math.floor(committed.length / 2))))
      .rejects.toThrow();
  });

  it('the shape reader decodes all three containers the derivation ships', async () => {
    const shapes = [];
    for (const rel of ['public/favicon-512.png', 'public/favicon.ico', PDF_SEAL_MODULE]) {
      shapes.push(`${rel} -> ${(await decodedShapeOf(rel, readFileSync(join(ROOT, rel)))).size}`);
    }
    expect(shapes).toEqual([
      'public/favicon-512.png -> 512x512',
      'public/favicon.ico -> ico [16:16x16, 32:32x32]',
      `${PDF_SEAL_MODULE} -> module 192x192`,
    ]);
  });
});

describe('every icon the page declares is the file it says it is', () => {
  const links = iconLinks(INDEX_HTML);

  it('index.html declares an icon set, and each href is on disk', () => {
    expect(links.length, 'index.html declares no icons at all').toBeGreaterThanOrEqual(4);
    const missing = links.filter((l) => !existsSync(publicFile(l.href))).map((l) => l.href);
    expect(missing, `index.html points at icons that are not in public/:\n  ${missing.join('\n  ')}`).toEqual([]);
  });

  it('every declared PNG size is the size the PNG actually is', () => {
    const wrong = [];
    for (const link of links) {
      const buf = readFileSync(publicFile(link.href));
      if (!isPng(buf)) continue;
      const { w, h } = pngDims(buf);
      if (link.sizes && link.sizes !== `${w}x${h}`) wrong.push(`${link.href} declares ${link.sizes}, is ${w}x${h}`);
      if (link.rel === 'apple-touch-icon' && (w !== 180 || h !== 180)) wrong.push(`${link.href} is ${w}x${h}, not the 180 iOS asks for`);
    }
    expect(wrong, `a declared icon size is a fiction:\n  ${wrong.join('\n  ')}`).toEqual([]);
  });

  it('favicon.ico carries the 16 and 32 layers, each a real PNG of that size', () => {
    const layers = icoLayers(readFileSync(publicFile('/favicon.ico')));
    expect(layers.map((l) => l.size)).toEqual([16, 32]);
    for (const layer of layers) {
      expect(isPng(layer.png), `the ${layer.size} layer is not a PNG`).toBe(true);
      expect(pngDims(layer.png)).toEqual({ w: layer.size, h: layer.size });
    }
  });

  it('the retired icons are gone, links and files together', () => {
    // A dead <link> is a 404 on every page load, and a dead file is dead weight a
    // reader will later mistake for the live mark.
    const dead = ['public/favicon.svg', 'public/favicon-dark.png', 'public/og-default.svg']
      .filter((rel) => existsSync(join(ROOT, rel)));
    expect(dead, `retired brand assets are still on disk:\n  ${dead.join('\n  ')}`).toEqual([]);
    const pointing = links.filter((l) => /favicon\.svg|favicon-dark\.png/.test(l.href)).map((l) => l.href);
    expect(pointing, 'index.html still links a retired icon').toEqual([]);
  });
});

describe('the share card is the painted plaque, at the size the meta declares', () => {
  const ogImage = metaContent(INDEX_HTML, 'property', 'og:image');

  it('og:image and twitter:image name the same shipped card', () => {
    expect(ogImage, 'index.html declares no og:image').toBeTruthy();
    expect(metaContent(INDEX_HTML, 'name', 'twitter:image')).toBe(ogImage);
    const path = new URL(ogImage).pathname;
    expect(existsSync(publicFile(path)), `${path} is not in public/`).toBe(true);
  });

  it('both cards are the declared 1200x630 raster', () => {
    const declared = { w: Number(metaContent(INDEX_HTML, 'property', 'og:image:width')), h: Number(metaContent(INDEX_HTML, 'property', 'og:image:height')) };
    expect(declared).toEqual({ w: CARD.w, h: CARD.h });
    for (const name of ['og-craft.png', 'og-default.png']) {
      const buf = readFileSync(join(ROOT, 'public', name));
      expect(isPng(buf), `${name} is not a PNG`).toBe(true);
      expect(pngDims(buf), `${name} is not the declared card size`).toEqual({ w: CARD.w, h: CARD.h });
    }
  });

  it('the card carries the painted plaque, not a flat wordmark', () => {
    // The plaque's brass is the one thing a re-render in the wrong face or with a
    // missing crop would lose. Sample the band the plaque occupies and require real
    // painted colour there: parchment is near-neutral, brass is not.
    const buf = readFileSync(join(ROOT, 'public', 'og-craft.png'));
    return sharp(buf).raw().toBuffer({ resolveWithObject: true }).then(({ data, info }) => {
      let painted = 0;
      for (let y = Math.round(CARD.h * 0.33); y < Math.round(CARD.h * 0.45); y += 1) {
        for (let x = Math.round(CARD.w * 0.3); x < Math.round(CARD.w * 0.7); x += 2) {
          const i = (y * info.width + x) * info.channels;
          const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
          if (r - b > 60 && g > b) painted += 1;
        }
      }
      expect(painted, 'the card band where the plaque sits carries no painted brass').toBeGreaterThan(500);
    });
  });
});

describe('the eager mark and the dossier cover draw the same seal', () => {
  it('HouseDevice renders an img of the shipped seal', () => {
    const el = HouseDevice({ size: 20, alt: '' });
    expect(el.type).toBe('img');
    expect(el.props.src).toBe(HOUSE_SEAL_SRC);
    expect(HOUSE_SEAL_SRC).toBe('/brand/seal.png');
    expect(existsSync(publicFile(HOUSE_SEAL_SRC)), 'the eager mark points at a file that is not shipped').toBe(true);
    // The box is reserved before the bytes land, or the footer jumps on load.
    expect(el.props.width).toBe(20);
    expect(el.props.height).toBe(20);
  });

  it('the PDF seal is a data URI of a real PNG, not a URL the worker cannot fetch', () => {
    const [, format, body] = BRAND_SEAL_PNG.match(/^data:image\/([a-z+]+);base64,(.+)$/) || [];
    expect(format, 'the dossier seal is not a data URI').toBe('png');
    const bytes = Buffer.from(body, 'base64');
    expect(isPng(bytes), 'the dossier seal is not PNG bytes').toBe(true);
    const { w, h } = pngDims(bytes);
    expect(w).toBe(h);
    expect(w, 'the dossier seal is too small to print').toBeGreaterThanOrEqual(128);
  });

  it('the dossier cover mounts that seal beside the title', async () => {
    const { Cover } = await import('../../src/pdf/sections/Cover.jsx');
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const { buildViewModel } = await import('../../src/pdf/lib/viewModel.js');
    const settlement = generateSettlementPipeline(
      { settType: 'village', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
      null,
      { seed: 'brand-derivatives-2026-09-19', customContent: {} },
    );
    const nodes = pdfNodes(Cover({ settlement, vm: buildViewModel({ settlement }) }));
    expect(nodes.length, 'the cover rendered no nodes, so finding no image proves nothing').toBeGreaterThan(20);
    const images = nodes.filter((n) => n.type === 'IMAGE');
    expect(images.length, 'the cover draws no image at all — the seal is not on the page').toBe(1);
    expect(images[0].props.src, 'the cover image is not the shipped seal').toBe(BRAND_SEAL_PNG);
  }, 60_000);
});

describe('the register names every file the derivation ships', () => {
  it('the two painted crops are registered rows, and the compositions are declared', () => {
    for (const rel of ['public/brand/seal.png', 'public/brand/plaque.png']) {
      expect(register.assets[rel], `${rel} is not a register row`).toBeTruthy();
      expect(register.assets[rel].markers).toBe('present');
    }
    const declared = [
      ...register._derived_marks['from public/brand/seal.png'],
      ...register._derived_marks['from public/brand/plaque.png'],
    ].sort();
    const composed = DERIVED
      .filter((rel) => rel.startsWith('public/'))
      .filter((rel) => register.assets[rel] === undefined)
      .sort();
    expect(
      declared,
      'the register\'s _derived_marks block and the script disagree about which shipped'
      + ' files descend from the painting. Every composition must be named there, or the'
      + ' origin of a shipped file is recorded nowhere.',
    ).toEqual(composed);
    expect(register._derived_marks.cut_by).toBe(
      'scripts/derive-brand-marks.mjs, from public/brand/arrow/arrow-strip.webp, deterministic'
      + ' and re-runnable (tests/build/brandDerivatives.test.js re-runs it and diffs).',
    );
  });

  it('the seal crop the script cuts is the disc the register describes', () => {
    // The two must not drift: the register's prose is what a reader (or counsel)
    // is told the file is.
    const mapped = register.assets['public/brand/seal.png'].mapped_by;
    expect(mapped.includes(`(${SEAL.cx.toFixed(1)}, ${SEAL.cy.toFixed(1)})`), 'the register names a different centre').toBe(true);
    expect(mapped.includes(`radius ${SEAL.r.toFixed(1)}`), 'the register names a different radius').toBe(true);
    expect(mapped.includes(`[${SEAL_CROP.left}, ${SEAL_CROP.left + SEAL_CROP.width})`), 'the register names a different crop').toBe(true);
  });
});
