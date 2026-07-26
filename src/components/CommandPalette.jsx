/**
 * CommandPalette — the DM's cmd/ctrl-K jump bar.
 *
 * Power-DM speed: one chord, type a few letters, land on any page, any saved
 * settlement, or any figure within one. Keyboard-first (arrows move, Enter opens,
 * Escape closes via the shared focus trap), following the aria-combobox pattern
 * the Compendium's global search already speaks.
 *
 * Lazy by construction: the whole body loads only when the host opens it, so its
 * bytes never ride the first-paint closure — only the host's tiny key listener is
 * eager. All navigation goes through the single navigate() chokepoint; a figure
 * jumps to its owning settlement (there is no per-NPC route). Flat plate, theme
 * tokens only (kill-list flat-plate doctrine); the copy keeps the house register.
 */
import { useState, useEffect, useMemo } from 'react';
import { useStore } from '../store/index.js';
import { ROUTES } from '../lib/routes.js';
import { navigate } from '../hooks/useRoute.js';
import { saves as savesService } from '../lib/saves.js';
import { t } from '../copy/index.js';
import Button from './primitives/Button.jsx';
import { useDialogFocusTrap } from './primitives/useDialogFocusTrap.js';
import { GOLD, INK, BODY, MUTED, BORDER, CARD, PARCH, sans, FS, SP } from './theme.js';
import { captureSavedSettlementsHydration } from '../store/savedSettlementsHydration.js';

// Routes surfaced as jump targets: the primary nav plus a few deep pages a DM
// reaches often. Elevated-only (admin) is withheld; navigation's own guards still
// apply on landing, so an auth page redirects rather than misleads.
const DEST_EXTRA = new Set(['account', 'pricing', 'founders']);

function buildItems(savedSettlements) {
  const out = [];
  for (const r of ROUTES) {
    if (r.guard === 'elevated') continue;
    if (!(r.nav || DEST_EXTRA.has(r.view))) continue;
    out.push({ id: `route:${r.view}`, label: r.nav?.label || r.title, hint: 'Page', page: true, run: () => navigate(r.view) });
  }
  for (const save of savedSettlements || []) {
    const id = save?.id || save?.settlement?.id;
    const name = save?.name || save?.settlement?.name;
    if (!id || !name) continue;
    const go = () => navigate('settlements', { params: { id: String(id) } });
    out.push({ id: `set:${id}`, label: name, hint: 'Settlement', run: go });
    const npcs = save?.settlement?.npcs || [];
    npcs.forEach((npc, i) => {
      if (!npc?.name) return;
      out.push({ id: `npc:${id}:${npc?.id || i}`, label: npc.name, hint: name, run: go });
    });
  }
  return out;
}

