const {facts,page}=require('./facts.js');const fs=require('fs');
const L=JSON.parse(fs.readFileSync(process.argv[2]));
for(const i of process.argv.slice(3).map(Number)){const l=L[i];console.log('#',i,l.id.split('::').slice(1).join('::'));
for(const p of l.prints){const f=facts(p.town);const pg=page(p.town).split('\n');const fe=(pg.find(x=>x.startsWith('Food endurance'))||'').slice(0,230);
 console.log([p.town,f.tier,f.pop,f.stress.join('+'),'food:'+f.food.band+'/'+f.food.months+'mo gap'+f.food.gap,'cm'+JSON.stringify(f.cm),'ch'+JSON.stringify(f.chains)].join(' | '));if(process.env.FE)console.log('    ',fe);}}
