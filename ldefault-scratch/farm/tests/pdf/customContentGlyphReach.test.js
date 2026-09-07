/**
 * @vitest-environment node
 *
 * customContentGlyphReach.test.js -- DOES A FIELD REACH THE SURFACE IT CLAIMS,
 * AND DOES THE WALL SEE WHAT THE RENDERER WOULD PRINT.
 *
 * The charset table's per-field `surfaces` lists are HAND-DECLARED in
 * schema/custom-content.manifest.json. Everything else in that table is derived
 * from the renderers' own bytes; the surface lists are the one place a human
 * opinion enters, and an opinion is exactly the thing that goes stale. A field
 * that REACHES the dossier while declaring it does not is a hole in the wall:
 * nothing checks its codepoints, and a name the font cannot draw prints as a
 * substituted letter in a paid document.
 *
 * THE METHOD IS A SENTINEL CENSUS, not a claim. Every free-text field the
 * manifest classifies is given a unique ASCII sentinel inside the reference
 * pack, ONE dossier is rendered, and the rendered element tree is read back for
 * each sentinel. A sentinel that arrives is a MEASURED reach. Two directions,
 * and they are not symmetrical:
 *
 *   REACHED BUT NOT DECLARED -> a DEFECT, asserted hard. The wall is not
 *     checking a field whose characters a reader will see.
 *   DECLARED BUT NOT REACHED -> a FINDING (design 8.7 R7), pinned as a MEASURED
 *     census rather than softened. Over-declaration makes the wall stricter than
 *     the product needs; it is a manifest edit for the owner's desk, never a
 *     reason to weaken this file. Some rows are honestly conditional: the
 *     dossier prints a field only when the world gives it a place to appear.
 *
 * WHY THE RENDER AND NOT A SOURCE SCAN: a source scan sees literals. Custom
 * content arrives as DATA, and the dossier composes it at render time. GLYPH's
 * own docblock records the whole history of that mistake.
 */

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import fs from 'node:fs';
import zlib from 'node:zlib';
import React from 'react';
import { beforeAll, describe, expect, it } from 'vitest';
import { Font, renderToBuffer } from '@react-pdf/renderer';

import { CUSTOM_CONTENT_CHARSET } from '../../src/domain/content/customContentCharset.generated.js';
import { validateCustomContentCharset } from '../../src/domain/content/customContentCharset.js';
import { getCustomContentField } from '../../src/domain/content/customContentManifest.js';
import { customContentReferencePack } from '../fixtures/customContentReferencePack.js';

// The same Node shim GLYPH uses: fontkit cannot open theme.js's font URLs, and
// the first registration wins.
const FONT_DIR = join(dirname(fileURLToPath(import.meta.url)), '../../public/fonts');
Font.register({
  family: 'Lora',
  fonts: [
    { src: join(FONT_DIR, 'Lora-Regular.ttf'), fontWeight: 400 },
    { src: join(FONT_DIR, 'Lora-Bold.ttf'), fontWeight: 700 },
    { src: join(FONT_DIR, 'Lora-Italic.ttf'), fontWeight: 400, fontStyle: 'italic' },
    { src: join(FONT_DIR, 'Lora-BoldItalic.ttf'), fontWeight: 700, fontStyle: 'italic' },
  ],
});
Font.register({
  family: 'Nunito',
  fonts: [
    { src: join(FONT_DIR, 'Nunito-Regular.ttf'), fontWeight: 400 },
    { src: join(FONT_DIR, 'Nunito-Bold.ttf'), fontWeight: 700 },
    { src: join(FONT_DIR, 'Nunito-ExtraBold.ttf'), fontWeight: 800 },
    { src: join(FONT_DIR, 'Nunito-Italic.ttf'), fontWeight: 400, fontStyle: 'italic' },
  ],
});

