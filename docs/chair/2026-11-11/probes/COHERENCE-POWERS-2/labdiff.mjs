import fs from 'node:fs';
const A = JSON.parse(fs.readFileSync(process.argv[2])), B = JSON.parse(fs.readFileSync(process.argv[3]));
const moved = {};
for (const s of Object.keys(A)) for (const k of new Set([...Object.keys(A[s]), ...Object.keys(B[s])])) if (A[s][k] !== B[s][k]) (moved[k] ||= []).push(`${s}: ${String(A[s][k]).slice(0,60)} -> ${String(B[s][k]).slice(0,60)}`);
for (const [k, v] of Object.entries(moved).sort((x, y) => y[1].length - x[1].length)) { console.log(String(v.length).padStart(5), k); if (process.argv[4]) for (const x of v.slice(0, 4)) console.log('        ', x); }
