import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const [tree, file, out] = process.argv.slice(2);
const { governanceAccountOf } = await import(tree+'/src/domain/display/governanceAccount.js');
const { seatKeeperOf } = await import(tree+'/src/domain/people/seatKeeper.js').catch(()=>({seatKeeperOf:()=>null}));
const rl=readline.createInterface({input:fs.createReadStream(file).pipe(zlib.createGunzip()),crlfDelay:Infinity}); const w=fs.createWriteStream(out);
for await (const line of rl){ if(!line) continue; const {seed,s}=JSON.parse(line); let g, k; try{ g=governanceAccountOf(s); }catch(e){ g='ERR '+e.message; } try{ k=seatKeeperOf(s); }catch(e){ k='ERR'; }
  w.write(JSON.stringify({seed, g: typeof g==='string'?g:(g?.sentences||g?.text||g), keeper: k? (k.name||k.npc?.name||JSON.stringify(k).slice(0,120)) : null})+'\n'); }
w.end();
