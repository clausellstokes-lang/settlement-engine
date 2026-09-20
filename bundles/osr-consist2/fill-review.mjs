import { readFileSync, writeFileSync } from 'node:fs';

const [, , reportPath, templatePath, outPath] = process.argv;
const report = JSON.parse(readFileSync(reportPath, 'utf8'));
const template = JSON.parse(readFileSync(templatePath, 'utf8'));
const READER = 'src/components/new/relationshipsDeskRead.js';
const S = report.summary;

const WHY_NEW = {
  'neighbourNetwork on settlement':
    'THE DECLARED ONE, and the only one of the three the reasoned-write path would take on its'
    + ' own (measured: `--write --raise-explained-writer` refused the other two by name and not'
    + ' this). Roster entry 2, mechanism save-time-writer, writer src/lib/saves.js, and gate 0'
    + ' re-proves that write on every scan (saves.js:241). So `rowTagsOf` TAGS this address with'
    + ' no choice in the matter — `assertExplainedWriterRowTags` throws on a declared address'
    + ' lacking its tag — and it joins the 25 tagged siblings the register already carries. It is'
    + ' therefore the row that moves the BANK, 60 -> 61 reads across 39 -> 40 addresses, which the'
    + ' schema-20 fence refuses unless the literal module and declaredBankOf(21) both say so.',
  'interSettlementRelationships on settlement':
    'AN ORDINARY ROW, matching what the estate already carries for this identity: SEVEN files,'
    + ' ZERO tagged, since schema 4. The key has real save-time writers and could be declared, but'
    + ' the roster is keyed by IDENTITY, not by address, so declaring it would auto-tag all seven'
    + ' of those rows and move them into the enforced bank — a change of enforcement posture over'
    + ' rows this rung did not cause, and not one to make on the way to mounting a paragraph.',
  'crossSettlementConflicts on settlement':
    'AN ORDINARY ROW, and it could not be anything else. The identity already carries exactly one'
    + ' ordinary row (src/pdf/lib/viewModel.js) and can never carry a declared one: gate 0'
    + ' re-proves that a declaration\'s named writer still writes the key, and NOTHING in src/'
    + ' writes this key at all — the deterministic generator writes those rows into'
    + ' `interSettlementRelationships` (domain/relationships/neighbourBackLink.js:144,149) and'
    + ' tests/lint/writerReach.walker.test.js carries the key in its own `unwritten` roster. The'
    + ' read is inbound compatibility for records authored before the merge moved, the screen'
    + ' still merges it, and PARITY requires the print side to merge exactly what the screen does.',
};

const ADMISSION = 'ODQ §934.9 — THE RELATIONSHIPS MOUNT. The paid PDF\'s `relationships.network`'
  + ' position was MOUNTED AND STARVED: the builder put it, the chapter rendered it, and the two'
  + ' lists the DS-REL-1 desk draws from were assembled inside RelationshipsTab.jsx, out of a'
  + ` headless builder's reach. Lighting it put ${READER} in the tree, holding that merge for the`
  + ' tab AND the builder. It reads three keys written when a world is SAVED, LINKED or IMPORTED'
  + ' and never by the generation pipeline this instrument executes, so the scan convicts it of'
  + ' all three and is RIGHT to: no corpus world carries one. What the register owes them is'
  + ' ADMISSION rather than a silenced detector.';

const rowById = new Map(report.predecessorRows.map((r) => [r.rowId, r]));
const t = report.scannerTransition;