// TWO city dossiers, and the census is their UNION. One world cannot separate
// "this field never reaches the dossier" from "this world gave it no place to
// appear", and reporting the first when only the second was measured would put a
// false over-declaration on the owner's desk.
const WORLD = {
  settType: 'metropolis',
  culture: 'mediterranean',
  terrain: 'coastal',
  tradeRouteAccess: 'port',
};
const WORLD_B = {
  settType: 'city',
  culture: 'norse',
  terrain: 'river',
  tradeRouteAccess: 'crossroads',
};
const SEED = 'charset-reach-a';
const SEED_B = 'charset-reach-b';

/** Element-tree text leaves. The same walk GLYPH and traditionsSection use. */
function collectText(node, out = []) {
  if (node == null || typeof node === 'boolean') return out;
  if (typeof node === 'string' || typeof node === 'number') { out.push(String(node)); return out; }
  if (Array.isArray(node)) { for (const n of node) collectText(n, out); return out; }
  if (typeof node === 'object') {
    if (typeof node.type === 'function') {
      try { return collectText(node.type(node.props), out); } catch { return out; }
    }
    return collectText(node.props?.children, out);
  }
  return out;
}

/** Embedded iff a FontFile is reachable through FontDescriptor/DescendantFonts. */
function descriptorEmbedded(raw, body, depth = 0) {
  if (depth > 3) return false;
  if (/\/FontFile\d?\s/.test(body)) return true;
  for (const r of body.matchAll(/\/(?:FontDescriptor|DescendantFonts)\s*\[?\s*(\d+)\s+0\s+R/g)) {
    if (raw[r[1]] && descriptorEmbedded(raw, raw[r[1]], depth + 1)) return true;
  }
  return false;
}

/** Every text-showing operation, tagged with the font it runs under. */
function nonEmbeddedRuns(buf) {
  const latin1 = buf.toString('latin1');
  const raw = {};
  for (const m of latin1.matchAll(/(\d+)\s+0\s+obj([\s\S]*?)endobj/g)) raw[m[1]] = m[2];
  const fonts = {};
  for (const [num, body] of Object.entries(raw)) {
    const bf = /\/BaseFont\s*\/([A-Za-z0-9+\-,._]+)/.exec(body);
    if (bf) fonts[num] = { base: bf[1], embedded: descriptorEmbedded(raw, body) };
  }
  const alias = {};
  for (const res of latin1.matchAll(/\/Font\s*<<([^>]*)>>/g)) {
    for (const pair of res[1].matchAll(/\/(F\d+)\s+(\d+)\s+0\s+R/g)) {
      if (fonts[pair[2]]) alias[pair[1]] = fonts[pair[2]];
    }
  }
  const streams = [];
  for (const m of latin1.matchAll(/stream\r?\n/g)) {
    const start = m.index + m[0].length;
    const end = latin1.indexOf('endstream', start);
    if (end < 0) continue;
    try {
      streams.push(zlib.inflateSync(Buffer.from(latin1.slice(start, end), 'latin1')).toString('latin1'));
    } catch { /* a font file or an image, not a Flate content stream */ }
  }
  const runs = [];
  const tok = /\/(F\d+)\s+[\d.]+\s+Tf|\(((?:\\.|[^()\\])*)\)\s*Tj|\[((?:\\.|[^\]\\])*)\]\s*TJ/g;
  for (const stream of streams) {
    let cur = null;
    let t;
    while ((t = tok.exec(stream))) {
      if (t[1]) { cur = alias[t[1]] ?? { base: `UNMAPPED:${t[1]}`, embedded: false }; continue; }
      runs.push({ font: cur, payload: t[2] === undefined ? t[3] : t[2] });
    }
    tok.lastIndex = 0;
  }
  return { total: runs.length, bad: runs.filter(run => !run.font?.embedded) };
}

const sentinelFor = (bucket, field) => `Zqx${bucket}${field}Qzx`;

/**
 * The reference pack with one unique ASCII sentinel per classified free-text
 * field. A field whose manifest spec carries a closed `values` list cannot hold
 * a sentinel by construction and is skipped, and so is one whose cap the
 * sentinel would breach.
 */
