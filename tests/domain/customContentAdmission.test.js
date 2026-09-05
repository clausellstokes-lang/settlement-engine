/**
 * Parity pins for the compact first-paint admission contract.
 *
 * The rich authoring adapter may add review labels, but it must never disagree
 * with the compact persistence wall about accepted data or error ordering.
 *
 * ⭐ ONE NAMED EXCEPTION, and it is by design (CHARSET R4). The eager compact
 * wall does not see charset, and must not: it rides the entry chunk, and no
 * first-paint byte may ask whether a font can draw a codepoint. So when the rich
 * adapter is handed a charset wall AND that wall is refusing, the two verdicts
 * diverge on exactly the charset findings and on nothing else. The divergence is
 * pinned below rather than left to be rediscovered as a parity bug.
 */

import { describe, expect, it } from 'vitest';

import {
  admitCustomContentDefinitionShape,
} from '../../src/domain/content/customContentAdmission.js';
import {
  admitCustomContentDefinition,
  loadCustomContentCharsetWall,
} from '../../src/domain/content/customContentManifest.js';
import {
  CUSTOM_CONTENT_CHARSET,
} from '../../src/domain/content/customContentCharset.generated.js';

function withoutRichLabels(admission) {
  return {
    ...admission,
    fieldLabels: [],
  };
}

describe('compact custom-content admission', () => {
  it.each([
    {
      name: 'unknown bucket',
      bucket: 'starships',
      value: { name: 'Wayfarer' },
      options: {},
    },
    {
      name: 'non-object definition',
      bucket: 'resources',
      value: ['ore'],
      options: {},
    },
    {
      name: 'missing required field',
      bucket: 'resources',
      value: { scarcity: 'scarce' },
      options: {},
    },
    {
      name: 'unknown field',
      bucket: 'resources',
      value: { name: 'Star iron', warpYield: 10 },
      options: {},
    },
    {
      name: 'invalid enum',
      bucket: 'resources',
      value: { name: 'Star iron', scarcity: 'mythic-plus' },
      options: {},
    },
    {
      name: 'admitted persistence envelope',
      bucket: 'resources',
      value: {
        name: 'Star iron',
        localUid: '  local-star-iron  ',
        isCustom: true,
      },
      options: { allowSystemFields: true },
    },
    {
      name: 'invalid persistence identity',
      bucket: 'resources',
      value: { name: 'Star iron', localUid: '   ' },
      options: { allowSystemFields: true },
    },
    {
      name: 'partial editor definition',
      bucket: 'resources',
      value: { scarcity: 'scarce' },
      options: { requireRequired: false },
    },
  ])('matches rich admission for $name', ({ bucket, value, options }) => {
    const compact = admitCustomContentDefinitionShape(bucket, value, options);
    const rich = admitCustomContentDefinition(bucket, value, options);

    expect(compact).toEqual(withoutRichLabels(rich));
    expect(compact.entry).toBe(compact.definition);
  });
});

describe('the one place the rich adapter is allowed to disagree', () => {
  it('diverges from the compact wall on charset findings and nothing else', async () => {
    // A name whose only defect is a codepoint the dossier face set cannot draw.
    const bucket = 'institutions';
    const value = { name: 'Aurora 影 Provisioners' };
    const compact = admitCustomContentDefinitionShape(bucket, value, {});
    const dark = admitCustomContentDefinition(bucket, value, {});
    // Under no wall at all the doctrine holds unchanged.
    expect(compact).toEqual(withoutRichLabels(dark));

    const refusing = await loadCustomContentCharsetWall({
      ...CUSTOM_CONTENT_CHARSET,
      policy: { ...CUSTOM_CONTENT_CHARSET.policy, enforcement: 'refuse' },
    });
    const rich = admitCustomContentDefinition(bucket, value, { charset: refusing });
    expect(compact.ok).toBe(true);
    expect(rich.ok).toBe(false);
    // and the whole of the disagreement is the charset list.
    expect(rich.charset.map(entry => entry.code)).toEqual(['uncovered_codepoint']);
    expect(rich.errors.map(entry => entry.code)).toEqual(['uncovered_codepoint']);
    const withoutCharset = { ...rich, ok: true, errors: compact.errors };
    delete withoutCharset.charset;
    delete withoutCharset.charsetMarks;
    expect(compact).toEqual(withoutRichLabels(withoutCharset));
  });

  it('stays byte-identical to the compact wall while the door reads report', async () => {
    // THE DORMANCY CONTROL. The same hostile value, the SHIPPED table: the
    // findings ride beside the verdict and the verdict does not move.
    const reporting = await loadCustomContentCharsetWall();
    expect(reporting.enforcement).toBe('report');
    const bucket = 'institutions';
    const value = { name: 'Aurora 影 Provisioners' };
    const compact = admitCustomContentDefinitionShape(bucket, value, {});
    const rich = admitCustomContentDefinition(bucket, value, { charset: reporting });
    expect(rich.ok).toBe(compact.ok);
    expect(rich.errors).toEqual(compact.errors);
    expect(rich.charset).toHaveLength(1);
  });
});
