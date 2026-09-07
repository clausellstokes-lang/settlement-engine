// check-pair.mjs <dock> <pairs.json> — the MECHANICAL half of taste-sample verification, executed not eyeballed.
// Loads the generated leaves as modules (pure data), so marks/angles/slots are read from the objects, never regexed.
// v2 (lane S12A-CHECKPAIR, 2026-09-06): closes the two gaps the illustration refuter measured —
//   (1) R4-BAND, a WITHHELD verdict class for a contrast cut in a pool that has sibling bands (A8's band half);
//   (2) A11, the pool-spread arm (sentence-count spread + two-word openers), measured with the pool's OTHER variants.
// R2 (chair ruling 2026-09-06 14:50, applied by lane S12A-R2): MARKS moved from the FAIL channel to the NOTE
//   channel — a mark is a property the AFTER inherits, not a defect of the pair. 654 of 2,734 variants (23.9%)
//   carry a mark and only 89 of those are `dm-only`; the rest are role labels. The dm-only sentence about the
//   audience law is kept verbatim, now as a NOTE. Nothing else moved; the arm never enters the fail list again.
import { readdirSync } from 'node:fs'; import { readFileSync } from 'node:fs'; import path from 'node:path'; import { pathToFileURL } from 'node:url';
const [,, D, PAIRS] = process.argv;
const corpus = [];
const pools = new Map();          // poolId -> { key, block, file, texts[], angles[] }
const blockIndex = new Map();     // "file::block" -> [corpus entries]
const addPool = (poolId, key, block, file) => { if (!pools.has(poolId)) pools.set(poolId, { key, block, file, texts: [], angles: [] }); return pools.get(poolId); };
const gdir = path.join(D, 'src/data/dossierStateProse');
for (const f of readdirSync(gdir).filter(f => f.endsWith('.generated.js'))) {
  const mod = await import(pathToFileURL(path.join(gdir, f)).href); const table = Object.values(mod)[0];
  for (const [block, b] of Object.entries(table)) for (const [pool, vs] of Object.entries(b.pools || {})) for (const v of vs) {
    const poolId = `${f}::${block}::${pool}`; const P = addPool(poolId, pool, block, f);
    const idx = P.texts.length; P.texts.push(v.text); P.angles.push(v.angle || '');
    const e = { text: v.text, block, pool, poolId, idx, angle: v.angle || '', marks: v.marks || [], file: f, siblings: Object.keys(b.pools).filter(k => k !== pool) };
    corpus.push(e); const bk = `${f}::${block}`; if (!blockIndex.has(bk)) blockIndex.set(bk, []); blockIndex.get(bk).push(e);
  }
}
{ const mod = await import(pathToFileURL(path.join(D, 'src/data/dossierCausalProse.generated.js')).href); const table = Object.values(mod)[0];
  let causalPool = 0;
  const walk = (o, key) => { if (Array.isArray(o)) { const poolId = `causal::${key}::${causalPool++}`; const P = addPool(poolId, key, 'CAUSAL', 'causal');
      for (const v of o) if (v && typeof v.text === 'string') { const idx = P.texts.length; P.texts.push(v.text); P.angles.push(v.angle || '');
        const e = { text: v.text, block: 'CAUSAL', pool: key, poolId, idx, angle: v.angle || '', marks: v.marks || [], file: 'causal', siblings: [] };
        corpus.push(e); const bk = `causal::CAUSAL`; if (!blockIndex.has(bk)) blockIndex.set(bk, []); blockIndex.get(bk).push(e); } }
    else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) walk(v, k); };
  walk(table, 'CAUSAL'); }