function sentinelPack() {
  const pack = JSON.parse(JSON.stringify(customContentReferencePack()));
  const injected = [];
  const skipped = [];
  for (const [bucket, fields] of Object.entries(CUSTOM_CONTENT_CHARSET.fields)) {
    const entry = (pack[bucket] || [])[0];
    if (!entry) { skipped.push(`${bucket}.* (no reference entry)`); continue; }
    for (const [field, cls] of Object.entries(fields)) {
      const spec = getCustomContentField(bucket, field);
      const sentinel = sentinelFor(bucket, field);
      if (spec?.values) { skipped.push(`${bucket}.${field} (closed vocabulary)`); continue; }
      const value = entry[field];
      if (typeof value === 'string') {
        const next = `${value} ${sentinel}`;
        if (cls.maxCodepoints !== null && Array.from(next).length > cls.maxCodepoints) {
          skipped.push(`${bucket}.${field} (cap ${cls.maxCodepoints})`);
          continue;
        }
        entry[field] = next;
      } else if (Array.isArray(value)) {
        entry[field] = [...value, sentinel];
      } else {
        skipped.push(`${bucket}.${field} (absent from the reference pack)`);
        continue;
      }
      injected.push({ bucket, field, sentinel });
    }
  }
  return { pack, injected, skipped };
}

/**
 * MEASURED 2026-09-05 on CHARSET Car 2's tip, over BOTH worlds
 * (metropolis/mediterranean/coastal/port at `charset-reach-a` and
 * city/norse/river/crossroads at `charset-reach-b`), which agreed exactly. Each
 * row DECLARES `dossier-pdf` in schema/custom-content.manifest.json and reached
 * NEITHER rendered dossier. FOURTEEN fields declare `dossier-pdf`; ten are here,
 * and the FOUR that did arrive are institutions.name, institutions.category,
 * institutions.description and resources.name. (An earlier cut of this docblock
 * and of the commit body that landed it said "ten of fifteen" and named five
 * arrivals; the declared set is fourteen and the arrivals are four -- counted,
 * not remembered.)
 *
 * WHAT THIS LIST IS NOT. It is not a proof of over-declaration. This instrument
 * cannot separate "the manifest claims a reach the dossier does not have" from
 * "the reference entry was never adopted into either world, so no field of it
 * could arrive". Both are consistent with the measurement, and telling them apart
 * needs the executed reach map (WRWALKER's `surfaceClassesOf`), which does not
 * exist in this tree yet. So this is a REPORTED census, per design 8.7 R7: a
 * disagreement is a manifest edit for the owner's desk, never a test that gets
 * softened. Editing the manifest on this evidence alone would make the wall
 * looser on a paid surface, which is the wrong direction to guess in.
 */
const DECLARED_NOT_REACHED = Object.freeze([
  'deities.domain',
  'deities.name',
  'institutions.tags',
  'resources.description',
  'services.description',
  'services.name',
  'tradeGoods.description',
  'tradeGoods.name',
  'traditions.epithet',
  'traditions.name',
]);

