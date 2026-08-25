/**
 * lib/pixels.mjs — REG-I0 · turning vector ROLES into pixel POPULATIONS, and the two
 * distribution-free separability measures every pixel instrument reports.
 */
import { classify, roleMasks, assertViewBox, PxMask } from './classify.mjs';
import { close } from './morph.mjs';

/**
 * ⭐⭐ THE PROBE SET. Role coverage is traced from the BASE render's vector geometry at
 * `maskN` cells and folded down to a W×W decision grid; a decision pixel joins a role when
 * that role covers at least `coverMin` of it AND covers more of it than any other measured
 * role. GROUND is the urban envelope (a 22-unit closing over the built mask — REG-0's own
 * `urban` scope) minus every measured role.
 *
 * @returns {{sel:Record<string,Uint8Array>, ground:Uint8Array, inUrban:Uint8Array, cover:Record<string,Float32Array>, W:number}}
 */
export function rolePopulations(baseSvg, W, roles, { lens = 'parchment', maskN = 1000, coverMin = 0.5, envelopeUnits = 22 } = {}) {
  const { els, src } = classify(baseSvg, lens);
  /**
   * ⭐ DRESS-1b · the frame descriptor rides into `roleMasks`, which maps a FITTED square frame
   * into the 0..1000 space `PxMask` addresses. On the folio's own `0 0 1000 1000` the transform
   * is the identity and nothing here moves — see `assertViewBox`'s header for the one semantic
   * that does change on a fitted plate (unit-denominated distances become frame-relative).
   */
  const frame = assertViewBox(src);
  const need = [...new Set([...roles, 'building', 'landmark'])];
  const masks = roleMasks(els, maskN, need, frame);
  const per = maskN / W;
  const fold = (M, thresh) => {
    const out = thresh == null ? new Float32Array(W * W) : new Uint8Array(W * W);
    for (let y = 0; y < W; y++) {
      const cy0 = Math.floor(y * per), cy1 = Math.max(cy0 + 1, Math.floor((y + 1) * per));
      for (let x = 0; x < W; x++) {
        const cx0 = Math.floor(x * per), cx1 = Math.max(cx0 + 1, Math.floor((x + 1) * per));
        let hit = 0, tot = 0;
        for (let cy = cy0; cy < cy1; cy++) for (let cx = cx0; cx < cx1; cx++) { tot++; if (M.a[cy * maskN + cx]) hit++; }
        const f = tot ? hit / tot : 0;
        out[y * W + x] = thresh == null ? f : (f >= thresh ? 1 : 0);
      }
    }
    return out;
  };
  const cover = {};
  for (const role of roles) cover[role] = fold(masks[role], null);

  const built = new PxMask(maskN);
  for (const role of ['building', 'landmark']) {
    const M = masks[role];
    for (let i = 0; i < M.a.length; i++) if (M.a[i]) built.a[i] = 1;
  }
  const inUrban = fold(close(built, envelopeUnits), 0.5);

  const sel = {};
  for (const role of roles) sel[role] = new Uint8Array(W * W);
  const ground = new Uint8Array(W * W);
  for (let i = 0; i < W * W; i++) {
    let best = null, bv = 0;
    for (const role of roles) { const v = cover[role][i]; if (v > bv) { bv = v; best = role; } }
    if (best && bv >= coverMin) { sel[best][i] = 1; continue; }
    if (inUrban[i] && bv === 0) ground[i] = 1;
  }
  return { sel, ground, inUrban, cover, W, els, masks };
}

/* ─────────────────────── the two separability measures ─────────────────────── */

export const CHAN = {
  /** Rec.709 luminance, 0..255 — the channel §9.7's binding sub-law is written in */
  lum: (img, i) => 0.2126 * img.rgba[i * 4] + 0.7152 * img.rgba[i * 4 + 1] + 0.0722 * img.rgba[i * 4 + 2],
  /** blue-minus-red, −255..255 — the classifier's own water predicate, as a continuous axis */
  blueRed: (img, i) => img.rgba[i * 4 + 2] - img.rgba[i * 4],
};

export function sample(img, pick, chan) {
  const out = [];
  for (let i = 0, N = img.w * img.h; i < N; i++) if (pick[i]) out.push(chan(img, i));
  return out;
}

/**
 * ⭐ SEPARABILITY = 1 − OVL, the histogram OVERLAPPING COEFFICIENT complement.
 *
 *      OVL(A,G) = Σ_bins min( p_A(b), p_G(b) )          over BINS fixed bins spanning
 *      SEP      = 1 − OVL                               the POOLED range of both samples
 *
 * ⛔⛔ AND IT IS NOT COHEN'S d, FOR A MEASURED REASON. d was the first formulation and it
 * FAILED to move across this lane's own control pair (street d 1.59 → 1.73 while the picture
 * changed enormously) because d assumes two gaussians: it reads only the two means and one
 * pooled width. The defect this test exists to catch — §571.4's "buildings are FREESTANDING
 * rectangles with gaps to every neighbour" — makes the GROUND population BIMODAL, paper-pale
 * gaps sitting inside dark fabric, and a bimodal ground has exactly the mean and spread that
 * hide it from d. OVL reads the whole distribution and answers the question the eye asks:
 * what FRACTION of pixels could belong to either population. AUC is reported beside it as a
 * rank-based cross-check, because a measure and its cross-check disagreeing is itself a finding.
 *
 * DENOMINATOR: SEP's denominator is the total probability mass of each sample (each histogram
 * is normalised to 1), so SEP is dimensionless in [0,1]; the SAMPLE SIZES that produced it are
 * reported on the same row and are the figures that decide whether the number means anything.
 */
export const OVL_BINS = 64;
export function separability(A, G, bins = OVL_BINS) {
  if (!A.length || !G.length) return { sep: null, ovl: null, nA: A.length, nG: G.length };
  let lo = Infinity, hi = -Infinity;
  for (const v of A) { if (v < lo) lo = v; if (v > hi) hi = v; }
  for (const v of G) { if (v < lo) lo = v; if (v > hi) hi = v; }
  if (hi - lo < 1e-9) return { sep: 0, ovl: 1, nA: A.length, nG: G.length };
  const H = (xs) => {
    const h = new Float64Array(bins);
    for (const v of xs) { let b = Math.floor(((v - lo) / (hi - lo)) * bins); if (b < 0) b = 0; if (b >= bins) b = bins - 1; h[b]++; }
    for (let i = 0; i < bins; i++) h[i] /= xs.length;
    return h;
  };
  const ha = H(A), hg = H(G);
  let o = 0;
  for (let i = 0; i < bins; i++) o += Math.min(ha[i], hg[i]);
  return { sep: 1 - o, ovl: o, nA: A.length, nG: G.length };
}

/** ROC AUC, folded to ≥0.5 (direction-agnostic: the instrument asks IF they separate, not which way) */
export function auc(A, G) {
  if (!A.length || !G.length) return null;
  const all = A.map((v) => [v, 1]).concat(G.map((v) => [v, 0])).sort((p, q) => p[0] - q[0]);
  let sumA = 0;
  for (let i = 0; i < all.length;) {
    let j = i;
    while (j < all.length && all[j][0] === all[i][0]) j++;
    const avg = (i + j + 1) / 2;
    for (let k = i; k < j; k++) if (all[k][1]) sumA += avg;
    i = j;
  }
  const u = sumA - (A.length * (A.length + 1)) / 2;
  const a = u / (A.length * G.length);
  return Math.max(a, 1 - a);
}

export function meanOf(xs) { return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null; }
