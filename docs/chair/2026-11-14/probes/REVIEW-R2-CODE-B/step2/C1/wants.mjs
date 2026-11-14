import fs from 'node:fs'; import zlib from 'node:zlib';
const [tree, births, out] = process.argv.slice(2);
const { loadGenerationLawPayloads } = await import(tree + '/src/domain/density/densityCreateBoundary.js'); await loadGenerationLawPayloads();
const { composeTonightSheet } = await import(tree + '/src/domain/summary/tonightSheet.js');
const res = {};
for (const l of zlib.gunzipSync(fs.readFileSync(births)).toString().split('\n')) { if (!l) continue; const { seed, s } = JSON.parse(l);
  const j = composeTonightSheet(s); res[seed] = (j.people||[]).map(p => { const i = +((p.sourcePath||'').match(/\d+/)||[-1])[0]; const n = s.npcs?.[i];
    return { name:p.name, role:p.role, why:p.why, cast:p.castLabel||'', says:p.says, line:p.line, sameAs:p.sameAs, goal:n?.goal?.short||'', secret: typeof n?.secret==='string'?n.secret:(n?.secret?.text||n?.secret?.short||''), temp:n?.temperament||'', faction:n?.factionName||n?.faction||'', temporary: !!(n?.temporary||n?._temporary) }; });
}
fs.writeFileSync(out, JSON.stringify(res));
