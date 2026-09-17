/**
 * scripts/inject-ai-provenance.mjs — WRITE THE CREDIT BACK INTO THE FILES.
 *
 * TE-AIP-1 stopped the bleeding: scripts/ai-media-provenance.json records what
 * every AI file is, and both sharp pipelines now call .keepMetadata() so nothing
 * else gets stripped. This script is the follow-on — it puts a human-readable
 * provenance marking INTO the 46 shipped files that carry none, ahead of
 * Higgsfield's section 5.5 taking effect on 2026-08-27.
 *
 * WHAT THIS WRITES, AND WHAT IT CANNOT WRITE
 * ------------------------------------------
 * It writes a plain XMP packet: the IPTC DigitalSourceType `trainedAlgorithmicMedia`
 * tag, the generator, the generation date, the Higgsfield job id where the master
 * recorded one, and `photoshop:Credit` ONLY where the master itself carried that
 * credit. That is a CREDIT. It is NOT a C2PA manifest and this file, the register
 * and the gate all say so in words: the original manifests are signed by Google LLC
 * and Byteplus Pte. Ltd., a C2PA hash binding covers the asset's own bytes so it
 * would not validate over a resized derivative anyway, and minting a fresh one needs
 * a signing identity the estate does not hold. Nothing here may ever be described as
 * a restored C2PA.
 *
 * WHY BYTE SURGERY AND NOT AN IMAGE LIBRARY
 * -----------------------------------------
 * Every image library re-encodes. Re-encoding is exactly the act that destroyed
 * this metadata in the first place, and it would also destroy the SynthID pixel
 * watermark that may still be in the Google stills. So each injector edits the
 * CONTAINER only and copies the coded bitstream through untouched:
 *
 *   JPEG  — a new APP1 segment carrying the XMP namespace header, spliced in after
 *           the JFIF/Exif prologue. Every DQT/DHT/SOF/SOS byte is copied verbatim.
 *   WebP  — the simple-format RIFF is promoted to the extended VP8X form (which is
 *           what the spec requires before a WebP may carry an `XMP ` chunk) and the
 *           original `VP8 ` chunk payload is copied verbatim.
 *   MP4   — a top-level `uuid` box with the standard XMP UUID, appended after the
 *           last existing box. `ftyp`, `moov`, `free` and `mdat` keep their bytes
 *           AND their file offsets, so no sample table is invalidated.
 *
 * Because the coded bitstream is copied rather than re-compressed, the decoded
 * pixels are identical by construction — and tests/build/aiMediaProvenance.test.js
 * proves it by decoding before and after and comparing raw buffers, with a
 * deliberate mutation showing the comparison can fail.
 *
 * SAFETY RAILS (all three are enforced, not advisory)
 *   - Only rows the register marks `absent` are ever opened for writing. The six
 *     `present` rows are refused: realm-journey.mp4 carries a VALID C2PA and
 *     appending a box to it would break the hash binding it still satisfies.
 *   - Cohort A — the 23 `n/a` rows — is refused. Those files are not Higgsfield
 *     output, nobody can state their origin, and stamping an AI credit on them
 *     would assert something no one can support.
 *   - `Made with Google AI` is written ONLY where the register's `credit` field
 *     says the master carried it. Ten masters carry a Higgsfield job id and no
 *     Google marker at all; five shipped files descend from two of them, and they
 *     get the source-type tag and the job id with the model recorded as
 *     "not established".
 *
 * Idempotent: a file that already carries an XMP packet is left byte-untouched, so
 * re-running is a no-op and the script can never stack two packets.
 *
 * Usage:  node scripts/inject-ai-provenance.mjs [--check]
 *         --check reports what would change and writes nothing (exit 1 if any file
 *         is still unmarked, which is what CI would want).
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const REGISTER_PATH = join(ROOT, 'scripts', 'ai-media-provenance.json');

/**
 * The date the first restore was performed. A constant: the output must be deterministic.
 * A row that carries its own `restored` date writes that date instead (the 2026-09-16
 * arrow-header art was credited that day, and stamping 2026-08-24 into it would be a
 * claim the file cannot support). Every row the 2026-08-24 restore wrote records
 * exactly this date, so its packet is byte-identical either way.
 */
export const RESTORED_ON = '2026-08-24';

/** The byte-order mark an XMP packet header is required to open with. */
const BOM = '\uFEFF';

/** The estate's own XMP namespace, for the fields no standard schema has a slot for. */
const SFP_NS = 'https://settlementforge.com/ns/provenance/1.0/';

