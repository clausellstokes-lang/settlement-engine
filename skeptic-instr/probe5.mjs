const D = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/skepINSTR';
const lex = await import(`${D}/src/domain/prose/entryLexicons.js`);
const C = await import(`${D}/tests/helpers/dossierCorpus.js`);
const leaves = await C.loadStateLeaves(), causal = await C.loadCausalLeaf(), crier = await C.loadCrierVoice(), gen = C.loadInFunctionNarratives();
const corpus = [...leaves, ...causal, ...crier, ...gen];
const BAND = [...lex.BAND_PHRASES, ...lex.AUTHORED_MAGNITUDES].slice().sort((a,b)=>b.length-a.length);
const maskBands = (t) => { let m = String(t).toLowerCase(); for (const p of BAND) m = m.split(p).join(' '.repeat(p.length)); return m; };
const holds = (h,n) => new RegExp(`(^|[^a-z])${n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}([^a-z]|$)`).test(h);
let entriesAffected = 0, occ = 0;
const examples = [];
for (const e of corpus) {
  const masked = maskBands(e.text);
  let hit = false;
  for (const q of lex.QUANTIFIERS) {
    if (!holds(masked, q)) continue;
    const at = masked.indexOf(q);
    // the word-boundary position of the first genuine occurrence
    const m = new RegExp(`(^|[^a-z])(${q})([^a-z]|$)`).exec(masked);
    const trueAt = m ? m.index + m[1].length : -1;
    if (at !== trueAt) { hit = true; occ++; if (examples.length < 6) examples.push(`${q} :: ${e.id} :: ${e.text.slice(0,100)}`); }
  }
  if (hit) entriesAffected++;
}
console.log('entries where at least one quantifier is mis-located by indexOf:', entriesAffected, '/', corpus.length);
console.log('mis-located quantifier occurrences:', occ);
for (const x of examples) console.log('  ', x);
