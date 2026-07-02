/**
 * GalleryDescriptionEditor — lightweight rich-text editor for gallery
 * descriptions (§4c). Contenteditable + a small formatting toolbar
 * (bold/italic/underline, heading, bulleted/numbered list, link, clear).
 * Every change is run through sanitizeGalleryHtml before it leaves the
 * component, so the stored value is always safe HTML. Uncontrolled body
 * (innerHTML seeded once) to avoid caret jumps; emits sanitized HTML.
 *
 * Links use an inline URL field (no native window.prompt — banned project-wide),
 * saving + restoring the editor selection so the URL applies to the chosen text.
 */
import { useRef, useEffect, useState } from 'react';
import { Bold, Italic, Underline, Heading, List, ListOrdered, Link2, Eraser, Check, X } from 'lucide-react';

import { sanitizeGalleryHtml } from '../lib/sanitizeGalleryHtml.js';
import { AMBER_DEEP, BORDER2, CARD, CARD_ALT, INK, MUTED, R, FS, sans } from './theme.js';
import IconButton from './primitives/IconButton.jsx';

const exec = (cmd, value = null) => {
  try { document.execCommand(cmd, false, value); } catch { /* command unsupported */ }
};

// Visible-text length of a sanitized HTML string — the cap counts what the
// reader SEES, not the markup. A link or a styled run shouldn't burn the budget
// on its tags. Parse through a detached element so we read textContent off the
// same fragment DOMPurify produced; degrade to a markup-stripped string when
// there's no DOM (worker/SSR), matching sanitizeGalleryHtml's fail-safe.
function visibleText(html) {
  if (!html) return '';
  if (typeof document !== 'undefined') {
    const box = document.createElement('div');
    box.innerHTML = html;
    return box.textContent || '';
  }
  return String(html).replace(/<[^>]*>/g, '');
}

// Trim a sanitized fragment down to maxLength VISIBLE characters without cutting
// mid-tag: shave whole trailing text nodes, then the final node char-by-char,
// until the visible budget fits. Re-sanitize the result so any node we emptied
// is re-balanced. Returns the original when it already fits.
function capVisible(clean, maxLength) {
  if (typeof document === 'undefined') {
    // DOM-less fallback: slice the stripped text and re-sanitize (no markup to keep).
    const text = visibleText(clean);
    return text.length > maxLength ? sanitizeGalleryHtml(text.slice(0, maxLength)) : clean;
  }
  const box = document.createElement('div');
  box.innerHTML = clean;
  if ((box.textContent || '').length <= maxLength) return clean;
  const walker = document.createTreeWalker(box, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) textNodes.push(n);
  let remaining = maxLength;
  for (const node of textNodes) {
    const len = node.textContent.length;
    if (len <= remaining) { remaining -= len; continue; }
    node.textContent = node.textContent.slice(0, remaining);
    remaining = 0;
  }
  return sanitizeGalleryHtml(box.innerHTML);
}

function ToolbarButton({ icon: Icon, title, onMouseDown }) {
  // Icon-only toolbar control: design-system IconButton (default tone ≈ card
  // bg + border, md size for the ~13px icon). title becomes the required
  // aria-label; onMouseDown passes through via ...rest (kept so execCommand
  // applies to the live selection instead of blurring first).
  return <IconButton Icon={Icon} label={title} size="md" tone="default" onMouseDown={onMouseDown} />;
}

