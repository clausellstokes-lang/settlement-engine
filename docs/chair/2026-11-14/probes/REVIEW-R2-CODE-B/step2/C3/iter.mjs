import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
export async function* towns(file){ const rl=readline.createInterface({input:fs.createReadStream(file).pipe(zlib.createGunzip()),crlfDelay:Infinity}); for await (const l of rl){ if(l.trim()) yield JSON.parse(l); } }
