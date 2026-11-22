/**
 * customContentCharsetRestoreSplit.test.js -- THE PROMISE ON THE RESTORE PATH.
 *
 * ⛔ WHAT THIS FILE EXISTS TO STOP, and it is a measured mechanism rather than a
 * fear. `accountImportBody.js` routes every pre-v3 account export's content pack
 * through `parseContentPack -> prepareImport -> defaultItemValidation -> the rich
 * adapter`, and `prepareImport` is ATOMIC: one rejected entry and the caller
 * reports "N invalid entries need review; no custom content was imported". Light
 * the charset wall to `refuse` without a split and a single legacy codepoint in
 * one institution name loses a paying user their ENTIRE library on restore. The
 * owner ruled it at CS-9: an import of a user's own export is a RESTORE path,
 * never an authoring act.
 *
 * ⭐ THE FIXTURE THE DESIGN NAMED NO LONGER CONVICTS, and saying so is the point.
 * The design and the lane brief both reach for `Kovačević` as the legacy name a
 * lit wall would refuse. At this tip it is CLEAN: §894 embedded Lora in the two
 * paid books, the campaign-pdf and world-book sets moved to 776 codepoints, and
 * the transliteration debt it was standing for is cured. A restore-split test
 * written to that letter would pass with the wall fully consulted and prove
 * nothing at all. So the hostile fixture here is `影`, measured uncovered on
 * `dossier-pdf` at this tip, and the plant below proves the wall is load-bearing
 * rather than asleep.
 *
 * THE WALL IS A VALUE, NOT AN AMBIENT. The strongest arm in this file hands the
 * restore lane a wall whose `validate` THROWS. A restore that survives it did
 * not consult the wall -- not consulted and forgiven, but never asked.
 */

import { describe, expect, it } from 'vitest';
import {
  buildContentPack,
  parseContentPack,
  prepareImport,
} from '../../src/lib/contentPacks.js';
import {
  loadCustomContentCharsetWall,
} from '../../src/domain/content/customContentManifest.js';
import {
  CUSTOM_CONTENT_CHARSET,
} from '../../src/domain/content/customContentCharset.generated.js';
import {
  validateCustomContentCharset,
} from '../../src/domain/content/customContentCharset.js';

/** A codepoint measured OUTSIDE the dossier face intersection at this tip. */
const HOSTILE = 'Aurora 影 Provisioners';

/**
 * The generated table with its door turned, so the refusal behaviour is provable
 * without lighting the manifest. The policy VALUE is what drives the verdict, and
 * that is exactly what these arms read.
 *
 * @returns {Record<string, unknown>} a refusing table
 */
function refusingTable() {
  return {
    ...CUSTOM_CONTENT_CHARSET,
    policy: { ...CUSTOM_CONTENT_CHARSET.policy, enforcement: 'refuse' },
  };
}

/** A legacy library: one hostile name, two clean siblings. */
function legacyLibrary() {
  return {
    institutions: [
      { name: HOSTILE, localUid: 'lu_hostile' },
      { name: 'Kovačević Hall', localUid: 'lu_legacy' },
      { name: 'Plain Guild', localUid: 'lu_plain' },
    ],
  };
}

describe('the charset wall and the two import lanes', () => {
  it('the door in the table is what decides, and the table at this tip is dark', () => {
    expect(CUSTOM_CONTENT_CHARSET.policy.enforcement).toBe('report');
    expect(refusingTable().policy.enforcement).toBe('refuse');
  });

  it('the hostile fixture is genuinely uncovered and the design fixture is not', () => {
    // ANTI-VACUITY, and the finding that made this file rewrite its fixture. If
    // the hostile name ever reads zero, every refusal arm below is passing on an
    // empty set and proving nothing.
    const hostile = validateCustomContentCharset(
      'institutions', { name: HOSTILE }, CUSTOM_CONTENT_CHARSET,
    ).rejections;
    expect(hostile.map(entry => entry.code)).toEqual(['uncovered_codepoint']);
    expect(hostile[0].codepoint).toBe('U+5F71');
    expect(hostile[0].surface).toBe('dossier-pdf');
    const legacy = validateCustomContentCharset(
      'institutions', { name: 'Kovačević Hall' }, CUSTOM_CONTENT_CHARSET,
    ).rejections;
    expect(legacy).toEqual([]);
  });

  it('a foreign shared pack under refuse loses the hostile entry and keeps the rest', async () => {
    const wall = await loadCustomContentCharsetWall(refusingTable());
    const parsed = parseContentPack(buildContentPack(legacyLibrary()));
    expect(parsed.ok).toBe(true);
    const prepared = prepareImport(parsed.pack, { authoring: true, charset: wall });
    expect(prepared.diagnostics.authoring).toBe(true);
    expect(prepared.rejected.map(entry => entry.name)).toEqual([HOSTILE]);
    expect(prepared.rejected[0].errors.join(' ')).toContain('uncovered_codepoint');
    // The atomic skip still applies to a FOREIGN pack: the importer is told.
    expect(prepared.diagnostics.atomic).toBe(false);
    expect(prepared.items).toHaveLength(2);
  });

  it('the same pack on the restore lane imports every entry under refuse', async () => {
    const wall = await loadCustomContentCharsetWall(refusingTable());
    const parsed = parseContentPack(buildContentPack(legacyLibrary()));
    const prepared = prepareImport(parsed.pack, {
      authoring: false,
      charset: wall,
      existingByPackEntry: {},
    });
    expect(prepared.diagnostics.authoring).toBe(false);
    expect(prepared.rejected).toEqual([]);
    expect(prepared.diagnostics.atomic).toBe(true);
    expect(prepared.items).toHaveLength(3);
    expect(prepared.items.map(entry => entry.item.name)).toContain(HOSTILE);
  });

  it('the restore lane never CONSULTS the wall, proved by a wall that explodes', async () => {
    // The strongest form of the claim. A forgiving wall and an unasked wall look
    // identical in a verdict; only a wall that cannot be called tells them apart.
    const exploding = {
      enforcement: 'refuse',
      table: refusingTable(),
      validate: () => { throw new Error('the restore path consulted the charset wall'); },
    };
    const parsed = parseContentPack(buildContentPack(legacyLibrary()));
    const prepared = prepareImport(parsed.pack, { authoring: false, charset: exploding });
    expect(prepared.rejected).toEqual([]);
    expect(prepared.items).toHaveLength(3);
    // and the same wall on the authoring lane DOES get called, so the arm above
    // is a measurement of the split rather than of a broken fixture.
    expect(() => prepareImport(parsed.pack, { authoring: true, charset: exploding }))
      .toThrow('the restore path consulted the charset wall');
  });

  it('a legacy library survives export and restore byte for byte', async () => {
    const wall = await loadCustomContentCharsetWall(refusingTable());
    const library = legacyLibrary();
    const exported = buildContentPack(library);
    const parsed = parseContentPack(exported);
    const restored = prepareImport(parsed.pack, { authoring: false, charset: wall });
    const names = restored.items.map(entry => String(entry.item.name)).sort();
    expect(names).toEqual(library.institutions.map(entry => entry.name).sort());
  });

  it('the default lane is authoring, so a caller cannot fall into blindness', async () => {
    // The split must fail in the SAFE direction: forgetting the option gives you
    // the wall, never the hole.
    const wall = await loadCustomContentCharsetWall(refusingTable());
    const parsed = parseContentPack(buildContentPack(legacyLibrary()));
    const prepared = prepareImport(parsed.pack, { charset: wall });
    expect(prepared.diagnostics.authoring).toBe(true);
    expect(prepared.rejected).toHaveLength(1);
  });
});
