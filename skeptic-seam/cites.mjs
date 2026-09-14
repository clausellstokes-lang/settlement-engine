const m = await import(process.argv[2]+'/scripts/wiring-census.mjs');
const { cites, files } = m.producerCitations();
console.log('producer files walked', files, 'tokens', cites.size);
for (const t of ['granary','church','ledger','court','elders','parish','toll-bar','walls','garrison']) {
  const c = cites.get(t) || [];
  console.log(t.padEnd(10), c.length, JSON.stringify(c.slice(0,8)));
}
