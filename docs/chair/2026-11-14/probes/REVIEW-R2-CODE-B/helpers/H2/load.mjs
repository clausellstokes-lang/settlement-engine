import zlib from 'zlib'; import fs from 'fs'; import readline from 'readline';
export async function* towns(file=process.env.REC||'/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/out/births-tip.ndjson.gz'){
  const rl = readline.createInterface({input: fs.createReadStream(file).pipe(zlib.createGunzip()), crlfDelay: Infinity});
  for await (const line of rl){ if(!line.trim()) continue; yield JSON.parse(line); }
}
export const entries = (s) => (Array.isArray(s.stressors) && s.stressors.length) ? s.stressors : (s.stress ? [s.stress] : []);
