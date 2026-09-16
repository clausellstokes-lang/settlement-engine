import fs from 'fs';
const s=fs.readFileSync(process.argv[2],'utf8');
const body=s.replace(/^export const meta = \{[\s\S]*?\n\}\n/,'');
try { new Function('agent','parallel','pipeline','phase','log','args','budget','workflow','(async()=>{'+body.replace(/\nreturn \{/,'\n; return {')+'})'); console.log('body parses'); } catch(e){ console.log('PARSE ERROR', e.message); }
console.log('TR path kept:', s.includes("if (f.code === 'TR') {"), '| old TR prompt intact:', s.includes("YOU ARE THE ARCHITECT FOR FAMILY ${f.code} (the Fable seat). Read ${OUT}/ARCH-PROTOCOLS.md first. ${prior}\\nYour lanes:"), '| plan calls:', (s.match(/label: `plan:/g)||[]).length, '| per-brief calls:', (s.match(/arch:\$\{f\.code\}:\$\{ln\.laneNo\}/g)||[]).length, '| protocols intact:', /label: 'arch:protocols', phase: 'Protocols', effort: 'high'/.test(s));