const decisions = template.decisions.map((d) => {
  if (d.subject === 'predecessor-reconciliation') {
    const row = rowById.get(d.rowId);
    if (!row) throw new Error(`no predecessor row for ${d.rowId}`);
    if (row.reconciliation === 'same') {
      if (row.delta !== 0) throw new Error(`same row with delta ${row.delta}`);
      return { ...d, decision: 'accept',
        note: `${row.address.file} / ${row.address.identity}: predecessor ceiling ${row.predecessorCount},`
          + ` schema-21 scan ${row.legacyCount}, delta 0 — SAME. Accepted: this rung admits three rows in`
          + ' one NEW file and touches nothing else, so every pre-existing address must reconcile unmoved'
          + ' and this one does.' };
    }
    if (row.reconciliation !== 'new' || row.address.file !== READER) {
      throw new Error(`unexpected ${row.reconciliation} at ${row.address.file} / ${row.address.identity}`);
    }
    const why = WHY_NEW[row.address.identity];
    if (!why) throw new Error(`no ruling written for ${row.address.identity}`);
    return { ...d, decision: 'accept',
      note: `${row.address.file} / ${row.address.identity}: NEW, ${row.predecessorCount} -> ${row.legacyCount}.`
        + ` ${ADMISSION} ${why}` };
  }
  if (d.subject === 'scanner-transition') {
    const changed = t.changes
      .map((c) => `${c.path} ${c.predecessor.sha256.slice(0, 8)} -> ${c.current.sha256.slice(0, 8)}`)
      .join('; ');
    return { ...d, decision: 'accept',
      note: 'Accepted, and each of the three modified paths is this rung\'s own bookkeeping and nothing'
        + ` else: ${changed}. observed-shape-baseline.mjs carries the 20 -> 21 bump,`
        + ' RETIRED_BANK_FENCE_BASELINE_SCHEMA and validateSchema21Baseline with'
        + ' validateSchema20Baseline re-bound to its own retired literal;'
        + ' check-observed-shape-readers.mjs carries the live-validator binding, the register\'s _doc'
        + ' and the schema index; migrate-observed-shape-readers.mjs carries'
        + ' RELATIONSHIPS_MOUNT_TARGET_SCHEMA, its delta paths, policy string, predecessor pairing,'
        + ' predecessor validator, transition-table entry and DECLARED_BANK_BY_TARGET[21].'
        + ' ⛔ NO DETECTOR SEMANTICS MOVED, and the reconciliation PROVES it rather than asserting it:'
        + ` predecessorSame ${S.predecessorSame}, Gone ${S.predecessorGone}, Increased`
        + ` ${S.predecessorIncreased}, Decreased ${S.predecessorDecreased}, New ${S.predecessorNew} — and`
        + ' all three NEW rows are in ONE file that did not exist at the predecessor. A detector change'
        + ' would have moved rows in files nobody edited; none moved. The delta is the three-path'
        + ' bookkeeping set every rung since 15 -> 16 has moved, the other eight governed inputs are'
        + ` byte-identical (${t.unchangedPaths.join(', ')}), and unscannedInputDigest is unmoved at`
        + ` ${t.current.unscannedInputDigest.slice(0, 8)}.`
        + ' ⭐ THIS GENESIS IS CUT ON THE CONSIST, AND THAT IS WHY IT EXISTS. The lane\'s own execution'
        + ' recorded subject shas from its branch, which a cherry-pick cannot carry, so the composed'
        + ' register refused with "migration genesis is not a committed ancestor of current HEAD".'
        + ` The subject is now ${report.inputs.subjectSha.slice(0, 9)}, a commit on this lineage that`
        + ' carries BOTH the schema-20 predecessor register (byte-identical to 4be2d0f2a\'s) and the'
        + ' scanned tree, which is what validateBaselineHistory reconstructs from.'
        + ' ⭐ AND THE TREE IT SCANS IS CURED, NOT MERELY COMPOSED: the same subject commit deleted'
        + ' `verdict`/`verdictTone` from domain/display/viabilityVerdict.js. Scanned against the'
        + ' composed tree those were two FURTHER reader-without-writer identities (3 and 2 reads) from'
        + ' lane 15\'s lift of the PDF\'s private verdictOf; measurement showed a generated'
        + ' economicViability carries neither key and no writer in src/ produces either, so they were'
        + ' CURED under the reader-without-writer doctrine rather than admitted here. That is the whole'
        + ' difference between this scan\'s 1967 findings and the 1972 the uncured tree produced.',
    };
  }
  throw new Error(`unexpected review subject ${d.subject}`);
});

writeFileSync(outPath, `${JSON.stringify({ ...template, decisions }, null, 2)}\n`);
const issues = new Set((report.issues || []).map((i) => i.rowId));
console.log(`wrote ${decisions.length} accepted decision(s) to ${outPath}`);
console.log(`  same ${decisions.filter((d) => /delta 0 — SAME/.test(d.note)).length} · NEW ${decisions.filter((d) => /: NEW, /.test(d.note)).length} · transition ${decisions.filter((d) => d.subject === 'scanner-transition').length}`);
console.log(`  pending ${decisions.filter((d) => d.decision !== 'accept').length} · empty notes ${decisions.filter((d) => !String(d.note).trim()).length}`);
console.log(`  report issues ${issues.size}, all dispositioned: ${[...issues].every((id) => decisions.some((d) => d.rowId === id && d.decision === 'accept'))}`);
