const D='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneLMAT';
const { customContentReferencePack, identifyCustomContentPack } = await import(`${D}/tests/fixtures/customContentReferencePack.js`);
const { admitCustomContentDefinition } = await import(`${D}/src/domain/content/customContentManifest.js`);
const base = customContentReferencePack();
const variant = customContentReferencePack();
variant.stressors[0].name = 'Famine Plague Siege Occupied War Mass Migration';
const a = admitCustomContentDefinition('stressors', variant.stressors[0], { allowSystemFields: true });
console.log('admitted', a.ok === true);
const bi = identifyCustomContentPack(base).stressors[0];
const vi = identifyCustomContentPack(variant).stressors[0];
for (const k of ['definitionId','revisionId','revisionNumber','contentHash']) {
  console.log(k, 'same=', bi[k] === vi[k], '|', String(bi[k]).slice(0,50), '->', String(vi[k]).slice(0,50));
}
