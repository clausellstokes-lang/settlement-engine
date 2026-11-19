import fs from 'node:fs'; import zlib from 'node:zlib';
const [corpus,A,B]=process.argv.slice(2);
const da=(await import(A+'/src/components/new/economyDeskRead.js')).economyDeskRead, db=(await import(B+'/src/components/new/economyDeskRead.js')).economyDeskRead;
const { liveInstitutions } = await import(B+'/src/domain/institutions/institutionRoster.js');
const T={}; const newPartial=[]; const oldPartial=[];
for (const l of zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n')) { if(!l) continue; const {seed,s}=JSON.parse(l);
  const o={publicDossier:false,playerView:false,publicSite:'economy:resources',tier:s.tier};
  const a=da(s,o).exploitation, b=db(s,o).exploitation; const ka=a?.provenance?.poolKey||'none', kb=b?.provenance?.poolKey||'none';
  const k=`${ka.replace('EXPLOITATION: ','')} -> ${kb.replace('EXPLOITATION: ','')}`; T[k]=(T[k]||0)+1;
  const ro=liveInstitutions(s).map(i=>i.name).filter(n=>/weav|dye|full|tann|leather|cobbl|saw|carp|smelt|smith|glass|apoth|alchem|mason|potter|brick|jewel|gold|vint|mill/i.test(n)).join(', ');
  if(kb.includes('partially') && !ka.includes('partially')) newPartial.push(`${seed}: ${b.sentence} | exports: ${(s.economicState.primaryExports||[]).slice(0,4).join('; ')} | ${ro}`);
  if(ka.includes('partially')) oldPartial.push(`${seed}: ${a.sentence} | exports: ${(s.economicState.primaryExports||[]).slice(0,4).join('; ')} | ${ro}`);
}
console.log(T); console.log('NEW partial lines', newPartial.length); for(const x of newPartial.slice(0,6)) console.log(' ',x.slice(0,330));
console.log('OLD partial lines', oldPartial.length); const st=Math.max(1,Math.floor(oldPartial.length/8)); for(let i=0;i<oldPartial.length;i+=st) console.log(' ',oldPartial[i].slice(0,330));
