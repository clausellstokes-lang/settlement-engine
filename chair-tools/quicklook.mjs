#!/usr/bin/env node
// quicklook.mjs <in.svg> <outdir> [size=1400] [timeoutMs=30000]
// Iteration-tier SVG→PNG via macOS qlmanage — NO Chrome, NO deps. For quick-looks only;
// instrument-grade exit legs stay on headless Chrome (ODQ A2.4/§7.6 ruling).
// The verdict is the PNG's existence and size, never the exit status (J-REG4-11's law).
import { spawnSync } from 'node:child_process';
import { existsSync, statSync, renameSync } from 'node:fs';
import { basename, join } from 'node:path';

const [svg, outdir, size = '1400', timeout = '30000'] = process.argv.slice(2);
if (!svg || !outdir) { console.error('usage: quicklook.mjs <in.svg> <outdir> [size] [timeoutMs]'); process.exit(2); }
const r = spawnSync('qlmanage', ['-t', '-s', size, '-o', outdir, svg], { timeout: Number(timeout), encoding: 'utf8' });
const produced = join(outdir, `${basename(svg)}.png`);
const final = join(outdir, `${basename(svg, '.svg')}.quicklook.png`);
if (existsSync(produced)) renameSync(produced, final);
if (existsSync(final) && statSync(final).size > 0) {
  console.log(`QUICKLOOK OK ${final} (${statSync(final).size} B)${r.error ? ' — process was killed by timeout AFTER producing the PNG, which is fine' : ''}`);
  process.exit(0);
}
console.error(`QUICKLOOK FAILED — no PNG at ${final}. qlmanage status=${r.status} error=${r.error?.message ?? 'none'} stderr=${(r.stderr || '').slice(0, 300)}`);
process.exit(1);
