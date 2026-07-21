/**
 * domain/townMap/arch/png.js -- K-0 SPIKE: a minimal DETERMINISTIC PNG encoder.
 *
 * The canonical-plate delivery format (kernel doc CORRECTION 3): the CPU rasterizer's RGB
 * framebuffer is encoded to PNG by a pinned in-repo encoder so a double run is byte-identical
 * cross-machine. There is NO zlib nondeterminism here because there is NO compression search:
 * the IDAT is a zlib stream of DEFLATE *stored* (uncompressed, BTYPE=00) blocks, so the exact
 * output bytes are a pure function of the pixels. CRC-32 (the zip.js IEEE table idiom) guards
 * each chunk; Adler-32 closes the zlib stream. Filter type 0 (None) on every scanline.
 *
 * PURITY: integer ops only (shifts, XOR, +, %, *) -- zero transcendentals, so the
 * transcendental-math ratchet holds this file at 0 sites, and the bytes are engine-stable.
 */

// CRC-32 (IEEE 802.3, reflected, poly 0xEDB88320) -- table-driven, built with integer ops
// only (the src/foundry/zip.js precedent; re-derived here to keep the spike leaf hermetic
// and free of a cross-layer import from the domain kernel into foundry).
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
function crc32(bytes) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

/** @param {Uint8Array} bytes @returns {number} unsigned Adler-32 (RFC 1950) */
function adler32(bytes) {
  let s1 = 1, s2 = 0;
  for (let i = 0; i < bytes.length; i++) {
    s1 = (s1 + bytes[i]) % 65521;
    s2 = (s2 + s1) % 65521;
  }
  return ((s2 << 16) | s1) >>> 0;
}

/** Big-endian u32 into `out` at `off`. @param {Uint8Array} out @param {number} off @param {number} v */
function putU32(out, off, v) {
  out[off] = (v >>> 24) & 0xFF;
  out[off + 1] = (v >>> 16) & 0xFF;
  out[off + 2] = (v >>> 8) & 0xFF;
  out[off + 3] = v & 0xFF;
}

/**
 * Wrap raw bytes as a PNG chunk: length(4 BE) + type(4) + data + CRC32(type+data)(4 BE).
 * @param {string} type four-ASCII chunk name @param {Uint8Array} data
 * @returns {Uint8Array}
 */
function chunk(type, data) {
  const out = new Uint8Array(12 + data.length);
  putU32(out, 0, data.length);
  for (let i = 0; i < 4; i++) out[4 + i] = type.charCodeAt(i);
  out.set(data, 8);
  // CRC covers the type + data (not the length).
  const crc = crc32(out.subarray(4, 8 + data.length));
  putU32(out, 8 + data.length, crc);
  return out;
}

/**
 * DEFLATE-store `raw` inside a zlib wrapper (RFC 1950 + 1951 BTYPE=00). No compression, so
 * the output is a pure, deterministic function of the input.
 * @param {Uint8Array} raw
 * @returns {Uint8Array}
 */
function zlibStore(raw) {
  const MAX = 65535;
  const nBlocks = Math.max(1, Math.ceil(raw.length / MAX));
  // 2 header bytes + per block (5 overhead + data) + 4 Adler.
  const size = 2 + nBlocks * 5 + raw.length + 4;
  const out = new Uint8Array(size);
  let o = 0;
  out[o++] = 0x78; // CMF: 32K window, deflate
  out[o++] = 0x01; // FLG: no dict, (0x78*256 + 0x01) % 31 == 0
  let p = 0;
  for (let b = 0; b < nBlocks; b++) {
    const len = Math.min(MAX, raw.length - p);
    const final = b === nBlocks - 1 ? 1 : 0;
    out[o++] = final; // BFINAL in bit0, BTYPE=00 in bits1-2
    out[o++] = len & 0xFF;
    out[o++] = (len >>> 8) & 0xFF;
    const nlen = (~len) & 0xFFFF;
    out[o++] = nlen & 0xFF;
    out[o++] = (nlen >>> 8) & 0xFF;
    out.set(raw.subarray(p, p + len), o);
    o += len;
    p += len;
  }
  putU32(out, o, adler32(raw));
  return out;
}

/**
 * Encode an 8-bit RGB framebuffer to PNG bytes. `rgb` is width*height*3 bytes, row-major,
 * top-to-bottom. Deterministic: identical (width, height, rgb) -> identical bytes.
 * @param {number} width @param {number} height @param {Uint8Array} rgb
 * @returns {Uint8Array}
 */
export function encodePng(width, height, rgb) {
  const SIG = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = new Uint8Array(13);
  putU32(ihdr, 0, width);
  putU32(ihdr, 4, height);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 2;  // color type 2 = truecolour RGB
  ihdr[10] = 0; // compression: deflate
  ihdr[11] = 0; // filter method 0
  ihdr[12] = 0; // interlace: none

  // Scanlines with a leading filter byte (0 = None) per row.
  const stride = width * 3;
  const raw = new Uint8Array(height * (stride + 1));
  for (let y = 0; y < height; y++) {
    const dst = y * (stride + 1);
    raw[dst] = 0;
    raw.set(rgb.subarray(y * stride, y * stride + stride), dst + 1);
  }
  const idat = zlibStore(raw);

  const cIhdr = chunk('IHDR', ihdr);
  const cIdat = chunk('IDAT', idat);
  const cIend = chunk('IEND', new Uint8Array(0));
  const total = SIG.length + cIhdr.length + cIdat.length + cIend.length;
  const out = new Uint8Array(total);
  let o = 0;
  out.set(SIG, o); o += SIG.length;
  out.set(cIhdr, o); o += cIhdr.length;
  out.set(cIdat, o); o += cIdat.length;
  out.set(cIend, o);
  return out;
}
