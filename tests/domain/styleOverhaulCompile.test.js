/**
 * tests/domain/styleOverhaulCompile.test.js — the AI STYLE-OVERHAUL compiler + additive-save
 * pins (Surveyor task #28 phase 2 / DESIGN_CONTENT_PLANE §7).
 *
 *   PIN 1 (STATIC-FIRST): the design corpus (schema wall) is a byte-stable prefix — cache-priceable.
 *   PIN 2 (COERCE): the edge coerce keeps ONLY known style fields (a first structural wall pass).
 *   PIN 3 (LENS RADAR): style-domain rider tags are DERIVED deterministically (zero-AI).
 *   PIN 4 (aiOperationLog): the record carries hashes + field count, never the color values/prompt.
 *   PIN 5 (ADDITIVE SAVE + FLIP-BACK): bespoke styles are additive, re-selectable; the four base
 *     lenses stay resolvable; a deleted/absent bespoke never strands the map.
 *   PIN 6 (CROSS-LENS EDIT PIN EXTENDS): a semantic mapEdit renders identically under a bespoke
 *     style — the same shifted geometry, whatever the skin.
 */
import { describe, it, expect } from 'vitest';
import {
  STYLE_FIELDS, styleStaticPrefix, buildStylePrompt, parseStyleAnswer,
  coerceStyleCandidate, styleRiderTags, compileStyleOverhaul, styleLogRecord,
} from '../../supabase/functions/style-overhaul/styleOverhaulCore.ts';
import { buildRetrievalBundle } from '../../supabase/functions/ai-analyst/analystCore.ts';
import { validateBespokeStyle, buildStyleVocabulary } from '../../src/design/townMapStyleWall.js';
import {
  addBespokeStyle, readBespokeStyle, listBespokeStyles, removeBespokeStyle, resolveActiveStyle, isBaseLensId,
} from '../../src/domain/townMap/bespokeStyles.js';
import { buildTownMapModel } from '../../src/domain/townMap/index.js';
import { buildTownMapDrawList } from '../../src/domain/townMap/townMapDraw.js';
import { withPinNudge } from '../../src/domain/townMap/mapEdits.js';
import { resolveTownMapStyle } from '../../src/design/townMapStyles.js';
import { makeTownFixture, GOLDEN_CONFIGS } from '../fixtures/townMapFixtures.js';

const VOCAB = buildStyleVocabulary();
const bundle = buildRetrievalBundle([{ id: 'dossier:districts', source: 'read:settlement.public', title: 'Districts', data: [{ id: 'd1', category: 'merchant' }] }]);

describe('style overhaul — static-first prompt (PIN 1)', () => {
  it('the STATIC PREFIX (design corpus) is byte-identical across two different requests', () => {
    const b2 = buildRetrievalBundle([{ id: 'x', source: 'read:y', data: [{ id: 'z' }] }]);
    const p1 = buildStylePrompt('make it neon cyberpunk', VOCAB, bundle, 'Town: A', 'canary-A', { maxSlices: 4, maxChars: 500 });
    const p2 = buildStylePrompt('warm autumn watercolor', VOCAB, b2, 'Town: B', 'canary-B', { maxSlices: 4, maxChars: 500 });
    const prefix = styleStaticPrefix(VOCAB);
    expect(p1.startsWith(prefix)).toBe(true);
    expect(p2.startsWith(prefix)).toBe(true);
    expect(p1.slice(prefix.length)).not.toBe(p2.slice(prefix.length));
    expect(prefix).toContain('DESIGN CORPUS');
    expect(prefix).toContain('parchment, watercolor, darkFantasy, vtt');
    // the truth law is stated in the static prefix
    expect(prefix).toContain('skins the DISPLAY, never the substance');
  });
});

describe('style overhaul — coerce keeps only style fields (PIN 2)', () => {
  it('drops any field outside the known style shape', () => {
    const c = coerceStyleCandidate({ background: '#111', svg: '<g/>', palette: { water: '#222' }, evil: 'x' });
    expect(Object.keys(c).sort()).toEqual(['background', 'palette']);
    expect(STYLE_FIELDS).toContain('palette');
    expect(STYLE_FIELDS).not.toContain('svg');
  });

  it('parseStyleAnswer degrades non-JSON to no style + a musing (never a throw)', () => {
    const out = parseStyleAnswer('I think a dark vellum would suit this grim place.');
    expect(out.style).toBeNull();
    expect(Array.isArray(out.musings)).toBe(true);
  });
});

describe('style overhaul — deterministic lens radar tags (PIN 3)', () => {
  it('derives baseLens/paletteFamily/motifClass from the candidate, not a self-report', () => {
    const tags = styleRiderTags({ baseLens: 'darkFantasy', background: '#0a0a12', furniture: ['grid', 'scaleBar'] }, VOCAB);
    expect(tags.baseLens).toBe('darkFantasy');
    expect(tags.paletteFamily).toBe('dark');
    expect(tags.motifClass).toBe('functional');
    // an out-of-vocab base lens degrades to 'none'
    expect(styleRiderTags({ baseLens: 'holographic', background: '#eeeeee', furniture: ['wash'] }, VOCAB).baseLens).toBe('none');
  });
});

