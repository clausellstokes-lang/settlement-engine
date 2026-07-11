/**
 * faithWarGate.test.js — W4f. THE PDF "Faith & War" premium/campaign gate.
 *
 * The non-negotiable privacy guarantee, mirroring the screen's FaithSection seam:
 * a FREE / LAPSED / ANON export must NEVER carry the Faith & War chapter — and so
 * never a deity name — even for a canonized, deity-carrying settlement. The gate
 * is `faithUnlocked` (the premium result the export surface passes); the default
 * is the safe one (false).
 *
 * Pinned here as the pure composition (faithChapterVisible) so the gate is proven
 * without rendering react-pdf, PLUS a demonstration that the live-world slice DOES
 * carry the deity name — proving the gate (not a data absence) is what protects
 * privacy.
 */
import { describe, it, expect } from 'vitest';
import { faithChapterVisible, PDF_VARIANTS } from '../../src/pdf/variants.js';
import { buildPdfLiveWorld } from '../../src/pdf/lib/liveWorld.js';

const DEITY_NAME = 'Varisha the Ember Crown';
const deitySettlement = () => ({
  id: 's1',
  name: 'Emberhold',
  config: {
    primaryDeitySnapshot: {
      name: DEITY_NAME, rankAxis: 'major', alignmentAxis: 'evil',
      temperamentAxis: 'warlike', domain: 'forge and conquest',
    },
  },
});

describe('faithChapterVisible — the premium/campaign gate', () => {
  const base = { variant: 'canon_dossier', phase: 'canon', hasLiveWorld: true, narrated: false, eventCount: 0 };

  it('a free / lapsed / anon export (faithUnlocked=false) NEVER shows the chapter', () => {
    expect(faithChapterVisible({ ...base, faithUnlocked: false })).toBe(false);
  });

  it('the default (no faithUnlocked passed) is the safe one — hidden', () => {
    expect(faithChapterVisible({ ...base })).toBe(false);
  });

  it('a premium export (faithUnlocked=true) of a canon settlement with a live slice shows it', () => {
    expect(faithChapterVisible({ ...base, faithUnlocked: true })).toBe(true);
  });

  it('is canon-only — a draft-phase export never shows it even for premium', () => {
    expect(faithChapterVisible({ ...base, phase: 'draft', faithUnlocked: true })).toBe(false);
  });

  it('is variant-gated — draft_brief / timeline_packet never include it', () => {
    expect(faithChapterVisible({ ...base, variant: 'draft_brief', faithUnlocked: true })).toBe(false);
    expect(faithChapterVisible({ ...base, variant: 'timeline_packet', faithUnlocked: true })).toBe(false);
  });

  it('the campaign_state variant includes it under the same gate', () => {
    expect(faithChapterVisible({ ...base, variant: 'campaign_state', faithUnlocked: true })).toBe(true);
    expect(faithChapterVisible({ ...base, variant: 'campaign_state', faithUnlocked: false })).toBe(false);
  });

  it('requires a live slice — a dormant (null liveWorld) export shows nothing', () => {
    expect(faithChapterVisible({ ...base, hasLiveWorld: false, faithUnlocked: true })).toBe(false);
  });
});

describe('variants — campaign_state is registered with if-canon faithWar', () => {
  it('exposes the campaign_state variant', () => {
    expect(PDF_VARIANTS.campaign_state).toBeTruthy();
    expect(PDF_VARIANTS.campaign_state.chapters.faithWar).toBe('if-canon');
  });
  it('draft_brief / timeline_packet exclude faithWar', () => {
    expect(PDF_VARIANTS.draft_brief.chapters.faithWar).toBe(false);
    expect(PDF_VARIANTS.timeline_packet.chapters.faithWar).toBe(false);
  });
});

describe('buildPdfLiveWorld — the gate is load-bearing (data is present; the gate hides it)', () => {
  it('carries the deity name for a deity-carrying settlement (even off-campaign)', () => {
    const lw = buildPdfLiveWorld({ settlement: deitySettlement(), campaign: null });
    expect(lw).not.toBeNull();
    expect(lw.deity).toBeTruthy();
    expect(lw.deity.name).toBe(DEITY_NAME);
    // Axis fields carried through verbatim (never a legacy tier/alignment).
    expect(lw.deity.rankAxis).toBe('major');
    expect(lw.deity.alignmentAxis).toBe('evil');
  });

  it('is null (byte-identical off-state) for a peaceful, deity-free, non-campaign settlement', () => {
    const lw = buildPdfLiveWorld({ settlement: { id: 's2', name: 'Quiet Vale', config: {} }, campaign: null });
    expect(lw).toBeNull();
  });

  it('PRIVACY: a free/anon canon export of the deity settlement hides the chapter (gate=false) though the slice holds the name', () => {
    const lw = buildPdfLiveWorld({ settlement: deitySettlement(), campaign: null });
    // The slice DOES carry the deity name...
    expect(lw?.deity?.name).toBe(DEITY_NAME);
    // ...but the gate is what a free/anon export flips off ⇒ no chapter, no name.
    const visibleFree = faithChapterVisible({
      variant: 'canon_dossier', phase: 'canon', hasLiveWorld: !!lw, faithUnlocked: false,
    });
    expect(visibleFree).toBe(false);
    const visiblePremium = faithChapterVisible({
      variant: 'canon_dossier', phase: 'canon', hasLiveWorld: !!lw, faithUnlocked: true,
    });
    expect(visiblePremium).toBe(true);
  });
});
