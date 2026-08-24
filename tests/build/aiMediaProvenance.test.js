/**
 * tests/build/aiMediaProvenance.test.js — the AI-MEDIA PROVENANCE FLOOR.
 *
 * The estate ships 52 AI-generated files, 74,168,828 bytes of them, all produced
 * on one paid Higgsfield account on 2026-07-18. Two tracked image pipelines
 * (scripts/optimize-backgrounds.mjs and scripts/optimize-landing-backgrounds.mjs)
 * re-encode that media with sharp, and sharp DROPS EXIF, XMP, IPTC and ICC
 * unless told otherwise. Between 2026-07-11 and 2026-08-24 they were told
 * otherwise nowhere, which is how the `Made with Google AI` credit, the IPTC
 * `DigitalSourceType=trainedAlgorithmicMedia` tag and the C2PA manifests left 46
 * shipped files. Higgsfield's Terms of Use section 5.5 — "you will not remove,
 * alter, or obscure any provenance signals or markings" — binds this
 * pre-existing account from 2026-08-27; BytePlus's section 2(e) already
 * prohibits the same act upstream.
 *
 * This gate exists so that cannot happen again, and it works from both ends:
 *
 *   1. THE REGISTER IS COMPLETE. scripts/ai-media-provenance.json names every
 *      file under the four AI-media roots with the generator that produced it.
 *      A file on disk that nobody registered fails here, so AI media cannot
 *      enter the tree with its origin unrecorded — which is exactly how the 23
 *      files of the June 2026 cohort became unattributable.
 *   2. WHAT SURVIVES CANNOT BE STRIPPED. Six files still carry their markings
 *      (five evolution stills carry the Google credit; realm-journey.mp4 carries
 *      an intact BytePlus C2PA). Each required marker is pinned byte-for-byte.
 *   3. THE DEBT ONLY SHRINKS, AND IT IS NOW ZERO. The count of AI files carrying
 *      no marking is a shrink-only ratchet. On 2026-08-24 the restore landed and
 *      took it to 0: scripts/inject-ai-provenance.mjs wrote an XMP provenance
 *      packet into all 46, adding 71,229 bytes across 52,755,638 bytes of art.
 *      At zero the ratchet stops being a budget and becomes a floor — a file that
 *      loses its marking, or a new AI file that arrives without one, reds here.
 *   3b. AND THE WRITE TOUCHED NO PIXELS. Injecting metadata into shipped art is
 *      only defensible if the art is unchanged, so that is not asserted, it is
 *      measured: each of the three injectors is run against a real shipped file,
 *      the result is DECODED, and the decoded bytes are compared against the
 *      decode of the original — with a deliberate mutation after each one proving
 *      the comparison can fail. Re-injecting into a stripped file also has to
 *      reproduce the shipped bytes exactly, so the committed art is provably the
 *      output of the committed tool.
 *   3c. AND IT CLAIMS NOTHING IT CANNOT SUPPORT. Every restored row carries a
 *      `forbid` list as well as a `require` list. `urn:c2pa` is forbidden on all
 *      46, so a fabricated manifest cannot be slipped in later; `Made with Google
 *      AI` is forbidden on the five files whose masters carried no Google marker
 *      at all, which is the failure a well-meaning sweep would actually commit.
 *   4. NO NEW STRIPPING PIPELINE. Every script that uses sharp must be declared,
 *      and a declared re-encoder must call .keepMetadata(). A new script that
 *      re-encodes without it fails before it ever touches a shipped file.
 *
 * WHAT IS RESTORABLE AND WHAT IS GONE, stated here so no reader has to guess:
 * a human-readable credit (XMP photoshop:Credit, IPTC DigitalSourceType, the
 * model name, the generation date) is restorable by a metadata write. THE C2PA
 * MANIFESTS ARE NOT. They are cryptographically signed by Google LLC and by
 * Byteplus Pte. Ltd., they cannot be re-created, and they must never be
 * fabricated. A re-added credit is a credit; it is not a restored C2PA and
 * nothing in this repository may describe it as one.
 *
 * COHORT A IS NOT IN SCOPE AND MUST NOT BE SWEPT IN. The 23 files carrying
 * origin "unrecorded" entered on 2026-06-05, six weeks before the Higgsfield
 * account's first transaction at 2026-07-18T17:15:55Z, so they are provably not
 * Higgsfield output and no term examined here covers them. They belong to the
 * open reverse-image-search question. This gate pins their count and their
 * membership so a later remediation cannot quietly relabel them as AI media.
 *
 * Every absence assertion below carries a CONTROL that proves the same matcher
 * fires on forged input, so none of them can pass by looking at nothing.
 *
 * CANNOT-CATCH — the residual, named so nobody trusts this gate past its reach:
 *   - A MARKING THAT IS PRESENT BUT WRONG. The scan is a byte search for a
 *     literal; it does not validate a C2PA signature or decode an XMP packet, so
 *     a corrupted manifest that still contains the string passes.
 *   - THE SYNTHID PIXEL WATERMARK. It lives in the pixels, not the metadata. No
 *     detector was available, so whether it survived the 2026-07-18 resize is
 *     unknown and untested in either direction.
 *   - OUT-OF-REPO PIPELINES. The six journey legs were stripped by an ffmpeg
 *     script that lives in the masters archive, not here. There is no ffmpeg
 *     anywhere in this repository, so the source scan cannot reach it; what this
 *     gate can do, and does, is refuse to let the stripped result go unrecorded.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, posix } from 'node:path';
import sharp from 'sharp';
import {
  buildXmpPacket,
  injectFile,
  injectableRows,
  injectJpegXmp,
  injectWebpXmp,
  injectMp4Xmp,
  jpegHasXmp,
  mp4Boxes,
  mp4HasXmp,
  webpCanvas,
  webpChunks,
} from '../../scripts/inject-ai-provenance.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const REGISTER_PATH = join(ROOT, 'scripts', 'ai-media-provenance.json');
const register = JSON.parse(readFileSync(REGISTER_PATH, 'utf8'));

/** The four roots the register is required to cover, completely. */
const MEDIA_ROOTS = [
  'public/backgrounds',
  'public/evolution',
  'public/media/journey-legs/bg',
  'public/videos',
];

