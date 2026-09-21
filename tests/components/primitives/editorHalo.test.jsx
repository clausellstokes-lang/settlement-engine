/** @vitest-environment jsdom */
/**
 * editorHalo — EM-D0c's acceptance battery: ONE optional boolean prop on two SHARED primitives,
 * defaulted false, and with it absent the three shipped consumers' markup does not move by a byte.
 *
 * ⛔ THE THREE CAPTURES BELOW WERE TAKEN FROM THE PRE-CHANGE SOURCE (§8 step 2) and are asserted
 * as BYTE IDENTITIES. A literal that was never green against the unedited primitives cannot enter
 * this file, and the build's gate script re-proves it by PLANTING the pre-change source back over
 * the edited one and running these arms again. Never adjust a capture to make an arm green: a red
 * here is the negative control failing, which is STOP condition 3.
 *
 * ⛔ ONE TOKEN IS NORMALIZED, AND ONLY ONE (§9 A2, measured): BottomSheet calls useId() and renders
 * the value twice into the OPENED sheet (aria-labelledby on the section, id on the heading), and
 * React's client id counter is a module-level global that advances on every render in the module.
 * So the opened sheet is rewritten /_r_[0-9a-z]+_/g to _ID_ on BOTH sides, and the label
 * relationship the token used to carry is asserted POSITIVELY in its place. The desktop popup and
 * the CLOSED sheet carry no such token at all, measured, so neither is normalized.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';

import BottomSheet from '../../../src/components/primitives/BottomSheet.jsx';
import PortablePopup from '../../../src/components/primitives/PortablePopup.jsx';
import { BORDER, EDITOR_GROUND, ELEV, GOLD, PARCH_100, houseBloom } from '../../../src/components/theme.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const POPUP_REL = 'src/components/primitives/PortablePopup.jsx';
const SHEET_REL = 'src/components/primitives/BottomSheet.jsx';

/** The one token no packet can hold still, rewritten on BOTH sides and in nothing else. */
const normalizeId = (markup) => markup.replace(/_r_[0-9a-z]+_/g, '_ID_');

/**
 * The expectation routed through the SAME CSS parser the assertion reads from. jsdom keeps
 * color-mix() verbatim but rewrites a hex inside a gradient to its rgb() form, so a raw source
 * string would be comparing two spellings of one value. This compares the value.
 */
const cssValue = (prop, value) => {
  const probe = document.createElement('div');
  probe.style[prop] = value;
  return probe.style[prop];
};

