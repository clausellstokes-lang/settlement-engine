// BIRTH-1: per-field hashes of a birth (every top-level key, and every key of powerStructure and history), for "what else moved".
import { createHash } from 'node:crypto';
const h = (v) => createHash('sha256').update(JSON.stringify(v) ?? 'undefined').digest('hex').slice(0, 16);
export function measure(town) {
  const keys = {};
  for (const [k, v] of Object.entries(town || {})) keys[k] = h(v);
  for (const sub of ['powerStructure', 'history']) for (const [k, v] of Object.entries(town?.[sub] || {})) keys[`${sub}.${k}`] = h(v);
  return { keys };
}
