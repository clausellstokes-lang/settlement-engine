/**
 * AE-1 — the Bound Book substrate is closed, frozen, and behavior-neutral.
 * Adoption belongs to later waves; these pins make the vocabulary safe to use.
 */
import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  color,
  legacy,
  motion,
  MOTION,
  MOTION_PRIMITIVES,
  PARCHMENT_STEPS,
  semantic,
  type,
  emitCssTokens,
} from '../../src/design/tokens.js';
import {
  ARTWORK_SURFACE_MANIFEST,
  CHIP_KINDS,
  READER_SURFACE_MANIFEST,
  SEAM_IDS,
  SEAM_KINDS,
  SURFACE_REGISTER_IDS,
  SURFACE_REGISTERS,
  VOICE_FLOORS,
} from '../../src/design/boundBook.js';
import { MOTION_DURATION, MOTION_EASE } from '../../src/design/organic/motion.js';

function channel(c) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const n = Number.parseInt(/^#([0-9a-f]{6})$/i.exec(hex)[1], 16);
  return 0.2126 * channel((n >> 16) & 255)
    + 0.7152 * channel((n >> 8) & 255)
    + 0.0722 * channel(n & 255);
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function expectDeepFrozen(value) {
  if (!value || typeof value !== 'object') return;
  expect(Object.isFrozen(value)).toBe(true);
  for (const child of Object.values(value)) expectDeepFrozen(child);
}

describe('Bound Book parchment and motion tokens', () => {
  it('defines exactly three distinct authored parchment steps', () => {
    expect(Object.keys(PARCHMENT_STEPS)).toEqual(['page', 'card', 'nested']);
    expect(PARCHMENT_STEPS).toEqual({
      page: color['parchment-50'],
      card: color['parchment-100'],
      nested: color['parchment-200'],
    });
    expect(new Set(Object.values(PARCHMENT_STEPS)).size).toBe(3);
    expectDeepFrozen(PARCHMENT_STEPS);
  });

  it('keeps the pre-adoption semantic and legacy surfaces byte-identical', () => {
    expect(semantic.pageBg).toBe('#FBF5E6');
    expect(semantic.cardBg).toBe('#FBF5E6');
    expect(legacy.PARCH).toBe('#FBF5E6');
    expect(legacy.CARD).toBe('#FFFBF5');
    expect(legacy.CARD_ALT).toBe('#FAF6EF');
    expect(legacy.CARD_HDR).toBe('#FAF4E8');
    expect(Object.keys(motion)).toEqual(['quick', 'base', 'page', 'ambient']);
  });

  it('keeps body and named status text AA on both raised steps', () => {
    const foregrounds = ['ink-900', 'ink-600', 'gold-800', 'slate-700', 'red-600', 'green-700', 'amber-700'];
    for (const step of ['card', 'nested']) {
      for (const foreground of foregrounds) {
        expect(
          contrast(color[foreground], PARCHMENT_STEPS[step]),
          `${foreground} must clear AA on ${step}`,
        ).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it('defines exactly the four surface motions with dignified static parity', () => {
    expect(Object.keys(MOTION).sort()).toEqual(['none', 'reveal', 'scrub', 'settle']);
    expect(MOTION.none).toMatchObject({ owner: 'static', durationMs: 0, iterations: 1, staticComposition: 'present' });
    expect(MOTION.settle).toMatchObject({ owner: 'time', durationMs: 320, iterations: 1, staticComposition: 'settled', translateYPx: 6 });
    expect(MOTION.reveal).toMatchObject({ owner: 'time', durationMs: 640, iterations: 1, staticComposition: 'resolved' });
    expect(MOTION.scrub).toMatchObject({ owner: 'scroll', durationMs: null, iterations: 1, staticComposition: 'poster' });
    expect(Object.values(MOTION).map((row) => row.easing)).toEqual([
      'linear',
      'cubic-bezier(.2,.7,.3,1)',
      'cubic-bezier(0.22,1,0.36,1)',
      'linear',
    ]);
    expectDeepFrozen(MOTION);
  });

  it('centralizes the live paper-physics values without changing their CSS projection', () => {
    expect(MOTION_DURATION).toBe(MOTION_PRIMITIVES.duration);
    expect(MOTION_EASE).toBe(MOTION_PRIMITIVES.easing);
    const vars = readFileSync(resolve(process.cwd(), 'src/styles/organicVars.css'), 'utf8');
    for (const [name, value] of Object.entries(MOTION_DURATION)) {
      expect(vars).toContain(`--oc-motion-${name}: ${value};`);
    }
    for (const [name, value] of Object.entries(MOTION_EASE)) {
      expect(vars).toContain(`--oc-ease-${name}: ${value};`);
    }
  });

  it('projects every new surface token exactly without inventing a scrub duration', () => {
    const emitted = new Map();
    vi.stubGlobal('document', { documentElement: null });
    try {
      emitCssTokens({ style: { setProperty: (name, value) => emitted.set(name, value) } });
    } finally {
      vi.unstubAllGlobals();
    }

    expect(Object.fromEntries([...emitted].filter(([name]) => name.startsWith('--parchment-step-')))).toEqual({
      '--parchment-step-page': PARCHMENT_STEPS.page,
      '--parchment-step-card': PARCHMENT_STEPS.card,
      '--parchment-step-nested': PARCHMENT_STEPS.nested,
    });
    expect(emitted.get('--motion-none-duration')).toBe('0ms');
    expect(emitted.get('--motion-none-easing')).toBe('linear');
    expect(emitted.get('--motion-settle-duration')).toBe('320ms');
    expect(emitted.get('--motion-settle-easing')).toBe(MOTION.settle.easing);
    expect(emitted.get('--motion-settle-translate-y')).toBe('6px');
    expect(emitted.get('--motion-reveal-duration')).toBe('640ms');
    expect(emitted.get('--motion-reveal-easing')).toBe(MOTION.reveal.easing);
    expect(emitted.has('--motion-scrub-duration')).toBe(false);
    expect(emitted.get('--motion-scrub-easing')).toBe('linear');
    expect([...emitted.keys()].filter((name) => name.startsWith('--motion-')).sort()).toEqual([
      '--motion-none-duration',
      '--motion-none-easing',
      '--motion-reveal-duration',
      '--motion-reveal-easing',
      '--motion-scrub-easing',
      '--motion-settle-duration',
      '--motion-settle-easing',
      '--motion-settle-translate-y',
    ]);
  });
});

describe('Bound Book policy maps', () => {
  it('closes and deep-freezes the surface-register vocabulary', () => {
    expect(SURFACE_REGISTER_IDS).toEqual(['chrome', 'parchment', 'manuscript', 'ceremonial']);
    expect(VOICE_FLOORS).toEqual(['ui', 'plain', 'chronicle', 'covenant']);
    expect(CHIP_KINDS).toEqual(['label', 'date', 'statusBand', 'count', 'operatorScalar']);
    expect(Object.keys(SURFACE_REGISTERS)).toEqual(SURFACE_REGISTER_IDS);
    expectDeepFrozen(SURFACE_REGISTERS);

    for (const [index, id] of SURFACE_REGISTER_IDS.entries()) {
      const row = SURFACE_REGISTERS[id];
      expect(row.rank).toBe(index);
      expect(VOICE_FLOORS).toContain(row.voiceFloor);
      expect(row.typeRoles.every((role) => role in type)).toBe(true);
      expect(row.chips.visible.every((chip) => CHIP_KINDS.includes(chip))).toBe(true);
      expect(row.chips.titleGlossOnly.every((chip) => CHIP_KINDS.includes(chip))).toBe(true);
    }
    expect(SURFACE_REGISTERS).toEqual({
      chrome: {
        rank: 0,
        voiceFloor: 'ui',
        typeRoles: ['ui-l', 'ui-m', 'ui-s', 'mono'],
        chips: { visible: ['label', 'date', 'statusBand', 'count', 'operatorScalar'], titleGlossOnly: [] },
      },
      parchment: {
        rank: 1,
        voiceFloor: 'plain',
        typeRoles: ['display-m', 'prose-m', 'ui-m', 'ui-s'],
        chips: { visible: ['label', 'date', 'statusBand', 'count', 'operatorScalar'], titleGlossOnly: [] },
      },
      manuscript: {
        rank: 2,
        voiceFloor: 'chronicle',
        typeRoles: ['display-m', 'prose-l', 'prose-m', 'ui-s'],
        chips: { visible: ['label', 'date', 'statusBand'], titleGlossOnly: ['count', 'operatorScalar'] },
      },
      ceremonial: {
        rank: 3,
        voiceFloor: 'covenant',
        typeRoles: ['display-xl', 'display-l', 'prose-l', 'ui-s'],
        chips: { visible: ['label', 'date', 'statusBand'], titleGlossOnly: ['count', 'operatorScalar'] },
      },
    });
  });

  it('makes raw scalar chips gloss-only above parchment', () => {
    for (const id of ['chrome', 'parchment']) {
      expect(SURFACE_REGISTERS[id].chips.visible).toContain('operatorScalar');
      expect(SURFACE_REGISTERS[id].chips.visible).toContain('count');
    }
    for (const id of ['manuscript', 'ceremonial']) {
      expect(SURFACE_REGISTERS[id].chips).toEqual({
        visible: ['label', 'date', 'statusBand'],
        titleGlossOnly: ['count', 'operatorScalar'],
      });
    }
  });

  it('closes the seam grammar and keeps edge parked and unused', () => {
    expect(SEAM_IDS).toEqual(['letterbox', 'feather', 'plate', 'edge']);
    expect(Object.keys(SEAM_KINDS)).toEqual(SEAM_IDS);
    expect(SEAM_KINDS.edge.status).toBe('parked');
    expect(ARTWORK_SURFACE_MANIFEST.some((row) => row.seam === 'edge')).toBe(false);
    expectDeepFrozen(SEAM_KINDS);
  });

  it('pins unique, live owners and valid declarations in both manifests', () => {
    const rows = [...ARTWORK_SURFACE_MANIFEST, ...READER_SURFACE_MANIFEST];
    expect(new Set(rows.map((row) => row.id)).size).toBe(rows.length);
    for (const row of rows) {
      const source = readFileSync(resolve(process.cwd(), row.ownerPath), 'utf8');
      expect(source, `${row.ownerPath} must contain ${row.ownerSelector}`).toContain(row.ownerSelector);
    }
    for (const row of ARTWORK_SURFACE_MANIFEST) {
      expect(SEAM_IDS).toContain(row.seam);
      expect(Object.keys(MOTION)).toContain(row.motion);
      expect(row.staticComposition).toBe(MOTION[row.motion].staticComposition);
    }
    for (const row of READER_SURFACE_MANIFEST) {
      expect(SURFACE_REGISTER_IDS).toContain(row.surfaceRegister);
      expect(Object.keys(MOTION)).toContain(row.motion);
      expect(row.staticComposition).toBe(MOTION[row.motion].staticComposition);
    }
    expectDeepFrozen(ARTWORK_SURFACE_MANIFEST);
    expectDeepFrozen(READER_SURFACE_MANIFEST);
  });
});
