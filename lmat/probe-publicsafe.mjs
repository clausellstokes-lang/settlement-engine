const { toPublicSafe, PUBLIC_TOPLEVEL_KEYS, PRIVATE_KEY_RE } = await import('./src/domain/display/publicSafe.js');
const s = {
  id: 'x', name: 'Probeton', tier: 'town', population: 900,
  institutions: [{ id: 'i', name: 'Market' }],
  config: { settType: 'town', _livingContentLawVersion: 2, culture: 'germanic' },
  customContentRoster: { schemaVersion: 1, buckets: { deities: [{ source: 'custom', isCustom: true, customDefinitionId: 'def_1', customDefinitionContentHash: 'h1', name: 'Aster' }] } },
  customContentProvenance: { schemaVersion: 1, receiptHash: 'r1', materializedDefinitions: [] },
};
const def = toPublicSafe(s);
const full = toPublicSafe(s, { full: true });
console.log('ALLOWLIST has customContentRoster =', PUBLIC_TOPLEVEL_KEYS.includes('customContentRoster'));
console.log('ALLOWLIST has customContentProvenance =', PUBLIC_TOPLEVEL_KEYS.includes('customContentProvenance'));
console.log('ALLOWLIST has config =', PUBLIC_TOPLEVEL_KEYS.includes('config'));
console.log('DEFAULT: roster present =', 'customContentRoster' in def, '| provenance present =', 'customContentProvenance' in def);
console.log('DEFAULT: config present =', 'config' in def, '| _livingContentLawVersion =', def.config?._livingContentLawVersion);
console.log('FULL:    roster present =', 'customContentRoster' in full, '| provenance present =', 'customContentProvenance' in full);
console.log('FULL:    _livingContentLawVersion =', full.config?._livingContentLawVersion);
const keys = ['schemaVersion','buckets','source','isCustom','customDefinitionCategory','localUid','customDefinitionId','customDefinitionRevisionId','customDefinitionContentHash','customDefinitionVersion','customDefinitionFingerprint','customContentRoster','_livingContentLawVersion'];
console.log('PRIVATE_KEY_RE matches:', keys.filter(k => PRIVATE_KEY_RE.test(k)));
