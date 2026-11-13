// ROUND-3-CUT step 3: one writer (file :: function) per HIGH/MED line, at the line's tip. Order of evidence:
// (1) a traced composed form (trace-forms.out.json: the surface that prints the row) when the line's signature is one;
// (2) a catalogue house name printed raw -> the surface's writer for that tab's form, never the catalogue;
// (3) a fixed run found by git grep -F at the line's tip (attrib.mjs); (4) the reader's own source, where that file
// exists at the line's tip (function found at its line number: PLAUSIBLE, the line may have moved).
// node writers.mjs <tree> <cold.json> <attrib.json> <trace-forms.json> <trace-forms.out.json> <out.json>
import fs from 'node:fs';
const [TREE,cf,af,tf,tof,out]=process.argv.slice(2);
const C=Object.fromEntries(JSON.parse(fs.readFileSync(cf,'utf8')).map(r=>[r.n,r])); const A=JSON.parse(fs.readFileSync(af,'utf8'));
const TF=JSON.parse(fs.readFileSync(tf,'utf8')); const TO=Object.fromEntries(JSON.parse(fs.readFileSync(tof,'utf8')).map(t=>[t.id,t]));
const sig=(r)=>r.tab+" :: "+r.sentence.replace(/[A-Z][\w'’ -]*\((?:[\d,]+[-–][\d,]+\+?|multiple|if walled)[^)]*\)/g,"<HOUSE>").replace(/(member|first|second|third|fourth|head) of [A-Z][\w ]+/g,"$1 of <F>").replace(/held by [A-Z][\w ]+/,"held by <P>").replace(/[+-]?\d+/g,"#").slice(0,70);
const bySig={}; for(const t of TF) bySig[t.signature]=TO[t.id];
// the surface writers for a raw house name, by tab, taken from the traced forms
const surf={}; for(const t of TF){ const o=TO[t.id]; if(/<HOUSE>/.test(t.signature)&&o) surf[t.signature.split(' :: ')[0]] ??= o; }
const HOUSE=/[A-Z][\w'’ -]*\((?:[\d,]+[-–][\d,]+\+?|multiple|if walled|[\d,]+\+ households|[\d,]+[-–][\d,]+ households|high magic|district)\)/;
const lines=(f)=>{ try{ return fs.readFileSync(`${TREE}/${f}`,'utf8').split('\n'); }catch{ return null; } };
const DEF=[/^\s*(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)/, /^\s*(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/, /^\s{0,4}([A-Za-z_$][\w$]*)\s*\([^)]*\)\s*\{\s*$/, /^\s{0,4}['"]?([A-Za-z_$][\w$-]*)['"]?\s*:\s*[\[{(]/];
const encl=(L,ln)=>{ for(let i=Math.min(ln,L.length)-1;i>=0;i--){ const l=L[i]; if(/^\s*(\/\/|\*|\/\*)/.test(l)) continue; for(const re of DEF){ const m=l.match(re); if(m&&l.match(/^\s*/)[0].length<=4) return m[1]; } } return ''; };
const res=[];
for(const a of A){ const r=C[a.n]; const s=sig(r); let w=null;
  if(bySig[s]) w={file:bySig[s].writerFile,fn:bySig[s].writerFn,words:bySig[s].wordsFile||'',how:bySig[s].how,evidence:'traced form'};
  else if(HOUSE.test(r.sentence)&&(!a.file||/institutionalCatalog/.test(a.file))&&surf[r.tab]) w={file:surf[r.tab].writerFile,fn:surf[r.tab].writerFn,words:'src/data/institutionalCatalog.js',how:'prints a catalogue house name raw (its count range or tag kept)',evidence:'traced form (the tab\'s raw-name writer)'};
  else if(a.file) w={file:a.file,fn:a.fn,line:a.line,run:a.run,evidence:'git grep -F at the line tip'};
  else if(a.readerSource){ const m=a.readerSource.match(/^(src\/[^\s:]+)(?::(\d+))?/); const L=m&&lines(m[1]); if(L) w={file:m[1],fn:m[2]?encl(L,+m[2]):'',line:m[2]?+m[2]:0,evidence:'the reader\'s source (file present at the line tip; function PLAUSIBLE)'}; }
  res.push({n:a.n,severity:r.severity,tab:r.tab,writer:w}); }
fs.writeFileSync(out,JSON.stringify(res,null,1));
const none=res.filter(x=>!x.writer); console.log('HM',res.length,'with a writer',res.length-none.length,'none',none.length);
const ev={}; for(const x of res) if(x.writer) ev[x.writer.evidence]=(ev[x.writer.evidence]||0)+1; console.log(ev);
for(const x of none) console.log('  #'+x.n,x.severity[0],x.tab,'|',C[x.n].sentence.slice(0,90),'| src:',C[x.n].source.slice(0,50));