/**
 * The ceiling on unmarked AI files. SHRINK-ONLY: when a restore lands, flip the
 * rows to "present" in the register and LOWER this number in the same change.
 * Never raise it — a raise is the regression this whole file exists to refuse.
 *
 * 2026-08-24: the restore landed and this reached ZERO. Every AI file the estate
 * ships now carries a provenance marking, so the debt is not merely shrinking, it
 * is discharged — and at zero the ratchet has become an absolute floor: any file
 * that loses its marking, or any new AI file that arrives without one, reds here.
 */
const UNMARKED_CEILING = 0;

/** Cohort A's exact membership, pinned so a relabel cannot pass unnoticed. */
const COHORT_A_COUNT = 23;

/** Every AI file the estate ships: the 6 that kept their marking + the 46 restored. */
const PRESENT_COUNT = 52;

/**
 * The six that never lost their marking. They are called out separately because
 * they are the ones the restore must NOT have touched: five Google stills whose
 * XMP survived, and realm-journey.mp4, whose C2PA manifest is still VALID because
 * the file was never re-encoded. Appending so much as a metadata box to that one
 * would break the hash binding it currently satisfies.
 */
const SURVIVED_UNTOUCHED = [
  'public/evolution/city.jpg',
  'public/evolution/hamlet.jpg',
  'public/evolution/metropolis.jpg',
  'public/evolution/thorp.jpg',
  'public/evolution/town.jpg',
  'public/videos/realm-journey.mp4',
];

/**
 * Scripts permitted to use sharp, each with its mode and the reason it holds.
 * Adding a row is a deliberate act, which is the point: an undeclared sharp
 * pipeline fails the roster arm below before it can touch a shipped file.
 *
 *   reencode   — reads an existing image and writes another. MUST keep metadata.
 *   synthesise — builds an image from something the script itself constructed in
 *                memory (a raw pixel buffer, an SVG string). There is no upstream
 *                file and therefore no upstream provenance to carry.
 */
const SHARP_SCRIPTS = {
  'optimize-backgrounds.mjs': {
    mode: 'reencode',
    reason: 'derives the shipped .webp twin of every page painting',
  },
  'optimize-landing-backgrounds.mjs': {
    mode: 'reencode',
    reason: 'derives the 1400px landing variants of five painted scenes',
  },
  'gen-paper-grain.mjs': {
    mode: 'synthesise',
    reason: 'builds a paper-grain tile from a raw RGBA buffer it generates itself',
  },
  'gen-organic-logo.mjs': {
    mode: 'synthesise',
    reason: 'rasterises estate-authored SVG strings into the favicon and OG PNGs',
  },
};

/**
 * Evidence, in the source itself, that a sharp() call constructs from memory
 * rather than reading a file: a raw pixel buffer, an SVG rasterisation density,
 * an inline Buffer, or sharp's own blank-image constructor. A plain
 * `sharp(srcPath)` file read carries none of these.
 */
const IN_MEMORY_SOURCE = /\braw\s*:|\bdensity\s*:|Buffer\.from\(|\bcreate\s*:/;

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) walk(abs, out);
    else out.push(abs);
  }
  return out;
}

/** Every media file actually on disk under the four roots, repo-relative. */
function filesOnDisk() {
  const out = [];
  for (const root of MEDIA_ROOTS) {
    for (const abs of walk(join(ROOT, root))) {
      out.push(relative(ROOT, abs).split(/[\\/]/).join(posix.sep));
    }
  }
  return out.sort();
}

