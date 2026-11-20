const L = process.argv[2];
const { NPC_FACTION_LOYALTY } = await import(`${L}/src/data/npcData.js`);
const { themeOfText } = await import(`${L}/src/domain/hookThemes.js`);
for (const [k, a] of Object.entries(NPC_FACTION_LOYALTY)) {
  const th = {}; for (const l of a) { const t = themeOfText(typeof l === 'string' ? l : l.text); th[t] = (th[t] || 0) + 1; }
  console.log(k, a.length, JSON.stringify(th));
}
