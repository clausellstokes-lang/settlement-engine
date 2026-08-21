/**
 * zip.js — minimal STORE-only (method 0, no compression) ZIP writer for the
 * Foundry module export.
 *
 * Why hand-rolled: the repo carries no zip dependency and the artifact is a
 * few tens of KB of JSON/markdown — compression buys nothing, and a ~90-line
 * writer we fully control is deterministic byte-for-byte (fixed DOS timestamp,
 * stable entry order), which lets tests pin the module output without golden
 * churn. Format per APPNOTE.TXT: local file headers + central directory +
 * end-of-central-directory record; UTF-8 names (general-purpose flag bit 11).
 *
 * Pure module: no DOM, no Date.now — safe anywhere (tests run it in node).
 */

// CRC-32 (IEEE 802.3, reflected, poly 0xEDB88320) — table-driven.
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c >>> 0;
  }
  return t;
})();

/** @param {Uint8Array} bytes @returns {number} unsigned CRC-32 */
export function crc32(bytes) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

// Fixed DOS timestamp: 2026-01-01 00:00:00. Every export stamps the same
// mtime so identical inputs produce identical zips (determinism > provenance;
// the module manifest carries no timestamp either).
const DOS_DATE = ((2026 - 1980) << 9) | (1 << 5) | 1; // yyyyyyym mmmddddd
const DOS_TIME = 0;

/**
 * Build a ZIP archive from an ordered list of entries.
 *
 * @param {Array<{ path: string, data: string | Uint8Array }>} entries
 *   Entry order is preserved (it determines byte layout — keep it stable).
 *   String data is UTF-8 encoded.
 * @param {{ dosDate?: number, dosTime?: number }} [opts]
 * @returns {Uint8Array<ArrayBuffer>} the archive bytes
 */
export function buildZip(entries, { dosDate = DOS_DATE, dosTime = DOS_TIME } = {}) {
  const enc = new TextEncoder();
  const files = entries.map(e => ({
    name: enc.encode(e.path),
    data: typeof e.data === 'string' ? enc.encode(e.data) : e.data,
  }));

  const localSize = files.reduce((n, f) => n + 30 + f.name.length + f.data.length, 0);
  const centralSize = files.reduce((n, f) => n + 46 + f.name.length, 0);
  const out = new Uint8Array(localSize + centralSize + 22);
  const view = new DataView(out.buffer);

  let off = 0;
  const offsets = [];
  const crcs = [];

  // ── Local file headers + data ─────────────────────────────────────────────
  for (const f of files) {
    offsets.push(off);
    const crc = crc32(f.data);
    crcs.push(crc);
    view.setUint32(off, 0x04034b50, true);        // local file header signature
    view.setUint16(off + 4, 20, true);            // version needed to extract (2.0)
    view.setUint16(off + 6, 0x0800, true);        // flags: UTF-8 names
    view.setUint16(off + 8, 0, true);             // method: store
    view.setUint16(off + 10, dosTime, true);
    view.setUint16(off + 12, dosDate, true);
    view.setUint32(off + 14, crc, true);
    view.setUint32(off + 18, f.data.length, true); // compressed size (= raw: store)
    view.setUint32(off + 22, f.data.length, true); // uncompressed size
    view.setUint16(off + 26, f.name.length, true);
    view.setUint16(off + 28, 0, true);            // extra field length
    out.set(f.name, off + 30);
    out.set(f.data, off + 30 + f.name.length);
    off += 30 + f.name.length + f.data.length;
  }

  // ── Central directory ─────────────────────────────────────────────────────
  const cdStart = off;
  files.forEach((f, i) => {
    view.setUint32(off, 0x02014b50, true);        // central directory signature
    view.setUint16(off + 4, 20, true);            // version made by
    view.setUint16(off + 6, 20, true);            // version needed
    view.setUint16(off + 8, 0x0800, true);        // flags: UTF-8 names
    view.setUint16(off + 10, 0, true);            // method: store
    view.setUint16(off + 12, dosTime, true);
    view.setUint16(off + 14, dosDate, true);
    view.setUint32(off + 16, crcs[i], true);
    view.setUint32(off + 20, f.data.length, true);
    view.setUint32(off + 24, f.data.length, true);
    view.setUint16(off + 28, f.name.length, true);
    // extra len / comment len / disk # / internal attrs / external attrs all 0
    view.setUint32(off + 42, offsets[i], true);   // local header offset
    out.set(f.name, off + 46);
    off += 46 + f.name.length;
  });

  // ── End of central directory ──────────────────────────────────────────────
  view.setUint32(off, 0x06054b50, true);          // EOCD signature
  view.setUint16(off + 8, files.length, true);    // entries on this disk
  view.setUint16(off + 10, files.length, true);   // entries total
  view.setUint32(off + 12, off - cdStart, true);  // cd size
  view.setUint32(off + 16, cdStart, true);        // cd offset
  return out;
}

export default buildZip;
