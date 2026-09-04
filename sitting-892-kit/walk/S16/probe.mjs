const D=process.argv[2];
const { appendWizardNewsEntries } = await import(D+'/src/domain/region/wizardNews.js');
const mk=(id,auth)=>({ id, tick: 5, section: 'adjudication', sectionAuthority: auth, headline: 'probe', summary: '' });
const feed = appendWizardNewsEntries({}, [mk('probe-sov','sovereignty_registry'), mk('probe-env','envoy_registry'), mk('probe-war','war_rulings_registry')], { now: '2026-01-01T00:00:00.000Z' });
for (const e of feed.entries) console.log(e.id, 'section=', e.section, 'sectionAuthority=', JSON.stringify(e.sectionAuthority));
