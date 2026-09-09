import fs from 'node:fs';
const OUT = process.env.K + '/sweep/R15-tail-classification.json';
const rows = JSON.parse(fs.readFileSync('final-rows.json','utf8'));
const KEY = {reader:'reader','dm-only':'dm_only',dev:'dev','ai-prompt':'ai_prompt',ambiguous:'ambiguous'};
// stable file order = descending row count, then path
const counts = {}; for(const r of rows) counts[r.file]=(counts[r.file]||0)+1;
const files = Object.keys(counts).sort((a,b)=> counts[b]-counts[a] || (a<b?-1:1));
const emitted = []; const perFile = {};
let checkpoints = 0;
function write(complete){
  const doc = {
    corpusSha: 'fd36f0298b1ead15f2a80eff83dafb92114a7ea4',
    corpusFile: 'scratchpad/runHEAD/corpus.json (md5 223df7caaeb79c43d10467c72898ec9f) — the brief\'s path prose-research/probe-all/corpus.json does not exist; this file is the fd36f0298 run and is byte-identical to prose-research/sweep/{bible-work,refute-extractors-work}/corpus.json and scratchpad/refute-tics/corpus.json',
    register: 'R15',
    rowsAtThisSha: 3894,
    rowsAtProbeSha: 3883,
    note: 'PROBE_ALL publishes R15 n=3883 at 6b80d1e8e; at fd36f0298 the register carries 3894 rows (+11), exactly the drift the refutation\'s P-9 records. Every figure here is the fd36f0298 figure.',
    classes: {
      reader: 'rendered to the player/DM on a product surface (JSX component or PDF section)',
      'dm-only': 'rendered only behind the DM-private gate — the keys PRIVATE_KEY_RE strips at src/domain/display/publicSafe.js:101 and the NPC goal/secret/plotHooks/relationships strip at :170; the owner can expose them with the shareDm opt-in (src/components/ShareToGallery.jsx:452)',
      dev: 'comments, validator/console strings, dev notes, provenance and coverage ledgers, design tokens, build/script-only text',
      'ai-prompt': 'text assembled into a model prompt and never rendered',
      ambiguous: 'consumer could not be traced in the tree at this sha (never guessed)'
    },
    evidenceGrades: {
      'render-site-read': 'the render/prompt/log line was opened and read',
      'family-trace': 'the module\'s own consumer chain was read to a named render site shared by the whole export family',
      'family-inference': 'the module was traced to a JSX/PDF ancestor and the leaf key is a display field, but this individual render line was not read',
      declaration: 'classified from the declaration site itself (a provenance/coverage/law/validator row)',
      reachability: 'classified from the import graph: the module is reachable from no product surface at this sha',
      untraced: 'no consumer found — these are the ambiguous rows'
    },
    complete,
    filesEmitted: emitted.length,
    filesTotal: files.length,
    perFile,
    rows: [],
  };
  const rr = [];
  for(const f of emitted) for(const r of rows) if(r.file===f) rr.push({
    file:r.file, line:r.line, lineFile:r.lineFile||undefined, text:r.text,
    class:r.class, consumerPath:r.consumerPath, evidence:r.evidence, note:r.note,
    export:r.export, leaf:r.leaf });
  doc.rows = rr;
  fs.writeFileSync(OUT, JSON.stringify(doc,null,1));
}
for(const f of files){
  emitted.push(f);
  const pf = {total:0, reader:0, dm_only:0, dev:0, ai_prompt:0, ambiguous:0};
  for(const r of rows) if(r.file===f){ pf.total++; pf[KEY[r.class]]++; }
  perFile[f]=pf;
  if(emitted.length % 20 === 0){ write(false); checkpoints++; }
}
write(true);
console.log('files', files.length, 'checkpoints written (complete:false)', checkpoints, '+ 1 final complete:true');
const doc=JSON.parse(fs.readFileSync(OUT,'utf8'));
console.log('final doc: complete=',doc.complete,'filesEmitted=',doc.filesEmitted,'rows=',doc.rows.length);
const t={reader:0,dm_only:0,dev:0,ai_prompt:0,ambiguous:0,total:0};
for(const v of Object.values(doc.perFile)) for(const k of Object.keys(t)) t[k]+=v[k];
console.log('perFile totals', JSON.stringify(t));
