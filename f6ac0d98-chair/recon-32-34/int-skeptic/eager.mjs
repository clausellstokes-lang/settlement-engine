const mod = await import(process.argv[2]);
const eager = mod.EAGER_FIRST_PAINT_MODULES;
const targets = process.argv.slice(3);
console.log('EAGER module count:', eager.size);
const arr=[...eager];
for(const t of targets){
  const hits = arr.filter(p=>p.endsWith('/'+t));
  console.log(hits.length? 'EAGER: '+t : 'lazy : '+t);
}
