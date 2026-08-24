/**
 * lib/morph.mjs — REG-I0 · chamfer distance transform, morphology, connected components.
 *
 * ⭐ LIFTED VERBATIM IN BEHAVIOUR from the REG-0 specimen workspace's `raster.mjs`. The
 * frontage instrument's numbers must reproduce REG-0's to the digit, and a re-implemented
 * distance transform (chamfer vs true euclidean) moves the fourth decimal of every ratio.
 */
import { PxMask } from './classify.mjs';

/** Chamfer 3-4 distance transform in CELLS from the set where `!!a[i] === seedIsOne`. */
export function distanceTransform(a, n, seedIsOne = true) {
  const D = new Float32Array(n * n);
  const BIG = 1e9;
  for (let i = 0; i < D.length; i++) D[i] = (!!a[i] === seedIsOne) ? 0 : BIG;
  const d1 = 1, d2 = Math.SQRT2;
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const i = y * n + x; let v = D[i];
      if (v === 0) continue;
      if (x > 0) v = Math.min(v, D[i - 1] + d1);
      if (y > 0) v = Math.min(v, D[i - n] + d1);
      if (x > 0 && y > 0) v = Math.min(v, D[i - n - 1] + d2);
      if (x < n - 1 && y > 0) v = Math.min(v, D[i - n + 1] + d2);
      D[i] = v;
    }
  }
  for (let y = n - 1; y >= 0; y--) {
    for (let x = n - 1; x >= 0; x--) {
      const i = y * n + x; let v = D[i];
      if (v === 0) continue;
      if (x < n - 1) v = Math.min(v, D[i + 1] + d1);
      if (y < n - 1) v = Math.min(v, D[i + n] + d1);
      if (x < n - 1 && y < n - 1) v = Math.min(v, D[i + n + 1] + d2);
      if (x > 0 && y < n - 1) v = Math.min(v, D[i + n - 1] + d2);
      D[i] = v;
    }
  }
  return D;
}

export function close(mask, rUnits) {
  const n = mask.n, rc = rUnits / mask.s;
  const dOut = distanceTransform(mask.a, n, true);
  const dil = new Uint8Array(n * n);
  for (let i = 0; i < dil.length; i++) dil[i] = dOut[i] <= rc ? 1 : 0;
  const dIn = distanceTransform(dil, n, false);
  const out = new PxMask(n, mask.extent);
  for (let i = 0; i < out.a.length; i++) out.a[i] = dIn[i] > rc ? 1 : 0;
  return out;
}

export function dilate(mask, rUnits) {
  const n = mask.n, rc = rUnits / mask.s;
  const d = distanceTransform(mask.a, n, true);
  const out = new PxMask(n, mask.extent);
  for (let i = 0; i < out.a.length; i++) out.a[i] = d[i] <= rc ? 1 : 0;
  return out;
}

export function erode(mask, rUnits) {
  const n = mask.n, rc = rUnits / mask.s;
  const d = distanceTransform(mask.a, n, false);
  const out = new PxMask(n, mask.extent);
  for (let i = 0; i < out.a.length; i++) out.a[i] = d[i] > rc ? 1 : 0;
  return out;
}

/** 4-connected components. Returns {labels:Int32Array, count, sizes}. */
export function components(mask) {
  const n = mask.n, a = mask.a;
  const labels = new Int32Array(n * n).fill(-1);
  const sizes = [];
  const stack = new Int32Array(n * n);
  let count = 0;
  for (let i = 0; i < a.length; i++) {
    if (!a[i] || labels[i] >= 0) continue;
    const id = count++;
    let sp = 0; stack[sp++] = i; labels[i] = id;
    let size = 0;
    while (sp > 0) {
      const p = stack[--sp]; size++;
      const x = p % n, y = (p / n) | 0;
      if (x > 0 && a[p - 1] && labels[p - 1] < 0) { labels[p - 1] = id; stack[sp++] = p - 1; }
      if (x < n - 1 && a[p + 1] && labels[p + 1] < 0) { labels[p + 1] = id; stack[sp++] = p + 1; }
      if (y > 0 && a[p - n] && labels[p - n] < 0) { labels[p - n] = id; stack[sp++] = p - n; }
      if (y < n - 1 && a[p + n] && labels[p + n] < 0) { labels[p + n] = id; stack[sp++] = p + n; }
    }
    sizes.push(size);
  }
  return { labels, count, sizes };
}
