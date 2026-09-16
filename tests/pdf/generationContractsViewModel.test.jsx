/**
 * @vitest-environment jsdom
 *
 * Owner-PDF projection for the generation contracts. A narrative overlay is
 * allowed to replace presentation prose, never the canonical culture or final
 * coherence receipt carried by the underlying save.
 */

import { describe, expect, it } from 'vitest';
import { IdentityDailyLife } from '../../src/pdf/sections/IdentityDailyLife.jsx';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';

function collectText(node, out = []) {
  if (node == null || typeof node === 'boolean') return out;
  if (typeof node === 'string' || typeof node === 'number') {
    out.push(String(node));
    return out;
  }
  if (Array.isArray(node)) {
    node.forEach(child => collectText(child, out));
    return out;
  }
  if (typeof node === 'object') {
    if (typeof node.type === 'function') {
      return collectText(node.type(node.props), out);
    }
    return collectText(node.props?.children, out);
  }
  return out;
}

const culturalIdentity = {
  key: 'latin',
  label: 'Latin-inspired',
  scope: 'A masonry, civic-square, patronage-and-law design grammar.',
  builtForm: 'Courtyard buildings gather around a public square.',
  civicPattern: 'Councils and magistrates negotiate public office.',
  exchangePattern: 'Contracts and warehouses support commerce.',
  foodways: 'Bread, pulses, and garden produce anchor the table.',
  sacredLife: 'Shrines and processions shape the public calendar.',
  defensePattern: 'Masonry walls are maintained as civic infrastructure.',
  socialTexture: 'Office, family, and patronage overlap.',
  architecturalDetail: 'Arcaded market fronts define the square.',
};

const FORMAL_JUDGMENT_IDS = [
  'hard_structural_validity',
  'cross_system_semantic_agreement',
  'user_intent_fulfillment',
  'narrative_realization',
  'dramatic_tension',
  'diversity_and_repetition',
  'confidence_and_provenance',
];

const generationCoherenceReceipt = {
  version: 1,
  status: 'coherent',
  seed: 'pdf-generation-contract',
  worldLawVersion: 1,
  cultureProfile: 'latin',
  contentProfile: 'grounded',
  checks: [
    {
      id: 'template_tokens',
      label: 'Narrative templates resolved',
      status: 'pass',
      findings: [],
    },
  ],
  judgments: FORMAL_JUDGMENT_IDS.map(id => ({
    id,
    label: id.replace(/_/g, ' '),
    status: id === 'dramatic_tension' ? 'pass_with_tension' : 'pass',
    scope: 'single_settlement',
    summary: `${id} is supported by final-dossier evidence.`,
    findings: [],
    evidence: [{
      path: id,
      detail: 'The final dossier was inspected.',
    }],
  })),
  repairs: [],
  authoredTensions: [],
};

const settlement = {
  name: 'Portico',
  tier: 'town',
  culturalIdentity,
  culturalNotes: 'Office, family, and patronage overlap.',
  generationCoherenceReceipt,
};

describe('owner PDF generation-contract projection', () => {
  it('keeps canonical contract facts when a partial AI overlay is selected', () => {
    const vm = buildViewModel({
      settlement,
      aiSettlement: { name: 'Narrated Portico', tier: 'town' },
      narrativeMode: true,
    });

    expect(vm.narrativeMode).toBe(true);
    expect(vm.identity.name).toBe('Narrated Portico');
    expect(vm.identity.culturalIdentity).toMatchObject(culturalIdentity);
    expect(vm.identity.culturalIdentity.sourceKeys).toEqual([]);
    expect(vm.identity.generationCoherence).toMatchObject({
      status: 'coherent',
      worldLawVersion: 1,
      cultureProfile: 'latin',
      contentProfile: 'grounded',
      passedChecks: 1,
      totalChecks: 1,
      supportedJudgments: 7,
      totalJudgments: 7,
      reviewJudgments: 0,
      findingCount: 0,
    });
    expect(vm.identity.anchor.culturalNotes).toBe(settlement.culturalNotes);
  });

  it('renders the cultural identity and coherence summary into the DM chapter', () => {
    const vm = buildViewModel({ settlement });
    const text = collectText(
      IdentityDailyLife({ settlement, narrativeMode: false, vm }),
    ).join(' | ');

    expect(text).toContain('CULTURAL IDENTITY');
    expect(text).toContain('Latin-inspired');
    expect(text).toContain('Arcaded market fronts define the square.');
    expect(text).toContain('GENERATION COHERENCE');
    expect(text).toContain('1/1 checks passed');
    expect(text).toContain('7/7 formal judgments supported');
  });

  it('keeps legacy v1 receipts readable when judgments were not recorded', () => {
    const legacySettlement = {
      ...settlement,
      generationCoherenceReceipt: {
        ...generationCoherenceReceipt,
        judgments: undefined,
      },
    };
    const vm = buildViewModel({ settlement: legacySettlement });

    expect(vm.identity.generationCoherence).toMatchObject({
      judgments: [],
      supportedJudgments: 0,
      totalJudgments: 0,
      reviewJudgments: 0,
    });
  });
});