describe('the charset table and the dossier agree about what reaches the page', () => {
  let tree = '';
  let injected = [];
  let skipped = [];

  beforeAll(async () => {
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const { normalizeSettlement } = await import('../../src/domain/normalizeSettlement.js');
    const { SettlementPDF } = await import('../../src/pdf/SettlementPDF.jsx');
    const built = sentinelPack();
    injected = built.injected;
    skipped = built.skipped;
    const treeFor = (world, seed) => {
      const settlement = normalizeSettlement(
        generateSettlementPipeline(world, null, { seed, customContent: built.pack }),
      );
      return collectText(React.createElement(SettlementPDF, { settlement })).join(' ');
    };
    tree = `${treeFor(WORLD, SEED)} ${treeFor(WORLD_B, SEED_B)}`;
  }, 120000);

  it('the census is not vacuous: sentinels were injected and a dossier was built', () => {
    expect(injected.length).toBeGreaterThan(20);
    expect(tree.length).toBeGreaterThan(10000);
    // The control sentinel: institutions.name is the one field nobody disputes
    // reaches the dossier. If THIS is absent the render is wrong, not the manifest.
    expect(tree).toContain(sentinelFor('institutions', 'name'));
  });

  it('no field reaches the dossier without declaring it', () => {
    const undeclared = injected
      .filter(row => tree.includes(row.sentinel))
      .filter(row => !CUSTOM_CONTENT_CHARSET.fields[row.bucket][row.field].surfaces.includes('dossier-pdf'))
      .map(row => `${row.bucket}.${row.field}`);
    expect(
      undeclared,
      'these fields PRINT in the dossier and the charset wall is not checking them',
    ).toEqual([]);
  });

  it('the declared-but-unreached census is exactly what was measured', () => {
    const missing = injected
      .filter(row => CUSTOM_CONTENT_CHARSET.fields[row.bucket][row.field].surfaces.includes('dossier-pdf'))
      .filter(row => !tree.includes(row.sentinel))
      .map(row => `${row.bucket}.${row.field}`)
      .sort();
    console.log(`[reach] injected=${injected.length} skipped=${skipped.length} `
      + `declared-not-reached=${JSON.stringify(missing)} skipped-rows=${JSON.stringify(skipped)}`);
    expect(missing, 'R7: report the disagreement, do not soften the arm').toEqual([...DECLARED_NOT_REACHED]);
  });
});

describe('the wall sees what the renderer would print', () => {
  const HOSTILE_NAME = 'Aurora 影 Provisioners ⚔ ✦ →';

  it('CONTROL: the reference pack passes the wall with no findings at all', () => {
    const pack = customContentReferencePack();
    const findings = [];
    for (const [bucket, entries] of Object.entries(pack)) {
      for (const entry of entries) {
        findings.push(...validateCustomContentCharset(bucket, entry, CUSTOM_CONTENT_CHARSET).rejections);
      }
    }
    expect(findings.map(finding => `${finding.field}:${finding.code}`)).toEqual([]);
  });

  it('HOSTILE: the wall names exactly the four codepoints the dossier cannot draw', () => {
    const { rejections } = validateCustomContentCharset(
      'institutions', { name: HOSTILE_NAME }, CUSTOM_CONTENT_CHARSET,
    );
    expect(rejections.map(entry => entry.codepoint)).toEqual(['U+5F71', 'U+2694', 'U+2726', 'U+2192']);
    for (const entry of rejections) {
      expect(entry.code).toBe('uncovered_codepoint');
      expect(entry.surface).toBe('dossier-pdf');
      expect(entry.char).toHaveLength(1);
    }
  });

  it('AFTER THE FACT: the same pack, wall bypassed, prints with a NON-EMBEDDED font', async () => {
    // The arm that proves the wall is load-bearing rather than decorative. Nothing
    // in the product bypasses the wall; this test does, and the renderer then does
    // exactly what GLYPH measured -- it substitutes a base-14 face and truncates.
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const { normalizeSettlement } = await import('../../src/domain/normalizeSettlement.js');
    const { SettlementPDF } = await import('../../src/pdf/SettlementPDF.jsx');
    const pack = customContentReferencePack();
    pack.institutions[0].name = HOSTILE_NAME;
    const settlement = normalizeSettlement(
      generateSettlementPipeline(WORLD, null, { seed: SEED, customContent: pack }),
    );
    const buf = await renderToBuffer(React.createElement(SettlementPDF, { settlement }));
    const { total, bad } = nonEmbeddedRuns(buf);
    expect(total).toBeGreaterThan(500);
    expect(bad.length, 'the renderer substituted a non-embedded face, as the wall said it would')
      .toBeGreaterThan(0);
  }, 120000);
});

describe('the on-disk faces are the ones the table was derived from', () => {
  it('the dossier-pdf input roster equals the public/fonts listing', () => {
    const onDisk = fs.readdirSync(FONT_DIR).filter(name => name.toLowerCase().endsWith('.ttf')).sort();
    const declared = [...CUSTOM_CONTENT_CHARSET.surfaces['dossier-pdf'].inputs]
      .map(input => input.split('/').pop())
      .sort();
    expect(declared).toEqual(onDisk);
  });
});
