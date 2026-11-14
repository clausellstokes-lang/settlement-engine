// barcheck.mjs TREE IN DESK: towns whose posture line is from the strong pool while the Invasion & War bar (scoreBand of
// scores.military) reads WEAK or CRITICAL; and weak/critical posture lines beside a STRONG bar; by crisis.
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const { scoreBand } = await import(process.env.TREE+'/src/domain/display/defenseScoreBands.js');
const D=new Map(fs.readFileSync(process.env.DESK,'utf8').trim().split('\n').map(JSON.parse).map(o=>[o.seed,o]));
const rl=readline.createInterface({input:fs.createReadStream(process.env.IN).pipe(zlib.createGunzip()),crlfDelay:Infinity});
const STRONG=/reads as a defended place|What .* can field and what|does not spend much time thinking about being attacked|Nothing presses/;
const WEAKL=/could not hold off a raid|perimeter has nobody|struggle to hold|all but undefended|could not survive a serious attack|without being stopped/;
const a=[],b=[];
for await (const l of rl){ const {seed,s}=JSON.parse(l); const p=D.get(seed)?.lines?.['posture.posture']?.sentence||''; const band=scoreBand(s.defenseProfile?.scores?.military);
  const st=(Array.isArray(s.stress)?s.stress:s.stress?[s.stress]:[]).map(x=>x.type).join('+')||'calm';
  if(STRONG.test(p)&&(band==='WEAK'||band==='CRITICAL')) a.push(`${seed} ${st} mil ${Math.round(s.defenseProfile.scores.military)} ${band} badge ${s.defenseProfile.readiness.label}: ${p.slice(0,90)}`);
  if(WEAKL.test(p)&&band==='STRONG') b.push(seed); }
console.log('strong posture beside a WEAK/CRITICAL bar:',a.length); a.forEach(x=>console.log('  '+x)); console.log('weak posture beside a STRONG bar:',b.length,b.slice(0,5).join(' '));
