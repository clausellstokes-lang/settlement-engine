// A2: the Daily Life slots' commonest-sentence share (the sameness door's own measure, `measureSlots` over `readSize`,
// imported read-only from the lit tree), by size, for every web slot of the Daily Life tab, BEFORE and AFTER.
// node slotshare.mjs <beforeRunDir> <afterRunDir>
const { measureSlots, readSize } = await import('/home/user/wt/lit/scripts/sameness-census.mjs');
const [B, A] = process.argv.slice(2);
const SZ = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const rows = [];
for (const size of SZ) {
  const b = measureSlots(readSize(B, size, 150)); const a = measureSlots(readSize(A, size, 150));
  const keys = [...new Set([...b.keys(), ...a.keys()])].filter((k) => k.startsWith('web:World/Daily Life')).sort();
  for (const k of keys) {
    const x = b.get(k); const y = a.get(k);
    if ((x?.places || 0) < 5 && (y?.places || 0) < 5) continue;
    rows.push([size, k, x ? `${x.topPlaces}/${x.of} ${x.shareAll} (seen ${x.seen})` : '-', y ? `${y.topPlaces}/${y.of} ${y.shareAll} (seen ${y.seen})` : '-', (x?.sentence || '').slice(0, 70), (y?.sentence || '').slice(0, 70)].join('\t'));
  }
}
console.log(['size', 'slot', 'before: top places, shareAll', 'after', 'commonest before', 'commonest after'].join('\t'));
console.log(rows.join('\n'));
