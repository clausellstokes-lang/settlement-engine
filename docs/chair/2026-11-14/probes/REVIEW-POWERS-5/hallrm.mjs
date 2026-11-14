// REVIEW-POWERS-5 hallrm.mjs — TREE= CORPUS= LINES= node hallrm.mjs: the ww#375 removed line's towns, with the criminal powers standing on each roster.
import fs from 'node:fs'; import zlib from 'node:zlib';
const { criminalPowersOf } = await import(process.env.TREE + '/src/domain/people/allegiance.js');
const M = new Map(zlib.gunzipSync(fs.readFileSync(process.env.CORPUS)).toString().trim().split('\n').map((l) => { const r = JSON.parse(l); return [r.seed, r.s]; }));
const L = JSON.parse(fs.readFileSync(process.env.LINES, 'utf8')).hall; const c = {};
for (const r of L) { const k = 'criminal powers on roster ' + criminalPowersOf(M.get(r.seed)).length; c[k] = (c[k] || 0) + 1; }
console.log(L.length, c);
