// BIRTH-1 D8: sha256 of the record with a word mapped back (MAPBACK_FROM -> MAPBACK_TO in every string), for byte-equality with the
// tree before the word changed. Read only.
import { createHash } from 'node:crypto';
const FROM = process.env.MAPBACK_FROM || ''; const TO = process.env.MAPBACK_TO || '';
export function measure(town) {
  const text = JSON.stringify(town); const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const mapped = FROM ? text.split(FROM).join(TO).split(cap(FROM)).join(cap(TO)) : text; // and its sentence-start form
  return { mapped: createHash('sha256').update(mapped).digest('hex'), carries: FROM ? text.includes(FROM) : false };
}
