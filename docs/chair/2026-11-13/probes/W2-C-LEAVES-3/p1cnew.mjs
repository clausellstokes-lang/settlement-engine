import fs from 'node:fs'; import zlib from 'node:zlib';
const [corpus,B]=process.argv.slice(2);
const db=(await import(B+'/src/components/new/economyDeskRead.js')).economyDeskRead; const v=await import(B+'/src/domain/display/validationOnPage.js');
const { liveInstitutions } = await import(B+'/src/domain/institutions/institutionRoster.js'); const out=[];
for (const l of zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n')) { if(!l) continue; const {seed,s}=JSON.parse(l);
  const b=db(s,{publicDossier:false,playerView:false,publicSite:'economy:resources',tier:s.tier}).exploitation; if(!(b?.provenance?.poolKey||'').includes('partially')) continue;
  const row=v.exploitationForDesk(s).exploitation.partiallyExploited.slice().sort((a,c)=>String(a.rawResource)<String(c.rawResource)?-1:1)[0];
  out.push(`${seed}: "${b.sentence}" | ${row.rawResource}: still needed ${row.processingInstitutions.join('/')} | sold: ${(s.economicState.primaryExports||[]).join('; ').slice(0,90)} | houses ${liveInstitutions(s).map(i=>i.name).filter(n=>/weav|dye|full|tann|leather|cobbl|saw|carp|smelt|smith|glass|apoth|alchem|mason|potter|brick|jewel|gold|quarr|mine/i.test(n)).join(', ').slice(0,120)}`); }
console.log(out.length); const st=Math.floor(out.length/12); for(let i=1;i<out.length&&i<1+12*st;i+=st) console.log(out[i]);
