/**
 * lib/png.mjs — REG-I0 · a dependency-free PNG reader, and a deterministic box downscale.
 *
 * ⛔ WHY IT IS HAND-ROLLED. The instrument set must be runnable by any successor with nothing
 * but `node` and the sealed worktree — a decoder pulled from the repo's node_modules would make
 * every instrument depend on a 453-package install that the lane-worktree hazard says is five
 * weeks stale in the shared tree. zlib is in the standard library; the rest is 8 filter types.
 *
 * Supports the colour types headless Chrome actually emits for a screenshot: 8-bit RGB (2),
 * 8-bit RGBA (6), 8-bit grey (0) and 8-bit grey+alpha (4). Interlaced PNGs are REFUSED loudly
 * rather than decoded wrong — a silently mis-decoded raster is a dead instrument returning
 * plausible numbers.
 */
import { readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';

const SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/** @returns {{w:number,h:number,rgba:Uint8Array}} rgba is w*h*4, straight (un-premultiplied). */
export function readPNG(file) {
  const buf = readFileSync(file);
  if (!buf.subarray(0, 8).equals(SIG)) throw new Error(`PNG_BAD_SIG ${file}`);
  let p = 8;
  let w = 0, h = 0, depth = 0, ctype = 0, interlace = 0;
  /** @type {Buffer[]} */ const idat = [];
  let plte = null, trns = null;
  while (p + 8 <= buf.length) {
    const len = buf.readUInt32BE(p);
    const type = buf.toString('latin1', p + 4, p + 8);
    const data = buf.subarray(p + 8, p + 8 + len);
    if (type === 'IHDR') {
      w = data.readUInt32BE(0); h = data.readUInt32BE(4);
      depth = data[8]; ctype = data[9]; interlace = data[12];
    } else if (type === 'IDAT') idat.push(Buffer.from(data));
    else if (type === 'PLTE') plte = Buffer.from(data);
    else if (type === 'tRNS') trns = Buffer.from(data);
    else if (type === 'IEND') break;
    p += 12 + len;
  }
  if (interlace) throw new Error(`PNG_INTERLACED ${file} — refused rather than mis-decoded`);
  if (depth !== 8) throw new Error(`PNG_DEPTH_${depth} ${file} — only 8-bit is decoded`);
  const CH = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[ctype];
  if (!CH) throw new Error(`PNG_CTYPE_${ctype} ${file}`);
  const raw = inflateSync(Buffer.concat(idat));
  const stride = w * CH;
  const out = new Uint8Array(w * h * CH);
  let rp = 0;
  const prev = new Uint8Array(stride);
  const cur = new Uint8Array(stride);
  for (let y = 0; y < h; y++) {
    const f = raw[rp++];
    raw.copy(cur, 0, rp, rp + stride); rp += stride;
    for (let i = 0; i < stride; i++) {
      const a = i >= CH ? cur[i - CH] : 0;   // left
      const b = prev[i];                      // up
      const c = i >= CH ? prev[i - CH] : 0;   // up-left
      let v = cur[i];
      if (f === 1) v = (v + a) & 255;
      else if (f === 2) v = (v + b) & 255;
      else if (f === 3) v = (v + ((a + b) >> 1)) & 255;
      else if (f === 4) {
        const pa = Math.abs(b - c), pb = Math.abs(a - c), pc = Math.abs(a + b - 2 * c);
        v = (v + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 255;
      } else if (f !== 0) throw new Error(`PNG_FILTER_${f} ${file}`);
      cur[i] = v;
    }
    out.set(cur, y * stride);
    prev.set(cur);
  }
  // normalise to RGBA
  const rgba = new Uint8Array(w * h * 4);
  for (let i = 0, n = w * h; i < n; i++) {
    let r, g, b, a = 255;
    if (ctype === 0) { r = g = b = out[i]; }
    else if (ctype === 4) { r = g = b = out[i * 2]; a = out[i * 2 + 1]; }
    else if (ctype === 2) { r = out[i * 3]; g = out[i * 3 + 1]; b = out[i * 3 + 2]; }
    else if (ctype === 6) { r = out[i * 4]; g = out[i * 4 + 1]; b = out[i * 4 + 2]; a = out[i * 4 + 3]; }
    else { const k = out[i] * 3; r = plte[k]; g = plte[k + 1]; b = plte[k + 2]; if (trns && out[i] < trns.length) a = trns[out[i]]; }
    rgba[i * 4] = r; rgba[i * 4 + 1] = g; rgba[i * 4 + 2] = b; rgba[i * 4 + 3] = a;
  }
  return { w, h, rgba };
}

/**
 * Deterministic BOX downscale to a target longest side. A box filter (not a sample) is the
 * point: the squint test asks what survives when detail is averaged away, so the averaging is
 * the instrument, and nearest-neighbour would keep single-pixel ink that the eye never sees.
 */
export function boxDownscale(img, target) {
  const { w, h, rgba } = img;
  const scale = target / Math.max(w, h);
  const nw = Math.max(1, Math.round(w * scale));
  const nh = Math.max(1, Math.round(h * scale));
  const out = new Uint8Array(nw * nh * 4);
  for (let y = 0; y < nh; y++) {
    const y0 = Math.floor((y * h) / nh), y1 = Math.max(y0 + 1, Math.floor(((y + 1) * h) / nh));
    for (let x = 0; x < nw; x++) {
      const x0 = Math.floor((x * w) / nw), x1 = Math.max(x0 + 1, Math.floor(((x + 1) * w) / nw));
      let r = 0, g = 0, b = 0, a = 0, n = 0;
      for (let yy = y0; yy < y1; yy++) {
        for (let xx = x0; xx < x1; xx++) {
          const i = (yy * w + xx) * 4;
          r += rgba[i]; g += rgba[i + 1]; b += rgba[i + 2]; a += rgba[i + 3]; n++;
        }
      }
      const o = (y * nw + x) * 4;
      out[o] = Math.round(r / n); out[o + 1] = Math.round(g / n);
      out[o + 2] = Math.round(b / n); out[o + 3] = Math.round(a / n);
    }
  }
  return { w: nw, h: nh, rgba: out };
}

/** Rec.709 relative luminance of a pixel index, 0..255. */
export const lumAt = (img, i) => 0.2126 * img.rgba[i * 4] + 0.7152 * img.rgba[i * 4 + 1] + 0.0722 * img.rgba[i * 4 + 2];
