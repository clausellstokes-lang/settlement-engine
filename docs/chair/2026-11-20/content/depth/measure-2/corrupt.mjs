// corrupt.mjs <lineRoot> [n]: principled cards holding a corruption-theme hook, by size (count only).
import { bornAll } from './born.mjs';
const L = process.argv[2]; const n = Number(process.argv[3] || 50);
const { themeOfText } = await import(`${L}/src/domain/hookThemes.js`);
const { DEALING_TRAIT_FAMILY } = await import(`${L}/src/data/npcData.js`);
const { towns } = await bornAll(L, n);
const by = {}; let untyped = 0, hooksAll = 0;
for (const t of towns) {
  const s = (by[t.tier] ||= { cards: 0, principled: 0, prinCorr: 0, straight: 0, strCorr: 0, corrAll: 0 });
  for (const c of t.npcs || []) {
    s.cards++;
    const d = c.personality?.dominant; const hooks = (c.plotHooks || []).map((h) => typeof h === 'string' ? h : h?.text || h?.hook || '');
    const themes = hooks.map(themeOfText); hooksAll += hooks.length; untyped += themes.filter((x) => x === 'untyped').length;
    const corr = themes.includes('corruption'); if (corr) s.corrAll++;
    if (d === 'principled') { s.principled++; if (corr) s.prinCorr++; }
    if (DEALING_TRAIT_FAMILY[d] === 'straight') { s.straight++; if (corr) s.strCorr++; }
  }
}
console.log(`line ${L} n=${n}/size hooks=${hooksAll} untyped=${untyped}`);
console.log('size\tcards\tcorruptionHook\tprincipled\tprincipled+corruption\tstraightFamily\tstraight+corruption');
for (const [k, s] of Object.entries(by)) console.log([k, s.cards, s.corrAll, s.principled, s.prinCorr, s.straight, s.strCorr].join('\t'));
