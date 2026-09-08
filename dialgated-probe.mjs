import { readFileSync } from 'node:fs';
const m = await import(process.argv[2] + '/scripts/lib/writer-reach-lit-corpus.mjs');
const t = readFileSync(process.argv[2] + '/tests/lint/writerReach.walker.test.js', 'utf8');
const block = t.slice(t.indexOf('FROZEN_DIAL_GATED = Object.freeze(['), t.indexOf(']);', t.indexOf('FROZEN_DIAL_GATED = Object.freeze([')));
const frozen = [...block.matchAll(/'([^']+)'/g)].map(x => x[1]);
console.log('frozen roster:', frozen.length);
let corpus;
try { corpus = await m.buildLitDialCorpus(); } catch (e) { console.log('buildLitDialCorpus() threw:', e.message.slice(0, 200)); process.exit(2); }
let live;
try { live = m.dialGatedOf(corpus); } catch (e) { console.log('dialGatedOf(corpus) threw:', e.message.slice(0, 200)); process.exit(3); }
const set = live instanceof Set ? [...live] : Array.isArray(live) ? live : Object.keys(live);
console.log('live dialGated:', set.length);
console.log('NEW (live − frozen):', set.filter(x => !frozen.includes(x)));
console.log('GONE (frozen − live):', frozen.filter(x => !set.includes(x)));