/** THE THREE CAPTURES, taken from the PRE-CHANGE source. */
const CAPTURE = Object.freeze({
  popup: '<div role="presentation" class="oc-m-warmdim" data-testid="causality-popup-scrim" data-popup-convention="outside-click" style="position: fixed; inset: 0px; z-index: 300; display: flex; align-items: center; justify-content: center; padding: 16px; background: rgba(27, 20, 8, 0.58);"><section role="dialog" aria-modal="true" aria-label="Why this happened" tabindex="-1" data-testid="causality-popup" style="max-height: min(88vh, 720px); overflow: auto; border: 1px solid rgb(200, 184, 154); border-radius: 0px; background: rgb(255, 251, 245); box-shadow: none;"><header style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-bottom: 1px solid rgb(240, 229, 200); background: rgb(250, 246, 239);"><span style="flex: 1 1 0%; color: rgb(44, 34, 16); font-family: &quot;Nunito&quot;, system-ui, sans-serif; font-size: 9px; font-weight: 850; text-transform: uppercase; letter-spacing: 0.06em;">Why this happened</span><button type="button" aria-label="Close Why this happened" title="Close Why this happened" class="oc-m-press sf-btn" style="display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; padding: 0px; --sf-btn-bg: var(--oc-btn-fill); --sf-btn-hover-bg: #fffbf5; color: var(--oc-btn-ink); border: 1px solid var(--oc-btn-border); border-radius: 4px; cursor: pointer; opacity: 1; transition: background 120ms, border-color 120ms;"><span aria-hidden="true" style="font-size: 13px; line-height: 1; font-weight: 700;">×</span></button></header><div style="padding: 12px; color: rgb(27, 20, 8); font-family: &quot;Nunito&quot;, system-ui, sans-serif; font-size: 10px;"><p>The road failed.</p></div></section></div>',
  sheetGallery: Object.freeze({
    closed: '<button type="button" class="oc-m-press sf-btn" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px; width: 100%; min-height: 40px; padding: 8px 12px; border: 1px solid var(--oc-btn-border); border-radius: 4px; --sf-btn-bg: var(--oc-btn-fill); color: var(--oc-btn-ink); font-family: &quot;Nunito&quot;, system-ui, sans-serif; font-size: 12px; font-weight: 800; cursor: pointer; opacity: 1; box-shadow: none; transition: background 120ms ease-out, box-shadow 120ms ease-out, opacity 120ms ease-out; white-space: nowrap;" aria-haspopup="dialog" aria-expanded="false">Filters<span style="display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border: 1px solid rgb(200, 184, 154); border-radius: 8px; background: rgb(250, 246, 239); color: rgb(156, 128, 104); font-family: &quot;Nunito&quot;, system-ui, sans-serif; font-size: 10px; font-weight: 800; line-height: 1.2; white-space: nowrap;">2</span></button>',
    opened: '<button type="button" class="oc-m-press sf-btn" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px; width: 100%; min-height: 40px; padding: 8px 12px; border: 1px solid var(--oc-btn-border); border-radius: 4px; --sf-btn-bg: var(--oc-btn-fill); color: var(--oc-btn-ink); font-family: &quot;Nunito&quot;, system-ui, sans-serif; font-size: 12px; font-weight: 800; cursor: pointer; opacity: 1; box-shadow: none; transition: background 120ms ease-out, box-shadow 120ms ease-out, opacity 120ms ease-out; white-space: nowrap;" aria-haspopup="dialog" aria-expanded="true">Filters<span style="display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border: 1px solid rgb(200, 184, 154); border-radius: 8px; background: rgb(250, 246, 239); color: rgb(156, 128, 104); font-family: &quot;Nunito&quot;, system-ui, sans-serif; font-size: 10px; font-weight: 800; line-height: 1.2; white-space: nowrap;">2</span></button><div role="presentation" style="position: fixed; inset: 0px; z-index: 300; display: flex; flex-direction: column; justify-content: flex-end; background: rgba(27, 20, 8, 0.46);"><section role="dialog" aria-modal="true" aria-labelledby="_ID_" tabindex="-1" style="width: 100%; max-height: 85vh; display: flex; flex-direction: column; border-top: 1px solid rgb(200, 184, 154); border-top-left-radius: 8px; border-top-right-radius: 8px; background: rgb(255, 251, 245); box-shadow: 0 12px 32px rgba(27,20,8,0.18); animation: sf-sheet-up 180ms ease-out;"><header style="display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-bottom: 1px solid rgb(200, 184, 154); background: rgb(250, 246, 239); border-top-left-radius: 8px; border-top-right-radius: 8px;"><h2 id="_ID_" style="flex: 1 1 0%; min-width: 0px; margin: 0px; color: rgb(27, 20, 8); font-family: &quot;Nunito&quot;, system-ui, sans-serif; font-size: 15px; line-height: 1.25; font-weight: 900;">Filters</h2><button type="button" aria-label="Close" style="border: medium; background: transparent; color: rgb(156, 128, 104); cursor: pointer; min-width: 44px; min-height: 44px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;"><span aria-hidden="true" style="font-size: 17px; line-height: 1; font-weight: 700; color: rgb(74, 59, 34);">×</span></button></header><div style="overflow-y: auto; padding: 16px 16px calc(16px + env(0px * , * safe-area-inset-bottom));"><p>Sheet body</p></div></section></div>',
  }),
  sheetLibrary: Object.freeze({
    closed: '<button type="button" class="oc-m-press sf-btn" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-height: 40px; padding: 8px 12px; border: 1px solid rgb(201, 162, 76); border-radius: 4px; --sf-btn-bg: #F3E7C6; color: rgb(106, 81, 31); font-family: &quot;Nunito&quot;, system-ui, sans-serif; font-size: 12px; font-weight: 800; cursor: pointer; opacity: 1; box-shadow: none; transition: background 120ms ease-out, box-shadow 120ms ease-out, opacity 120ms ease-out; white-space: nowrap;" aria-haspopup="dialog" aria-expanded="false">Filters<span style="display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border: 1px solid rgb(200, 184, 154); border-radius: 8px; background: rgb(250, 246, 239); color: rgb(156, 128, 104); font-family: &quot;Nunito&quot;, system-ui, sans-serif; font-size: 10px; font-weight: 800; line-height: 1.2; white-space: nowrap;">2</span></button>',
    opened: '<button type="button" class="oc-m-press sf-btn" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-height: 40px; padding: 8px 12px; border: 1px solid rgb(201, 162, 76); border-radius: 4px; --sf-btn-bg: #F3E7C6; color: rgb(106, 81, 31); font-family: &quot;Nunito&quot;, system-ui, sans-serif; font-size: 12px; font-weight: 800; cursor: pointer; opacity: 1; box-shadow: none; transition: background 120ms ease-out, box-shadow 120ms ease-out, opacity 120ms ease-out; white-space: nowrap;" aria-haspopup="dialog" aria-expanded="true">Filters<span style="display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border: 1px solid rgb(200, 184, 154); border-radius: 8px; background: rgb(250, 246, 239); color: rgb(156, 128, 104); font-family: &quot;Nunito&quot;, system-ui, sans-serif; font-size: 10px; font-weight: 800; line-height: 1.2; white-space: nowrap;">2</span></button><div role="presentation" style="position: fixed; inset: 0px; z-index: 300; display: flex; flex-direction: column; justify-content: flex-end; background: rgba(27, 20, 8, 0.46);"><section role="dialog" aria-modal="true" aria-labelledby="_ID_" tabindex="-1" style="width: 100%; max-height: 85vh; display: flex; flex-direction: column; border-top: 1px solid rgb(200, 184, 154); border-top-left-radius: 8px; border-top-right-radius: 8px; background: rgb(255, 251, 245); box-shadow: 0 12px 32px rgba(27,20,8,0.18); animation: sf-sheet-up 180ms ease-out;"><header style="display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-bottom: 1px solid rgb(200, 184, 154); background: rgb(250, 246, 239); border-top-left-radius: 8px; border-top-right-radius: 8px;"><h2 id="_ID_" style="flex: 1 1 0%; min-width: 0px; margin: 0px; color: rgb(27, 20, 8); font-family: &quot;Nunito&quot;, system-ui, sans-serif; font-size: 15px; line-height: 1.25; font-weight: 900;">Filter settlements</h2><button type="button" aria-label="Close" style="border: medium; background: transparent; color: rgb(156, 128, 104); cursor: pointer; min-width: 44px; min-height: 44px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;"><span aria-hidden="true" style="font-size: 17px; line-height: 1; font-weight: 700; color: rgb(74, 59, 34);">×</span></button></header><div style="overflow-y: auto; padding: 16px 16px calc(16px + env(0px * , * safe-area-inset-bottom));"><p>Sheet body</p></div></section></div>',
  }),
});

