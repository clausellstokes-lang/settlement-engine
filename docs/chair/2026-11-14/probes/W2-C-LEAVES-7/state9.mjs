// TREE=<tree> node state9.mjs <corpus.ndjson.gz...>: item 9's counts. The tab's card state (chainStateShown), the journal's
// chain line state (buildJournalPages' Economics page), and the chains a card prints as working whose only house is an
// "Access to ..." row (runsOnlyThroughAccess's reading, re-done here).
import fs from 'node:fs'; import zlib from 'node:zlib';
const T = process.env.TREE + '/src';
const { chainStateShown } = await import(T + '/domain/display/chainStateShown.js');
const { liveInstitutionNames, ACCESS_ONLY } = await import(T + '/domain/facts/institutions.js');
const { buildViewModel } = await import(T + '/pdf/lib/viewModel.js');
const { buildJournalPages } = await import(T + '/foundry/journalPages.js');
const { crisisOf } = await import(T + '/domain/facts/crisisKind.js');
const c = {}; const inc = (k, n = 1) => (c[k] = (c[k] || 0) + n); const ex = [];
for (const f of process.argv.slice(2)) for (const { seed, s } of zlib.gunzipSync(fs.readFileSync(f)).toString().split('\n').filter(Boolean).map(JSON.parse)) {
  const roster = liveInstitutionNames(s).map((n) => n.toLowerCase());
  const chains = s.economicState?.activeChains || [];
  let page = ''; try { page = buildJournalPages(buildViewModel({ settlement: s }), { settlement: s }).find((p) => p.name === 'Economics & Trade')?.markdown || ''; } catch (e) { inc('journal error'); }
  const L = page.split('\n'); const at = L.indexOf('## Supply chains'); const sc = at < 0 ? [] : L.slice(at + 1).filter((l) => l.startsWith('- '));
  const jl = page.split('\n').filter((l) => /^- \*\*.*\*\* \*\(/.test(l) || /^- \*\*[^*]+\*\*(: |$)/.test(l));
  chains.forEach((ch, i) => {
    inc('chains'); const shown = chainStateShown(ch, s);
    const heads = (ch.processingInstitutions || []).map((h) => String(h).toLowerCase().split(/[\s(]/)[0]).filter(Boolean);
    const met = (a) => heads.some((w) => roster.some((n) => ACCESS_ONLY.test(n) === a && n.includes(w)));
    const accessOnly = heads.length > 0 && met(true) && !met(false);
    if (accessOnly && ['running', 'operational', 'entrepot'].includes(shown)) { inc('access-only chain printed working'); if (ex.length < 12) ex.push(`${seed} ${ch.name || ch.chainId}: ${shown} [${heads}] siege=${crisisOf(s).has('under_siege')}`); }
    const line = sc[i];
    const m = line && line.match(/^- \*\*.*?\*\* \*\((.*?)\)\*/); const js = m ? m[1] : '';
    if (line) { inc('journal chain lines'); if (js !== shown) { inc('journal state differs from the card'); inc(`  journal ${js || '(none)'} / card ${shown || '(none)'}`); } }
  });
}
console.log(JSON.stringify(c, null, 0)); console.log(ex.join('\n'));