/** The IPTC digital-source-type vocabulary entry for generative-AI output. */
const TRAINED_ALGORITHMIC_MEDIA =
  'http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia';

/**
 * The sentence that keeps a credit from being mistaken for a manifest. It is
 * written into every file, so the disclaimer travels with the asset instead of
 * living only in a repository nobody downloads.
 */
const c2paNote = (restoredOn) =>
  `Provenance credit re-added ${restoredOn} from the estate-held generation master. `
  + 'This is a plain XMP credit, NOT a C2PA manifest: the original C2PA manifest was '
  + 'removed by a re-encode, it was signed by a third party, and it cannot be '
  + 're-created or fabricated.';

const xmlEscape = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Build the XMP packet for one asset from its register row. Pure and
 * deterministic: same row in, same bytes out, every time.
 */
export function buildXmpPacket(rel, row) {
  const attrs = [
    ['Iptc4xmpExt:DigitalSourceType', TRAINED_ALGORITHMIC_MEDIA],
    ['Iptc4xmpExt:DigitalSourceFileType', TRAINED_ALGORITHMIC_MEDIA],
  ];
  // The Google credit is written ONLY where the master carried it.
  if (row.credit) attrs.push(['photoshop:Credit', row.credit]);
  attrs.push(['photoshop:Source', row.origin]);
  if (row.generated) attrs.push(['xmp:CreateDate', row.generated]);
  attrs.push(['sfp:generatorAgent', row.agent ?? 'not established']);
  attrs.push(['sfp:generatorModel', row.model ?? 'not established']);
  if (row.job) attrs.push(['sfp:higgsfieldJobId', row.job]);
  attrs.push(['sfp:generationMaster', row.master ?? 'not established']);
  if (row.mapped_by) attrs.push(['sfp:masterEstablishedBy', row.mapped_by]);
  attrs.push(['sfp:asset', rel]);
  const restoredOn = row.restored ?? RESTORED_ON;
  attrs.push(['sfp:restoredOn', restoredOn]);
  attrs.push(['sfp:c2paStatus', c2paNote(restoredOn)]);

  const body = attrs.map(([k, v]) => `    ${k}="${xmlEscape(v)}"`).join('\n');
  return [
    `<?xpacket begin="${BOM}" id="W5M0MpCehiHzreSzNTczkc9d"?>`,
    '<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="SettlementForge provenance restore 1.0">',
    ' <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">',
    '  <rdf:Description rdf:about=""',
    '    xmlns:Iptc4xmpExt="http://iptc.org/std/Iptc4xmpExt/2008-02-29/"',
    '    xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/"',
    '    xmlns:xmp="http://ns.adobe.com/xap/1.0/"',
    `    xmlns:sfp="${SFP_NS}"`,
    body,
    '  />',
    ' </rdf:RDF>',
    '</x:xmpmeta>',
    '<?xpacket end="w"?>',
  ].join('\n');
}

/* ─────────────────────────── injector 1: JPEG APP1 ─────────────────────────── */

/** The namespace header an XMP APP1 segment must start with, NUL included. */
const JPEG_XMP_HEADER = Buffer.concat([
  Buffer.from('http://ns.adobe.com/xap/1.0/', 'latin1'),
  Buffer.from([0x00]),
]);
const JPEG_MAX_SEGMENT = 0xffff;

/** True when the JPEG already carries an XMP APP1, so injection must be a no-op. */
export function jpegHasXmp(buf) {
  let off = 2;
  while (off + 4 <= buf.length && buf[off] === 0xff) {
    const marker = buf[off + 1];
    if (marker === 0xda || marker === 0xd9) return false;
    const len = buf.readUInt16BE(off + 2);
    if (marker === 0xe1 && buf.subarray(off + 4, off + 4 + JPEG_XMP_HEADER.length).equals(JPEG_XMP_HEADER)) {
      return true;
    }
    off += 2 + len;
  }
  return false;
}

/**
 * Splice an XMP APP1 into a JPEG, after the JFIF APP0 and any Exif APP1 prologue
 * and before everything else. Not one byte of the original is rewritten — the
 * segment is inserted between two untouched halves.
 */