const slots = s => new Set([...s.matchAll(/\{([a-z_0-9]+)\}/g)].map(m => m[1]));
const words = s => s.trim().split(/\s+/).filter(Boolean).length;
// §0d's six-band vocabulary + the general time words: any of these ADDED by a rewrite is a duration claim the pool key may not license (T5)
const DURATION = /\b(this season|within the year|years on|years old|a decade|a generation|older than its bearers|year|years|season|seasons|winter|winters|generation|generations|lifetime|decade|decades|month|months|week|weeks|day|days|ago|since|every|always|never|long|recent|lately|now|yet|still|already)\b/gi;
// §0d QUANTITY_BANDS + the authored magnitude words + the count NOUNS (a moved noun moves the band: souls → households)
const COUNT = /\b(nobody|no one|a few souls|a few|a dozen or so|a dozen|dozens|a hundred or so|a hundred|several hundred|many hundreds|hundreds|thousands|a handful|a score|scores|most|all but|half|all|none|many|several|some|souls|people|households|families|hands|mouths|heads)\b/gi;
const lower = s => s.toLowerCase();
const setOf = (s, re) => new Set((lower(s).match(re) || []).map(x => x.toLowerCase()));
// ── the sentence counter (U2's ceiling AND A11's spread read it) ────────────────────────────────
const sentences = t => t.replace(/\{[a-z_0-9]+\}/g, 'X').split(/(?<=[.?!])\s+(?=[A-Z"'(])/).filter(Boolean).length;
// ── A11's opener: the first two words, slots normalised to a single token ───────────────────────
const opener = t => t.replace(/\{[a-z_0-9]+\}/g, '{}').trim().split(/\s+/).slice(0, 2)
  .map(w => w.toLowerCase().replace(/^[^a-z{]+|[^a-z}]+$/g, '')).filter(Boolean).join(' ');
// ── A8's band half: the AXIS of a pool key, derived from the measured key grammar ───────────────
// 708 keys over 68 blocks fall in three shapes: colon form "<AXIS>: <band>" (346), axis-run
// "<lowercase axis word(s)> <BAND token(s)>" (209: `readiness STRONG`, `terrain FAVOURABLE to the
// defender`, `strategic value HIGH`), and a bare band label with no axis at all (153: `Very Safe`,
// `SUBSISTENCE`, `WALLED-QUIET`) — a bare-label block IS one band ladder, so every sibling is a band.
const axisOf = k => { const i = k.indexOf(':'); if (i > 0) return k.slice(0, i).trim().toLowerCase();
  const w = k.split(/\s+/); if (!w.length) return '';
  if (w.every(x => /^[a-z][a-z0-9_'’-]*$/.test(x))) return w[0].toLowerCase();   // all-lowercase key: the axis is the first word (`band surplus`, `capture none`)
  const run = []; for (const x of w) { if (/^[a-z][a-z0-9_'’-]*$/.test(x)) run.push(x); else break; }
  return run.join(' ').toLowerCase(); };                                          // '' when the key opens on a capital: no derivable axis
const bandSiblingsOf = h => { if (!h.siblings.length) return []; const a = axisOf(h.pool);
  const same = a ? h.siblings.filter(k => axisOf(k) === a) : [];
  return same.length ? same : h.siblings; };   // tight same-axis set where the grammar gives one; else A8's letter — every band of the same block
const CONTRAST = /\brather than\b|\bnot [^.,;]{1,40}, but\b|\bnot [^.,;]{1,40} but\b|, not [a-z][^.,;]{0,40}[.;]|\bnot [^.,;]{1,30}, (it|this|that) is\b|\bless [^.,;]{1,30} than\b/g;
const ALT_STOP = new Set(['that','this','with','from','have','been','being','than','then','they','them','their','there','here','what','when','what','which','would','could','should','about','into','over','rather','anything','something','nothing','everything','more','most','much','only','also','just','such','other','same','town','settlement','place','thing','things']);
const pairs = JSON.parse(readFileSync(PAIRS, 'utf8')); let fails = 0, withheldN = 0;
for (const p of pairs) {
  const hits = corpus.filter(c => c.text === p.before); const r = []; const notes = []; const withheld = []; const h = hits[0];
  if (!h) r.push('NOT LOCATED in the dossier corpus (state+causal)');
  if (h && h.marks.length) notes.push('MARKS ' + JSON.stringify(h.marks) + (h.marks.includes('dm-only') ? ' — dm-only: the AFTER inherits the mark and the audience law' : ''));
  const sb = slots(p.before), sa = slots(p.after);
  if ([...sb].some(x => !sa.has(x)) || [...sa].some(x => !sb.has(x))) r.push(`SLOTS differ: before {${[...sb]}} after {${[...sa]}}`);
  if (/\d/.test(p.after)) r.push('DIGIT in AFTER'); if (/\d+\s*%|percent/i.test(p.after)) r.push('PERCENT in AFTER (§0d: proportions in words)'); if (/—/.test(p.after)) r.push('EM DASH in AFTER'); if (/!/.test(p.after)) r.push('EXCLAMATION in AFTER');
  if (words(p.after) > words(p.before)) r.push(`LONGER: ${words(p.before)} → ${words(p.after)} words`);
  const dB = setOf(p.before, DURATION), dA = setOf(p.after, DURATION); const addedDur = [...dA].filter(w => !dB.has(w)); if (addedDur.length) r.push('DURATION/TIME words ADDED: ' + addedDur.join(', '));
  const cB = setOf(p.before, COUNT), cA = setOf(p.after, COUNT); const addedC = [...cA].filter(w => !cB.has(w)), lostC = [...cB].filter(w => !cA.has(w));
  if (addedC.length) r.push('COUNT words ADDED: ' + addedC.join(', ')); if (lostC.length) r.push('COUNT words LOST (band noun moved?): ' + lostC.join(', '));
  if (h && h.siblings.length) { const sibWords = new Set(h.siblings.flatMap(k => lower(k).replace(/[^a-z ]/g, ' ').split(/\s+/)).filter(w => w.length > 3 && !['quantity','candidate','kind'].includes(w)));
    const cut = [...new Set(lower(p.before).replace(/[^a-z ]/g, ' ').split(/\s+/))].filter(w => sibWords.has(w) && !lower(p.after).includes(w));
    if (cut.length) r.push('R4: CUT a word that names a SIBLING pool key: ' + cut.join(', ') + '  (siblings: ' + h.siblings.slice(0, 6).join(' | ') + ')'); }
  // U2: the two-sentence ceiling (house rate 11 of 2,734 three-sentence variants)
  if (sentences(p.after) > 2) r.push(`THREE+ SENTENCES (${sentences(p.after)}) — the register is one flowing sentence or two short ones`);
  // U3: the pet-word ration is a per-variant NET test at the point of edit
  const RATION = [/\brather than\b/g, /\bwhich (is|means)\b/g, /\b(nobody|no one|nothing)\b/g, /\bits own\b/g, /\bwhatever\b/g, /\benough (to|that)\b/g, /\b(kind|sort) of\b/g, /\bquiet(ly)?\b/g, /\b(still|yet|already)\b/g];
  for (const re of RATION) { const b = (lower(p.before).match(re) || []).length, a = (lower(p.after).match(re) || []).length; if (a > b) r.push(`RATIONED WORD ADDED: ${re.source} ${b} → ${a}`); }
  // U4: count the antithesis SHAPE, not the phrase
  const shape = t => (lower(t).match(CONTRAST) || []).length;
  const shapeB = shape(p.before), shapeA = shape(p.after);
  if (shapeA > shapeB) r.push(`ANTITHESIS SHAPE ADDED: ${shapeB} → ${shapeA}`);
  const shapeNote = shapeB > 0 && shapeA === shapeB && /rather than/.test(lower(p.before)) && !/rather than/.test(lower(p.after));
  if (shapeNote) r.push('NOTE: "rather than" removed but the antithesis SHAPE survives (a column moved, not the failure mode)');
  // ── GAP 1 · A8's BAND HALF (R4-BAND). The checker cannot judge whether the rejected alternative
  // names what a sibling BAND supplies — that is semantics — so where a contrast is CUT in a pool
  // that has sibling bands it does not pass silently: the mechanical PASS is WITHHELD for the refuter.
  const contrastCut = shapeB > shapeA || shapeNote;
  if (h && contrastCut) {
    const bands = bandSiblingsOf(h);
    if (!bands.length) notes.push('R4-BAND n/a: the located pool has NO sibling bands — a contrast may be cut here (A8)');
    else if (p.contrastWaived) notes.push('CONTRAST WAIVED by the refuter: ' + p.contrastWaived + `  (sibling bands: ${bands.slice(0, 4).join(' | ')})`);
    else { withheld.push(`R4-BAND: a contrast was cut in a pool with sibling bands ${bands.map(k => '"' + k + '"').join(' | ')}; the band half is the refuter's — mechanical PASS withheld`);
      // second line, diagnostic only (it never moves a verdict): does the CUT alternative share a content
      // word with a sibling-band variant's TEXT? that is the one reach the v1 key-grep does not have.
      const alts = []; const src = lower(p.before);
      for (const m of src.matchAll(CONTRAST)) { const tail = src.slice(m.index, m.index + m[0].length + 60); const stop = tail.search(/[.;,](?!\d)/); alts.push(stop > m[0].length ? tail.slice(0, stop) : tail); }
      const altWords = [...new Set(alts.join(' ').replace(/[^a-z ]/g, ' ').split(/\s+/))].filter(w => w.length >= 4 && !ALT_STOP.has(w) && !lower(p.after).includes(w));
      // A8's letter is "a sibling band of the same BLOCK", so the TEXT scan takes every sibling pool, not only the tight same-axis set named in the refusal above.
      const sibVariants = (blockIndex.get(`${h.file}::${h.block}`) || []).filter(e => h.siblings.includes(e.pool));
      const touch = []; for (const e of sibVariants) { const hit = altWords.filter(w => new RegExp('\\b' + w + '\\b').test(lower(e.text))); if (hit.length) touch.push(`"${e.pool}" [${e.angle}] shares ${hit.join(', ')}`); }
      if (touch.length) withheld.push('  R4-BAND-TEXT: the cut alternative names a word of a sibling band\'s own TEXT — ' + touch.slice(0, 3).join(' ; '));
    }
  }
  // ── GAP 2 · A11 POOL SPREAD, measured at the edit against the pool's OTHER variants ────────────
  if (h) { const P = pools.get(h.poolId); const afterTexts = P.texts.map((t, i) => i === h.idx ? p.after : t);
    const sBefore = P.texts.map(sentences), sAfter = afterTexts.map(sentences);
    const eq = a => a.every(x => x === a[0]);
    notes.push(`A11 SPREAD (sentences, pool "${P.key}" ${P.block}, angles ${P.angles.map(a => a || '-').join('/')}): ${sBefore.join('/')} → ${sAfter.join('/')}`);
    if (P.texts.length > 1 && !eq(sBefore) && eq(sAfter)) r.push(`A11 POOL SPREAD FLATTENED: ${sBefore.join('/')} → ${sAfter.join('/')} — every variant of the pool now has the same sentence count where they differed`);
    const oBefore = P.texts.map(opener), oAfter = afterTexts.map(opener);
    const dup = list => { const seen = new Map(); for (let i = 0; i < list.length; i++) { if (!seen.has(list[i])) seen.set(list[i], []); seen.get(list[i]).push(i); } return [...seen.entries()].filter(([, ix]) => ix.length > 1); };
    const dB2 = dup(oBefore), dA2 = dup(oAfter);
    const preexisting = dB2.map(([o, ix]) => `"${o}" (${ix.map(i => P.angles[i] || '#' + i).join(' + ')})`);
    if (preexisting.length) notes.push('A11 PRE-EXISTING shared opener in this pool (a debt this pair neither causes nor cures): ' + preexisting.join(' ; '));
    const newDup = dA2.filter(([o, ix]) => ix.includes(h.idx) && !dB2.some(([o2, ix2]) => o2 === o && ix2.includes(h.idx)));
    for (const [o, ix] of newDup) r.push(`A11 SHARED OPENER CREATED: the AFTER now opens "${o}", matching ${ix.filter(i => i !== h.idx).map(i => P.angles[i] || '#' + i).join(' + ')} in the same pool (the BEFORE opened "${oBefore[h.idx]}")`);
  }
  // U7: a bare future indicative is a FATE breach; the [threshold] edge is subjunctive
  if (/\b(will|shall)\b/.test(lower(p.after)) && !/\b(will|shall)\b/.test(lower(p.before))) r.push('FUTURE INDICATIVE ADDED (STATE never FATE)');
  if (/\bwould\b/.test(lower(p.before)) && !/\bwould\b/.test(lower(p.after))) r.push('SUBJUNCTIVE "would" REMOVED — a [threshold] edge may have become a forecast');
  // B0.3 / B0.7: an existential opener or a pronoun closer ADDED by a rewrite is a step away from every exemplar column
  const exist = t => (t.match(/(^|[.?!]\s+)(There|It) (is|was|are|were)\b/g) || []).length;
  if (exist(p.after) > exist(p.before)) r.push('EXISTENTIAL OPENER ADDED ("There is / It is")');
  const lastWord = t => (t.trim().replace(/[.?!]+$/, '').split(/\s+/).pop() || '').toLowerCase();
  if (/^(it|them|there|this|that|one)$/.test(lastWord(p.after)) && !/^(it|them|there|this|that|one)$/.test(lastWord(p.before))) r.push('PRONOUN CLOSER ADDED (land on the civic noun)');
  const verdict = r.length ? 'FAIL' : (withheld.length ? 'WITHHELD(R4-BAND)' : 'PASS(mechanical)');
  if (r.length) fails++; else if (withheld.length) withheldN++;
  console.log(`#${p.id} ${verdict} ${h ? h.block + ' :: ' + h.pool + (h.angle ? ' [' + h.angle + ']' : '') : ''}`);
  for (const x of r) console.log('    - ' + x); for (const x of withheld) console.log('    ! ' + x); for (const x of notes) console.log('    · ' + x);
}
const passes = pairs.length - fails - withheldN;
console.log(`\ncorpus loaded: ${corpus.length} variants in ${pools.size} pools; ${passes} pass mechanically, ${withheldN} WITHHELD (R4-BAND — the band half is the refuter's, not a FAIL), ${fails} fail (a mechanical pass is NOT a claim-preservation verdict — that is the refuter's job)`);