export default function GalleryDescriptionEditor({ value = '', onChange, maxLength = 4000 }) {
  const ref = useRef(null);
  const savedRange = useRef(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkOpen, setLinkOpen] = useState(false);
  // Live VISIBLE-text count for the N/maxLength readout below the editable.
  const [used, setUsed] = useState(() => visibleText(sanitizeGalleryHtml(value || '')).length);

  // Seed the editable once; thereafter it's uncontrolled (sanitized on emit).
  useEffect(() => {
    if (ref.current) ref.current.innerHTML = sanitizeGalleryHtml(value || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emit = () => {
    const raw = ref.current?.innerHTML || '';
    // Cap against VISIBLE text, not markup: a description that's mostly tags
    // (links, styled runs) shouldn't be silently cut short by its HTML length.
    // We sanitize first, measure textContent, and — when over — trim whole
    // trailing text nodes (never mid-tag), re-sanitizing so the stored value
    // stays well-formed. The counter reflects the same visible measure.
    let clean = sanitizeGalleryHtml(raw);
    const capped = capVisible(clean, maxLength);
    // WYSIWYG: when the cap actually trimmed the value, write the trimmed HTML
    // back into the editable so the user isn't left wordsmithing a tail that's
    // already gone from the emitted draft. Only touch the DOM on a real change
    // (over-cap) so the common under-cap path never disturbs the caret; on the
    // trim path the removed text is the trailing overflow, so parking the caret
    // at the end is the natural resting spot.
    if (capped !== clean && ref.current) {
      ref.current.innerHTML = capped;
      const sel = typeof window !== 'undefined' ? window.getSelection() : null;
      if (sel && typeof document !== 'undefined') {
        const range = document.createRange();
        range.selectNodeContents(ref.current);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
    clean = capped;
    setUsed(visibleText(clean).length);
    onChange?.(clean);
  };

  // mousedown + preventDefault keeps the selection inside the editable so
  // execCommand applies to it rather than blurring first.
  const cmd = (e, command, val) => { e.preventDefault(); exec(command, val); emit(); };

  const saveSelection = () => {
    const sel = typeof window !== 'undefined' ? window.getSelection() : null;
    if (sel && sel.rangeCount && ref.current && ref.current.contains(sel.anchorNode)) {
      savedRange.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const openLink = (e) => { e.preventDefault(); saveSelection(); setLinkUrl(''); setLinkOpen(true); };

  const applyLink = () => {
    const url = linkUrl.trim();
    setLinkOpen(false);
    if (!url) return;
    const sel = typeof window !== 'undefined' ? window.getSelection() : null;
    if (savedRange.current && sel) { sel.removeAllRanges(); sel.addRange(savedRange.current); }
    ref.current?.focus();
    exec('createLink', url);
    emit();
  };

  return (
    <div style={{ border: `1px solid ${BORDER2}`, borderRadius: R.md, background: CARD, overflow: 'hidden' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, padding: 5, background: CARD_ALT, borderBottom: `1px solid ${BORDER2}`, alignItems: 'center' }}>
        <ToolbarButton icon={Bold} title="Bold" onMouseDown={(e) => cmd(e, 'bold')} />
        <ToolbarButton icon={Italic} title="Italic" onMouseDown={(e) => cmd(e, 'italic')} />
        <ToolbarButton icon={Underline} title="Underline" onMouseDown={(e) => cmd(e, 'underline')} />
        <ToolbarButton icon={Heading} title="Heading" onMouseDown={(e) => cmd(e, 'formatBlock', 'h3')} />
        <ToolbarButton icon={List} title="Bulleted list" onMouseDown={(e) => cmd(e, 'insertUnorderedList')} />
        <ToolbarButton icon={ListOrdered} title="Numbered list" onMouseDown={(e) => cmd(e, 'insertOrderedList')} />
        <ToolbarButton icon={Link2} title="Add link" onMouseDown={openLink} />
        <ToolbarButton icon={Eraser} title="Clear formatting" onMouseDown={(e) => cmd(e, 'removeFormat')} />
        {linkOpen && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginLeft: 4 }}>
            <input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); applyLink(); }
                if (e.key === 'Escape') setLinkOpen(false);
              }}
              placeholder="https://…"
              aria-label="Link URL"
              // eslint-disable-next-line jsx-a11y/no-autofocus -- focus the URL field when the link popover opens so the user can type immediately
              autoFocus
              style={{ width: 150, border: `1px solid ${BORDER2}`, borderRadius: R.sm, padding: '2px 6px', fontFamily: sans, fontSize: FS.xxs, color: INK }}
            />
            <ToolbarButton icon={Check} title="Apply link" onMouseDown={(e) => { e.preventDefault(); applyLink(); }} />
            <ToolbarButton icon={X} title="Cancel" onMouseDown={(e) => { e.preventDefault(); setLinkOpen(false); }} />
          </span>
        )}
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label="Gallery description"
        onInput={emit}
        onBlur={emit}
        style={{ minHeight: 80, maxHeight: 220, overflowY: 'auto', padding: 9, fontFamily: sans, fontSize: FS.xs, color: INK, lineHeight: 1.5, outline: 'none' }}
      />
      {/* Live visible-character readout + soft warning at the cap. Counts what
          the reader sees (not markup), so the number matches what's trimmed. */}
      <div
        aria-live="polite"
        style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, padding: '4px 9px', borderTop: `1px solid ${BORDER2}`, background: CARD_ALT, fontFamily: sans, fontSize: FS.xxs }}
      >
        {used >= maxLength && (
          <span style={{ color: AMBER_DEEP, fontWeight: 700 }}>
            At the {maxLength}-character limit — trimmed to fit.
          </span>
        )}
        <span style={{ color: used >= maxLength ? AMBER_DEEP : MUTED, fontWeight: 700 }}>
          {used}/{maxLength}
        </span>
      </div>
    </div>
  );
}
