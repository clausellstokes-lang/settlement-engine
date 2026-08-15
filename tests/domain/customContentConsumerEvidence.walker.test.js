/**
 * customContentConsumerEvidence.walker.test.js — THE CONSUMER-EVIDENCE WALKER.
 *
 * THE LAW: a custom-content field that declares consumer evidence must ACTUALLY
 * BE READ by that evidence. "file-exists ≠ reads", and here it was weaker still:
 * nothing checked even the existence.
 *
 * THE GAP THIS CLOSES. Every field spec in schema/custom-content.manifest.json
 * carries `consumers: string[]`. scripts/generate-custom-content-manifest.mjs
 * (line ~92) requires that array to be non-empty and unique — and stops there.
 * It never resolves a consumer to anything real. So the evidence was DECLARED,
 * never PROVEN: a field could name a consumer that was renamed, deleted, or that
 * never read it, and every gate stayed green. Contrast
 * tests/domain/npc/npcFacetConsumer.walker.test.js, which content-scans the named
 * file for the named token — this walker brings the same standard here.
 *
 * WHY THE MAP LIVES HERE AND NOT IN THE MANIFEST. The `consumers` entries are
 * SYMBOLIC names (`capacityModel`, `dependencyEngine.foodImpactTally`), not file
 * paths — so proving them requires a name → file resolution table that does not
 * exist anywhere in the repo. It is kept in this test rather than in the manifest
 * JSON because the manifest is compiled into three generated artifacts plus a
 * frozen migration-185 SQL snapshot; adding a key there would either grow the
 * shipped artifacts or need a strip step, for evidence that is review machinery,
 * not runtime data. Resolution stays build-time, where it costs nothing.
 *
 * THE TWO CHECKS:
 *   (a) RESOLUTION — every declared consumer name maps to a real file, exact-set
 *       equal to CONSUMER_SITES (an unmapped name AND a ghost row both fail).
 *   (b) EVIDENCE — for each field, at least one declared consumer file literally
 *       mentions the field's key. Failures are exempt-with-reason, shrink-only,
 *       and the honesty test below forces a row's deletion once it is wired up.
 *
 * CANNOT-CATCH (documented gaps — accepted costs of a source gate):
 *   1. Generic keys (`name`, `description`) appear in almost any file, so (b) is
 *      near-vacuous for them and strong for distinctive ones (`alignmentAxis`,
 *      `sceneProfileId`, `tierMin`). It proves the file is plausibly the reader;
 *      it does not prove the read is semantically correct.
 *   2. A field read through destructuring under a different local name, or via a
 *      computed key, reads as absent. That direction is safe: it fails loudly and
 *      lands in the exempt list with a reason rather than passing silently.
 *   3. Two consumer sub-names (`assembleInstitutions.dossierPlacement`,
 *      `dependencyEngine.relationshipRead`) name a CONCERN, not a real symbol —
 *      no token of that name exists in the file. Resolution is therefore
 *      file-level, and check (b) carries the per-field weight.
 *
 * @enforced-by this test
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const MANIFEST = 'schema/custom-content.manifest.json';

/**
 * Resolution table, frozen 2026-07-26 (hand-audited, every path verified to
 * exist and every mapping justified by a real read).
 *
 * A name maps to one file, or to the set of files that jointly implement it when
 * the name denotes a surface rather than a module — `compendium` is the manager
 * plus the attribute leaf it renders; `dossier` is the several renderers that
 * present authored content across buckets.
 *
 * To add a consumer: add its row here in the same change that adds it to the
 * manifest. Deleting a manifest consumer means deleting its row.
 */
