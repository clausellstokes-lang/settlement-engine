const D = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/skepINSTR';
const lex = await import(`${D}/src/domain/prose/entryLexicons.js`);
const W = await import(`${D}/src/domain/prose/entryWalker.js`);
const C = await import(`${D}/tests/helpers/dossierCorpus.js`);
const corpus = [...await C.loadStateLeaves(), ...await C.loadCausalLeaf(), ...await C.loadCrierVoice(), ...C.loadInFunctionNarratives()];
const BAND = [...lex.BAND_PHRASES, ...lex.AUTHORED_MAGNITUDES].slice().sort((a,b)=>b.length-a.length);
const maskBands = (t) => { let m = String(t).toLowerCase(); for (const p of BAND) m = m.split(p).join(' '.repeat(p.length)); return m; };
const holds = (h,n) => new RegExp(`(^|[^a-z])${n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}([^a-z]|$)`).test(h);
// replicate armC4's quantifier limb, but at the WORD-BOUNDARY index, and count would-be fails
let shipped=0, corrected=0; const gained=[];
for (const e of corpus) {
  const masked = maskBands(e.text);
  for (const q of lex.QUANTIFIERS) {
    if (!holds(masked, q)) continue;
    const evalAt = (at) => {
      const tail = masked.slice(at + q.length, at + q.length + 40);
      const next = (tail.match(/[a-z']+/g) || []).slice(0,2);
      const noun = next.find((w,i) => w!=='one' ? Boolean(W.columnOfNoun(w)) : (i===0 && (q==='every'||q==='each'))) || '';
      return W.columnOfNoun(noun);
    };
    const at = masked.indexOf(q);
    const m = new RegExp(`(^|[^a-z])(${q})([^a-z]|$)`).exec(masked);
    const trueAt = m ? m.index + m[1].length : -1;
    const colShipped = evalAt(at), colTrue = evalAt(trueAt);
    if (colShipped) shipped++;
    if (colTrue) corrected++;
    if (!colShipped && colTrue) gained.push(`${q} → ${colTrue} :: ${e.id} :: ${e.text.slice(0,110)}`);
  }
}
console.log('quantifier occurrences resolving to a column — shipped indexOf:', shipped, '| word-boundary:', corrected);
console.log('MISSED totality findings (would FAIL on an open column):', gained.length);
for (const g of gained) console.log('  ', g);
