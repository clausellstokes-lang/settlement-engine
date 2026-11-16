// BAR6-AUDIT-C · the page as printed, read into the parts LAWS 6 and 7 need (seat C).
// A WRAPPER beside the shared readers: it calls `pageB.mjs :: readTown` unchanged and adds what a presumption is
// read against: the town's size, its trade lists as printed, the Resources tab's own denials, the powers' member
// counts, the defence roster, the town's stated threats. Pure; no I/O; changes nothing.
import { readTown, sentences, lineMarked, MARK_LEAD } from './pageB.mjs';

export { sentences, lineMarked, MARK_LEAD };

/** The line after a heading line on a tab (the Economics trade lists print `Exports` then the list on one line). */
const listAfter = (lines, head) => {
  const i = lines.findIndex((l) => l === head);
  return i >= 0 && lines[i + 1] ? lines[i + 1].split(' · ').map((s) => s.trim()).filter((s) => s && !/^No (recorded|significant) /.test(s)) : [];
};

export const TIER_RANK = { thorp: 0, hamlet: 1, village: 2, town: 3, city: 4, metropolis: 5 };

/** One town, read for laws 6 and 7. */
export function readTownC(text, record) {
  const T = readTown(text, record);
  const eco = T.tabs['Systems/Economics'] || [];
  const res = T.tabs['Systems/Resources'] || [];
  const def = T.tabs['Systems/Defense'] || [];
  const pow = T.tabs['Systems/Power'] || [];
  T.tier = String(record?.tier || record?.config?.tier || '');
  T.rank = TIER_RANK[T.tier] ?? 3;
  T.pop = Number(record?.population || 0);
  T.exports = listAfter(eco, 'Exports');
  T.imports = listAfter(eco, 'Imports');
  T.produced = listAfter(eco, 'Produced locally');
  T.needed = (eco.find((l) => /^Needed, and not brought in: /.test(l)) || '').replace(/^Needed, and not brought in: /, '').replace(/\.$/, '');
  T.resLines = res.map((text, i) => ({ tab: 'Systems/Resources', i, text }));
  T.houses = (record?.institutions || []).map((x) => String(x?.name || '')).filter((n) => n && !/^access to\b/i.test(n));
  T.hasHouse = (re) => T.houses.find((n) => re.test(n)) || null;
  // the defence roster (record): which standing forces the town keeps
  const di = record?.defenseProfile?.institutions || {};
  const n = (k) => (Array.isArray(di[k]) ? di[k].filter(Boolean).length : di[k] ? 1 : 0); // a name, '' or a list
  T.forces = { garrison: n('garrison'), militia: n('militia'), watch: n('watch'), mercenary: n('mercenary'), charter: n('charter'), walls: n('walls') };
  T.forceNames = { garrison: di.garrison || '', militia: di.militia || '', watch: di.watch || '', mercenary: di.mercenary || '' };
  T.defenseLines = def.map((text, i) => ({ tab: 'Systems/Defense', i, text }));
  // the powers and their member counts as printed: "<name>" / "<state> · <cat> · <n>" / "↳ · <k> member(s) · …"
  T.powers = [];
  pow.forEach((l, i) => {
    const m = /^↳ · (\d+) members? · /.exec(l);
    if (m && i >= 2) T.powers.push({ name: pow[i - 2].trim(), members: Number(m[1]), idx: i, ruler: /Holds power/.test(pow[i - 1]) });
  });
  // the town's stated threats (each with the line or field that states it)
  const cfg = record?.config || {};
  T.threats = [];
  const monster = String(cfg.monsterThreat || '');
  if (/frontier|plagued/.test(monster)) T.threats.push({ kind: 'monster', tab: 'record', line: `config.monsterThreat = ${monster}` });
  const ml = T.pageHas(/regional monster threat|Monsters prowl/);
  if (ml) T.threats.push({ kind: 'monster', tab: ml.tab, line: ml.text });
  const bm = T.defenseLines.findIndex((x) => x.text === 'Beasts & Monsters');
  if (bm >= 0 && /^(Critical|Weak)/.test(def[bm + 1] || '')) T.threats.push({ kind: 'monster-weak', tab: 'Systems/Defense', line: `Beasts & Monsters · ${def[bm + 1]}` });
  for (const c of T.crises) T.threats.push({ kind: 'crisis:' + c, tab: 'record', line: `stress.type = ${c}` });
  // the food word the page prints
  const fw = T.pageHas(/^Food Security · /);
  T.foodWord = fw ? fw.text.replace(/^Food Security · /, '') : '';
  return T;
}

/** Strip the houses' and the people's names from a sentence (a name is no claim). */
export function nameStripper(T) {
  const people = (T.record?.npcs || []).flatMap((x) => [x.name, ...String(x.name || '').split(' ')]).filter((x) => x && x.length > 2);
  const names = [...T.houses, ...people].filter((x) => x.length > 2).sort((a, b) => b.length - a.length).map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const re = names.length ? new RegExp(names.join('|'), 'gi') : null;
  return (s) => (re ? s.replace(re, ' ') : s);
}

/** Every dossier sentence of the page as { tab, i, line, s } (a row of cells is one sentence). */
export function sentencesOfPage(T, tabRe = /^(Summary|Systems|World|Notes)\//) {
  const out = [];
  for (const [tab, ls] of Object.entries(T.tabs)) {
    if (!tabRe.test(tab)) continue;
    ls.forEach((line, i) => { for (const s of sentences(line)) out.push({ tab, i, line, s }); });
  }
  return out;
}
