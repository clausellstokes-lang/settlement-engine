const W = process.argv[2];
const m = await import(W + '/scripts/generate-landing-fixture.mjs');
const f = m.buildFixture('lf-033');
for (const a of f.realm.advance) console.log(a.week, '|', a.headline, '|', a.text);
for (const w of f.realm.whyTrace) console.log('why', w.axis, '|', w.reason);
const { factsOf } = await import(W + '/src/domain/facts/factsOf.js');
const a = m.analyze('lf-033'); console.log('market born', factsOf(a.town).market, 'after', factsOf(a.townAfter).market);