describe('style overhaul — aiOperationLog (PIN 4)', () => {
  it('carries hashes + field count, and NO color values / prompt', () => {
    const candidate = coerceStyleCandidate({ background: '#SECRETCOLOR'.slice(0, 7), palette: { water: '#abcdef' } });
    const rec = styleLogRecord({ prompt: 'a private prompt', bundle, model: 'claude-haiku-4-5', modelVersion: 'anthropic-2023-06-01', answerText: 'x', candidate });
    expect(rec.field_count).toBe(2);
    const blob = JSON.stringify(rec);
    expect(blob).not.toContain('abcdef');
    expect(blob).not.toContain('private prompt');
    expect(rec.audience).toBe('dm');
  });
});

describe('style overhaul — additive save + flip-back (PIN 5)', () => {
  const built = validateBespokeStyle({ background: '#0a0a12', label: 'Neon Noir', palette: { water: '#00e5ff' } }, { id: 'bespoke:noir' }).style;
  const built2 = validateBespokeStyle({ background: '#f4efe4', label: 'Soft Dawn' }, { id: 'bespoke:dawn' }).style;

  it('adding a bespoke style is additive; base ids can never be shadowed', () => {
    let col = addBespokeStyle(null, 'bespoke:noir', built);
    col = addBespokeStyle(col, 'bespoke:dawn', built2);
    expect(listBespokeStyles(col).map((s) => s.id)).toEqual(['bespoke:dawn', 'bespoke:noir']);
    expect(readBespokeStyle(col, 'bespoke:noir').label).toBe('Neon Noir');
    // a base id cannot be saved as a bespoke (the four lenses are permanent)
    const shadow = addBespokeStyle(col, 'parchment', built);
    expect(shadow.parchment).toBeUndefined();
    expect(isBaseLensId('parchment')).toBe(true);
  });

  it('resolveActiveStyle: bespoke id → its def; base id / absent id → base lens (flip-back always available)', () => {
    const col = addBespokeStyle(null, 'bespoke:noir', built);
    expect(resolveActiveStyle('bespoke:noir', col)).toBe(built);        // the saved artifact
    expect(resolveActiveStyle('watercolor', col).id).toBe('watercolor'); // base lens still available
    expect(resolveActiveStyle('bespoke:deleted', col).id).toBe('parchment'); // stale bespoke never strands
    // remove is non-destructive: flip-back to a base lens still works
    const after = removeBespokeStyle(col, 'bespoke:noir');
    expect(readBespokeStyle(after, 'bespoke:noir')).toBeNull();
    expect(resolveActiveStyle('parchment', after).id).toBe('parchment');
  });
});

describe('style overhaul — the cross-lens edit pin EXTENDS to bespoke (PIN 6)', () => {
  // A style-independent geometry signature (type + positions only), furniture stripped.
  const geomSig = (op) => {
    switch (op.t) {
      case 'poly': return `poly:${op.closed}:${op.pts.map((p) => p.join(',')).join(' ')}`;
      case 'line': return `line:${op.x1},${op.y1},${op.x2},${op.y2}`;
      case 'circle': return `circle:${op.cx},${op.cy},${op.r}`;
      case 'rect': return `rect:${op.x},${op.y},${op.w},${op.h},${op.rx || 0}`;
      case 'path': return `path:${op.d}`;
      default: return `?:${op.t}`;
    }
  };
  const bareSig = (model, styleOrId) => buildTownMapDrawList(model, { ...resolveTownMapStyle(styleOrId), furniture: [] }).map(geomSig).join('|');

  it('a semantic pin nudge renders the SAME shifted geometry under a bespoke style as under parchment', () => {
    const bespoke = validateBespokeStyle({ background: '#0a0a12', palette: { water: '#00e5ff', ink: '#e0f7ff' }, contrast: 'high' }, { id: 'bespoke:neon' }).style;
    const settlement = GOLDEN_CONFIGS[10].settlement;
    const base = buildTownMapModel(settlement);
    // find a real anchor to nudge
    const anchor = buildTownMapDrawList(base, resolveTownMapStyle('parchment')).find((o) => o.anchorKey)?.anchorKey
      || base?.buildings?.[0]?.anchorKey || 'district:merchant';
    const edited = buildTownMapModel(settlement, withPinNudge(null, anchor, 37, -21));
    // the edit actually moved geometry (parchment)
    expect(bareSig(edited, 'parchment')).not.toBe(bareSig(base, 'parchment'));
    // and it renders IDENTICALLY under the bespoke style (geometry is untouched by any skin)
    expect(bareSig(edited, bespoke)).toBe(bareSig(edited, 'parchment'));
    // sanity: a base lens agrees too
    expect(bareSig(edited, 'vtt')).toBe(bareSig(edited, 'parchment'));
  });
});
