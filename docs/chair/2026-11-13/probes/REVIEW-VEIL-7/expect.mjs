// expect.mjs <expected.json> <outdir>      REVIEW-VEIL-7: the table of EXPECTED results over the hand towns' responses.
// For each check, on each share (default: veil, dm) and each read (default: gallery, link, import, client = the
// twin's projection), over <outdir>/rv7<town>-<share>-<read>.json:
//   absent   a needle that must not arrive in any KEY or string VALUE: as written, lower-cased, or squeezed (lower
//            case, every character that is not a letter or digit of any script removed). `at` / `notAt`: only hits
//            whose path matches / does not match; `unless`: a hit whose own text matches one of these is not one.
//   has / hasAll   exact strings that must still arrive (at a path matching `at`, if given).
//   eq / ne  paths whose value must / must not equal;  count: array lengths;  noNameless: every record of the list
//            has a string name.
// One line a check: PASS or FAIL, and for a FAIL the first hits. Exit 1 when any check fails.
import fs from 'node:fs';
const [file, out] = process.argv.slice(2);
const checks = JSON.parse(fs.readFileSync(file, 'utf8'));
const sq = (t) => String(t).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');
const get = (doc, path) => path.replace(/^\$\.?/, '').split('.').filter(Boolean).reduce((v, k) => (v == null ? undefined : v[k]), doc);
const leaves = (v, path, acc) => { if (typeof v === 'string') acc.push([path, v, 'value']);
  else if (Array.isArray(v)) v.forEach((x, i) => leaves(x, `${path}[${i}]`, acc));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) { acc.push([`${path}.${k}`, k, 'KEY']); leaves(x, `${path}.${k}`, acc); } return acc; };
let fails = 0; const rows = [];
for (const c of checks) {
  const bad = []; let seen = 0;
  for (const share of c.shares || ['veil', 'dm']) for (const read of c.reads || ['gallery', 'link', 'import', 'client']) {
    const f = `${out}/rv7${c.town}-${share}-${read}.json`; if (!fs.existsSync(f)) { bad.push(`${share}/${read}: no file`); continue; }
    const doc = JSON.parse(fs.readFileSync(f, 'utf8')); if (doc === null || doc.ERROR) { bad.push(`${share}/${read}: ${doc === null ? 'no row' : doc.ERROR.slice(0, 60)}`); continue; }
    seen += 1; const all = leaves(doc, '$', []); const tag = `${share}/${read}`;
    if (c.absent) for (const [p, t, kind] of all) {
      if (c.at && !new RegExp(c.at).test(p)) continue; if (c.notAt && new RegExp(c.notAt).test(p)) continue;
      const hit = t.includes(c.absent) || t.toLowerCase().includes(c.absent.toLowerCase()) || sq(t).includes(sq(c.absent));
      if (hit && !(c.unless || []).some(u => new RegExp(u, 'i').test(t))) bad.push(`${tag} ${kind} ${p.slice(-46)} = ${JSON.stringify(t.slice(0, 60))}`);
    }
    for (const want of [...(c.has ? [c.has] : []), ...(c.hasAll || [])]) if (!all.some(([p, t, kind]) => kind === 'value' && t === want && (!c.at || new RegExp(c.at).test(p)))) bad.push(`${tag} missing ${JSON.stringify(want)}`);
    for (const [p, v] of Object.entries(c.eq || {})) if (JSON.stringify(get(doc, p)) !== JSON.stringify(v)) bad.push(`${tag} ${p} is ${JSON.stringify(get(doc, p))}, want ${JSON.stringify(v)}`);
    for (const [p, v] of Object.entries(c.ne || {})) if (JSON.stringify(get(doc, p)) === JSON.stringify(v)) bad.push(`${tag} ${p} is ${JSON.stringify(v)}`);
    for (const [p, n] of Object.entries(c.count || {})) if ((get(doc, p) || []).length !== n) bad.push(`${tag} ${p} holds ${(get(doc, p) || []).length}, want ${n}`);
    if (c.noNameless) for (const r of get(doc, `$.${c.noNameless}`) || []) if (!r || typeof r.name !== 'string' || !r.name) bad.push(`${tag} a record with no name: ${JSON.stringify(r).slice(0, 60)}`);
  }
  if (bad.length) fails += 1;
  rows.push(`${bad.length ? 'FAIL' : 'PASS'} | ${c.id} | ${c.finding} | ${c.what}${bad.length ? `\n       ${bad.length} hit(s) in ${seen} responses; first: ${bad.slice(0, 3).join(' ;; ')}` : ''}`);
}
console.log(rows.join('\n')); console.log(`checks ${checks.length} | PASS ${checks.length - fails} | FAIL ${fails}`);
process.exit(fails ? 1 : 0);