export function injectJpegXmp(buf, packet) {
  if (buf[0] !== 0xff || buf[1] !== 0xd8) throw new Error('not a JPEG: no SOI');
  if (jpegHasXmp(buf)) return buf;

  let at = 2;
  while (at + 4 <= buf.length && buf[at] === 0xff) {
    const marker = buf[at + 1];
    const isApp0 = marker === 0xe0;
    const isExifApp1 = marker === 0xe1 && buf.subarray(at + 4, at + 8).toString('latin1') === 'Exif';
    if (!isApp0 && !isExifApp1) break;
    at += 2 + buf.readUInt16BE(at + 2);
  }

  const payload = Buffer.concat([JPEG_XMP_HEADER, Buffer.from(packet, 'utf8')]);
  if (payload.length + 2 > JPEG_MAX_SEGMENT) throw new Error('XMP packet too large for one APP1');
  const header = Buffer.alloc(4);
  header.writeUInt16BE(0xffe1, 0);
  header.writeUInt16BE(payload.length + 2, 2);
  return Buffer.concat([buf.subarray(0, at), header, payload, buf.subarray(at)]);
}

/* ─────────────────────────── injector 2: WebP VP8X ─────────────────────────── */

const VP8X_XMP_FLAG = 0x04;
const VP8X_ALPHA_FLAG = 0x10;

/** Every RIFF chunk in a WebP, as {type, payload}. Padding is not part of payload. */
export function webpChunks(buf) {
  if (buf.toString('latin1', 0, 4) !== 'RIFF' || buf.toString('latin1', 8, 12) !== 'WEBP') {
    throw new Error('not a WebP RIFF');
  }
  const out = [];
  let off = 12;
  while (off + 8 <= buf.length) {
    const type = buf.toString('latin1', off, off + 4);
    const size = buf.readUInt32LE(off + 4);
    if (off + 8 + size > buf.length) throw new Error(`WebP chunk ${type} overruns the file`);
    out.push({ type, payload: buf.subarray(off + 8, off + 8 + size) });
    off += 8 + size + (size % 2);
  }
  if (off !== buf.length) throw new Error('WebP chunk chain does not end at EOF');
  return out;
}

/** Canvas dimensions, read out of the coded bitstream rather than guessed. */
export function webpCanvas(chunks) {
  const vp8x = chunks.find((c) => c.type === 'VP8X');
  if (vp8x) {
    const p = vp8x.payload;
    return {
      width: (p[4] | (p[5] << 8) | (p[6] << 16)) + 1,
      height: (p[7] | (p[8] << 8) | (p[9] << 16)) + 1,
      flags: p[0],
    };
  }
  const lossy = chunks.find((c) => c.type === 'VP8 ');
  if (lossy) {
    const p = lossy.payload;
    if (!(p[3] === 0x9d && p[4] === 0x01 && p[5] === 0x2a)) throw new Error('VP8 start code missing');
    return { width: p.readUInt16LE(6) & 0x3fff, height: p.readUInt16LE(8) & 0x3fff, flags: 0 };
  }
  const lossless = chunks.find((c) => c.type === 'VP8L');
  if (lossless) {
    const p = lossless.payload;
    if (p[0] !== 0x2f) throw new Error('VP8L signature missing');
    const bits = p.readUInt32LE(1);
    return {
      width: (bits & 0x3fff) + 1,
      height: ((bits >> 14) & 0x3fff) + 1,
      flags: ((bits >> 28) & 0x1) ? VP8X_ALPHA_FLAG : 0,
    };
  }
  throw new Error('WebP carries no image chunk');
}

const riffChunk = (type, payload) => {
  const head = Buffer.alloc(8);
  head.write(type, 0, 'latin1');
  head.writeUInt32LE(payload.length, 4);
  const pad = payload.length % 2 ? Buffer.from([0]) : Buffer.alloc(0);
  return Buffer.concat([head, payload, pad]);
};

/**
 * Give a WebP an `XMP ` chunk. A simple-format file has no slot for one, so it is
 * promoted to the extended VP8X form; the coded `VP8 `/`VP8L` payload is copied
 * through byte-for-byte, which is why the decode cannot change.
 */
export function injectWebpXmp(buf, packet) {
  const chunks = webpChunks(buf);
  if (chunks.some((c) => c.type === 'XMP ')) return buf;

  const { width, height, flags } = webpCanvas(chunks);
  if (width < 1 || height < 1 || width > 0x1000000 || height > 0x1000000) {
    throw new Error(`implausible WebP canvas ${width}x${height}`);
  }

  const rest = chunks.filter((c) => c.type !== 'VP8X');
  const alpha = rest.some((c) => c.type === 'ALPH') ? VP8X_ALPHA_FLAG : 0;
  const vp8xPayload = Buffer.alloc(10);
  vp8xPayload[0] = flags | alpha | VP8X_XMP_FLAG;
  vp8xPayload.writeUIntLE(width - 1, 4, 3);
  vp8xPayload.writeUIntLE(height - 1, 7, 3);

  const body = Buffer.concat([
    riffChunk('VP8X', vp8xPayload),
    ...rest.map((c) => riffChunk(c.type, c.payload)),
    riffChunk('XMP ', Buffer.from(packet, 'utf8')),
  ]);
  const head = Buffer.alloc(12);
  head.write('RIFF', 0, 'latin1');
  head.writeUInt32LE(body.length + 4, 4);
  head.write('WEBP', 8, 'latin1');
  return Buffer.concat([head, body]);
}

