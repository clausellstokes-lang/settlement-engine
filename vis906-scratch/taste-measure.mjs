// taste-measure.mjs — the chair's taste MEASUREMENT of the voiced Handbook essay vs the plain one, with the prose kit's own measure().
import { readFileSync } from 'node:fs';
import { measure } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/probe-all/metrics.mjs';
const D = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneLUIMAT';
function paras(src, startRe, endRe) {
  const lines = src.split('\n'); const i = lines.findIndex((l) => startRe.test(l)); const j = lines.findIndex((l, n) => n > i && endRe.test(l));
  const block = lines.slice(i, j).join('\n');
  // reader-facing text = JSX text nodes: strip tags/attrs, decode the two entities used, collapse whitespace
  const ps = [...block.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map((m) => m[1].replace(/<[^>]+>/g, '').replace(/&rsquo;/g, '’').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim());
  const title = (block.match(/marginBottom:\s*6[^>]*>\s*([\s\S]*?)\s*<\/div>/) || [])[1];
  return [title && title.replace(/\s+/g, ' ').trim(), ...ps].filter(Boolean);
}
const plainSrc = readFileSync(`${D}/src/components/HowToUse.jsx`, 'utf8');
const voicedSrc = readFileSync(`${D}/src/components/howto/HandbookVoiced.jsx`, 'utf8');
const plain = paras(plainSrc, /const conceptIntro = \(/, /^\s*\);\s*$/);
const voiced = paras(voicedSrc, /export function VoicedConceptIntro/, /^\}\s*$/);
const pick = (m) => ({ segments: m.segments, wps: m.wps, segsPerPara: m.segmentsPerVariant, one: m.oneSegment, two: m.twoSegments, threePlus: m.threePlusSegments, shapesRate: m.shapesRate, bibleHardRules: m.bibleHardRules, tellsRate: m.tellsRate, tells: m.tells, petRate: m.petRate, pet: m.pet, openers: m.topOpeners, closers: m.topClosers });
for (const [name, ps] of [['PLAIN (flag OFF)', plain], ['VOICED (flag ON, shipped)', voiced]]) {
  const rows = ps.map((text, i) => ({ text, pool: 'essay', file: name, id: i }));
  const m = measure(rows);
  console.log(`\n== ${name}: ${ps.length} paragraphs, ${ps.join(' ').split(/\s+/).length} words`);
  console.log(JSON.stringify(pick(m)));
  console.log('keys:', Object.keys(m).join(','));
}
console.log('\n-- voiced paragraphs (for the chair\'s read):'); voiced.forEach((p, i) => console.log(` [${i}] ${p}`));
