// STORY AT ONE POSITION (the seventh chair's 21:14 UTC ruling: two cards or two ties of one list printing one wording;
// the joint measure's number, target 0 at every size) and the owner's stop condition 3, from the census's own
// repeatsInPlace over a rendered run. usage: node story.mjs <tree> <run dir>
const [T, R] = process.argv.slice(2);
const c = await import(`${T}/scripts/sameness-census.mjs`);
for (const size of c.SIZES) {
  const rows = c.readSize(R, size);
  const rep = c.repeatsInPlace(rows);
  const one = new Set(); const oneStory = new Set();
  for (const s of rep.sentences) for (const i of s.oneIdx || []) { one.add(i); if ([...(s.paths || [])].some((p) => /npcs|relationship|ties|faction|secret|goal|hook|history|tension/i.test(p))) oneStory.add(i); }
  const top = rep.sentences.filter((s) => s.onePosition > 0).sort((a, b) => b.onePosition - a.onePosition).slice(0, 3)
    .map((s) => `${s.onePosition}x ${s.family} [${[...(s.paths || [])].slice(0, 2).join(', ')}] ${s.sentence.slice(0, 90)}`);
  console.log(`${size}: places ${rows.length}; a sentence repeated inside one place (any positions): ${rep.places}; ONE POSITION (any): ${one.size}; ONE POSITION on a story path: ${oneStory.size}`);
  for (const t of top) console.log(`   ${t}`);
}