const CONSUMER_SITES = Object.freeze({
  assembleInstitutions: 'src/generators/steps/assembleInstitutions.js',
  'assembleInstitutions.dossierPlacement': 'src/generators/steps/assembleInstitutions.js',
  capacityModel: 'src/domain/capacityModel.js',
  causalState: 'src/domain/causalState.js',
  compendium: [
    'src/components/compendium/CustomContent.jsx',
    'src/components/compendium/CustomItemAttributes.jsx',
  ],
  'compendium.attributes': 'src/components/compendium/CustomItemAttributes.jsx',
  // The reference/dependency leaf: it renders each declared dependency field off
  // the item and derives the reverse link from the same key (REVERSE_VERB).
  'compendium.dependencies': 'src/components/compendium/Dependencies.jsx',
  customFounding: 'src/domain/traditions/customFounding.js',
  customRegistry: 'src/lib/customRegistry.js',
  customSupplyChainActivation: 'src/domain/content/customSupplyChainActivation.js',
  customSupplyChainReview: 'src/domain/content/customSupplyChainReview.js',
  // The store module of the same name is a 7-line re-export barrel with none of
  // the axis fields; the domain module is where deitySnapshotFrom projects them.
  deitySnapshot: 'src/domain/deitySnapshot.js',
  // WR-2's pure read side recognizes the deity domain's closed mechanical set
  // and returns a neutral record for every other authored word.
  dispositionProfile: 'src/domain/worldPulse/dispositionProfile.js',
  'dependencyEngine.finishedGoodsSupply': 'src/lib/dependencyEngine.js',
  'dependencyEngine.foodImpactTally': 'src/lib/dependencyEngine.js',
  'dependencyEngine.relationshipRead': 'src/lib/dependencyEngine.js',
  dossier: [
    'src/pdf/sections/Institutions.jsx',
    'src/pdf/sections/Traditions.jsx',
    'src/components/new/tabs/OverviewTab.jsx',
    'src/components/new/tabs/TraditionsTab.jsx',
    'src/components/new/serviceComponents.jsx',
    'src/components/settlement/faithPanelModel.js',
  ],
  economyReconcilePass: 'src/generators/steps/economyReconcilePass.js',
  eligibleCustomContent: 'src/domain/customContentSchema.js',
  // The composer surface is two files: the host that subscribes custom content
  // into the ADD_FACTION flow, and the domain catalog that actually reads each
  // custom faction's name + description into picker options (the description
  // is prefilled into the editable Description field, which is how it reaches
  // the created faction — event.description → addFaction).
  eventComposer: [
    'src/components/settlement/EventComposer.jsx',
    'src/domain/factions/factionCatalog.js',
  ],
  'foodGenerator.generateFoodSecurity': 'src/generators/foodGenerator.js',
  inferSupplyChains: 'src/domain/inferSupplyChains.js',
  // The data module of the same name is a static lookup table with none of the
  // declared fields; the generator is where custom `produces` is consumed.
  institutionServices: 'src/generators/services/institutionServices.js',
  magicProfile: 'src/domain/magicProfile.js',
  pantheon: 'src/domain/worldPulse/pantheon.js',
  religiousContest: 'src/domain/worldPulse/religiousContest.js',
  resolveResources: 'src/generators/steps/resolveResources.js',
  servicesGenerator: 'src/generators/servicesGenerator.js',
  'townMap.glyphAssign': 'src/domain/townMap/glyphAssign.js',
  'townScene.customBuildingPresentation': 'src/domain/townScene/customBuildingPresentation.js',
  tradeGoods: 'src/generators/economy/tradeGoods.js',
  'worldPulse.piety': 'src/domain/worldPulse/piety.js',
});

/**
 * Fields whose declared consumer evidence is NOT proven by any consumer file.
 *
 * EMPTY — and the floor is now zero. SHRINK-ONLY: never add a row to make a red
 * go away; a field whose evidence is fiction is a bug in the change that
 * introduced it, and the honesty test below deletes any row that stops earning
 * its place.
 *
 * It held four faction rows on the day this walker landed (2026-07-26), all one
 * design fact: custom FACTIONS never reach generation, so the manifest's
 * consumers described an INTENT. Both pairs were cleared rather than excused.
 *   - factions.controls / factions.rivals declared `dependencyEngine.
 *     relationshipRead`, which is real for the stressors' disables* fields but
 *     names nothing for factions (dependencyEngine.js has no such token). They
 *     now declare `compendium.dependencies` — Dependencies.jsx, which really
 *     does render both keys and derive their reverse links.
 *   - factions.agenda / factions.methods were stored by the authoring surface
 *     and shown nowhere. They are now rendered by CustomItemAttributes.jsx, so
 *     the `compendium` evidence they always declared is finally true.
 */
const FIELD_EVIDENCE_EXEMPT = Object.freeze({});

/** Manifest fields as { id, key, consumers }. */
function manifestFields() {
  const manifest = JSON.parse(readFileSync(join(REPO_ROOT, MANIFEST), 'utf8'));
  const fields = [];
  for (const category of manifest.categories) {
    for (const field of category.fields || []) {
      fields.push({
        id: `${category.key}.${field.key}`,
        key: field.key,
        consumers: field.consumers || [],
      });
    }
  }
  return fields;
}

const sourceCache = new Map();
/** @param {string} relative @returns {string} */
function fileText(relative) {
  if (!sourceCache.has(relative)) {
    sourceCache.set(relative, readFileSync(join(REPO_ROOT, relative), 'utf8'));
  }
  return sourceCache.get(relative);
}

