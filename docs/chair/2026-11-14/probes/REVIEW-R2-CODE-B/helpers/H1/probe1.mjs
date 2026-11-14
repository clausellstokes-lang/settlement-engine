// probe1: record shapes for food + stress + seat
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const file=process.argv[2]; const rl=readline.createInterface({input:fs.createReadStream(file).pipe(zlib.createGunzip()),crlfDelay:Infinity});
let i=0; for await (const line of rl){ const {seed,s}=JSON.parse(line); if(i++>0) break;
 console.log(seed, s.tier, s.population, Object.keys(s).join(','));
 console.log(JSON.stringify(s.economicState.foodSecurity).slice(0,1500));
 console.log(JSON.stringify(s.stress)?.slice(0,600)); console.log(JSON.stringify(s.stressors)?.slice(0,300));
 console.log(JSON.stringify(s.culturalIdentity)?.slice(0,300)); console.log(JSON.stringify(s.config)?.slice(0,800));
}