/* ──────────────────────────── injector 3: MP4 uuid ─────────────────────────── */

/** The UUID that identifies an XMP payload inside an ISO-BMFF `uuid` box. */
const MP4_XMP_UUID = Buffer.from('BE7ACFCB97A942E89C71999491E3AFAC', 'hex');

/** Every top-level box, as {type, start, size}. Throws unless the chain ends at EOF. */
export function mp4Boxes(buf) {
  const out = [];
  let off = 0;
  while (off + 8 <= buf.length) {
    let size = buf.readUInt32BE(off);
    const type = buf.toString('latin1', off + 4, off + 8);
    if (size === 1) size = Number(buf.readBigUInt64BE(off + 8));
    else if (size === 0) size = buf.length - off;
    if (size < 8 || off + size > buf.length) throw new Error(`MP4 box ${type} has bad size ${size}`);
    out.push({ type, start: off, size });
    off += size;
  }
  if (off !== buf.length) throw new Error('MP4 box chain does not end at EOF');
  return out;
}

export function mp4HasXmp(buf) {
  return mp4Boxes(buf).some(
    (b) => b.type === 'uuid' && buf.subarray(b.start + 8, b.start + 24).equals(MP4_XMP_UUID),
  );
}

/**
 * Append an XMP `uuid` box after the last existing top-level box. Appending is the
 * only edit that leaves every prior byte at its original OFFSET as well as its
 * original value, which matters: `moov` sample tables address `mdat` by absolute
 * file offset, and an insertion anywhere earlier would silently desynchronise them.
 */
export function injectMp4Xmp(buf, packet) {
  const boxes = mp4Boxes(buf);
  if (boxes.length === 0) throw new Error('not an MP4: no boxes');
  if (!boxes.some((b) => b.type === 'ftyp')) throw new Error('not an MP4: no ftyp box');
  if (mp4HasXmp(buf)) return buf;

  const payload = Buffer.concat([MP4_XMP_UUID, Buffer.from(packet, 'utf8')]);
  const head = Buffer.alloc(8);
  head.writeUInt32BE(8 + payload.length, 0);
  head.write('uuid', 4, 'latin1');
  return Buffer.concat([buf, head, payload]);
}

/* ─────────────────────────────── the roster run ────────────────────────────── */

const INJECTORS = { jpg: injectJpegXmp, jpeg: injectJpegXmp, webp: injectWebpXmp, mp4: injectMp4Xmp };

/** The one place that decides a file may be written to. Refuses `present` and `n/a`. */
export function injectableRows(register) {
  return Object.entries(register.assets).filter(([, row]) => row.markers === 'absent');
}

export function injectFile(rel, row, buf) {
  if (row.markers !== 'absent') {
    throw new Error(`refusing to write ${rel}: register marks it "${row.markers}", not "absent"`);
  }
  const ext = rel.split('.').pop().toLowerCase();
  const injector = INJECTORS[ext];
  if (!injector) throw new Error(`no injector for .${ext} (${rel})`);
  return injector(buf, buildXmpPacket(rel, row));
}

function main() {
  const check = process.argv.includes('--check');
  const register = JSON.parse(readFileSync(REGISTER_PATH, 'utf8'));
  const rows = injectableRows(register);
  let changed = 0;
  let grew = 0;
  for (const [rel, row] of rows) {
    const abs = join(ROOT, rel);
    const before = readFileSync(abs);
    const after = injectFile(rel, row, before);
    if (after.equals(before)) continue;
    changed += 1;
    grew += after.length - before.length;
    console.log(`${check ? 'would write' : 'wrote'} ${rel}  ${before.length} -> ${after.length} (+${after.length - before.length})`);
    if (!check) writeFileSync(abs, after);
  }
  console.log(`${changed} file(s), ${grew} byte(s) added, of ${rows.length} row(s) marked absent`);
  if (check && changed > 0) process.exitCode = 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
