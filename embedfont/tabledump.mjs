import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const FD='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/58f0a8e2-2c4f-4073-8635-ecc7cf5010f6/scratchpad/laneKERNELMARK-tree/public/fonts';
for(const f of readdirSync(FD).filter(x=>x.endsWith('.ttf')).sort()){
  const b=readFileSync(join(FD,f));
  const tag=b.readUInt32BE(0).toString(16);
  const n=b.readUInt16BE(4); const names=[];
  const sizes={};
  for(let i=0;i<n;i++){const o=12+i*16; const t=b.toString('ascii',o,o+4); names.push(t); sizes[t]=b.readUInt32BE(o+12);}
  names.sort();
  console.log(`${f}  sfnt=0x${tag}  tables(${n}): ${names.join(' ')}`);
  console.log(`    glyf=${sizes['glyf']??'-'} loca=${sizes['loca']??'-'} CFF=${sizes['CFF ']??'-'} post=${sizes['post']??'-'} hmtx=${sizes['hmtx']??'-'} GSUB=${sizes['GSUB']??'-'} total=${statSync(join(FD,f)).size}`);
}
