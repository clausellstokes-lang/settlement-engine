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
  styleUnsupportedFields,
} from '../../supabase/functions/style-overhaul/styleOverhaulCore.ts';
import {
  CACHE_MARKER, CACHE_MIN_PREFIX_TOKENS, estimateTokens,
} from '../../supabase/functions/_shared/anthropicCache.ts';
import { buildSurfaceCharter } from '../../supabase/functions/_shared/aiCharterBundle.js';
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

  // WAVE L-4 (docs/DESIGN_AI_CAPABILITY_LADDER.md): the prefix TEACHES and CACHES. The
  // vocabulary here is the REAL buildStyleVocabulary the client posts, so this floor
  // assertion is measured against the production prefix, not a fixture.
  it('leads with the styleOverhaul charter and clears the provider cache floor', () => {
    const prefix = styleStaticPrefix(VOCAB);
    const charter = buildSurfaceCharter('styleOverhaul');
    expect(prefix.startsWith(charter.split('\n')[0])).toBe(true);
    expect(prefix).toContain(charter);
    expect(prefix.split(CACHE_MARKER).length - 1).toBe(1);
    expect(prefix.endsWith(CACHE_MARKER)).toBe(true);
    const cached = prefix.slice(0, -CACHE_MARKER.length);
    expect(estimateTokens(cached)).toBeGreaterThanOrEqual(CACHE_MIN_PREFIX_TOKENS);
    // This charter is the smallest of the five, so the deterministic stabilizer pays the
    // rest of the way to the floor. Byte-stable filler: the same prefix on every request.
    expect(cached).toContain('[CACHE-STABILIZER');
    expect(styleStaticPrefix(VOCAB)).toBe(prefix);
  });
});

describe('style overhaul — coerce keeps only style fields (PIN 2)', () => {
  it('drops any field outside the known style shape', () => {
    const c = coerceStyleCandidate({ background: '#111', svg: '<g/>', palette: { water: '#222' }, evil: 'x' });
    expect(Object.keys(c).sort()).toEqual(['background', 'palette']);
    expect(STYLE_FIELDS).toContain('palette');
    expect(STYLE_FIELDS).not.toContain('svg');
  });

  // FINDING F-A (DESIGN_AI_CAPABILITY_LADDER.md): the edge contract and the client wall are two
  // separately-authored lists of the same field set, so they can silently drift apart. When they
  // do, EVERY contract-conforming response shows the user a spurious rejected row. This pin binds
  // the two lists behaviourally, so a field added to STYLE_FIELDS cannot ship unrecognized.
  it('every STYLE_FIELDS name the compiler may emit is RECOGNIZED by the client wall', () => {
    const unknownToWall = STYLE_FIELDS.filter((f) => validateBespokeStyle({ [f]: 'probe' })
      .violations.some((v) => v.field === f && v.reason === 'unsupported_field'));
    expect(
      unknownToWall,
      `\nedge contract fields the client wall drops as unknown: ${unknownToWall.join(', ')}\n`,
    ).toEqual([]);
    // negative control: the probe genuinely detects an unrecognized field
    expect(validateBespokeStyle({ svg: 'probe' }).violations)
      .toContainEqual({ field: 'svg', reason: 'unsupported_field' });
  });

  // FINDING F-C (DESIGN_AI_CAPABILITY_LADDER.md §4c, closed in wave L-WIRE): the subset
  // relation above was satisfied by a list that was simply too SMALL. glyphSet and seasonBias
  // are posted by buildStyleVocabulary, taught by the charter, and accepted by the wall, yet
  // STYLE_FIELDS omitted them, so coerceStyleCandidate stripped exactly the fields the prompt
  // had asked for and the genre door was unreachable through the AI path. The subset pin
  // cannot see a missing field by construction, so the two are named here directly and then
  // exercised end to end.
  it('THE GENRE DOOR: glyphSet + seasonBias survive the edge coercion and pass the wall (F-C)', () => {
    expect(STYLE_FIELDS).toContain('glyphSet');
    expect(STYLE_FIELDS).toContain('seasonBias');

    // Real values, taken from the live vocabulary rather than hand-typed, so a genre pack
    // renaming a glyph set id reds here instead of shipping a schema nobody can satisfy.
    const glyphSet = VOCAB.glyphSets[0];
    const seasonBias = 'autumn';
    expect(typeof glyphSet).toBe('string');

    // 1. the edge no longer strips them
    const candidate = coerceStyleCandidate({ background: '#101820', glyphSet, seasonBias });
    expect(candidate.glyphSet).toBe(glyphSet);
    expect(candidate.seasonBias).toBe(seasonBias);
    // 2. and the edge raises no verdict about them (L-6 would otherwise spend a repair round
    //    asking the model to withdraw a field the charter told it to use)
    expect(styleUnsupportedFields({ background: '#101820', glyphSet, seasonBias })).toEqual([]);
    // 3. and the client wall accepts what the edge forwarded, with no violation
    const walled = validateBespokeStyle(candidate, { id: 'bespoke:genre' });
    expect(walled.violations).toEqual([]);
    expect(walled.style.glyphSet).toBe(glyphSet);
    expect(walled.style.seasonBias).toBe(seasonBias);

    // negative controls, both directions: an out-of-vocabulary value is still refused by the
    // wall (SELECT-only, never generative), and the dormancy law still holds when neither
    // field is named.
    expect(validateBespokeStyle({ glyphSet: 'not-a-glyph-set' }).violations)
      .toContainEqual({ field: 'glyphSet', reason: 'not_in_vocab' });
    expect(validateBespokeStyle({ seasonBias: 'harvest' }).violations)
      .toContainEqual({ field: 'seasonBias', reason: 'not_in_vocab' });
    const plain = validateBespokeStyle({ background: '#101820' }).style;
    expect('glyphSet' in plain).toBe(false);
    expect('seasonBias' in plain).toBe(false);
  });

  // styleRiderTags reads baseLens / background / furniture and nothing else, so widening
  // STYLE_FIELDS cannot move the LENS ROADMAP RADAR. Pinned rather than reasoned, because a
  // silent radar shift would be read later as a change in what users ask for.
  it('the lens-radar tags are UNMOVED by the two new fields', () => {
    const base = { baseLens: 'darkFantasy', background: '#0a0a12', furniture: ['grid', 'scaleBar'] };
    expect(styleRiderTags({ ...base, glyphSet: VOCAB.glyphSets[0], seasonBias: 'winter' }, VOCAB))
      .toEqual(styleRiderTags(base, VOCAB));
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
