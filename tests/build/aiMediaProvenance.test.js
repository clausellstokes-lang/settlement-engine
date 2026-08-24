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
 *   3. THE DEBT ONLY SHRINKS. The count of AI files carrying no marking is a
 *      shrink-only ratchet, so the restore can land in pieces and no piece can
 *      silently regress.
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
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, posix } from 'node:path';

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
 */
const UNMARKED_CEILING = 46;

/** Cohort A's exact membership, pinned so a relabel cannot pass unnoticed. */
const COHORT_A_COUNT = 23;

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

  it('the present set is the six files measured on 2026-08-24, not an empty set', () => {
    const present = Object.entries(register.assets)
      .filter(([, row]) => row.markers === 'present')
      .map(([path]) => path)
      .sort();
    expect(present).toEqual([
      'public/evolution/city.jpg',
      'public/evolution/hamlet.jpg',
      'public/evolution/metropolis.jpg',
      'public/evolution/thorp.jpg',
      'public/evolution/town.jpg',
      'public/videos/realm-journey.mp4',
    ]);
    // Each one declares what it must keep, so none of them is pinned to nothing.
    for (const path of present) {
      expect(register.assets[path].require.length, `${path} pins no marker`).toBeGreaterThan(0);
    }
  });

  it('CONTROL: the marker scan reports a stripped file as stripped', () => {
    // The live negative above is only trustworthy if the same function fails on
    // a file that genuinely lacks the marking. Plant one: the Google credit is
    // absent from every cohort-B painting, by measurement.
    const planted = join(ROOT, 'public/backgrounds/founders-charter.jpg');
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
