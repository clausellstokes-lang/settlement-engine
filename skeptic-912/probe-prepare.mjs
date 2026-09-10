const D = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneLMAT';
const { prepareSettlementEntry, ensureNormalizeLoaded } =
  await import(`${D}/src/lib/accountImport.js`);
await ensureNormalizeLoaded();

const FOREIGN_ROSTER = {
  schemaVersion: 1,
  buckets: { deities: [{
    source: 'custom', isCustom: true, customDefinitionCategory: 'deities',
    localUid: 'lu_source_secret', customDefinitionId: 'src-secret-def',
    customDefinitionRevisionId: 'src-secret-rev',
    customDefinitionContentHash: 'c'.repeat(64),
    name: 'Private Homebrew Deity',
  }] },
};

// A) the account-import shape (restoreLifecycle) — the remap's own input.
const a = prepareSettlementEntry(
  { name: 'W', settlement: { name: 'W', customContentRoster: FOREIGN_ROSTER },
    versionHistory: [{ id: 'snap_1', ts: 1, kind: 'manual', label: 'S',
      settlement: { name: 'W', customContentRoster: FOREIGN_ROSTER } }] },
  { sourceName: 'src', importedAt: '2026-01-01T00:00:00.000Z', restoreLifecycle: true },
);
console.log('A ok:', a.ok);
console.log('A settlement roster survives prepare:',
  JSON.stringify(a.entry?.settlement?.customContentRoster?.buckets?.deities?.[0]?.customDefinitionId));
console.log('A versionHistory length:', a.entry?.versionHistory?.length,
  '| snapshot roster id:',
  JSON.stringify(a.entry?.versionHistory?.[0]?.settlement?.customContentRoster
    ?.buckets?.deities?.[0]?.customDefinitionId));

// B) the RECONCILIATION shape — same function, no identity map anywhere.
const b = prepareSettlementEntry(
  { id: 's1', name: 'W', settlement: { name: 'W', customContentRoster: FOREIGN_ROSTER } },
  { sourceName: 'src', importedAt: null, sourceChecksum: 'chk', sourceId: 's1' },
);
console.log('B ok:', b.ok, '| reconciliation-path roster:',
  JSON.stringify(b.entry?.settlement?.customContentRoster?.buckets?.deities?.[0]));
