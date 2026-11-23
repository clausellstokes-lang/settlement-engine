// V8-9 (VEIL-17's builder) MEASURE FIRST: the alternation in the client's twin (Node's V8, the engine of the reader's
// browser in Chrome). node twin.mjs <tree> <spec...>   spec as compile.mjs (<script>:<names>:<words>).
// Each spec: buildNameSearch(names, ['Fish market']) timed (its open-name pass compiles the pattern), then `hit` asked of
// 2,000 strings of 60 characters that name no house (the read asks each string once), timed; the pattern's L and D.
// Errors are printed, never thrown.
const [tree, ...specs] = process.argv.slice(2);
const { buildNameSearch } = await import(`${tree}/src/domain/display/gallerySecondHomes.js`);
const gen = {
  latin: (i, w) => `Aa guild ${i}${' of the long name'.repeat(w)}`,
  greek: (i, w) => `Αα συντεχνία ${i}${' της μακριάς οδού'.repeat(w)}`,
  cyrillic: (i, w) => `Аа гильдия ${i}${' долгого имени'.repeat(w)}`,
  long: (_i, w) => `Aa guild${' of the long name'.repeat(w)}`,
  glong: (_i, w) => `Αα συντεχνία${' της μακριάς οδού'.repeat(w)}`,
  han: (i, w) => String.fromCodePoint(...Array.from({ length: w }, (_, j) => 0x4e00 + ((i - 1) * w + j) % 20000)),
  symbol: (i, w) => `★${i}☆${'♜♞'.repeat(w)}`,
};
const strings = Array.from({ length: 2000 }, (_, j) => `plain cargo line ${j} of the harbour ledger, signed and sealed`);
for (const spec of specs) {
  const [script, n, w] = spec.split(':');
  const names = (script === 'long' || script === 'glong') ? [gen[script](0, Number(w))] : Array.from({ length: Number(n) }, (_, i) => gen[script](i + 1, Number(w)));
  let line = `${spec} names ${names.length}`;
  try {
    const t0 = performance.now();
    const s = buildNameSearch(names, ['Fish market']);
    const t1 = performance.now();
    const p = s.pattern ?? '';
    line += ` | L ${[...p].length} D ${new Set([...p]).size} | build ${(t1 - t0).toFixed(0)} ms`;
    let hits = 0;
    for (const t of strings) if (s.hit(t)) hits += 1;
    line += ` | 2,000 strings ${(performance.now() - t1).toFixed(0)} ms (hits ${hits})`;
  } catch (e) { line += ` | ERROR ${e.name}: ${String(e.message).slice(0, 80)}`; }
  console.log(line);
}