export default function CommandPalette({ onClose }) {
  const dialogRef = useDialogFocusTrap(true, onClose);
  const savedSettlements = useStore((s) => s.savedSettlements);
  const savedSettlementsLoaded = useStore((s) => s.savedSettlementsLoaded);
  const setSavedSettlements = useStore((s) => s.setSavedSettlements);
  const authUserId = useStore((s) => s.auth?.user?.id ?? null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const listId = 'cmdk-results';

  // The library may be cold when the palette opens (e.g. straight from /create):
  // hydrate it once so settlements + figures are searchable, using the same idiom
  // the map uses. The store is the source of truth; skip if already loaded.
  useEffect(() => {
    if (savedSettlementsLoaded) return undefined;
    let cancelled = false;
    const hydration = captureSavedSettlementsHydration(useStore.getState(), authUserId);
    if (!hydration) return undefined;
    savesService.list()
      .then((list) => {
        if (cancelled) return;
        setSavedSettlements(list || [], hydration);
      })
      .catch(() => {
        // The palette is optional navigation chrome. The Library owns visible
        // load errors, so a failed background warm-up leaves current results alone.
      });
    return () => {
      cancelled = true;
    };
  }, [authUserId, savedSettlementsLoaded, setSavedSettlements]);

  const items = useMemo(() => buildItems(savedSettlements), [savedSettlements]);
  const q = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!q) return items.filter((it) => it.page).slice(0, 12);
    const scored = [];
    for (const it of items) {
      const idx = it.label.toLowerCase().indexOf(q);
      if (idx === -1) continue;
      scored.push({ it, rank: idx === 0 ? 0 : 1 });
    }
    // Stable rank sort; codepoint order for ties (no locale — deterministic).
    scored.sort((a, b) => a.rank - b.rank || (a.it.label < b.it.label ? -1 : a.it.label > b.it.label ? 1 : 0));
    return scored.slice(0, 12).map((s) => s.it);
  }, [q, items]);

  const choose = (it) => { if (!it) return; onClose(); it.run(); };

  // The active row, CLAMPED into the live results range on every render (SB5).
  // `active` can go stale against `results`: results hydrate asynchronously
  // (cold library) and shrink as the query narrows, so the raw state may sit at
  // -1 or past the end — which used to point aria-activedescendant at a
  // dangling id ('cmdk-opt--1') and make Enter a silent no-op.
  const activeIdx = results.length === 0 ? -1 : Math.min(Math.max(active, 0), results.length - 1);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (results.length) setActive(Math.min(activeIdx + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (results.length) setActive(Math.max(activeIdx - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (activeIdx >= 0) choose(results[activeIdx]); }
    // Escape is handled by the shared focus trap (onCancel = onClose).
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- backdrop click-to-close; Escape handled by useDialogFocusTrap.
    <div
      onClick={onClose}
      className="oc-m-warmdim"
      style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}
    >
      {/* Clicks stop here so the backdrop's click-to-close never fires from inside
          the plate. Keydown deliberately does NOT stop: the shared focus trap
          (Escape + Tab cycling) and the host's cmd/ctrl-K toggle both listen on
          window, so a blanket stopPropagation would keyboard-trap the dialog
          (WCAG 2.1.2) — background keymaps already go quiet on their own by
          checking for an open [role="dialog"][aria-modal="true"]. */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events -- the onClick is a propagation fence for the backdrop, not an interaction; keyboard behavior lives in the window-level trap. */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={t('palette.dialogLabel')}
        style={{
          background: CARD, border: `1px solid ${BORDER}`,
          width: '92%', maxWidth: 560, marginTop: '12vh',
          display: 'flex', flexDirection: 'column', maxHeight: '70vh',
        }}
      >
        <div style={{ padding: SP.sm, background: PARCH, borderBottom: `1px solid ${BORDER}` }}>
          <input
            value={query}
            /* eslint-disable-next-line jsx-a11y/no-autofocus -- a command palette exists to receive typing the instant it opens. */
            autoFocus
            onChange={(e) => { setQuery(e.target.value); setActive(0); }}
            onKeyDown={onKeyDown}
            placeholder={t('palette.placeholder')}
            aria-label={t('palette.inputLabel')}
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls={listId}
            aria-activedescendant={activeIdx >= 0 ? `cmdk-opt-${activeIdx}` : undefined}
            autoComplete="off"
            style={{
              width: '100%', boxSizing: 'border-box', border: `1px solid ${BORDER}`,
              background: CARD, padding: '10px 12px',
              fontFamily: sans, fontSize: FS.md, color: INK, outline: 'none',
            }}
          />
        </div>

        {results.length > 0 ? (
          <div id={listId} role="listbox" aria-label={t('palette.resultsLabel')} style={{ padding: SP.xs, overflowY: 'auto' }}>
            {/* Each option IS the interactive element (SB5): role="option" rides
                the Button itself — ARIA forbids interactive descendants inside an
                option, and a wrapper-div option over a tabbable button made every
                row a tab stop, breaking the single-tab-stop combobox model. The
                options rove via aria-activedescendant instead (tabIndex -1; the
                shared trap skips non-sequentially-focusable elements). */}
            {results.map((it, i) => (
              <Button
                key={it.id}
                id={`cmdk-opt-${i}`}
                role="option"
                aria-selected={i === activeIdx}
                tabIndex={-1}
                variant="ghost"
                size="sm"
                fullWidth
                aria-label={it.page ? t('palette.goTo', { label: it.label }) : it.label}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(it)}
                style={{ justifyContent: 'flex-start', gap: SP.sm, background: i === activeIdx ? PARCH : 'transparent' }}
              >
                <span style={{ flex: 1, minWidth: 0, color: INK, fontSize: FS.sm, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {it.label}
                </span>
                <span style={{ color: it.page ? GOLD : MUTED, fontSize: FS.xxs, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                  {it.page ? t('palette.pageHint') : it.hint}
                </span>
              </Button>
            ))}
          </div>
        ) : (
          <div style={{ padding: `${SP.lg}px ${SP.md}px`, color: BODY, fontFamily: sans, fontSize: FS.sm, lineHeight: 1.5 }}>
            {q ? t('palette.emptyNoMatch') : t('palette.emptyPrompt')}
          </div>
        )}
      </div>
    </div>
  );
}
