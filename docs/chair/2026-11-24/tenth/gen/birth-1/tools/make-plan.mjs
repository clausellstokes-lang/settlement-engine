// READ-24: the close's census of 900 as a sameness-door plan (seeds dp-<size>-<i>, i 0..149, config { settType: size }).
import { writeFileSync } from 'node:fs';
const sizes = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const rows = sizes.flatMap((size) => Array.from({ length: 150 }, (_, i) => ({ seed: `dp-${size}-${i}`, size, config: { settType: size } })));
writeFileSync(process.argv[2], JSON.stringify(rows));
console.log(rows.length);
