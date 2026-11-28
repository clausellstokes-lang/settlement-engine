// node report-d.mjs : D-moved.tsv from work/D-C.res.json and work/D-V.res.json (analyze-d.mjs's results)
import { readFileSync, writeFileSync } from 'node:fs';
const W = '/tmp/rename/work';
const SITE = {
  'src/domain/dailyLife.js :: pickNameable': 'A1-A7, A9, A10 Daily Life slots',
  'src/domain/dailyLife.js :: yields': 'A8 Daily Life outsider impressions (which option is second)',
  'src/domain/crisis/crisisSummaryVantage.js :: summaryColumnOf': 'A18 crisis summary vantage',
  'src/pdf/lib/headlines.js :: seedPick': 'A26 overview headline (T) / A28 people headline (P)',
  'src/domain/display/governanceAccount.js :: underOccupation': 'A19/A20 fortune lines (the resolver names the enclosing function; the key is `<place>::<age>` / `<place>::<event>::<years>`)',
  'src/data/faceHonorifics.js :: honorificOfTitle': 'A30 card honorific (the card\'s institution or power name in the key)',
};
const NAMES = { T: 'town', P: 'ruler or first person', H: 'first house (institution)', F: 'first power' };
const rows = [['corpus', 'rename', 'site (A)', 'call site (pick log)', 'pages whose key holds the name', 'picks with the name', 'picks re-dealt', 'pages re-dealt at this site', 'worked example: key before -> after, line id before -> after']];
const tot = [['corpus', 'rename', 'births', 'pages with any moved line', 'pages with a line moved OTHER than by printing the new name', 'lines moved', 'lines moved by the name only', 'lines moved otherwise', 'otherwise, by view (top 6)']];
for (const c of ['C', 'V']) {
  let R; try { R = JSON.parse(readFileSync(`${W}/D-${c}.res.json`, 'utf8')); } catch { continue; }
  for (const [k, S] of Object.entries(R.byVar)) {
    tot.push([c, NAMES[k], S.births, S.pagesMoved, S.pagesRedealt, S.linesMoved, S.linesNameOnly, S.linesRedealt, Object.entries(S.redealtByView).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([v, n]) => `${v} ${n}`).join('; ')]);
    for (const [s, P] of Object.entries(S.pickSites).sort((a, b) => b[1].moved - a[1].moved)) {
      const cs = s.replace(/^\S+ /, '');
      rows.push([c, NAMES[k], SITE[cs] || '?', s, P.pagesWithName, P.picksWithName, P.moved, P.pagesMoved, P.ex ? `${P.ex.seed}: \`${P.ex.key}\` -> \`${P.ex.keyAfter}\`: ${P.ex.before} -> ${P.ex.after}` : (P.keyExample ? `key e.g. \`${P.keyExample}\` (a raw FNV: the column moves with its key)` : '')]);
    }
  }
  const Sh = R.share;
  tot.push([c, 'town: SHARED page', Sh.births, Sh.sharePagesMoved, Sh.shareRedealt, '', '', '', `owner's page vs shared page after the rename (rendered tabs; beyond their differences before it): ${Sh.ownerShareNewDiff} pages, ${Sh.ownerShareNewDiffLines} lines: ${JSON.stringify(Sh.byView)}`]);
}
writeFileSync('/tmp/rename/D-moved.tsv', `${tot.map((r) => r.join('\t')).join('\n')}\n\n${rows.map((r) => r.join('\t')).join('\n')}\n`);
console.log(tot.map((r) => r.join(' | ')).join('\n'));
console.log(rows.map((r) => r.join(' | ')).join('\n'));
