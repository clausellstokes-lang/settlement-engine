// births packed one {seed,s} per line, gzipped. TREE= SEEDS= OUT= node pack.mjs
import fs from 'node:fs'; import zlib from 'node:zlib';
const TREE=process.env.TREE; process.chdir(TREE);
const { boot } = await import(new URL('./born.mjs', import.meta.url).href); const born=await boot(TREE);
const lines=[]; for (const seed of fs.readFileSync(process.env.SEEDS,'utf8').trim().split('\n')) lines.push(JSON.stringify({seed,s:born(seed)}));
fs.writeFileSync(process.env.OUT, zlib.gzipSync(lines.join('\n')+'\n')); console.log('packed',lines.length);
