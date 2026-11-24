// GRANTS-1: compose supabase/migrations/211_close_visitor_reach.sql from its parts.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
const P = (f) => new URL('./211/' + f, import.meta.url);
const parts = ['header.sql', 'partA.sql', 'partC.sql', 'partD.sql', 'partB.sql'].filter((f) => existsSync(P(f)));
writeFileSync('supabase/migrations/211_close_visitor_reach.sql', parts.map((f) => readFileSync(P(f), 'utf8').trimEnd() + '\n').join('\n'));
console.log('211 composed from', parts.join(', '));