const noop = () => {};

/** CausalityPopup.jsx's exact prop set, the desktop consumer this packet must not move. */
const popupOf = (props) => (
  <PortablePopup open title="Why this happened" onClose={noop} testId="causality-popup" {...props}>
    <p>The road failed.</p>
  </PortablePopup>
);

/** GalleryFilterShell.jsx's exact prop set. */
const galleryOf = (props) => (
  <BottomSheet title="Filters" triggerLabel="Filters" count={2} fullWidthTrigger {...props}>
    <p>Sheet body</p>
  </BottomSheet>
);

/** LibraryToolbar.jsx's exact prop set, count 2 so the distinguishing gold arm is the one drawn. */
const libraryOf = (props) => (
  <BottomSheet title="Filter settlements" triggerLabel="Filters" count={2} triggerVariant="gold" {...props}>
    <p>Sheet body</p>
  </BottomSheet>
);

/** The sheet owns its open state, so the arm clicks the trigger to reach the dialog. */
const openSheet = (container) => fireEvent.click(container.querySelector('button'));

/** Every .js/.jsx leaf under src/, read once per arm that scans. */
const srcFiles = (dir = join(ROOT, 'src'), out = []) => {
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry);
    if (statSync(abs).isDirectory()) srcFiles(abs, out);
    else if (/\.(?:js|jsx)$/.test(entry)) out.push(abs);
  }
  return out;
};

