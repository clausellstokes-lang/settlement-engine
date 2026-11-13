// classesBD.mjs <censusOutDir> : the defence review's classes B and D (REVIEW-UPKEEP-2 classes.py, same regexes) on the census's own
// 720 pages and records. B: "has no line and no force" printed where a garrison, watch, militia or hired force stands.
// D: "would take real effort to threaten" / "does not spend much time thinking about being attacked" under a siege or a war.
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const D=process.argv[2]; const NOFORCE=/has no line and no force/; const THREAT=/would take real effort to threaten|does not spend much time thinking about being attacked/;
const rl=readline.createInterface({input:fs.createReadStream(`${D}/corpus.ndjson.gz`).pipe(zlib.createGunzip()),crlfDelay:Infinity});
const B=[],Dd=[]; let n=0;
for await (const line of rl){ const {seed,s}=JSON.parse(line); n++; const f=`${D}/dumps/${seed}.txt`; if(!fs.existsSync(f)) continue;
  const txt=fs.readFileSync(f,'utf8'); const def=(txt.split(/^== /m).find(v=>/^Systems\/Defense ==/.test(v))||'');
  const inst=s.economicState?.compound?.inst||{}; const di=s.defenseProfile?.institutions||{};
  const forces=!!(inst.hasGarrison||inst.hasWatch||inst.hasMilitia||(di.garrison||[]).length||(di.watch||[]).length||(di.militia||[]).length||(di.mercenary||[]).length);
  const st=(Array.isArray(s.stress)?s.stress:[s.stress]).filter(Boolean).map(x=>x.type);
  if(NOFORCE.test(def)&&forces) B.push(seed); if(THREAT.test(def)&&st.some(t=>t==='under_siege'||t==='wartime')) Dd.push(seed); }
console.log(JSON.stringify({towns:n,B:B.length,D:Dd.length,Bseeds:B.slice(0,12),Dseeds:Dd.slice(0,12)}));
