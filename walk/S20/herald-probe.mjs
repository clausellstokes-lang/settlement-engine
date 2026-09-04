// READ-ONLY probe: §889.1's probe-with-control, reproduced against wizardNews.js at ca651d54b
// (lanePREGATE-tree @9a95d6799; src/domain/region is byte-identical to ca651d54b there).
const DOCK = process.argv[2];
const m = await import(`${DOCK}/src/domain/region/wizardNews.js`);
const { appendWizardNewsEntries } = m;
const mk = (id, auth) => ({ id, tick: 3, title: 't', summary: 's', kind: 'observed', impactKind: 'cession_for_peace', section: 'adjudication', sectionAuthority: auth, settlementIds: ['s1'], createdAt: '2026-07-12T00:00:00.000Z' });
const feed = appendWizardNewsEntries({ schemaVersion: 1, currentTick: 3, entries: [], updatedAt: '2026-07-12T00:00:00.000Z' }, [mk('a', 'sovereignty_registry'), mk('b', 'envoy_registry'), mk('c', 'bogus_registry')], { now: '2026-07-12T00:00:00.000Z' });
for (const e of feed.entries) console.log(e.id, 'authority=', e.sectionAuthority === undefined ? 'DROPPED' : e.sectionAuthority, 'section=', e.section);
