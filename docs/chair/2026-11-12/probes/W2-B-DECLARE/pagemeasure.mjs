// W2-B-DECLARE item 2 — the page measured by vocabulary over the census's rendered dossiers.
// TREE=<tree> OUT=<census out dir: corpus.ndjson.gz, dumps/> node pagemeasure.mjs <result.json>
import fs from 'node:fs'; import zlib from 'node:zlib'; import { createRequire } from 'node:module';
const TREE = process.env.TREE; const OUT = process.env.OUT;
const { vocabularyPageFindings } = await import(TREE + '/src/domain/coherence/vocabularyPageFindings.js');
const { REGISTERED_WORDS } = await import(TREE + '/src/domain/facts/registeredWords.js');
const require = createRequire(TREE + '/package.json'); const ts = require('typescript');

// ── the source index: every literal of three words or more under src, as a template ───────────
function listFiles(rel, out = []) {
  for (const e of fs.readdirSync(`${TREE}/${rel}`).sort()) {
    const p = `${rel}/${e}`; if (fs.statSync(`${TREE}/${p}`).isDirectory()) listFiles(p, out); else if (/\.(js|jsx|mjs)$/.test(e)) out.push(p);
  }
  return out;
}
const lits = [];
for (const rel of ['src/data', 'src/generators', 'src/domain', 'src/components'].flatMap((r) => listFiles(r))) {
  const sf = ts.createSourceFile(rel, fs.readFileSync(`${TREE}/${rel}`, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX);
  const inPool = (n) => { let c = n.parent; for (let d = 0; c && d < 4; d++, c = c.parent) if (ts.isArrayLiteralExpression(c)) return true; return false; };
  const visit = (n) => {
    let parts = null;
    if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) parts = [n.text];
    else if (ts.isTemplateExpression(n)) parts = [n.head.text, ...n.templateSpans.map((s) => s.literal.text)];
    else if (ts.isJsxText(n)) parts = [n.text.replace(/\s+/g, ' ').trim()];
    if (parts) {
      const frags = parts.flatMap((p) => p.split(/\{[a-zA-Z_]+\}/)).map((f) => f.trim()).filter(Boolean);
      const whole = parts.join(' ');
      if (whole.trim().split(/\s+/).length >= 3) {
        const longest = frags.reduce((a, b) => (b.length > a.length ? b : a), '');
        if (longest.length >= 10) lits.push({ file: rel, pool: inPool(n), frags, longest, text: whole.slice(0, 160) });
      }
      if (!ts.isTemplateExpression(n)) return;
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
}
const sourceOf = (lit) => {
  if (!lit) return 'unattributed';
  if (/dossierStateProse\/|dossierCausalProse\.generated/.test(lit.file)) return 'corpus pool';
  if (/^src\/(data|generators)\//.test(lit.file)) return lit.pool ? 'generator pool' : 'generator code';
  return 'written in code';
};
const attr = new Map();
function attribute(sentence) {
  if (attr.has(sentence)) return attr.get(sentence);
  let best = null;
  for (const l of lits) {
    if (!sentence.includes(l.longest) && !l.longest.includes(sentence)) continue;
    const covered = l.frags.filter((f) => sentence.includes(f)).reduce((a, f) => a + f.length, 0);
    if (!best || covered > best.covered) best = { lit: l, covered };
  }
  const r = best ? { source: sourceOf(best.lit), file: best.lit.file, lit: best.lit.text } : { source: 'unattributed', file: '', lit: '' };
  attr.set(sentence, r);
  return r;
}

// ── the corpus and its dumps ──────────────────────────────────────────────────────────────────
const corpus = zlib.gunzipSync(fs.readFileSync(`${OUT}/corpus.ndjson.gz`)).toString().trim().split('\n').map((l) => JSON.parse(l));
const views = (txt) => { const o = {}; let cur = '_'; for (const l of txt.split('\n')) { const m = l.match(/^== (.*) ==/); if (m) { cur = m[1]; o[cur] = []; continue; } if (l) (o[cur] ||= []).push(l); } return o; };
const findings = [];
let read = 0;
for (const { seed, s } of corpus) {
  let txt; try { txt = fs.readFileSync(`${OUT}/dumps/${seed}.txt`, 'utf8'); } catch { continue; }
  read++;
  for (const f of vocabularyPageFindings(s, views(txt))) {
    const a = attribute(f.quote);
    findings.push({ seed, size: seed.match(/(thorp|hamlet|village|town|city|metropolis)/)[1], arm: seed.startsWith('r2s-') ? 'crisis' : 'calm', ...f,
      kind: REGISTERED_WORDS[f.word].kind || 'thing', layer: REGISTERED_WORDS[f.word].layer || (f.word === 'guildhall' ? 'S' : 'P'), ...a });
  }
}
fs.writeFileSync(process.argv[2], JSON.stringify({ read, literals: lits.length, findings }));
const by = (k) => { const m = {}; for (const f of findings) m[f[k]] = (m[f[k]] || 0) + 1; return m; };
const towns = (fs2) => new Set(fs2.map((f) => f.seed)).size;
console.log('dossiers read', read, 'findings', findings.length, 'towns', towns(findings));
console.log('by source', by('source')); console.log('by layer', by('layer')); console.log('by kind', by('kind')); console.log('by side', by('side')); console.log('by word', by('word'));