/** The pin's reading: the exact set of src leaves whose text carries a name. */
const filesNaming = (needle) => srcFiles()
  .filter((abs) => readFileSync(abs, 'utf8').includes(needle))
  .map((abs) => relative(ROOT, abs).replace(/\\/g, '/'))
  .sort();

/** The colour literals a file spells for itself: a '#' colour or an rgba(). */
const colourLiteralsIn = (rel) => {
  const source = readFileSync(join(ROOT, rel), 'utf8');
  return [...source.matchAll(/#[0-9a-fA-F]{3,8}\b|rgba\([^)]*\)/g)].map((m) => m[0]).sort();
};

/** The §934.31 door, read off the rendered surface rather than off the walker's verdict. */
const doorFacts = (container) => {
  const dialog = container.querySelector('[role="dialog"]');
  const closers = [...container.querySelectorAll('button')]
    .map((b) => b.getAttribute('aria-label') || b.textContent)
    .filter((name) => String(name).includes('Close'));
  return {
    dialog: Boolean(dialog),
    ariaModal: dialog && dialog.getAttribute('aria-modal'),
    closers: closers.length,
  };
};

describe('the editor halo is an optional prop on two shared primitives', () => {
  afterEach(() => cleanup());

  it('A1 the desktop popup is byte-identical to its pre-change capture when the prop is absent', () => {
    const { container } = render(popupOf({}));
    expect(container.innerHTML).toBe(CAPTURE.popup);
  });

  it('A2a the phone sheet is byte-identical for the gallery consumer, closed and opened, when the prop is absent', () => {
    const { container } = render(galleryOf({}));
    expect(normalizeId(container.innerHTML)).toBe(CAPTURE.sheetGallery.closed);
    openSheet(container);
    expect(normalizeId(container.innerHTML)).toBe(CAPTURE.sheetGallery.opened);
    const dialog = container.querySelector('[role="dialog"]');
    const heading = container.querySelector('h2');
    expect(dialog.getAttribute('aria-labelledby')).toBe(heading.getAttribute('id'));
  });

  it('A2b the phone sheet is byte-identical for the library consumer, closed and opened, when the prop is absent', () => {
    const { container } = render(libraryOf({}));
    expect(normalizeId(container.innerHTML)).toBe(CAPTURE.sheetLibrary.closed);
    openSheet(container);
    expect(normalizeId(container.innerHTML)).toBe(CAPTURE.sheetLibrary.opened);
    const dialog = container.querySelector('[role="dialog"]');
    const heading = container.querySelector('h2');
    expect(dialog.getAttribute('aria-labelledby')).toBe(heading.getAttribute('id'));
  });

  it('A3 the halo lit on the desktop popup wears the ground, the bloom and the gold rim, and the plate still carries box-shadow none', () => {
    const { container } = render(popupOf({ editorHalo: true }));
    const scrim = container.querySelector('[data-testid="causality-popup-scrim"]');
    const plate = container.querySelector('[data-testid="causality-popup"]');
    expect(scrim.style.background).toBe(EDITOR_GROUND);
    expect(scrim.style.backgroundImage).toBe(cssValue('backgroundImage', houseBloom(PARCH_100)));
    expect(scrim.style.backgroundRepeat).toBe('no-repeat');
    expect(scrim.getAttribute('class')).toBe('oc-m-warmdim');
    expect(plate.style.border).toBe(cssValue('border', `1px solid ${GOLD}`));
    expect(plate.style.boxShadow).toBe('none');
  });

  it('A4 the halo lit on the phone sheet is the top edge glow with the gold rim, and the sheet still carries its shipped elevation', () => {
    const { container } = render(galleryOf({ editorHalo: true }));
    openSheet(container);
    const scrim = container.querySelector('[role="presentation"]');
    const sheet = container.querySelector('[role="dialog"]');
    expect(scrim.getAttribute('class')).toBe('oc-m-warmdim');
    expect(scrim.style.background).toBe(EDITOR_GROUND);
    expect(scrim.style.backgroundImage).toBe(cssValue('backgroundImage', houseBloom(PARCH_100)));
    expect(scrim.style.backgroundPosition).toBe('center bottom');
    expect(sheet.style.borderTop).toBe(cssValue('borderTop', `1px solid ${GOLD}`));
    expect(sheet.style.boxShadow).toBe(cssValue('boxShadow', ELEV[3]));
  });

  it('A5 the two primitives spell exactly the two colour literals they already spelled, and no new one', () => {
    expect(colourLiteralsIn(POPUP_REL)).toEqual(['rgba(27,20,8,0.58)']);
    expect(colourLiteralsIn(SHEET_REL)).toEqual(['rgba(27,20,8,0.46)']);
  });

  it('A6 the halo pin holds in both directions and the dialog door is unmoved in both branches', () => {
    expect(filesNaming('editorHalo')).toEqual([SHEET_REL, POPUP_REL].sort());
    expect(filesNaming('EDITOR_GROUND')).toEqual([SHEET_REL, POPUP_REL, 'src/components/theme.js'].sort());
    expect(filesNaming('houseBloom')).toEqual(
      ['src/components/nav/ArrowControl.jsx', 'src/components/theme.js', SHEET_REL, POPUP_REL].sort(),
    );
    expect(readFileSync(join(ROOT, POPUP_REL), 'utf8')).toContain('useDialogFocusTrap(open, onClose)');
    expect(readFileSync(join(ROOT, SHEET_REL), 'utf8')).toContain('useDialogFocusTrap(open, close)');

    const dark = render(popupOf({}));
    expect(doorFacts(dark.container)).toEqual({ dialog: true, ariaModal: 'true', closers: 1 });
    cleanup();
    const litPopup = render(popupOf({ editorHalo: true }));
    expect(doorFacts(litPopup.container)).toEqual({ dialog: true, ariaModal: 'true', closers: 1 });
    cleanup();
    const darkSheet = render(galleryOf({}));
    openSheet(darkSheet.container);
    expect(doorFacts(darkSheet.container)).toEqual({ dialog: true, ariaModal: 'true', closers: 1 });
    cleanup();
    const litSheet = render(galleryOf({ editorHalo: true }));
    openSheet(litSheet.container);
    expect(doorFacts(litSheet.container)).toEqual({ dialog: true, ariaModal: 'true', closers: 1 });
  });

  it('the lit renders differ from all three captures and the difference carries the forge gold', () => {
    const goldRim = cssValue('border', `1px solid ${GOLD}`);
    const houseRim = cssValue('border', `1px solid ${BORDER}`);

    const popup = render(popupOf({ editorHalo: true })).container.innerHTML;
    expect(popup).toContain(`border: ${goldRim};`);
    expect(CAPTURE.popup).toContain(`border: ${houseRim};`);
    expect(popup === CAPTURE.popup).toBe(false);
    cleanup();

    const gallery = render(galleryOf({ editorHalo: true }));
    openSheet(gallery.container);
    const galleryLit = normalizeId(gallery.container.innerHTML);
    expect(galleryLit).toContain(EDITOR_GROUND);
    expect(galleryLit === CAPTURE.sheetGallery.opened).toBe(false);
    cleanup();

    const library = render(libraryOf({ editorHalo: true }));
    openSheet(library.container);
    const libraryLit = normalizeId(library.container.innerHTML);
    expect(libraryLit).toContain(EDITOR_GROUND);
    expect(libraryLit === CAPTURE.sheetLibrary.opened).toBe(false);
  });
});