/**
 * Which of a file's required markers are missing. A raw byte search on purpose:
 * an image library that silently drops a segment it cannot parse would turn a
 * stripped file into a clean pass, and that is the exact failure this gate
 * exists to catch.
 */
function missingMarkers(absPath, required) {
  const buf = readFileSync(absPath);
  return required.filter((marker) => !buf.includes(Buffer.from(marker, 'utf8')));
}

/**
 * Every `sharp(...)` chain in a source, as {args, chain} pairs. Chains are cut
 * at the statement terminator, which is where a sharp pipeline always ends.
 */
function sharpChains(source) {
  const chains = [];
  let from = 0;
  for (;;) {
    const at = source.indexOf('sharp(', from);
    if (at < 0) break;
    const end = source.indexOf(';', at);
    const chain = source.slice(at, end < 0 ? source.length : end);
    const argsEnd = chain.indexOf(')\n') < 0 ? chain.length : chain.indexOf(')\n');
    chains.push({ chain, args: chain.slice(0, argsEnd) });
    from = at + 6;
  }
  return chains;
}

/** A re-encoding chain is compliant when it carries an explicit metadata keep. */
const keepsMetadata = (chain) => /\.keepMetadata\(\)|\.withMetadata\(/.test(chain);

/*
 * Every shipped AI file now CARRIES the packet, so "inject and compare" would be
 * comparing a file with itself. These three take the packet back out, producing the
 * pre-restore subject the injector originally saw. They earn their keep twice: the
 * pixel probes below get an honest before/after, and re-injecting into the stripped
 * subject must reproduce the SHIPPED BYTES EXACTLY — which is how the gate proves
 * the committed art is precisely what the committed tool produces.
 */

/** A JPEG with its XMP APP1 segment spliced back out. */
function withoutXmpApp1(buf) {
  let off = 2;
  while (off + 4 <= buf.length && buf[off] === 0xff) {
    const marker = buf[off + 1];
    if (marker === 0xda || marker === 0xd9) break;
    const len = buf.readUInt16BE(off + 2);
    const isXmp = marker === 0xe1
      && buf.subarray(off + 4, off + 32).toString('latin1').startsWith('http://ns.adobe.com/xap/1.0/');
    if (isXmp) return Buffer.concat([buf.subarray(0, off), buf.subarray(off + 2 + len)]);
    off += 2 + len;
  }
  return buf;
}

/** A WebP demoted back to the simple form: its coded chunk alone, no VP8X, no XMP. */
function withoutXmpChunk(buf) {
  const coded = webpChunks(buf).find((c) => c.type === 'VP8 ' || c.type === 'VP8L');
  if (!coded) throw new Error('WebP carries no coded chunk');
  const head = Buffer.alloc(12);
  head.write('RIFF', 0, 'latin1');
  head.writeUInt32LE(4 + 8 + coded.payload.length + (coded.payload.length % 2), 4);
  head.write('WEBP', 8, 'latin1');
  const chunk = Buffer.alloc(8);
  chunk.write(coded.type, 0, 'latin1');
  chunk.writeUInt32LE(coded.payload.length, 4);
  const pad = coded.payload.length % 2 ? Buffer.from([0]) : Buffer.alloc(0);
  return Buffer.concat([head, chunk, coded.payload, pad]);
}

/** An MP4 with its trailing XMP uuid box removed. */
function withoutXmpUuid(buf) {
  const boxes = mp4Boxes(buf);
  const kept = boxes.filter((b) => b.type !== 'uuid');
  if (kept.length === boxes.length) return buf;
  return Buffer.concat(kept.map((b) => buf.subarray(b.start, b.start + b.size)));
}

/** A synthesising chain proves itself by constructing its input in memory. */
const isRawSynthesis = (args) => IN_MEMORY_SOURCE.test(args);

describe('the AI-media provenance register is real and complete', () => {
  it('the register loaded, and the roots really walked (neither is looking at nothing)', () => {
    expect(Object.keys(register.assets).length).toBeGreaterThan(50);
    const disk = filesOnDisk();
    expect(disk.length).toBeGreaterThan(50);
    expect(disk).toContain('public/videos/realm-journey.mp4');
    expect(disk).toContain('public/evolution/city.jpg');
  });

  it('every media file on disk is registered with an origin', () => {
    const registered = new Set(Object.keys(register.assets));
    const unregistered = filesOnDisk().filter((p) => !registered.has(p));
    expect(
      unregistered,
      'AI media entered the tree with its origin unrecorded. Add a row to'
      + ' scripts/ai-media-provenance.json naming the generator and the generation date'
      + ' — an unrecorded origin is how the 23 files of the June 2026 cohort became'
      + ` unattributable:\n  ${unregistered.join('\n  ')}`,
    ).toEqual([]);
  });

  it('every registered file still exists on disk', () => {
    const disk = new Set(filesOnDisk());
    const ghosts = Object.keys(register.assets).filter((p) => !disk.has(p));
    expect(
      ghosts,
      `the register names files that are gone; delete the rows:\n  ${ghosts.join('\n  ')}`,
    ).toEqual([]);
  });

  it('the register states counts that match the rows it actually holds', () => {
    const tally = { present: 0, absent: 0, 'n/a': 0 };
    for (const row of Object.values(register.assets)) tally[row.markers] += 1;
    expect(tally.present).toBe(register._counts.present);
    expect(tally.absent).toBe(register._counts.absent);
    expect(tally['n/a']).toBe(register._counts['n/a']);
    expect(register._counts.total).toBe(Object.keys(register.assets).length);
  });
});

describe('provenance that survived cannot be stripped again', () => {
  it('every file marked present carries every marker it declares', () => {
    const stripped = [];
    for (const [path, row] of Object.entries(register.assets)) {
      if (row.markers !== 'present') continue;
      const missing = missingMarkers(join(ROOT, path), row.require ?? []);
      if (missing.length > 0) stripped.push(`${path} lost ${missing.join(', ')}`);
    }
    expect(
      stripped,
      'a shipped file LOST its AI-provenance marking. Higgsfield section 5.5 forbids'
      + ' removing provenance signals from 2026-08-27 and BytePlus section 2(e) forbids'
      + ' it already. If a pipeline did this, give it .keepMetadata(); do NOT lower the'
      + ` register to match:\n  ${stripped.join('\n  ')}`,
    ).toEqual([]);
  });

  it('the present set is every AI file the estate ships, and it is not an empty set', () => {
    const present = Object.entries(register.assets)
      .filter(([, row]) => row.markers === 'present')
      .map(([path]) => path)
      .sort();
    // The six that never lost their marking, plus the 46 the 2026-08-24 restore wrote.
    expect(present).toHaveLength(PRESENT_COUNT);
    for (const survivor of SURVIVED_UNTOUCHED) expect(present).toContain(survivor);
    // Each one declares what it must keep, so none of them is pinned to nothing.
    for (const path of present) {
      expect(register.assets[path].require.length, `${path} pins no marker`).toBeGreaterThan(0);
    }
  });

  it('every restored file REFUSES the markers it must never carry', () => {
    // `require` alone cannot catch the dangerous failure, which is a marking that
    // claims MORE than the evidence supports: a fabricated C2PA, or a Google credit
    // on a plate whose model was never established. `forbid` is the other half.
    const liars = [];
    for (const [path, row] of Object.entries(register.assets)) {
      if (!row.forbid) continue;
      const buf = readFileSync(join(ROOT, path));
      for (const marker of row.forbid) {
        if (buf.includes(Buffer.from(marker, 'utf8'))) liars.push(`${path} carries forbidden "${marker}"`);
      }
    }
    expect(
      liars,
      'a restored file claims a provenance it cannot support. `urn:c2pa` is forbidden on every'
      + ' restored file because the signed manifests cannot be re-created and must never be'
      + ' fabricated; `Made with Google AI` is forbidden on the files whose masters carried no'
      + ` Google marker at all:\n  ${liars.join('\n  ')}`,
    ).toEqual([]);
  });

  it('the five files from masters with no Google attribution are exactly the ones that refuse it', () => {
    // The register names ten masters that carry a Higgsfield job id and no Google
    // marker. Two of them reach production; these are the shipped files they made,
    // established by pixel match, not by filename.
    const refusing = Object.entries(register.assets)
      .filter(([, row]) => (row.forbid ?? []).includes('Made with Google AI') && row.agent === 'Higgsfield')
      .map(([path]) => path)
      .sort();
    expect(refusing).toEqual([
      'public/backgrounds/evolution-3-village.jpg',
      'public/backgrounds/evolution-3-village.webp',
      'public/backgrounds/export-dispatch.jpg',
      'public/backgrounds/export-dispatch.webp',
      'public/evolution/village.jpg',
    ]);
    for (const path of refusing) {
      expect(register.assets[path].credit, `${path} must claim no credit`).toBeNull();
      expect(register.assets[path].model, `${path} must not name a model`).toBe('not established');
      // ...and the mapping is recorded with the measurement that established it.
      expect(register.assets[path].mapped_by).toMatch(/pixel RMS/);
    }
  });

  it('CONTROL: the marker scan reports an unmarked file as unmarked', () => {
    // The live negatives above are only trustworthy if the same function fails on a
    // file that genuinely lacks the marking. Cohort A is the honest plant and stays
    // honest: those 23 files are NOT AI media, nothing may ever stamp them, so a
    // day when this control stops failing is a day something swept them in.
    const planted = join(ROOT, 'public/backgrounds/account.jpg');
    expect(statSync(planted).size).toBeGreaterThan(1000);
    expect(missingMarkers(planted, ['Made with Google AI', 'trainedAlgorithmicMedia']))
      .toEqual(['Made with Google AI', 'trainedAlgorithmicMedia']);
    // ...and it passes on a file that really carries them, so it is not just
    // returning its input.
    expect(missingMarkers(join(ROOT, 'public/evolution/city.jpg'), ['Made with Google AI']))
      .toEqual([]);
  });
});

describe('the unmarked debt only ever shrinks', () => {
  it('no more AI files carry no provenance marking than the frozen ceiling', () => {
    const unmarked = Object.values(register.assets).filter((r) => r.markers === 'absent');
    expect(
      unmarked.length,
      'the number of AI files shipping without a provenance marking went UP. This ratchet'
      + ' is shrink-only: when a restore lands, flip the rows to "present" and LOWER'
      + ' UNMARKED_CEILING in the same change.',
    ).toBeLessThanOrEqual(UNMARKED_CEILING);
  });

  it('the register says plainly which markings are restorable and which are gone', () => {
    const notRestorable = register._restorable['NOT restorable'];
    expect(notRestorable).toContain('C2PA');
    expect(notRestorable).toContain('cryptographically signed');
    expect(notRestorable).toContain('MUST NOT be fabricated');
    expect(register._restorable.restorable).toContain('photoshop:Credit');
    // The reason a re-fetch does not cure it, which is the part a reader gets wrong.
    expect(notRestorable).toContain('hard binding');
    expect(notRestorable).toContain('signing identity');
  });

  it('the register records where the C2PA-bearing originals actually are', () => {
    const o = register._originals;
    // They are on local disk, so "we would have to download them" is not the obstacle.
    expect(o.where).toContain('settlementforge-marketing-masters');
    expect(o.where).toContain('no download');
    expect(o['what it does NOT buy']).toContain('never re-encoded');
    // And a restore must not stamp Google onto the ten plates that never named Google.
    expect(o['ten masters with no Google attribution']).toContain('NOT established');
  });
});

describe('cohort A is recorded as unattributable and kept out of the AI set', () => {
  it('exactly the frozen cohort-A count carries an unrecorded origin', () => {
    const unrecorded = Object.entries(register.assets)
      .filter(([, row]) => row.origin === 'unrecorded')
      .map(([path]) => path);
    expect(unrecorded).toHaveLength(COHORT_A_COUNT);
    // None of them claims a generator, and none of them is owed a restore.
    for (const path of unrecorded) {
      expect(register.assets[path].markers, `${path} must stay n/a`).toBe('n/a');
    }
  });

  it('the 2026-08-24 restore did not write a single byte into cohort A', () => {
    // The restore wrote an AI credit into 46 files. These 23 are not AI media and
    // nobody can say what they are, so a marking on one of them would be an
    // assertion no one can support. Measured on the files, not taken on trust.
    const stamped = [];
    for (const [path, row] of Object.entries(register.assets)) {
      if (row.origin !== 'unrecorded') continue;
      const buf = readFileSync(join(ROOT, path));
      for (const marker of ['trainedAlgorithmicMedia', 'Made with Google AI', 'sfp:restoredOn', 'urn:c2pa']) {
        if (buf.includes(Buffer.from(marker, 'utf8'))) stamped.push(`${path} carries "${marker}"`);
      }
      expect(row.restored, `${path} must not record a restore`).toBeUndefined();
    }
    expect(
      stamped,
      'an AI-provenance marking reached cohort A. These files entered six weeks before the'
      + ' Higgsfield account existed, they are the estate\'s only unlicensed shipped imagery,'
      + ' and they belong to the open reverse-image-search question — not to this restore:\n'
      + `  ${stamped.join('\n  ')}`,
    ).toEqual([]);
  });

  it('the register states the boundary in words, not only in data', () => {
    const a = register._cohort_a;
    expect(a.what).toContain('2026-07-18T17:15:55Z');
    expect(a.what).toContain('NOT Higgsfield output');
    expect(a.boundary).toContain('Do not sweep them into an AI-provenance restore');
    // The instrument that lies about cohort membership is written down.
    expect(a.hazard).toContain('LAST-touching commit');
  });

  it('the undeployed microsite film is recorded as free-only-while-it-does-not-ship', () => {
    const note = register._not_shipped['marketing/website/public/bg.mp4'];
    expect(note).toContain('76,303,695');
    expect(note).toContain('inherits every obligation');
  });

  it('nobody indemnifies the estate, and that is recorded as a standing risk', () => {
    expect(register._indemnity_standing_risk).toContain('Enterprise plan only');
    expect(register._indemnity_standing_risk).toContain('7.5(c)');
  });
});

describe('the provenance write changed the container and NOT one pixel', () => {
  /**
   * The whole case for injecting metadata into shipped art rests on one claim: the
   * picture is untouched and only its container grew. That claim is worth exactly
   * what it is tested with, so each of the three injectors is run here against a
   * REAL shipped file, the result is DECODED, and the decoded bytes are compared
   * with the decode of the original. A mutation follows each one, proving the
   * comparison can fail — a control that cannot fail would prove nothing at all.
   */
  const digest = (buf) => createHash('sha256').update(buf).digest('hex');

  /** Decoded pixels, straight out of the codec. Not a resize, not a thumbnail. */
  async function pixels(buf) {
    const image = sharp(buf, { failOn: 'none' });
    const { width, height } = await image.metadata();
    return { sha: digest(await image.raw().toBuffer()), dims: `${width}x${height}` };
  }

  /** An MP4's coded media: every mdat box, concatenated. */
  function codedMedia(buf) {
    const parts = mp4Boxes(buf)
      .filter((box) => box.type === 'mdat')
      .map((box) => buf.subarray(box.start, box.start + box.size));
    expect(parts.length, 'no mdat box — the probe is looking at nothing').toBeGreaterThan(0);
    return digest(Buffer.concat(parts));
  }

  const JPEG = 'public/backgrounds/about.jpg';
  const WEBP = 'public/backgrounds/about.webp';
  const MP4 = 'public/media/journey-legs/bg/leg-1-desk-to-thorp.mp4';
  const packetFor = (rel) => buildXmpPacket(rel, register.assets[rel]);

  it('JPEG APP1: the decoded image is bit-identical, and a scan mutation reds', async () => {
    const original = readFileSync(join(ROOT, JPEG));
    // The shipped file already carries the packet, so strip back to a clean subject
    // by injecting into a file that does not: the injector is idempotent, so the
    // honest experiment is original-vs-original-plus-one-more-packet. Use the
    // untouched master-shaped input instead: a JPEG with its APP1 removed.
    const bare = withoutXmpApp1(original);
    expect(jpegHasXmp(bare), 'the probe subject still carries XMP').toBe(false);
    const injected = injectJpegXmp(bare, packetFor(JPEG));
    expect(injected.length).toBeGreaterThan(bare.length);
    expect(jpegHasXmp(injected)).toBe(true);

    const before = await pixels(bare);
    const after = await pixels(injected);
    expect(after, 'the JPEG injector changed the picture').toEqual(before);

    // CONTROL: corrupt the entropy-coded scan and the same comparison must fail.
    const mutated = Buffer.from(injected);
    mutated[mutated.length - 200] ^= 0xff;
    const damaged = await pixels(mutated);
    expect(damaged.sha, 'the JPEG pixel probe cannot fail, so it proves nothing')
      .not.toBe(before.sha);
  });

  it('WebP VP8X: the decoded image is bit-identical, and a VP8 mutation reds', async () => {
    const original = readFileSync(join(ROOT, WEBP));
    const bare = withoutXmpChunk(original);
    expect(webpChunks(bare).some((c) => c.type === 'XMP ')).toBe(false);
    const injected = injectWebpXmp(bare, packetFor(WEBP));
    // The simple form has no slot for XMP; it must be promoted to VP8X.
    expect(webpChunks(bare).map((c) => c.type)).toEqual(['VP8 ']);
    expect(webpChunks(injected).map((c) => c.type)).toEqual(['VP8X', 'VP8 ', 'XMP ']);
    // ...and the coded bitstream is copied through, not re-compressed.
    const codedBefore = webpChunks(bare).find((c) => c.type === 'VP8 ').payload;
    const codedAfter = webpChunks(injected).find((c) => c.type === 'VP8 ').payload;
    expect(codedAfter.equals(codedBefore), 'the VP8 bitstream was rewritten').toBe(true);

    const before = await pixels(bare);
    const after = await pixels(injected);
    expect(after, 'the WebP injector changed the picture').toEqual(before);
    // The VP8X canvas must agree with the codec, or viewers crop the image.
    const canvas = webpCanvas(webpChunks(injected));
    expect(`${canvas.width}x${canvas.height}`).toBe(before.dims);

    // CONTROL: corrupt the copied VP8 payload and the comparison must fail.
    const mutated = Buffer.from(injected);
    const target = webpChunks(mutated).find((c) => c.type === 'VP8 ');
    target.payload[Math.floor(target.payload.length / 2)] ^= 0xff;
    const damaged = await pixels(mutated);
    expect(damaged.sha, 'the WebP pixel probe cannot fail, so it proves nothing')
      .not.toBe(before.sha);
  });

  it('MP4 uuid: every prior box keeps its bytes AND its offset, and an mdat mutation reds', () => {
    // There is no video decoder in this repository, so the proof is made where it
    // is decoder-independent and stronger: a decode is a pure function of the coded
    // samples in `mdat` and the tables in `moov`. If both survive byte-for-byte AND
    // at the same file offsets, the decode cannot have changed. (Corroborated out of
    // band on 2026-08-24: ffmpeg decoded both files to an identical 121-frame rgb24
    // stream, and the mutated file to a different one.)
    const original = readFileSync(join(ROOT, MP4));
    const bare = withoutXmpUuid(original);
    expect(mp4HasXmp(bare), 'the probe subject still carries an XMP box').toBe(false);
    const injected = injectMp4Xmp(bare, packetFor(MP4));

    const boxesBefore = mp4Boxes(bare);
    const boxesAfter = mp4Boxes(injected);
    expect(boxesBefore.map((b) => b.type)).toEqual(['ftyp', 'moov', 'free', 'mdat']);
    expect(boxesAfter.map((b) => b.type)).toEqual(['ftyp', 'moov', 'free', 'mdat', 'uuid']);
    for (const [i, box] of boxesBefore.entries()) {
      expect(boxesAfter[i].start, `${box.type} moved`).toBe(box.start);
      expect(boxesAfter[i].size, `${box.type} resized`).toBe(box.size);
      expect(
        injected.subarray(box.start, box.start + box.size)
          .equals(bare.subarray(box.start, box.start + box.size)),
        `${box.type} was rewritten`,
      ).toBe(true);
    }
    expect(codedMedia(injected), 'the coded media changed').toBe(codedMedia(bare));

    // CONTROL: corrupt one byte inside mdat and the same comparison must fail.
    const mutated = Buffer.from(injected);
    const mdat = mp4Boxes(mutated).find((b) => b.type === 'mdat');
    mutated[mdat.start + Math.floor(mdat.size / 2)] ^= 0xff;
    expect(codedMedia(mutated), 'the mdat probe cannot fail, so it proves nothing')
      .not.toBe(codedMedia(bare));
  });

  it('the injector refuses everything it is not allowed to touch', () => {
    // The two rails that keep a signed manifest and an unattributable cohort safe.
    const c2paBearer = 'public/videos/realm-journey.mp4';
    expect(register.assets[c2paBearer].markers).toBe('present');
    expect(() => injectFile(c2paBearer, register.assets[c2paBearer], Buffer.alloc(0)))
      .toThrow(/refusing to write/);
    const cohortA = 'public/backgrounds/account.jpg';
    expect(register.assets[cohortA].markers).toBe('n/a');
    expect(() => injectFile(cohortA, register.assets[cohortA], Buffer.alloc(0)))
      .toThrow(/refusing to write/);
    // ...and it does NOT refuse a row it is allowed to write, so the rail is a rail
    // and not a blanket refusal that would pass this test by doing nothing.
    const allowed = 'public/backgrounds/about.jpg';
    expect(() => injectFile(allowed, { ...register.assets[allowed], markers: 'absent' },
      readFileSync(join(ROOT, allowed)))).not.toThrow();
    // Nothing is left owing: the roster the runner would open is empty.
    expect(injectableRows(register)).toEqual([]);
  });

  it('the shipped art is byte-for-byte what the committed injector produces', () => {
    // The strongest statement available: strip the packet out of each shipped file,
    // put it back with the tool in this repository, and land on the SAME BYTES. A
    // hand-edited asset, a tool drift, or a register field that changed under the
    // art all break this and nothing else would catch them.
    for (const [rel, strip] of [[JPEG, withoutXmpApp1], [WEBP, withoutXmpChunk], [MP4, withoutXmpUuid]]) {
      const shipped = readFileSync(join(ROOT, rel));
      const bare = strip(shipped);
      expect(bare.length, `${rel}: nothing was stripped, so the round trip is vacuous`)
        .toBeLessThan(shipped.length);
      const rebuilt = injectFile(rel, { ...register.assets[rel], markers: 'absent' }, bare);
      expect(rebuilt.equals(shipped), `${rel} is not reproducible from its stripped form`).toBe(true);
    }
  });

  it('the write is idempotent: a second pass adds nothing', () => {
    // Every shipped row is already injected, so re-running must be a no-op. This is
    // what stops a re-run from stacking a second packet onto every shipped file.
    for (const rel of [JPEG, WEBP, MP4]) {
      const current = readFileSync(join(ROOT, rel));
      const again = injectFile(rel, { ...register.assets[rel], markers: 'absent' }, current);
      expect(again.equals(current), `${rel} grew on a second pass`).toBe(true);
    }
  });
});

describe('no pipeline in scripts/ may strip provenance', () => {
  const scriptDir = join(ROOT, 'scripts');
  const usingSharp = readdirSync(scriptDir)
    .filter((name) => /\.(?:mjs|js)$/.test(name))
    .filter((name) => statSync(join(scriptDir, name)).isFile())
    .filter((name) => readFileSync(join(scriptDir, name), 'utf8').includes('sharp('))
    .sort();

  it('the scan really found the sharp scripts (it is not looking at nothing)', () => {
    expect(usingSharp.length).toBeGreaterThan(0);
    expect(usingSharp).toContain('optimize-backgrounds.mjs');
  });

  it('every script that uses sharp is declared in the roster', () => {
    const undeclared = usingSharp.filter((name) => SHARP_SCRIPTS[name] === undefined);
    expect(
      undeclared,
      'a new sharp pipeline appeared. Declare it in SHARP_SCRIPTS as "reencode"'
      + ' (and give it .keepMetadata()) or as "synthesise" (and build from a raw'
      + ` buffer):\n  ${undeclared.join('\n  ')}`,
    ).toEqual([]);
    const vanished = Object.keys(SHARP_SCRIPTS).filter((name) => !usingSharp.includes(name));
    expect(vanished, `the roster names scripts that no longer use sharp: ${vanished.join(', ')}`)
      .toEqual([]);
  });

  it('every declared re-encoder keeps metadata through the re-encode', () => {
    const offenders = [];
    for (const [name, { mode }] of Object.entries(SHARP_SCRIPTS)) {
      if (mode !== 'reencode') continue;
      const source = readFileSync(join(scriptDir, name), 'utf8');
      const chains = sharpChains(source);
      expect(chains.length, `${name}: no sharp chain parsed`).toBeGreaterThan(0);
      for (const { chain } of chains) {
        if (!/\.toFile\(|\.toBuffer\(/.test(chain)) continue;
        if (!keepsMetadata(chain)) offenders.push(`${name}: ${chain.slice(0, 90).replace(/\s+/g, ' ')}`);
      }
    }
    expect(
      offenders,
      'a sharp re-encode drops EXIF/XMP/IPTC by default, which is exactly how the'
      + ' `Made with Google AI` credit and the C2PA manifests left 46 shipped files.'
      + ` Add .keepMetadata():\n  ${offenders.join('\n  ')}`,
    ).toEqual([]);
  });

  it('every declared synthesiser builds in memory and reads no AI media', () => {
    const offenders = [];
    for (const [name, { mode }] of Object.entries(SHARP_SCRIPTS)) {
      if (mode !== 'synthesise') continue;
      const source = readFileSync(join(scriptDir, name), 'utf8');
      const chains = sharpChains(source);
      expect(chains.length, `${name}: no sharp chain parsed`).toBeGreaterThan(0);
      for (const { args } of chains) {
        if (!isRawSynthesis(args)) offenders.push(`${name}: ${args.slice(0, 90).replace(/\s+/g, ' ')}`);
      }
      // The exemption is only honest while the script stays away from the media
      // roots: the moment it reads one it is a re-encoder, whatever it is called.
      for (const root of MEDIA_ROOTS) {
        if (source.includes(root)) offenders.push(`${name}: reads ${root}`);
      }
    }
    expect(
      offenders,
      'a script declared "synthesise" is reading an image instead of building one.'
      + ` Re-declare it "reencode" and give it .keepMetadata():\n  ${offenders.join('\n  ')}`,
    ).toEqual([]);
  });

  it('every roster row states why it holds', () => {
    for (const [name, row] of Object.entries(SHARP_SCRIPTS)) {
      expect(['reencode', 'synthesise'], `${name} has an unknown mode`).toContain(row.mode);
      expect(row.reason.length, `${name} declares no reason`).toBeGreaterThan(20);
    }
  });

  it('CONTROL: the source scan convicts a stripping pipeline and clears a keeping one', () => {
    const stripping = 'await sharp(src).resize({ width: 1400 }).jpeg({ quality: 70 }).toFile(out);';
    const keeping = 'await sharp(src).resize({ width: 1400 }).keepMetadata().jpeg({ quality: 70 }).toFile(out);';
    const legacy = 'await sharp(src).withMetadata().webp({ quality: 72 }).toFile(out);';
    expect(sharpChains(stripping)).toHaveLength(1);
    expect(keepsMetadata(sharpChains(stripping)[0].chain)).toBe(false);
    expect(keepsMetadata(sharpChains(keeping)[0].chain)).toBe(true);
    expect(keepsMetadata(sharpChains(legacy)[0].chain)).toBe(true);
    // The raw-synthesis discriminator is live in both directions too.
    const synth = 'await sharp(tile, { raw: { width: 512, height: 512, channels: 4 } }).png().toBuffer();';
    const svg = 'await sharp(Buffer.from(logoSvg()), { density: 192 }).resize(32, 32).png().toBuffer();';
    expect(isRawSynthesis(sharpChains(synth)[0].args)).toBe(true);
    expect(isRawSynthesis(sharpChains(svg)[0].args)).toBe(true);
    expect(isRawSynthesis(sharpChains(stripping)[0].args)).toBe(false);
    // ...and a file with no sharp at all yields no chains, so an empty offender
    // list from a sharp-free file is an honest empty and not a parse failure.
    expect(sharpChains('const x = 1;')).toEqual([]);
  });
});
