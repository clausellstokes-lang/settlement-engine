// Second rules batch: groups verified after the first pass, then the two defaults.
export const FILE_RULES2 = [
  { f:'src/components/compendium/customContentEditorCopy.js', cls:'reader', ev:'render-site-read',
    cp:'src/components/compendium/CustomContentEditor.jsx:43', n:'imported as FIELD_HINTS by the manual custom-content editor; the module header calls itself "Human-facing copy"' },
  { f:'src/components/compendium/customCategories.js', e:'CATEGORY_BY_KEY', cls:'reader', ev:'render-site-read',
    cp:'src/components/compendium/Dependencies.jsx:226', n:'{dep.hint} printed under each dependency field' },
  { f:'src/components/generate/characterPresets.js', cls:'reader', ev:'render-site-read',
    cp:'src/components/generate/CharacterPresetCard.jsx:202', n:'title={a.desc} — the preset card tooltip' },
  { f:'src/domain/stressorPicker.js', cls:'reader', ev:'family-trace',
    cp:'src/components/settlement/eventComposer/EventComposerTargetField.jsx:70', n:'items={stressorPickerItems} feeds the composer picker' },
  { f:'src/domain/display/deityEffects.js', e:'DEITY_AXIS_EFFECTS', cls:'reader', ev:'family-trace',
    cp:'scripts/generate-compendium-data.mjs -> src/components/compendium/CatalogTabs.jsx', n:'baked into compendiumData and printed on the deity axis tab' },
  { f:'src/domain/cultureProfiles.js', cls:'reader', ev:'render-site-read',
    cp:'src/pdf/sections/IdentityDailyLife.jsx:278', n:"['Built form', culture.builtForm] / ['Civic pattern', culture.civicPattern] printed in the PDF identity section" },
  { f:'src/data/goods/chains.js', e:'GOODS_MODIFIERS_BY_TIER', cls:'reader', ev:'render-site-read',
    cp:'src/components/TradeDynamicsPanel.jsx:67', n:'{good.desc} under each trade good' },
  { f:'src/data/economicData.js', e:'TRADE_DEPENDENCY_NEEDS', leaf:'.detail', cls:'ambiguous', ev:'untraced',
    cp:'src/generators/economy/economicState.js:716', n:"lands as need.detail on economicState.tradeDependencies; the PDF renders only label(d) (EconomicsTrade.jsx:183) and EconomicsTab.jsx:288 reads only d.severity — no render of `.detail` found" },
  { f:'src/data/economicData.js', e:'TRADE_DEPENDENCY_NEEDS', leaf:'.label', cls:'reader', ev:'render-site-read',
    cp:'src/pdf/sections/EconomicsTrade.jsx:183', n:'<Tag>{label(d)}</Tag> in CRITICAL DEPENDENCIES' },
  { f:'src/data/goods/identity.js', e:'RESOURCE_DATA', leaf:'.desc', cls:'ambiguous', ev:'untraced',
    cp:'src/generators/computeActiveChains.js:235', n:'every traced read of RESOURCE_DATA takes `.label`, `.terrain` or `.commodities`; no reader of `.desc` found on any surface' },
  { f:'src/data/goods/identity.js', e:'RESOURCE_DATA', leaf:'.warning', cls:'ambiguous', ev:'untraced',
    cp:'src/data/goods/identity.js', n:'same as `.desc` — no traced reader' },
  { f:'src/data/goods/identity.js', e:'RESOURCE_DATA', leaf:'.label', cls:'reader', ev:'render-site-read',
    cp:'src/generators/computeActiveChains.js:235', n:'the chain label the supply-chain surfaces print' },
  { f:'src/domain/supplyChainState.js', e:'NEED_HEURISTICS', cls:'reader', ev:'render-site-read',
    cp:'src/domain/summary/tonightAtTheTable.js:155', n:"reason = f.failureConsequences, printed by the Tonight-at-the-Table read-model (PDF section TonightAtTheTable.jsx)" },
  { f:'src/domain/display/armyStrength.js', cls:'reader', ev:'render-site-read',
    cp:'src/components/admin/AdminSimTuningPanel.jsx:219', n:'latentStrength(m).phrase printed as the host column; the DM-facing WarTab imports a different export (deployedArmyStatus) of the same module' },
  { f:'src/lib/flags.js', cls:'dev', ev:'render-site-read', cp:'src/components/dev/DevFlagPanel.jsx', n:'dev flag panel only' },
  { f:'src/domain/worldPulse/index.js', cls:'dev', ev:'reachability',
    cp:'(test/scripts barrel)', n:'the aggregate barrel is deliberately NOT imported by product code (the worker takes the leaf: advanceInterval.worker.js:23); its rationale/note rows are dev classification text' },
  { f:'src/components/map/heraldCommandSourceParity.js', cls:'dev', ev:'declaration', cp:'(parity manifest)', n:'a parity manifest naming owning components' },
  { f:'src/domain/worldPulse/pulseKernel.js', e:'RESIDUE_STRIP_SITES', cls:'dev', ev:'declaration', cp:'(declaration)', n:'strip-site ledger' },
  { f:'src/components/founders/hallRegister.js', e:'covenantProseStyle', cls:'dev', ev:'declaration', cp:'(style token)', n:'CSS font stack, not prose (corpus false positive)' },
  { f:'src/domain/npc/livedExperienceFunnel.js', cls:'dev', ev:'declaration', cp:'(tuning declaration)', n:'derived tuning notes' },
  { f:'src/domain/tuning/autoTunableRegistry.js', cls:'dev', ev:'declaration', cp:'(tuning declaration)', n:'candidate-rail notes' },
];
export const PATTERN_RULES2 = [
  // governed reader kind-registries: the authored news/receipt pools
  { test:(r)=>/_KIND_REGISTRY$/.test(r.exp), cls:'reader', ev:'family-trace',
    cp:'src/components/map/HeraldBody.jsx:121', n:'a governed READER registry pool (the module headers name themselves "evidence-to-reader projection"); the seeded picker in the same file builds the Herald item the feed prints' },
  { test:(r)=>/(HeraldItem|NewsItem|News)\(\)$/.test(r.exp)||['.headline','.summary','.epitaph'].includes(r.leaf), cls:'reader', ev:'family-trace',
    cp:'src/components/map/HeraldBody.jsx:121', n:'Herald news item text (headline/summary); the feed renders item.headline and the Remembrance reader prints receipt detail' },
  { test:(r)=>/^src\/application\/commands\//.test(r.file) && r.leaf==='.description', cls:'dev', ev:'declaration',
    cp:'src/application/commands/standardCommandRegistry.js', n:'command-registry spec description, an internal contract string' },
  { test:(r)=>/^validate[A-Z]/.test(r.exp), cls:'dev', ev:'declaration', cp:'(validator)', n:'validator message' },
  { test:(r)=>['.fontFamily','.owner','.banks','.unit','.min','.max','.anchor','.exportBonus'].includes(r.leaf), cls:'dev', ev:'declaration', cp:'(declaration)', n:'non-prose or dev-side field' },
  { test:(r)=>r.leaf==='.note'||r.leaf==='.access', cls:'dev', ev:'declaration', cp:'(declaration)', n:'design/tuning note beside a table row' },
];
const READER_KEYS = new Set(['.desc','.description','.label','.blurb','.summary','.headline','.phrase','.term','.text','.title','.body','.hint','.teaser','.sentence','.detail','.effect','.explanation','.reason','.message','.name','.epithet','.tagline','.intro','.portfolio','.signal','.cause','.frame','.heading','.epitaph','.may','.did','.one','.many','.warStyle','.resource','.incompatibleReason','.entrepotNote','.failureConsequence','.condition','.arrival','.character','.trait','.role','.hook','.warning','.receipt','.identitySentence','.tradeAccess','.serviceLine','.cta','.noHiddenFees','.d']);
export function DEFAULTS(r){
  if(!r.prod){
    return { cls:'ambiguous', ev:'reachability',
      cp:'(no product surface)',
      n:'authored string in a module reachable from NO product surface at fd36f0298 (dark); it is neither rendered today nor a dev note, so its consumer cannot be named' };
  }
  if(READER_KEYS.has(r.leaf) || r.leaf==='[idx]' || r.leaf==='(other)'){
    return { cls:'reader', ev:'family-inference', cp:r.jsxAnc||'(product-reachable module)',
      n:'product-reachable module with a rendered-display leaf key; the module was traced to this JSX/PDF ancestor but this individual render line was not read' };
  }
  return { cls:'ambiguous', ev:'untraced', cp:'(untraced)', n:'product-reachable, but the leaf key is not a known display field and no consumer was read' };
}
