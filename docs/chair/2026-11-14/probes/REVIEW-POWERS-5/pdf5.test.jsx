// REVIEW-POWERS-5 pdf5.test.jsx — CORPUS=<corpus> OUTF=<json> vitest run --config vitest.pdf5.config.mjs (from the tree)
// The PDF's Power chapter (pdf/sections/PowerStructure.jsx) built for every town of a corpus whose ruling power carries a
// modifier: its text leaves collected (the collectText walk of tests/components/legitimacyPlainWords.test.jsx), and the
// leaves that print a stored modifier key, or the stability label, recorded. Reads only.
import { it } from 'vitest';
import fs from 'node:fs'; import zlib from 'node:zlib';
import { PowerStructure } from '/tmp/rp5/tip/src/pdf/sections/PowerStructure.jsx';
import { buildViewModel } from '/tmp/rp5/tip/src/pdf/lib/viewModel.js';
import { governingFactionOf } from '/tmp/rp5/tip/src/domain/rulingPower.js';
function collectText(node, out = []) {
  if (node == null || typeof node === 'boolean') return out;
  if (typeof node === 'string' || typeof node === 'number') { out.push(String(node)); return out; }
  if (Array.isArray(node)) { for (const n of node) collectText(n, out); return out; }
  if (typeof node === 'object') { if (typeof node.type === 'function') return collectText(node.type(node.props), out); return collectText(node.props?.children, out); }
  return out;
}
const KEYS = ['arcane-advised', 'mage-advised', 'military-dominated', 'defended', 'arms-backed', 'theocratic-aligned', 'church-guided', 'commerce-driven', 'merchant-led', 'corruption-riddled', 'compromised'];
it('pdf power chapter', () => {
  const rows = zlib.gunzipSync(fs.readFileSync(process.env.CORPUS)).toString().trim().split('\n').map((l) => JSON.parse(l));
  const res = { towns: 0, withKey: 0, printsKey: 0, ex: [], stab: {} , errors: [] };
  for (const { seed, s } of rows) {
    const key = governingFactionOf(s)?.modifier || null;
    let leaves; try { leaves = collectText(PowerStructure({ settlement: s, vm: buildViewModel({ settlement: s }) })); } catch (e) { res.errors.push(`${seed}: ${e.message}`); continue; }
    res.towns++;
    const st = String(s.powerStructure?.stability || ''); const i = leaves.indexOf('STABILITY'); res.stab[seed] = i >= 0 ? leaves[i + 1] : null;
    if (!key) continue; res.withKey++;
    const hit = leaves.filter((t) => KEYS.includes(t.trim()));
    if (hit.length) { res.printsKey++; if (res.ex.length < 40) res.ex.push(`${seed}: GOVERNING leaf "${hit.join('|')}" beside "${leaves[leaves.indexOf('GOVERNING') + 1]}"`); }
  }
  fs.writeFileSync(process.env.OUTF, JSON.stringify(res, null, 1));
}, 1200000);
