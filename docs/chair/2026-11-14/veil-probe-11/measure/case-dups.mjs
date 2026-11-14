const m = await import(process.argv[2] + '/src/domain/display/gallerySecondHomes.js');
const seen = new Map(); let dup = 0; let ascii = 0; const cls = m.NAME_CASE.split(' ');
for (const g of cls) { const cs = Array.from(g); cs.forEach((ch, i) => { if (seen.has(ch)) dup += 1; seen.set(ch, g); if (i > 0 && /[\x00-\x7f]/.test(ch) && !/[A-Z]/.test(ch)) ascii += 1; }); }
console.log(`classes ${cls.length}, letters ${seen.size}, a code point in two classes: ${dup}, an ASCII non-first member that is not A-Z: ${ascii}`);
