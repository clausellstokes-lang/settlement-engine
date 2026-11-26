#!/usr/bin/env node
// BIRTH-1 D7: node analyse-d7.mjs <births.jsonl from measure-d7.mjs> <out.txt> [label]
// Per crisis kind: the births that hold it; those where NONE of the kind's own powers (the powers
// `power/stressFactions.js :: applyStressEventFactions` pushes for it) stands on the final roster; and, per sentence field, every
// distinct crisis sentence the kind prints (the place's name read as {place}), with its count over all and where the powers are absent.
// A READING, not a verdict: which sentence NAMES a local power is classed by hand from this file.
import { readFileSync, writeFileSync } from 'node:fs';
const [file, out, label = ''] = process.argv.slice(2);
/** The kind's own powers, by name (stressFactions.js, at the base). */
export const OWN = {
  under_siege: [/^War Council$/], wartime: [/^War Council$/, /^Peace Movement$/],
  occupied: [/^Occupation Authority$/, /^Resistance Network$/],
  politically_fractured: [/Noble Bloc/, /^Third Bloc/],
  indebted: [/Creditor/],
  recently_betrayed: [/^The Inquiry$/],
  succession_void: [/^Noble Claimant/],
  famine: [/^Grain Holders$/], plague_onset: [/^Quarantine Council$/], monster_pressure: [/^Monster Hunters/],
  insurgency: [/^People's Council$/, /^Commons' Reform Assembly$/, /^Journeymen's League$/, /^Loyalist Noble Opposition$/, /^Reform Stewards' Coalition$/, /^Reform Movement$/],
  mass_migration: [/^Newcomers' Settlement$/, /^Departure Committee$/],
  religious_conversion: [/^New Faith Community$/, /^Reform Congregation$/, /^Conversion Enforcement Office$/, /^Underground Old Faith$/],
  slave_revolt: [/^Revolt Leadership$/, /^Abolitionist Network$/],
};
const rows = readFileSync(file, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const kinds = {};
const norm = (t, r) => String(t ?? '').split(r.placeName || '\u0000').join('{place}');
for (const r of rows) {
  for (const kind of new Set(r.crises)) {
    const k = (kinds[kind] ||= { births: 0, absent: 0, unknownOwn: false, fields: {} });
    k.births++;
    const holds = r.holds && Object.hasOwn(r.holds, kind) ? r.holds[kind] : (OWN[kind] ? r.roster.some((n) => OWN[kind].some((re) => re.test(String(n)))) : null);
    if (holds === false) k.absent++;
    const add = (field, text) => {
      if (!text) return;
      const f = (k.fields[field] ||= {}); const t = norm(text, r);
      const e = (f[t] ||= { n: 0, absent: 0, seeds: [] }); e.n++; if (holds === false) { e.absent++; if (e.seeds.length < 3) e.seeds.push(r.seed); }
    };
    for (const e of r.entries.filter((x) => x.type === kind)) { add('summary', e.summary); add('hook', e.hook); add('note', e.note); }
    add('recentConflict (any crisis)', r.recentConflict); add('pressure (any crisis)', r.pressure);
  }
}
const lines = [`${label} births ${rows.length}`];
for (const [kind, k] of Object.entries(kinds).sort()) {
  lines.push(`\n=== ${kind}: ${k.births} births; none of its own powers on the roster: ${k.unknownOwn ? 'n/a (no own power)' : k.absent}`);
  for (const [field, texts] of Object.entries(k.fields)) {
    lines.push(`  -- ${field}`);
    for (const [t, e] of Object.entries(texts).sort((a, b) => b[1].absent - a[1].absent || b[1].n - a[1].n).slice(0, 14)) lines.push(`    [${e.n} | absent ${e.absent}] ${t.slice(0, 220)}${e.seeds.length ? `  (${e.seeds.join(' ')})` : ''}`);
  }
}
writeFileSync(out, `${lines.join('\n')}\n`); console.log(`${label}: ${Object.keys(kinds).length} kinds -> ${out}`);