/** Every file a consumer name resolves to. */
function filesFor(name) {
  const entry = CONSUMER_SITES[name];
  if (!entry) return [];
  return Array.isArray(entry) ? entry : [entry];
}

/** True when any of the field's consumer files mentions its key as a token. */
function evidenceFound(field) {
  const escaped = field.key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const token = new RegExp(`(?<![\\w$])${escaped}(?![\\w$])`);
  return field.consumers
    .flatMap((name) => filesFor(name))
    .some((file) => token.test(fileText(file)));
}

describe('THE CONSUMER-EVIDENCE WALKER (declared evidence must be real)', () => {
  const fields = manifestFields();
  const declared = [...new Set(fields.flatMap((field) => field.consumers))].sort();

  test('the manifest census is non-trivial (the reader did not silently break)', () => {
    // Floor guard: if the manifest shape changes under this test, the census
    // would collapse and every assertion below would pass vacuously.
    expect(fields.length).toBeGreaterThanOrEqual(80);
    expect(declared.length).toBeGreaterThanOrEqual(25);
    expect(fields.every((field) => field.consumers.length > 0)).toBe(true);
  });

  test('every declared consumer name resolves — and there are no ghost rows', () => {
    // Exact equality in both directions. A NEW consumer name in the manifest with
    // no row here lands on the left; a row here for a consumer the manifest no
    // longer declares lands on the right. Both are edits to CONSUMER_SITES above.
    expect(declared).toEqual(Object.keys(CONSUMER_SITES).sort());
  });

  test('every resolved consumer file EXISTS on disk', () => {
    const missing = [...new Set(Object.values(CONSUMER_SITES).flat())]
      .filter((file) => !existsSync(join(REPO_ROOT, file)))
      .sort();
    // A consumer file that was renamed or deleted lands here. Update its row in
    // CONSUMER_SITES to the module that reads the field now — or, if nothing
    // reads it any more, that field's evidence is stale and the manifest is wrong.
    expect(
      missing,
      `\nDeclared consumer files that do not exist:\n  ${missing.join('\n  ')}\n`,
    ).toEqual([]);
  });

  test('every field is READ by at least one of its declared consumers', () => {
    const unproven = fields
      .filter((field) => !FIELD_EVIDENCE_EXEMPT[field.id])
      .filter((field) => !evidenceFound(field))
      .map((field) => `${field.id}  [declared: ${field.consumers.join(', ')}]`)
      .sort();
    // A field whose declared consumer evidence is fiction lands here. Either wire
    // the field into a real consumer, or correct the manifest's consumers array
    // to name the module that actually reads it. Adding a FIELD_EVIDENCE_EXEMPT
    // row is NOT a legal move for a newly-introduced field.
    expect(
      unproven,
      `\nFields whose declared consumer evidence is not proven by any consumer file:\n  ${unproven.join('\n  ')}\n`,
    ).toEqual([]);
  });

  test('the exempt list is honest — every row still needs to be there', () => {
    const stale = Object.keys(FIELD_EVIDENCE_EXEMPT)
      .filter((id) => {
        const field = fields.find((candidate) => candidate.id === id);
        return !field || evidenceFound(field);
      })
      .sort();
    // A row whose field is now genuinely read (or was deleted) lands here.
    // Delete the row — that is the shrink. Without this test the exempt list
    // would accumulate permanent headroom.
    expect(
      stale,
      `\nFIELD_EVIDENCE_EXEMPT rows that are no longer needed — delete them:\n  ${stale.join('\n  ')}\n`,
    ).toEqual([]);
  });

  test('positive control — the evidence check really discriminates', () => {
    // A distinctive key present in its consumer passes...
    expect(
      evidenceFound({ id: 'deities.alignmentAxis', key: 'alignmentAxis', consumers: ['deitySnapshot'] }),
    ).toBe(true);
    expect(
      evidenceFound({ id: 'deities.domain', key: 'domain', consumers: ['dispositionProfile'] }),
    ).toBe(true);
    // ...and a key absent from that same consumer fails, so a green result above
    // is a real read and not an artifact of the scan always returning true.
    expect(
      evidenceFound({ id: 'probe.absent', key: 'definitelyNotAFieldName', consumers: ['deitySnapshot'] }),
    ).toBe(false);
    // An unresolvable consumer contributes no files, so it can never prove a field.
    expect(evidenceFound({ id: 'probe.unmapped', key: 'name', consumers: ['noSuchConsumer'] })).toBe(false);
  });
});
