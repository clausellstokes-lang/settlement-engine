// READ-ONLY measurement. No writes to the dock. No test workers.
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { readFileSync } from 'node:fs';

const DOCK = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/58f0a8e2-2c4f-4073-8635-ecc7cf5010f6/scratchpad/laneKERNELMARK-tree';
const req = createRequire(DOCK + '/package.json');

// The shipped sanitiser, imported from its own file (not retyped).
const { sanitizeJsPdfText } = await import(pathToFileURL(DOCK + '/src/utils/jsPdfText.js'));

// jsPDF's own runtime WinAnsiEncoding map — same access path as the generator.
const jspdfMod = await import(pathToFileURL(req.resolve('jspdf')));
const jsPDF = jspdfMod.jsPDF || jspdfMod.default?.jsPDF || jspdfMod.default;
const winAnsi = new jsPDF().getFont().metadata?.Unicode?.encoding?.WinAnsiEncoding;
if (!winAnsi || Object.keys(winAnsi).length === 0) throw new Error('no WinAnsiEncoding map');

const encodable = new Set();
for (let cp = 0x20; cp <= 0x7e; cp += 1) encodable.add(cp);
for (let cp = 0xa0; cp <= 0xff; cp += 1) encodable.add(cp);
for (const key of Object.keys(winAnsi)) encodable.add(Number(key));

const passes = (cp) => {
  const anchored = `a${String.fromCodePoint(cp)}a`;
  return sanitizeJsPdfText(anchored) === anchored;
};
const textPass = new Set([...encodable].filter(passes));

const strippedButEncodable = [...encodable].filter((cp) => !textPass.has(cp)).sort((a, b) => a - b);
const winAnsiOnly = Object.keys(winAnsi).map(Number).sort((a,b)=>a-b);

const U = (cp) => 'U+' + cp.toString(16).toUpperCase().padStart(4, '0');

console.log('## jsPDF version:', req('jspdf/package.json').version);
console.log('## WinAnsiEncoding map size:', Object.keys(winAnsi).length);
console.log('## winAnsi key range:', U(winAnsiOnly[0]), '..', U(winAnsiOnly[winAnsiOnly.length-1]));
console.log('## encodable size:', encodable.size, ' textPass size:', textPass.size);
console.log('## STRIPPED-BUT-ENCODABLE count:', strippedButEncodable.length);
for (const cp of strippedButEncodable) {
  console.log('   ', U(cp), JSON.stringify(String.fromCodePoint(cp)), '| inWinAnsiMap=' + Object.prototype.hasOwnProperty.call(winAnsi, String(cp)));
}

// Full WinAnsi map dump (codepoint -> byte) for the record
console.log('## FULL WINANSI EXTRA MAP (cp -> byte):');
for (const cp of winAnsiOnly) {
  console.log('   ', U(cp), JSON.stringify(String.fromCodePoint(cp)), '-> 0x' + Number(winAnsi[String(cp)]).toString(16).toUpperCase());
}

// --- dossier-pdf: fontkit intersection over theme.js's registered faces ---
const themeSrc = readFileSync(DOCK + '/src/pdf/theme.js', 'utf8');
const stripped = themeSrc.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/[^\n]*/g, '$1');
const faces = [...stripped.matchAll(/src:\s*'(\/fonts\/[^'?]+\.ttf)(?:\?[^']*)?'/g)].map((m) => m[1]);
const fontkit = await import(pathToFileURL(req.resolve('fontkit')));
const fk = fontkit.default || fontkit;
let dossier = null;
for (const face of faces) {
  const p = DOCK + '/public' + face;
  const set = new Set(fk.openSync(p).characterSet);
  dossier = dossier === null ? set : new Set([...dossier].filter((cp) => set.has(cp)));
}
console.log('## faces:', faces.length, faces.join(','));
console.log('## dossier intersection size:', dossier.size);

// Which of the stripped-but-encodable also draw on the dossier?
console.log('## of the stripped set, drawable by dossier fonts too:',
  strippedButEncodable.filter((cp) => dossier.has(cp)).map(U).join(' '));

// Name probes
const NAMES = ['Uroš','Hadžić','Zoë','Björn','Łukasz','Ægir','Nguyễn','Müller','Çelik','Šimon','Æthelred','Þórunn','Renée','Søren','Krzysztof','Ana Ćurić','Dvořák','Székely'];
console.log('## NAME PROBES (jsPDF surfaces: campaign PDF + World Book)');
for (const n of NAMES) {
  const out = sanitizeJsPdfText(n);
  const dossierBad = [...n].filter((ch) => !dossier.has(ch.codePointAt(0))).map((ch)=>U(ch.codePointAt(0)));
  console.log('   ', JSON.stringify(n), '->', JSON.stringify(out), out === n ? '(intact)' : '(MANGLED)',
    '| dossier-undrawable:', dossierBad.length ? dossierBad.join(',') : 'none');
}
