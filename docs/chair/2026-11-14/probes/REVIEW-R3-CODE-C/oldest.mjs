// oldest.mjs <births.gz> <dumpsdir> <phrase>: for each page sentence with the phrase, the named event's yearsAgo vs the oldest NPC's age (max of the age word)
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const [file, dir, phrase] = process.argv.slice(2);
const AGE={'early twenties':23,'mid-twenties':26,'late twenties':29,'early thirties':33,'mid-thirties':36,'late thirties':39,'early forties':43,'mid-forties':46,'late forties':49,'early fifties':53,'mid-fifties':56,'late fifties':59,'early sixties':63,'mid-sixties':66,'late sixties':69,'seventies':79};
const MIN={'early sixties':60,'mid-sixties':64,'late sixties':67,'seventies':70};
const rl=readline.createInterface({input:fs.createReadStream(file).pipe(zlib.createGunzip()),crlfDelay:Infinity});
let n=0,bad=0,badSure=0; const rows=[];
for await (const line of rl){ if(!line) continue; const {seed,s}=JSON.parse(line); const f=`${dir}/${seed}.txt`; if(!fs.existsSync(f)) continue; const txt=fs.readFileSync(f,'utf8');
  const sents=[...new Set(txt.split('\n').flatMap(l=>l.split(/(?<=[.;])\s+/)).filter(x=>x.includes(phrase)))]; if(!sents.length) continue;
  const ages=(s.npcs||[]).map(n=>[n.name,n.physical?.age]).filter(a=>AGE[a[1]]); const oldest=ages.sort((a,b)=>AGE[b[1]]-AGE[a[1]])[0]||['-','-'];
  for(const st of sents){ n++; const low=st.toLowerCase(); const evs=[...(s.history?.historicalEvents||[]),...(s.history?.currentTensions||[])].filter(e=>e.name&&low.includes(e.name.toLowerCase().replace(/^the /,''))); 
    const ya=evs.length? Math.min(...evs.map(e=>+e.yearsAgo||0)) : (low.includes(' is older than anyone living')? +s.history?.age : null);
    const oa=AGE[oldest[1]]||0, om=MIN[oldest[1]]||0; const flag = ya!==null && ya<=oa; const sure = ya!==null && ya<=om;
    if(flag) bad++; if(sure) badSure++; rows.push([seed,s.tier,s.population,ya,oldest.join(':'),flag?'WITHIN-LIFE':'ok',sure?'SURE':'',st.slice(0,150)].join('\t')); } }
console.log('sentences',n,'within an NPC\'s possible life',bad,'surely within',badSure); fs.writeFileSync(process.env.OUT||'/dev/stdout', rows.join('\n')+'\n');
